import { ScanLine } from "lucide-react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TradingCard } from "../components/TradingCard";
import { Button, Cursor, GlassPanel } from "../components/UI";
import { UI } from "../fonts";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { C } from "../theme";

// Positions inside the 1920x1080 plane (panel is tilted as a whole).
const PANEL = { x: 960 - 380, y: 230, w: 760, h: 440 };
export const SHIP_BTN = { x: 1110, y: 610 };
export const PRE_BTN = { x: 960, y: 760 };

/** 7A "Before you send it off": cursor hesitates on Ship, then picks SlabVision. */
export const S07A_ShipPause: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = cam(frame, [0, 54], [1, 1.05]);
  const enter = ease(frame, [2, 16], [0, 1]);
  const nudge = frame >= 16 && frame < 30 ? Math.sin((frame - 16) * 1.1) * 3 * (1 - (frame - 16) / 14) : 0;
  const glide = ease(frame, [34, 48], [0, 1]);
  let cx = 1700 + (SHIP_BTN.x - 1700) * enter;
  let cy = 1100 + (SHIP_BTN.y - 1100) * enter;
  cx += nudge;
  cy += nudge * 0.5;
  cx += (PRE_BTN.x + 60 - SHIP_BTN.x) * glide;
  cy += (PRE_BTN.y + 6 - SHIP_BTN.y) * glide;
  const hover = frame >= 16 && frame < 36 ? 1 : 0;
  const pre = pop(frame, fps, 22);
  const pulse = frame > 30 ? (Math.sin((frame - 30) * 0.35) + 1) / 2 : 0;
  const press = lerpF(frame, [50, 51, 54], [0, 1, 0]);
  const ripple = lerpF(frame, [50, 54], [0, 0.5]);

  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      {/* far depth */}
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: 170 + k * 1450, top: 150 + k * 520, filter: "blur(11px)", opacity: 0.35, transform: `rotate(${k ? 12 : -10}deg)` }}>
          <TradingCard art={`extra-${k + 2}`} width={150} variant={k ? "slab" : "card"} />
        </div>
      ))}
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: "rotateX(8deg) rotateY(-6deg)", transformOrigin: "960px 500px" }}>
          <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y }}>
            <GlassPanel width={PANEL.w} height={PANEL.h} title="Grading submission">
              <div style={{ display: "flex", gap: 36, padding: "30px 34px" }}>
                <TradingCard art="hero" width={150} foil={0.25} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26, paddingTop: 8 }}>
                  {[
                    ["Service", 0.7],
                    ["Turnaround", 0.5],
                    ["Shipping", 0.6],
                  ].map(([l, w]) => (
                    <div key={l as string}>
                      <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 22, color: C.grey, marginBottom: 10 }}>{l}</div>
                      <div style={{ height: 14, borderRadius: 8, width: `${(w as number) * 100}%`, background: "rgba(169,176,200,0.28)" }} />
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>
          <div style={{ position: "absolute", left: SHIP_BTN.x, top: SHIP_BTN.y, transform: "translate(-50%, -50%)" }}>
            <Button label="Ship for grading" variant="outline" size={24} hover={hover} />
          </div>
          <div style={{ position: "absolute", left: PRE_BTN.x, top: PRE_BTN.y, transform: `translate(-50%, -50%) scale(${pre})`, opacity: Math.min(1, pre * 2) }}>
            <Button label="Pre-grade with SlabVision" icon={ScanLine} size={28} glow={pulse} press={press} />
          </div>
          <Cursor x={cx} y={cy} scale={1.2} click={ripple} press={press} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
