#!/usr/bin/env bash
# 4K (3840x2160) final renders:
#   out/icollecta_explainer_sfx.mp4     H.264 + AAC 48 kHz, sized to stay under GitHub's 100 MB limit
#   out/icollecta_explainer_silent.mp4  same video stream, no audio
#   out/icollecta_sfx_stem.wav          the SFX track alone
#
# 1. Renders a near-lossless 4K master in chunks (resumable: finished chunks are skipped).
# 2. Renders the SFX stem as WAV.
# 3. Two-pass encodes the master to TARGET_MB and muxes the stem as AAC.
set -euo pipefail
cd "$(dirname "$0")/.."

CHUNKS=${CHUNKS:-4}
TOTAL=1740
TARGET_MB=${TARGET_MB:-95}
AUDIO_KBPS=320
BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
common=(--gl=swangle --timeout=300000 --concurrency="${CONCURRENCY:-4}" --log=error)
[ -x "$BROWSER" ] && common+=(--browser-executable="$BROWSER")

mkdir -p out/parts
node scripts/prepare.mjs >/dev/null
npx remotion bundle --out-dir=build --log=error >/dev/null

per=$(((TOTAL + CHUNKS - 1) / CHUNKS))
: >out/parts/list.txt
for ((i = 0; i < CHUNKS; i++)); do
  start=$((i * per))
  end=$((start + per - 1))
  ((end >= TOTAL)) && end=$((TOTAL - 1))
  part=out/parts/part$i.mp4
  echo "file 'part$i.mp4'" >>out/parts/list.txt
  if [ -s "$part.done" ]; then
    echo "chunk $i ($start-$end) already rendered"
    continue
  fi
  echo "chunk $i: frames $start-$end ($(date +%T))"
  npx remotion render build ICollectaExplainer "$part" --frames="$start-$end" --scale=2 \
    --crf=10 --x264-preset=veryfast --muted "${common[@]}"
  echo ok >"$part.done"
done

echo "concat master ($(date +%T))"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i out/parts/list.txt -c copy out/master_4k.mp4

echo "sfx stem ($(date +%T))"
npx remotion render build ICollectaExplainer out/icollecta_sfx_stem.wav --codec=wav "${common[@]}"

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/master_4k.mp4)
vkbps=$(awk -v mb="$TARGET_MB" -v d="$dur" -v a="$AUDIO_KBPS" 'BEGIN { printf "%d", (mb * 8192 / d) - a - 150 }')
echo "two-pass H.264 at ${vkbps} kb/s ($(date +%T))"
x264=(-c:v libx264 -preset slow -b:v "${vkbps}k" -maxrate "$((vkbps * 2))k" -bufsize "$((vkbps * 4))k" -pix_fmt yuv420p -profile:v high -movflags +faststart)
ffmpeg -hide_banner -loglevel error -y -i out/master_4k.mp4 "${x264[@]}" -pass 1 -passlogfile out/x264 -an -f mp4 /dev/null
ffmpeg -hide_banner -loglevel error -y -i out/master_4k.mp4 -i out/icollecta_sfx_stem.wav \
  "${x264[@]}" -pass 2 -passlogfile out/x264 -c:a aac -b:a "${AUDIO_KBPS}k" -ar 48000 -map 0:v:0 -map 1:a:0 \
  out/icollecta_explainer_sfx.mp4
ffmpeg -hide_banner -loglevel error -y -i out/icollecta_explainer_sfx.mp4 -map 0:v:0 -c copy -movflags +faststart \
  out/icollecta_explainer_silent.mp4
rm -f out/x264*.log out/x264*.mbtree

ls -la out/*.mp4 out/*.wav
echo "done ($(date +%T))"
