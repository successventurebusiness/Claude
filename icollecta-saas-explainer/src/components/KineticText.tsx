import { HEAD } from "../fonts";
import { ease, exitStyle } from "../lib/anim";
import { C } from "../theme";

/**
 * Word-by-word mask reveal from below (3-4 frame stagger). Words listed in
 * `lime` are coloured lime; `limeStop` colours a trailing full stop lime.
 */
export const KineticText: React.FC<{
  text: string;
  frame: number;
  start?: number;
  stagger?: number;
  size?: number;
  font?: string;
  weight?: number;
  color?: string;
  lime?: readonly string[];
  limeStop?: boolean;
  exitAt?: number;
  align?: "center" | "left";
  letterSpacing?: number;
  style?: React.CSSProperties;
  wordStyle?: (word: string, i: number) => React.CSSProperties | undefined;
}> = ({
  text,
  frame,
  start = 0,
  stagger = 3,
  size = 72,
  font = HEAD,
  weight = 800,
  color = C.white,
  lime = [],
  limeStop = false,
  exitAt,
  align = "center",
  letterSpacing = -0.02,
  style,
  wordStyle,
}) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: `${letterSpacing}em`,
        color,
        ...(exitAt !== undefined ? exitStyle(frame, exitAt) : {}),
        ...style,
      }}
    >
      {words.map((w, i) => {
        const t = ease(frame, [start + i * stagger, start + i * stagger + 12], [0, 1]);
        const bare = w.replace(/[.,!?]$/, "");
        const punct = w.slice(bare.length);
        const isLime = lime.includes(bare);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - t) * 110}%)`,
                color: isLime ? C.lime : undefined,
                ...wordStyle?.(bare, i),
              }}
            >
              {bare}
              {punct && <span style={{ color: limeStop || isLime ? C.lime : undefined }}>{punct}</span>}
            </span>
          </span>
        );
      })}
    </div>
  );
};
