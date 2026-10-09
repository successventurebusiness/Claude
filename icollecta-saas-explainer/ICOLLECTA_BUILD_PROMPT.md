Build a 58-second, premium SaaS explainer video for iCollecta (icollecta.com) in Remotion. Follow this spec exactly. If the Remotion agent skills are installed, follow their best practices too.

=====================================================================
0. HARD REQUIREMENTS
=====================================================================
- Main composition id: ICollectaExplainer. 1920x1080, 30 fps, durationInFrames 1740 (exactly 58.0 s).
- NO voiceover. NO music. NO captions of the VO. The ONLY audio is UI sound effects (section 7). I will add VO and music myself in my editor, so every scene must start on the exact frame in the timeline table (section 4).
- Quality bar: a premium SaaS launch film (the feel of Linear, Stripe or Apple keynote product videos). Every frame moves. No static slides, no default-looking UI, no generic crossfades.
- Brand colours only: navy #121833, lime #60EE79, panel navy #1C2240, slate blue #3A4A78, white #FFFFFF, soft grey #A9B0C8. No orange, no gold.
- Always write "iCollecta" (small i, capital C), "SlabVision", "Trade Room", "2-Way Talk".
- No real brands anywhere: no grading-company names, card makers, leagues, teams or real players.
- All animation must be driven by useCurrentFrame() + interpolate()/spring(). No CSS transitions or keyframe animations, no Math.random() (use random(seed) from remotion).

