import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst } from "../components/FX";
import { Logo } from "../components/Logo";
import { cam, lerpF } from "../lib/anim";
import { C, SPRING_POP } from "../theme";

export const LOGO_W = 520;
export const RING_R = 280;

/** The ring around the logo (shared with S02B's match cut). */
export const LogoRing: React.FC<{ r: number; stroke: number; style?: React.CSSProperties }> = ({ r, stroke, style }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
    <circle cx={960} cy={540} r={Math.max(r, 0)} fill="none" stroke={C.lime} strokeWidth={stroke} style={{ filter: "drop-shadow(0 0 14px rgba(96,238,121,0.75))" }} />
  </svg>
);

/** 2A "Meet iCollecta": flash clears from the centre, ring springs out, logo builds. */
export const S02A_Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringR = spring({ frame, fps, config: SPRING_POP, durationInFrames: 14 }) * RING_R;
  const stroke = lerpF(frame, [36, 39, 42], [3, 6, 3]);
  const hole = lerpF(frame, [0, 8], [0, 1500]);
  const flashO = lerpF(frame, [0, 8], [0.9, 0]);
  const push = cam(frame, [0, 48], [1, 1.04]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <LogoRing r={ringR} stroke={stroke} />
        <Burst x={960} y={540} count={28} seed="s02a" progress={lerpF(frame, [0, 30], [0, 1])} distance={520} size={7} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Logo frame={frame} fps={fps} width={LOGO_W} />
        </AbsoluteFill>
      </AbsoluteFill>
      {flashO > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(233,255,238,0) ${hole}px, rgba(233,255,238,${flashO}) ${hole + 260}px)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
