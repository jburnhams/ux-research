# ui-library: a React + Tailwind component library that ships no look

A concrete design, not a published package, for a component library built from the
research in this repo. It plays the same role for UI that `prompts/agent-design/`
(Forge) plays for agents: the patterns catalogued elsewhere here, turned into decisions
that could be implemented directly, with a worked example that compiles, renders and
passes the repo's own linter.

Placeholder name used throughout: **Plinth** (the base a piece stands on; the product
is the piece). Swap it freely; nothing depends on the name.

| Doc | What it specifies |
|---|---|
| [`README.md`](./README.md) (this file) | The brief, the stance, every decision with where it came from, the architecture, what is deliberately not shipped, how it is enforced, known limits |
| [`tokens.md`](./tokens.md) | The token contract: colour roles and ramps, status, surfaces, type steps, radius, elevation, motion, density, contrast, dark mode, and the namespace reset |
| [`components.md`](./components.md) | The inventory, the API conventions, and a spec for each component: job, props, states, accessibility, and what generated versions get wrong |
| [`patterns.md`](./patterns.md) | How components compose into screens: the Operate screen shape, figures, tables, charts, forms, destructive actions, async feedback; what Read and Persuade surfaces get |
| [`agents.md`](./agents.md) | How a coding agent works inside a Plinth project: the rules file, the order of work, the checks, and how the library is maintained |
| [`examples/`](./examples) | One fictional product end to end: a generated theme, ten components, a dashboard, a form and a state-matrix page, with screenshots |

The docs and the live example are also published as a site (GitHub Pages, built by
`.github/workflows/pages.yml`), styled with the example's own theme.

## 1. Starting brief

As given: use the research to design a React and Tailwind UX library, in the way
`prompts` turned its research into a deliverable, and write it up complete with
examples. Read with the rest of this repo, that means:

- React 19, Tailwind v4, shadcn/ui conventions, Radix primitives underneath.
- Mostly built and extended by coding agents, so the library has to be legible to
  them and hard for them to misuse.
- Good UX first; specifically, products built on it should not read as AI-made, and
  should not converge on each other.
- Covers app screens properly (most of the work), and gives landing pages what they
  need without shipping their clichés.

## 2. The stance in one paragraph

The most consistent finding in this repo is that **slop is mostly the stack as
installed** ([`../ux-slop-taxonomy.md`](../ux-slop-taxonomy.md) §1): Tailwind's
indigo, shadcn's untouched zinc theme and radius, Geist, Lucide icons in tinted
squares, a fade-up on every section. A component library is a machine for making
defaults, so a library with a look reproduces that look in every product built on it,
and that is how the median forms. Plinth therefore ships **structure, behaviour,
states, accessibility and a token contract, and no aesthetic**. It will not compile
a page until a product has generated its own theme from its own subject, it removes
Tailwind's stock palette so the median colours cannot be typed, and it makes the
states generated UI skips (loading, empty, error, pending, done) part of each
component's type signature. Everything that varies between products lives in two CSS
files and a DESIGN.md; everything that should not vary (focus, labelling, number
formatting, how a status reads, how a table aligns) lives in the components, where an
agent cannot forget it.

## 3. Decisions and where they came from

