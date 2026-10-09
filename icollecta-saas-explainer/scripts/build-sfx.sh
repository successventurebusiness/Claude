#!/usr/bin/env bash
# Builds public/sfx/*.wav from the Kenney CC0 packs in sfx-src/ (taken from
# github.com/kapishdima/soundcn) plus a few sounds generated with ffmpeg.
# Every file: 48 kHz stereo WAV, leading silence trimmed, peak ~ -3 dBFS.
#
# The spec's remotion.media sounds (whoosh, whip, shutter-modern, ding) could
# not be downloaded in the build environment, so they are synthesised here.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=sfx-src
UI=$SRC/kenney_interface-sounds
SCIFI=$SRC/kenney_sci-fi-sounds
OUT=public/sfx
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

ff() { ffmpeg -hide_banner -loglevel error -y "$@"; }

# normalise <in> <out>: trim leading silence, 48 kHz stereo, peak -3 dBFS
normalise() {
  local in=$1 out=$2
  ff -i "$in" -af "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.002" \
    -ar 48000 -ac 2 -c:a pcm_s24le "$TMP/n.wav"
  local peak
  peak=$(ffmpeg -hide_banner -i "$TMP/n.wav" -af volumedetect -f null - 2>&1 |
    sed -n 's/.*max_volume: \(-\?[0-9.]*\) dB.*/\1/p')
  local gain
  gain=$(awk -v p="$peak" 'BEGIN { printf "%.2f", -3 - p }')
  ff -i "$TMP/n.wav" -af "volume=${gain}dB" -c:a pcm_s24le "$out"
}

# pitch <in> <semitones> <out>
pitch() {
  local in=$1 st=$2 out=$3
  local ratio
  ratio=$(awk -v s="$st" 'BEGIN { printf "%.6f", 2 ^ (s / 12) }')
  ff -i "$in" -af "asetrate=48000*${ratio},aresample=48000" -c:a pcm_s24le "$out"
}

# --- Kenney interface sounds (primary + alternate for natural variation)
map=(
  "ui-click:click_002" "ui-click-2:click_003"
  "ui-tap:select_001" "ui-tap-2:select_002"
  "ui-pop:pluck_002" "ui-pop-2:pluck_001"
  "ui-snap:drop_002" "ui-snap-2:drop_003"
  "ui-tick:tick_002" "ui-tick-2:tick_004"
  "ui-type:tick_001"
  "ui-toggle:toggle_002"
  "ui-open:maximize_003"
  "ui-close:minimize_003"
  "ui-glass:glass_002" "ui-glass-2:glass_003"
  "ui-scroll:scroll_002"
  "ui-confirm:confirmation_002"
  "ui-notify:bong_001"
  "ui-question:question_001"
)
for pair in "${map[@]}"; do
  normalise "$UI/${pair#*:}.ogg" "$OUT/${pair%%:*}.wav"
done

# --- Generated replacements for the remotion.media sounds
# whoosh-soft: pink noise through a band-pass whose centre sweeps up then down,
# with a swelling envelope and a slow stereo pan.
cat >"$TMP/whoosh.cmd" <<'EOF'
0.00 bandpass f 300;
0.10 bandpass f 500;
0.20 bandpass f 900;
0.30 bandpass f 1500;
0.38 bandpass f 2200;
0.46 bandpass f 2600;
0.55 bandpass f 2000;
0.65 bandpass f 1300;
0.75 bandpass f 800;
EOF
ff -f lavfi -i "anoisesrc=d=0.9:c=pink:r=48000:a=0.9:seed=7" -af \
  "asendcmd=f=$TMP/whoosh.cmd,bandpass=f=300:width_type=q:w=0.9,\
volume='if(lt(t,0.42),pow(t/0.42,2.2),pow((0.9-t)/0.48,1.6))':eval=frame,\
aformat=channel_layouts=stereo,extrastereo=m=1.6,\
aecho=0.8:0.5:40|70:0.25|0.15" "$TMP/whoosh.wav"
normalise "$TMP/whoosh.wav" "$OUT/whoosh-soft.wav"

# whoosh-fast (whip): short, bright, sharp attack, fast decay.
cat >"$TMP/whip.cmd" <<'EOF'
0.00 bandpass f 1200;
0.04 bandpass f 3000;
0.08 bandpass f 5200;
0.14 bandpass f 3800;
0.22 bandpass f 2000;
EOF
ff -f lavfi -i "anoisesrc=d=0.36:c=white:r=48000:a=0.9:seed=3" -af \
  "asendcmd=f=$TMP/whip.cmd,bandpass=f=1200:width_type=q:w=1.1,\
volume='if(lt(t,0.07),pow(t/0.07,1.5),exp(-(t-0.07)*14))':eval=frame,\
aformat=channel_layouts=stereo,extrastereo=m=1.8,\
aecho=0.7:0.4:25:0.2" "$TMP/whip.wav"
normalise "$TMP/whip.wav" "$OUT/whoosh-fast.wav"

