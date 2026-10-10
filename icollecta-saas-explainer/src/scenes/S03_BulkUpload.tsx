import { Camera, Check, Image as ImageIcon, Sheet, Upload } from "lucide-react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EXTRA } from "../assets";
import { Collectible } from "../components/Collectible";
import { Counter } from "../components/Data";
import { DirectionalBlur } from "../components/FX";
import { TradingCard } from "../components/TradingCard";
import { Chip, GlassPanel } from "../components/UI";
import { UI } from "../fonts";
import { cam, ease, lerpF, pop, quad } from "../lib/anim";
import { C, limeShadow } from "../theme";

// Revision 1: panel centred (x = 960), source chips in a row above it.
const PANEL = { x: 960 - 550, y: 250, w: 1100, h: 700 };
const HEADER = 64;
const COLS = 6;
const CELL_W = 163;
const CELL_H = 136;
const GAP = 14;
const PAD = 24;
const CHIP_W = 300;
const CHIP_H = 84;
const CHIP_GAP = 28;
const CHIP_Y = 170; // row centre
const TILES = [
  { label: "Photos", icon: ImageIcon },
  { label: "Spreadsheet .csv", icon: Sheet },
  { label: "Scan", icon: Camera },
].map((t, k) => ({ ...t, x: 960 + (k - 1) * (CHIP_W + CHIP_GAP) }));
/** Streams leave from the bottom centre of their chip. */
const source = (k: number): [number, number] => [TILES[k].x, CHIP_Y + CHIP_H / 2];
const arc = (from: [number, number], to: { x: number; y: number }): [number, number] => [(from[0] + to.x) / 2, Math.min(from[1], to.y) - 70];
const COUNT = 30;
const HERO_INDEX = 8;
const launch = (i: number) => 8 + i * 1.6;
const FLIGHT = 10;

const cell = (i: number, scrollY: number) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return {
    x: PANEL.x + PAD + c * (CELL_W + GAP) + CELL_W / 2,
    y: PANEL.y + HEADER + PAD + r * (CELL_H + GAP) + CELL_H / 2 - scrollY,
  };
};

const Thumb: React.FC<{ i: number; glow: number }> = ({ i, glow }) => {
  if (i === HERO_INDEX) return <TradingCard art="hero" width={80} glow={glow} foil={0.25} />;
  if (i === 20) return <Collectible kind="coin" size={96} />;
  if (i % 7 === 3) return <TradingCard art={EXTRA(i)} width={72} variant="slab" foil={0} />;
  return <TradingCard art={EXTRA(i)} width={80} foil={0.2} />;
};

