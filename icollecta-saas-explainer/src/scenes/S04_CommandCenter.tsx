import { Search, TrendingUp } from "lucide-react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { ArtKind } from "../assets";
import { Collectible } from "../components/Collectible";
import { Counter, LineChart } from "../components/Data";
import { TradingCard } from "../components/TradingCard";
import { Chip, GlassPanel } from "../components/UI";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { C, limeShadow } from "../theme";

const PW = 820;
const PH = 640;
const PY = 230;
const MID_X = 960 - PW / 2;
const QUERY = "vintage rookie";

type Tile = { group: number; art?: ArtKind; kind?: "comic" | "coin" };
const GROUPS = ["Football", "Basketball", "Comics", "Coins"];
const LIB: Tile[] = [
  { group: 0, art: "hero" },
  { group: 0, art: "extra-5" },
  { group: 0, art: "extra-3" },
  { group: 1, art: "extra-2" },
  { group: 1, art: "trade" },
  { group: 1, art: "extra-8" },
  { group: 2, kind: "comic" },
  { group: 2, kind: "comic" },
  { group: 2, kind: "comic" },
  { group: 3, kind: "coin" },
  { group: 3, kind: "coin" },
  { group: 3, kind: "coin" },
];

const TileArt: React.FC<{ t: Tile; w: number; glow?: number }> = ({ t, w, glow = 0 }) =>
  t.kind ? <Collectible kind={t.kind} size={t.kind === "coin" ? w * 1.05 : w * 0.8} /> : <TradingCard art={t.art!} width={w} glow={glow} foil={0.22} />;

// Area 2 search grid: 8 tiles, matches are 0, 2, 5, 7 (hero is index 2).
const SEARCH: { art: ArtKind; match: boolean }[] = [
  { art: "extra-5", match: true },
  { art: "extra-7", match: false },
  { art: "hero", match: true },
  { art: "extra-4", match: false },
  { art: "extra-6", match: false },
  { art: "extra-1", match: true },
  { art: "extra-8", match: false },
  { art: "extra-3", match: true },
];

