#!/usr/bin/env bash
# Installs the audio/voice toolchain and model files for the promo video.
# Safe to re-run: skips anything already present.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v sox >/dev/null || ! command -v ffmpeg >/dev/null; then
  if command -v apt-get >/dev/null; then
    sudo_cmd=""; [ "$(id -u)" -ne 0 ] && sudo_cmd="sudo"
    $sudo_cmd apt-get update -q
    DEBIAN_FRONTEND=noninteractive $sudo_cmd apt-get install -y -q ffmpeg sox libsox-fmt-all
  else
    echo "Install ffmpeg and sox with your package manager first." >&2
  fi
fi

pip_flags=""
python3 -m pip install --help | grep -q break-system-packages && pip_flags="--break-system-packages"
python3 -m pip install -q $pip_flags -r audio/requirements.txt

models=audio/models
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
mkdir -p "$models"
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "$models/$f" ] || curl -fL --retry 3 -o "$models/$f" "$base/$f"
done

[ -d node_modules ] || npm ci

python3 audio/sfx.py
echo "Audio toolchain ready."
