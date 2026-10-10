import { Img } from "remotion";
import { ArtKind, ArtSource, cardArt } from "../assets";

type Limb = readonly [number, number, number, number, number]; // x1 y1 x2 y2 width

/** Fallback silhouette (used only if an extra card file is missing). */
const RUNNER: Limb[] = [
  [232, 410, 172, 498, 64],
  [172, 498, 98, 548, 50],
  [98, 548, 78, 528, 30],
  [262, 404, 352, 452, 64],
  [352, 452, 340, 584, 50],
  [340, 584, 388, 596, 30],
  [252, 262, 186, 318, 40],
  [186, 318, 150, 268, 34],
  [288, 248, 248, 392, 124],
  [318, 258, 352, 334, 42],
  [352, 334, 300, 364, 36],
];
const SKIN_LIMBS = [7, 10];

/** Coded fallback artwork for a missing extra card: gradient + rounded-shape silhouette. */
const FallbackArt: React.FC<{ tint: number }> = ({ tint }) => {
  const hue = 200 + tint * 37;
  return (
    <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`fb-sky${tint}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 55% 42%)`} />
          <stop offset="70%" stopColor={`hsl(${hue} 50% 14%)`} />
        </linearGradient>
      </defs>
      <rect width={500} height={700} fill={`url(#fb-sky${tint})`} />
      <path d="M0 500 Q250 470 500 500 L500 700 L0 700 Z" fill={`hsl(${hue + 20} 35% 22%)`} />
      <g strokeLinecap="round" transform="translate(10 20) scale(-1 1) translate(-500 0)">
        {RUNNER.map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={SKIN_LIMBS.includes(i) ? "#B98262" : `hsl(${hue + 40} 40% 72%)`} strokeWidth={l[4]} />
        ))}
        <circle cx={310} cy={182} r={48} fill="#B98262" />
      </g>
    </svg>
  );
};

export const CardArt: React.FC<{ art: ArtSource; style?: React.CSSProperties }> = ({ art, style }) =>
  art.kind === "image" ? (
    <Img src={art.src} style={{ width: "100%", height: "100%", objectFit: art.aspect ? "fill" : "cover", objectPosition: "50% 50%", display: "block", ...style }} />
  ) : (
    <div style={{ width: "100%", height: "100%", ...style }}>
      <FallbackArt tint={art.tint} />
    </div>
  );

export type CardVariant = "card" | "slab";

/**
 * Card face size. `width` is the nominal 5:7 width: the height is always
 * width * 7/5, and art with its own shape (the 3:4 vintage cards) sets the width.
 */
export const cardFaceSize = (width: number, kind?: ArtKind) => {
  const h = (width * 7) / 5;
  const art = kind ? cardArt(kind) : undefined;
  const aspect = art && art.kind === "image" ? art.aspect : undefined;
  return { w: aspect ? h * aspect : width, h };
};

/** Outer size of the card including its top-loader or slab case. */
export const cardOuter = (width: number, variant: CardVariant = "card", kind?: ArtKind) => {
  const { w, h } = cardFaceSize(width, kind);
  if (variant === "slab") return { w: w * 1.18, h: h * 1.08 + width * 0.34 };
  return { w: w * 1.09, h: h * 1.05 + width * 0.05 };
};

/**
 * The hero object: a 5:7 card in a clear rigid top-loader (or a graded slab),
 * with holographic foil tied to rotateY and a glare that moves against the tilt.
 */
