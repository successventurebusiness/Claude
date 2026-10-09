import { evolvePath } from "@remotion/paths";
import { Check, type LucideIcon } from "lucide-react";
import { random } from "remotion";
import { HEAD, UI } from "../fonts";
import { lerpF } from "../lib/anim";
import { C, GLASS, limeShadow, rgba } from "../theme";
import { CardArt } from "./TradingCard";
import { cardArt, ArtKind, AvatarSource } from "../assets";
import { Img } from "remotion";
import { useId } from "react";

// ---------------------------------------------------------------- Avatar

export const Avatar: React.FC<{ who: AvatarSource; size: number; ring?: boolean; style?: React.CSSProperties }> = ({
  who,
  size,
  ring,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 ${Math.max(2, size * 0.03)}px ${C.lime}, ${limeShadow(0.4, 16)}` : "0 0 0 2px rgba(255,255,255,0.15)",
      background: who.src
        ? C.panel
        : `linear-gradient(140deg, hsl(${who.hue} 60% 58%), hsl(${who.hue + 40} 55% 32%))`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: UI,
      fontWeight: 700,
      fontSize: size * 0.36,
      color: C.white,
      ...style,
    }}
  >
    {who.src ? <Img src={who.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : who.initials}
  </div>
);

// ---------------------------------------------------------------- Counter

export type CounterFormat = "int" | "items" | "usd" | "usdShort" | "grade" | "pct";

export const formatValue = (v: number, format: CounterFormat) => {
  switch (format) {
    case "items":
      return `${Math.round(v).toLocaleString("en-US")} items`;
    case "usd":
      return `$${Math.round(v).toLocaleString("en-US")}`;
    case "usdShort":
      return `$${Math.round(v)}`;
    case "grade":
      return v.toFixed(1);
    case "pct":
      return `${v.toFixed(1)}%`;
    default:
      return Math.round(v).toLocaleString("en-US");
  }
};

/** Rolling number: the last digit rolls vertically while counting. */
export const Counter: React.FC<{
  value: number;
  format?: CounterFormat;
  style?: React.CSSProperties;
  rolling?: boolean;
}> = ({ value, format = "int", style, rolling = true }) => {
  const text = formatValue(value, format);
  const frac = value - Math.floor(value);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", display: "inline-block", whiteSpace: "nowrap", ...style }}>
      {rolling ? (
        <span style={{ display: "inline-block", transform: `translateY(${(frac - 0.5) * -6}%)` }}>{text}</span>
      ) : (
        text
      )}
    </span>
  );
};

// ---------------------------------------------------------------- Gauge

export const Gauge: React.FC<{
  progress: number; // 0..1
  size: number;
  stroke?: number;
  children?: React.ReactNode;
}> = ({ progress, size, stroke = 16, children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.lime}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          style={{ filter: "drop-shadow(0 0 10px rgba(96,238,121,0.6))" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- LineChart

export const smoothPath = (pts: readonly (readonly [number, number])[]) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return d;
};

export const LineChart: React.FC<{
  points: readonly (readonly [number, number])[];
  width: number;
  height: number;
  progress: number; // 0..1 draw
  pingFrame?: number; // frames since end reached (for the pinging dot)
  area?: boolean;
  strokeWidth?: number;
}> = ({ points, width, height, progress, pingFrame = -1, area = true, strokeWidth = 4 }) => {
  const d = smoothPath(points);
  const evolved = evolvePath(Math.max(progress, 0.0001), d);
  const last = points[points.length - 1];
  const ringP = pingFrame >= 0 ? (pingFrame % 24) / 24 : -1;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lc-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.lime} stopOpacity={0.28} />
          <stop offset="100%" stopColor={C.lime} stopOpacity={0} />
        </linearGradient>
        <clipPath id="lc-clip">
          <rect x={0} y={-20} width={width * progress} height={height + 40} />
        </clipPath>
      </defs>
      {area && (
        <path d={`${d} L ${last[0]} ${height} L ${points[0][0]} ${height} Z`} fill="url(#lc-area)" clipPath="url(#lc-clip)" />
      )}
      <path
        d={d}
        fill="none"
        stroke={C.lime}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
        style={{ filter: "drop-shadow(0 0 8px rgba(96,238,121,0.6))" }}
      />
      {progress >= 1 && (
        <>
          <circle cx={last[0]} cy={last[1]} r={8} fill={C.lime} />
          {ringP >= 0 && (
            <circle cx={last[0]} cy={last[1]} r={8 + ringP * 22} fill="none" stroke={C.lime} strokeWidth={2} opacity={1 - ringP} />
          )}
        </>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------- Stepper

export const Stepper: React.FC<{
  labels: readonly string[];
  fills: readonly number[]; // 0..1 per node
  width: number;
}> = ({ labels, fills, width }) => {
  const n = labels.length;
  const gap = width / (n - 1);
  const lineFill = fills.reduce((acc, f, i) => (i === 0 ? acc : acc + Math.min(f, 1)), 0) / (n - 1);
  return (
    <div style={{ width, height: 110, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 26, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.12)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 26,
          height: 4,
          width: width * lineFill,
          borderRadius: 4,
          background: C.lime,
          boxShadow: limeShadow(0.6, 12),
        }}
      />
      {labels.map((l, i) => {
        const f = Math.min(fills[i] ?? 0, 1);
        return (
          <div key={l} style={{ position: "absolute", left: i * gap - 80, top: 0, width: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 99,
                background: f > 0.5 ? C.lime : C.panel,
                border: `3px solid ${f > 0 ? C.lime : "rgba(255,255,255,0.18)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${1 + Math.sin(f * Math.PI) * 0.18})`,
                boxShadow: f > 0.5 ? limeShadow(0.6, 18) : "none",
              }}
            >
              {f > 0.5 ? <Check size={30} strokeWidth={3.5} color={C.navy} /> : <div style={{ width: 10, height: 10, borderRadius: 9, background: "rgba(255,255,255,0.3)" }} />}
            </div>
            <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 22, color: f > 0.5 ? C.white : C.grey }}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Badges & tiles

