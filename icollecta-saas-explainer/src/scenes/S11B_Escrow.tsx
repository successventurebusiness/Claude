import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stepper } from "../components/Data";
import { RingPing, ScanLine } from "../components/FX";
import { KineticText } from "../components/KineticText";
import { TradingCard } from "../components/TradingCard";
import { Toast } from "../components/UI";
import { cam, ease, lerpF, quad } from "../lib/anim";
import { C, limeShadow } from "../theme";

export const VAULT = { x: 510, y: 250, w: 900, h: 560 };
const SLOT_W = 300;
const SLOT_H = 420;
const SLOTS = [760, 1160];
const SLOT_Y = VAULT.y + VAULT.h / 2;

/** 11B "Escrow protection": both cards locked in a vault, steps complete, ownership swaps. */
export const S11B_Escrow: React.FC = () => {
  const frame = useCurrentFrame();
  const dolly = cam(frame, [0, 72], [1, 1.06]);
  const dropIn = (d: number) => {
    const t = ease(frame, [d - 4, d + 4], [0, 1], (x) => x * x);
    const b = lerpF(frame, [d + 4, d + 6, d + 9], [0, -10, 0]);
    return -760 * (1 - t) + b;
  };
  const shutter = ease(frame, [12, 20], [0, 1]) * (1 - ease(frame, [52, 57], [0, 1]));
  const shackle = ease(frame, [20, 23], [0, 12]);
  const lockGlow = lerpF(frame, [22, 26, 40], [0, 1, 0.5]);
  const scan = lerpF(frame, [30, 42], [0, 1]);
  const swap = ease(frame, [56, 68], [0, 1]);
  const steps = [24, 30, 36, 44, 54].map((s) => lerpF(frame, [s, s + 6], [0, 1]));
  const toast = ease(frame, [64, 70], [0, 1]);

  const cardAt = (slot: number, other: number, dir: 1 | -1, delay: number) => {
    const [x, y] = quad([SLOTS[slot], SLOT_Y], [(SLOTS[slot] + SLOTS[other]) / 2, VAULT.y - 260], [SLOTS[other], SLOT_Y], swap);
    return { x, y: y + (swap > 0 ? 0 : dropIn(delay)), rot: Math.sin(swap * Math.PI) * 12 * dir };
  };
  const hero = cardAt(0, 1, 1, 0); // lands f4
  const trade = cardAt(1, 0, -1, 3); // lands f7

  return (
    <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120 }}>
        <KineticText text="Escrow protected" frame={frame} start={22} size={56} lime={["protected"]} />
      </div>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: "rotateX(-8deg)", transformOrigin: "960px 700px" }}>
          {/* vault body */}
          <div
            style={{
              position: "absolute",
              left: VAULT.x,
              top: VAULT.y,
              width: VAULT.w,
              height: VAULT.h,
              borderRadius: 40,
              background: "linear-gradient(170deg, #2A3358 0%, #1A2042 45%, #121733 100%)",
              boxShadow: `0 50px 100px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 0 0 2px rgba(96,238,121,${0.25 + lockGlow * 0.4})`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px)", mixBlendMode: "screen" }} />
            <div style={{ position: "absolute", left: VAULT.w / 2 - 2, top: 0, width: 4, height: VAULT.h, background: C.lime, boxShadow: limeShadow(0.9, 18) }} />
            <div style={{ position: "absolute", left: 30, right: 30, top: 26, height: 2, background: "rgba(96,238,121,0.5)", boxShadow: limeShadow(0.6, 10) }} />
            <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, height: 2, background: "rgba(96,238,121,0.5)", boxShadow: limeShadow(0.6, 10) }} />
          </div>
          {/* slots */}
          {SLOTS.map((x) => (
            <div key={x} style={{ position: "absolute", left: x - SLOT_W / 2, top: SLOT_Y - SLOT_H / 2, width: SLOT_W, height: SLOT_H, borderRadius: 26, background: "rgba(5,8,20,0.55)", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,255,255,0.08)" }} />
          ))}
          {/* cards */}
          {[
            { c: hero, art: "hero" as const },
            { c: trade, art: "trade" as const },
          ].map(({ c, art }) => (
            <div key={art} style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%, -50%) rotate(${c.rot}deg)`, zIndex: swap > 0 ? 5 : 1 }}>
              <TradingCard art={art} width={250} glow={0.35} foil={art === "hero" ? 0.3 : 0} />
            </div>
          ))}
          {/* glass shutters */}
          {SLOTS.map((x) => (
            <div key={x} style={{ position: "absolute", left: x - SLOT_W / 2, top: SLOT_Y - SLOT_H / 2, width: SLOT_W, height: SLOT_H * shutter, borderRadius: 26, overflow: "hidden", zIndex: 3 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(200,220,255,0.22), rgba(200,220,255,0.06) 50%, rgba(200,220,255,0.14))", backdropFilter: "blur(3px)", borderBottom: "3px solid rgba(96,238,121,0.8)" }} />
            </div>
          ))}
          {/* scan line over both slots */}
          {scan > 0 && scan < 1 && (
            <div style={{ position: "absolute", left: SLOTS[0] - SLOT_W / 2 - 20, top: SLOT_Y - SLOT_H / 2, zIndex: 4 }}>
              <ScanLine width={SLOTS[1] - SLOTS[0] + SLOT_W + 40} height={SLOT_H} progress={scan} grid={false} />
            </div>
          )}
          {/* padlock on the centre seam */}
          <div style={{ position: "absolute", left: 960 - 46, top: SLOT_Y - 60, width: 92, height: 120, zIndex: 4, filter: `drop-shadow(0 0 ${10 + lockGlow * 30}px rgba(96,238,121,${0.4 + lockGlow * 0.5}))` }}>
            <svg width={92} height={120} viewBox="0 0 92 120">
              <path d={`M24 ${54 - 12 + shackle} V${34 - 12 + shackle} a22 22 0 0 1 44 0 V${54 - 12 + shackle}`} fill="none" stroke="#C9D0E6" strokeWidth={10} strokeLinecap="round" />
              <rect x={8} y={52} width={76} height={62} rx={14} fill={lockGlow > 0.05 ? C.lime : "#3A4A78"} />
              <circle cx={46} cy={80} r={8} fill={C.navy} />
              <rect x={42} y={82} width={8} height={18} rx={4} fill={C.navy} />
            </svg>
          </div>
          <RingPing x={960} y={SLOT_Y + 20} progress={lerpF(frame, [22, 38], [0, 1])} size={220} />
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - 550, top: 880 }}>
        <Stepper labels={["Propose", "Accept", "Deposit", "Verify", "Complete"]} fills={steps} width={1100} />
      </div>
      <div style={{ position: "absolute", right: 110, top: 70, transform: `translateY(${(1 - toast) * -30}px)`, opacity: toast }}>
        <Toast label="Ownership swapped" />
      </div>
    </AbsoluteFill>
  );
};
