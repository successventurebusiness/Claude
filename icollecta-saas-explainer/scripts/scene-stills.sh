#!/usr/bin/env bash
# Renders 3 stills per scene (local frame 5, middle, duration-5) into review/stills.
# Usage: scripts/scene-stills.sh [SceneId ...]   (default: all scenes)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${OUT:-review/stills}
mkdir -p "$OUT"
BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
args=(--gl=swangle --log=error --image-format=jpeg --jpeg-quality=88 --scale="${SCALE:-0.5}")
[ -x "$BROWSER" ] && args+=(--browser-executable="$BROWSER")
npx remotion bundle --out-dir=build --log=error >/dev/null
scenes=("$@")
if [ ${#scenes[@]} -eq 0 ]; then
  mapfile -t scenes < <(node -e "
    const s = require('fs').readFileSync('src/timeline.ts', 'utf8');
    for (const m of s.matchAll(/id: \"(S[^\"]+)\", start: \d+, duration: (\d+)/g)) console.log(m[1]);")
fi
for id in "${scenes[@]}"; do
  dur=$(node -e "
    const s = require('fs').readFileSync('src/timeline.ts', 'utf8');
    const m = s.match(new RegExp('id: \"$id\", start: \\\\d+, duration: (\\\\d+)'));
    console.log(m[1]);")
  for f in 5 $((dur / 2)) $((dur - 5)); do
    npx remotion still build "${id/_/-}" "$OUT/${id}_f$(printf %03d $f).jpg" --frame=$f "${args[@]}"
  done
  echo "$id: stills at 5, $((dur / 2)), $((dur - 5))"
done