export const ValueBadge: React.FC<{ label: string; value: React.ReactNode; sub?: string; subOpacity?: number; glow?: number }> = ({
  label,
  value,
  sub,
  subOpacity = 1,
  glow = 0,
}) => (
  <div
    style={{
      ...GLASS,
      borderRadius: 22,
      border: `2px solid ${C.lime}`,
      padding: "20px 30px",
      boxShadow: `${GLASS.boxShadow}, 0 0 ${30 + glow * 50}px rgba(96,238,121,${0.25 + glow * 0.45})`,
      minWidth: 300,
    }}
  >
    <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 20, color: C.grey, letterSpacing: 0.4 }}>{label}</div>
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 72, color: C.lime, lineHeight: 1.05 }}>{value}</div>
    {sub && <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 20, color: C.white, opacity: subOpacity * 0.8 }}>{sub}</div>}
  </div>
);

export const SubgradeTile: React.FC<{ label: string; value: React.ReactNode; strong?: boolean }> = ({ label, value, strong }) => (
  <div
    style={{
      ...GLASS,
      width: 240,
      height: 120,
      borderRadius: 20,
      padding: "18px 24px",
      boxSizing: "border-box",
      border: strong ? `2.5px solid ${C.lime}` : `1px solid ${rgba(C.lime, 0.35)}`,
      boxShadow: `${GLASS.boxShadow}${strong ? `, 0 0 30px rgba(96,238,121,0.45)` : ""}`,
    }}
  >
    <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 22, color: C.grey }}>{label}</div>
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 48, color: strong ? C.lime : C.white, lineHeight: 1.1 }}>{value}</div>
  </div>
);

// ---------------------------------------------------------------- PriceTag

