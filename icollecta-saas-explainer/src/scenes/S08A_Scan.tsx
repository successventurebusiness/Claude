import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { PhoneMockup } from "../components/Devices";
import { TradingCard } from "../components/TradingCard";
import { cam, ease, lerpF, pop } from "../lib/anim";
import { EASE_CAMERA } from "../theme";
import { PHONE_SCALE, Viewfinder } from "./phoneScan";

/** 8A "Scan the card": scan line sweeps the card in the viewfinder, shutter flash. */
export const S08A_Scan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = cam(frame, [0, 39], [1, 1.05]);
  const rotZ = ease(frame, [0, 20], [3, 0]);
  const scan = ease(frame, [2, 30], [0, 1], EASE_CAMERA);
  const flash = lerpF(frame, [30, 31, 33], [0, 0.8, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 1450, top: 160, filter: "blur(10px)", opacity: 0.35, transform: "rotate(10deg)" }}>
        <TradingCard art="extra-8" width={170} />
      </div>
      <div style={{ position: "absolute", left: 230, top: 640, filter: "blur(10px)", opacity: 0.3, transform: "rotate(-12deg)" }}>
        <TradingCard art="extra-3" width={150} variant="slab" />
      </div>
      <div style={{ transform: `scale(${push}) rotate(${rotZ}deg)` }}>
        <PhoneMockup scale={PHONE_SCALE}>
          <Viewfinder scan={scan} frontTick={pop(frame, fps, 28)} grid={1} />
          <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flash, zIndex: 30 }} />
        </PhoneMockup>
      </div>
    </AbsoluteFill>
  );
};
