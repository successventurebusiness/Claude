import { noise2D } from "@remotion/noise";
import { interpolate, spring } from "remotion";
import { EASE_CAMERA, EASE_ENTER, SPRING_PANEL, SPRING_POP } from "../theme";

type Ease = (t: number) => number;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Clamped interpolate with the entrance ease by default. */
export const ease = (
  frame: number,
  input: readonly number[],
  output: readonly number[],
  easing: Ease = EASE_ENTER,
) => interpolate(frame, input as number[], output as number[], { ...CLAMP, easing });

/** Clamped linear interpolate. */
export const lerpF = (frame: number, input: readonly number[], output: readonly number[]) =>
  interpolate(frame, input as number[], output as number[], CLAMP);

/** Camera moves use the in-out camera ease. */
export const cam = (frame: number, input: readonly number[], output: readonly number[]) =>
  ease(frame, input, output, EASE_CAMERA);

export const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: SPRING_POP });

export const panel = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: SPRING_PANEL });

/** Spec exit: 6-frame fade + 4px blur. */
export const exitStyle = (frame: number, start: number): React.CSSProperties => {
  const p = lerpF(frame, [start, start + 6], [0, 1]);
  return p <= 0 ? {} : { opacity: 1 - p, filter: `blur(${p * 4}px)` };
};

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const quad = (
  p0: readonly [number, number],
  c: readonly [number, number],
  p1: readonly [number, number],
  t: number,
): [number, number] => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
};

/** Smooth noise in [-1, 1] for a given seed, frame and speed. */
export const drift = (seed: string, frame: number, speed = 0.01, lane = 0) =>
  noise2D(seed, frame * speed, lane);

/** Ping: 0..1 progress of a short pulse starting at `at`. */
export const ping = (frame: number, at: number, len = 14) => lerpF(frame, [at, at + len], [0, 1]);

/** Pulse value that goes 0 -> 1 -> 0 over [a, b]. */
export const bump = (frame: number, a: number, b: number) =>
  lerpF(frame, [a, (a + b) / 2, b], [0, 1, 0]);
