// Semantic sound name -> file in public/sfx (built by scripts/build-sfx.sh).
// Swap any sound here in one place.
export const PALETTE = {
  "ui-click": ["ui-click.wav", "ui-click-2.wav"],
  "ui-tap": ["ui-tap.wav", "ui-tap-2.wav"],
  "ui-pop": ["ui-pop.wav", "ui-pop-2.wav"],
  "ui-snap": ["ui-snap.wav", "ui-snap-2.wav"],
  "ui-tick": ["ui-tick.wav", "ui-tick-2.wav"],
  "ui-type": ["ui-type.wav"],
  "ui-toggle": ["ui-toggle.wav"],
  "ui-open": ["ui-open.wav"],
  "ui-close": ["ui-close.wav"],
  "ui-glass": ["ui-glass.wav", "ui-glass-2.wav"],
  "ui-scroll": ["ui-scroll.wav"],
  "ui-confirm": ["ui-confirm.wav"],
  "ui-notify": ["ui-notify.wav"],
  "ui-question": ["ui-question.wav"],
  "whoosh-soft": ["whoosh-soft.wav"],
  "whoosh-fast": ["whoosh-fast.wav"],
  shutter: ["shutter.wav"],
  ding: ["ding.wav"],
  scan: ["scan.wav"],
  lock: ["lock.wav"],
  riser: ["riser.wav"],
  "sub-thump": ["sub-thump.wav"],
  "logo-hit": ["logo-hit.wav"],
  "gate-1": ["gate-1.wav"],
  "gate-2": ["gate-2.wav"],
  "gate-3": ["gate-3.wav"],
  "gate-4": ["gate-4.wav"],
  "gate-5": ["gate-5.wav"],
  "gate-6": ["gate-6.wav"],
  "step-1": ["step-1.wav"],
  "step-2": ["step-2.wav"],
  "step-3": ["step-3.wav"],
  "step-4": ["step-4.wav"],
  "step-5": ["step-5.wav"],
} as const;

export type SoundName = keyof typeof PALETTE;

/** Default volumes (spec section 7) when a cue does not set its own. */
export const DEFAULT_VOLUME: Partial<Record<SoundName, number>> = {
  "ui-click": 0.5,
  "ui-tap": 0.5,
  "ui-pop": 0.3,
  "ui-snap": 0.3,
  "ui-tick": 0.15,
  "ui-type": 0.15,
  "ui-toggle": 0.45,
  "ui-open": 0.3,
  "ui-close": 0.3,
  "ui-glass": 0.3,
  "ui-scroll": 0.3,
  "ui-confirm": 0.45,
  "ui-notify": 0.45,
  "ui-question": 0.4,
  "whoosh-soft": 0.25,
  "whoosh-fast": 0.3,
  shutter: 0.45,
  ding: 0.3,
  scan: 0.35,
  lock: 0.55,
  riser: 0.3,
  "logo-hit": 0.7,
};
export const volumeFor = (s: SoundName) => DEFAULT_VOLUME[s] ?? (s.startsWith("gate") ? 0.3 : s.startsWith("step") ? 0.25 : 0.3);

/** Short transients that must not mask each other (cues < 2 frames apart). */
export const isTransient = (s: SoundName) =>
  ["ui-click", "ui-tap", "ui-tick", "ui-type", "ui-snap", "ui-pop"].includes(s) || s.startsWith("step");
