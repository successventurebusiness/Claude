// bun scripts/check-timeline.ts — verifies scene timing and the SFX cue list.
import fs from "node:fs";
import { CUES, resolveCues } from "../src/sfx/cues";
import { SCENES, TOTAL_FRAMES } from "../src/timeline";

const last = SCENES[SCENES.length - 1];
console.log(`scenes: ${SCENES.length}, total ${last.start + last.duration} frames (expected ${TOTAL_FRAMES})`);
for (const s of SCENES) console.log(`  ${s.id.padEnd(18)} start ${String(s.start).padStart(4)}  dur ${s.duration}`);
const resolved = resolveCues();
console.log(`cues: ${CUES.length} listed, ${resolved.length} kept, ${CUES.length - resolved.length} dropped by the 2-frame masking rule`);
const missing = [...new Set(resolved.map((c) => c.file))].filter((f) => !fs.existsSync(`public/sfx/${f}`));
console.log(missing.length ? `MISSING sfx: ${missing.join(", ")}` : "all sfx files present");
const bad = CUES.filter((c) => {
  const s = SCENES.find((x) => x.id === c.scene)!;
  return c.localFrame < 0 || c.localFrame >= s.duration;
});
console.log(bad.length ? `cues outside their scene: ${JSON.stringify(bad)}` : "all cues inside their scene");
