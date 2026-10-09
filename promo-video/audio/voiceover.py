"""Neural text-to-speech voiceover with Kokoro (Apache-2.0, runs locally).

Each line becomes its own WAV so it can be placed precisely on the timeline,
and a JSON manifest records the durations for Remotion to read.

    python3 audio/voiceover.py --script audio/script.json --voice am_michael
    python3 audio/voiceover.py --list-voices

script.json: [{"id": "hook", "text": "Tired of juggling ten tools?"}, ...]

Models (gitignored) live in audio/models/; fetch them with audio/setup.sh.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from pedalboard import Compressor, HighpassFilter, Limiter, Pedalboard, PeakFilter

ROOT = Path(__file__).resolve().parent
MODELS = ROOT / "models"
OUT = ROOT.parent / "public" / "vo"


def polish(audio: np.ndarray, sr: int) -> np.ndarray:
    """Broadcast-style vocal chain: rumble cut, presence, compression."""
    board = Pedalboard([
        HighpassFilter(80),
        PeakFilter(3500, gain_db=2.0, q=0.9),
        Compressor(threshold_db=-20, ratio=3, attack_ms=5, release_ms=90),
        Limiter(threshold_db=-1.5),
    ])
    out = board(audio.astype(np.float32)[None, :], sr)[0]
    return out * (10 ** (-1.5 / 20) / max(np.abs(out).max(), 1e-9))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", type=Path)
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--list-voices", action="store_true")
    args = ap.parse_args()

    tts = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
    if args.list_voices:
        print("\n".join(sorted(tts.get_voices())))
        return

    lines = json.loads(args.script.read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for line in lines:
        samples, sr = tts.create(line["text"], voice=line.get("voice", args.voice),
                                 speed=line.get("speed", args.speed), lang="en-us")
        audio = polish(samples, sr)
        path = OUT / f"{line['id']}.wav"
        sf.write(path, audio, sr, subtype="PCM_24")
        manifest.append({"id": line["id"], "text": line["text"],
                         "file": f"vo/{path.name}", "seconds": round(len(audio) / sr, 3)})
        print(f"{line['id']:12s} {len(audio) / sr:5.2f}s  {line['text']}")
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
