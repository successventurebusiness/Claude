import { ArrowLeftRight, BadgeDollarSign, LayoutGrid, ScanLine, ShoppingCart, Tag } from "lucide-react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Gate } from "../components/Data";
import { Flash, ParticleField } from "../components/FX";
import { TradingCard } from "../components/TradingCard";
import { cam, ease, lerpF } from "../lib/anim";
import { C } from "../theme";

const GATES = [
  { x: 700, at: 12, label: "Organize", icon: LayoutGrid },
  { x: 1500, at: 57, label: "Price", icon: Tag },
  { x: 2300, at: 75, label: "Grade", icon: ScanLine },
  { x: 3100, at: 93, label: "Trade", icon: ArrowLeftRight },
  { x: 3900, at: 108, label: "Buy", icon: ShoppingCart },
  { x: 4700, at: 126, label: "Sell", icon: BadgeDollarSign },
];
const WORLD_W = 5200;
const trackY = (x: number) => 600 + Math.sin(x / 650) * 70;
const trackSlope = (x: number) => (70 / 650) * Math.cos(x / 650);

// Card position: passes each gate exactly on its frame.
const KEY_F = [0, ...GATES.map((g) => g.at), 147];
const KEY_X = [380, ...GATES.map((g) => g.x), 5000];
const cardX = (f: number) => interpolate(f, KEY_F, KEY_X, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const trackPath = (() => {
  let d = `M 0 ${trackY(0)}`;
  for (let x = 40; x <= WORLD_W; x += 40) d += ` L ${x} ${trackY(x)}`;
  return d;
})();

/** 13 "The whole journey": the hero card races through six gates. */
export const S13_Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const x = cardX(frame);
  const y = trackY(x);
  const bank = (Math.atan(trackSlope(x)) * 180) / Math.PI;
  const rotY = cam(frame, [128, 147], [28, 0]);
  const fly = ease(frame, [128, 147], [0, 1], (t) => t * t);
  const scale = 1 + fly * 2.2;
  const blur = lerpF(frame, [138, 147], [0, 14]);
  const worldX = 760 - x;
  const trail = `M ${Math.max(0, x - 300)} ${trackY(Math.max(0, x - 300))} ` + Array.from({ length: 15 }, (_, k) => {
    const xx = Math.max(0, x - 300 + (k + 1) * 20);
    return `L ${xx} ${trackY(xx)}`;
  }).join(" ");

  return (
    <AbsoluteFill>
      <ParticleField count={60} seed="speed" frame={frame} mode="stream" speed={1.6} size={[1.5, 3]} opacity={0.6} />
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "40% 50%" }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateY(${rotY}deg)`, transformOrigin: "760px 540px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: WORLD_W, height: 1080, transform: `translateX(${worldX}px)`, transformStyle: "preserve-3d" }}>
            <svg width={WORLD_W} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <defs>
                <linearGradient id="trailg" x1="0" x2="1">
                  <stop offset="0%" stopColor={C.lime} stopOpacity={0} />
                  <stop offset="100%" stopColor={C.lime} stopOpacity={1} />
                </linearGradient>
              </defs>
              <path d={trackPath} fill="none" stroke="rgba(96,238,121,0.35)" strokeWidth={6} />
              <path d={trackPath} fill="none" stroke="rgba(96,238,121,0.12)" strokeWidth={40} />
              <path d={trail} fill="none" stroke="url(#trailg)" strokeWidth={22} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 16px rgba(96,238,121,0.9))" }} opacity={1 - fly} />
            </svg>
            {GATES.map((g) => {
              const lit = frame >= g.at ? 1 : 0;
              const flare = lerpF(frame, [g.at, g.at + 12], [0, 1]);
              return (
                <div key={g.label} style={{ position: "absolute", left: g.x - 160, top: trackY(g.x) - 160 - 320 * 0.35 * (320 / 300) }}>
                  <Gate icon={g.icon} label={g.label} lit={lit ? Math.min(1, flare * 3) : 0} flare={lit ? flare : 0} size={320} />
                </div>
              );
            })}
            <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${bank}deg) scale(${scale})`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined, zIndex: 10 }}>
              <TradingCard art="hero" width={170} glow={0.8} rotateY={-12 * (1 - fly)} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* the S12C bloom clears */}
      <Flash opacity={lerpF(frame, [0, 6], [0.95, 0])} y={300} radius={1500} />
    </AbsoluteFill>
  );
};
