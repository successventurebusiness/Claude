import { Img } from "remotion";
import { ArtKind, ArtSource, cardArt } from "../assets";

type Limb = readonly [number, number, number, number, number]; // x1 y1 x2 y2 width

/** Hero fallback: running back (navy uniform, lime trim) cutting right. */
const RUNNER: Limb[] = [
  [232, 410, 172, 498, 64], // back thigh
  [172, 498, 98, 548, 50], // back shin
  [98, 548, 78, 528, 30], // back foot
  [262, 404, 352, 452, 64], // front thigh
  [352, 452, 340, 584, 50], // front shin
  [340, 584, 388, 596, 30], // front foot
  [252, 262, 186, 318, 40], // back upper arm
  [186, 318, 150, 268, 34], // back forearm
  [288, 248, 248, 392, 124], // torso
  [318, 258, 352, 334, 42], // front upper arm
  [352, 334, 300, 364, 36], // front forearm
];

/** Trade fallback: vintage dunk (red jersey), rising to the hoop. */
const DUNKER: Limb[] = [
  [246, 470, 196, 560, 58],
  [196, 560, 216, 640, 44],
  [272, 466, 330, 530, 58],
  [330, 530, 300, 610, 44],
  [262, 300, 254, 450, 116],
  [240, 300, 180, 380, 36],
  [180, 380, 168, 450, 32],
  [290, 290, 326, 200, 38],
  [326, 200, 352, 118, 34],
];

const Figure: React.FC<{ limbs: Limb[]; body: string; skin: string; trim: string; rim: string; head: [number, number] }> = ({
  limbs,
  body,
  skin,
  trim,
  rim,
  head,
}) => {
  const isSkin = (i: number, n: number) => (n === 11 ? i === 7 || i === 10 : i === 6 || i === 8);
  return (
    <g strokeLinecap="round">
      {/* rim light */}
      <g transform="translate(-7 -4)" opacity={0.85}>
        {limbs.map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={rim} strokeWidth={l[4] + 6} />
        ))}
        <circle cx={head[0]} cy={head[1]} r={52} fill={rim} />
      </g>
      {limbs.map((l, i) => (
        <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={isSkin(i, limbs.length) ? skin : body} strokeWidth={l[4]} />
      ))}
      <circle cx={head[0]} cy={head[1]} r={48} fill={limbs.length === 11 ? body : skin} />
      {limbs.length === 11 ? (
        <>
          <path d={`M${head[0] - 8} ${head[1] + 6} L${head[0] + 46} ${head[1] + 6} M${head[0] + 6} ${head[1] + 22} L${head[0] + 44} ${head[1] + 22}`} stroke={trim} strokeWidth={7} />
          <path d={`M${head[0] - 40} ${head[1] - 26} Q${head[0]} ${head[1] - 58} ${head[0] + 40} ${head[1] - 26}`} stroke={trim} strokeWidth={6} fill="none" />
          <line x1={250} y1={330} x2={330} y2={300} stroke={trim} strokeWidth={10} />
          <line x1={196} y1={318} x2={176} y2={300} stroke={trim} strokeWidth={8} />
          <ellipse cx={318} cy={352} rx={40} ry={24} fill="#7A3E22" transform="rotate(-24 318 352)" />
          <path d="M296 354 L340 342" stroke="#F3E6D0" strokeWidth={3} />
        </>
      ) : (
        <>
          <line x1={226} y1={380} x2={290} y2={380} stroke={trim} strokeWidth={9} />
          <circle cx={360} cy={92} r={34} fill="#D9772F" />
          <path d="M326 92 L394 92 M360 58 L360 126" stroke="#7A3E1E" strokeWidth={3} />
        </>
      )}
    </g>
  );
};

