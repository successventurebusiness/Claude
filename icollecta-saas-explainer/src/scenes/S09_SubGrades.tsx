import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SubgradeTile } from "../components/Data";
import { PhoneMockup } from "../components/Devices";
import { DirectionalBlur, Magnifier } from "../components/FX";
import { TradingCard, cardFaceSize } from "../components/TradingCard";
import { GlassPanel } from "../components/UI";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { C, limeShadow } from "../theme";
import { PHONE_SCALE } from "./phoneScan";
import { ResultView } from "./S08B_PreGrade";

const CW_NOMINAL = 443; // 620 tall; the 3:4 vintage face sets the real width
const CW = cardFaceSize(CW_NOMINAL, "hero").w;
const CH = 620;
const CX = 960;
const CY = 560;
const L = CX - CW / 2;
const T = CY - CH / 2;
const PINS = [
  { n: 1, x: L + CW * 0.38, at: 48 },
  { n: 2, x: L + CW * 0.6, at: 54 },
];

const TILES = [
  { label: "Centering", value: 9.5, x: 560, y: 330, at: 14 },
  { label: "Corners", value: 8.5, x: 1360, y: 330, at: 20, strong: true },
  { label: "Edges", value: 9.5, x: 560, y: 800, at: 26 },
  { label: "Surface", value: 9.5, x: 1360, y: 800, at: 32 },
];

/** Two tiny white wear specks on the top edge (revealed by the magnifier). */
const Specks: React.FC = () => (
  <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
    <g style={{ filter: "drop-shadow(0 0 0.6px rgba(60,40,20,0.9))" }}>
      <ellipse cx={500 * 0.38 - 2} cy={5} rx={4.2} ry={2.2} fill="#FFFFFF" />
      <ellipse cx={500 * 0.6 + 3} cy={4.5} rx={3.2} ry={1.8} fill="#FFFFFF" />
      <path d={`M${500 * 0.38 - 10} 2.5 L${500 * 0.38 + 8} 3.5`} stroke="#FFFFFF" strokeWidth={1.3} />
    </g>
  </svg>
);

const BigCard: React.FC<{ scale: number; x: number; y: number }> = ({ scale, x, y }) => (
  <div style={{ position: "absolute", left: x - CW / 2, top: y - CH / 2, width: CW, height: CH, transform: `scale(${scale})`, transformStyle: "preserve-3d" }}>
    <TradingCard art="hero" width={CW_NOMINAL} loader={false} foil={0.25} glow={0.35} rotateX={-8} face={<Specks />} />
  </div>
);

const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; label: string; lx: number; ly: number }> = ({ x1, y1, x2, y2, p, label, lx, ly }) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <g opacity={p > 0 ? 1 : 0}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.lime} strokeWidth={2} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {p > 0.95 && (
        <>
          <path d={`M${x1 + 8} ${y1 - 6} L${x1} ${y1} L${x1 + 8} ${y1 + 6}`} stroke={C.lime} strokeWidth={2} fill="none" />
          <path d={`M${x2 - 8} ${y2 - 6} L${x2} ${y2} L${x2 - 8} ${y2 + 6}`} stroke={C.lime} strokeWidth={2} fill="none" />
        </>
      )}
      <text x={lx} y={ly} fill={C.lime} fontFamily="Inter" fontWeight={700} fontSize={26} textAnchor="middle" opacity={lerpF(p, [0.6, 1], [0, 1])}>
        {label}
      </text>
    </g>
  );
};

