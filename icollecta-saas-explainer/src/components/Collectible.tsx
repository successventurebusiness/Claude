import { ArtKind } from "../assets";
import { CardArt, TradingCard } from "./TradingCard";
import { cardArt } from "../assets";

export type CollectibleKind =
  | "coin"
  | "baseball"
  | "comic"
  | "sheet"
  | "sticky"
  | "photo"
  | "cartridge"
  | "jersey";

/** Coded collectibles (Shots 1A/1B, 12C). `size` is the nominal width. */
export const Collectible: React.FC<{ kind: CollectibleKind; size: number; art?: ArtKind; seed?: number }> = ({
  kind,
  size,
  art = "extra-1",
  seed = 0,
}) => {
  switch (kind) {
    case "coin":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background:
              "conic-gradient(from 30deg, #8E96AE, #E9EDF7, #A3AAC0, #F7F9FF, #7F879F, #DDE2EE, #8E96AE)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(255,255,255,0.5)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: size * 0.09,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #C9CFDE 35%, #8A92AA 100%)",
              boxShadow: "inset 0 0 0 2px rgba(80,88,110,0.6), inset 0 4px 10px rgba(255,255,255,0.6)",
            }}
          />
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
            <circle cx={50} cy={50} r={30} fill="none" stroke="rgba(70,78,100,0.45)" strokeWidth={1.2} strokeDasharray="2 2.2" />
            <path d="M38 58 Q50 30 62 58 Z" fill="rgba(70,78,100,0.35)" />
            <circle cx={50} cy={40} r={6} fill="rgba(70,78,100,0.35)" />
          </svg>
        </div>
      );
    case "baseball":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.45))" }}>
          <defs>
            <radialGradient id={`bb${seed}`} cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#E7E4DC" />
              <stop offset="100%" stopColor="#B9B5AA" />
            </radialGradient>
          </defs>
          <circle cx={50} cy={50} r={48} fill={`url(#bb${seed})`} />
          {[
            "M22 12 Q40 50 22 88",
            "M78 12 Q60 50 78 88",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke="#C8323A" strokeWidth={1.6} />
              {Array.from({ length: 9 }).map((_, k) => {
                const t = (k + 0.5) / 9;
                const y = 12 + 76 * t;
                const x = i === 0 ? 22 + 18 * 4 * t * (1 - t) : 78 - 18 * 4 * t * (1 - t);
                return <path key={k} d={`M${x - 3} ${y - 1.5} L${x + 3} ${y + 1.5}`} stroke="#C8323A" strokeWidth={1.4} />;
              })}
            </g>
          ))}
          <path d="M34 54 C38 44 42 60 46 50 C49 43 52 58 56 49 C59 44 61 55 66 47" fill="none" stroke="#1D2A6B" strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "comic": {
      const h = size * 1.45;
      return (
        <div
          style={{
            width: size,
            height: h,
            borderRadius: 6,
            background: "#C9B796",
            padding: size * 0.05,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            position: "relative",
          }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", borderRadius: 3, background: "#2B6CD9" }}>
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: "22%", background: "#E8C53A" }} />
            <div style={{ position: "absolute", left: "8%", top: "28%", width: "55%", height: "40%", background: "#E24A4A", transform: "rotate(-8deg)" }} />
            <div style={{ position: "absolute", right: "6%", top: "38%", width: "38%", height: "38%", borderRadius: "50%", background: "#F2F2F2" }} />
            <div style={{ position: "absolute", left: 0, bottom: 0, right: 0, height: "20%", background: "#1A1A3A" }} />
          </div>
          {/* clear bag */}
          <div
            style={{
              position: "absolute",
              inset: -size * 0.04,
              top: -size * 0.12,
              borderRadius: 8,
              border: "1.5px solid rgba(255,255,255,0.35)",
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.0) 55%, rgba(255,255,255,0.12) 75%, rgba(255,255,255,0.03) 100%)",
            }}
          />
        </div>
      );
    }
    case "sheet":
      return (
        <div
          style={{
            width: size,
            height: size * 0.75,
            background: "#E3E5EA",
            clipPath: "polygon(0 4%, 12% 0, 30% 5%, 52% 1%, 70% 6%, 88% 0, 100% 5%, 98% 100%, 0 97%)",
            backgroundImage:
              "linear-gradient(rgba(120,128,150,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(120,128,150,0.35) 1px, transparent 1px)",
            backgroundSize: `${size / 6}px ${size / 12}px`,
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
            position: "relative",
          }}
        >
          {[0, 1, 2, 3, 4].map((r) => (
            <div key={r} style={{ position: "absolute", left: "6%", top: `${16 + r * 15}%`, width: `${30 + ((r * 23) % 40)}%`, height: 3, background: "rgba(90,98,120,0.45)" }} />
          ))}
        </div>
      );
    case "sticky":
      return (
        <div
          style={{
            width: size,
            height: size,
            background: "linear-gradient(170deg, #F4F5F7, #DCDFE6)",
            boxShadow: "0 16px 30px rgba(0,0,0,0.4)",
            position: "relative",
            borderRadius: 3,
          }}
        >
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
            <path d="M14 26 C24 20 34 30 44 24 S64 28 78 22" stroke="#5A6380" strokeWidth={2.2} fill="none" />
            <path d="M14 44 C26 40 38 48 50 42 S70 46 84 40" stroke="#5A6380" strokeWidth={2.2} fill="none" />
            <path d="M14 62 C22 58 32 66 42 60" stroke="#5A6380" strokeWidth={2.2} fill="none" />
            <path d="M56 70 L64 78 L80 60" stroke="#5A6380" strokeWidth={2.2} fill="none" />
          </svg>
        </div>
      );
    case "photo":
      return (
        <div
          style={{
            width: size,
            height: size * 0.8,
            borderRadius: 14,
            overflow: "hidden",
            border: "6px solid #F2F3F6",
            boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
          }}
        >
          <CardArt art={cardArt(art)} />
        </div>
      );
    case "cartridge":
      return (
        <div
          style={{
            width: size,
            height: size * 1.1,
            borderRadius: "10px 10px 6px 6px",
            background: "linear-gradient(160deg, #9DA2B1, #6E7384)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.35)",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: "12%", right: "12%", top: "14%", height: "48%", borderRadius: 6, background: "#C9CDD8", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.12)" }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: "absolute", left: "16%", right: "16%", bottom: `${10 + i * 4}%`, height: 2, background: "rgba(0,0,0,0.18)" }} />
          ))}
        </div>
      );
    case "jersey":
      return (
        <div
          style={{
            width: size,
            height: size * 1.2,
            background: "linear-gradient(160deg, #3A3F55, #1F2338)",
            border: `${size * 0.06}px solid #6B5A44`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 3px rgba(255,255,255,0.08)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 100 100" width="78%" height="78%">
            <path d="M30 14 L42 10 Q50 18 58 10 L70 14 L88 30 L78 42 L70 36 L70 90 L30 90 L30 36 L22 42 L12 30 Z" fill="#E8EAF0" />
            <path d="M30 36 L70 36" stroke="#C8323A" strokeWidth={3} />
            <text x={50} y={70} fontSize={24} fontWeight={800} textAnchor="middle" fill="#2B3A78" fontFamily="Montserrat">
              23
            </text>
          </svg>
        </div>
      );
  }
};

/** Card in top-loader or slab as a collectible-sized object. */
export const CardObject: React.FC<{ art: ArtKind; size: number; slab?: boolean; glow?: number }> = ({ art, size, slab, glow }) => (
  <TradingCard art={art} width={size} variant={slab ? "slab" : "card"} glow={glow} foil={0.25} />
);