# shutter: two short filtered mechanical clicks 55 ms apart plus a soft burst.
ff -f lavfi -i "anoisesrc=d=0.22:c=white:r=48000:seed=5" -af \
  "highpass=f=1500,lowpass=f=9000,\
volume='exp(-t*180)*0.9+if(gt(t,0.055),exp(-(t-0.055)*140),0)*0.8+exp(-t*25)*0.12':eval=frame,\
aformat=channel_layouts=stereo" "$TMP/shutter.wav"
normalise "$TMP/shutter.wav" "$OUT/shutter.wav"

# ding: soft glassy bell (fundamental + inharmonic partials, exponential decay).
ff -f lavfi -i "aevalsrc='0.6*sin(2*PI*1318.5*t)*exp(-t*3.2)+0.22*sin(2*PI*2637*t)*exp(-t*5)+0.08*sin(2*PI*3951*t+0.3)*exp(-t*8)+0.05*sin(2*PI*5420*t)*exp(-t*12)':s=48000:d=1.6" \
  -af "afade=t=in:d=0.003,aformat=channel_layouts=stereo,aecho=0.8:0.6:60|110:0.2|0.12" "$TMP/ding.wav"
normalise "$TMP/ding.wav" "$OUT/ding.wav"

# sub-thump: 55 Hz sine, 0.35 s, fast exponential decay.
ff -f lavfi -i "aevalsrc='sin(2*PI*55*t)*exp(-t*11)':s=48000:d=0.35" \
  -af "afade=t=in:d=0.002,afade=t=out:st=0.31:d=0.04,aformat=channel_layouts=stereo" "$TMP/sub.wav"
normalise "$TMP/sub.wav" "$OUT/sub-thump.wav"

# --- Derived sounds
# scan: forceField_001 trimmed to 0.8 s with a 0.1 s fade-out.
ff -i "$SCIFI/forceField_001.ogg" -af "atrim=0:0.8,afade=t=out:st=0.7:d=0.1" "$TMP/scan.wav"
normalise "$TMP/scan.wav" "$OUT/scan.wav"

# lock: impactMetal_001 layered with ui-click.
ff -i "$SCIFI/impactMetal_001.ogg" -i "$OUT/ui-click.wav" -filter_complex \
  "[0]aresample=48000,aformat=channel_layouts=stereo[a];[1]volume=0.8[b];[a][b]amix=inputs=2:normalize=0" "$TMP/lock.wav"
normalise "$TMP/lock.wav" "$OUT/lock.wav"

# riser: whoosh reversed with a fade-in, about 0.9 s.
ff -i "$OUT/whoosh-soft.wav" -af "areverse,atrim=0:0.9,afade=t=in:d=0.5" "$TMP/riser.wav"
normalise "$TMP/riser.wav" "$OUT/riser.wav"

# logo-hit: whip + ui-glass + sub-thump.
ff -i "$OUT/whoosh-fast.wav" -i "$OUT/ui-glass.wav" -i "$OUT/sub-thump.wav" -filter_complex \
  "[0]volume=0.7[a];[1]adelay=40|40,volume=0.8[b];[2]adelay=40|40,volume=1.0[c];[a][b][c]amix=inputs=3:normalize=0" "$TMP/logo.wav"
normalise "$TMP/logo.wav" "$OUT/logo-hit.wav"

# gate-1..6: ui-confirm pitched 0, 2, 4, 5, 7, 9 semitones (Shot 13).
i=1
for st in 0 2 4 5 7 9; do
  pitch "$OUT/ui-confirm.wav" "$st" "$TMP/g.wav"
  normalise "$TMP/g.wav" "$OUT/gate-$i.wav"
  i=$((i + 1))
done

# step-1..5: ui-tick pitched 0, 2, 4, 5, 7 semitones (Shot 11B).
i=1
for st in 0 2 4 5 7; do
  pitch "$OUT/ui-tick.wav" "$st" "$TMP/s.wav"
  normalise "$TMP/s.wav" "$OUT/step-$i.wav"
  i=$((i + 1))
done

echo "Built $(ls "$OUT"/*.wav | wc -l) sounds in $OUT"
