import { type SceneId, scene } from "../timeline";
import { PALETTE, type SoundName, isTransient, volumeFor } from "./palette";

export type Cue = { scene: SceneId; localFrame: number; sound: SoundName; volume?: number };

const every = (scene: SceneId, from: number, to: number, step: number, sound: SoundName, volume?: number): Cue[] => {
  const out: Cue[] = [];
  for (let f = from; f <= to; f += step) out.push({ scene, localFrame: f, sound, volume });
  return out;
};
const at = (scene: SceneId, frames: number[], sound: SoundName, volume?: number): Cue[] =>
  frames.map((f) => ({ scene, localFrame: f, sound, volume }));

// Cue list (spec section 7), local frames.
export const CUES: Cue[] = [
  // S01A
  ...at("S01A_Scatter", [8], "whoosh-soft", 0.18),
  ...at("S01A_Scatter", [70], "whoosh-soft", 0.22),
  ...at("S01A_Scatter", [100], "riser", 0.3),
  // S01B: a landing every 4f from f26, alternating snap / tick
  ...at("S01B_OnePlace", [8], "ui-glass"),
  ...at("S01B_OnePlace", [14], "whoosh-soft", 0.25),
  ...Array.from({ length: 12 }, (_, i): Cue => ({ scene: "S01B_OnePlace", localFrame: 26 + i * 4, sound: i % 2 ? "ui-tick" : "ui-snap", volume: 0.25 })),
  ...at("S01B_OnePlace", [86], "whoosh-fast", 0.3),
  // S02A
  ...at("S02A_Logo", [0], "logo-hit", 0.7),
  ...at("S02A_Logo", [12, 18, 24], "ui-tick", 0.12),
  ...at("S02A_Logo", [28], "ui-glass", 0.25),
  // S02B
  ...at("S02B_Social", [4], "whoosh-soft", 0.3),
  ...at("S02B_Social", [30, 42], "ui-pop"),
  ...at("S02B_Social", [50], "ui-notify", 0.25),
  ...at("S02B_Social", [60], "whoosh-fast", 0.35),
  // S03
  ...at("S03_BulkUpload", [2], "ui-glass"),
  ...every("S03_BulkUpload", 12, 58, 6, "ui-snap", 0.2),
  ...every("S03_BulkUpload", 10, 58, 3, "ui-tick", 0.1),
  ...at("S03_BulkUpload", [60], "ui-confirm"),
  ...at("S03_BulkUpload", [62], "whoosh-soft", 0.3),
  // S04
  ...at("S04_CommandCenter", [2, 27, 52], "ui-pop"),
  ...every("S04_CommandCenter", 4, 24, 4, "ui-snap"),
  ...every("S04_CommandCenter", 28, 50, 2, "ui-type"),
  ...at("S04_CommandCenter", [46], "whoosh-soft", 0.25),
  ...at("S04_CommandCenter", [54], "riser", 0.2),
  ...at("S04_CommandCenter", [76], "ui-tick", 0.3),
  // S05: reel ticks slowing down
  ...at("S05_Worth", [6], "ui-question", 0.4),
  ...every("S05_Worth", 10, 50, 2, "ui-tick", 0.12),
  ...every("S05_Worth", 54, 62, 4, "ui-tick", 0.15),
  ...every("S05_Worth", 64, 70, 6, "ui-tick", 0.18),
  ...at("S05_Worth", [72], "ui-pop"),
  ...at("S05_Worth", [84], "ui-glass", 0.25),
  // S06
  ...at("S06_MarketData", [2], "whoosh-soft", 0.25),
  ...every("S06_MarketData", 8, 40, 2, "ui-tick", 0.1),
  ...at("S06_MarketData", [30, 34, 38], "ui-pop"),
  ...at("S06_MarketData", [52], "whoosh-soft", 0.25),
  ...at("S06_MarketData", [70], "ding", 0.3),
  // S07A
  ...at("S07A_ShipPause", [16], "ui-tick", 0.2),
  ...at("S07A_ShipPause", [22], "ui-pop", 0.35),
  ...at("S07A_ShipPause", [36], "whoosh-soft", 0.12),
  ...at("S07A_ShipPause", [50], "ui-click"),
  // S07B
  ...at("S07B_SlabVision", [6, 9, 12, 15], "ui-tick", 0.25),
  ...at("S07B_SlabVision", [20], "whoosh-soft", 0.2),
  ...at("S07B_SlabVision", [36], "ui-open"),
  // S08A
  ...at("S08A_Scan", [2], "scan"),
  ...at("S08A_Scan", [30], "shutter", 0.45),
  // S08B
  ...every("S08B_PreGrade", 4, 22, 2, "ui-tick", 0.12),
  ...at("S08B_PreGrade", [22], "ui-confirm", 0.5),
  ...at("S08B_PreGrade", [24], "ui-glass", 0.2),
  // S09
  ...at("S09_SubGrades", [2], "whoosh-soft", 0.3),
  ...at("S09_SubGrades", [8], "ui-tick", 0.15),
  ...at("S09_SubGrades", [14, 20, 26, 32], "ui-snap"),
  ...at("S09_SubGrades", [48, 54], "ui-pop"),
  ...at("S09_SubGrades", [58], "ui-open"),
  ...at("S09_SubGrades", [66], "ui-glass"),
  ...at("S09_SubGrades", [96], "whoosh-fast", 0.35),
  // S10
  ...at("S10_FoundCard", [2], "ui-scroll", 0.3),
  ...at("S10_FoundCard", [30], "ui-tick", 0.25),
  ...at("S10_FoundCard", [44], "ui-tap"),
  ...at("S10_FoundCard", [46], "ui-pop"),
  ...at("S10_FoundCard", [52], "whoosh-soft", 0.25),
  // S11A
  ...at("S11A_TradeRoom", [2], "ui-glass"),
  ...at("S11A_TradeRoom", [12], "ui-snap"),
  ...at("S11A_TradeRoom", [16], "whoosh-soft", 0.2),
  ...at("S11A_TradeRoom", [24], "ui-click"),
  ...at("S11A_TradeRoom", [34], "ui-confirm"),
  ...at("S11A_TradeRoom", [56], "whoosh-fast", 0.3),
  // S11B
  ...at("S11B_Escrow", [4, 7], "ui-snap", 0.35),
  ...at("S11B_Escrow", [12], "ui-close"),
  ...at("S11B_Escrow", [22], "lock"),
  ...at("S11B_Escrow", [24], "step-1"),
  ...at("S11B_Escrow", [30], "step-2"),
  ...at("S11B_Escrow", [30], "scan", 0.3),
  ...at("S11B_Escrow", [36], "step-3"),
  ...at("S11B_Escrow", [44], "step-4"),
  ...at("S11B_Escrow", [54], "step-5"),
  ...at("S11B_Escrow", [54], "ui-confirm"),
  ...at("S11B_Escrow", [56], "whoosh-soft", 0.25),
  // S12A
  ...at("S12A_BuySell", [0], "whoosh-soft", 0.2),
  ...at("S12A_BuySell", [12], "ui-tap"),
  ...at("S12A_BuySell", [16], "ui-open"),
  ...at("S12A_BuySell", [26], "whoosh-soft", 0.15),
  ...at("S12A_BuySell", [28], "ui-confirm", 0.4),
  ...at("S12A_BuySell", [30], "ui-notify"),
  ...at("S12A_BuySell", [40], "ui-pop"),
  // S12B
  ...at("S12B_TwoWayTalk", [4], "ui-pop", 0.25),
  ...at("S12B_TwoWayTalk", [8], "ui-toggle", 0.45),
  ...at("S12B_TwoWayTalk", [42], "ui-pop", 0.35),
  ...at("S12B_TwoWayTalk", [36, 44, 52, 60], "ui-pop", 0.15),
  // S12C
  ...at("S12C_Marketplace", [0], "whoosh-soft", 0.3),
  ...at("S12C_Marketplace", [6, 11, 16, 21, 26], "ui-pop", 0.2),
  ...at("S12C_Marketplace", [40, 56, 70], "ui-notify", 0.15),
  ...at("S12C_Marketplace", [70], "riser", 0.3),
  // S13: whoosh + rising gate chime at each gate pass
  ...[12, 57, 75, 93, 108, 126].flatMap((f, i): Cue[] => [
    { scene: "S13_Journey", localFrame: f, sound: "whoosh-soft", volume: 0.18 },
    { scene: "S13_Journey", localFrame: f, sound: `gate-${i + 1}` as SoundName, volume: 0.3 },
  ]),
  ...at("S13_Journey", [130], "whoosh-fast", 0.35),
  // S14
  ...at("S14_Spreadsheet", [6], "ui-snap", 0.4),
  ...at("S14_Spreadsheet", [14], "ui-glass", 0.35),
  ...at("S14_Spreadsheet", [20], "whoosh-soft", 0.3),
  ...every("S14_Spreadsheet", 28, 48, 3, "ui-snap", 0.15),
  ...at("S14_Spreadsheet", [46], "whoosh-fast", 0.25),
  ...at("S14_Spreadsheet", [58], "ui-confirm", 0.3),
  // S15: one tick per word of the headline (stagger 4 from f16)
  ...at("S15_EndCard", [6], "logo-hit", 0.45),
  ...at("S15_EndCard", [16, 20, 24, 28, 32], "ui-tick", 0.1),
  ...at("S15_EndCard", [40], "ui-pop", 0.35),
  ...at("S15_EndCard", [70], "ui-click"),
  ...at("S15_EndCard", [72], "ui-glass", 0.2),
];

export type ResolvedCue = { frame: number; file: string; volume: number; sound: SoundName };

/**
 * Global frames, alternate files for natural variation, and the masking rule:
 * transient cues closer than 2 frames to an earlier kept transient are dropped.
 */
export const resolveCues = (cues: Cue[] = CUES): ResolvedCue[] => {
  const sorted = cues
    .map((c) => ({ ...c, frame: scene(c.scene).start + c.localFrame }))
    .sort((a, b) => a.frame - b.frame);
  const counts: Record<string, number> = {};
  let lastTransient = -100;
  const out: ResolvedCue[] = [];
  for (const c of sorted) {
    if (isTransient(c.sound)) {
      if (c.frame - lastTransient < 2) continue;
      lastTransient = c.frame;
    }
    const files = PALETTE[c.sound];
    const n = counts[c.sound] ?? 0;
    counts[c.sound] = n + 1;
    out.push({ frame: c.frame, file: files[n % files.length], volume: c.volume ?? volumeFor(c.sound), sound: c.sound });
  }
  return out;
};
