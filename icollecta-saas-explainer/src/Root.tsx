import "./fonts";
import { Composition, Folder } from "remotion";
import { Kit } from "./Kit";
import { Probe } from "./Probe";
import { Main } from "./Main";
import { SCENE_COMPONENTS } from "./scenes";
import { SceneShell } from "./Shell";
import { FPS, SCENES, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ICollectaExplainer" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Probe" component={Probe} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="Kit" component={Kit} durationInFrames={60} fps={FPS} width={1920} height={1080} />
    <Folder name="Scenes">
      {SCENES.map((s) => {
        const Scene = SCENE_COMPONENTS[s.id];
        if (!Scene) return null;
        const Wrapped: React.FC = () => (
          <SceneShell start={s.start}>
            <Scene />
          </SceneShell>
        );
        return <Composition key={s.id} id={s.id.replace("_", "-")} component={Wrapped} durationInFrames={s.duration} fps={FPS} width={1920} height={1080} />;
      })}
    </Folder>
  </>
);
