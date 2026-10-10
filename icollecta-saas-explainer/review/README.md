# Review pack

- `icollecta_preview_720p.mp4` — the full 58 s film (1740 frames) at 1280x720 with the UI sound-effect track.
- `stills/<Scene>_fNNN.jpg` — 3 stills per scene at 1920x1080: local frame 5, the middle, and duration-5.
- `kit.jpg` — the component kit (every component on one screen).

## Final renders (4K)

| File | Spec |
| --- | --- |
| `out/icollecta_explainer_sfx.mp4` | 3840x2160, 30 fps, 1740 frames, H.264 High, ~12.9 Mb/s two-pass, AAC 48 kHz 320 kb/s, 95 MB |
| `out/icollecta_explainer_silent.mp4` | the same video stream, no audio, 94 MB |
| `out/icollecta_sfx_stem.wav` | SFX track alone, 48 kHz 16-bit stereo, 58.0 s |

At 4K, CRF 16-20 would come out around 250 MB, too big for GitHub's 100 MB file limit, so the MP4 is a two-pass encode
sized to 95 MB from a near-lossless 4K master (`scripts/render-4k.sh`). Measured against that master: SSIM 0.998,
PSNR 52.6 dB on average (worst frame 47.3 dB).

## Could not match the spec exactly

1. **No storyboard frames.** The zip had no `storyboard/` folder, so scenes follow the written spec only and were not compared against approved frames. `storyboard/` exists and is empty.
2. **Fonts.** Google Fonts can't be reached from the headless renderer here, so Montserrat 800 and Inter 500/600/700 come from `@fontsource/*` (the same typefaces).
3. **Sounds from remotion.media** (unreachable): `whoosh-soft` and `whoosh-fast` (whip) are generated with ffmpeg as instructed. `shutter` and `ding` were also remotion.media files with no alternative in the spec, so they are generated with ffmpeg too. `riser` is the reversed generated whoosh and runs about 0.64 s instead of about 0.9 s. All Kenney sounds come from github.com/kapishdima/soundcn.
4. **Composition IDs.** Remotion doesn't allow `_` in composition IDs, so the per-scene compositions are `S01A-Scatter` … `S15-EndCard`. Files and components keep the spec's names, and the main composition is `ICollectaExplainer`.
5. **S04 camera truck.** "x +600 → −600" is applied as the world moving from +600 to −600, so the three areas read left to right in order (Organized → Searchable → Easy to track).
6. **S06 value badge.** Centred at (760, 300), it would sit on top of the 900x560 chart. It is placed beside the card's top-right corner instead (top-left at 560, 150), and the chart is centred at (1300, 600).
7. **S11B.** The glass shutters lift at f52–57 so the two cards can swap above the vault at f56–68.
8. **Small additions where the spec gave no content:** S02B speech-bubble text "Nice pull!"; S04 middle/right panel titles "Search" and "Insights"; S09/S10 listing text bars; a S12A payment-sheet sub-line "Released when the card arrives".
9. **Motion blur.** Only `DirectionalBlur` is used. `CameraMotionBlur` was not needed.

## Placeholders in use

| Asset | Status |
| --- | --- |
| `public/brand/logo.svg` | Client logo, used (per-letter build) |
| `public/cards/hero.png` | **Missing** — coded fallback: night-stadium card with a navy/lime running-back silhouette |
| `public/cards/trade.png` | **Missing** — coded fallback: cream vintage card with a red-jersey dunk silhouette |
| `public/cards/extra-01..08.png` | Client art, used (extra-06 shown full-bleed, no foil) |
| `public/avatars/you.png` | **Missing** — gradient circle with initials "YO" |
| `public/avatars/maya.png` | **Missing** — gradient circle with initials "MC" |
| `public/avatars/c1..c5.png` | Client art, used in rotation |

To swap in the real files: add them to `public/`, then run `node scripts/prepare.mjs`. No code changes are needed.