/** 9 "Sub-grades and the reason why". */
export const S09_SubGrades: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lift = ease(frame, [0, 20], [0, 1]);
  const startScale = 256 / CW_NOMINAL;
  const scale = startScale + (1 - startScale) * lift;
  const cy = 220 + (CY - 220) * lift;
  const orbit = cam(frame, [0, 102], [-10, 8]);
  const push = cam(frame, [62, 102], [1, 1.15]);
  const whip = ease(frame, [96, 102], [0, 1], (t) => t * t);
  const dims = ease(frame, [8, 24], [0, 1]);
  const why = ease(frame, [66, 80], [0, 1]);
  const magIn = pop(frame, fps, 58);
  const magO = lerpF(frame, [58, 62], [0, 1]);
  const lookX = (PINS[0].x + PINS[1].x) / 2;

  return (
    <AbsoluteFill>
      <DirectionalBlur amount={whip * 60}>
        <AbsoluteFill style={{ transform: `translateX(${-whip * 700}px) scale(${push})`, transformOrigin: `${CX}px ${T}px` }}>
          {/* phone drops away */}
          <div style={{ position: "absolute", left: 960, top: 540 + lift * 260, transform: `translate(-50%, -50%) scale(${PHONE_SCALE * 1.28 * (1 - lift * 0.2)})`, filter: `blur(${lift * 10}px)`, opacity: 1 - lift * 0.5 }}>
            <PhoneMockup>
              <ResultView frame={39} cardOpacity={0} />
            </PhoneMockup>
          </div>
          <AbsoluteFill style={{ perspective: 1600 }}>
            <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateY(${orbit}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
              {/* tiles slide out from behind the card */}
              {TILES.map((t) => {
                const p = pop(frame, fps, t.at);
                const x = CX + (t.x - CX) * p;
                const y = CY + (t.y - CY) * p;
                const v = ease(frame, [t.at, t.at + 10], [0, t.value]);
                return (
                  <div key={t.label} style={{ position: "absolute", left: x - 120, top: y - 60, opacity: Math.min(1, p * 2), transform: "translateZ(-20px)" }}>
                    <SubgradeTile label={t.label} value={v.toFixed(1)} strong={t.strong} />
                  </div>
                );
              })}
              <BigCard scale={scale} x={CX} y={cy} />
              {/* blueprint dimension lines */}
              {lift > 0.9 && (
                <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "drop-shadow(0 0 6px rgba(96,238,121,0.6))" }}>
                  <line x1={L} y1={T + CH + 24} x2={L} y2={T + CH + 60} stroke={C.lime} strokeWidth={2} opacity={dims} />
                  <line x1={L + CW} y1={T + CH + 24} x2={L + CW} y2={T + CH + 60} stroke={C.lime} strokeWidth={2} opacity={dims} />
                  <line x1={L + 20} y1={T + CH + 14} x2={L + 20} y2={T + CH + 60} stroke={C.lime} strokeWidth={1.5} opacity={dims * 0.7} strokeDasharray="4 4" />
                  <line x1={L + CW - 18} y1={T + CH + 14} x2={L + CW - 18} y2={T + CH + 60} stroke={C.lime} strokeWidth={1.5} opacity={dims * 0.7} strokeDasharray="4 4" />
                  <Arrow x1={L} y1={T + CH + 44} x2={L + 20} y2={T + CH + 44} p={dims} label="L 52" lx={L - 40} ly={T + CH + 52} />
                  <Arrow x1={L + CW - 18} y1={T + CH + 44} x2={L + CW} y2={T + CH + 44} p={dims} label="R 48" lx={L + CW + 42} ly={T + CH + 52} />
                  <line x1={L - 24} y1={T} x2={L - 24} y2={T + CH * dims} stroke={C.lime} strokeWidth={2} />
                  <line x1={L + CW + 24} y1={T} x2={L + CW + 24} y2={T + CH * dims} stroke={C.lime} strokeWidth={2} />
                  <line x1={L - 34} y1={T} x2={L - 14} y2={T} stroke={C.lime} strokeWidth={2} opacity={dims} />
                  <line x1={L + CW + 14} y1={T} x2={L + CW + 34} y2={T} stroke={C.lime} strokeWidth={2} opacity={dims} />
                </svg>
              )}
              {/* numbered pins drop onto the top edge */}
              {PINS.map((p) => {
                const s = pop(frame, fps, p.at);
                if (s <= 0.01) return null;
                return (
                  <div key={p.n} style={{ position: "absolute", left: p.x - 22, top: T - 20 - (1 - s) * 60, opacity: Math.min(1, s * 3) }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: C.lime, boxShadow: limeShadow(0.6, 14), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ transform: "rotate(45deg)", fontFamily: HEAD, fontWeight: 800, fontSize: 22, color: C.navy }}>{p.n}</span>
                    </div>
                  </div>
                );
              })}
              {/* magnifier above the pins, looking at the top edge */}
              <Magnifier x={lookX} y={T - 100} lookX={lookX} lookY={T + 56} radius={85} zoom={3.4} scale={magIn} opacity={magO} width={1920} height={1080}>
                <BigCard scale={1} x={CX} y={CY} />
              </Magnifier>
            </AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
          {/* why this grade */}
        <div style={{ position: "absolute", left: 1290, top: 480, transform: `translateX(${(1 - why) * 220}px)`, opacity: why }}>
          <GlassPanel width={520} height={200} title="Why this grade">
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {["Two soft touches on the upper edge - minor wear", "Corners 8.5, everything else 9.5"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontFamily: UI, fontWeight: 500, fontSize: 19, color: C.white, lineHeight: 1.3 }}>
                  <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 99, background: C.lime, color: C.navy, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  {t}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </DirectionalBlur>
    </AbsoluteFill>
  );
};
