# Direction: from brief, mood or vibe to tokens

Mood words are inputs to *choosing a reference*, not to choosing colours. "Modern,
clean, trustworthy, premium" describes a region; a model produces its centre. "A 1970s
graduate lecture handout" describes a point and brings its own constraints. (Google
DESIGN.md philosophy.)

## 1. Translate mood words into axes

Each word moves levers. These are heuristics consistent with colour-emotion research
(lightness and chroma carry most of the signal; hue associations are weak and
context-bound), not a lookup table.

| Axis | Low end | High end | Levers |
|---|---|---|---|
| Energy | calm, quiet, restful | energetic, urgent, playful | accent chroma (≈0.05 → 0.25), number of saturated fields, motion stiffness, weight contrast |
| Weight | airy, light, delicate | heavy, solid, industrial | ground lightness, ink weight, type weight/width, border thickness |
| Temperature | cool, clinical, technical | warm, homely, crafted | neutral hue bias at chroma ≤ 0.02, accent temperature |
| Formality | casual, friendly | formal, institutional, precise | radius ladder (16px+ → 0–4px), type classification, casing, copy register |
| Density | spacious, editorial | dense, data-first | spacing base, size steps, row heights, panel count |
| Era / material | contemporary | period, print, analogue | type classification and period; texture only if the material is real to the subject |
| Contrast | soft, muted | stark, graphic | tone gap beyond the AA floor; `palette.mjs --contrast 0 / 0.5 / 1` |

Hue comes **last**, from the subject's real objects (its paint, material, place, the
brand's mark). People like colours of objects they like, so a hue taken from the
subject's world is a better bet than a mood-to-hue table.

## 2. Three reference sentences

Each from a different inventory item:

> On this [page/screen], **[something that belongs to the subject]** becomes **[the device]**.

Places to look: its output (put the real output on the page), its object or shape, its
name, its place (one view), its ritual (a sequence), its artefact (the ticket, menu,
label, timetable that already exists), its opposite (which other category owns the
feeling it lacks).

**Competitor test**: substitute the nearest competitor. If the sentence still works,
discard it.

**Stock-reference test**: references converge too. In Impeccable's 128 hand-written
palette moods, 25% say "considered", 10% "terracotta", 9% "apothecary". If your
reference could be a scented-candle brand (apothecary, linen, brass, Milanese bar,
foundry specimen, warm xerox stock), it is a stock reference unless the subject is
literally that.

## 3. Make the options diverge

| Axis | Options must differ on at least two |
|---|---|
| Ground | light neutral · dark neutral · a saturated field |
| Type classification | grotesk · humanist · geometric · serif · slab · mono · display |
| Accent hue | ≥ 60° apart |
| Radius stance | square (0–4px) · soft (6–12px) · round (16px+/pill) |
| Density | spacious · balanced · dense |

Then check each against the registry's wave-3 clusters (cream + serif + terracotta;
near-black + acid; indigo/violet; Geist/Inter on #f8f8f8 with white 12px cards).

## 4. Choose and record

- Person present, axis genuinely open: show three low-fi option cards, each with an
  honest motivation **and its main tradeoff** ("a set where only your favourite gets a
  case made for it is a rigged vote"). Once chosen, don't re-ask.
- No person, or the brief names a concrete deliverable: choose, build, state the
  assumption in one line, keep the alternates in DESIGN.md.

## 5. Derive tokens

1. Seeds: one or two colours sampled from the subject (`--primary`, optional
   `--secondary` for a second job, at least 20° of hue away or clearly different in
   lightness).
2. `palette.mjs --primary … [--secondary …] --contrast <from the contrast axis>`.
3. Type by classification and period from the reference; check it isn't on the
   registry's overused list for this mode; confirm it loads.
4. Radius ladder from formality; spacing base from density; motion from energy
   (Operate: 150–250 ms; springs at damping ≈ 0.9 for position, 1.0 for colour and
   opacity; one reduced-motion path).
5. Write the reference sentence into DESIGN.md `## Overview`. The prose carries the
   design; the tokens serve it.

## Worked example (abridged)

*"Tides and water temperature for sea swimmers. Calm, trustworthy, a bit of personality."*

- Mode: Operate (daily phone use, outdoors, bright light).
- Region answer to avoid: teal gradient, Inter, rounded white cards, a wave
  illustration, "Dive in 🌊".
- Inventory: printed harbour tide tables, the bay's colour at 7am, red/yellow lifeguard
  flags, water temperature to one decimal, the swim club's 6:30 meet, "slack water".
- Chosen reference: "The harbour tide table becomes the screen": the table's column
  rhythm sets the layout, tabular figures are the hero, one ink colour; the flags are
  the only status colours.
- Axes: energy low (accent C ≈ 0.08), contrast high (glare: `--contrast 0.5`),
  formality medium (4–6px radius), density medium-high.
- Signature move: the slack-water window drawn as a band across the tide curve.
- Fixture: `ux-design/fixtures/clean/`.
