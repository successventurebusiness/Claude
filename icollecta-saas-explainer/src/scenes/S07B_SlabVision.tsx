import { ScanLine as ScanIcon } from "lucide-react";
import { AbsoluteFill, Freeze, useCurrentFrame, useVideoConfig } from "remotion";
import { Magnifier, ScanBrackets } from "../components/FX";
import { TradingCard } from "../components/TradingCard";
import { Chip } from "../components/UI";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { C } from "../theme";
import { PRE_BTN, S07A_ShipPause } from "./S07A_ShipPause";

export const CARD = { x: 960, y: 540, w: 500, h: 700 };
const L = CARD.x - CARD.w / 2;
const T = CARD.y - CARD.h / 2;

/** Fine paper-fibre texture drawn on the card face (revealed by the zoom). */
export const Fibres: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 500 700" style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.55 }}>
    <filter id="fibre">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves={3} seed={4} />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={500} height={700} filter="url(#fibre)" />
  </svg>
);

const CardPlane: React.FC = () => (
  <div style={{ position: "absolute", left: L, top: T }}>
    <TradingCard art="hero" width={CARD.w} loader={false} foil={0.25} rotateZ={-1.5} face={<Fibres />} />
  </div>
);

/** 7B "SlabVision takes a closer look": ring wipe, brackets snap on, magnifier glides. */
export const S07B_SlabVision: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = ease(frame, [0, 8], [0, 1], (t) => t * t);
  const wipeR = wipe * 2300;
  const push = cam(frame, [0, 51], [1, 1.12]);
  const chip = pop(frame, fps, 6);
  const fly = [0, 1, 2, 3].map((i) => ease(frame, [6 + i * 3, 12 + i * 3], [0, 1]));
  const pulse = lerpF(frame, [18, 22, 30], [0, 1, 0]);
  const magIn = pop(frame, fps, 16);
  const glide = ease(frame, [20, 38], [0, 1]);
  const mx = CARD.x + (L + CARD.w - 110 - CARD.x) * glide;
  const my = CARD.y + (T + 110 - CARD.y) * glide;
  const scan = lerpF(frame, [44, 48], [0, 1]);

  return (
    <AbsoluteFill>
      {frame < 9 && (
        <Freeze frame={53}>
          <S07A_ShipPause />
        </Freeze>
      )}
      <AbsoluteFill style={{ clipPath: frame < 8 ? `circle(${wipeR}px at ${PRE_BTN.x}px ${PRE_BTN.y}px)` : undefined }}>
        <AbsoluteFill style={{ background: "rgba(6,9,24,0.92)" }} />
        <AbsoluteFill
          style={{
            backgroundImage: "linear-gradient(rgba(96,238,121,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96,238,121,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${L + CARD.w}px ${T}px` }}>
          {/* near depth */}
          <div style={{ position: "absolute", left: 1500, top: 620, filter: "blur(6px)", opacity: 0.4, transform: "rotate(14deg)" }}>
            <TradingCard art="extra-7" width={200} />
          </div>
          <CardPlane />
          <div style={{ position: "absolute", left: L, top: T, width: CARD.w, height: CARD.h }}>
            <ScanBrackets width={CARD.w} height={CARD.h} fly={fly} pulse={pulse} arm={90} />
            {scan > 0 && (
              <div style={{ position: "absolute", left: 0, top: -2, width: CARD.w * scan, height: 3, background: "#C9FFD3", boxShadow: "0 0 16px 3px rgba(96,238,121,0.9)" }} />
            )}
          </div>
          <div style={{ position: "absolute", left: L - 10, top: T - 74, transform: `scale(${chip})`, transformOrigin: "0 100%", opacity: Math.min(1, chip * 2) }}>
            <Chip label="SlabVision" icon={ScanIcon} variant="lime" size={24} />
          </div>
          <Magnifier x={mx} y={my} radius={110} zoom={3.2} scale={magIn} width={1920} height={1080}>
            <CardPlane />
          </Magnifier>
        </AbsoluteFill>
      </AbsoluteFill>
      {frame < 9 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={PRE_BTN.x} cy={PRE_BTN.y} r={wipeR} fill="none" stroke={C.lime} strokeWidth={10 * (1 - wipe) + 3} style={{ filter: "drop-shadow(0 0 20px rgba(96,238,121,0.9))" }} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