=====================================================================
1. PROJECT SETUP
=====================================================================
- Create the project in my "Remotion Videos" folder as "icollecta-saas-explainer" (npx create-video@latest --yes --blank --no-tailwind icollecta-saas-explainer, then npm i).
- Add packages with npx remotion add: @remotion/google-fonts, @remotion/media, @remotion/paths, @remotion/noise, @remotion/shapes, @remotion/transitions, @remotion/motion-blur. Also npm i lucide-react.
- Fonts via @remotion/google-fonts: Montserrat 800 (headlines) and Inter 500/600/700 (all UI).
- File structure:
  src/theme.ts (tokens), src/timeline.ts (scene start/duration constants from section 4, single source of truth), src/components/* (section 3), src/scenes/S01A_Scatter.tsx ... src/scenes/S15_EndCard.tsx (one file per shot), src/sfx/palette.ts and src/sfx/cues.ts (section 7), src/Main.tsx, src/Root.tsx.
- In Root.tsx register ICollectaExplainer plus every scene as its own composition inside <Folder name="Scenes"> so each scene can be previewed alone.
- Main.tsx places each scene with an absolute <Sequence from={start} durationInFrames={duration}> using timeline.ts. All cuts are hard cuts on the boundary frame. Transitions are built from an outro at the end of the outgoing scene and a matching intro at the start of the incoming scene (match cut, push-through, whip, flash), plus optional global overlay layers that straddle the boundary. Never use TransitionSeries.Transition (it would shift the timing).
- Global layers in Main.tsx, above all scenes: film grain (SVG feTurbulence, opacity 0.035, seed changes every frame), vignette (radial, 35%). Below all scenes: the Background component.

=====================================================================
2. INPUTS (check these first)
=====================================================================
- storyboard/ (project root): 22 approved storyboard frames named 01_1A.png ... 22_15.png. Open and look at each one before building its scene and match its layout, content and text. If the spec and a frame disagree, follow the spec and tell me.
- public/brand/logo.svg: the client's logo (leaping-figure icon + "iCollecta" wordmark). If missing, build a placeholder: a small lime circle icon + the word "iCollecta" in Montserrat 800 with the final "a" in lime, and add a TODO.
- public/cards/hero.png: art for the hero card (football running back, navy uniform with lime trim). public/cards/trade.png: art for the trade card (vintage basketball dunk, red jersey). public/cards/extra-01.png ... extra-08.png: optional extra card art. Fallback for any missing art: coded gradient artwork (navy/lime for hero, cream/red for trade, varied tints for extras) with a simple player silhouette made from rounded shapes. Never block on missing assets. Art that already has its own cream vintage border (trade.png, extra-06.png) is shown full-bleed inside the top-loader, with no foil frame on top. Card art may be 3:4; crop it to 5:7 from the centre.
- public/avatars/you.png (Collector A: man, short curly dark hair, trimmed beard, grey hoodie), public/avatars/maya.png (Collector B: woman, straight black hair, lime jacket), public/avatars/c1.png ... c5.png (5 extra collectors; use them in rotation wherever 6-12 avatars appear). Fallback: gradient circles with initials.

=====================================================================
2b. DESIGN SYSTEM (src/theme.ts)
=====================================================================
- Colours as in section 0. Lime glow: drop-shadow(0 0 24px rgba(96,238,121,0.45)).
- Glass panel: background rgba(28,34,64,0.55), backdrop-filter blur(24px), 1px border rgba(255,255,255,0.08), inner top highlight (inset 0 1px 0 rgba(255,255,255,0.10)), radius 24, soft shadow 0 30px 80px rgba(0,0,0,0.45).
- Radii: panels 24, cards 16, chips/buttons 999.
- Type scale at 1080p: hero headline Montserrat 800 72-88px; section headline 48-56px; UI title Inter 700 28-40px; UI body Inter 500 20-24px; chips Inter 600 22-26px. White text; key word in lime.
- Safe area: keep all text inside 90% title-safe (96px side margins, 54px top/bottom).

=====================================================================
3. COMPONENTS (src/components)
=====================================================================
- Background: navy base, faint dot grid (opacity 0.06) drifting slowly, radial lime glow at bottom centre whose strength follows the act (section 5), slow noise-driven gradient movement.
- Stage3D: wrapper with perspective 1600px; props camera {x, y, z, rotX, rotY, rotZ, scale} so every scene can do 2.5D pushes, trucks and orbits. Children can sit on depth layers: far (blur 8-12px, moves at 0.5x), mid, near (blur 4px, moves at 1.4x).
- GlassPanel, Chip (pill with optional lucide icon), Button (lime primary with navy text; outline secondary), Cursor (clean white arrow with dark outline + click ripple ring in lime), TapRipple (lime ring for phone taps), Toast.
- PhoneMockup (modern phone, thin bezels, screen 390x844 logical, scaled) and LaptopMockup (slim space-grey, screen 1440x900 logical, scaled). Screens hold real coded UI, not images.
- TradingCard: the hero object. A 5:7 card with art (image or fallback), a holographic foil overlay (rainbow linear-gradient, mix-blend-mode color-dodge, opacity ~0.35, background-position tied to the card's rotateY so the foil shifts as it tilts), a moving glare highlight (radial gradient moving opposite to the tilt), and a clear rigid top-loader around it (slightly larger rounded rect, 2px light edge, a diagonal reflection streak, thicker top lip). Props: art, rotateX, rotateY, glow (lime rim). Variants: hero, trade, extra. Also Slab variant (graded slab: thick clear case with a blank grey label strip at the top).
- Collectible: coded objects for Shot 1A/1B and 12C: silver coin (radial/conic gradients, rim), signed baseball (white sphere, red stitching SVG, a scribbled signature line), bagged comic (colourful abstract cover blocks inside a clear bag with a cardboard backing), spreadsheet scrap (torn grey grid paper), sticky note (pale grey-white note with scribble lines), photo thumbnail (rounded rect with card art), game cartridge (grey, blank label), framed jersey (no logo).
- Avatar (circle, 2px lime ring option), PriceTag (paper tag with string and a number reel inside), ValueBadge, SubgradeTile, ScanBrackets, Magnifier (circle that shows a 3x zoomed duplicate of the content beneath it, via clip-path and a scaled copy), ScanLine (lime line with glow and a revealed grid pattern behind it), LineChart (SVG path drawn with evolvePath from @remotion/paths), Counter (rolling number with formatting), Gauge (SVG ring with stroke-dashoffset), Stepper (5 nodes + connecting line that fills), Gate (ring of light with icon + label), ParticleField (deterministic), LightSweep (skewed lime gradient bar), KineticText (word-by-word mask reveal from below, 3-4 frame stagger, optional lime word), DirectionalBlur (SVG feGaussianBlur with stdDeviation "X 0" for whip pans).

=====================================================================
4. TIMELINE (frames at 30 fps; single source of truth in timeline.ts)
=====================================================================
Shot | Scene component | Start | End | Duration | VO line (reference only, not rendered)
1A  | S01A_Scatter      | 0    | 129  | 129 | "What if everything you collect..."
1B  | S01B_OnePlace     | 129  | 222  | 93  | "...could finally live in one place?"
2A  | S02A_Logo         | 222  | 270  | 48  | "Meet iCollecta,"
2B  | S02B_Social       | 270  | 339  | 69  | "the social marketplace built for collectors."
3   | S03_BulkUpload    | 339  | 408  | 69  | "Start by bringing your collection together."
4   | S04_CommandCenter | 408  | 489  | 81  | "Organized, searchable, and easy to track."
5   | S05_Worth         | 489  | 582  | 93  | "Wondering what a card is really worth?"
6   | S06_MarketData    | 582  | 675  | 93  | "iCollecta uses recent market data to help estimate its value."
7A  | S07A_ShipPause    | 675  | 729  | 54  | "And before you send a card off for grading,"
7B  | S07B_SlabVision   | 729  | 780  | 51  | "let SlabVision take a closer look."
8A  | S08A_Scan         | 780  | 819  | 39  | "Scan the card,"
8B  | S08B_PreGrade     | 819  | 858  | 39  | "get a pre-grade,"
9   | S09_SubGrades     | 858  | 960  | 102 | "see the sub-grades and understand exactly what affected the score."
10  | S10_FoundCard     | 960  | 1032 | 72  | "Found a card you want to trade for?"
11A | S11A_TradeRoom    | 1032 | 1098 | 66  | "Swap through iCollecta's Trade Room"
11B | S11B_Escrow       | 1098 | 1170 | 72  | "with escrow protection built into the process."
12A | S12A_BuySell      | 1170 | 1230 | 60  | "And when you're ready to buy, sell,"
12B | S12B_TwoWayTalk   | 1230 | 1299 | 69  | "or connect with other collectors,"
12C | S12C_Marketplace  | 1299 | 1392 | 93  | "there's a marketplace and community built around the hobby."
13  | S13_Journey       | 1392 | 1539 | 147 | "From organizing your collection to pricing, grading, trading, buying, and selling,"
14  | S14_Spreadsheet   | 1539 | 1629 | 90  | "your collection is worth more than a spreadsheet."
15  | S15_EndCard       | 1629 | 1740 | 111 | "Collect smarter with iCollecta."

=====================================================================
5. GLOBAL MOTION AND LOOK RULES
=====================================================================
- Entrances: Easing.bezier(0.16, 1, 0.3, 1) over 10-16 frames. UI pops: spring with damping ~14, stiffness ~180, mass ~0.6 (small overshoot). Panels: damping ~20, stiffness ~120. Camera moves: Easing.bezier(0.65, 0, 0.35, 1).
- Siblings stagger 3-4 frames.
- The camera always moves: at least a 3-6% push or drift across every scene, plus the specific moves listed per scene.
- Depth on every scene: something blurred in front or behind.
- On-screen text: one idea at a time, about 5 words max, KineticText reveal, exits with a 6-frame fade + 4px blur.
- Anything entering iCollecta gets the motion signature: a lime outline trace + a soft pulse.
- Act lighting (Background glow strength and how much lime is in frame): Shots 1A-2B rise from 5% to 40% (1A is dim and desaturated: objects at saturate 0.6, brightness 0.85); 3-4 30%; 5 about 20% (cool spotlight); 6 35%; 7A-9 50% (hard lime scan lines); 10-11B 50%; 12A-12C 60% (brightest, busiest); 13 rising to 70%; 14 starts grey (scene saturation 0.1) then 70%; 15 70%.
- Motion blur: use DirectionalBlur on whips and fast moves. CameraMotionBlur from @remotion/motion-blur may be used on at most 3 fast moments if render time stays reasonable.

=====================================================================
6. SCENE SPECS (frame numbers are LOCAL to each scene, 0 = scene start)
=====================================================================

S01A_Scatter (129f) - "Everything, scattered"
- Navy void. 12 collectibles float at three depths, each tilted differently: graded slab (blank label), 3 raw cards in top-loaders, the hero card (mid layer, around x 1150, y 520), bagged comic (near layer, left edge, big and blurred), silver coin, signed baseball, spreadsheet scrap, sticky note, photo thumbnail, game cartridge. Far items small, faint (opacity 0.5) and blurred; near items large and blurred at frame edges. Keep the exact centre empty.
- Each object drifts with @remotion/noise: rotateZ +-6 deg, rotateY +-18 deg, float y +-12px, each at its own speed.
- Camera: Stage3D z 0 -> 260 over the whole scene (in-out ease), so near objects slide out past the frame edges.
- Centre glint: small lime radial dot, opacity 0 -> 0.6 and size 6 -> 40px from f80 to f129.
- Export the final object positions so S01B starts from them.
- Text: none.

S01B_OnePlace (93f) - "One place"
- f0-10: the centre glint stretches into a vertical lime line (height 0 -> 560px, 2px wide). f8-22: it opens sideways into a GlassPanel 980x600 (spring), header bar with a small lime dot and "My Collection" (Inter 600, 22px). Inside: a 4x3 grid of rounded slots (dashed 1px rgba(255,255,255,0.12)).
- f12-66: the 12 objects fly from their S01A positions into the slots on curved quadratic paths (control point pushed outward/upward), turning to face camera (rotations -> 0) and scaling to fit; stagger 4f; the hero card goes first into the top-left slot (f12-26).
- Each landing: slot outline turns lime and pulses, object overshoots scale 1.08 -> 1, a small lime ring pings. Object saturation goes 0.6 -> 1 as they land.
- f60: KineticText "One place." (Montserrat 800, 64px) centred below the panel; the full stop in lime.
- Camera push 1.0 -> 1.08.
- Outro f84-93: the panel flashes lime-white (overlay 0 -> 0.9). Add a global radial flash overlay that peaks on the boundary into S02A.

S02A_Logo (48f) - "Meet iCollecta"
- f0-8: the flash fades out from the centre.
- Ring: SVG circle, 3px lime stroke with glow, radius 0 -> 280 (spring f0-14, slight overshoot); pulse at f36 (stroke 3 -> 6 -> 3).
- Sparks: 28 lime particles burst from the centre in random(seed) directions, decelerating, faded by f30.
- Logo centred (about 520px wide): icon jumps in f6-20 (translateY 60 -> 0, rotate -12 -> 0 deg, scale 0.8 -> 1, spring); wordmark letters reveal f10-26 (mask slide-up, 2f stagger); the final "a" glows lime f26-32.
- Camera push 1.0 -> 1.04.

S02B_Social (69f) - "The social marketplace"
- Intro f0-14: logo shrinks to 0.35 and drifts up out of frame while the ring tilts (rotateX 0 -> 75 deg) into a horizontal orbit ellipse around the devices (match cut on the ring).
- f4-22: LaptopMockup rises from below (spring) at centre-left, rotateY 18 deg, rotateX 6 deg; PhoneMockup rises in front at centre-right, rotateY -14 deg, scale ~0.62.
- Laptop screen (coded): thin dark ticker bar; small spaced lime caps line "ONE PLATFORM, EVERY COLLECTOR."; nav with logo, "SlabVision", "Marketplace", lime "Sign up"; banner with a dark-green striped stadium-like gradient and the white headline "Collect Smarter."; product catalog grid 4x2 of card tiles (card art) each with a small lime "View" button. Content scrolls up 40px slowly.
- Phone screen (coded): collector profile (avatar you.png, "@you", "212 cards · 48 trades"), feed of card posts with heart icons.
- 8 Avatars ride the ellipse (angle advancing ~0.6 deg/frame); items behind the devices dim and sit behind them (z by sin(angle)).
- f20-40: lime lines draw (stroke-dashoffset) from 4 avatars to the screens; small dots travel along them.
- Heart pops above one avatar at f30, speech bubble above another at f42 (spring scale, float up, fade).
- f14: lower third KineticText "The social marketplace for collectors" (Montserrat 800, 48px), "collectors" in lime.
- Camera: low angle (rotX -6 deg) and orbit rotY -8 -> +8 deg.
- Outro f60-69: LightSweep travels left -> right across the frame with DirectionalBlur.

S03_BulkUpload (69f) - "Bulk upload"
- Intro f0-6: decelerating whip blur.
- Left column (x around 260): three glass source tiles 300x110 with slate-blue icon squares and labels: "Photos" (Image icon), "Spreadsheet .csv" (Sheet icon), "Scan" (Camera icon); stagger in at f2, f5, f8.
- Right: GlassPanel "My Collection" 1000x700 (centre x around 1180) with a lime Chip "Bulk upload" and a progress bar in the header, and a Counter at the top-right.
- f8-60: about 30 thumbnails (card art, slabs, a coin) fly from the three tiles along curved lime trails into the panel grid (6x4 visible, grid scrolls up slightly as it fills); each landing flashes a lime outline. The hero card thumbnail lands at f30 in the middle of the grid and keeps a soft glow.
- Counter "0 items" -> "248 items" (f10-60, ease-out). Progress bar 0 -> 100% (f10-60); at f60 a lime check + "Done".
- Camera push 1.0 -> 1.06 and truck right 60px.
- Outro f60-69: push-through into the panel centre (scale 1 -> 2.2 with blur).

S04_CommandCenter (81f) - "Organized, searchable, easy to track"
- Intro f0-8: decelerate from the push-through (scale 1.3 -> 1, blur 10 -> 0).
- A wide dashboard titled "Command Center", built as three glass panels angled to read as one curved screen (left rotY 18 deg, middle 0, right -18 deg) inside Stage3D (overall rotY 14 deg, rotX 6 deg). Camera trucks across it: x +600 -> -600 over the scene.
- Area 1 (f0-26): 12 tiles start jumbled (random positions and rotations) and animate into sorted rows under group labels "Football", "Basketball", "Comics", "Coins" (2f stagger). Chip "Organized" at f2.
- Area 2 (f26-52): a search bar types "rookie holo" (1 character every 2 frames, f28-50) with a blinking caret. At f46 non-matching tiles fade to 0.15 and scale to 0.94 while the 4 matches slide together. Chip "Searchable" at f27.
- Area 3 (f52-81): "Collection value" card; Counter $11,520 -> $12,480 (f54-76); lime pill "+8.2%"; LineChart path draws f54-74 with a pinging dot at the end. Chip "Easy to track" at f52.
- The hero card tile among the search results glows from f46 and at f72-81 lifts toward camera (translateZ +300, scale 1.4) for a match cut into S05.

S05_Worth (93f) - "What's it really worth?"
- Intro: the hero card arrives from the S04 lift (scale 0.7 -> 1, moving in from left-centre).
- Darker background. Spotlight cone from the top (soft conic/radial gradient, opacity 0.5) with drifting noise haze. Lime only as a rim on the card.
- Hero TradingCard large (about 480x672 including the top-loader) at x 1180, y 540; rotateY sweeps -16 -> +10 deg across the scene so the foil shifts; floor reflection (flipped copy, gradient mask, opacity 0.25).
- Three PriceTags on strings (strings run up out of frame), swinging gently (rotate +-6 deg pendulum): big tag at (520, 380) scale 1.2; small tag at (760, 260) scale 0.8; near-lens tag at (260, 860) scale 1.8 with 8px blur. Each shows a vertical number reel ("$12", "$85", "$400", "$1,200", "$40", "$950"...) spinning fast with vertical blur, slowing f50-70 and landing on "$ ?" (big tag) and "?" (others).
- Camera: low angle (rotX 4 deg), arc rotY +6 -> -6 deg.
- Outro f82-93: the tags burst into ~40 lime dots that hang in the air (they continue into S06).

S06_MarketData (93f) - "Recent market data"
- The hero card slides to the left third (x 520, spring f0-14) and settles at rotateY 8 deg.
- GlassPanel chart 900x560 at x 1250 titled "Recent sales" with a small "Last 90 days"; faint axes.
- f8-40: the hanging dots plus new ones fly in from the right edge on short trails and settle as a rising scatter of 14 sale points (2f stagger). Three get label chips at f30, f34, f38: "Sold $212 · 3d ago", "Sold $238 · 1w ago", "Sold $205 · 2w ago".
- f36-52: trend line draws through the points.
- f52-64: copies of the points fly along arcs into the ValueBadge beside the card's top-right corner (around x 760, y 300). Badge scales in at f56 (glass, lime border); value counts $0 -> $225 (f56-70); sub-label "Based on 14 recent sales" at f66.
- f70: lock pulse (ring ping + glow), and a shine sweep crosses the card foil.
- Camera: straight-on, push 1.0 -> 1.07.
- Outro f86-93: soft flash from the badge.

S07A_ShipPause (54f) - "Before you send it off"
- GlassPanel "Grading submission" 760x440 centred (rotX 8, rotY -6 deg). Left: hero card thumbnail. Right: rows "Service", "Turnaround", "Shipping", each with a grey value bar. Bottom: outline Button "Ship for grading".
- Cursor enters from the bottom-right (f2-16) and stops on "Ship for grading" (hover state: 8% white fill) at f16. It hesitates f16-34 (small nudges of +-3px, then still).
- f22: a lime Button "Pre-grade with SlabVision" (ScanLine icon) springs in below it and pulses softly.
- f34-48: the cursor glides to the lime button; f50: press (scale 0.96) + click ripple.
- Camera push 1.0 -> 1.05.

S07B_SlabVision (51f) - "SlabVision takes a closer look"
- Intro f0-8: the click ripple grows into a full-frame lime ring wipe that reveals the scene.
- Hero card large and flat to camera (about 700px tall), slight tilt; darker background with a faint grid.
- Chip "SlabVision" with a scan icon at the card's top-left, f6.
- ScanBrackets: 4 lime L-corners fly in from 140% offset and snap onto the card corners (3f stagger from f6), each with a pulse.
- Magnifier (220px, 2px lime ring, glass reflection) appears at the card centre at f16 and glides to the top-right corner f20-38; inside, a 3.2x zoom of the card under it, with fine paper-fibre texture.
- Camera push 1.0 -> 1.12 toward the top-right corner.
- f44-51: a thin lime scan line appears along the card's top edge.

S08A_Scan (39f) - "Scan the card"
- PhoneMockup centred (scale ~1.1), rotateZ 3 -> 0 deg, push 1.0 -> 1.05. Screen: camera viewfinder (dark, vignette) showing the hero card inside 4 corner guides; top chip "Scanning front & back"; bottom two small thumbnails "Front" and "Back".
- ScanLine sweeps top -> bottom over the card f2-30 (in-out ease) with a glow trail, leaving a lime grid mesh over the scanned area.
- f28: "Front" gets a lime tick. f30-33: shutter flash on the screen (white 0.8 -> 0).

S08B_PreGrade (39f) - "Get a pre-grade"
- f0-6: the screen content slides up to the result view: card image on top; Gauge ring fills 0 -> 90% (f4-22) while the number counts 0.0 -> 9.0; caption "Estimated pre-grade"; four small empty tiles at the bottom.
- f22: badge bounce (scale 1 -> 1.12 -> 1) and 24 lime confetti dots (f22-36).
- Camera pushes into the screen (1.0 -> 1.25).
- Outro f32-39: the card image starts lifting out of the screen toward camera.

S09_SubGrades (102f) - "Sub-grades and the reason why"
- f0-20: the card lifts out of the phone and grows to about 620px tall at centre, tilted back (rotateX -8 deg); the phone drops away below (y +200) and blurs.
- f8-24: blueprint dimension lines draw in lime around the card borders with small arrowheads and labels "L 52" and "R 48".
- SubgradeTiles (glass 240x120) slide out from behind the card to its four diagonal corners at f14, f20, f26, f32: top-left "Centering 9.5", top-right "Corners 8.5" (stronger lime outline: the lowest score), bottom-left "Edges 9.5", bottom-right "Surface 9.5". Each number counts up over 10 frames.
- f48 and f54: two lime numbered pins "1" and "2" drop onto the card's top edge (spring bounce from 60px above).
- f58-70: a Magnifier above the pins shows the top edge zoomed, with two tiny white wear specks (draw the specks on the card so the zoom reveals them).
- f66-80: a GlassPanel "Why this grade" (520x200) slides in on the right with two numbered rows: "Two soft touches on the upper edge - minor wear" and "Corners 8.5, everything else 9.5".
- Camera: orbit rotY -10 -> +8 deg; push 1.0 -> 1.15 toward the top edge over the last 40 frames.
- Outro f96-102: whip pan right (DirectionalBlur).

S10_FoundCard (72f) - "Found a card"
- Intro f0-6: whip deceleration.
- PhoneMockup at centre-left (x 720), rotateY 8 deg. Screen: "Explore" header, search pill, a column of about 10 listing cards (image, title bar, price bar, small avatar).
- Feed scrolls up fast f2-28 (translateY about -1400 with vertical blur), springs to a stop at f30 with the vintage basketball listing centred; lime outline on it at f32. That listing shows the trade card, the title "Vintage dunk card", seller avatar maya.png with "@maya.collects", and two buttons: outline "Message" and lime "Propose swap".
- f44: TapRipple on "Propose swap" (button press).
- f50-72: a glowing hologram copy of the trade card lifts out of the screen (scale 0.5 -> 1, rotateY -20 -> 0 deg) and drifts right (translateX +500).
- Camera push 1.0 -> 1.06, then a slight truck right following the hologram.

S11A_TradeRoom (66f) - "The Trade Room"
- GlassPanel 1200x640 centred, slight high angle; camera cranes down (rotX 10 -> 4 deg).
- Header: "Trade Room" (Montserrat 800, 40px) + lime Chip with a Lock icon "Protected".
- Two columns: left "You give" with avatar you.png above the hero card; right "You get" with avatar maya.png above the trade card. The hologram from S10 flies into the right slot f0-12 and solidifies.
- Centre: swap icon (two arrows in a circle) spinning 360 deg over 40 frames with lime glow.
- Small grey line under the cards: "10% refundable deposit each side".
- Cursor clicks the lime Button "Propose swap" at f24 (ripple). f34: a bubble "Accepted" with a tick pops by Maya's avatar.
- f48-54: both cards lift slightly; f54-66: both drop straight down out of the bottom of the panel (translateY +700, DirectionalBlur vertical).

S11B_Escrow (72f) - "Escrow protection"
- Low angle (rotX -8 deg, looking up) at a vault: rounded block 900x560 in navy metal (gradients + brushed noise) with glowing lime seams, two tall glass slots (300x420) side by side.
- f0-10: hero card drops into the LEFT slot, trade card into the RIGHT slot (small bounce).
- f12-20: glass shutters slide down over both slots.
- f22: the padlock on the centre seam locks (shackle drops 12px), lime glow + ring ping. KineticText "Escrow protected" above the vault at f22.
- f30-42: a horizontal ScanLine passes over both slots.
- Stepper along the bottom: "Propose" (f24), "Accept" (f30), "Deposit" (f36), "Verify" (f44), "Complete" (f54); each node fills lime with a tick, and the connecting line fills.
- f56-68: the two cards swap slots along arcs above the vault (ownership swapped). f64: small Toast top-right "Ownership swapped".
- Camera dolly-in 1.0 -> 1.06.

S12A_BuySell (60f) - "Buy and sell"
- Intro: the vault's centre seam becomes a vertical lime divider in the middle of the frame (match).
- Left half: big label "Buy" (Montserrat 800, 56px) at f6. A phone (rotY 10 deg) shows a listing of a graded baseball slab with price "$180" and a lime "Buy now" button; TapRipple at f12; payment sheet slides up f16-26 "Paid · held in escrow" with a lock icon; tick at f28.
- Right half: big label "Sell" at f32. A phone (rotY -10 deg) shows the same listing; notification banner slides down f30-38 "Your card sold" with a lime tick; "Sold" pill on the listing at f40.
- f26-36: a lime particle arc travels from the left phone to the right phone over the divider.
- Camera push 1.0 -> 1.04.

S12B_TwoWayTalk (69f) - "Connect with collectors"
- Chip "2-Way Talk" at the frame's top-left at f4.
- PhoneMockup centred (scale 1.05), camera arc rotY -6 -> +6 deg. Screen: header "2-Way Talk" and "Channel 2471"; at the top, avatars you.png and maya.png joined by a lime line; in the middle a 24-bar waveform; at the bottom a large lime push-to-talk button with a Mic icon.
- f8: press (button scale 0.94, ripple) held until f40. Waveform bars animate from noise while talking (f10-40, then f46-60). Lime sound rings expand from the phone every 8 frames (f10-40).
- f42: chat bubble from Maya: "Want to trade for your rookie?"
- f36-60: 8 avatar bubbles pop in on a loose circle around the phone (3f stagger) and lime lines draw from each to the phone (the network grows).

S12C_Marketplace (93f) - "A marketplace and a community"
- A 3D floor of listing tiles: 8 columns x 30 rows (tiles 220x300 with collectible art, a price bar and a lime dot), plane rotateX 62 deg; the camera flies forward over it (plane moves toward camera) and tilts up near the end (rotateX 62 -> 50 deg). Far rows fade into navy fog; a lime glow sits on the horizon.
- Tile contents mix: card art, slabs, comic covers, coins, baseballs, framed jerseys, game cartridges.
- 12 small avatar bubbles hop between tiles along parabolic arcs with lime trails; small hearts and chat icons pop.
- Category chips across the top (y 110), stagger f6-26: "Cards", "Comics", "Coins", "Memorabilia", "Games".
- Centre KineticText: "A marketplace" at f24 (Montserrat 800, 88px) and "and a community" at f44 ("community" in lime); fade out f84.
- Horizon glow grows f60-93; the last 6 frames bloom to a lime-white flash.

S13_Journey (147f) - "The whole journey"
- A horizontal world about 5200px wide: a gently curving lime track (SVG path) with six Gates. Stage3D rotY 28 deg so the gates recede to the right; the camera follows the hero card (world translateX keeps the card around x 760).
- The card passes each gate EXACTLY at these local frames: gate 1 f12, gate 2 f57, gate 3 f75, gate 4 f93, gate 5 f108, gate 6 f126 (piecewise interpolate on the card position). The card banks with the path slope and leaves a 300px lime ribbon trail.
- Each gate on pass: ring turns lime with a flare (scale 1 -> 1.15 -> 1, glow burst); its icon + label pops in above and stays lit. Gates ahead stay pale (white 25%). Labels (Montserrat 800, 34px) with lucide icons: 1 "Organize" (LayoutGrid), 2 "Price" (Tag), 3 "Grade" (ScanLine), 4 "Trade" (ArrowLeftRight), 5 "Buy" (ShoppingCart), 6 "Sell" (BadgeDollarSign).
- Speed-line particles stream left the whole time.
- f128-147: the camera swings to face the card head-on (rotY 28 -> 0 deg) and the card flies at the camera (scale 1 -> 3.2, blur at the end) for a match cut into S14.

S14_Spreadsheet (90f) - "More than a spreadsheet"
- Whole-scene saturation 0.1 until f14, then rising to 1 by f50.
- A classic light spreadsheet window: title "collection_final_v7.xlsx", columns "Card", "Year", "Condition", "Value", rows of grey text ("Rookie holo FB", "2019", "NM?", "???" and similar). Dull and lifeless.
- f0-10: the hero card falls onto the sheet's centre (scale 2.5 -> 1) with a shadow and a small bounce.
- f14-20: a lime crack draws diagonally across the sheet. f20-50: cells detach as tiles, flip in 3D and fly to re-assemble as the iCollecta collection view (navy UI: card tiles with art, "9.0" grade badges, lime values like "$225", a sparkline, a "Trade" button). The hero card ends featured in the centre with a glow.
- f30: KineticText "More than a spreadsheet." at the top. f46-56: a lime strike line draws across "spreadsheet", which fades to 50% grey.
- Camera pulls back 1.1 -> 1.0 with a slight rise.
- Outro f80-90: the UI recedes and dims behind a glow bloom.

S15_EndCard (111f) - "Collect smarter"
- Navy background, lime horizon glow (radial ellipse at the bottom), particles rising slowly. Behind everything, the hero card small (220px), 3px blur, lime rim, turning to face camera (rotY 20 -> 0 deg).
- f6-24: logo builds at y 300 (about 460px wide), same build as S02A but quicker.
- f16-36: KineticText "Collect smarter with iCollecta." (Montserrat 800, 72px), "smarter" in lime.
- f40: lime Button "Sign up free" (Inter 700, 32px, navy text) springs in; below it "icollecta.com" (Inter 600, 28px, white 80%).
- f52-66: Cursor enters; f70: it clicks the button (press + ripple + glow pulse).
- f80: small line "One platform. Every collector." (24px, soft grey).
- f84-111: hold with only a subtle breathing glow. No fade to black (I'll handle the fade in my edit).
- Camera pull-back 1.04 -> 1.0.

=====================================================================
7. UI SOUND EFFECTS (the only audio)
=====================================================================
Style: clean, modern SaaS UI sounds: soft clicks, taps, pops, snaps, ticks, airy whooshes, glassy swells, one gentle chime for confirmations. Nothing cartoonish, no 8-bit bleeps, no meme sounds, no music.

Sources (all free for commercial use):
- Kenney "Interface Sounds" pack (CC0). Get it from kenney.nl, or clone https://github.com/kapishdima/soundcn (MIT) and use assets/kenney_interface-sounds. From the same repo, assets/kenney_sci-fi-sounds for impactMetal and forceField only.
- Remotion's hosted sounds: https://remotion.media/whoosh.wav, https://remotion.media/whip.wav, https://remotion.media/switch.wav, https://remotion.media/mouse-click.wav, https://remotion.media/shutter-modern.wav, https://remotion.media/ding.wav

Convert everything to 48 kHz WAV with ffmpeg, trim leading silence, normalise each file to about -3 dBFS peak, and save to public/sfx/ under these semantic names (src/sfx/palette.ts maps name -> file so I can swap any sound in one place):
- ui-click: interface click_002 (alt: remotion mouse-click.wav)
- ui-tap: interface select_001
- ui-pop: interface pluck_002 (alt: drop_002)
- ui-snap: interface drop_002
- ui-tick: interface tick_002
- ui-type: interface tick_001
- ui-toggle: interface toggle_002 (alt: remotion switch.wav)
- ui-open: interface maximize_003
- ui-close: interface minimize_003
- ui-glass: interface glass_002
- ui-scroll: interface scroll_002
- ui-confirm: interface confirmation_002
- ui-notify: interface bong_001
- ui-question: interface question_001
- whoosh-soft: remotion whoosh.wav
- whoosh-fast: remotion whip.wav
- shutter: remotion shutter-modern.wav
- ding: remotion ding.wav
- scan: sci-fi forceField_001, trimmed to 0.8 s with a 0.1 s fade-out
- lock: sci-fi impactMetal_001 layered with ui-click
- riser: whoosh.wav reversed (ffmpeg areverse) with a fade-in, about 0.9 s
- sub-thump: generated with ffmpeg: 55 Hz sine, 0.35 s, fast exponential decay
- logo-hit: a pre-mixed file of whip + ui-glass + sub-thump
- gate-1 ... gate-6: ui-confirm pitched up 0, 2, 4, 5, 7, 9 semitones (ffmpeg asetrate + aresample), for Shot 13
- step-1 ... step-5: ui-tick pitched up 0, 2, 4, 5, 7 semitones, for Shot 11B

Volumes (Remotion volume prop): clicks/taps 0.5; pops/snaps 0.3; ticks/typing 0.12-0.2; whooshes 0.2-0.35; glass/open/close 0.3; confirm/notify 0.45; scan 0.35; lock 0.55; logo-hit 0.7 (0.45 in S15). Clicks must not mask each other: when cues are closer than 2 frames, drop one.

Implementation: src/sfx/cues.ts lists every cue as {scene, localFrame, sound, volume}; the global frame = scene start + localFrame. Render them in Main.tsx as <Sequence from={globalFrame}><Audio src={staticFile('sfx/NAME.wav')} volume={v} /></Sequence> using Audio from @remotion/media. Add small natural variation by alternating between 2 similar files where available (e.g. click_002/click_003).

Cue list (local frames):
- S01A: whoosh-soft f8 (0.18), whoosh-soft f70 (0.22), riser f100 (0.3)
- S01B: ui-glass f8, whoosh-soft f14 (0.25), ui-snap on every landing (f26 onward, every 4f, 0.25, alternate snap/tick), whoosh-fast f86 (0.3)
- S02A: logo-hit f0 (0.7), ui-tick f12/f18/f24 (0.12), ui-glass f28 (0.25)
- S02B: whoosh-soft f4 (0.3), ui-pop f30 and f42, ui-notify f50 (0.25), whoosh-fast f60 (0.35)
- S03: ui-glass f2, ui-snap every 6f f12-58 (0.2), ui-tick every 3f f10-58 (0.1), ui-confirm f60, whoosh-soft f62 (0.3)
- S04: ui-pop f2/f27/f52 (chips), ui-snap every 4f f4-24, ui-type every 2f f28-50, whoosh-soft f46 (0.25), riser f54 (0.2), ui-tick f76 (0.3)
- S05: ui-question f6 (0.4), ui-tick every 2f f10-50 then every 4f to f62 and every 6f to f70 (0.12-0.18), ui-pop f72, ui-glass f84 (0.25)
- S06: whoosh-soft f2 (0.25), ui-tick every 2f f8-40 (0.1), ui-pop f30/f34/f38, whoosh-soft f52 (0.25), ding f70 (0.3)
- S07A: ui-tick f16 (0.2), ui-pop f22 (0.35), whoosh-soft f36 (0.12), ui-click f50
- S07B: ui-tick f6/f9/f12/f15 (0.25), whoosh-soft f20 (0.2), ui-open f36
- S08A: scan f2, shutter f30 (0.45)
- S08B: ui-tick every 2f f4-22 (0.12), ui-confirm f22 (0.5), ui-glass f24 (0.2)
- S09: whoosh-soft f2 (0.3), ui-tick f8 (0.15), ui-snap f14/f20/f26/f32, ui-pop f48/f54 (pins), ui-open f58, ui-glass f66, whoosh-fast f96 (0.35)
- S10: ui-scroll f2 (0.3), ui-tick f30 (0.25), ui-tap f44, ui-pop f46, whoosh-soft f52 (0.25)
- S11A: ui-glass f2, ui-snap f12, whoosh-soft f16 (0.2), ui-click f24, ui-confirm f34, whoosh-fast f56 (0.3)
- S11B: ui-snap f4 and f7 (0.35), ui-close f12, lock f22, step-1 f24, step-2 f30, scan f30 (0.3), step-3 f36, step-4 f44, step-5 f54, ui-confirm f54, whoosh-soft f56 (0.25)
- S12A: whoosh-soft f0 (0.2), ui-tap f12, ui-open f16, whoosh-soft f26 (0.15), ui-confirm f28 (0.4), ui-notify f30, ui-pop f40
- S12B: ui-pop f4 (0.25), ui-toggle f8 (0.45, push-to-talk), ui-pop f42 (0.35), ui-pop f36/f44/f52/f60 (0.15)
- S12C: whoosh-soft f0 (0.3), ui-pop f6/f11/f16/f21/f26 (0.2), ui-notify f40/f56/f70 (0.15), riser f70 (0.3)
- S13: at each gate frame f12/f57/f75/f93/f108/f126: whoosh-soft (0.18) + gate-1...gate-6 (0.3); whoosh-fast f130 (0.35)
- S14: ui-snap f6 (0.4), ui-glass f14 (0.35), whoosh-soft f20 (0.3), ui-snap every 3f f28-48 (0.15), whoosh-fast f46 (0.25), ui-confirm f58 (0.3)
- S15: logo-hit f6 (0.45), ui-tick f16-36 one per word (0.1), ui-pop f40 (0.35), ui-click f70, ui-glass f72 (0.2)

=====================================================================
8. BUILD AND CHECK PROCESS
=====================================================================
1. Set up the project, theme and components. Make a "Kit" composition that shows every component on one screen; render it as a still and check it.
2. Build the scenes in order. After each scene, render 3 stills (local frame 5, the middle, and duration-5) with npx remotion still, look at them, and compare with its storyboard frame. Fix overlaps, text overflow, anything outside the 90% safe area, and any unreadable text before moving on.
3. Assemble Main.tsx. Check the total is exactly 1740 frames and that every scene starts on its timeline frame.
4. Add the SFX track. Check every cue lands on the action it belongs to.
5. Open Remotion Studio for me to review, and tell me the local URL. Do not render the final video until I approve.
6. After I approve, render:
   - out/icollecta_explainer_sfx.mp4 (H.264, CRF 16, AAC 48 kHz): video with the UI sound effects
   - out/icollecta_explainer_silent.mp4 (same, --muted)
   - out/icollecta_sfx_stem.wav (audio-only render of the SFX track)
7. Finally, give me a short list of anything you couldn't match from this spec, and of any placeholders still in use (logo, card art, avatars).
