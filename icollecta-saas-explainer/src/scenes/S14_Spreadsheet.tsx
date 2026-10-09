import { ArrowLeftRight } from "lucide-react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { EXTRA } from "../assets";
import { LineChart } from "../components/Data";
import { KineticText } from "../components/KineticText";
import { CardArt, TradingCard } from "../components/TradingCard";
import { cardArt } from "../assets";
import { UI } from "../fonts";
import { cam, ease, lerpF } from "../lib/anim";
import { C, limeShadow } from "../theme";

const WIN = { x: 360, y: 250, w: 1200, h: 700 };
const COLS = ["Card", "Year", "Condition", "Value"];
const COL_W = [420, 220, 280, 280];
const ROW_H = 54;
const ROWS = [
  ["Rookie holo FB", "2019", "NM?", "???"],
  ["Vintage dunk", "1986", "EX", "$??"],
  ["Slab #2 (check)", "2003", "9?", "???"],
  ["Comic #14 bagged", "1991", "VF", "-"],
  ["Silver coin", "1964", "?", "???"],
  ["Signed ball", "1998", "good", "ask"],
  ["Hockey rookie", "2011", "NM", "$??"],
  ["Pitcher (old)", "1952", "VG?", "???"],
  ["Cartridge game", "1989", "CIB?", "-"],
  ["Jersey framed", "2005", "?", "???"],
];

// Final collection view: 8 tiles around the featured hero card.
const TILES = Array.from({ length: 8 }, (_, i) => {
  const left = i < 4;
  const k = i % 4;
  return { x: left ? WIN.x + 60 + (k % 2) * 200 : WIN.x + WIN.w - 60 - 180 - (k % 2) * 200, y: WIN.y + 110 + Math.floor(k / 2) * 280, art: EXTRA(i + 1), value: `$${[140, 95, 310, 62, 180, 455, 88, 260][i]}` };
});

