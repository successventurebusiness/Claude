import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Counter, LineChart, ValueBadge } from "../components/Data";
import { Flash, RingPing } from "../components/FX";
import { TradingCard } from "../components/TradingCard";
import { Chip, GlassPanel } from "../components/UI";
import { UI } from "../fonts";
import { cam, ease, lerpF, pop, quad } from "../lib/anim";
import { C, SPRING_PANEL } from "../theme";
import { HANG_COUNT, hangDot } from "./worth";

const CHART = { cx: 1300, cy: 600, w: 900, h: 560 };
const PLOT = { x: CHART.cx - CHART.w / 2 + 70, y: CHART.cy - CHART.h / 2 + 140, w: CHART.w - 130, h: CHART.h - 210 };
const BADGE = { x: 560, y: 150 };
const BADGE_CENTER = { x: 720, y: 235 };

// 14 sale points, rising, with deterministic jitter ($180..$245 range).
const POINTS = Array.from({ length: 14 }, (_, i) => {
  const t = i / 13;
  const price = 182 + t * 50 + (random(`sale${i}`) - 0.5) * 26;
  return { x: PLOT.x + t * PLOT.w, y: PLOT.y + PLOT.h - ((price - 160) / 100) * PLOT.h, price };
});
const LABELS = [
  { i: 4, text: "Sold $205 · 2w ago", at: 38 },
  { i: 9, text: "Sold $212 · 3d ago", at: 30 },
  { i: 12, text: "Sold $238 · 1w ago", at: 34 },
];

