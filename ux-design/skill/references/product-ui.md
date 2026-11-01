# Operate surfaces: app screens, dashboards, tables, forms, settings

The failure on a working screen isn't flatness, it's **strangeness without purpose**:
over-decorated buttons, display fonts in labels, invented affordances, motion on load.
The test: can a user fluent in this category trust the screen immediately, or do they
pause at every subtly-off component?

## Relaxed here (with limits)

- One well-tuned sans for everything; system or familiar faces are fine if the scale,
  weights and tabular figures are tuned.
- 1px borders at about 1.1–1.3:1 against the ground; controls one step stronger. A border
  or a shadow per surface, not both; shadows on what floats (menus, popovers, dialogs).
- Small labels above values: 12–14px, sentence case, 4.5:1. At most one tracked uppercase
  label on a screen.
- Rows of identical peer cards: 3–6, equal widths, aligned, no icon on top.
- Standard navigation: top bar + side nav, breadcrumbs, tabs, a command palette.

## Still wrong

Gradients on grounds, buttons, cards and KPI tiles · glows, glass · icons in tinted
squares on KPIs and cards · sparklines on every KPI · rainbow charts · emoji in
greetings, nav or empty states · Acme / John Doe / round vanity totals / totals that
don't add up · a coloured or navy sidebar on a light screen · the accent on every
button, tab and link · uppercase tracked table headers, zebra rows · left-aligned or
proportional numbers · a landing-page title (>32px) or figures at 48px+ · modals as the
first idea · orchestrated page-load sequences · reinvented standard controls.

## Shape of a screen

1. **Title row**: a noun title (~24px/600), the scope (date range, filters) and the main
   job's primary control.
2. **The finding**: the line under the title, or the subline of the headline figure,
   next to the action it drives.
3. **Blocks in answer order**: each block answers the next question; size the headline
   block to the question (≈200–360px tall); cap lists at 4–6 rows with "View all";
   time-sensitive blocks before long tables.
4. **Everything the brief names is on the first screen** at 1440×900.

## Figures, tables, charts

- `tabular-nums`, right-aligned numbers, fixed decimals, units in muted ink, `Intl.NumberFormat`.
- Deltas in words with their window ("+4 since Monday"); grey for zero; no colour on
  undefined change.
- Tables: 12px muted sentence-case headers, row rules (no zebra), one status mark, one
  action where needed, sortable headers that look sortable.
- Charts: one question per chart; one hue plus neutrals; 2px line, no fill or markers by
  default; 3–5 faint gridlines; no legend for one series; bars start at zero; values
  available without hover; categorical palettes from `palette.mjs` (`--chart-1…5`, CVD-checked).
- Status: pale tint with dark text of the same hue, plus an icon or word, never colour
  alone.

## States (design all of them)

Controls: default · hover · focus-visible · active · disabled · loading · error.
Data views: loading (skeleton mirroring the final layout) · empty (what goes here and the
action to add it) · zero (the zero line and a sentence) · sparse · dense · very long
strings (`min-w-0`, `truncate`, `line-clamp`) · error with recovery.
Forms: inline errors next to fields; focus the first error on submit; submit enabled
until the request starts, then a spinner with the label kept; never block paste;
`autocomplete`, `name`, `type`, `inputmode`; warn on unsaved changes.
Destructive actions: confirm, or an undo window.
Navigation: filters, tabs, pagination and open panels in the URL.

## Motion

150–250 ms, state changes only (open, close, confirm, reorder). No page-load choreography.
Springs for position near critical damping; colour and opacity without overshoot.
`MotionConfig reducedMotion="user"` or a `prefers-reduced-motion` path.

## Build path

Build Operate screens directly in code with real primitives and real-shaped sample data.
Don't generate a picture of the app first: image comps of working screens score worse
and are less complete than code-led builds (Impeccable's evals).
