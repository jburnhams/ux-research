---
name: ux-design
description: Design and build React + Tailwind (and shadcn/ui) interfaces that are specific to their subject instead of the generated median ("AI slop"). Use when creating or restyling a page, app screen, dashboard, form, component or design system; when choosing a palette, typeface, theme or motion; when turning a mood, keyword or vibe into a theme; when someone says a UI looks generic, templated or AI-made; or when it is correct but boring and needs personality or playfulness. Includes a source linter (slop-lint) and a contrast-solved palette generator (palette).
---

# UX design for React + Tailwind

A generated interface usually looks like the average of the corpus it was trained on,
and in this stack the average is the stack's own defaults: Tailwind's indigo, shadcn's
untouched zinc theme, Geist or Inter, Lucide icons in tinted squares, a fade-up on every
section. Nothing in it is wrong and nothing in it was decided. This skill replaces
defaults with decisions, in a fixed order, and checks the result mechanically where
that is possible.

**Precedence, always:** the user's own words, then the project's existing design system
(DESIGN.md, `globals.css` tokens, `components/ui/*`, CLAUDE.md), then your choices. If
the brief asks for one of the looks listed as tells, build it well; the brief wins.

## 1. Read the surface: mode and treatment

Decide this first, because the rest depends on it. The mode is set by the surface
being built, not by the product (a tool's landing page is Persuade; its settings page
is Operate).

| Mode | The visitor… | Ambition shows as | Examples |
|---|---|---|---|
| **Persuade** | decides and acts | a committed visual idea, one bold move | landing, marketing, pricing, launch |
| **Operate** | completes a task | precision, familiarity, density, state clarity | app screens, dashboards, tables, settings, editors, admin |
| **Read** | understands something | measure, hierarchy, navigation | docs, articles, changelogs, help |
| **Experience** | is inside the work | the work leads, the interface recedes | portfolio, gallery, showcase |

Treatment: most requests are **utilitarian** (polished hierarchy, considered spacing,
a real palette, no hero, no flourishes). Use an **editorial** treatment only for
Persuade or Experience surfaces someone will keep or share. If unsure: a
well-composed page is always acceptable; an over-designed one sometimes isn't.

Write the mode in DESIGN.md (`## Overview`) and in `.sloplintrc.json` (`"mode"`).

## 2. Ground it in the subject

1. State the subject, its audience, and the surface's single job, in one line each.
   If the request is vague, infer them and say so in one line.
2. **Inventory 8–12 facts only this product has**: its name and what it means, its
   place, its real numbers and units, the constraint it lives with, its materials,
   its rituals and hours, the printed things of its world (a ticket, a label, a
   timetable). Distinctive choices come from here, not from the category.
