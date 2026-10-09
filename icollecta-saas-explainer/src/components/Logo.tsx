import { useId } from "react";
import { spring } from "remotion";
import { HEAD } from "../fonts";
import { ease, lerpF } from "../lib/anim";
import { LOGO } from "../generated/logoPaths";
import { C, SPRING_POP } from "../theme";

// Glyph x-ranges measured from public/brand/logo.svg (viewBox 2366 x 631).
const B = [389, 521, 771, 1020, 1237, 1450, 1664, 1904, 2114, 2366];
const ICON: [number, number] = [0, B[0]];
const LETTERS: [number, number][] = B.slice(0, -1).map((a, i) => [a, B[i + 1]]);

/**
 * The iCollecta logo with its build: icon jumps in, wordmark letters reveal
 * with a mask slide-up (2f stagger), final letter glows lime.
 * `speed` > 1 compresses the timing (S15 uses a quicker build).
 */
export const Logo: React.FC<{
  frame: number;
  fps: number;
  width: number;
  start?: number;
  speed?: number;
  built?: boolean;
}> = ({ frame, fps, width, start = 0, speed = 1, built = false }) => {
  const id = useId().replace(/:/g, "");
  const f = built ? 1000 : (frame - start) * speed;
  const iconP = spring({ frame: f - 6, fps, config: SPRING_POP });
  const glow = lerpF(f, [26, 29, 32], [0, 1, 0.55]);

  if (!LOGO.exists) {
    // Placeholder: lime circle icon + "iCollecta" in Montserrat 800, final "a" lime. TODO: client logo.
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: width * 0.04,
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: width * 0.16,
          color: C.white,
        }}
      >
        <div
          style={{
            width: width * 0.16,
            height: width * 0.16,
            borderRadius: 99,
            background: C.lime,
            transform: `scale(${iconP})`,
          }}
        />
        <span>
          iCollect<span style={{ color: C.lime }}>a</span>
        </span>
      </div>
    );
  }

  const h = (width * LOGO.height) / LOGO.width;
  const paths = (
    <>
      <path d={LOGO.white} fill={C.white} fillRule="evenodd" />
      <path d={LOGO.green} fill={C.lime} fillRule="evenodd" />
    </>
  );
  const [ax, bx] = LETTERS[8];
  return (
    <div style={{ position: "relative", width, height: h }}>
      {/* final-letter glow: CSS drop-shadow on a small overlay (an SVG blur filter here glitches in Chromium) */}
      {glow > 0.01 && (
        <svg
          width={width}
          height={h}
          viewBox={`0 0 ${LOGO.width} ${LOGO.height}`}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "visible",
            opacity: glow,
            filter: `drop-shadow(0 0 ${width * 0.025}px #60EE79) drop-shadow(0 0 ${width * 0.06}px rgba(96,238,121,0.7))`,
          }}
        >
          <clipPath id={`ga${id}`}>
            <rect x={ax} y={-10} width={bx - ax} height={LOGO.height + 20} />
          </clipPath>
          <path
            d={LOGO.green}
            fill={C.lime}
            fillRule="evenodd"
            clipPath={`url(#ga${id})`}
          />
        </svg>
      )}
      <svg
        width={width}
        height={h}
        viewBox={`0 0 ${LOGO.width} ${LOGO.height}`}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <defs>
          <clipPath id={`ic${id}`}>
            <rect
              x={ICON[0]}
              y={-200}
              width={ICON[1] - ICON[0]}
              height={LOGO.height + 400}
            />
          </clipPath>
          {LETTERS.map(([a, b], i) => (
            <clipPath key={i} id={`lt${id}${i}`}>
              <rect x={a} y={-10} width={b - a} height={LOGO.height + 20} />
            </clipPath>
          ))}
        </defs>
        <g clipPath={`url(#ic${id})`}>
          <g
            style={{
              transformOrigin: "190px 600px",
              transformBox: "view-box",
              transform: `translateY(${((1 - iconP) * 60 * LOGO.width) / width}px) rotate(${(1 - iconP) * -12}deg) scale(${0.8 + iconP * 0.2})`,
              opacity: Math.min(1, iconP * 2),
            }}
          >
            {paths}
          </g>
        </g>
        {LETTERS.map((_, i) => {
          const t = ease(f, [10 + i * 2, 10 + i * 2 + 8], [0, 1]);
          return (
            <g key={i} clipPath={`url(#lt${id}${i})`}>
              <g transform={`translate(0 ${(1 - t) * LOGO.height})`}>{paths}</g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
