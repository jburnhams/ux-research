---
# DESIGN.md for the worked example. Follows ../../ux-design/skill/assets/DESIGN.template.md.
version: alpha
name: "Back Lane Clay Co-op, kiln room"
mode: operate
colors:
  primary-seed: "#4d7a52"     # from: the studio's celadon where it pools thick in a bowl's foot, on the test tiles by the kiln-room door
  secondary-seed: "#c4621c"   # from: the peephole glow at about 1,000 °C; its job is "hot"
typography:
  sans: "Public Sans Variable, ui-sans-serif, system-ui, sans-serif"
  display: "Archivo Variable at wdth 125, weight 800 (page titles only)"
  mono: "ui-monospace (not used on these screens)"
  scale: { ratio: 1.2, base: 16px }
rounded: { control: 4px, surface: 6px, overlay: 8px, pill: 9999px }
spacing: { base: 4px }
motion: { state: 200ms, spatial: 350ms, press: 100ms, moment: 500ms, reduced: "durations collapsed" }
character:
  sentence: "The kiln room should feel like the kiln team is looking after your work: exact about heat and time, and pleased with you when you have made something."
  voice: [plain, exact, unhurried]
  signature: "the firing chart, its line coloured as the kiln glows"
  moments: [booking finished]
---

> SAMPLE. Back Lane Clay Co-op is fictional. This file shows what a Strata project's
> DESIGN.md contains; the screens in `screens/` are built to it.

## Overview

- **Subject**: the shared kilns of a 60-member pottery co-op · **Audience**: members
  checking on their work, on their phones and on a tablet on the kiln-room wall (dusty,
  bright, read at arm's length) · **Job**: know when your work comes out, and book space
  in the next firing.
- **Mode**: Operate, because people come to find something out and act on it.
- **Reference**: "On this screen, **the kiln controller's program** becomes **the
  chart**": the firing is drawn as the controller runs it, ramp and hold segments, with
  the measured curve over the plan and the safe-to-open temperature as a band.
- **Signature move**: that chart. Everything else is standard controls.
- **Alternates considered**: B, "the shelf map becomes the booking form" (each kiln's
  shelves drawn to scale, booked by drawing on them; vivid, but slower than three fields
  for the common case and hard on a phone). C, "the cone pack becomes the status
  system" (status marks shaped like slumped witness cones; charming, and illegible to
  new members).

Subject inventory (from which the above came): Orton cones 04, 6 and 10; 1,060 °C
bisque and 1,222 °C glaze peaks; ramp rates of 100, 150 and 60 °C an hour; a 15-minute
hold; 200 °C safe-to-open; shelves 45 cm and 30 cm apart; the kiln log sheet on a
clipboard; labelled pieces on the "to fire" shelf by 17:00 the day before; raku on
Saturdays in the yard; the celadon test tiles; the peephole glow.

## Colors

Generated with `palette.mjs --primary "#4d7a52" --secondary "#c4621c" --contrast 0.5`:
42 checks pass, 0 warn, 0 fail. `--contrast 0.5` rather than 0 because of the wall
tablet's glare.

- Ground and ink: a near-white with a trace of the celadon (chroma 0.007), and a
  near-black ink.
- Primary: the celadon. Its job is the one main action per view, selection and focus.
  Since 2026-11-07 it is the glaze where it pools thick (chroma 0.079, up from 0.038
  for the thin-glaze seed `#5b6e5a`), because the first version read as grey.
- Secondary: the peephole orange, used only as the warning status hue, because in this
  room the caution state is "hot". It is not used decoratively.
- Status: success 150°, warning 50° (from the secondary), danger 27°, info 245°; tint
  and ink pairs solved to ≥ 6:1. Success sits 6° from the primary's hue at three times
  its chroma; accepted because statuses always carry a word and an icon.
- Charts: the firing curve is coloured by its own temperature with the `--heat-*`
  steps (below); the plan is dashed `--muted-foreground`.
- Heat: five product tokens, `--heat-unlit` to `--heat-yellow`, the colours seen
  through the peephole. Nothing glows below about 525 °C (the Draper point), so the
  low end is unlit clay; then dull red (600 °C), cherry (800), orange (1,000) and
  yellow (1,200). Lightness is capped so every step clears 3:1 against the ground
  as a line (light: 4.3–8.1:1; dark: 4.1–12.4:1, checked with
  `ux-design/skill/scripts/lib/color.mjs`). They are used only where colour encodes
  temperature.

