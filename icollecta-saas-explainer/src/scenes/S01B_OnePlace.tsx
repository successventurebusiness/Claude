import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RingPing } from "../components/FX";
import { KineticText } from "../components/KineticText";
import { GlassPanel } from "../components/UI";
import { cam, ease, lerpF, panel, quad } from "../lib/anim";
import { C } from "../theme";
import { ItemView } from "./ItemView";
import { SCATTER, SCATTER_END, itemSize } from "./scatter";

const PW = 980;
const PH = 600;
const HEADER = 64;
const PAD = 30;
const GAP = 20;
const SW = (PW - PAD * 2 - GAP * 3) / 4;
const SH = (PH - HEADER - PAD * 2 - GAP * 2) / 3;
const PX = 960 - PW / 2;
const PY = 540 - PH / 2 - 30;

const slot = (i: number) => {
  const c = i % 4;
  const r = Math.floor(i / 4);
  const x = PX + PAD + c * (SW + GAP);
  const y = PY + HEADER + PAD + r * (SH + GAP);
  return { x, y, cx: x + SW / 2, cy: y + SH / 2 };
};

const FLIGHT = 14;
const startOf = (i: number) => 12 + i * 4;

/** 1B "One place": glint opens into My Collection; the 12 objects fly into slots. */
export const S01B_OnePlace: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineH = ease(frame, [0, 10], [0, 560]);
  const open = panel(frame, fps, 8);
  const push = cam(frame, [0, 93], [1, 1.08]);
  const flash = lerpF(frame, [84, 93], [0, 0.9]);

  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      {/* glint -> vertical line -> panel */}
      {open < 0.05 && (
        <div
          style={{
            position: "absolute",
            left: 959,
            top: 510 - lineH / 2,
            width: 2,
            height: lineH,
            background: C.lime,
            boxShadow: "0 0 18px 3px rgba(96,238,121,0.8)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: PX,
          top: PY,
          width: PW,
          height: PH,
          transform: `scaleX(${Math.max(open, 0.002)})`,
          opacity: frame < 8 ? 0 : 1,
        }}
      >
        <GlassPanel width={PW} height={PH} title="My Collection" style={{ border: `1px solid rgba(96,238,121,${0.5 * (1 - open) + 0.08})` }} />
        {/* panel flash */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "#E9FFEE", opacity: flash }} />
      </div>
      {/* slots */}
      {SCATTER.map((it, i) => {
        const s = slot(i);
        const land = startOf(i) + FLIGHT;
        const lit = lerpF(frame, [land, land + 3], [0, 1]);
        const pulse = lerpF(frame, [land, land + 4, land + 16], [0, 1, 0.25]);
        return (
          <div
            key={it.id}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: SW,
              height: SH,
              borderRadius: 16,
              border: lit > 0 ? `1.5px solid rgba(96,238,121,${0.4 + pulse * 0.6})` : "1px dashed rgba(255,255,255,0.12)",
              boxShadow: lit > 0 ? `0 0 ${10 + pulse * 26}px rgba(96,238,121,${0.15 + pulse * 0.45})` : undefined,
              opacity: open,
              background: lit > 0 ? "rgba(96,238,121,0.04)" : undefined,
            }}
          />
        );
      })}
      {/* objects */}
      {SCATTER.map((it, i) => {
        const s = slot(i);
        const from = SCATTER_END[i];
        const t = ease(frame, [startOf(i), startOf(i) + FLIGHT], [0, 1]);
        const size = itemSize(it);
        const fit = Math.min((SW * 0.78) / size.w, (SH * 0.84) / size.h);
        const land = startOf(i) + FLIGHT;
        const over = lerpF(frame, [land, land + 3, land + 9], [1, 1.08, 1]);
        const ctrl: [number, number] = [
          (from.x + s.cx) / 2 + (from.x - 960) * 0.35,
          Math.min(from.y, s.cy) - 220,
        ];
        const [x, y] = quad([from.x, from.y], ctrl, [s.cx, s.cy], t);
        const scale = (from.scale + (fit - from.scale) * t) * over;
        const rotZ = from.rotZ * (1 - t);
        const rotY = from.rotY * (1 - t);
        const blur = from.blur * (1 - t);
        const sat = lerpF(frame, [land - 2, land + 4], [0.6, 1]);
        const bright = lerpF(frame, [land - 2, land + 4], [0.85, 1]);
        const op = from.opacity + (1 - from.opacity) * t;
        return (
          <div
            key={it.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 0,
              height: 0,
              perspective: 1600,
              zIndex: t > 0 && t < 1 ? 10 : 5,
            }}
          >
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) rotateZ(${rotZ}deg) scale(${scale})`,
                filter: `saturate(${sat}) brightness(${bright})${blur > 0.2 ? ` blur(${blur / Math.max(scale, 0.5)}px)` : ""}`,
                opacity: op,
                transformStyle: "preserve-3d",
              }}
            >
              <ItemView it={it} rotY={rotY} glow={it.id === "hero" ? lerpF(frame, [land, land + 6], [0, 0.6]) : 0} />
            </div>
          </div>
        );
      })}
      {SCATTER.map((it, i) => {
        const s = slot(i);
        const land = startOf(i) + FLIGHT;
        return <RingPing key={it.id} x={s.cx} y={s.cy} progress={lerpF(frame, [land, land + 14], [0, 1])} size={130} width={2} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: PY + PH + 34 }}>
        <KineticText text="One place." frame={frame} start={60} size={64} limeStop />
      </div>
    </AbsoluteFill>
  );
};
