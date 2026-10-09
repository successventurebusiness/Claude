# Promo video

SaaS explainer / promo video built with [Remotion](https://remotion.dev) (React → MP4),
with original, procedurally generated sound design and a local neural voiceover.

## Toolchain

| Area | Tools |
| --- | --- |
| Video engine | Remotion 4 (`@remotion/cli`), rendered with headless Chromium + FFmpeg |
| Motion & transitions | `@remotion/transitions` (slide, wipe, flip, clock-wipe, zoom-blur, …), `@remotion/motion-blur`, `@remotion/animation-utils`, `@remotion/noise` |
| Shapes & infographics | `@remotion/shapes`, `@remotion/paths` (SVG path draw-on), `d3`, `lucide-react` icons |
| Animation files | `@remotion/lottie` + `lottie-web` |
| 3D | `@remotion/three`, `three`, `@react-three/fiber`, `@react-three/drei` |
| Typography | `@remotion/fonts`, `@remotion/layout-utils`; bundled fonts in `public/fonts` (Inter, Plus Jakarta Sans, Space Grotesk, Manrope, Poppins, Sora, Outfit, JetBrains Mono) |
| Audio playback | `@remotion/media`, `@remotion/media-utils` |
| Sound effects | `audio/sfx.py` — synthesized with NumPy/SciPy + Spotify Pedalboard (reverb, EQ, compression) |
| Music bed | `audio/music.py` — procedural electronic groove, adjustable BPM / length / mood |
| Voiceover | `audio/voiceover.py` — Kokoro neural TTS (Apache-2.0), 50+ voices, runs offline |

All sound is generated from scratch, so there are no licensing issues.

## Setup

```bash
npm ci
./audio/setup.sh      # Python audio libs, sox, Kokoro model files, then builds public/sfx
```

In Claude Code cloud sessions this runs automatically via the SessionStart hook in `../.claude/settings.json`.

## Audio commands

```bash
python3 audio/sfx.py                                   # all effects → public/sfx/*.wav
python3 audio/music.py --bpm 118 --bars 32 --mood uplift   # → public/music/bed.wav
python3 audio/voiceover.py --list-voices
python3 audio/voiceover.py --script audio/script.json --voice am_michael   # → public/vo/
```

Effects: `pop`, `pop_high`, `click`, `tick`, `notification`, `typing`, `swipe`, `whoosh_fast`,
`whoosh`, `whoosh_deep`, `glitch`, `shimmer`, `ding`, `success`, `riser`, `impact`, `sub_drop`, `logo_hit`.

## Video commands

```bash
npm run dev                                  # Remotion Studio preview
npx remotion render SetupCheck out/check.mp4 # render a composition
```

`previews/` holds a smoke-test render and an audition reel of every sound.
