import { loadLocalFont } from "./fonts";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Circle } from "@remotion/shapes";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const fontFamily = loadLocalFont("Inter");

const BG = "#0B1020";
const ACCENT = "#6C5CE7";
const ACCENT_2 = "#00D1B2";

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const ring = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", opacity: 1 - ring, transform: `scale(${0.5 + ring * 2})` }}>
        <Circle radius={220} fill="none" stroke={ACCENT} strokeWidth={6} />
      </div>
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 140,
          color: "white",
          transform: `scale(${pop})`,
          letterSpacing: -4,
        }}
      >
        Toolkit <span style={{ color: ACCENT_2 }}>ready</span>
      </div>
    </AbsoluteFill>
  );
};

const BARS = [38, 62, 51, 84, 97];

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ background: BG, justifyContent: "center", alignItems: "flex-end", flexDirection: "row", gap: 40, paddingBottom: 220 }}
    >
      {BARS.map((v, i) => {
        const grow = spring({ frame: frame - i * 5, fps, config: { damping: 14 } });
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 44, color: "white", opacity: grow }}>
              {Math.round(v * grow)}%
            </div>
            <div
              style={{
                width: 120,
                height: v * 6 * grow,
                borderRadius: 18,
                background: `linear-gradient(180deg, ${ACCENT_2}, ${ACCENT})`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const SetupCheck: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={75}>
          <Title />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Chart />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Audio src={staticFile("music/bed.wav")} volume={0.35} />
      <Audio src={staticFile("vo/test.wav")} />
      <Audio src={staticFile("sfx/logo_hit.wav")} volume={0.8} />
      <Sequence from={58}>
        <Audio src={staticFile("sfx/whoosh_fast.wav")} volume={0.7} />
      </Sequence>
      {BARS.map((_, i) => (
        <Sequence key={i} from={75 + i * 5}>
          <Audio src={staticFile("sfx/pop.wav")} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
