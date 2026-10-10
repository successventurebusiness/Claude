import { noise2D } from "@remotion/noise";
import type { ArtKind } from "../assets";
import type { CollectibleKind } from "../components/Collectible";
import { cardOuter } from "../components/TradingCard";
import { cam } from "../lib/anim";

// Shared by S01A (scattered) and S01B (flies into "My Collection").

export type ScatterItem = {
  id: string;
  type: "card" | "slab" | CollectibleKind;
  art?: ArtKind;
  size: number; // nominal width
  x: number;
  y: number;
  depth: "far" | "mid" | "near";
  rotZ: number;
  rotY: number;
};

export const DEPTH_Z = { far: -520, mid: 0, near: 330 } as const;
export const DEPTH_BLUR = { far: 10, mid: 0, near: 6 } as const;
export const PERSPECTIVE = 1600;
export const SCATTER_DURATION = 129;
export const SCATTER_PUSH = 260;

// Order = order of landing in S01B (hero first into the top-left slot).
export const SCATTER: ScatterItem[] = [
  { id: "hero", type: "card", art: "hero", size: 210, x: 1150, y: 520, depth: "mid", rotZ: 6, rotY: -16 },
  { id: "slab", type: "slab", art: "extra-3", size: 150, x: 700, y: 700, depth: "mid", rotZ: -9, rotY: 12 },
  { id: "cardA", type: "card", art: "extra-1", size: 140, x: 440, y: 360, depth: "mid", rotZ: -14, rotY: 10 },
  { id: "coin", type: "coin", size: 130, x: 640, y: 240, depth: "far", rotZ: 0, rotY: 25 },
  { id: "baseball", type: "baseball", size: 130, x: 1420, y: 830, depth: "mid", rotZ: 12, rotY: 0 },
  { id: "cardB", type: "card", art: "extra-4", size: 160, x: 1580, y: 340, depth: "far", rotZ: 11, rotY: -12 },
  { id: "comic", type: "comic", size: 260, x: 330, y: 600, depth: "near", rotZ: -8, rotY: 18 },
  { id: "sheet", type: "sheet", size: 200, x: 960, y: 880, depth: "mid", rotZ: -6, rotY: 8 },
  { id: "sticky", type: "sticky", size: 120, x: 1300, y: 190, depth: "far", rotZ: 9, rotY: -10 },
  { id: "photo", type: "photo", art: "extra-2", size: 170, x: 1690, y: 610, depth: "mid", rotZ: 7, rotY: -14 },
  { id: "cardC", type: "card", art: "extra-6", size: 260, x: 1620, y: 830, depth: "near", rotZ: 16, rotY: -20 },
  { id: "cartridge", type: "cartridge", size: 120, x: 380, y: 720, depth: "far", rotZ: -12, rotY: 14 },
];

/** Nominal outer size (w, h) of an item at scale 1. */
export const itemSize = (it: ScatterItem) => {
  switch (it.type) {
    case "card":
      return cardOuter(it.size, "card", it.art);
    case "slab":
      return cardOuter(it.size, "slab", it.art);
    case "comic":
      return { w: it.size, h: it.size * 1.45 };
    case "sheet":
      return { w: it.size, h: it.size * 0.75 };
    case "photo":
      return { w: it.size, h: it.size * 0.8 };
    case "cartridge":
      return { w: it.size, h: it.size * 1.1 };
    case "jersey":
      return { w: it.size, h: it.size * 1.2 };
    default:
      return { w: it.size, h: it.size };
  }
};

/** Noise drift: rotZ +-6, rotY +-18, y +-12, each object at its own speed. */
export const scatterDrift = (it: ScatterItem, frame: number, i: number) => {
  const sp = 0.012 + (i % 5) * 0.004;
  return {
    rotZ: it.rotZ + noise2D(`rz${it.id}`, frame * sp, 0) * 6,
    rotY: it.rotY + noise2D(`ry${it.id}`, frame * sp, 1) * 18,
    dy: noise2D(`dy${it.id}`, frame * sp * 0.8, 2) * 12,
  };
};

export const scatterCameraZ = (frame: number) => cam(frame, [0, SCATTER_DURATION], [0, SCATTER_PUSH]);

/** Projected 2D screen pose of an item at a given S01A frame. */
export const scatterScreenPose = (it: ScatterItem, frame: number, i: number) => {
  const z = DEPTH_Z[it.depth] + scatterCameraZ(frame);
  const k = PERSPECTIVE / (PERSPECTIVE - z);
  const d = scatterDrift(it, frame, i);
  return {
    x: 960 + (it.x - 960) * k,
    y: 540 + (it.y + d.dy - 540) * k,
    scale: k,
    rotZ: d.rotZ,
    rotY: d.rotY,
    blur: DEPTH_BLUR[it.depth],
    opacity: it.depth === "far" ? 0.5 : 1,
  };
};

/** Final S01A positions, the starting point of S01B. */
export const SCATTER_END = SCATTER.map((it, i) => scatterScreenPose(it, SCATTER_DURATION, i));
