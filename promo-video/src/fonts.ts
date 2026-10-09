import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (from Fontsource, SIL OFL) so renders
// never depend on reaching Google Fonts.
const FAMILIES = {
  Inter: "inter",
  "Plus Jakarta Sans": "plus-jakarta-sans",
  "Space Grotesk": "space-grotesk",
  Manrope: "manrope",
  Poppins: "poppins",
  "JetBrains Mono": "jetbrains-mono",
  Sora: "sora",
  Outfit: "outfit",
} as const;

export type FontFamily = keyof typeof FAMILIES;

const WEIGHTS = ["400", "500", "600", "700", "800"] as const;
const AVAILABLE_WEIGHTS: Partial<Record<FontFamily, readonly string[]>> = {
  "Space Grotesk": ["400", "500", "600", "700"],
};

export const loadLocalFont = (family: FontFamily): string => {
  for (const weight of AVAILABLE_WEIGHTS[family] ?? WEIGHTS) {
    loadFont({
      family,
      url: staticFile(`fonts/${FAMILIES[family]}-latin-${weight}-normal.woff2`),
      weight,
    });
  }
  return family;
};
