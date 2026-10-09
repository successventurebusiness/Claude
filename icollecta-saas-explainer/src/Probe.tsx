import { AbsoluteFill } from "remotion";
import { TradingCard } from "./components/TradingCard";

// Scratch composition for checking single components.
export const Probe: React.FC = () => (
  <AbsoluteFill style={{ background: "#121833", flexDirection: "row", gap: 60, alignItems: "center", justifyContent: "center" }}>
    <TradingCard art="hero" width={420} rotateY={-10} glow={0.6} />
    <TradingCard art="trade" width={420} rotateY={8} />
  </AbsoluteFill>
);
