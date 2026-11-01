---
# DESIGN.md: token contract. Follows the Google DESIGN.md section order
# (https://github.com/google-labs-code/design.md). Values are generated where
# possible (palette.mjs); every value has a reason in the prose below.
version: alpha
name: "[Product] [surface]"
mode: operate            # persuade | operate | read | experience
colors:
  primary-seed: "#______"     # from: [the subject's real object this came from]
  secondary-seed: "#______"   # optional: a second job, ≥20° hue away
typography:
  sans: "[Face], ui-sans-serif, system-ui, sans-serif"
  display: "[Face or omit on Operate]"
  mono: "[Face] (code, IDs and figures only)"
  scale: { ratio: 1.2, base: 16px }
rounded: { control: _px, card: _px, dialog: _px, pill: 9999px }
spacing: { base: 4px }
motion: { state: 200ms, spring: { stiffness: 700, damping-ratio: 0.9 }, reduced: "opacity only" }
---

## Overview

- **Subject**: [one concrete subject] · **Audience**: [who, where, in what light] · **Job**: [the surface's single job]
- **Mode**: [mode], because [the visitor comes to …]
- **Reference**: "On this [screen], **[something that belongs to the subject]** becomes **[the device]**."
- **Signature move** (Operate) / **the one bold thing** (Persuade): [concrete]
- **Alternates considered**: [B: one line + tradeoff] · [C: one line + tradeoff]

## Colors

[Why these seeds. Generated with `palette.mjs --primary … --contrast …`; paste the
check summary. Note any WARN accepted and why the brief wants it.]

- Ground and ink: [ … ]
- Primary: [job: the main action, current selection, focus]
- Secondary / accent: [its second job]
- Status: [fixed semantic colours, not the accent]
- Charts: `--chart-1…5` (CVD-checked)

## Typography

[Classification and period, from the reference. Why not the default face. Scale steps
in use. Tabular figures where.]

## Layout

[Grid, widths by section role, density, alignment. Operate: the shell, the work areas,
what each is for.]

## Elevation & Depth

[Border or shadow, per surface role. What floats.]

## Shapes

[Radius by role, and why this stance fits the formality axis.]

## Motion

[What moves, why, how long; the reduced-motion path.]

## Components

[shadcn base/style chosen and why; variants added; control height; icon set.]

## Do's and Don'ts

- Do: [rule the reference implies]
- Don't: [rule the reference implies]

## Lint allowances

| Rule | Where | Reason (from the brief) |
|---|---|---|
| | | |
