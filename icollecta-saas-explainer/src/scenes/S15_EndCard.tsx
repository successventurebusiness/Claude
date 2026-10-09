import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ParticleField } from "../components/FX";
import { KineticText } from "../components/KineticText";
import { Logo } from "../components/Logo";
import { TradingCard } from "../components/TradingCard";
import { Button, Cursor } from "../components/UI";
import { UI } from "../fonts";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { C } from "../theme";

const BTN = { x: 960, y: 640 };

/** 15 "Collect smarter": logo, line, CTA click, hold. */
export const S15_EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pull = cam(frame, [0, 111], [1.04, 1]);
  const btn = pop(frame, fps, 40);
  const cur = ease(frame, [52, 66], [0, 1]);
  const press = lerpF(frame, [70, 71, 75], [0, 1, 0]);
  const ripple = lerpF(frame, [70, 82], [0, 1]);
  const pulse = lerpF(frame, [70, 76, 92], [0, 1, 0]);
  const breathe = frame > 84 ? (Math.sin((frame - 84) * 0.12) + 1) / 2 : 0;
  const cardRot = ease(frame, [0, 60], [20, 0]);

  return (
    <AbsoluteFill style={{ transform: `scale(${pull})` }}>
      <div style={{ position: "absolute", left: 960 - 1100, top: 760, width: 2200, height: 700, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(96,238,121,${0.5 + breathe * 0.12}), rgba(96,238,121,0))` }} />
      <ParticleField count={50} seed="end" frame={frame} mode="rise" speed={1.1} size={[1.5, 4]} opacity={0.7} />
      <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%, -50%) perspective(1600px)", filter: "blur(3px)", opacity: 0.55 }}>
        <TradingCard art="hero" width={220} rotateY={cardRot} glow={0.9} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
        <Logo frame={frame} fps={fps} width={460} start={6} speed={1.8} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440 }}>
        <KineticText text="Collect smarter with iCollecta." frame={frame} start={16} stagger={4} size={72} lime={["smarter"]} />
      </div>
      <div style={{ position: "absolute", left: BTN.x, top: BTN.y, transform: `translate(-50%, -50%) scale(${btn})`, opacity: Math.min(1, btn * 2) }}>
        <Button label="Sign up free" size={32} press={press} glow={pulse + breathe * 0.3} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 712, textAlign: "center", fontFamily: UI, fontWeight: 600, fontSize: 28, color: "rgba(255,255,255,0.8)", opacity: ease(frame, [44, 54], [0, 1]) }}>icollecta.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: UI, fontWeight: 500, fontSize: 24, color: C.grey, opacity: ease(frame, [80, 90], [0, 1]) }}>One platform. Every collector.</div>
      {frame >= 52 && <Cursor x={1500 + (BTN.x + 90 - 1500) * cur} y={980 + (BTN.y + 10 - 980) * cur} scale={1.2} click={ripple} press={press} opacity={lerpF(frame, [96, 104], [1, 0])} />}
    </AbsoluteFill>
  );
};
