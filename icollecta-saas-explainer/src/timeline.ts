// Single source of truth for scene timing (spec section 4), 30 fps.
export const FPS = 30;

export const SCENES = [
  { id: "S01A_Scatter", start: 0, duration: 129 },
  { id: "S01B_OnePlace", start: 129, duration: 93 },
  { id: "S02A_Logo", start: 222, duration: 48 },
  { id: "S02B_Social", start: 270, duration: 69 },
  { id: "S03_BulkUpload", start: 339, duration: 69 },
  { id: "S04_CommandCenter", start: 408, duration: 81 },
  { id: "S05_Worth", start: 489, duration: 93 },
  { id: "S06_MarketData", start: 582, duration: 93 },
  { id: "S07A_ShipPause", start: 675, duration: 54 },
  { id: "S07B_SlabVision", start: 729, duration: 51 },
  { id: "S08A_Scan", start: 780, duration: 39 },
  { id: "S08B_PreGrade", start: 819, duration: 39 },
  { id: "S09_SubGrades", start: 858, duration: 102 },
  { id: "S10_FoundCard", start: 960, duration: 72 },
  { id: "S11A_TradeRoom", start: 1032, duration: 66 },
  { id: "S11B_Escrow", start: 1098, duration: 72 },
  { id: "S12A_BuySell", start: 1170, duration: 60 },
  { id: "S12B_TwoWayTalk", start: 1230, duration: 69 },
  { id: "S12C_Marketplace", start: 1299, duration: 93 },
  { id: "S13_Journey", start: 1392, duration: 147 },
  { id: "S14_Spreadsheet", start: 1539, duration: 90 },
  { id: "S15_EndCard", start: 1629, duration: 111 },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const TOTAL_FRAMES = 1740;

export const scene = (id: SceneId) => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

// Sanity: scenes must tile the timeline exactly.
SCENES.forEach((s, i) => {
  const expected = i === 0 ? 0 : SCENES[i - 1].start + SCENES[i - 1].duration;
  if (s.start !== expected) throw new Error(`${s.id} starts at ${s.start}, expected ${expected}`);
});
if (SCENES[SCENES.length - 1].start + SCENES[SCENES.length - 1].duration !== TOTAL_FRAMES) {
  throw new Error("Timeline does not add up to 1740 frames");
}

// Act lighting: Background glow strength (0..1) by GLOBAL frame (spec section 5).
export const ACT_GLOW: ReadonlyArray<readonly [number, number]> = [
  [0, 0.05],
  [339, 0.4],
  [345, 0.3],
  [489, 0.3],
  [495, 0.2],
  [582, 0.2],
  [590, 0.35],
  [675, 0.35],
  [680, 0.5],
  [1170, 0.5],
  [1176, 0.6],
  [1392, 0.6],
  [1539, 0.7],
  [1740, 0.7],
];