3. **Operate surfaces**: name the screen's **one question** ("Which deploy broke?")
   and **one finding** (the fact in today's data that most needs attention). The
   question decides what is biggest; the finding goes where it is read first, next
   to the action it drives. Delete any block that answers no question.
4. **Persuade surfaces**: write the page as claims, each with its proof, one line per
   section. The claims decide which sections exist and in what order. Delete any
   section with no claim. This replaces the stock order (hero, logos, three features,
   testimonials, pricing, CTA).
5. Use real content throughout. Missing facts (price, address) become visible
   placeholders like `[PRICE]`, never invented numbers. Sample data is believable,
   sums correctly, and is labelled as sample.

## 3. Choose a direction (before any JSX)

Read [`references/direction.md`](references/direction.md) for the full procedure,
including turning moods and vibes into tokens. In short:

1. Write **three reference sentences**, each from a different inventory item:
   "On this screen, *[something that belongs to the subject]* becomes *[the device]*."
   A reference describes a point; adjectives ("modern, clean, premium") describe a
   region, and models produce the centre of a region.
2. **Competitor test**: put the nearest competitor in each sentence. If it still
   works, the idea belongs to the category. Discard it.
3. Make the three directions differ on named axes (ground, type classification,
   accent hue ≥ 60° apart, radius stance). If two could be one designer's, redo one.
4. Choose. With a person present and the aesthetic genuinely open, show the three as
   low-fi options, each with its honest tradeoff, and let them pick. Without one,
   pick the direction whose reference most belongs to the subject, state the
   assumption in one line, and keep the others in DESIGN.md as alternates.
5. On **Operate**, the direction lends only type, palette, density and **one signature
   move** (for example a timetable's column rhythm, a transit-map status view). It never
   supplies the layout, the navigation model or the controls, which stay the standard
   ones the user already knows.

## 3b. Give it character

Removing tells leaves an empty page with good manners; character is what goes in
their place. Read [`references/character.md`](references/character.md). In short:

1. Write the **character sentence** and three or four **voice pairs** ("plain, not
   cute") in DESIGN.md, and add 3–5 **behaviours** of the subject to the inventory
   (what physically happens, sounds, rituals).
2. **Place it by frequency**: nothing on what is used 100+ times a day, a
   near-imperceptible response on what is used tens of times, the delight budget only
   on rare, earned moments (first use, a finished piece of work, recovery). On
   Operate surfaces most character is *at rest*: the subject's words in labels,
   empties and errors, and the signature (how the main data is drawn, coloured by a
   fact of the subject where there is one).
3. **Swap test** every touch: if a neighbouring product could ship it unchanged, it is
   stock whimsy (confetti, "Oops!", kit illustrations, emoji, bounce), which is the
   corpus median of "playful". Replace it with something from the subject or remove it.

## 4. Write the token contract

Tokens are the only channel for colour, type, radius, shadow and motion. Write them
once and every component inherits them.

1. Fill [`assets/DESIGN.template.md`](assets/DESIGN.template.md) as the project's
   `DESIGN.md`: Overview (mode, subject, the chosen reference sentence), then Colours,
   Typography, Layout, Elevation, Shapes, Motion, Components, Do's and Don'ts. Put
   the *reason* next to each value.
2. **Colour**: pick one or two seeds from the subject (its real objects, the brand's
   existing mark, a photo of its place), then generate and validate:
   ```bash
   node <skill>/scripts/palette.mjs --primary "#…" [--secondary "#…"] [--contrast 0|0.5|1] --out app/globals.css
   ```
   It solves 12-step OKLCH ramps against contrast targets (1–2 grounds, 3–5 component
   fills, 6–8 borders, 9–10 solids, 11–12 text) for light and dark, maps them onto
   shadcn roles, builds a CVD-safe chart palette, and fails on contrast or chart
   separation. It warns when the result sits on a known tell cluster. Fix FAILs; for
   WARNs, either change the seed or record in DESIGN.md why the brief wants it.
3. **Type**: choose by classification and period from the reference. Persuade: a
   display face used with restraint plus a body face, clearly distinct. Operate and
   Read: one well-tuned family is often right; set tabular figures for data. Keep a
   real scale (Operate ratio 1.125–1.2 in fixed rem; Persuade wider steps, display
   clamped). Body measure 60–75ch. Avoid reaching for the faces every generated page
   uses (see the registry); when you keep one, say why in DESIGN.md. Load the faces and
   confirm in the render that they actually load.
4. **Radius, shadow, motion** by role, not one value everywhere: a radius ladder pinned
   per component role; one elevation channel per surface (border *or* shadow; both only
   on genuinely floating layers); motion tokens (Operate 150–250 ms state transitions;
   springs near critical damping; reduced-motion path).
5. Map into Tailwind v4: roles in `:root` and `.dark`, registered in `@theme inline`;
   shadow scale in `@theme`; type steps as `@utility type-*` (not `--text-*`, which
   `cn()` mistakes for colours).

## 5. Build through the layers

```
DESIGN.md  →  globals.css tokens  →  components/ui/* cva variants  →  composition  →  className (layout only)
```

- **`className` at call sites is for layout** (grid, gap, span, order, responsive
  structure). Colour and type come from tokens and variants. No raw palette classes
  (`bg-indigo-500`), no arbitrary hex (`bg-[#…]`), no manual `dark:` colour overrides.
- **Restyle shadcn through its `cva` variants**, keeping the variant names. Change
  control heights together (button, input, select, toggle, tabs).
- **Compose existing primitives** before writing markup: `Empty` for empty states,
  `Skeleton` for loading, `Alert` for callouts, `Badge` for status, `ToggleGroup` for
  2–7 options, titled `Dialog`/`Sheet`/`Drawer`.
- **Cards by role.** Border, fill, radius and shadow each say "separate object". Use
  them on the element that needs it, never on every block; never nest cards.
- **Structure is information.** Numbering, eyebrows, dividers and labels must encode
  something true about the content (a real sequence, a real category).
- **Spend boldness in one place** (Persuade): one memorable element, everything around
  it quiet. On Operate, the signature move is the only flourish.
- **Complete at rest.** Everything meant to be read is visible on first paint; motion
  starts from a visible state. Apps open in a realistic working state, not an empty
  shell.
- **Copy is design material.** Name things the way users do; buttons say exactly what
  happens ("Save changes"), and the same verb carries through ("Publish", then
  "Published"); errors say what happened and how to fix it; sentence case; no
  benefit-speak, no "not just X, it's Y", no arrow glyphs stapled to labels, no emoji
  as icons.

Operate surfaces: also read [`references/product-ui.md`](references/product-ui.md)
(shell, KPIs, tables, charts, forms and the generated-dashboard tells).

## 6. Check: mechanical first, then one look

1. **Lint** (catches what is visible in source):
   ```bash
   node <skill>/scripts/slop-lint.mjs src app components --mode <persuade|operate>
   ```
   `slop` findings are defaults nobody chose (P0 a layperson notices, P1 a designer
   does, P2 craft). Fix them, or allow one in `.sloplintrc.json` with the brief's
   reason. `quality` findings are defects (focus, labels, `div onClick`, image
   dimensions, zoom, paste, reduced motion), and taste never overrides those. Five
   or more distinct slop rules means the page reads as a template: revisit step 3,
   not the individual lines.
2. **Audit the quality floor** with [`references/audit.md`](references/audit.md). It
   is kept out of steps 3–5 on purpose: reminders about accessibility during design
   push models toward safe, generic output, so the floor is enforced here instead.
3. **Look once** at the render, if the environment allows: desktop and ~390px phone,
   light and dark. Check the render-only things the linter can't see: is the
   one question/claim answered first, does one thing lead, does the type actually load,
   does anything overflow, is the hierarchy obvious at a squint, does text stay
   readable on its real background. Make **one** pass of fixes. The second pass may only
   refine or remove, never add new decoration. Then stop.
4. **Removal is not the fix.** A page with every tell stripped and nothing put in
   their place is an empty page with good manners, and blind judges prefer the richer
   page *with* tells. If the lint is clean and the page is thin, go back to the
   inventory and add substance (real content, the product's own data, committed type,
   a real picture), not ornament. If it is correct but dull, go back to step 3b.
5. **Character checks**, on the render: the swap test, the hundredth-time test (still
   welcome the hundredth time?), the bad-day test (still helpful to someone whose work
   just failed?) and the remove test (slower or less clear without it?).

## 7. Hand over

Report in one or two sentences what the direction is and why it fits the subject. Put
the detail in DESIGN.md, not in chat: the chosen reference and the alternates, each
token with its reason, every lint allowance with its reason, and every deliberate
deviation from the brief or the existing system.

## The registry

[`references/tells.md`](references/tells.md) is the dated list of current defaults
(colour, type, layout, components, motion, copy, dashboards), grouped by the wave they
belong to. It names **what to avoid, never what to use instead**: every published "use
this instead" list has become the next set of tells within months. Replacements are
procedures (steps 2–4), not products. Review the registry every quarter; the field
moves.
