import { noise2D } from "@remotion/noise";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PriceTag } from "../components/Data";
import { TradingCard } from "../components/TradingCard";
import { cam, ease, lerpF } from "../lib/anim";
import { C } from "../theme";
import { HANG_COUNT, TAGS, hangDot } from "./worth";

const REEL = ["$12", "$85", "$400", "$1,200", "$40", "$950", "$7", "$310", "$2,500", "$64"];
const CARD_W = 440;

/** Reel position: fast spin, slowing f50-70. */
const reelAt = (f: number) => {
  const v = 0.55;
  if (f < 50) return f * v;
  const t = Math.min(f - 50, 20);
  return 50 * v + v * t - (v * t * t) / 40;
};
const reelSpeed = (f: number) => (f < 50 ? 0.55 : Math.max(0, 0.55 * (1 - (f - 50) / 20)));

/** 5 "What's it really worth?": spotlit hero card, three swinging price tags. */
export const S05_Worth: React.FC = () => {
  const frame = useCurrentFrame();
  const arrive = ease(frame, [0, 16], [0, 1]);
  const cardX = 500 + (1180 - 500) * arrive;
  const cardS = 0.7 + 0.3 * arrive;
  const rotY = lerpF(frame, [0, 93], [-16, 10]);
  const camY = cam(frame, [0, 93], [6, -6]);
  const burst = ease(frame, [82, 91], [0, 1]);
  const tagsOut = lerpF(frame, [82, 86], [1, 0]);

  const card = (
    <TradingCard art="hero" width={CARD_W} rotateY={rotY} rotateX={-4} glow={0.55} />
  );

  return (
    <AbsoluteFill>
      {/* darker stage */}
      <AbsoluteFill style={{ background: "rgba(4,6,18,0.55)" }} />
      {/* spotlight cone + haze */}
      <AbsoluteFill
        style={{
          background: "conic-gradient(from 180deg at 1180px -120px, rgba(200,215,255,0) 160deg, rgba(200,215,255,0.22) 172deg, rgba(220,230,255,0.32) 180deg, rgba(200,215,255,0.22) 188deg, rgba(200,215,255,0) 200deg)",
          opacity: 0.5,
          filter: "blur(18px)",
        }}
      />
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 900 + noise2D(`haze${k}`, frame * 0.01, 0) * 160 + k * 120,
            top: 180 + noise2D(`hazey${k}`, 0, frame * 0.01) * 80 + k * 140,
            width: 520,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(190,205,255,0.10), rgba(190,205,255,0))",
          }}
        />
      ))}
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateX(4deg) rotateY(${camY}deg)` }}>
          {/* card + floor reflection */}
          <div style={{ position: "absolute", left: cardX, top: 540, transform: `translate(-50%, -50%) scale(${cardS})`, transformStyle: "preserve-3d" }}>
            {card}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "100%",
                marginTop: 18,
                transform: "scaleY(-1)",
                opacity: 0.25,
                maskImage: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 45%)",
                WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 45%)",
              }}
            >
              {card}
            </div>
          </div>
          {/* price tags on strings */}
          {TAGS.map((t, k) => {
            const swing = Math.sin(frame * 0.07 + t.phase) * 6;
            const h = 130 * t.scale;
            const stringLength = t.y + 200;
            const landed = lerpF(frame, [62, 70], [0, 1]);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: t.x - 30 * t.scale,
                  top: t.y - h / 2,
                  transformOrigin: `${30 * t.scale}px ${h / 2 - stringLength}px`,
                  transform: `rotate(${swing}deg) scale(${1 - burst * 0.3})`,
                  filter: t.blur ? `blur(${t.blur}px)` : undefined,
                  opacity: tagsOut,
                }}
              >
                <PriceTag
                  values={REEL}
                  reel={reelAt(frame) + k * 3.3}
                  final={k === 0 ? "$ ?" : "?"}
                  landed={landed}
                  scale={t.scale}
                  stringLength={stringLength}
                  blur={reelSpeed(frame) * 16}
                />
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* tags burst into hanging lime dots (continue in S06) */}
      {burst > 0 &&
        Array.from({ length: HANG_COUNT }).map((_, i) => {
          const d = hangDot(i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.fromX + (d.x - d.fromX) * burst - d.r,
                top: d.fromY + (d.y - d.fromY) * burst - d.r,
                width: d.r * 2,
                height: d.r * 2,
                borderRadius: 99,
                background: C.lime,
                boxShadow: "0 0 12px rgba(96,238,121,0.9)",
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
