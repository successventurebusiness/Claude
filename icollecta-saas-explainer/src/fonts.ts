import { loadFont } from "@remotion/fonts";
import montserrat700 from "@fontsource/montserrat/files/montserrat-latin-700-normal.woff2";
import montserrat800 from "@fontsource/montserrat/files/montserrat-latin-800-normal.woff2";
import mono400 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2";
import mono700 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2";
import inter500 from "@fontsource/inter/files/inter-latin-500-normal.woff2";
import inter600 from "@fontsource/inter/files/inter-latin-600-normal.woff2";
import inter700 from "@fontsource/inter/files/inter-latin-700-normal.woff2";

// Google Fonts is unreachable from the headless renderer here, so the same
// families are bundled from Fontsource (npm) and loaded with delayRender.
loadFont({ family: "Montserrat", url: montserrat700, weight: "700" });
loadFont({ family: "Montserrat", url: montserrat800, weight: "800" });
// Monospace for the website ticker rows (revision 1, shot 2B).
loadFont({ family: "JetBrains Mono", url: mono400, weight: "400" });
loadFont({ family: "JetBrains Mono", url: mono700, weight: "700" });
loadFont({ family: "Inter", url: inter500, weight: "500" });
loadFont({ family: "Inter", url: inter600, weight: "600" });
loadFont({ family: "Inter", url: inter700, weight: "700" });

export const HEAD = "Montserrat, sans-serif";
export const UI = "Inter, sans-serif";
export const MONO = "'JetBrains Mono', monospace";
