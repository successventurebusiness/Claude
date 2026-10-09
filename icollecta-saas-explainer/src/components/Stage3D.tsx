import { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";

export type Camera = {
  x?: number;
  y?: number;
  z?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  scale?: number;
};

const CameraContext = createContext<Required<Camera>>({
  x: 0,
  y: 0,
  z: 0,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  scale: 1,
});

/**
 * 2.5D stage with perspective 1600px. The camera moves the world: +x trucks
 * right, +z pushes in, rot* orbits, scale zooms.
 */
export const Stage3D: React.FC<{
  camera?: Camera;
  perspective?: number;
  origin?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ camera = {}, perspective = 1600, origin = "50% 50%", children, style }) => {
  const c = { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1, ...camera };
  return (
    <CameraContext.Provider value={c}>
      <AbsoluteFill style={{ perspective, perspectiveOrigin: origin, ...style }}>
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${c.scale}) translateZ(${c.z}px) rotateX(${c.rotX}deg) rotateY(${c.rotY}deg) rotateZ(${c.rotZ}deg) translate3d(${-c.x}px, ${-c.y}px, 0)`,
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    </CameraContext.Provider>
  );
};

const DEPTH = {
  far: { factor: 0.5, blur: 10, z: -400 },
  mid: { factor: 1, blur: 0, z: 0 },
  near: { factor: 1.4, blur: 4, z: 260 },
} as const;

/**
 * Depth layer inside Stage3D: far layers move at 0.5x the camera truck and are
 * blurred 8-12px, near layers move at 1.4x with 4px blur.
 */
export const DepthLayer: React.FC<{
  depth: keyof typeof DEPTH;
  blur?: number;
  z?: number;
  children: React.ReactNode;
}> = ({ depth, blur, z, children }) => {
  const cam = useContext(CameraContext);
  const d = DEPTH[depth];
  const dx = cam.x * (1 - d.factor);
  const dy = cam.y * (1 - d.factor);
  const b = blur ?? d.blur;
  return (
    <AbsoluteFill
      style={{
        transformStyle: "preserve-3d",
        transform: `translate3d(${dx}px, ${dy}px, ${z ?? d.z}px)`,
        filter: b > 0 ? `blur(${b}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Absolutely positions children centred on (x, y) with optional 3D transform. */
export const At: React.FC<{
  x: number;
  y: number;
  z?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  scale?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x, y, z = 0, rotX = 0, rotY = 0, rotZ = 0, scale = 1, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 0,
      height: 0,
      transformStyle: "preserve-3d",
      transform: `translate3d(0,0,${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
      ...style,
    }}
  >
    <div style={{ position: "absolute", transform: "translate(-50%, -50%)", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  </div>
);
