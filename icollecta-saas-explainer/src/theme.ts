import { Easing } from "remotion";

export const C = {
  navy: "#121833",
  lime: "#60EE79",
  panel: "#1C2240",
  slate: "#3A4A78",
  white: "#FFFFFF",
  grey: "#A9B0C8",
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export const LIME_GLOW = "drop-shadow(0 0 24px rgba(96,238,121,0.45))";
export const limeShadow = (a = 0.45, r = 24) => `0 0 ${r}px rgba(96,238,121,${a})`;

export const GLASS: React.CSSProperties = {
  background: "rgba(28,34,64,0.55)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 30px 80px rgba(0,0,0,0.45)",
  borderRadius: 24,
};

export const RADIUS = { panel: 24, card: 16, pill: 999 } as const;

export const W = 1920;
export const H = 1080;
export const SAFE = { x: 96, y: 54 } as const;

// Motion rules (spec section 5)
export const EASE_ENTER = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_CAMERA = Easing.bezier(0.65, 0, 0.35, 1);
export const SPRING_POP = { damping: 14, stiffness: 180, mass: 0.6 } as const;
export const SPRING_PANEL = { damping: 20, stiffness: 120, mass: 1 } as const;
export const STAGGER = 3;
