import { noise2D } from "@remotion/noise";
import { useId } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { lerpF } from "../lib/anim";
import { C, H, W } from "../theme";

// ---------------------------------------------------------------- Background

/** Navy base, drifting dot grid, act-driven lime glow, noise-driven gradient. */
export const Background: React.FC<{ glow: number; frame: number; saturation?: number }> = ({ glow, frame, saturation = 1 }) => {
  const nx = noise2D("bg-x", frame * 0.004, 0) * 220;
  const ny = noise2D("bg-y", 0, frame * 0.004) * 140;
  const nx2 = noise2D("bg-x2", frame * 0.003, 3) * 260;
  return (
    <AbsoluteFill style={{ background: C.navy, overflow: "hidden", filter: saturation < 1 ? `saturate(${saturation})` : undefined }}>
      <div
        style={{
          position: "absolute",
          left: 300 + nx,
          top: 80 + ny,
          width: 1100,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(58,74,120,0.55), rgba(58,74,120,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1000 + nx2,
          top: -200 - ny,
          width: 1200,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(28,34,64,0.9), rgba(28,34,64,0))",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,1) 1.4px, transparent 1.6px)",
          backgroundSize: "44px 44px",
          backgroundPosition: `${(frame * 0.35) % 44}px ${(frame * 0.18) % 44}px`,
          opacity: 0.06,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: W / 2 - 1100,
          top: H - 420,
          width: 2200,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(96,238,121,${0.55 * glow}), rgba(96,238,121,${0.18 * glow}) 45%, rgba(96,238,121,0) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Grain & vignette

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 997} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.35 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(5,7,18,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Full-frame radial flash (lime-white). */
export const Flash: React.FC<{ opacity: number; x?: number; y?: number; radius?: number }> = ({ opacity, x = W / 2, y = H / 2, radius = 1400 }) =>
  opacity <= 0.001 ? null : (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle ${radius}px at ${x}px ${y}px, rgba(255,255,255,${opacity}) 0%, rgba(205,255,214,${opacity * 0.9}) 35%, rgba(96,238,121,${opacity * 0.55}) 70%, rgba(96,238,121,${opacity * 0.25}) 100%)`,
        pointerEvents: "none",
      }}
    />
  );

// ---------------------------------------------------------------- DirectionalBlur

/** SVG blur along one axis (whip pans). amount in px. */
export const DirectionalBlur: React.FC<{
  amount: number;
  axis?: "x" | "y";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ amount, axis = "x", children, style }) => {
  const id = useId().replace(/:/g, "");
  const a = Math.max(0, amount);
  return (
    <AbsoluteFill style={style}>
      {a > 0.2 && (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={`db${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={axis === "x" ? `${a} 0` : `0 ${a}`} />
          </filter>
        </svg>
      )}
      <AbsoluteFill style={{ filter: a > 0.2 ? `url(#db${id})` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- LightSweep

export const LightSweep: React.FC<{ progress: number; width?: number }> = ({ progress, width = 520 }) =>
  progress <= 0 || progress >= 1 ? null : (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -width - 300 + progress * (W + width + 600),
          width,
          height: H + 400,
          transform: "skewX(-18deg)",
          background:
            "linear-gradient(90deg, rgba(96,238,121,0) 0%, rgba(96,238,121,0.28) 40%, rgba(230,255,235,0.55) 50%, rgba(96,238,121,0.28) 60%, rgba(96,238,121,0) 100%)",
          mixBlendMode: "screen",
          filter: "blur(6px)",
        }}
      />
    </AbsoluteFill>
  );

// ---------------------------------------------------------------- ScanLine

/** Lime scan line at `progress` (0..1) of the box height, revealing a grid behind. */
export const ScanLine: React.FC<{
  width: number;
  height: number;
  progress: number;
  grid?: boolean;
  horizontal?: boolean;
  opacity?: number;
}> = ({ width, height, progress, grid = true, horizontal = true, opacity = 1 }) => {
  const pos = (horizontal ? height : width) * progress;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none", opacity }}>
      {grid && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: horizontal ? width : pos,
            height: horizontal ? pos : height,
            backgroundImage:
              "linear-gradient(rgba(96,238,121,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(96,238,121,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: horizontal
              ? "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.9))"
              : "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.9))",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: horizontal ? 0 : pos - 90,
          top: horizontal ? pos - 90 : 0,
          width: horizontal ? width : 90,
          height: horizontal ? 90 : height,
          background: horizontal
            ? "linear-gradient(180deg, rgba(96,238,121,0), rgba(96,238,121,0.35))"
            : "linear-gradient(90deg, rgba(96,238,121,0), rgba(96,238,121,0.35))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: horizontal ? -10 : pos - 2,
          top: horizontal ? pos - 2 : -10,
          width: horizontal ? width + 20 : 4,
          height: horizontal ? 4 : height + 20,
          background: "#C9FFD3",
          boxShadow: "0 0 18px 4px rgba(96,238,121,0.9), 0 0 50px 10px rgba(96,238,121,0.45)",
          borderRadius: 4,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------- ScanBrackets

/** Four lime L-corners around a w x h box; `fly[i]` 0..1 per corner (0 = at 140% offset). */
export const ScanBrackets: React.FC<{ width: number; height: number; fly: readonly number[]; pulse?: number; arm?: number }> = ({
  width,
  height,
  fly,
  pulse = 0,
  arm = 70,
}) => {
  const corners = [
    { x: 0, y: 0, sx: 1, sy: 1 },
    { x: width, y: 0, sx: -1, sy: 1 },
    { x: width, y: height, sx: -1, sy: -1 },
    { x: 0, y: height, sx: 1, sy: -1 },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none" }}>
      {corners.map((c, i) => {
        const p = fly[i] ?? 0;
        const off = (1 - p) * 0.4;
        const dx = -c.sx * width * off;
        const dy = -c.sy * height * off;
        return (
          <svg
            key={i}
            width={arm + 10}
            height={arm + 10}
            style={{
              position: "absolute",
              left: c.x - (c.sx > 0 ? 5 : arm + 5) + dx,
              top: c.y - (c.sy > 0 ? 5 : arm + 5) + dy,
              opacity: Math.min(1, p * 3),
              overflow: "visible",
              filter: `drop-shadow(0 0 ${8 + pulse * 14}px rgba(96,238,121,0.8))`,
            }}
          >
            <path
              d={
                c.sx > 0 && c.sy > 0
                  ? `M5 ${arm + 5} L5 5 L${arm + 5} 5`
                  : c.sx < 0 && c.sy > 0
                    ? `M5 5 L${arm + 5} 5 L${arm + 5} ${arm + 5}`
                    : c.sx < 0 && c.sy < 0
                      ? `M${arm + 5} 5 L${arm + 5} ${arm + 5} L5 ${arm + 5}`
                      : `M5 5 L5 ${arm + 5} L${arm + 5} ${arm + 5}`
              }
              stroke={C.lime}
              strokeWidth={7}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Magnifier

/**
 * Circle at (x, y) showing a `zoom`x duplicate of `children`, which must be
 * the same content laid out in the same coordinate space as the original.
 */
export const Magnifier: React.FC<{
  x: number;
  y: number;
  radius?: number;
  zoom?: number;
  opacity?: number;
  scale?: number;
  children: React.ReactNode;
  width: number;
  height: number;
  lookX?: number; // point being magnified (defaults to the lens centre)
  lookY?: number;
}> = ({ x, y, radius = 110, zoom = 3, opacity = 1, scale = 1, width, height, children, lookX = x, lookY = y }) => {
  const r = radius * scale;
  if (opacity <= 0 || r <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `circle(${r}px at ${x}px ${y}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#0E1329" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width, height, transform: `translate(${x - lookX}px, ${y - lookY}px) scale(${zoom})`, transformOrigin: `${lookX}px ${lookY}px` }}>
          {children}
        </div>
        <div
          style={{
            position: "absolute",
            left: x - r,
            top: y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          border: `2px solid ${C.lime}`,
          boxShadow: "0 0 24px rgba(96,238,121,0.55), 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 6px rgba(255,255,255,0.06)",
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------- Particles

export type Particle = { x: number; y: number; r: number; o: number };

/** Deterministic particle field. */
export const ParticleField: React.FC<{
  count: number;
  seed: string;
  frame: number;
  mode: "rise" | "stream" | "float";
  speed?: number;
  color?: string;
  size?: [number, number];
  opacity?: number;
  area?: { x: number; y: number; w: number; h: number };
}> = ({ count, seed, frame, mode, speed = 1, color = C.lime, size = [2, 5], opacity = 1, area = { x: 0, y: 0, w: W, h: H } }) => {
  const parts = Array.from({ length: count }, (_, i) => {
    const rx = random(`${seed}x${i}`);
    const ry = random(`${seed}y${i}`);
    const rs = random(`${seed}s${i}`);
    const r = size[0] + rs * (size[1] - size[0]);
    let x = area.x + rx * area.w;
    let y = area.y + ry * area.h;
    let len = 0;
    if (mode === "rise") {
      y = area.y + ((((ry * area.h - frame * speed * (0.6 + rs)) % area.h) + area.h) % area.h);
      x += Math.sin(frame * 0.02 + i) * 12;
    } else if (mode === "stream") {
      const v = speed * (8 + rs * 22);
      x = area.x + ((((rx * area.w - frame * v) % area.w) + area.w) % area.w);
      len = v * 3;
    } else {
      x += noise2D(`${seed}fx${i}`, frame * 0.01, 0) * 30;
      y += noise2D(`${seed}fy${i}`, frame * 0.01, 1) * 30;
    }
    return { x, y, r, len, o: 0.25 + rs * 0.75, i };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {parts.map((p) => (
        <div
          key={p.i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.len > 0 ? p.len : p.r * 2,
            height: p.r * (p.len > 0 ? 0.8 : 2),
            borderRadius: 99,
            background: p.len > 0 ? `linear-gradient(90deg, ${color}, rgba(96,238,121,0))` : color,
            opacity: p.o,
            boxShadow: `0 0 ${p.r * 3}px ${color}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Deterministic burst of `count` dots from (x, y), progress 0..1, decelerating. */
export const Burst: React.FC<{
  x: number;
  y: number;
  count: number;
  seed: string;
  progress: number;
  distance?: number;
  size?: number;
  color?: string;
  gravity?: number;
}> = ({ x, y, count, seed, progress, distance = 320, size = 6, color = C.lime, gravity = 0 }) => {
  if (progress <= 0 || progress >= 1) return null;
  const e = 1 - Math.pow(1 - progress, 3);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const d = distance * (0.4 + random(`${seed}d${i}`) * 0.6);
        const s = size * (0.5 + random(`${seed}s${i}`));
        const px = x + Math.cos(a) * d * e;
        const py = y + Math.sin(a) * d * e + gravity * progress * progress;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - s / 2,
              top: py - s / 2,
              width: s,
              height: s,
              borderRadius: 99,
              background: color,
              opacity: lerpF(progress, [0, 0.6, 1], [1, 0.9, 0]),
              boxShadow: `0 0 ${s * 2}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

/** Expanding ring ping at (x, y). */
export const RingPing: React.FC<{ x: number; y: number; progress: number; size?: number; color?: string; width?: number }> = ({
  x,
  y,
  progress,
  size = 120,
  color = C.lime,
  width = 3,
}) =>
  progress <= 0 || progress >= 1 ? null : (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${width}px solid ${color}`,
        transform: `scale(${0.2 + progress})`,
        opacity: 1 - progress,
        boxShadow: `0 0 20px ${color}`,
        pointerEvents: "none",
      }}
    />
  );
