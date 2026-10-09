import { Check, Lock } from "lucide-react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { PhoneMockup } from "../components/Devices";
import { TradingCard } from "../components/TradingCard";
import { TapRipple } from "../components/UI";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF, pop, quad } from "../lib/anim";
import { C, limeShadow } from "../theme";
import { VAULT } from "./S11B_Escrow";

const PHONE_SCALE = 0.85;
const LEFT = 520;
const RIGHT = 1400;
const PY = 600;

const ListingScreen: React.FC<{ sold?: number; children?: React.ReactNode }> = ({ sold = 0, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "#0E1329", fontFamily: UI, color: C.white, padding: "80px 26px 0" }}>
    <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
      <TradingCard art="extra-1" width={210} variant="slab" foil={0} />
      {sold > 0.01 && (
        <div style={{ position: "absolute", right: 20, top: 16, transform: `scale(${sold}) rotate(-8deg)`, background: C.lime, color: C.navy, fontWeight: 800, fontSize: 22, padding: "8px 18px", borderRadius: 999, boxShadow: limeShadow(0.6, 16) }}>Sold</div>
      )}
    </div>
    <div style={{ marginTop: 20, fontFamily: HEAD, fontWeight: 800, fontSize: 22 }}>Graded baseball slab</div>
    <div style={{ marginTop: 6, fontSize: 32, fontWeight: 700 }}>$180</div>
    <div style={{ marginTop: 18, padding: "16px 0", borderRadius: 999, background: C.lime, color: C.navy, textAlign: "center", fontWeight: 700, fontSize: 20 }}>Buy now</div>
    {children}
  </div>
);

/** 12A "Buy and sell": the vault seam becomes a divider; buy on the left, sold on the right. */
export const S12A_BuySell: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = cam(frame, [0, 60], [1, 1.04]);
  const grow = ease(frame, [0, 10], [0, 1]);
  const divTop = VAULT.y * (1 - grow);
  const divBot = VAULT.y + VAULT.h + (1080 - VAULT.y - VAULT.h) * grow;
  const buy = pop(frame, fps, 6);
  const sell = pop(frame, fps, 32);
  const leftIn = ease(frame, [0, 12], [0, 1]);
  const rightIn = ease(frame, [4, 16], [0, 1]);
  const sheet = ease(frame, [16, 26], [0, 1]);
  const tick = pop(frame, fps, 28);
  const banner = ease(frame, [30, 38], [0, 1]);
  const soldPill = pop(frame, fps, 40);
  const arc = lerpF(frame, [26, 36], [0, 1]);

  const label = (t: string, p: number, x: number) => (
    <div style={{ position: "absolute", left: x, top: 120, transform: `translate(-50%, 0) scale(${p})`, opacity: Math.min(1, p * 2), fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: C.white }}>{t}</div>
  );

  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      <div style={{ position: "absolute", left: 958, top: divTop, width: 4, height: divBot - divTop, background: C.lime, boxShadow: limeShadow(0.9, 20) }} />
      {label("Buy", buy, LEFT)}
      {label("Sell", sell, RIGHT)}
      <div style={{ position: "absolute", left: LEFT, top: PY + (1 - leftIn) * 300, opacity: leftIn, transform: "translate(-50%, -50%) perspective(1600px) rotateY(10deg)" }}>
        <PhoneMockup scale={PHONE_SCALE}>
          <ListingScreen>
            <TapRipple x={195} y={520} progress={lerpF(frame, [12, 24], [0, 1])} size={120} />
          </ListingScreen>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, transform: `translateY(${(1 - sheet) * 380}px)`, background: "#1C2240", borderRadius: "30px 30px 0 0", boxShadow: "0 -20px 50px rgba(0,0,0,0.5)", fontFamily: UI, color: C.white, padding: 28, boxSizing: "border-box" }}>
            <div style={{ width: 60, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.2)", margin: "0 auto 26px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: C.lime, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + tick * 0.4})` }}>
                {tick > 0.3 ? <Check size={30} strokeWidth={3.5} color={C.navy} /> : <Lock size={26} color={C.navy} />}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>Paid · held in escrow</div>
                <div style={{ fontSize: 17, color: C.grey, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
                  <Lock size={15} /> Released when the card arrives
                </div>
              </div>
            </div>
          </div>
        </PhoneMockup>
      </div>
      <div style={{ position: "absolute", left: RIGHT, top: PY + (1 - rightIn) * 300, opacity: rightIn, transform: "translate(-50%, -50%) perspective(1600px) rotateY(-10deg)" }}>
        <PhoneMockup scale={PHONE_SCALE}>
          <ListingScreen sold={soldPill} />
          <div style={{ position: "absolute", left: 14, right: 14, top: 56, transform: `translateY(${(banner - 1) * 140}px)`, background: "rgba(28,34,64,0.96)", borderRadius: 20, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, fontFamily: UI, color: C.white, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 25 }}>
            <div style={{ width: 38, height: 38, borderRadius: 99, background: C.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={22} strokeWidth={3.5} color={C.navy} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Your card sold</div>
          </div>
        </PhoneMockup>
      </div>
      {/* particle arc over the divider */}
      {arc > 0 && arc < 1 &&
        Array.from({ length: 14 }).map((_, i) => {
          const t = Math.max(0, Math.min(1, arc * 1.4 - i * 0.03));
          if (t <= 0 || t >= 1) return null;
          const [x, y] = quad([LEFT + 120, PY - 40], [960, 200], [RIGHT - 120, PY - 40], t);
          return <div key={i} style={{ position: "absolute", left: x - 6, top: y - 6, width: 12 - i * 0.5, height: 12 - i * 0.5, borderRadius: 99, background: C.lime, opacity: 1 - i / 14, boxShadow: "0 0 14px #60EE79" }} />;
        })}
      {/* far depth */}
      <div style={{ position: "absolute", left: 860, top: 880, filter: "blur(10px)", opacity: 0.3 }}>
        <TradingCard art="extra-6" width={150} />
      </div>
    </AbsoluteFill>
  );
};
