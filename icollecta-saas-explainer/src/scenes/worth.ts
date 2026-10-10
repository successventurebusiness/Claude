import { random } from "remotion";

// Shared by S05 (tags burst into hanging dots) and S06 (dots become sale points).
export const TAGS = [
  { x: 520, y: 380, scale: 1.2, blur: 0, phase: 0 },
  { x: 715, y: 222, scale: 0.8, blur: 0, phase: 1.7 }, // clears the wider 3:4 hero card and the big tag
  { x: 260, y: 860, scale: 1.8, blur: 8, phase: 3.1 },
] as const;

export const HANG_COUNT = 40;

/** Where each of the 40 lime dots hangs at the end of S05. */
export const hangDot = (i: number) => {
  const t = TAGS[i % 3];
  const a = random(`hang-a${i}`) * Math.PI * 2;
  const d = (60 + random(`hang-d${i}`) * 160) * Math.min(t.scale, 1.3);
  return {
    fromX: t.x + 120 * t.scale,
    fromY: t.y,
    x: t.x + 120 * t.scale + Math.cos(a) * d,
    y: t.y + Math.sin(a) * d * 0.7,
    r: 3 + random(`hang-r${i}`) * 4,
  };
};