/** Paper tag on a string; `reel` is a continuous index into `values`. */
export const PriceTag: React.FC<{
  values: readonly string[];
  reel: number;
  final: string;
  landed: number; // 0..1, crossfade to the final value
  scale?: number;
  stringLength?: number;
  blur?: number; // vertical motion blur of the reel, px
}> = ({ values, reel, final, landed, scale = 1, stringLength = 600, blur = 0 }) => {
  const fid = useId().replace(/:/g, "");
  const w = 240 * scale;
  const h = 130 * scale;
  const rowH = 70 * scale;
  const idx = Math.floor(reel);
  const frac = reel - idx;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* string up out of frame */}
      <div style={{ position: "absolute", left: 30 * scale, bottom: h / 2, width: 2, height: stringLength, background: "rgba(230,232,240,0.6)" }} />
      <svg width={w} height={h} viewBox="0 0 240 130" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.45))" }}>
        <path d="M0 65 L40 8 Q44 2 52 2 L228 2 Q238 2 238 12 L238 118 Q238 128 228 128 L52 128 Q44 128 40 122 Z" fill="#EDE8DC" />
        <path d="M0 65 L40 8 Q44 2 52 2 L228 2 Q238 2 238 12 L238 118 Q238 128 228 128 L52 128 Q44 128 40 122 Z" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2} />
        <circle cx={30} cy={65} r={9} fill="#121833" opacity={0.85} />
        <circle cx={30} cy={65} r={12} fill="none" stroke="#C9C1AE" strokeWidth={3} />
      </svg>
      {blur > 0.3 && (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={`rb${fid}`} x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation={`0 ${blur}`} />
          </filter>
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: 62 * scale,
          top: (h - rowH) / 2,
          width: 166 * scale,
          height: rowH,
          overflow: "hidden",
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 50 * scale,
          color: C.navy,
          textAlign: "center",
          lineHeight: `${rowH}px`,
        }}
      >
        <div
          style={{
            transform: `translateY(${-frac * rowH}px)`,
            filter: blur > 0.3 ? `url(#rb${fid})` : undefined,
            opacity: 1 - landed,
          }}
        >
          {[0, 1].map((k) => (
            <div key={k} style={{ height: rowH }}>
              {values[(idx + k) % values.length]}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: landed, transform: `translateY(${(1 - landed) * 30}%)` }}>{final}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Gate

export const Gate: React.FC<{
  icon: LucideIcon;
  label: string;
  lit: number; // 0..1 lit
  flare: number; // 0..1 flare pulse
  size?: number;
}> = ({ icon: Icon, label, lit, flare, size = 300 }) => {
  const s = 1 + Math.sin(Math.min(flare, 1) * Math.PI) * 0.15;
  const ringColor = lit > 0 ? C.lime : "rgba(255,255,255,0.25)";
  return (
    <div style={{ position: "relative", width: size, height: size * 1.35 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: size * 0.35,
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${10}px solid ${ringColor}`,
          boxShadow:
            lit > 0
              ? `0 0 ${30 + flare * 80}px rgba(96,238,121,${0.5 + (1 - flare) * 0.2}), inset 0 0 ${30 + flare * 40}px rgba(96,238,121,0.45)`
              : "0 0 20px rgba(255,255,255,0.08)",
          transform: `scale(${s})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: size / 2,
          top: 0,
          transform: `translate(-50%, ${(1 - lit) * 20}px) scale(${0.6 + lit * 0.4})`,
          opacity: lit,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 34,
          color: C.white,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: C.lime,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: limeShadow(0.6, 18),
          }}
        >
          <Icon size={30} strokeWidth={2.6} color={C.navy} />
        </div>
        {label}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Listing tile

/** Generic listing tile with art, a title bar and a price bar. */
export const ListingTile: React.FC<{
  art?: ArtKind;
  width: number;
  height: number;
  content?: React.ReactNode;
  price?: string;
  dot?: boolean;
  seed?: number;
}> = ({ art, width, height, content, price, dot = true, seed = 0 }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 16,
      background: C.panel,
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
    }}
  >
    <div style={{ position: "absolute", left: 10, right: 10, top: 10, bottom: height * 0.26, borderRadius: 10, overflow: "hidden", background: "#0E1329" }}>
      {content ?? (art ? <CardArt art={cardArt(art)} /> : null)}
    </div>
    <div style={{ position: "absolute", left: 14, bottom: height * 0.14, width: width * (0.45 + random(`lt${seed}`) * 0.3), height: height * 0.035, borderRadius: 6, background: "rgba(255,255,255,0.35)" }} />
    {price ? (
      <div style={{ position: "absolute", left: 14, bottom: height * 0.035, fontFamily: UI, fontWeight: 700, fontSize: height * 0.07, color: C.white }}>{price}</div>
    ) : (
      <div style={{ position: "absolute", left: 14, bottom: height * 0.05, width: width * 0.3, height: height * 0.035, borderRadius: 6, background: rgba(C.lime, 0.7) }} />
    )}
    {dot && <div style={{ position: "absolute", right: 14, bottom: height * 0.05, width: 12, height: 12, borderRadius: 9, background: C.lime, boxShadow: limeShadow(0.7, 8) }} />}
  </div>
);

export const tickProgress = (frame: number, at: number) => lerpF(frame, [at, at + 8], [0, 1]);
