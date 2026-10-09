import { Search } from "lucide-react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { avatar, crowd, EXTRA } from "../assets";
import { Avatar } from "../components/Data";
import { PhoneMockup } from "../components/Devices";
import { DirectionalBlur } from "../components/FX";
import { CardArt, TradingCard } from "../components/TradingCard";
import { cardArt } from "../assets";
import { TapRipple } from "../components/UI";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF } from "../lib/anim";
import { C, limeShadow } from "../theme";

const ITEM_H = 200;
const GAP = 16;
const FEED_TOP = 200;
const FEATURED = 7;
const FEATURED_H = 330;
const featuredTop = FEED_TOP + FEATURED * (ITEM_H + GAP);
export const SCROLL_END = featuredTop + FEATURED_H / 2 - 470;
export const HOLO_END = { x: 1220, y: 470 };

const Listing: React.FC<{ i: number }> = ({ i }) => (
  <div style={{ height: ITEM_H, borderRadius: 18, background: "#1C2240", display: "flex", gap: 14, padding: 12, boxSizing: "border-box" }}>
    <div style={{ width: 126, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
      <CardArt art={cardArt(EXTRA(i * 3))} />
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, paddingTop: 10 }}>
      <div style={{ width: "85%", height: 14, borderRadius: 7, background: "rgba(255,255,255,0.35)" }} />
      <div style={{ width: "55%", height: 12, borderRadius: 7, background: "rgba(255,255,255,0.18)" }} />
      <div style={{ width: 70, height: 16, borderRadius: 8, background: "rgba(96,238,121,0.75)", marginTop: 6 }} />
      <div style={{ flex: 1 }} />
      <Avatar who={crowd(i)} size={30} />
    </div>
  </div>
);

const Featured: React.FC<{ outline: number }> = ({ outline }) => (
  <div
    style={{
      height: FEATURED_H,
      borderRadius: 20,
      background: "#1C2240",
      padding: 14,
      boxSizing: "border-box",
      boxShadow: outline > 0 ? `0 0 0 ${2.5 * outline}px ${C.lime}, ${limeShadow(0.5 * outline, 24)}` : undefined,
      fontFamily: UI,
      color: C.white,
    }}
  >
    <div style={{ display: "flex", gap: 14 }}>
      <TradingCard art="trade" width={120} loader={false} foil={0} />
      <div style={{ paddingTop: 6 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 21, lineHeight: 1.15 }}>Vintage dunk card</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <Avatar who={avatar("maya")} size={34} ring />
          <span style={{ fontSize: 15, fontWeight: 600, color: C.grey }}>@maya.collects</span>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
      <div style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.35)", fontWeight: 700, fontSize: 16 }}>Message</div>
      <div style={{ flex: 1.3, textAlign: "center", padding: "12px 0", borderRadius: 999, background: C.lime, color: C.navy, fontWeight: 700, fontSize: 16 }}>Propose swap</div>
    </div>
  </div>
);

/** 10 "Found a card": feed whips to the vintage dunk listing; hologram lifts out. */
export const S10_FoundCard: React.FC = () => {
  const frame = useCurrentFrame();
  const whip = lerpF(frame, [0, 6], [50, 0]);
  const whipX = ease(frame, [0, 6], [500, 0]);
  const sp = spring({ frame: frame - 2, fps: 30, config: { damping: 15, stiffness: 70, mass: 0.9 } });
  const scroll = -SCROLL_END * Math.min(sp, 1.04);
  const vel = Math.abs(spring({ frame: frame - 1, fps: 30, config: { damping: 15, stiffness: 70, mass: 0.9 } }) - sp) * SCROLL_END;
  const outline = ease(frame, [32, 38], [0, 1]);
  const tap = lerpF(frame, [44, 56], [0, 1]);
  const holo = ease(frame, [50, 72], [0, 1]);
  const push = cam(frame, [0, 50], [1, 1.06]);
  const truck = cam(frame, [50, 72], [0, 80]);
  const phoneX = 720;

  return (
    <AbsoluteFill>
      <DirectionalBlur amount={whip}>
        <AbsoluteFill style={{ transform: `translateX(${whipX - truck}px) scale(${push})` }}>
          <div style={{ position: "absolute", left: 1450, top: 640, filter: "blur(10px)", opacity: 0.35, transform: "rotate(-10deg)" }}>
            <TradingCard art="extra-5" width={160} />
          </div>
          <div style={{ position: "absolute", left: 140, top: 130, filter: "blur(10px)", opacity: 0.3, transform: "rotate(12deg)" }}>
            <TradingCard art="extra-7" width={140} />
          </div>
          <div style={{ position: "absolute", left: phoneX, top: 540, transform: "translate(-50%, -50%) perspective(1600px) rotateY(8deg)" }}>
            <PhoneMockup>
              <div style={{ position: "absolute", inset: 0, background: "#0E1329", fontFamily: UI, color: C.white }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: scroll, padding: "0 18px" }}>
                  <svg width={0} height={0} style={{ position: "absolute" }}>
                    <filter id="feedblur">
                      <feGaussianBlur stdDeviation={`0 ${Math.min(vel * 0.25, 22)}`} />
                    </filter>
                  </svg>
                  <div style={{ filter: vel > 2 ? "url(#feedblur)" : undefined }}>
                    <div style={{ height: FEED_TOP, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14, paddingBottom: 18 }}>
                      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 32 }}>Explore</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 999, background: "rgba(255,255,255,0.07)", fontSize: 16, color: C.grey }}>
                        <Search size={18} /> Search cards, sets, collectors
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                      {Array.from({ length: 11 }).map((_, i) => (i === FEATURED ? <Featured key={i} outline={outline} /> : <Listing key={i} i={i} />))}
                    </div>
                  </div>
                </div>
                <TapRipple x={262} y={470 + FEATURED_H / 2 - 40} progress={tap} size={110} />
              </div>
            </PhoneMockup>
          </div>
          {/* hologram copy of the trade card */}
          {holo > 0 && (
            <div
              style={{
                position: "absolute",
                left: phoneX - 60 + (HOLO_END.x - phoneX + 60) * holo,
                top: 430 + (HOLO_END.y - 430) * holo,
                transform: `translate(-50%, -50%) perspective(1600px) rotateY(${-20 + 20 * holo}deg) scale(${0.5 + 0.5 * holo})`,
                opacity: Math.min(1, holo * 3) * 0.92,
                filter: "drop-shadow(0 0 30px rgba(96,238,121,0.7)) saturate(0.7) brightness(1.15)",
              }}
            >
              <TradingCard art="trade" width={240} glow={1} foil={0} />
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(96,238,121,0.16) 0 2px, transparent 2px 6px)", mixBlendMode: "screen", borderRadius: 12 }} />
            </div>
          )}
        </AbsoluteFill>
      </DirectionalBlur>
    </AbsoluteFill>
  );
};