export const TradingCard: React.FC<{
  art: ArtKind;
  width: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  glow?: number;
  variant?: CardVariant;
  loader?: boolean;
  foil?: number;
  shine?: number; // -1..2 position of an extra shine sweep (S06)
  face?: React.ReactNode; // overlay drawn on the card face (e.g. wear specks)
  style?: React.CSSProperties;
}> = ({
  art: kind,
  width,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  glow = 0,
  variant = "card",
  loader = true,
  foil = 0.35,
  shine,
  face,
  style,
}) => {
  const art = cardArt(kind);
  const { w: faceW, h } = cardFaceSize(width, kind);
  const outer = cardOuter(width, variant, kind);
  // vintage paper cards: full-bleed art, no foil frame, no silver frame, no rainbow foil
  const vintage = art.kind === "image" && art.vintageBorder;
  const glareX = 50 - rotateY * 2.6;
  const glareY = 40 + rotateX * 2.6;
  const frame = vintage ? 0 : width * 0.035;
  const slab = variant === "slab";
  const labelH = width * 0.26;

  const cardFace = (
    <div
      style={{
        position: "absolute",
        left: (outer.w - faceW) / 2,
        top: slab ? labelH + width * 0.12 : (outer.h - h) / 2 + width * 0.02,
        width: faceW,
        height: h,
        borderRadius: width * 0.045,
        overflow: "hidden",
        background: vintage
          ? "#E9DCBC"
          : `linear-gradient(${135 + rotateY * 2}deg, #D7DCEB 0%, #9AA3C2 22%, #EEF1FA 45%, #8F98B8 70%, #DCE1F0 100%)`,
        boxShadow:
          loader || slab
            ? "0 2px 6px rgba(0,0,0,0.35)"
            : glow > 0
              ? `0 20px 50px rgba(0,0,0,0.45), 0 0 ${36 * glow}px rgba(96,238,121,${0.55 * glow}), 0 0 0 ${2 * glow}px rgba(96,238,121,${0.9 * glow})`
              : "0 20px 50px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: frame,
          borderRadius: width * 0.03,
          overflow: "hidden",
        }}
      >
        <CardArt art={art} />
        {face}
      </div>
      {/* holographic foil */}
      {!vintage && foil > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, #2a1838 0%, #4a2a52 12%, #5a4a22 24%, #1f5a3c 36%, #1c3f63 48%, #3b2462 60%, #5a2a48 72%, #4f4a1e 84%, #1f5a46 100%)",
            backgroundSize: "300% 300%",
            backgroundPosition: `${50 + rotateY * 4}% ${50 + rotateX * 3}%`,
            mixBlendMode: "color-dodge",
            opacity: foil,
          }}
        />
      )}
      {/* glare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 45% at ${glareX}% ${glareY}%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 70%)`,
          mixBlendMode: "screen",
        }}
      />
      {shine !== undefined && shine > -0.5 && shine < 1.5 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, transparent ${shine * 100 - 18}%, rgba(255,255,255,0.75) ${shine * 100}%, transparent ${shine * 100 + 18}%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        width: outer.w,
        height: outer.h,
        position: "relative",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        ...style,
      }}
    >
      {loader || slab ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: slab ? width * 0.07 : width * 0.05,
            background: slab
              ? "linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.10))"
              : "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.07))",
            border: slab ? `${width * 0.025}px solid rgba(225,232,255,0.30)` : "2px solid rgba(225,232,255,0.42)",
            boxShadow: `0 30px 70px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)${
              glow > 0 ? `, 0 0 ${36 * glow}px rgba(96,238,121,${0.55 * glow}), 0 0 0 ${2 * glow}px rgba(96,238,121,${0.9 * glow})` : ""
            }`,
            overflow: "hidden",
          }}
        >
          {slab && (
            <div
              style={{
                position: "absolute",
                left: width * 0.06,
                right: width * 0.06,
                top: width * 0.06,
                height: labelH,
                borderRadius: width * 0.025,
                background: "linear-gradient(180deg, #D5D9E4, #AEB4C6)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            />
          )}
          {!slab && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: width * 0.08,
                background: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))",
                borderBottom: "1.5px solid rgba(255,255,255,0.3)",
              }}
            />
          )}
          {cardFace}
          {/* diagonal reflection streak on the clear plastic */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(120deg, transparent ${28 + rotateY}%, rgba(255,255,255,0.22) ${36 + rotateY}%, transparent ${44 + rotateY}%, transparent ${58 + rotateY}%, rgba(255,255,255,0.10) ${62 + rotateY}%, transparent ${66 + rotateY}%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      ) : (
        cardFace
      )}
    </div>
  );
};
