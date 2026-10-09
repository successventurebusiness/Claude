"""Procedural sound-effect library for the promo video.

Every effect is synthesized from scratch (no samples), so the output is
original and royalty-free. Run:

    python3 audio/sfx.py            # writes public/sfx/*.wav
    python3 audio/sfx.py --only pop whoosh
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import soundfile as sf
from pedalboard import (
    Bitcrush,
    Compressor,
    HighpassFilter,
    HighShelfFilter,
    LowpassFilter,
    Pedalboard,
    Reverb,
)
from scipy.signal import butter, sosfilt

SR = 48000
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers

def t_axis(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR)) / SR


def env_adsr(n: int, a: float, d: float, s: float, r: float) -> np.ndarray:
    """Attack/decay/release in seconds, sustain level 0..1."""
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(n - a_n - d_n - r_n, 0)
    e = np.concatenate([
        np.linspace(0, 1, a_n, endpoint=False) ** 2,
        np.linspace(1, s, d_n, endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, r_n) ** 1.5,
    ])
    return np.pad(e, (0, max(n - len(e), 0)))[:n]


def exp_decay(n: int, tau: float) -> np.ndarray:
    return np.exp(-np.arange(n) / (tau * SR))


def sweep_phase(f0: float, f1: float, n: int, curve: float = 1.0) -> np.ndarray:
    """Phase of a sine sweeping f0 -> f1 (exponential-ish when curve != 1)."""
    x = np.linspace(0, 1, n) ** curve
    freq = f0 * (f1 / f0) ** x
    return 2 * np.pi * np.cumsum(freq) / SR


def bandpass_sweep(noise: np.ndarray, f_lo: np.ndarray, q: float = 1.2,
                   block: int = 256) -> np.ndarray:
    """Time-varying band-pass over noise, centre frequency per sample."""
    out = np.zeros_like(noise)
    for i in range(0, len(noise), block):
        fc = float(np.clip(f_lo[i], 40, SR / 2.3))
        bw = fc / q
        lo, hi = max(fc - bw / 2, 20), min(fc + bw / 2, SR / 2.1)
        sos = butter(2, [lo, hi], btype="band", fs=SR, output="sos")
        seg = noise[max(i - 2048, 0): i + block]
        out[i: i + block] = sosfilt(sos, seg)[-len(noise[i: i + block]):]
    return out


def pan(mono: np.ndarray, position: np.ndarray | float) -> np.ndarray:
    """Equal-power pan, position -1 (L) .. 1 (R). Returns (n, 2)."""
    p = np.broadcast_to(position, mono.shape)
    ang = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(ang), mono * np.sin(ang)], axis=1)


def widen(mono: np.ndarray, ms: float = 11.0) -> np.ndarray:
    """Cheap Haas-style stereo width."""
    d = int(ms / 1000 * SR)
    right = np.concatenate([np.zeros(d), mono[:-d]]) if d else mono
    return np.stack([mono, 0.85 * right + 0.15 * mono], axis=1)


def fx(x: np.ndarray, *plugins, tail: float = 1.5) -> np.ndarray:
    """Run (n, ch) audio through a pedalboard chain, leaving room for tails."""
    x = np.concatenate([x, np.zeros((int(tail * SR), x.shape[1]))])
    board = Pedalboard(list(plugins))
    return board(x.T.astype(np.float32), SR).T


def finish(x: np.ndarray, peak_db: float = -1.0, tail: float = 0.0) -> np.ndarray:
    """Soft-clip, normalise to peak_db and trim trailing silence."""
    if x.ndim == 1:
        x = widen(x, 0)
    x = np.tanh(1.2 * x / (np.abs(x).max() + 1e-12)) / np.tanh(1.2)
    x *= 10 ** (peak_db / 20)
    # trim trailing silence, 10 ms fade-out to avoid clicks
    level = np.abs(x).max(axis=1)
    idx = np.nonzero(level > 10 ** (-70 / 20))[0]
    x = x[: (idx[-1] + 1) if len(idx) else len(x)]
    fade = min(int(0.01 * SR), len(x))
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return x


def room(size=0.45, wet=0.22, damping=0.5, width=1.0):
    return Reverb(room_size=size, wet_level=wet, dry_level=1 - wet * 0.6,
                  damping=damping, width=width)


# ---------------------------------------------------------------- effects

def whoosh(dur=0.9, f0=300, f1=4500, peak=0.55, pan_from=-0.8, pan_to=0.8):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    x = np.linspace(0, 1, n)
    # centre frequency rises then falls slightly: air rushing past
    fc = f0 * (f1 / f0) ** np.sin(np.pi * np.clip(x / (peak * 2), 0, 1) / 2)
    body = bandpass_sweep(noise, fc, q=1.4)
    shape = np.where(x < peak, (x / peak) ** 2.2, ((1 - x) / (1 - peak)) ** 1.6)
    body *= shape
    # faint tonal "whistle" layer
    whistle = 0.04 * np.sin(sweep_phase(f0 * 2, f1 * 0.7, n)) * shape
    st = pan(body + whistle, np.linspace(pan_from, pan_to, n))
    st = fx(st, HighpassFilter(120), room(0.5, 0.25))
    return finish(st, -2, tail=0.4)


def whoosh_fast():
    return whoosh(dur=0.45, f0=500, f1=7000, peak=0.5)


def whoosh_deep():
    return whoosh(dur=1.3, f0=120, f1=2200, peak=0.6, pan_from=0.6, pan_to=-0.6)


def riser(dur=2.4):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    noise = rng.standard_normal(n)
    air = bandpass_sweep(noise, 400 * (9000 / 400) ** (x ** 1.5), q=0.9) * x ** 2.5
    # detuned saw-ish tone rising an octave and a half
    tone = sum(
        np.sin(k * sweep_phase(110 * d, 330 * d, n, 1.6)) / k
        for d in (1.0, 1.006, 0.994) for k in (1, 2, 3, 4)
    ) * 0.09 * x ** 2
    trem = 1 + 0.25 * np.sin(2 * np.pi * np.cumsum(2 + 18 * x ** 2) / SR)
    st = widen((air + tone) * trem, 13)
    st = fx(st, HighpassFilter(150), room(0.7, 0.3))
    return finish(st, -2, tail=0.6)


def impact():
    t = t_axis(2.2)
    n = len(t)
    sub = np.sin(sweep_phase(140, 38, n, 0.35)) * exp_decay(n, 0.42)
    click = rng.standard_normal(n) * exp_decay(n, 0.012)
    click = sosfilt(butter(2, 2500, "low", fs=SR, output="sos"), click)
    crack = rng.standard_normal(n) * exp_decay(n, 0.09)
    crack = sosfilt(butter(2, [700, 6000], "band", fs=SR, output="sos"), crack)
    st = widen(1.0 * sub + 0.7 * click + 0.35 * crack, 9)
    st = fx(st, Compressor(-18, 4, 2, 120), room(0.85, 0.28, 0.6))
    return finish(st, -0.8)


def sub_drop():
    t = t_axis(2.5)
    n = len(t)
    x = np.sin(sweep_phase(90, 28, n, 0.6))
    x = np.tanh(2.2 * x) * env_adsr(n, 0.005, 0.3, 0.7, 1.6)
    return finish(fx(widen(x, 0), LowpassFilter(400)), -1)


def pop(freq=520):
    n = int(0.18 * SR)
    body = np.sin(sweep_phase(freq * 2.3, freq, n, 0.25)) * exp_decay(n, 0.035)
    snap = rng.standard_normal(n) * exp_decay(n, 0.002) * 0.25
    st = widen(body + snap, 4)
    st = fx(st, HighpassFilter(180), room(0.25, 0.15))
    return finish(st, -3, tail=0.15)


def pop_high():
    return pop(880)


def click():
    n = int(0.06 * SR)
    x = rng.standard_normal(n) * exp_decay(n, 0.0018)
    x = sosfilt(butter(2, [1800, 9000], "band", fs=SR, output="sos"), x)
    x += 0.4 * np.sin(2 * np.pi * 3200 * t_axis(0.06)) * exp_decay(n, 0.004)
    return finish(fx(widen(x, 2), room(0.2, 0.1)), -4, tail=0.08)


def tick():
    n = int(0.03 * SR)
    x = np.sin(2 * np.pi * 4200 * t_axis(0.03)) * exp_decay(n, 0.0025)
    return finish(widen(x, 0), -8)


def bell(freqs, dur=1.6, decay=0.5, ratio=3.5, index=1.8):
    """FM bell partials."""
    t = t_axis(dur)
    n = len(t)
    out = np.zeros(n)
    for f, amp in freqs:
        mod = index * exp_decay(n, decay * 0.4) * np.sin(2 * np.pi * f * ratio * t)
        out += amp * np.sin(2 * np.pi * f * t + mod) * exp_decay(n, decay)
    return out * env_adsr(n, 0.002, 0, 1, 0.05)


def ding():
    x = bell([(1318.5, 1.0), (2637, 0.25), (3951, 0.08)], dur=2.0, decay=0.55)
    st = fx(widen(x, 7), HighpassFilter(250), HighShelfFilter(6000, -3), room(0.6, 0.3))
    return finish(st, -3)


def success():
    """Rising major-triad chime (C6 E6 G6 C7)."""
    notes = [1046.5, 1318.5, 1568.0, 2093.0]
    gap = int(0.085 * SR)
    total = np.zeros(gap * len(notes) + int(2.0 * SR))
    for i, f in enumerate(notes):
        b = bell([(f, 1.0), (f * 2, 0.18)], dur=1.8, decay=0.45, ratio=2.0,
                 index=1.1)
        total[i * gap: i * gap + len(b)] += b * (0.75 + 0.08 * i)
    st = pan(total, 0.0)
    st = fx(st, HighpassFilter(250), room(0.7, 0.32), HighShelfFilter(7000, -2))
    return finish(st, -3)


def notification():
    """Two-tone soft blip, like an app notification."""
    seg = []
    for f in (880, 1320):
        n = int(0.12 * SR)
        tone = (np.sin(2 * np.pi * f * t_axis(0.12))
                + 0.3 * np.sin(4 * np.pi * f * t_axis(0.12)))
        seg.append(tone * env_adsr(n, 0.004, 0.03, 0.6, 0.07))
    x = np.concatenate([seg[0], np.zeros(int(0.02 * SR)), seg[1]])
    return finish(fx(widen(x, 6), room(0.4, 0.22)), -4, tail=0.5)


def typing(keys=14, rate=11.0):
    total = np.zeros(int((keys / rate + 0.4) * SR))
    pos = 0
    for k in range(keys):
        n = int(0.05 * SR)
        f = rng.uniform(1600, 2600)
        x = rng.standard_normal(n) * exp_decay(n, 0.004)
        x = sosfilt(butter(2, [f * 0.6, f * 1.6], "band", fs=SR, output="sos"), x)
        thock = np.sin(2 * np.pi * rng.uniform(180, 260) * t_axis(0.05)) * exp_decay(n, 0.01)
        x = (x + 0.5 * thock) * rng.uniform(0.6, 1.0)
        total[pos: pos + n] += x
        pos += int(SR / rate * rng.uniform(0.6, 1.4))
        if pos + n > len(total):
            break
    return finish(fx(widen(total, 3), room(0.2, 0.12)), -5)


def glitch():
    dur = 0.55
    n = int(dur * SR)
    out = np.zeros(n)
    i = 0
    while i < n:
        seg = int(rng.uniform(0.01, 0.05) * SR)
        kind = rng.integers(3)
        tt = np.arange(seg) / SR
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * rng.uniform(80, 1200) * tt))
        elif kind == 1:
            s = rng.standard_normal(seg)
        else:
            s = np.zeros(seg)
        out[i: i + seg] = s[: len(out[i: i + seg])] * rng.uniform(0.3, 0.9)
        i += seg
    out *= env_adsr(n, 0.001, 0.0, 1, 0.08)
    st = pan(out, np.sin(np.linspace(0, 9 * np.pi, n)) * 0.6)
    st = fx(st, Bitcrush(bit_depth=6), HighpassFilter(200), LowpassFilter(9000))
    return finish(st, -6)


def shimmer():
    dur = 1.8
    n = int(dur * SR)
    out = np.zeros(n)
    scale = [2093, 2349, 2637, 3136, 3520, 4186, 4699]  # C major pentatonic-ish
    for _ in range(26):
        start = int(rng.uniform(0, 0.9) * SR)
        f = rng.choice(scale)
        m = int(0.5 * SR)
        g = np.sin(2 * np.pi * f * np.arange(m) / SR) * exp_decay(m, 0.12)
        g *= env_adsr(m, 0.003, 0, 1, 0.05) * rng.uniform(0.15, 0.4)
        out[start: start + m] += g[: len(out[start: start + m])]
    out *= np.linspace(1, 0.3, n)
    st = widen(out, 15)
    st = fx(st, room(0.9, 0.45, 0.3))
    return finish(st, -5)


def swipe():
    """Short UI swipe / slide."""
    return whoosh(dur=0.28, f0=1200, f1=9000, peak=0.35, pan_from=0.5, pan_to=-0.5)


def logo_hit():
    """Layered brand sting: impact + bell + shimmer."""
    a, b, c = impact(), ding(), shimmer()
    n = max(len(a), len(b), len(c))
    mix = np.zeros((n, 2))
    for sig, g in ((a, 0.9), (b, 0.45), (c, 0.4)):
        mix[: len(sig)] += sig * g
    return finish(mix, -0.8)


EFFECTS = {
    "whoosh": whoosh,
    "whoosh_fast": whoosh_fast,
    "whoosh_deep": whoosh_deep,
    "swipe": swipe,
    "riser": riser,
    "impact": impact,
    "sub_drop": sub_drop,
    "pop": pop,
    "pop_high": pop_high,
    "click": click,
    "tick": tick,
    "ding": ding,
    "success": success,
    "notification": notification,
    "typing": typing,
    "glitch": glitch,
    "shimmer": shimmer,
    "logo_hit": logo_hit,
}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="subset of effect names")
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    for name in args.only or EFFECTS:
        audio = EFFECTS[name]()
        path = OUT / f"{name}.wav"
        sf.write(path, audio, SR, subtype="PCM_24")
        print(f"{name:14s} {len(audio) / SR:5.2f}s  peak {20 * np.log10(np.abs(audio).max()):6.1f} dBFS")


if __name__ == "__main__":
    main()