| # | Decision | Taken from | Instead of |
|---|---|---|---|
| 1 | **No default theme.** A project starts by generating one from seeds chosen from its subject (`palette.mjs`); the unthemed state is an error, not a look | Taxonomy §1 ("the stack's defaults are the corpus median"); `slop-lint` `untouched-shadcn`; shadcn skill "don't accept the CLI default by inertia" | Shipping a neutral theme that every product keeps (shadcn zinc, MUI blue) |
| 2 | **Reset Tailwind's stock namespaces** (`--color-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--font-*`), so `bg-indigo-500`, `text-sm`, `rounded-xl` and `shadow-lg` do not exist | BoardUI's ban on raw palette classes; `ux-react-tailwind.md` §2 (raw palette at a call site is both a tell and a token bypass); verified in the example's compiled CSS | A lint rule alone, which reports drift after it is written |
| 3 | **shadcn-compatible copy-in registry, not an npm package.** The app owns the source; variant names and CSS variable names stay shadcn's | shadcn's model; agents already know its names; `ux-react-tailwind.md` §1 layers | A packaged design system whose look is fixed behind props (MUI, Chakra) or whose names agents have to learn |
| 4 | **Customise at the token and variant layers; `className` at call sites is for layout** | shadcn skill ("`className` for layout, not styling"); Same.dev's hand-edits as the anti-example | Per-call-site colour and type classes, which drift |
| 5 | **States are part of the type signature**: `DataView` requires `skeleton` and `empty`; `AsyncButton` takes a `phase`; `Status` requires a word; `IconButton` requires a `label` | notboring ("build every state its object can really be in"); `ux-product-ui.md` §5; avoid-ai-design K7 (missing states); Vercel WIG | States as review comments and checklist items |
| 6 | **Operate first.** Components are tuned for app screens: fixed rem type scale, tabular figures, restrained accent, standard controls | `ux-product-ui.md` §1 (most React work is apps; landing-page rules misfire there); Impeccable modes | A marketing-first kit with an app section bolted on |
| 7 | **No marketing blocks.** No hero, feature grid, logo cloud, testimonial, pricing table, stats band, marquee or animated-number component | The stock section waterfall and three-tier pricing in the tell registry; shadcn's own blocks shipping "Acme Inc" and `Sparkles` (`ux-design/README.md` §3) | Blocks that make every landing page the same page |
| 8 | **Semantic status roles, separate from the accent**: pale tint plus dark ink of one hue, ink ≥ 6:1, always with a word | taste-skill's 23 real screens (pale tints, dark text); artifact-design ("semantic colour is separate from the accent hue"); WCAG 1.4.1 | Saturated chips with white text; the brand colour meaning "good" |
| 9 | **The accent is asked for, not defaulted**: a bare `<Button>` is the outline variant | taste-skill: no filled primary on 12 of 23 real app screens; "the accent on every button" tell | shadcn's filled `default` as the default |
| 10 | **Type steps as `@utility type-*`**, with `cn()` taught to treat them as font sizes | shadcn's `design-system.md` (unknown `text-*` classes are read as colours by `cn()`); BoardUI's composite type utilities | `--text-*` keys and stacked `text-sm font-medium leading-5` |
| 11 | **Radius, elevation and motion by role**: a radius ladder with optical nesting; border *or* shadow per surface; effects never overshoot, spatial at Standard damping | Material 3 shape guidance and motion schemes (`ux-material-3.md`); the "one radius and one soft shadow on everything" tell | One `--radius` and one `shadow-md` everywhere; `animate-bounce` |
| 12 | **Motion conveys state and nothing else on Operate**: 150–250 ms, no page-load choreography, one reduced-motion path in the theme | Impeccable `operate.md`; `ux-product-ui.md` §1; Vercel WIG | `whileInView` fade-ups copied onto every section |
| 13 | **Charts: one series, one hue, direct labels, values without hover** | taste-skill (2px line, no fill on 7 of 10); Claude `dataviz`; artifact-design ("every label names a value the chart reaches") | A chart kit whose defaults are gradient areas, a dot per point and a rainbow legend |
| 14 | **Undo before confirm** for reversible removals; confirm dialogs only for what cannot be undone | `ux-product-ui.md` §5 ("confirm or undo window, never immediate"); Vercel WIG | A modal on every delete |
| 15 | **Agent-facing rules ship with the library** (an `AGENTS.md` block, a lint config, a design-system page) and **comments carry the reasons** | BoardUI's `AGENTS.md`; notboring ("keep the comments, they say why the numbers are what they are"); shadcn's design-system page and coverage check | Rules that live only in a human style guide |
| 16 | **Checked mechanically, then looked at once**: typecheck, `slop-lint`, palette gates, a render script that fails on console errors, overflow, scroll position and unloaded fonts | `ux-design` skill step 6; `ux-design/skill/references/audit.md` "Robust" | Judging by eye in an unbounded loop |

Not adopted, and why:

- **A curated set of house themes** to pick from. It would be the fastest start and
  the fastest route back to the median: every published "use this instead" list in
  the research became the next wave of tells (`../ux-slop-taxonomy.md` §2). Themes
  come from the procedure in `../ux-design/skill/references/direction.md`, not from a
  menu.
- **A custom select, combobox and date picker as the defaults.** Native controls are
  the default for short lists on touch screens (platform picker, typeahead, autofill
  for free); Radix-based versions are added when a product needs search or rich
  options.
- **Expressive (bouncy) motion tokens.** Material recommends them by default; this
  repo's resolution keeps Standard-like damping for Operate surfaces
  (`../ux-material-3.md` §1). A product may add an Expressive spring for one hero
  moment on a Persuade page, recorded in DESIGN.md.
- **A Figma library first.** Impeccable's evals found image comps of working screens
  scored worse and were less complete than code-led builds
  (`../ux-product-ui.md` §7); the state-matrix page is the visual reference.

## 4. Architecture

```
  DESIGN.md                    why: subject, mode, reference sentence, seeds, every deviation
      │
  app/theme.generated.css      palette.mjs output: shadcn roles + 12-step ramps, light and dark   (regenerated, never edited)
  app/globals.css              namespace reset · status · surfaces · type · radius · elevation · motion · density · contrast · base
      │
  components/ui/*              Plinth components: cva variants over tokens; states in the types; comments carry reasons
      │
  feature components           composition: which components, in what order, answering which question
      │
  pages                        className for layout only: grid, gap, span, order, breakpoints
```

| Layer | Owner | May contain | Must not contain |
|---|---|---|---|
| DESIGN.md | the product | the subject, mode, reference, seeds, reasons, lint allowances | values without reasons |
| `theme.generated.css` | `palette.mjs` | colour roles, ramps, chart colours | hand edits |
| `globals.css` | the product, through the library's template | every non-colour token, status roles, the base layer | component-specific rules |
| `components/ui/*` | the library | variants built from tokens; layout of the component's own parts | raw colours, arbitrary values, `dark:` colour overrides |
| feature components and pages | the product | composition and layout classes | colour, type size, radius or shadow classes not provided by a variant |

