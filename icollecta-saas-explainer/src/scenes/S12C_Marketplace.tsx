import { Heart, MessageCircle } from "lucide-react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { crowd, EXTRA } from "../assets";
import { Collectible, CollectibleKind } from "../components/Collectible";
import { Avatar, ListingTile } from "../components/Data";
import { Flash } from "../components/FX";
import { KineticText } from "../components/KineticText";
import { TradingCard } from "../components/TradingCard";
import { Chip } from "../components/UI";
import { cam, lerpF, pop } from "../lib/anim";
import { C } from "../theme";

const COLS = 8;
const ROWS = 30;
const TW = 220;
const TH = 300;
const GAP = 34;
const PITCH_X = TW + GAP;
const PITCH_Y = TH + GAP;
const PLANE_W = COLS * PITCH_X;
const PLANE_H = ROWS * PITCH_Y;
const KINDS: (CollectibleKind | "card" | "slab")[] = ["card", "slab", "comic", "coin", "baseball", "jersey", "cartridge", "card"];
const CATS = ["Cards", "Comics", "Coins", "Memorabilia", "Games"];

const TileContent: React.FC<{ i: number }> = ({ i }) => {
  const k = KINDS[Math.floor(random(`tk${i}`) * KINDS.length)];
  const inner =
    k === "card" ? <TradingCard art={EXTRA(i)} width={110} foil={0} /> : k === "slab" ? <TradingCard art={EXTRA(i + 3)} width={96} variant="slab" foil={0} /> : <Collectible kind={k} size={k === "comic" ? 92 : 110} seed={i} />;
  return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 40%, #2A335A, #141A36)" }}>{inner}</div>;
};

/** 12C "A marketplace and a community": fly over an endless floor of listings. */
export const S12C_Marketplace: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tilt = cam(frame, [55, 93], [62, 50]);
  const travel = frame * 34;
  const horizon = lerpF(frame, [60, 93], [0.35, 1]);
  const flash = lerpF(frame, [87, 93], [0, 0.95]);

  const avatars = Array.from({ length: 12 }, (_, i) => {
    const period = 22 + (i % 4) * 4;
    const phase = (frame + i * 7) % period;
    const hop = Math.floor((frame + i * 7) / period);
    const col0 = (i * 3 + hop) % COLS;
    const col1 = (col0 + 1) % COLS;
    const row = ROWS - 2 - (i % 6) * 1.6;
    const t = phase / period;
    const x = (col0 + (col1 - col0) * t) * PITCH_X + TW / 2;
    const y = row * PITCH_Y + TH / 2 - travel - t * PITCH_Y * 0.6;
    const z = Math.sin(t * Math.PI) * 220 + 40;
    return { i, x, y, z, t, who: crowd(i) };
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* horizon glow */}
      <div style={{ position: "absolute", left: 960 - 1200, top: 300 - 260, width: 2400, height: 520, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(96,238,121,${0.55 * horizon}), rgba(96,238,121,0))` }} />
      <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: "50% 30%" }}>
        <div
          style={{
            position: "absolute",
            left: 960 - PLANE_W / 2,
            top: 1080 - PLANE_H + 200,
            width: PLANE_W,
            height: PLANE_H,
            transformOrigin: "50% 100%",
            transform: `rotateX(${tilt}deg) translateY(${travel}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const c = i % COLS;
            const r = Math.floor(i / COLS);
            return (
              <div key={i} style={{ position: "absolute", left: c * PITCH_X, top: r * PITCH_Y }}>
                <ListingTile width={TW} height={TH} content={<TileContent i={i} />} seed={i} />
              </div>
            );
          })}
          {avatars.map((a) => (
            <div key={a.i} style={{ position: "absolute", left: a.x, top: a.y, transformStyle: "preserve-3d", transform: `translateZ(${a.z}px)` }}>
              <div style={{ position: "absolute", transform: `translate(-50%, -100%) rotateX(${-tilt}deg)`, transformOrigin: "50% 100%" }}>
                <Avatar who={a.who} size={96} ring />
                {a.i % 4 === 0 && a.t > 0.3 && (
                  <div style={{ position: "absolute", left: 60, top: -50, transform: `scale(${Math.sin(Math.min(1, (a.t - 0.3) * 2) * Math.PI) + 0.01})` }}>
                    <div style={{ width: 54, height: 54, borderRadius: 99, background: C.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {a.i % 8 === 0 ? <Heart size={30} color={C.navy} fill={C.navy} /> : <MessageCircle size={30} color={C.navy} />}
                    </div>
                  </div>
                )}
              </div>
              {/* lime trail */}
              {[1, 2, 3, 4].map((k) => {
                const tt = Math.max(0, a.t - k * 0.06);
                const dz = Math.sin(tt * Math.PI) * 220 + 40 - a.z;
                return <div key={k} style={{ position: "absolute", left: -(a.t - tt) * PITCH_X - 8, top: (a.t - tt) * PITCH_Y - 8, width: 16, height: 16, borderRadius: 99, background: C.lime, opacity: 0.6 - k * 0.12, transform: `translateZ(${dz}px)`, boxShadow: "0 0 12px #60EE79" }} />;
              })}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* navy fog toward the horizon */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #121833 0%, rgba(18,24,51,0.95) 22%, rgba(18,24,51,0.4) 42%, rgba(18,24,51,0) 62%)" }} />
      <div style={{ position: "absolute", left: 960 - 1000, top: 140, width: 2000, height: 300, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(96,238,121,${0.35 * horizon}), rgba(96,238,121,0))` }} />
      {/* category chips */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", gap: 18 }}>
        {CATS.map((c, i) => {
          const p = pop(frame, fps, 6 + i * 5);
          return (
            <div key={c} style={{ transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + p * 0.2})`, opacity: Math.min(1, p * 2) }}>
              <Chip label={c} variant={i === 0 ? "lime" : "glass"} size={24} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 960 - 760, top: 540 - 230, width: 1520, height: 460, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(12,16,38,0.82), rgba(12,16,38,0))", opacity: lerpF(frame, [18, 28], [0, 1]) * (1 - lerpF(frame, [84, 90], [0, 1])) }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 4, textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
        <KineticText text="A marketplace" frame={frame} start={24} size={88} exitAt={84} />
        <KineticText text="and a community" frame={frame} start={44} size={88} lime={["community"]} exitAt={84} />
      </AbsoluteFill>
      <Flash opacity={flash} y={300} radius={1500} />
    </AbsoluteFill>
  );
};