/** 14 "More than a spreadsheet": a dull sheet cracks and re-assembles as iCollecta. */
export const S14_Spreadsheet: React.FC = () => {
  const frame = useCurrentFrame();
  const sat = frame < 14 ? 0.1 : lerpF(frame, [14, 50], [0.1, 1]);
  const pull = cam(frame, [0, 80], [1.1, 1]);
  const rise = cam(frame, [0, 80], [20, 0]);
  const fall = ease(frame, [0, 10], [0, 1], (t) => t * t);
  const bounce = lerpF(frame, [10, 13, 17], [1, 1.05, 1]);
  const heroScale = (2.5 - 1.5 * fall) * bounce;
  const crack = ease(frame, [14, 20], [0, 1]);
  const toNavy = ease(frame, [24, 44], [0, 1]);
  const strike = ease(frame, [46, 56], [0, 1]);
  const recede = ease(frame, [80, 90], [0, 1]);

  const cells: { r: number; c: number; x: number; y: number; w: number }[] = [];
  ROWS.forEach((row, r) =>
    row.forEach((_, c) => {
      const x = WIN.x + 40 + COL_W.slice(0, c).reduce((a, b) => a + b, 0) * ((WIN.w - 80) / 1200);
      cells.push({ r, c, x, y: WIN.y + 96 + ROW_H * (r + 1), w: COL_W[c] * ((WIN.w - 80) / 1200) });
    }),
  );

  return (
    <AbsoluteFill style={{ filter: `saturate(${sat})` }}>
      <AbsoluteFill style={{ transform: `translateY(${rise}px) scale(${pull * (1 - recede * 0.08)})`, filter: recede > 0 ? `brightness(${1 - recede * 0.35})` : undefined }}>
        {/* window: light spreadsheet -> navy iCollecta panel */}
        <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 18, overflow: "hidden", background: toNavy > 0 ? `rgba(28,34,64,${toNavy})` : "#F1F2F5", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", border: `1px solid rgba(255,255,255,${0.08 * toNavy})` }}>
          <div style={{ position: "absolute", inset: 0, background: "#F1F2F5", opacity: 1 - toNavy }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 52, background: toNavy > 0.5 ? "rgba(18,24,51,0.6)" : "#DCDFE6", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", fontFamily: UI, fontWeight: 600, fontSize: 20, color: toNavy > 0.5 ? C.white : "#5A6178" }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ width: 13, height: 13, borderRadius: 9, background: toNavy > 0.5 ? (k === 0 ? C.lime : C.slate) : "#B8BCC8" }} />
            ))}
            <span style={{ marginLeft: 12 }}>{toNavy > 0.5 ? "My Collection" : "collection_final_v7.xlsx"}</span>
          </div>
          {/* header row */}
          <div style={{ position: "absolute", left: 40, top: 96, display: "flex", opacity: 1 - toNavy, fontFamily: UI, fontWeight: 700, fontSize: 22, color: "#6B7186" }}>
            {COLS.map((c, i) => (
              <div key={c} style={{ width: COL_W[i] * ((WIN.w - 80) / 1200) }}>{c}</div>
            ))}
          </div>
        </div>
        {/* cells detach, flip and fly */}
        {cells.map((cell, i) => {
          const d = 20 + (cell.r * 4 + cell.c) * 0.7;
          const t = ease(frame, [d, d + 14], [0, 1]);
          const ang = random(`ca${i}`) * Math.PI * 2;
          const dist = 300 + random(`cd${i}`) * 700;
          const tx = cell.x + Math.cos(ang) * dist * t;
          const ty = cell.y + Math.sin(ang) * dist * t * 0.6 - t * 80;
          return (
            <div key={i} style={{ position: "absolute", left: tx, top: ty, width: cell.w - 8, height: ROW_H - 8, perspective: 800, opacity: 1 - lerpF(t, [0.6, 1], [0, 1]) }}>
              <div style={{ width: "100%", height: "100%", transform: `rotateY(${t * 180}deg) rotateX(${t * 60}deg)`, transformStyle: "preserve-3d" }}>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderBottom: "1px solid #D5D8E0", fontFamily: UI, fontWeight: 500, fontSize: 21, color: "#8A90A3", display: "flex", alignItems: "center" }}>{ROWS[cell.r][cell.c]}</div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 10, background: C.panel, border: "1px solid rgba(96,238,121,0.45)", boxShadow: limeShadow(0.3, 10) }} />
              </div>
            </div>
          );
        })}
        {/* crack */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <path
            d={`M ${WIN.x + 60} ${WIN.y + 80} L 700 430 L 760 470 L 900 520 L 1010 610 L 1120 650 L 1260 760 L ${WIN.x + WIN.w - 60} ${WIN.y + WIN.h - 60}`}
            fill="none"
            stroke={C.lime}
            strokeWidth={4}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - crack}
            opacity={1 - toNavy}
            style={{ filter: "drop-shadow(0 0 10px rgba(96,238,121,0.9))" }}
          />
        </svg>
        {/* re-assembled collection tiles */}
        {TILES.map((tl, i) => {
          const d = 30 + i * 2;
          const t = ease(frame, [d, d + 14], [0, 1]);
          const from = cells[i * 5];
          const x = from.x + (tl.x - from.x) * t;
          const y = from.y + (tl.y - from.y) * t;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 180, height: 250, perspective: 800, opacity: t > 0 ? 1 : 0 }}>
              <div style={{ width: "100%", height: "100%", transform: `rotateY(${(1 - t) * 180}deg) scale(${0.4 + 0.6 * t})`, borderRadius: 16, background: C.panel, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", fontFamily: UI }}>
                <div style={{ height: 150, margin: 8, borderRadius: 10, overflow: "hidden" }}>
                  <CardArt art={cardArt(tl.art)} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 12px" }}>
                  <span style={{ background: C.lime, color: C.navy, fontWeight: 700, fontSize: 15, padding: "3px 8px", borderRadius: 999 }}>9.0</span>
                  <span style={{ color: C.lime, fontWeight: 700, fontSize: 20 }}>{tl.value}</span>
                </div>
                <svg width={160} height={34} style={{ marginLeft: 10 }}>
                  <polyline points={Array.from({ length: 8 }, (_, k) => `${k * 22},${26 - k * 2.4 - random(`sp${i}${k}`) * 10}`).join(" ")} fill="none" stroke={C.lime} strokeWidth={2} />
                </svg>
              </div>
            </div>
          );
        })}
        {/* chart + trade button in the new view */}
        <div style={{ position: "absolute", left: 960 - 130, top: WIN.y + WIN.h - 120, opacity: ease(frame, [48, 58], [0, 1]) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.lime, color: C.navy, borderRadius: 999, padding: "14px 30px", fontFamily: UI, fontWeight: 700, fontSize: 24, boxShadow: limeShadow(0.4, 20) }}>
            <ArrowLeftRight size={24} strokeWidth={2.6} /> Trade
          </div>
        </div>
        <div style={{ position: "absolute", left: 960 - 160, top: WIN.y + WIN.h - 190, opacity: ease(frame, [44, 54], [0, 1]) }}>
          <LineChart points={[[0, 40], [60, 34], [120, 36], [180, 22], [240, 18], [320, 4]]} width={320} height={46} progress={lerpF(frame, [44, 60], [0, 1])} area={false} strokeWidth={3} />
        </div>
        {/* hero card lands on the sheet and ends featured */}
        <div style={{ position: "absolute", left: 960, top: 540 + 20, transform: `translate(-50%, -50%) scale(${heroScale})`, filter: `drop-shadow(0 ${30 * (1 - fall) + 18}px ${30}px rgba(0,0,0,0.45))`, zIndex: 20 }}>
          <TradingCard art="hero" width={220} glow={lerpF(frame, [30, 50], [0.2, 1])} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, zIndex: 30 }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <KineticText
            text="More than a spreadsheet."
            frame={frame}
            start={30}
            size={64}
            limeStop
            wordStyle={(w) => (w === "spreadsheet" ? { color: `rgba(255,255,255,${1 - strike * 0.5})`, position: "relative" } : undefined)}
          />
          {strike > 0 && (
            <div style={{ position: "absolute", left: 960 + 6, top: 40, width: 400 * strike, height: 6, borderRadius: 4, background: C.lime, boxShadow: limeShadow(0.7, 12) }} />
          )}
        </div>
      </div>
      {recede > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, rgba(96,238,121,${0.45 * recede}), rgba(96,238,121,0) 60%)` }} />}
    </AbsoluteFill>
  );
};
