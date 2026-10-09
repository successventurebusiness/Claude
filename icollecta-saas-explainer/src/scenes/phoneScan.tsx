import { Check } from "lucide-react";
import { TradingCard } from "../components/TradingCard";
import { ScanLine } from "../components/FX";
import { UI } from "../fonts";
import { C } from "../theme";

// Shared phone geometry for S08A / S08B / S09.
export const PHONE_SCALE = 1.1;
export const SCAN_CARD = { x: 75, y: 160, w: 240 }; // on the 390x844 screen
export const SCAN_CARD_H = (SCAN_CARD.w * 7) / 5;

export const Viewfinder: React.FC<{ scan: number; frontTick: number; grid: number }> = ({ scan, frontTick, grid }) => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 45%, #1A2140 0%, #05070F 85%)", fontFamily: UI, color: C.white }}>
    <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 999, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(96,238,121,0.5)", fontSize: 16, fontWeight: 600 }}>
        <div style={{ width: 8, height: 8, borderRadius: 9, background: C.lime }} /> Scanning front &amp; back
      </div>
    </div>
    <div style={{ position: "absolute", left: SCAN_CARD.x, top: SCAN_CARD.y, width: SCAN_CARD.w, height: SCAN_CARD_H }}>
      <TradingCard art="hero" width={SCAN_CARD.w} loader={false} foil={0.2} />
      <div style={{ position: "absolute", inset: 0, opacity: grid }}>
        <ScanLine width={SCAN_CARD.w} height={SCAN_CARD_H} progress={scan} />
      </div>
      {/* corner guides */}
      {[
        [0, 0, "M2 26 L2 2 L26 2"],
        [1, 0, "M0 2 L24 2 L24 26"],
        [1, 1, "M24 0 L24 24 L0 24"],
        [0, 1, "M2 0 L2 24 L26 24"],
      ].map(([cx, cy, d], i) => (
        <svg key={i} width={28} height={28} style={{ position: "absolute", left: (cx as number) ? SCAN_CARD.w - 14 : -14, top: (cy as number) ? SCAN_CARD_H - 14 : -14 }}>
          <path d={d as string} stroke={C.white} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </svg>
      ))}
    </div>
    <div style={{ position: "absolute", bottom: 46, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
      {["Front", "Back"].map((l, i) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 70, height: 96, borderRadius: 10, border: `2px solid ${i === 0 && frontTick > 0 ? C.lime : "rgba(255,255,255,0.25)"}`, background: "rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
            {i === 0 && frontTick > 0 && <TradingCard art="hero" width={66} loader={false} foil={0} style={{ position: "absolute", left: 0, top: 0 }} />}
            {i === 0 && frontTick > 0 && (
              <div style={{ position: "absolute", right: 4, top: 4, width: 24, height: 24, borderRadius: 99, background: C.lime, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${frontTick})` }}>
                <Check size={16} strokeWidth={3.5} color={C.navy} />
              </div>
            )}
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.grey }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);
