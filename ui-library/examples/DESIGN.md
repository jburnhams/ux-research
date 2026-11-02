---
# DESIGN.md for the worked example. Follows ../../ux-design/skill/assets/DESIGN.template.md.
version: alpha
name: "Back Lane Clay Co-op, kiln room"
mode: operate
colors:
  primary-seed: "#5b6e5a"     # from: the studio's house celadon glaze, on the test tiles by the kiln-room door
  secondary-seed: "#c4621c"   # from: the peephole glow at about 1,000 °C; its job is "hot"
typography:
  sans: "Public Sans Variable, ui-sans-serif, system-ui, sans-serif"
  mono: "ui-monospace (not used on these screens)"
  scale: { ratio: 1.2, base: 16px }
rounded: { control: 4px, surface: 6px, overlay: 8px, pill: 9999px }
spacing: { base: 4px }
motion: { state: 200ms, spatial: 350ms, reduced: "durations collapsed" }
---

> SAMPLE. Back Lane Clay Co-op is fictional. This file shows what a Plinth project's
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

Generated with `palette.mjs --primary "#5b6e5a" --secondary "#c4621c" --contrast 0.5`:
42 checks pass, 0 warn, 0 fail. `--contrast 0.5` rather than 0 because of the wall
tablet's glare.

- Ground and ink: a near-white with a trace of the celadon (chroma 0.007), and a
  near-black ink.
- Primary: the celadon. Its job is the one main action per view, selection and focus.
  It is low in chroma (0.038) on purpose: on an Operate screen restraint is the floor.
- Secondary: the peephole orange, used only as the warning status hue, because in this
  room the caution state is "hot". It is not used decoratively.
- Status: success 150°, warning 50° (from the secondary), danger 27°, info 245°; tint
  and ink pairs solved to ≥ 6:1. Success sits 6° from the primary's hue at three times
  its chroma; accepted because statuses always carry a word and an icon.
- Charts: the firing curve uses `--warning` (it *is* heat); the plan is dashed
  `--muted-foreground`.

## Typography

Public Sans: a plain grotesk with true tabular figures, sturdy at small sizes and
legible at distance, with nothing to say about itself, which suits a shared tool.
One family; no display face. Steps: caption 12, label 14/500, body-sm 14, body 16,
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

State changes only, 200ms on colour and opacity. No page-load motion. The spinner in
the booking button and the skeleton pulse are switched off under reduced motion.

## Components

Plinth: Button, IconButton, AsyncButton, Field and controls, Status, Metric,
DataView, DataTable, LineChart, PageHeader, UndoBar. Icons: Lucide, one stroke weight,
beside labels only.

## Do's and Don'ts

- Do: say temperatures and times exactly, with units ("212 °C", "about 14:50").
- Do: explain the kiln constraints in hints and errors, so the form teaches them.
- Don't: use the warning orange for anything that is not heat.
- Don't: show a kiln as "ready" until it is below 200 °C.

## Lint allowances

| Rule | Where | Reason (from the brief) |
|---|---|---|
| none | | `slop-lint --mode operate`: 0 findings |