/** 4 "Command Center": three angled panels; the camera trucks across them. */
export const S04_CommandCenter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const introS = ease(frame, [0, 8], [1.3, 1]);
  const introB = lerpF(frame, [0, 8], [10, 0]);
  const worldX = cam(frame, [0, 81], [600, -600]);
  // types across f28-50 (about 1.6 frames per character)
  const typed = Math.max(0, Math.min(QUERY.length, Math.floor(((frame - 28) / 22) * QUERY.length) + 1));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const filter = ease(frame, [46, 54], [0, 1]);
  const lift = ease(frame, [72, 81], [0, 1], (t) => t * t);
  const value = ease(frame, [54, 76], [11520, 12480]);
  const chart = lerpF(frame, [54, 74], [0, 1]);
  const pts: [number, number][] = [[0, 150], [90, 130], [180, 140], [270, 104], [360, 112], [450, 70], [540, 80], [640, 26]];

  const chipAt = (label: string, at: number) => {
    const p = pop(frame, fps, at);
    return (
      <div style={{ position: "absolute", left: 0, top: -64, transform: `scale(${p})`, transformOrigin: "0 100%", opacity: Math.min(1, p * 2) }}>
        <Chip label={label} variant="lime" size={22} />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ transform: `scale(${introS})`, filter: introB > 0.2 ? `blur(${introB}px)` : undefined }}>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateX(6deg) rotateY(14deg) translateX(${worldX}px)` }}>
          {/* far blurred depth */}
          {[0, 1, 2, 3].map((k) => (
            <div key={k} style={{ position: "absolute", left: -600 + k * 900, top: 120 + (k % 2) * 700, transform: "translateZ(-500px)", filter: "blur(12px)", opacity: 0.35 }}>
              <TradingCard art={`extra-${k + 1}`} width={160} />
            </div>
          ))}
          {/* LEFT panel: organized */}
          <div style={{ position: "absolute", left: MID_X - PW - 18, top: PY, transformOrigin: "100% 50%", transform: "rotateY(18deg)", transformStyle: "preserve-3d" }}>
            {chipAt("Organized", 2)}
            <GlassPanel width={PW} height={PH} title="Command Center" />
            {GROUPS.map((g, gi) => (
              <div key={g} style={{ position: "absolute", left: 30, top: 64 + 34 + gi * 134, fontFamily: UI, fontWeight: 600, fontSize: 22, color: C.grey, opacity: ease(frame, [8 + gi * 2, 16 + gi * 2], [0, 1]) }}>
                {g}
              </div>
            ))}
            {LIB.map((t, i) => {
              const g = t.group;
              const k = i % 3;
              const sx = 240 + k * 170;
              const sy = 64 + 80 + g * 134;
              const jx = 80 + random(`jx${i}`) * 640;
              const jy = 120 + random(`jy${i}`) * 440;
              const jr = (random(`jr${i}`) - 0.5) * 70;
              const p = ease(frame, [2 + i * 1.5, 10 + i * 1.5], [0, 1]); // sorted by f26
              return (
                <div key={i} style={{ position: "absolute", left: jx + (sx - jx) * p, top: jy + (sy - jy) * p, transform: `translate(-50%, -50%) rotate(${jr * (1 - p)}deg)` }}>
                  <TileArt t={t} w={64} />
                </div>
              );
            })}
          </div>
          {/* MIDDLE panel: searchable */}
          <div style={{ position: "absolute", left: MID_X, top: PY, transformStyle: "preserve-3d" }}>
            {chipAt("Searchable", 27)}
            <GlassPanel width={PW} height={PH} title="Search" />
            <div style={{ position: "absolute", left: 30, right: 30, top: 88, height: 64, borderRadius: 999, background: "rgba(255,255,255,0.06)", border: `1.5px solid ${frame > 27 ? "rgba(96,238,121,0.6)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", gap: 14, padding: "0 24px", fontFamily: UI, fontWeight: 500, fontSize: 26, color: C.white }}>
              <Search size={26} color={C.lime} />
              <span>{QUERY.slice(0, typed)}</span>
              <span style={{ width: 2, height: 30, background: C.lime, opacity: caret && frame > 26 ? 1 : 0, marginLeft: -10 }} />
            </div>
            {SEARCH.map((s, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const gx = 120 + col * 190;
              const gy = 300 + row * 240;
              const mi = SEARCH.filter((x, j) => x.match && j < i).length;
              const mx = 120 + mi * 190;
              const my = 410;
              const x = s.match ? gx + (mx - gx) * filter : gx;
              const y = s.match ? gy + (my - gy) * filter : gy;
              const hero = s.art === "hero";
              const glow = hero ? lerpF(frame, [46, 54], [0, 1]) : 0;
              const lz = hero ? lift * 300 : 0;
              const ls = hero ? 1 + lift * 0.4 : 1;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%) translateZ(${lz}px) scale(${(s.match ? 1 : 1 - filter * 0.06) * ls})`,
                    opacity: s.match ? 1 : 1 - filter * 0.85,
                    zIndex: hero ? 3 : 1,
                  }}
                >
                  <TradingCard art={s.art} width={120} glow={glow} foil={0.22} />
                </div>
              );
            })}
          </div>
          {/* RIGHT panel: easy to track */}
          <div style={{ position: "absolute", left: MID_X + PW + 18, top: PY, transformOrigin: "0% 50%", transform: "rotateY(-18deg)", transformStyle: "preserve-3d" }}>
            {chipAt("Easy to track", 52)}
            <GlassPanel width={PW} height={PH} title="Insights" />
            <div style={{ position: "absolute", left: 30, top: 94, right: 30, bottom: 30, borderRadius: 20, background: "rgba(18,24,51,0.6)", border: "1px solid rgba(255,255,255,0.06)", padding: 30 }}>
              <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 24, color: C.grey }}>Collection value</div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
                <Counter value={value} format="usd" style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 72, color: C.white }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.lime, color: C.navy, borderRadius: 999, padding: "8px 16px", fontFamily: UI, fontWeight: 700, fontSize: 22, opacity: lerpF(frame, [58, 62], [0, 1]), boxShadow: limeShadow(0.4, 16) }}>
                  <TrendingUp size={20} strokeWidth={3} /> +8.2%
                </div>
              </div>
              <div style={{ marginTop: 50 }}>
                <svg width={700} height={190} style={{ position: "absolute", overflow: "visible" }}>
                  {[0, 1, 2, 3].map((k) => (
                    <line key={k} x1={0} x2={680} y1={k * 55 + 10} y2={k * 55 + 10} stroke="rgba(255,255,255,0.06)" />
                  ))}
                </svg>
                <LineChart points={pts} width={680} height={180} progress={chart} pingFrame={frame - 74} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
