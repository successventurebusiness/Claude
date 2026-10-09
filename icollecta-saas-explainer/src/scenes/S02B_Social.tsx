import { Heart, MessageCircle } from "lucide-react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { avatar, crowd, EXTRA } from "../assets";
import { Avatar } from "../components/Data";
import { LaptopMockup, PhoneMockup } from "../components/Devices";
import { DirectionalBlur, LightSweep } from "../components/FX";
import { KineticText } from "../components/KineticText";
import { Logo } from "../components/Logo";
import { CardArt } from "../components/TradingCard";
import { cardArt } from "../assets";
import { HEAD, UI } from "../fonts";
import { cam, ease, lerpF, panel, pop } from "../lib/anim";
import { C, limeShadow } from "../theme";
import { LOGO_W, RING_R } from "./S02A_Logo";

const LAPTOP_SCALE = 0.5;
const PHONE_SCALE = 0.62;
const ORBIT = { cx: 960, cy: 600, rx: 860, tilt: 75 };

const LaptopScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const scroll = lerpF(frame, [0, 69], [0, -40]);
  return (
    <div style={{ width: 1440, height: 900, background: C.navy, fontFamily: UI, color: C.white, position: "relative", overflow: "hidden" }}>
      <div style={{ height: 34, background: "#0A0E22", display: "flex", alignItems: "center", gap: 60, paddingLeft: 40 - ((frame * 3) % 300), fontSize: 15, color: C.grey, whiteSpace: "nowrap" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>
            Rookie holo <span style={{ color: C.lime }}>▲ {(2 + (i * 7) % 9).toFixed(1)}%</span>
          </span>
        ))}
      </div>
      <div style={{ transform: `translateY(${scroll}px)` }}>
        <div style={{ textAlign: "center", padding: "18px 0 10px", fontSize: 16, fontWeight: 700, letterSpacing: 6, color: C.lime }}>ONE PLATFORM, EVERY COLLECTOR.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 42, padding: "14px 60px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Logo frame={0} fps={30} width={190} built />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 20, fontWeight: 600 }}>SlabVision</span>
          <span style={{ fontSize: 20, fontWeight: 600 }}>Marketplace</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.navy, background: C.lime, padding: "10px 26px", borderRadius: 999 }}>Sign up</span>
        </div>
        <div
          style={{
            margin: "26px 60px",
            height: 280,
            borderRadius: 22,
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 60px, rgba(0,0,0,0) 60px 120px), radial-gradient(120% 140% at 50% 120%, #1F6B3E 0%, #0F3A24 45%, #0A1B1A 100%)",
            display: "flex",
            alignItems: "center",
            padding: "0 70px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {[200, 700, 1200].map((x) => (
            <div key={x} style={{ position: "absolute", left: x, top: -80, width: 200, height: 200, borderRadius: 999, background: "radial-gradient(closest-side, rgba(255,255,255,0.35), rgba(255,255,255,0))" }} />
          ))}
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 84, letterSpacing: -2 }}>Collect Smarter.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26, padding: "0 60px" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: C.panel, borderRadius: 18, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ height: 230, borderRadius: 12, overflow: "hidden" }}>
                <CardArt art={cardArt(EXTRA(i))} />
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
                <div style={{ width: 120, height: 10, borderRadius: 6, background: "rgba(255,255,255,0.3)" }} />
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy, background: C.lime, padding: "6px 16px", borderRadius: 999 }}>View</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PhoneScreen: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ width: 390, height: 844, background: "#0E1329", fontFamily: UI, color: C.white, padding: "70px 22px 0", boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar who={avatar("you")} size={72} ring />
      <div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>@you</div>
        <div style={{ fontSize: 17, color: C.grey, fontWeight: 500 }}>212 cards · 48 trades</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, margin: "20px 0" }}>
      {["Posts", "Collection", "Trades"].map((t, i) => (
        <span key={t} style={{ fontSize: 15, fontWeight: 600, padding: "8px 16px", borderRadius: 999, background: i === 0 ? C.lime : "rgba(255,255,255,0.06)", color: i === 0 ? C.navy : C.white }}>
          {t}
        </span>
      ))}
    </div>
    <div style={{ transform: `translateY(${-frame * 0.8}px)` }}>
      {[3, 5, 1].map((n, i) => (
        <div key={i} style={{ background: C.panel, borderRadius: 18, padding: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar who={crowd(i)} size={30} />
            <div style={{ width: 110, height: 9, borderRadius: 6, background: "rgba(255,255,255,0.3)" }} />
          </div>
          <div style={{ height: 210, borderRadius: 12, overflow: "hidden" }}>
            <CardArt art={cardArt(EXTRA(n))} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 15, color: C.grey }}>
            <Heart size={20} color={C.lime} fill={i === 0 ? C.lime : "none"} /> {120 + i * 37}
            <MessageCircle size={20} style={{ marginLeft: 12 }} /> {14 + i * 5}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** 2B "The social marketplace": ring tilts into an orbit around laptop + phone. */
export const S02B_Social: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = ease(frame, [0, 14], [0, 1]);
  const ringTilt = intro * ORBIT.tilt;
  const ringRx = interpolate(intro, [0, 1], [RING_R, ORBIT.rx]);
  const ringCy = interpolate(intro, [0, 1], [540, ORBIT.cy]);
  const laptopIn = panel(frame, fps, 4);
  const phoneIn = panel(frame, fps, 8);
  const orbitY = cam(frame, [0, 69], [-8, 8]);
  const sweep = lerpF(frame, [60, 69], [0, 1]);
  const ry = ringRx * Math.cos((ringTilt * Math.PI) / 180);

  // avatars on the ellipse
  const avatars = Array.from({ length: 8 }, (_, i) => {
    const a = ((i * 45 + frame * 0.6 + 20) * Math.PI) / 180;
    const x = 960 + Math.cos(a) * ringRx;
    const y = ringCy + Math.sin(a) * ry;
    const depth = Math.sin(a); // > 0 = in front
    return { i, x, y, depth, who: i === 2 ? avatar("maya") : crowd(i) };
  });
  const appear = lerpF(frame, [6, 16], [0, 1]);

  const laptopPos = { x: 790, y: 470 + (1 - laptopIn) * 700 };
  const phonePos = { x: 1340, y: 600 + (1 - phoneIn) * 800 };
  const targets = [
    [laptopPos.x - 150, laptopPos.y - 80],
    [laptopPos.x + 180, laptopPos.y + 40],
    [phonePos.x - 30, phonePos.y - 120],
    [phonePos.x + 20, phonePos.y + 80],
  ];

  const avatarEl = (a: (typeof avatars)[number]) => {
    const s = 0.75 + (a.depth + 1) * 0.2;
    return (
      <div
        key={a.i}
        style={{
          position: "absolute",
          left: a.x - 36 * s,
          top: a.y - 36 * s,
          opacity: appear * (a.depth < 0 ? 0.55 : 1),
          filter: a.depth < 0 ? "blur(2px) brightness(0.7)" : undefined,
          transform: `scale(${appear})`,
        }}
      >
        <Avatar who={a.who} size={72 * s} ring={a.depth > 0.3} />
      </div>
    );
  };

  const heart = pop(frame, fps, 30);
  const bubble = pop(frame, fps, 42);
  const heartA = avatars[1];
  const bubbleA = avatars[4];

  return (
    <AbsoluteFill>
      <DirectionalBlur amount={sweep > 0 ? Math.sin(sweep * Math.PI) * 24 : 0} style={{ transform: `scale(${1.04 - intro * 0.04})` }}>
        <AbsoluteFill style={{ perspective: 1600 }}>
          <AbsoluteFill style={{ transform: `rotateX(${-6 * intro}deg) rotateY(${orbitY * intro}deg)` }}>
            {/* back half of the orbit */}
            <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
              <ellipse cx={960} cy={ringCy} rx={ringRx} ry={Math.max(ry, 0.5)} fill="none" stroke={C.lime} strokeWidth={3} opacity={0.9} style={{ filter: "drop-shadow(0 0 12px rgba(96,238,121,0.7))" }} />
            </svg>
            {avatars.filter((a) => a.depth < 0).map(avatarEl)}
            <div style={{ position: "absolute", left: laptopPos.x, top: laptopPos.y, transform: "translate(-50%, -50%) perspective(1600px) rotateY(18deg) rotateX(6deg)" }}>
              <LaptopMockup scale={LAPTOP_SCALE}>
                <LaptopScreen frame={frame} />
              </LaptopMockup>
            </div>
            <div style={{ position: "absolute", left: phonePos.x, top: phonePos.y, transform: "translate(-50%, -50%) perspective(1600px) rotateY(-14deg)" }}>
              <PhoneMockup scale={PHONE_SCALE}>
                <PhoneScreen frame={frame} />
              </PhoneMockup>
            </div>
            {/* front arc of the ring drawn over the devices */}
            <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
              <defs>
                <clipPath id="front-half">
                  <rect x={0} y={ringCy} width={1920} height={1080} />
                </clipPath>
              </defs>
              <ellipse cx={960} cy={ringCy} rx={ringRx} ry={Math.max(ry, 0.5)} fill="none" stroke={C.lime} strokeWidth={3} clipPath="url(#front-half)" style={{ filter: "drop-shadow(0 0 12px rgba(96,238,121,0.7))" }} />
              {avatars.slice(0, 4).map((a, k) => {
                const p = ease(frame, [20 + k * 4, 36 + k * 4], [0, 1]);
                if (p <= 0) return null;
                const [tx, ty] = targets[k];
                const len = Math.hypot(tx - a.x, ty - a.y);
                const dot = ((frame - 20 - k * 4) % 16) / 16;
                return (
                  <g key={k}>
                    <line x1={a.x} y1={a.y} x2={tx} y2={ty} stroke={C.lime} strokeWidth={2} strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={0.75} />
                    {p >= 1 && <circle cx={a.x + (tx - a.x) * dot} cy={a.y + (ty - a.y) * dot} r={5} fill={C.lime} style={{ filter: "drop-shadow(0 0 6px #60EE79)" }} />}
                  </g>
                );
              })}
            </svg>
            <div style={{ position: "absolute", inset: 0 }}>{avatars.filter((a) => a.depth >= 0).map(avatarEl)}</div>
          </AbsoluteFill>
        </AbsoluteFill>
        {/* heart + speech bubble */}
        {heart > 0.01 && (
          <div style={{ position: "absolute", left: heartA.x - 26, top: heartA.y - 110 - lerpF(frame, [30, 60], [0, 50]), transform: `scale(${heart})`, opacity: lerpF(frame, [50, 62], [1, 0]) }}>
            <div style={{ width: 52, height: 52, borderRadius: 99, background: C.lime, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: limeShadow(0.6, 20) }}>
              <Heart size={28} color={C.navy} fill={C.navy} />
            </div>
          </div>
        )}
        {bubble > 0.01 && (
          <div style={{ position: "absolute", left: bubbleA.x - 30, top: bubbleA.y - 112 - lerpF(frame, [42, 69], [0, 36]), transform: `scale(${bubble})`, transformOrigin: "0 100%" }}>
            <div style={{ background: C.white, color: C.navy, fontFamily: UI, fontWeight: 600, fontSize: 22, padding: "12px 18px", borderRadius: "20px 20px 20px 4px", display: "flex", gap: 8, alignItems: "center" }}>
              <MessageCircle size={22} /> Nice pull!
            </div>
          </div>
        )}
        {/* logo leaves */}
        {intro < 1 && (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ transform: `translateY(${-intro * 640}px) scale(${1 - intro * 0.65})`, opacity: 1 - intro * 0.4 }}>
              <Logo frame={0} fps={fps} width={LOGO_W} built />
            </div>
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: 930 }}>
          <KineticText text="The social marketplace for collectors" frame={frame} start={14} size={48} lime={["collectors"]} />
        </div>
      </DirectionalBlur>
      <LightSweep progress={sweep} />
    </AbsoluteFill>
  );
};
