import { C } from "../theme";

export const PHONE_W = 390;
export const PHONE_H = 844;
const BEZEL = 12;

/**
 * Modern phone with thin bezels. Children are laid out on a 390x844 logical
 * screen; `scale` scales the whole device.
 */
export const PhoneMockup: React.FC<{
  scale?: number;
  children?: React.ReactNode;
  screenStyle?: React.CSSProperties;
  glow?: number;
}> = ({ scale = 1, children, screenStyle, glow = 0 }) => (
  <div
    style={{
      width: (PHONE_W + BEZEL * 2) * scale,
      height: (PHONE_H + BEZEL * 2) * scale,
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: PHONE_W + BEZEL * 2,
        height: PHONE_H + BEZEL * 2,
        transform: `scale(${scale})`,
        transformOrigin: "0 0",
        borderRadius: 64,
        background: "linear-gradient(145deg, #3B4366 0%, #1A1F38 40%, #2A3152 100%)",
        boxShadow: `0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 1.5px rgba(255,255,255,0.18), 0 0 ${glow * 60}px rgba(96,238,121,${glow * 0.5})`,
      }}
    >
      {/* side buttons */}
      <div style={{ position: "absolute", left: -3, top: 180, width: 4, height: 70, borderRadius: 4, background: "#2A3152" }} />
      <div style={{ position: "absolute", right: -3, top: 230, width: 4, height: 110, borderRadius: 4, background: "#2A3152" }} />
      <div
        style={{
          position: "absolute",
          left: BEZEL,
          top: BEZEL,
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 52,
          overflow: "hidden",
          background: "#0E1329",
          ...screenStyle,
        }}
      >
        {children}
        {/* dynamic island */}
        <div
          style={{
            position: "absolute",
            left: PHONE_W / 2 - 58,
            top: 12,
            width: 116,
            height: 34,
            borderRadius: 20,
            background: "#05070F",
            zIndex: 20,
          }}
        />
        {/* glass reflection */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%)",
            pointerEvents: "none",
            zIndex: 21,
          }}
        />
      </div>
    </div>
  </div>
);

export const LAPTOP_W = 1440;
export const LAPTOP_H = 900;

/** Slim space-grey laptop, 1440x900 logical screen. */
export const LaptopMockup: React.FC<{
  scale?: number;
  children?: React.ReactNode;
}> = ({ scale = 1, children }) => {
  const lidPad = 22;
  const lidW = LAPTOP_W + lidPad * 2;
  const lidH = LAPTOP_H + lidPad * 2;
  const baseW = lidW * 1.14;
  return (
    <div style={{ width: baseW * scale, height: (lidH + 34) * scale, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: baseW,
          height: lidH + 34,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: (baseW - lidW) / 2,
            top: 0,
            width: lidW,
            height: lidH,
            borderRadius: 30,
            background: "linear-gradient(160deg, #4A5170, #23283F)",
            boxShadow: "0 50px 120px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: lidPad,
              top: lidPad,
              width: LAPTOP_W,
              height: LAPTOP_H,
              borderRadius: 10,
              overflow: "hidden",
              background: C.navy,
            }}
          >
            {children}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 35%)",
                pointerEvents: "none",
              }}
            />
          </div>
          <div style={{ position: "absolute", left: lidW / 2 - 5, top: 8, width: 10, height: 10, borderRadius: 9, background: "#0B0E1C" }} />
        </div>
        {/* base */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: lidH - 2,
            width: baseW,
            height: 30,
            borderRadius: "4px 4px 26px 26px",
            background: "linear-gradient(180deg, #8C93AE 0%, #575E7C 35%, #2C3150 100%)",
            boxShadow: "0 30px 50px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: baseW / 2 - 120,
              top: 0,
              width: 240,
              height: 10,
              borderRadius: "0 0 12px 12px",
              background: "#3A405E",
            }}
          />
        </div>
      </div>
    </div>
  );
};
