import { AbsoluteFill, useCurrentFrame } from "remotion";
import { At, Stage3D } from "../components/Stage3D";
import { lerpF } from "../lib/anim";
import { ItemView } from "./ItemView";
import { DEPTH_BLUR, DEPTH_Z, SCATTER, scatterCameraZ, scatterDrift } from "./scatter";

/** 1A "Everything, scattered": 12 collectibles drifting at three depths. */
export const S01A_Scatter: React.FC = () => {
  const frame = useCurrentFrame();
  const glintO = lerpF(frame, [80, 129], [0, 0.6]);
  const glintS = lerpF(frame, [80, 129], [6, 40]);
  return (
    <AbsoluteFill>
      <Stage3D camera={{ z: scatterCameraZ(frame) }}>
        {SCATTER.map((it, i) => {
          const d = scatterDrift(it, frame, i);
          return (
            <At key={it.id} x={it.x} y={it.y + d.dy} z={DEPTH_Z[it.depth]} rotZ={d.rotZ}>
              <div
                style={{
                  filter: `saturate(0.6) brightness(0.85)${DEPTH_BLUR[it.depth] ? ` blur(${DEPTH_BLUR[it.depth]}px)` : ""}`,
                  opacity: it.depth === "far" ? 0.5 : 1,
                  transformStyle: "preserve-3d",
                }}
              >
                <ItemView it={it} rotY={d.rotY} />
              </div>
            </At>
          );
        })}
      </Stage3D>
      {/* centre glint */}
      <div
        style={{
          position: "absolute",
          left: 960 - glintS / 2,
          top: 540 - glintS / 2,
          width: glintS,
          height: glintS,
          borderRadius: "50%",
          opacity: glintO,
          background: "radial-gradient(circle, #E9FFEE 0%, rgba(96,238,121,0.9) 30%, rgba(96,238,121,0) 70%)",
          boxShadow: "0 0 40px rgba(96,238,121,0.6)",
        }}
      />
    </AbsoluteFill>
  );
};
