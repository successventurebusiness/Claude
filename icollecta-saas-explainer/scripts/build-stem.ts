// bun scripts/build-stem.ts [out.wav]
// Mixes the SFX stem straight from src/sfx/cues.ts with ffmpeg: each cue's file,
// delayed to its global frame, at its volume, summed without normalisation.
// Same result as Remotion's audio render of ICollectaExplainer, in seconds.
import { spawnSync } from "node:child_process";
import { resolveCues } from "../src/sfx/cues";
import { FPS, TOTAL_FRAMES } from "../src/timeline";

const out = process.argv[2] ?? "out/icollecta_sfx_stem.wav";
const cues = resolveCues();
const args = ["-hide_banner", "-loglevel", "error", "-y"];
for (const c of cues) args.push("-i", `public/sfx/${c.file}`);
const chains = cues.map((c, i) => {
  const ms = Math.round((c.frame / FPS) * 1000);
  return `[${i}]aresample=48000,aformat=channel_layouts=stereo,volume=${c.volume},adelay=${ms}|${ms}[a${i}]`;
});
const mix = `${cues.map((_, i) => `[a${i}]`).join("")}amix=inputs=${cues.length}:normalize=0:dropout_transition=0,apad=whole_dur=${TOTAL_FRAMES / FPS},atrim=0:${TOTAL_FRAMES / FPS}[out]`;
args.push("-filter_complex", [...chains, mix].join(";"), "-map", "[out]", "-ar", "48000", "-c:a", "pcm_s16le", out);
const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`stem: ${cues.length} cues -> ${out}`);
