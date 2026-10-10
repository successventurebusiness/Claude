import { Bell, Menu, Sparkles, User, VolumeX } from "lucide-react";
import { HEAD, MONO } from "../fonts";
import { Logo } from "./Logo";

// The real icollecta.com header (revision 1, shot 2B): two black ticker rows
// and a navy row of outlined buttons. All ticker text is invented on purpose.

const AMBER = "#F59E0B";
const RULE = "#935F07";
const LIVE = "#FBBF24";
const UP = "#4ADE80";
const BTN_FILL = "#16244A";
const BTN_BORDER = "#1FA55A";
const NAVY = "#121833";
const GREY = "#9CA3AF";

const SCORES = [
  ["Lakeview", "0", "0", "Harbor", "1:10 PM"],
  ["Summit", "2", "1", "Rivers", "2:15 PM"],
  ["Canyon", "0", "0", "Pines", "3:10 PM"],
] as const;

const PRICES = [
  ["Vintage FB Rookie Graded 9", "$4,000", "108.3%"],
  ["Vintage Dunk Card Graded 10", "$1,200", "15.0%"],
  ["Prospect Auto Raw", "$145", "123.1%"],
] as const;

const Bar: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ display: "inline-block", width: size * 0.32, height: size * 0.85, background: "#4B5563", margin: `0 ${size * 1.1}px`, verticalAlign: "middle" }} />
);

const TickerRow: React.FC<{ kind: "scores" | "prices"; size: number; height: number; offset: number; block: number }> = ({
  kind,
  size,
  height,
  offset,
  block,
}) => {
  // content repeated so a slow scroll never shows the end of the strip
  const items: readonly (readonly string[])[] = [0, 1, 2, 3].flatMap((): readonly (readonly string[])[] => (kind === "scores" ? SCORES : PRICES));
  return (
    <div style={{ height, position: "relative", overflow: "hidden", background: "#000000", borderBottom: `2px solid ${RULE}` }}>
      <div
        style={{
          position: "absolute",
          left: block + size,
          top: 0,
          height,
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          fontFamily: MONO,
          fontSize: size,
          color: "#FFFFFF",
          transform: `translateX(${-offset}px)`,
        }}
      >
        {items.map((it, i) =>
          kind === "scores" ? (
            <span key={i}>
              <span style={{ color: LIVE, fontWeight: 700 }}>LIVE</span> {it[0]} {it[1]} <span style={{ color: GREY }}>:</span> {it[2]} {it[3]}{" "}
              <span style={{ color: GREY, fontSize: size * 0.82 }}>{it[4]}</span>
              <Bar size={size} />
            </span>
          ) : (
            <span key={i}>
              {it[0]} <span style={{ fontWeight: 700 }}>{it[1]}</span> <span style={{ color: UP }}>▲{it[2]}</span>
              <Bar size={size} />
            </span>
          ),
        )}
      </div>
      {/* amber block on the far left */}
      <div style={{ position: "absolute", left: 0, top: 0, width: block, height, background: AMBER, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {kind === "prices" && <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: 99, background: "#3B2A06" }} />}
      </div>
    </div>
  );
};

const MuteButton: React.FC<{ size: number; style: React.CSSProperties }> = ({ size, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: "#0B1222",
      border: `1.5px solid ${BTN_BORDER}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
      ...style,
    }}
  >
    <VolumeX size={size * 0.52} color="#E5E7EB" strokeWidth={2} />
  </div>
);

const OutlineButton: React.FC<{ label?: string; icon?: React.ReactNode; caps?: boolean; size: number; square?: boolean }> = ({
  label,
  icon,
  caps,
  size,
  square,
}) => (
  <div
    style={{
      height: size * 2.2,
      minWidth: square ? size * 2.2 : undefined,
      padding: square ? 0 : `0 ${size * 0.95}px`,
      boxSizing: "border-box",
      borderRadius: size * 0.5,
      background: BTN_FILL,
      border: `2px solid ${BTN_BORDER}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: size * 0.45,
      fontFamily: HEAD,
      fontWeight: caps ? 800 : 700,
      fontSize: size,
      letterSpacing: caps ? size * 0.14 : 0,
      color: "#FFFFFF",
      whiteSpace: "nowrap",
    }}
  >
    {icon}
    {label}
  </div>
);

/** Desktop header for the laptop screen (1440 px wide logical screen). */
export const SiteHeaderDesktop: React.FC<{ frame: number }> = ({ frame }) => {
  const rowH = 54;
  const text = 24;
  return (
    <div style={{ width: 1440, position: "relative" }}>
      <TickerRow kind="scores" size={text} height={rowH} offset={frame * 1.1 + 40} block={46} />
      <TickerRow kind="prices" size={text} height={rowH} offset={frame * 0.9 + 260} block={46} />
      <MuteButton size={44} style={{ left: 16, top: rowH - 28 }} />
      <MuteButton size={44} style={{ right: 16, top: rowH - 28 }} />
      <div style={{ height: 134, background: NAVY, display: "flex", alignItems: "center", padding: "0 30px", position: "relative" }}>
        <div style={{ display: "flex", gap: 18 }}>
          <OutlineButton label="MENU" caps size={22} icon={<Menu size={28} color={BTN_BORDER} strokeWidth={2.6} />} />
          <OutlineButton label="Collector Tour" size={22} icon={<Sparkles size={26} color={BTN_BORDER} strokeWidth={2.2} />} />
        </div>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <Logo frame={0} fps={30} width={330} built />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 26 }}>
          <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 22, color: "#FFFFFF" }}>Plans</span>
          <Bell size={30} color="#FFFFFF" strokeWidth={2} />
          <OutlineButton label="UPGRADE" caps size={22} />
          <OutlineButton square size={22} icon={<User size={26} color={BTN_BORDER} strokeWidth={2.2} />} />
        </div>
      </div>
    </div>
  );
};

/** Mobile header for the phone screen (390 px wide logical screen). */
export const SiteHeaderMobile: React.FC<{ frame: number }> = ({ frame }) => {
  const rowH = 38;
  const text = 17;
  return (
    <div style={{ width: 390, position: "relative" }}>
      <TickerRow kind="scores" size={text} height={rowH} offset={frame * 0.7 + 20} block={32} />
      <TickerRow kind="prices" size={text} height={rowH} offset={frame * 0.55 + 120} block={32} />
      <MuteButton size={30} style={{ left: 8, top: rowH - 18 }} />
      <MuteButton size={30} style={{ right: 8, top: rowH - 18 }} />
      <div style={{ background: NAVY, padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Logo frame={0} fps={30} width={260} built />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 12, gap: 10 }}>
          <OutlineButton label="MENU" caps size={16} icon={<Menu size={20} color={BTN_BORDER} strokeWidth={2.6} />} />
          <div style={{ flex: 1 }} />
          <Bell size={24} color="#FFFFFF" strokeWidth={2} style={{ marginRight: 4 }} />
          <OutlineButton label="Paid Plans" size={16} />
          <OutlineButton square size={16} icon={<User size={20} color={BTN_BORDER} strokeWidth={2.2} />} />
        </div>
      </div>
    </div>
  );
};
