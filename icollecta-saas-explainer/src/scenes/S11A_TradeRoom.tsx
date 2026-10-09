import { ArrowLeftRight, Check, Lock } from "lucide-react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { avatar } from "../assets";
import { Avatar } from "../components/Data";
import { DirectionalBlur } from "../components/FX";
import { TradingCard } from "../components/TradingCard";
import { Button, Chip, Cursor, GlassPanel } from "../components/UI";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { C, limeShadow } from "../theme";
import { HOLO_END } from "./S10_FoundCard";

const PANEL = { x: 360, y: 210, w: 1200, h: 640 };
const COL = { left: 660, right: 1260 };
const CARD_Y = 560;
const BTN = { x: 960, y: 800 };

/** 11A "The Trade Room": you give / you get, propose, accepted, cards drop into escrow. */
export const S11A_TradeRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crane = cam(frame, [0, 66], [10, 4]);
  const fly = ease(frame, [0, 12], [0, 1]);
  const solid = lerpF(frame, [8, 14], [0, 1]);
  const spin = lerpF(frame, [4, 44], [0, 360]);
  const cur = ease(frame, [10, 22], [0, 1]);
  const press = lerpF(frame, [24, 25, 28], [0, 1, 0]);
  const ripple = lerpF(frame, [24, 32], [0, 1]);
  const accepted = pop(frame, fps, 34);
  const lift = ease(frame, [48, 54], [0, 1]);
  const drop = ease(frame, [54, 66], [0, 1], (t) => t * t);
  const cardDy = -lift * 24 + drop * 700;
  const dropBlur = drop * 40;

  const label = (t: string) => <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 24, color: C.grey }}>{t}</div>;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: `rotateX(${crane}deg)`, transformOrigin: "960px 540px" }}>
          {/* near depth */}
          <div style={{ position: "absolute", left: 80, top: 760, filter: "blur(6px)", opacity: 0.45, transform: "rotate(-14deg)" }}>
            <TradingCard art="extra-3" width={200} variant="slab" />
          </div>
          <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y }}>
            <GlassPanel width={PANEL.w} height={PANEL.h} />
            <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: C.white }}>Trade Room</span>
              <Chip label="Protected" icon={Lock} variant="lime" size={20} />
            </div>
          </div>
          {[
            { x: COL.left, who: avatar("you"), name: "You give" },
            { x: COL.right, who: avatar("maya"), name: "You get" },
          ].map((c) => (
            <div key={c.name} style={{ position: "absolute", left: c.x, top: 330, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar who={c.who} size={56} ring />
              {label(c.name)}
            </div>
          ))}
          {/* swap icon */}
          <div style={{ position: "absolute", left: 960 - 48, top: CARD_Y - 48, width: 96, height: 96, borderRadius: 99, border: `3px solid ${C.lime}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: limeShadow(0.6, 28), transform: `rotate(${spin}deg)` }}>
            <ArrowLeftRight size={46} color={C.lime} strokeWidth={2.6} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 735, textAlign: "center", fontFamily: UI, fontWeight: 500, fontSize: 20, color: C.grey }}>10% refundable deposit each side</div>
          <div style={{ position: "absolute", left: BTN.x, top: BTN.y, transform: "translate(-50%, -50%)" }}>
            <Button label="Propose swap" size={24} press={press} glow={ripple > 0 && ripple < 1 ? 1 - ripple : 0} />
          </div>
          {/* accepted bubble by Maya */}
          {accepted > 0.01 && (
            <div style={{ position: "absolute", left: COL.right + 140, top: 290, transform: `scale(${accepted})`, transformOrigin: "0 100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.lime, color: C.navy, padding: "10px 18px", borderRadius: "18px 18px 18px 4px", fontFamily: UI, fontWeight: 700, fontSize: 22, boxShadow: limeShadow(0.5, 20) }}>
                <Check size={22} strokeWidth={3.4} /> Accepted
              </div>
            </div>
          )}
          {/* cards (clipped to the panel so they drop "into" it) */}
          <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y + 80, width: PANEL.w, height: PANEL.h - 80, overflow: drop > 0 ? "hidden" : "visible" }}>
            <DirectionalBlur amount={dropBlur} axis="y">
              <div style={{ position: "absolute", left: COL.left - PANEL.x, top: CARD_Y - PANEL.y - 80 + cardDy, transform: "translate(-50%, -50%)" }}>
                <TradingCard art="hero" width={190} glow={0.4} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: HOLO_END.x - PANEL.x + (COL.right - HOLO_END.x) * fly,
                  top: HOLO_END.y - PANEL.y - 80 + (CARD_Y - HOLO_END.y) * fly + cardDy,
                  transform: `translate(-50%, -50%) scale(${1.26 - 0.26 * fly})`,
                  filter: solid < 1 ? `saturate(${0.7 + 0.3 * solid}) brightness(${1.15 - 0.15 * solid}) drop-shadow(0 0 ${30 * (1 - solid)}px rgba(96,238,121,0.8))` : undefined,
                }}
              >
                <TradingCard art="trade" width={190} glow={0.4 + 0.6 * (1 - solid)} foil={0} />
              </div>
            </DirectionalBlur>
          </div>
          <Cursor x={1500 + (BTN.x + 70 - 1500) * cur} y={1000 + (BTN.y + 8 - 1000) * cur} scale={1.1} click={ripple} press={press} opacity={lerpF(frame, [44, 50], [1, 0])} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
