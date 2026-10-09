import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Gauge } from "../components/Data";
import { PhoneMockup } from "../components/Devices";
import { Burst } from "../components/FX";
import { TradingCard } from "../components/TradingCard";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF } from "../lib/anim";
import { C } from "../theme";
import { PHONE_SCALE, Viewfinder } from "./phoneScan";

export const RESULT_CARD = { x: 125, y: 92, w: 140 }; // on the 390x844 screen

export const ResultView: React.FC<{ frame: number; cardOpacity?: number }> = ({ frame, cardOpacity = 1 }) => {
  const g = ease(frame, [4, 22], [0, 0.9]);
  const bounce = lerpF(frame, [22, 25, 29], [1, 1.12, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0E1329", fontFamily: UI, color: C.white }}>
      <div style={{ position: "absolute", left: RESULT_CARD.x, top: RESULT_CARD.y, opacity: cardOpacity }}>
        <TradingCard art="hero" width={RESULT_CARD.w} loader={false} foil={0.2} glow={0.4} />
      </div>
      <div style={{ position: "absolute", left: 95, top: 310, transform: `scale(${bounce})` }}>
        <Gauge progress={g} size={200} stroke={14}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: C.white, lineHeight: 1 }}>{(g * 10).toFixed(1)}</div>
        </Gauge>
      </div>
      <div style={{ position: "absolute", top: 530, left: 0, right: 0, textAlign: "center", fontSize: 20, fontWeight: 600, color: C.grey }}>Estimated pre-grade</div>
      <div style={{ position: "absolute", top: 600, left: 28, right: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ height: 70, borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
        ))}
      </div>
    </div>
  );
};

/** 8B "Get a pre-grade": result view slides up, gauge fills to 9.0, confetti. */
export const S08B_PreGrade: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = ease(frame, [0, 6], [0, 1]);
  const push = 1.05 * cam(frame, [0, 39], [1, 1.25]);
  const lift = ease(frame, [32, 39], [0, 1], (t) => t * t);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 1450, top: 160, filter: "blur(12px)", opacity: 0.3, transform: "rotate(10deg)" }}>
        <TradingCard art="extra-8" width={170} />
      </div>
      <div style={{ transform: `scale(${push})`, transformOrigin: "50% 40%" }}>
        <PhoneMockup scale={PHONE_SCALE}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${-slide * 844}px)` }}>
            <Viewfinder scan={1} frontTick={1} grid={1} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - slide) * 844}px)` }}>
            <ResultView frame={frame} cardOpacity={lift > 0 ? 0 : 1} />
            <Burst x={195} y={410} count={24} seed="pregrade" progress={lerpF(frame, [22, 36], [0, 1])} distance={190} size={8} gravity={60} />
          </div>
        </PhoneMockup>
      </div>
      {lift > 0 && (
        <div style={{ position: "absolute", left: 960, top: 240 - lift * 20, transform: `translate(-50%, -50%) scale(${1 + lift * 0.3})`, filter: `drop-shadow(0 30px 40px rgba(0,0,0,0.5))` }}>
          <TradingCard art="hero" width={RESULT_CARD.w * PHONE_SCALE * push} loader={false} foil={0.25} glow={0.4} />
        </div>
      )}
    </AbsoluteFill>
  );
};