**Distribution.** A registry in shadcn's format (`registry.json` plus one item per
component), installed with the shadcn CLI or an MCP server, so the code lands in the
app and the app owns it. The registry ships `globals.css` as a template with the
non-colour tokens filled in and the colour import pointing at a file that does not yet
exist; `plinth init` runs `palette.mjs` with the seeds it asks for and writes it.
Until then the build fails on the missing import, which is the point.

**Dependencies.** React 19, Tailwind v4, `class-variance-authority`, `clsx`,
`tailwind-merge`, `@radix-ui/*` for overlays and composite widgets, and an icon set
chosen per product (Lucide in the example; `components.json` `iconLibrary` decides).
No animation library is required: CSS transitions cover state changes, and Motion is
optional for spring-driven layout changes.

## 5. Inventory at a glance

Full specs in [`components.md`](./components.md).

| Group | Components | In the example |
|---|---|---|
| Actions | Button, IconButton, AsyncButton, `useAsyncAction` | all |
| Form | Field, Input, Textarea, NativeSelect, ChoiceGroup, Checkbox, Switch, ToggleGroup | Field, Input, Textarea, NativeSelect, ChoiceGroup |
| Status and figures | Status, Metric, MetricStrip | all |
| Data | DataView (+ `Load<T>`), DataTable, TableSkeleton, EmptyState, Skeleton, LineChart, BarChart | all but BarChart |
| Page | PageHeader, AppShell (side nav, breadcrumb), Tabs, CommandMenu | PageHeader |
| Overlays | Dialog, AlertDialog, Sheet, Popover, Menu, Tooltip (Radix, always titled) | none |
| Feedback | UndoBar + `useUndoable`, Toast (polite live region), Alert | UndoBar |
| Read surfaces | Prose (measure, rhythm), TableOfContents, Callout | none |

Twenty-three components are specified; ten are implemented in the example, chosen
because they are the ones generated UI gets most wrong. The rest are thin restyles of
shadcn/Radix components and follow the same conventions.

## 6. How it is enforced

| Mechanism | Catches | Where |
|---|---|---|
| Namespace reset in `globals.css` | raw palette colours, stock sizes, radii, shadows: they do not compile | [`examples/app/globals.css`](./examples/app/globals.css) |
| TypeScript | unlabelled icon buttons, data views without empty or loading states, statuses without words, async buttons without a finished label | the component types; demonstrated with a negative check in [`examples/README.md`](./examples/README.md) |
| `palette.mjs` gates | text contrast, chart separation under colour-vision deficiency, known tell clusters | `../ux-design/skill/scripts/palette.mjs` |
| `slop-lint --mode operate` | the source-visible tells and quality defects (46 rules) | `../ux-design/skill/scripts/slop-lint.mjs`; the example is linted by `node --test ux-design/tests/*.test.mjs` |
| Render script | console errors, horizontal overflow at 390px, loading scrolled, fonts not loading, blank pages | [`examples/scripts/render.mjs`](./examples/scripts/render.mjs) |
| The state-matrix page | anything a reviewer has to see: every component in every state, light and dark | [`examples/screens/system.tsx`](./examples/screens/system.tsx) |
| A person | whether the screen answers its question, whether the theme belongs to the subject | DESIGN.md review |

The render script earned its place while building the example: it caught a 34px
horizontal overflow on the phone layout, caused by a screen-reader-only table inside
the chart (a `<table>` ignores `width: 1px`), which no source check would have found.

## 7. Known limits

- **Designed, not published.** The registry format, `plinth init` and the MCP server
  are specified here and not built. The ten example components are real code; the
  other thirteen are specs.
- **Status roles are hand-solved.** `palette.mjs` does not generate them; the example's
  values were solved in OKLCH for ≥ 6:1 ink on tint and on the ground with the repo's
  colour library (`../ux-design/skill/scripts/lib/color.mjs`). Adding a `--status`
  option to `palette.mjs` is the obvious next step.
- **`palette.mjs --contrast 1` lowers the dark theme's foreground slightly** (L 96.5%
  to 95.0%) while raising muted text; the example takes only the roles that improve.
  Worth checking in the generator.
- **The namespace reset is strict.** Copying a stock shadcn component in brings
  `text-sm`, `rounded-md` and `shadow-xs`, which silently produce no CSS until the
  component is converted to `type-*` and role radii. The registry should ship
  converted components only, and the lint should flag stock size classes in a Plinth
  project (not yet a rule).
- **Persuade and Read coverage is thin by design**, and the stance (no blocks) has not
  been tested against a team that has to ship a landing page this week.
- **No evaluation yet.** The evaluation plan in `../ux-design/README.md` §6 applies,
  with one more arm: the same briefs built on stock shadcn against Plinth, measuring
  divergence between products as well as tells within them.
