"""Procedural background-music bed: upbeat, modern "tech product" groove.

Synthesized from scratch (no samples), so it is original and royalty-free.

    python3 audio/music.py --bpm 118 --bars 32 --out public/music/bed.wav

Arrangement (by default, scaled to --bars):
    intro   pad + arp, filtered          (first 1/8)
    build   + bass + hats                 (next 1/8)
    main    full groove with kick/clap    (middle)
    break   pad + arp only, then riser    (1/8)
    finale  full groove                   (1/8)
    outro   pad ring-out                  (last 2 bars)
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import soundfile as sf
from pedalboard import (
    Chorus,
    Compressor,
    HighpassFilter,
    Limiter,
    LowpassFilter,
    Pedalboard,
    Reverb,
)
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(11)

# A-minor-ish uplifting progression: Fmaj7 - G6 - Am7 - Em7 (vi-based pop loop)
PROGRESSIONS = {
    "uplift": [[53, 57, 60, 64], [55, 59, 62, 64], [57, 60, 64, 67], [52, 55, 59, 62]],
    "calm": [[48, 52, 55, 59], [45, 48, 52, 55], [53, 57, 60, 64], [55, 59, 62, 65]],
    "bold": [[45, 48, 52, 57], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]],
}


def mtof(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(freq: float, n: int, detune_cents=(-12, -5, 0, 5, 12)) -> np.ndarray:
    t = np.arange(n) / SR
    out = np.zeros(n)
    for c in detune_cents:
        f = freq * 2 ** (c / 1200)
        ph = (t * f + rng.random()) % 1.0
        out += 2 * ph - 1
    return out / len(detune_cents)


def env(n: int, a: float, r: float) -> np.ndarray:
    e = np.ones(n)
    a_n, r_n = min(int(a * SR), n), min(int(r * SR), n)
    e[:a_n] = np.linspace(0, 1, a_n)
    if r_n:
        e[-r_n:] *= np.linspace(1, 0, r_n)
    return e


def lowpass(x: np.ndarray, fc: float, order: int = 2) -> np.ndarray:
    return sosfilt(butter(order, min(fc, SR / 2.2), "low", fs=SR, output="sos"), x)


def place(buf: np.ndarray, sig: np.ndarray, start: int, gain: float = 1.0) -> None:
    end = min(start + len(sig), len(buf))
    if start < len(buf):
        buf[start:end] += sig[: end - start] * gain


# ------------------------------------------------------------- instruments

def kick() -> np.ndarray:
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
    click = lowpass(rng.standard_normal(n), 4000) * np.exp(-t / 0.004) * 0.4
    return np.tanh(1.6 * (body + click))


def clap() -> np.ndarray:
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    noise = sosfilt(butter(2, [900, 5000], "band", fs=SR, output="sos"),
                    rng.standard_normal(n))
    e = np.exp(-t / 0.06)
    for d in (0.0, 0.011, 0.022):  # three quick flams
        e += 0.6 * np.exp(-np.clip(t - d, 0, None) / 0.006) * (t >= d)
    return noise * e * 0.5


def hat(open_: bool = False) -> np.ndarray:
    n = int((0.25 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    noise = sosfilt(butter(2, 7500, "high", fs=SR, output="sos"), rng.standard_normal(n))
    return noise * np.exp(-t / (0.08 if open_ else 0.012)) * 0.35


def pluck(freq: float, dur: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = saw(freq, n, (-6, 0, 6))
    # decaying filter = "pluck"
    out = np.zeros(n)
    block = 512
    for i in range(0, n, block):
        fc = 300 + 5200 * np.exp(-t[i] / 0.07)
        out[i:i + block] = lowpass(tone[max(i - 1024, 0): i + block], fc)[-len(tone[i:i + block]):]
    return out * np.exp(-t / 0.18) * env(n, 0.002, 0.02)


def bass(freq: float, dur: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * freq * t)
    grit = lowpass(saw(freq, n, (0,)), 700)
    return (0.8 * sub + 0.35 * grit) * env(n, 0.004, 0.03)


def pad(chord, dur: float, cutoff: float) -> np.ndarray:
    n = int(dur * SR)
    out = sum(saw(mtof(m), n) for m in chord) / len(chord)
    out = lowpass(out, cutoff, 2)
    return out * env(n, 0.35, 0.4)


# ------------------------------------------------------------- arrangement

def render(bpm: float, bars: int, mood: str) -> np.ndarray:
    beat = 60 / bpm
    bar = 4 * beat
    n_total = int((bars * bar + 3.0) * SR)
    prog = PROGRESSIONS[mood]

    pads = np.zeros(n_total)
    arps = np.zeros(n_total)
    bas = np.zeros(n_total)
    drums = np.zeros(n_total)
    duck = np.ones(n_total)

    eighth = bars // 8 or 1
    sec = {
        "intro": (0, eighth),
        "build": (eighth, 2 * eighth),
        "main": (2 * eighth, bars - 3 * eighth),
        "break": (bars - 3 * eighth, bars - 2 * eighth),
        "finale": (bars - 2 * eighth, bars - 2),
        "outro": (bars - 2, bars),
    }

    def in_(name, b):
        lo, hi = sec[name]
        return lo <= b < hi

    k, c, h, ho = kick(), clap(), hat(), hat(True)
    duck_shape = 1 - 0.6 * np.exp(-np.arange(int(beat * SR)) / (0.11 * SR))

    for b in range(bars):
        chord = prog[b % len(prog)]
        s = int(b * bar * SR)
        full = in_("main", b) or in_("finale", b)
        building = in_("build", b)
        outro = in_("outro", b)

        cutoff = 900 if in_("intro", b) else 1800 if building or in_("break", b) else 2600
        place(pads, pad(chord, bar + 0.4, cutoff), s)
        if outro:
            continue

        # 16th-note arpeggio over chord tones, two octaves up
        pattern = [0, 2, 1, 3, 2, 0, 3, 1]
        for i in range(16):
            m = chord[pattern[i % 8]] + 12 + (12 if i % 8 >= 4 else 0)
            vel = 0.9 if i % 4 == 0 else 0.6
            place(arps, pluck(mtof(m), beat / 4 * 1.6), s + int(i * beat / 4 * SR), vel)

        if building or full:
            root = chord[0] - 24
            for i in range(8):  # eighth-note driving bass
                place(bas, bass(mtof(root), beat / 2 * 0.9), s + int(i * beat / 2 * SR),
                      1.0 if i % 2 == 0 else 0.75)
            for i in range(4):  # off-beat hats
                place(drums, h, s + int((i + 0.5) * beat * SR), 0.9)
            for i in range(8 if full else 0):
                place(drums, h, s + int(i * beat / 2 * SR), 0.35)

        if full:
            for i in range(4):
                st = s + int(i * beat * SR)
                place(drums, k, st, 1.0)
                duck[st: st + len(duck_shape)] = np.minimum(
                    duck[st: st + len(duck_shape)], duck_shape[: len(duck[st: st + len(duck_shape)])])
                if i in (1, 3):
                    place(drums, c, st, 0.8)
            if b % 4 == 3:
                place(drums, ho, s + int(3.5 * beat * SR), 0.7)

        # noise riser in the last bar of the break into the finale
        if b == sec["break"][1] - 1:
            n = int(bar * SR)
            x = np.linspace(0, 1, n)
            r = sosfilt(butter(2, 2000, "high", fs=SR, output="sos"), rng.standard_normal(n))
            place(drums, r * x ** 3 * 0.25, s)

    # bus processing
    def proc(x, *plugins):
        return Pedalboard(list(plugins))(x.astype(np.float32), SR)

    def st(x, width_ms=12.0):
        d = int(width_ms / 1000 * SR)
        return np.stack([x, np.concatenate([np.zeros(d), x[:-d]])])

    pads_st = proc(st(pads * duck), Chorus(rate_hz=0.3, depth=0.3, mix=0.4),
                   Reverb(room_size=0.85, wet_level=0.3, width=1.0))
    arps_st = proc(st(arps * (0.4 + 0.6 * duck), 7), HighpassFilter(300),
                   Reverb(room_size=0.6, wet_level=0.22, width=1.0))
    bass_st = proc(np.stack([bas * duck] * 2), LowpassFilter(1500))
    drum_st = proc(np.stack([drums] * 2), Compressor(-14, 3, 3, 80))

    mix = 0.55 * pads_st + 0.32 * arps_st + 0.5 * bass_st + 0.55 * drum_st
    mix = proc(mix, HighpassFilter(28), Compressor(-12, 2, 10, 150), Limiter(-1.0))
    mix *= 10 ** (-1.5 / 20) / max(np.abs(mix).max(), 1e-9)

    fade = int(2.5 * SR)
    mix[:, -fade:] *= np.linspace(1, 0, fade)
    return mix.T


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bpm", type=float, default=118)
    ap.add_argument("--bars", type=int, default=32)
    ap.add_argument("--mood", choices=PROGRESSIONS, default="uplift")
    ap.add_argument("--out", default=str(Path(__file__).resolve().parent.parent
                                         / "public" / "music" / "bed.wav"))
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    audio = render(args.bpm, args.bars, args.mood)
    sf.write(out, audio, SR, subtype="PCM_24")
    print(f"{out}  {len(audio) / SR:.1f}s @ {args.bpm} BPM ({args.mood})")


if __name__ == "__main__":
    main()
