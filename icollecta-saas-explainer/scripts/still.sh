#!/usr/bin/env bash
# Usage: scripts/still.sh <CompositionId> <frame> <out.png> [scale]
# Uses the preinstalled Chromium when Remotion cannot download its browser.
set -euo pipefail
cd "$(dirname "$0")/.."
BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
args=()
[ -x "$BROWSER" ] && args+=(--browser-executable="$BROWSER")
npx remotion still "$1" "$3" --frame="$2" --scale="${4:-1}" --gl=swangle "${args[@]}" --log=error
