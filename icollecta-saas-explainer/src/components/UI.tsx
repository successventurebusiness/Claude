import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { UI } from "../fonts";
import { lerpF } from "../lib/anim";
import { C, GLASS, limeShadow, rgba } from "../theme";

export const GlassPanel: React.FC<{
  width: number;
  height: number;
  title?: string;
  headerRight?: React.ReactNode;
  headerHeight?: number;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ width, height, title, headerRight, headerHeight = 64, style, bodyStyle, children }) => (
  <div style={{ ...GLASS, width, height, position: "relative", overflow: "hidden", ...style }}>
    {title !== undefined && (
      <div
        style={{
          height: headerHeight,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 26px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontFamily: UI,
          fontWeight: 600,
          fontSize: 22,
          color: C.white,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 99, background: C.lime, boxShadow: limeShadow(0.6, 10) }} />
        <span>{title}</span>
        <div style={{ flex: 1 }} />
        {headerRight}
      </div>
    )}
    <div style={{ position: "relative", ...bodyStyle }}>{children}</div>
  </div>
);

export const Chip: React.FC<{
  label: string;
  icon?: LucideIcon;
  variant?: "lime" | "glass" | "outline";
  size?: number;
  style?: React.CSSProperties;
}> = ({ label, icon: Icon, variant = "glass", size = 24, style }) => {
  const lime = variant === "lime";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.4,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: 999,
        fontFamily: UI,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: "nowrap",
        color: lime ? C.navy : C.white,
        background: lime ? C.lime : variant === "glass" ? "rgba(28,34,64,0.7)" : "transparent",
        border: lime ? "none" : `1px solid ${variant === "outline" ? rgba(C.lime, 0.7) : "rgba(255,255,255,0.12)"}`,
        boxShadow: lime ? limeShadow(0.35, 20) : "inset 0 1px 0 rgba(255,255,255,0.08)",
        backdropFilter: lime ? undefined : "blur(16px)",
        ...style,
      }}
    >
      {Icon && <Icon size={size * 1.05} strokeWidth={2.4} color={lime ? C.navy : C.lime} />}
      {label}
    </div>
  );
};

export const Button: React.FC<{
  label: string;
  icon?: LucideIcon;
  variant?: "primary" | "outline";
  size?: number;
  hover?: number;
  press?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ label, icon: Icon, variant = "primary", size = 26, hover = 0, press = 0, glow = 0, style }) => {
  const primary = variant === "primary";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.45,
        padding: `${size * 0.62}px ${size * 1.3}px`,
        borderRadius: 999,
        fontFamily: UI,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: "nowrap",
        color: primary ? C.navy : C.white,
        background: primary
          ? `linear-gradient(180deg, #7DF592, ${C.lime})`
          : `rgba(255,255,255,${0.02 + hover * 0.08})`,
        border: primary ? "none" : "1.5px solid rgba(255,255,255,0.35)",
        boxShadow: primary
          ? `0 10px 30px rgba(96,238,121,${0.25 + glow * 0.4}), 0 0 ${20 + glow * 40}px rgba(96,238,121,${0.2 + glow * 0.5}), inset 0 1px 0 rgba(255,255,255,0.5)`
          : "none",
        transform: `scale(${1 - press * 0.04})`,
        ...style,
      }}
    >
      {Icon && <Icon size={size * 1.05} strokeWidth={2.5} />}
      {label}
    </div>
  );
};

/** Clean white arrow cursor with a dark outline; tip at (x, y). */
export const Cursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  click?: number; // ripple progress 0..1 (0 = none)
  press?: number;
  opacity?: number;
}> = ({ x, y, scale = 1, click = 0, press = 0, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity, zIndex: 50 }}>
    {click > 0 && click < 1 && (
      <div
        style={{
          position: "absolute",
          left: -40 * scale,
          top: -40 * scale,
          width: 80 * scale,
          height: 80 * scale,
          borderRadius: 999,
          border: `${3 * (1 - click) + 1}px solid ${C.lime}`,
          transform: `scale(${0.3 + click * 1.2})`,
          opacity: 1 - click,
          boxShadow: limeShadow(0.6 * (1 - click), 18),
        }}
      />
    )}
    <svg
      width={34 * scale}
      height={44 * scale}
      viewBox="0 0 34 44"
      style={{
        position: "absolute",
        left: -3 * scale,
        top: -2 * scale,
        transform: `scale(${1 - press * 0.12})`,
        transformOrigin: "3px 2px",
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))",
      }}
    >
      <path
        d="M3 2 L3 34 L11.5 26.5 L17 40 L23 37.5 L17.5 24.5 L29 24.5 Z"
        fill="#FFFFFF"
        stroke="#121833"
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/** Lime ring for phone taps; progress 0..1. */
export const TapRipple: React.FC<{ x: number; y: number; progress: number; size?: number }> = ({
  x,
  y,
  progress,
  size = 90,
}) =>
  progress <= 0 || progress >= 1 ? null : (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: 999,
        border: `${4 * (1 - progress) + 1}px solid ${C.lime}`,
        background: `rgba(96,238,121,${0.25 * (1 - progress)})`,
        transform: `scale(${0.3 + progress * 1.1})`,
        opacity: 1 - progress * 0.9,
        boxShadow: limeShadow(0.5 * (1 - progress), 20),
        pointerEvents: "none",
      }}
    />
  );

export const Toast: React.FC<{ label: string; icon?: LucideIcon; style?: React.CSSProperties }> = ({
  label,
  icon: Icon = Check,
  style,
}) => (
  <div
    style={{
      ...GLASS,
      borderRadius: 18,
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 24px 16px 16px",
      fontFamily: UI,
      fontWeight: 600,
      fontSize: 22,
      color: C.white,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 99,
        background: C.lime,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: limeShadow(0.5, 14),
      }}
    >
      <Icon size={20} strokeWidth={3} color={C.navy} />
    </div>
    {label}
  </div>
);

/** Lime outline trace + soft pulse: the "entering iCollecta" motion signature. */
export const LimeTrace: React.FC<{
  progress: number; // 0..1 trace, then pulse fades
  width: number;
  height: number;
  radius?: number;
  pulse?: number;
}> = ({ progress, width, height, radius = 16, pulse = 0 }) => {
  if (progress <= 0) return null;
  const per = 2 * (width + height);
  return (
    <svg
      width={width + 8}
      height={height + 8}
      style={{ position: "absolute", left: -4, top: -4, overflow: "visible", pointerEvents: "none" }}
    >
      <rect
        x={4}
        y={4}
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke={C.lime}
        strokeWidth={2.5}
        strokeDasharray={per}
        strokeDashoffset={per * (1 - Math.min(progress, 1))}
        style={{ filter: `drop-shadow(0 0 ${8 + pulse * 16}px rgba(96,238,121,${0.5 + pulse * 0.4}))` }}
        opacity={lerpF(progress, [1, 2], [1, 0.0])}
      />
    </svg>
  );
};
