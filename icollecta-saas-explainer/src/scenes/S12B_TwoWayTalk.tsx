import { noise2D } from "@remotion/noise";
import { Mic, Radio } from "lucide-react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { avatar, crowd } from "../assets";
import { Avatar } from "../components/Data";
import { PhoneMockup, PHONE_H, PHONE_W } from "../components/Devices";
import { TradingCard } from "../components/TradingCard";
import { Chip } from "../components/UI";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { C, limeShadow } from "../theme";

const SCALE = 1.05;

/** 12B "Connect with collectors": push-to-talk, waveform, the network grows. */
export const S12B_TwoWayTalk: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arcY = cam(frame, [0, 69], [-6, 6]);
  const chip = pop(frame, fps, 4);
  const pressed = frame >= 8 && frame < 40;
  const talking = (frame >= 10 && frame < 40) || (frame >= 46 && frame < 60);
  const bubble = pop(frame, fps, 42);
  const rings = [10, 18, 26, 34].map((s) => lerpF(frame, [s, s + 22], [0, 1]));

  const net = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + 0.3;
    return { x: 960 + Math.cos(a) * 600, y: 540 + Math.sin(a) * 380, at: 36 + i * 3, who: crowd(i) };
  });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 96, top: 70, transform: `scale(${chip})`, transformOrigin: "0 50%" }}>
        <Chip label="2-Way Talk" icon={Radio} variant="lime" size={26} />
      </div>
      {/* sound rings */}
      {rings.map((r, i) =>
        r > 0 && r < 1 ? (
          <div key={i} style={{ position: "absolute", left: 960 - 300, top: 540 - 300, width: 600, height: 600, borderRadius: "50%", border: `3px solid ${C.lime}`, transform: `scale(${0.6 + r * 1.2})`, opacity: (1 - r) * 0.7, boxShadow: limeShadow(0.4, 20) }} />
        ) : null,
      )}
      {/* network lines + avatars */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {net.map((n, i) => {
          const p = ease(frame, [n.at + 2, n.at + 12], [0, 1]);
          if (p <= 0) return null;
          const len = Math.hypot(n.x - 960, n.y - 540);
          return <line key={i} x1={n.x} y1={n.y} x2={960} y2={540} stroke={C.lime} strokeWidth={2} strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={0.6} />;
        })}
      </svg>
      {net.map((n, i) => {
        const s = pop(frame, fps, n.at);
        return s > 0.01 ? (
          <div key={i} style={{ position: "absolute", left: n.x - 40, top: n.y - 40, transform: `scale(${s})` }}>
            <Avatar who={n.who} size={80} ring={i % 3 === 0} />
          </div>
        ) : null;
      })}
      <div style={{ position: "absolute", left: 1460, top: 780, filter: "blur(10px)", opacity: 0.3, transform: "rotate(14deg)" }}>
        <TradingCard art="extra-2" width={150} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%, -50%) perspective(1600px) rotateY(${arcY}deg)` }}>
        <PhoneMockup scale={SCALE}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 70% at 50% 100%, #1B3A2E 0%, #0E1329 60%)", fontFamily: UI, color: C.white }}>
            <div style={{ position: "absolute", top: 72, left: 0, right: 0, textAlign: "center" }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 28 }}>2-Way Talk</div>
              <div style={{ fontSize: 17, color: C.grey, marginTop: 4 }}>Channel 2471</div>
            </div>
            <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
              <Avatar who={avatar("you")} size={84} ring />
              <div style={{ width: 110, height: 3, background: C.lime, boxShadow: limeShadow(0.8, 10) }} />
              <Avatar who={avatar("maya")} size={84} ring />
            </div>
            <div style={{ position: "absolute", top: 330, left: 34, right: 34, height: 160, display: "flex", alignItems: "center", gap: 5 }}>
              {Array.from({ length: 24 }).map((_, i) => {
                const n = talking ? (noise2D(`wave${i}`, frame * 0.25, i * 0.3) + 1) / 2 : 0.05;
                const env = Math.sin(((i + 0.5) / 24) * Math.PI);
                const h = 8 + n * env * 140;
                return <div key={i} style={{ flex: 1, height: h, borderRadius: 6, background: talking ? C.lime : "rgba(255,255,255,0.18)", boxShadow: talking ? limeShadow(0.4, 8) : undefined }} />;
              })}
            </div>
            <div style={{ position: "absolute", left: PHONE_W / 2 - 90, top: PHONE_H - 290, width: 180, height: 180, borderRadius: 99, background: `radial-gradient(circle at 50% 35%, #8BF7A0, ${C.lime})`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pressed ? 0.94 : 1})`, boxShadow: `0 0 ${pressed ? 70 : 30}px rgba(96,238,121,${pressed ? 0.8 : 0.45}), inset 0 2px 0 rgba(255,255,255,0.5)` }}>
              <Mic size={70} color={C.navy} strokeWidth={2.4} />
            </div>
            {pressed && (
              <div style={{ position: "absolute", left: PHONE_W / 2 - 90, top: PHONE_H - 290, width: 180, height: 180, borderRadius: 99, border: `4px solid ${C.lime}`, transform: `scale(${1 + ((frame - 8) % 12) / 12 * 0.5})`, opacity: 1 - ((frame - 8) % 12) / 12 }} />
            )}
            <div style={{ position: "absolute", left: 0, right: 0, top: PHONE_H - 90, textAlign: "center", fontSize: 17, fontWeight: 600, color: pressed ? C.lime : C.grey }}>{pressed ? "Talking…" : "Hold to talk"}</div>
          </div>
        </PhoneMockup>
      </div>
      {/* chat bubble from Maya */}
      {bubble > 0.01 && (
        <div style={{ position: "absolute", left: 1210, top: 250, transform: `scale(${bubble})`, transformOrigin: "0 100%", display: "flex", alignItems: "flex-end", gap: 12 }}>
          <Avatar who={avatar("maya")} size={52} ring />
          <div style={{ background: C.white, color: C.navy, fontFamily: UI, fontWeight: 600, fontSize: 26, padding: "16px 22px", borderRadius: "22px 22px 22px 6px", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>Want to trade for your rookie?</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
