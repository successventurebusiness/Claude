import { AbsoluteFill, Sequence } from "remotion";
import { SCENE_COMPONENTS } from "./scenes";
import { GlobalBackground, GlobalOverlay } from "./Shell";
import { SCENES } from "./timeline";

export const Main: React.FC = () => (
  <AbsoluteFill>
    <GlobalBackground />
    {SCENES.map((s) => {
      const Scene = SCENE_COMPONENTS[s.id];
      return Scene ? (
        <Sequence key={s.id} from={s.start} durationInFrames={s.duration} name={s.id}>
          <Scene />
        </Sequence>
      ) : null;
    })}
    <GlobalOverlay />
  </AbsoluteFill>
);
