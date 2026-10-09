import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { SCENE_COMPONENTS } from "./scenes";
import { resolveCues } from "./sfx/cues";
import { GlobalBackground, GlobalOverlay } from "./Shell";
import { SCENES } from "./timeline";

const CUES = resolveCues();

/** SFX track: one <Audio> per cue, placed on its global frame. */
export const SfxTrack: React.FC = () => (
  <>
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.frame} durationInFrames={90} name={`sfx ${c.sound}`} layout="none">
        <Audio src={staticFile(`sfx/${c.file}`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);

/** Full film: Background below, scenes on hard cuts at their timeline frames, grain + vignette above. */
export const Main: React.FC = () => (
  <AbsoluteFill>
    <GlobalBackground />
    {SCENES.map((s) => {
      const Scene = SCENE_COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={s.start} durationInFrames={s.duration} name={s.id}>
          <Scene />
        </Sequence>
      );
    })}
    <GlobalOverlay />
    <SfxTrack />
  </AbsoluteFill>
);
