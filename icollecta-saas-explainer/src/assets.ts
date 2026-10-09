import { staticFile } from "remotion";
import { PRESENT_ASSETS } from "./generated/assets";

const has = (f: string) => PRESENT_ASSETS.includes(f);

export type ArtKind = "hero" | "trade" | `extra-${number}`;

export type ArtSource =
  | { kind: "image"; src: string; vintageBorder: boolean }
  | { kind: "fallback"; variant: "hero" | "trade" | "extra"; tint: number };

/** Card art with the spec's coded fallback when the file is missing. */
export const cardArt = (kind: ArtKind): ArtSource => {
  if (kind === "hero") {
    return has("cards/hero.png")
      ? { kind: "image", src: staticFile("cards/hero.png"), vintageBorder: false }
      : { kind: "fallback", variant: "hero", tint: 0 };
  }
  if (kind === "trade") {
    return has("cards/trade.png")
      ? { kind: "image", src: staticFile("cards/trade.png"), vintageBorder: true }
      : { kind: "fallback", variant: "trade", tint: 0 };
  }
  const n = Number(kind.split("-")[1]);
  const file = `cards/extra-0${n}.png`;
  return has(file)
    ? { kind: "image", src: staticFile(file), vintageBorder: n === 6 }
    : { kind: "fallback", variant: "extra", tint: n };
};

export const EXTRA = (i: number): ArtKind => `extra-${(((i % 8) + 8) % 8) + 1}`;

export type AvatarSource = { src: string | null; initials: string; hue: number };

const AVATARS: Record<string, { file: string; initials: string; hue: number }> = {
  you: { file: "avatars/you.png", initials: "YO", hue: 220 },
  maya: { file: "avatars/maya.png", initials: "MC", hue: 130 },
  c1: { file: "avatars/c1.png", initials: "JR", hue: 200 },
  c2: { file: "avatars/c2.png", initials: "AL", hue: 260 },
  c3: { file: "avatars/c3.png", initials: "KS", hue: 330 },
  c4: { file: "avatars/c4.png", initials: "DM", hue: 170 },
  c5: { file: "avatars/c5.png", initials: "TB", hue: 30 },
};

export const avatar = (key: string): AvatarSource => {
  const a = AVATARS[key];
  return { src: has(a.file) ? staticFile(a.file) : null, initials: a.initials, hue: a.hue };
};

/** Extra collectors in rotation wherever 6-12 avatars appear. */
export const crowd = (i: number) => avatar(`c${(i % 5) + 1}`);
