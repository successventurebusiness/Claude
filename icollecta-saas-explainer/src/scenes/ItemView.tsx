import { Collectible } from "../components/Collectible";
import { TradingCard } from "../components/TradingCard";
import type { ScatterItem } from "./scatter";

/** Renders a scatter item at its nominal size. */
export const ItemView: React.FC<{ it: ScatterItem; rotY?: number; glow?: number }> = ({ it, rotY = 0, glow = 0 }) => {
  if (it.type === "card" || it.type === "slab") {
    return <TradingCard art={it.art ?? "extra-1"} width={it.size} variant={it.type === "slab" ? "slab" : "card"} rotateY={rotY} glow={glow} />;
  }
  return (
    <div style={{ transform: `rotateY(${rotY}deg)` }}>
      <Collectible kind={it.type} size={it.size} art={it.art} seed={it.size} />
    </div>
  );
};