/** Coded fallback artwork (spec section 2): gradient + a silhouette from rounded shapes. */
const FallbackArt: React.FC<{ variant: "hero" | "trade" | "extra"; tint: number }> = ({ variant, tint }) => {
  const hue = 200 + tint * 37;
  if (variant === "trade") {
    return (
      <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <rect width={500} height={700} fill="#EFE3C4" />
        <rect x={26} y={26} width={448} height={648} rx={8} fill="#D8C49A" />
        <rect x={26} y={26} width={448} height={648} rx={8} fill="url(#tr-sky)" />
        <defs>
          <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E9D7AE" />
            <stop offset="65%" stopColor="#C9A97A" />
            <stop offset="100%" stopColor="#9C7A52" />
          </linearGradient>
        </defs>
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={40 + ((i * 53) % 420)} cy={470 + ((i * 37) % 90)} r={10} fill="#8C6B47" opacity={0.35} />
        ))}
        <rect x={300} y={60} width={150} height={96} rx={4} fill="none" stroke="#6E5A40" strokeWidth={6} />
        <path d="M340 156 L350 210 L398 210 L408 156" fill="none" stroke="#B5463E" strokeWidth={4} strokeDasharray="6 5" />
        <ellipse cx={374} cy={156} rx={40} ry={8} fill="none" stroke="#B5463E" strokeWidth={6} />
        <g transform="translate(-10 20)">
          <Figure limbs={DUNKER} body="#C8323A" skin="#9C6A47" trim="#F5F0E1" rim="#FFF6DE" head={[262, 236]} />
        </g>
        <rect x={26} y={600} width={448} height={74} fill="#F3E9CF" />
        <rect x={60} y={622} width={220} height={12} rx={6} fill="#B5463E" opacity={0.7} />
        <rect x={60} y={644} width={140} height={10} rx={5} fill="#8C7A60" opacity={0.6} />
      </svg>
    );
  }
  const hero = variant === "hero";
  const top = hero ? "#2C3D86" : `hsl(${hue} 55% 42%)`;
  const bottom = hero ? "#0D1230" : `hsl(${hue} 50% 14%)`;
  return (
    <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`fb-sky${variant}${tint}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="70%" stopColor={bottom} />
        </linearGradient>
        <radialGradient id="fb-light">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
          <stop offset="25%" stopColor="#DCE6FF" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#DCE6FF" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="fb-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F7A45" />
          <stop offset="100%" stopColor="#0E3A22" />
        </linearGradient>
      </defs>
      <rect width={500} height={700} fill={`url(#fb-sky${variant}${tint})`} />
      {[90, 410].map((x) => (
        <circle key={x} cx={x} cy={80} r={120} fill="url(#fb-light)" />
      ))}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 47) % 500} cy={330 + ((i * 29) % 120)} r={4 + (i % 3) * 2} fill="#FFFFFF" opacity={0.08 + (i % 4) * 0.04} />
      ))}
      <path d="M0 500 Q250 470 500 500 L500 700 L0 700 Z" fill={hero ? "url(#fb-field)" : `hsl(${hue + 20} 35% 22%)`} />
      {hero && [540, 600, 660].map((y) => <path key={y} d={`M0 ${y} Q250 ${y - 22} 500 ${y}`} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={4} fill="none" />)}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={40 + i * 10} y1={300 + i * 70} x2={170 + i * 6} y2={300 + i * 70} stroke={hero ? "#60EE79" : "#FFFFFF"} strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" />
      ))}
      <g transform={hero ? "translate(10 20)" : "translate(10 20) scale(-1 1) translate(-500 0)"}>
        <Figure
          limbs={RUNNER}
          body={hero ? "#1B2550" : `hsl(${hue + 40} 40% 72%)`}
          skin="#B98262"
          trim={hero ? "#60EE79" : "#FFFFFF"}
          rim={hero ? "#9BB5FF" : "#FFFFFF"}
          head={[310, 182]}
        />
      </g>
    </svg>
  );
};

export const CardArt: React.FC<{ art: ArtSource; style?: React.CSSProperties }> = ({ art, style }) =>
  art.kind === "image" ? (
    <Img src={art.src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", display: "block", ...style }} />
  ) : (
    <div style={{ width: "100%", height: "100%", ...style }}>
      <FallbackArt variant={art.variant} tint={art.tint} />
    </div>
  );

export type CardVariant = "card" | "slab";

/** Outer size of the card including its top-loader or slab case. */
export const cardOuter = (width: number, variant: CardVariant = "card") => {
  const h = (width * 7) / 5;
  if (variant === "slab") return { w: width * 1.18, h: h * 1.08 + width * 0.34 };
  return { w: width * 1.09, h: h * 1.05 + width * 0.05 };
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
  const h = (width * 7) / 5;
  const outer = cardOuter(width, variant);
  const vintage = art.kind === "image" ? art.vintageBorder : art.kind === "fallback" && art.variant === "trade";
  const glareX = 50 - rotateY * 2.6;
  const glareY = 40 + rotateX * 2.6;
  const frame = vintage ? 0 : width * 0.035;
  const slab = variant === "slab";
  const labelH = width * 0.26;

  const cardFace = (
    <div
      style={{
        position: "absolute",
        left: (outer.w - width) / 2,
        top: slab ? labelH + width * 0.12 : (outer.h - h) / 2 + width * 0.02,
        width,
        height: h,
        borderRadius: width * 0.045,
        overflow: "hidden",
        background: vintage
          ? "#EFE3C4"
          : `linear-gradient(${135 + rotateY * 2}deg, #D7DCEB 0%, #9AA3C2 22%, #EEF1FA 45%, #8F98B8 70%, #DCE1F0 100%)`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
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
              "repeating-linear-gradient(115deg, #ff9fd8 0px, #ffe8a3 14px, #a9ffd2 28px, #9fd9ff 42px, #d6b4ff 56px, #ff9fd8 70px)",
            backgroundSize: "200% 200%",
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: width * 0.045,
            boxShadow: glow > 0 ? `0 0 ${36 * glow}px rgba(96,238,121,${0.55 * glow}), 0 0 0 ${2 * glow}px rgba(96,238,121,${0.9 * glow})` : "0 20px 50px rgba(0,0,0,0.45)",
          }}
        >
          {cardFace}
        </div>
      )}
    </div>
  );
};