/** 3 "Bulk upload": thumbnails stream from three sources into My Collection. */
export const S03_BulkUpload: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const whip = lerpF(frame, [0, 6], [40, 0]);
  const whipX = ease(frame, [0, 6], [160, 0]);
  const push = cam(frame, [0, 60], [1, 1.06]);
  const through = ease(frame, [60, 69], [0, 1], (t) => t * t * t);
  const scrollY = ease(frame, [38, 60], [0, CELL_H + GAP]);
  const prog = ease(frame, [10, 60], [0, 1], (t) => 1 - Math.pow(1 - t, 3));
  const done = pop(frame, fps, 60);

  return (
    <AbsoluteFill>
      <DirectionalBlur amount={whip}>
        <AbsoluteFill
          style={{
            transform: `translateX(${whipX}px) scale(${push * (1 + through * 1.2)})`,
            transformOrigin: `${PANEL.x + PANEL.w / 2}px ${PANEL.y + PANEL.h / 2}px`,
            filter: through > 0.05 ? `blur(${through * 14}px)` : undefined,
            opacity: 1 - through * 0.3,
          }}
        >
          {/* far depth: blurred floating cards behind */}
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: "absolute", left: 300 + k * 650, top: 80 + (k % 2) * 760, filter: "blur(10px)", opacity: 0.35, transform: `rotate(${k * 17 - 12}deg)` }}>
              <TradingCard art={EXTRA(k + 4)} width={120} />
            </div>
          ))}
          {/* panel */}
          <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y }}>
            <GlassPanel
              width={PANEL.w}
              height={PANEL.h}
              title="My Collection"
              headerRight={
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <Chip label="Bulk upload" variant="lime" icon={Upload} size={18} />
                  <div style={{ width: 200, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${prog * 100}%`, height: "100%", background: C.lime, boxShadow: limeShadow(0.7, 10) }} />
                  </div>
                  {done > 0.02 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, transform: `scale(${done})`, fontFamily: UI, fontWeight: 700, fontSize: 22, color: C.lime }}>
                      <div style={{ width: 28, height: 28, borderRadius: 99, background: C.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={18} strokeWidth={3.5} color={C.navy} />
                      </div>
                      Done
                    </div>
                  ) : null}
                  <Counter value={lerpF(prog, [0, 1], [0, 248])} format="items" style={{ fontFamily: UI, fontWeight: 700, fontSize: 22, color: C.white, minWidth: 110, textAlign: "right" }} />
                </div>
              }
            />
          </div>
          {/* grid clip */}
          <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y + HEADER, width: PANEL.w, height: PANEL.h - HEADER, overflow: "hidden" }}>
            {Array.from({ length: COUNT + 6 }).map((_, i) => {
              const c = cell(i, scrollY);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: c.x - PANEL.x - CELL_W / 2,
                    top: c.y - PANEL.y - HEADER - CELL_H / 2,
                    width: CELL_W,
                    height: CELL_H,
                    borderRadius: 14,
                    border: "1px dashed rgba(255,255,255,0.08)",
                  }}
                />
              );
            })}
          </div>
          {/* trails + thumbnails */}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {Array.from({ length: COUNT }).map((_, i) => {
              const t = lerpF(frame, [launch(i), launch(i) + FLIGHT], [0, 1]);
              if (t <= 0 || t >= 1) return null;
              const from = source(i % 3);
              const to = cell(i, scrollY);
              const ctrl = arc(from, to);
              const pts = Array.from({ length: 10 }, (_, k) => quad(from, ctrl, [to.x, to.y], Math.max(0, t - 0.3 + (k / 9) * 0.3)));
              return <polyline key={i} points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.lime} strokeWidth={3} strokeLinecap="round" opacity={0.55} style={{ filter: "drop-shadow(0 0 6px rgba(96,238,121,0.8))" }} />;
            })}
          </svg>
          {Array.from({ length: COUNT }).map((_, i) => {
            const t = ease(frame, [launch(i), launch(i) + FLIGHT], [0, 1]);
            if (t <= 0) return null;
            const from = source(i % 3);
            const to = cell(i, scrollY);
            const ctrl = arc(from, to);
            const [x, y] = quad(from, ctrl, [to.x, to.y], t);
            const land = launch(i) + FLIGHT;
            const flash = lerpF(frame, [land, land + 2, land + 10], [0, 1, 0]);
            const hero = i === HERO_INDEX;
            const top = PANEL.y + HEADER;
            const clipTop = t >= 1 ? Math.max(0, top - (y - CELL_H / 2)) : 0;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: 0, height: 0, zIndex: hero ? 6 : 5 }}>
                <div
                  style={{
                    position: "absolute",
                    left: -CELL_W / 2,
                    top: -CELL_H / 2,
                    width: CELL_W,
                    height: CELL_H,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${0.6 + t * 0.4})`,
                    clipPath: clipTop > 0 ? `inset(${clipTop}px 0 0 0)` : undefined,
                    borderRadius: 14,
                    boxShadow: flash > 0 ? `inset 0 0 0 2px rgba(96,238,121,${flash}), 0 0 ${flash * 24}px rgba(96,238,121,${flash * 0.6})` : undefined,
                  }}
                >
                  <Thumb i={i} glow={hero ? lerpF(frame, [land, land + 6], [0, 0.8]) : 0} />
                </div>
              </div>
            );
          })}
          {/* source chips, a centred row above the panel (drawn last: cards emerge from behind them) */}
          {TILES.map((t, k) => {
            const p = pop(frame, fps, 2 + k * 3);
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                style={{
                  position: "absolute",
                  left: t.x - CHIP_W / 2,
                  top: CHIP_Y - CHIP_H / 2,
                  width: CHIP_W,
                  height: CHIP_H,
                  transform: `translateY(${(1 - p) * -40}px) scale(${0.9 + p * 0.1})`,
                  opacity: Math.min(1, p * 1.5),
                  zIndex: 10,
                }}
              >
                <GlassPanel width={CHIP_W} height={CHIP_H} style={{ display: "flex", borderRadius: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, height: CHIP_H, width: CHIP_W }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: C.slate, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={28} color={C.white} strokeWidth={2.2} />
                    </div>
                    <span style={{ fontFamily: UI, fontWeight: 600, fontSize: 24, color: C.white }}>{t.label}</span>
                  </div>
                </GlassPanel>
              </div>
            );
          })}
        </AbsoluteFill>
      </DirectionalBlur>
    </AbsoluteFill>
  );
};
