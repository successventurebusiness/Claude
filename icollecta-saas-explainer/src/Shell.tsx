import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background, FilmGrain, Vignette } from "./components/FX";
import { ACT_GLOW } from "./timeline";

export const actGlow = (globalFrame: number) =>
  interpolate(
    globalFrame,
    ACT_GLOW.map((k) => k[0]),
    ACT_GLOW.map((k) => k[1]),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

/** Background below everything, driven by the GLOBAL frame. */
export const GlobalBackground: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const g = useCurrentFrame() + offset;
  return <Background glow={actGlow(g)} frame={g} />;
};

/** Film grain + vignette above everything. */
export const GlobalOverlay: React.FC = () => (
  <>
    <Vignette strength={0.35} />
    <FilmGrain opacity={0.035} />
  </>
);

/** Wraps a single scene for its own preview composition. */
export const SceneShell: React.FC<{ start: number; children: React.ReactNode }> = ({ start, children }) => (
  <AbsoluteFill>
    <GlobalBackground offset={start} />
    {children}
    <GlobalOverlay />
  </AbsoluteFill>
);
