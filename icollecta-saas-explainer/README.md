# iCollecta SaaS explainer

58-second (1740 frames, 1920x1080, 30 fps) Remotion build of `ICOLLECTA_BUILD_PROMPT.md`.
The only audio is the UI sound-effect track; voiceover and music are added in the edit.

## Layout

| Path | What |
| --- | --- |
| `src/timeline.ts` | Scene start/duration table (single source of truth) and act lighting |
| `src/theme.ts`, `src/fonts.ts` | Design tokens, motion rules, Montserrat 800 + Inter 500/600/700 |
| `src/components/` | Stage3D, glass UI, devices, TradingCard, collectibles, data viz, FX, KineticText, Logo |
| `src/scenes/S01A_Scatter.tsx` … `S15_EndCard.tsx` | One file per shot (local frames) |
| `src/sfx/palette.ts`, `src/sfx/cues.ts` | Sound name -> file, and every cue `{scene, localFrame, sound, volume}` |
| `src/Main.tsx` | `ICollectaExplainer`: scenes on hard cuts + grain/vignette + SFX track |
| `public/` | Client assets (`brand/`, `cards/`, `avatars/`) and built `sfx/` |
| `storyboard/` | Storyboard frames (empty: none were supplied) |
| `sfx-src/` | Kenney CC0 source sounds (from github.com/kapishdima/soundcn) |
| `review/` | Review stills (3 per scene) and the 720p preview |

## Commands

```bash
npm i
npm run sfx          # rebuild public/sfx from sfx-src + ffmpeg-generated sounds
npm run dev          # Remotion Studio (runs scripts/prepare.mjs first)
npm run check        # typecheck + timeline/cue verification (bun)
npm run stills       # 3 stills per scene into review/stills
```

`scripts/prepare.mjs` generates `src/generated/` (logo paths for the per-letter build, and the
list of optional assets present). Drop `cards/hero.png`, `cards/trade.png`, `avatars/you.png`
or `avatars/maya.png` into `public/`, re-run it, and the coded fallbacks are replaced.

Final renders (after approval):

```bash
B=--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell  # cloud only
npx remotion render ICollectaExplainer out/icollecta_explainer_sfx.mp4 --crf=18 --audio-codec=aac $B --gl=swangle
npx remotion render ICollectaExplainer out/icollecta_explainer_silent.mp4 --crf=18 --muted $B --gl=swangle
npx remotion render ICollectaExplainer out/icollecta_sfx_stem.wav --codec=wav $B
```