/** 6 "Recent market data": dots become 14 recent sales and resolve into a value. */
export const S06_MarketData: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: SPRING_PANEL, durationInFrames: 14 });
  const cardX = 1180 + (520 - 1180) * slide;
  const cardRot = 10 + (8 - 10) * slide;
  const panelIn = pop(frame, fps, 9);
  const push = cam(frame, [0, 93], [1, 1.07]);
  const trend = lerpF(frame, [36, 52], [0, 1]);
  const badge = pop(frame, fps, 56);
  const value = ease(frame, [56, 70], [0, 225]);
  const lock = lerpF(frame, [70, 86], [0, 1]);
  const shine = lerpF(frame, [70, 84], [-0.3, 1.3]);
  const flash = lerpF(frame, [86, 90, 93], [0, 0.35, 0.5]);

  const trendPts = [POINTS[0], POINTS[4], POINTS[8], POINTS[13]].map((p) => [p.x - PLOT.x, p.y - PLOT.y] as [number, number]);

  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      {/* far depth */}
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: 120 + k * 1500, top: 760 - k * 640, filter: "blur(10px)", opacity: 0.3 }}>
          <TradingCard art={`extra-${k + 5}`} width={130} />
        </div>
      ))}
      <div style={{ position: "absolute", left: cardX, top: 540 + slide * 20, transform: `translate(-50%, -50%) scale(${1 - 0.25 * slide})`, perspective: 1600 }}>
        <TradingCard art="hero" width={440} rotateY={cardRot} glow={0.45 + lock * 0.4 * (1 - lock)} shine={shine} />
      </div>
      {/* chart panel */}
      <div style={{ position: "absolute", left: CHART.cx - CHART.w / 2, top: CHART.cy - CHART.h / 2, transform: `translateY(${(1 - panelIn) * 40}px) scale(${0.96 + panelIn * 0.04})`, opacity: Math.min(1, panelIn * 1.5) }}>
        <GlassPanel width={CHART.w} height={CHART.h} title="Recent sales" headerRight={<span style={{ fontFamily: UI, fontWeight: 500, fontSize: 20, color: C.grey }}>Last 90 days</span>}>
          <svg width={CHART.w} height={CHART.h - 64} style={{ position: "absolute", left: 0, top: 0 }}>
            {[0, 1, 2, 3].map((k) => (
              <line key={k} x1={70} x2={CHART.w - 60} y1={76 + k * (PLOT.h / 3)} y2={76 + k * (PLOT.h / 3)} stroke="rgba(255,255,255,0.06)" />
            ))}
            <line x1={70} x2={70} y1={60} y2={PLOT.h + 80} stroke="rgba(255,255,255,0.12)" />
            <line x1={70} x2={CHART.w - 60} y1={PLOT.h + 80} y2={PLOT.h + 80} stroke="rgba(255,255,255,0.12)" />
          </svg>
          {["$250", "$220", "$190", "$160"].map((l, k) => (
            <div key={l} style={{ position: "absolute", left: 14, top: 64 + k * (PLOT.h / 3), fontFamily: UI, fontWeight: 500, fontSize: 16, color: C.grey }}>
              {l}
            </div>
          ))}
        </GlassPanel>
      </div>
      <div style={{ position: "absolute", left: PLOT.x, top: PLOT.y }}>
        <LineChart points={trendPts} width={PLOT.w} height={PLOT.h} progress={trend} area={false} strokeWidth={3} />
      </div>
      {/* hanging dots: 7 become sale points, the rest dissolve; 7 new ones arrive from the right */}
      {Array.from({ length: HANG_COUNT }).map((_, i) => {
        const d = hangDot(i);
        if (i >= 7) {
          const o = lerpF(frame, [0, 14], [1, 0]);
          return o > 0 ? <div key={i} style={{ position: "absolute", left: d.x - d.r, top: d.y - d.r - frame * 2, width: d.r * 2, height: d.r * 2, borderRadius: 99, background: C.lime, opacity: o, boxShadow: "0 0 10px #60EE79" }} /> : null;
        }
        return null;
      })}
      {POINTS.map((p, i) => {
        const fromHang = i < 7;
        const h = hangDot(i);
        const start = 8 + i * 2;
        const t = ease(frame, [start, start + 10], [0, 1]);
        const from: [number, number] = fromHang ? [h.x, h.y] : [1960, p.y - 60 + random(`in${i}`) * 120];
        const ctrl: [number, number] = [(from[0] + p.x) / 2, Math.min(from[1], p.y) - 80];
        const [x, y] = quad(from, ctrl, [p.x, p.y], t);
        const trail = t > 0 && t < 1 ? quad(from, ctrl, [p.x, p.y], Math.max(0, t - 0.25)) : null;
        // copies fly into the badge
        const ct = ease(frame, [52 + (i % 7), 60 + (i % 7)], [0, 1]);
        const cc = quad([p.x, p.y], [(p.x + BADGE_CENTER.x) / 2, Math.min(p.y, BADGE_CENTER.y) - 200], [BADGE_CENTER.x, BADGE_CENTER.y], ct);
        return (
          <div key={i}>
            {trail && (
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
                <line x1={trail[0]} y1={trail[1]} x2={x} y2={y} stroke={C.lime} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
              </svg>
            )}
            <div style={{ position: "absolute", left: x - 8, top: y - 8, width: 16, height: 16, borderRadius: 99, background: C.lime, boxShadow: "0 0 14px rgba(96,238,121,0.9)", opacity: t > 0 ? 1 : 0 }} />
            {ct > 0 && ct < 1 && <div style={{ position: "absolute", left: cc[0] - 6, top: cc[1] - 6, width: 12, height: 12, borderRadius: 99, background: C.lime, boxShadow: "0 0 12px #60EE79" }} />}
          </div>
        );
      })}
      {LABELS.map((l) => {
        const p = POINTS[l.i];
        const s = pop(frame, fps, l.at);
        return (
          <div key={l.i} style={{ position: "absolute", left: p.x - 20, top: p.y - 74, transform: `scale(${s})`, transformOrigin: "20px 100%", opacity: Math.min(1, s * 2) }}>
            <Chip label={l.text} size={20} />
          </div>
        );
      })}
      {/* value badge */}
      <div style={{ position: "absolute", left: BADGE.x, top: BADGE.y, transform: `scale(${badge})`, transformOrigin: "0% 100%", opacity: Math.min(1, badge * 2) }}>
        <ValueBadge
          label="Estimated value"
          value={<Counter value={value} format="usdShort" />}
          sub="Based on 14 recent sales"
          subOpacity={lerpF(frame, [66, 72], [0, 1])}
          glow={lock > 0 && lock < 1 ? 1 - lock : 0}
        />
      </div>
      <RingPing x={BADGE_CENTER.x} y={BADGE_CENTER.y} progress={lock} size={300} />
      <Flash opacity={flash} x={BADGE_CENTER.x} y={BADGE_CENTER.y} radius={900} />
    </AbsoluteFill>
  );
};
