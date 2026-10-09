import { Composition } from "remotion";
import { SetupCheck } from "./SetupCheck";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SetupCheck"
        component={SetupCheck}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