- Glazes: seven product tokens, `--glaze-celadon` to `--glaze-raku`, the test tiles
  by the door. Each booking shows its glaze as a small tile beside the firing, in the
  table and in the kiln strip, so a member finds their work by its colour as they
  would on the shelf. The glaze's name is always beside the tile.

## Typography

Public Sans: a plain grotesk with true tabular figures, sturdy at small sizes and
legible at distance, with nothing to say about itself, which suits a shared tool.
One display face, once per screen: page titles are Archivo, expanded (wdth 125) and
heavy (800), the lettering cast into a kiln maker's nameplate. Added 2026-11-07,
when the first version was judged too plain; it is checked as loaded by the render
script. Steps: caption 12, label 14/500, body-sm 14, body 16,
heading 18/600, title 24/600, figure 28/500 tabular.

## Layout

Single column, max 72rem for the kiln room and 42rem for forms; 16px side gutter on
phones. Sections separated by space and hairlines; no cards (nothing on these screens
is a separate object you pick up).

## Elevation & Depth

Hairlines for everything on the page; `shadow-overlay` only on the undo bar.

## Shapes

4px controls, 6px panels, 8px overlays: a little softer than square, as befits a craft
studio's tool, and well short of the soft-everything default.

## Motion

State changes, 200ms on colour and opacity. Buttons give 2% under a press, over
100ms, which is all the motion something used tens of times a day gets. One moment:
when a booking is finished, the member's pieces set down on their shelf in the
drawing (500ms, hard ease-out, no overshoot, once). No page-load motion. The spinner
in the booking button, the skeleton pulse and the moment are switched off under
reduced motion.

## Character

- **Sentence**: the kiln room should feel like the kiln team is looking after your
  work: exact about heat and time, and pleased with you when you have made
  something.
- **Voice**, this but not that: plain, not cute; exact ("212 °C", "about 14:50"), not
  approximate; unhurried, not chirpy. Kiln-room words ("bisque", "cone 6", "the
  to-fire shelf", "safe to open") rather than app words. No jokes about failed
  firings: a cracked pot is a loss to someone.
- **Signature**: the firing chart, drawn as the controller runs it, its line coloured
  as the kiln glows, and the kiln strip under the header: each kiln's state, its one
  figure, a small trace of its temperature in the same glow colours, and a glaze tile
  for each booking inside. The colour is a fact of the subject, not a gradient for its own
  sake, and the y position still carries the value.
- **Moments** (the delight budget, spent where it is rare and earned):
  - *Booking finished* ([`screens/booked.tsx`](./screens/booked.tsx)): what was
    booked, what to do next and by when, and a drawing of kiln 2 with the member's
    pieces set down on their shelf and the clearance under the shelf above. It is
    the shelf map from alternate B, used where it is good (showing a result) instead
    of where it was slow (as the form).
  - *Work ready to collect*: a green status with the words "Ready to collect". It is
    good news, but it is read many times a day by everyone in the room, so it stays
    a status; nothing celebrates on a dashboard.
  - *Empty*: "All three kilns are cold", then what to book and by when.
  - *Error*: says which controller, how old the reading is and where to read the
    live one (the panel by the door).
- **Not here**: confetti, sound, a mascot, stock illustrations, "Oops", emoji,
  animation on the dashboard's own load, anything on the table rows or the nav.

## Components

Strata: Button, IconButton, AsyncButton, Field and controls, Status, Metric,
DataView, DataTable, LineChart (with `colourScale` for the heat line), PageHeader,
UndoBar, Done. Product-specific: `ShelfFigure`, the booking's drawing. Icons: Lucide, one stroke weight,
beside labels only.

## Do's and Don'ts

- Do: say temperatures and times exactly, with units ("212 °C", "about 14:50").
- Do: explain the kiln constraints in hints and errors, so the form teaches them.
- Don't: use the warning orange or the heat steps for anything that is not heat.
- Don't: show a kiln as "ready" until it is below 200 °C.

## Lint allowances

| Rule | Where | Reason (from the brief) |
|---|---|---|
| none | | `slop-lint --mode operate`: 0 findings |
