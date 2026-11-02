# Agents: working inside a Plinth project, and maintaining Plinth

Most code built on this library will be written by coding agents. Drift (pages of one
product with different fonts, palettes and radii) is a failure the research
attributes to agents working without constraints
([`../web-articles/`](../web-articles), Superdesign and OverlayQA), and BoardUI's
answer is to put the design system's rules where the agent reads them
([`../boardui/`](../boardui)). Plinth does the same, and backs each rule with a check.

## 1. The rules block

`plinth init` writes this block into the project's `AGENTS.md` (or `CLAUDE.md`)
between markers, and `plinth update` keeps it in sync. The example's copy is
[`examples/AGENTS.md`](./examples/AGENTS.md).

```markdown
<!-- plinth:rules:start -->
## UI: Plinth

This project's UI is built on Plinth components in `components/ui/`. Its look is set
by `app/theme.generated.css` (generated), `app/globals.css` (tokens) and `DESIGN.md`
(the reasons). Read DESIGN.md before changing anything visual.

1. Use an existing component before writing markup. Missing one? Install it from the
   registry (`npx shadcn add @plinth/<name>`) rather than writing a lookalike.
2. `className` at call sites is for layout only: grid, flex, gap, width, span, order,
   margin, breakpoints. No colour, type size, radius or shadow classes there; those
   come from component variants. Stock classes like `bg-white`, `text-sm`,
   `rounded-lg` and `shadow-md` do not exist in this project.
3. Never edit `app/theme.generated.css`. To change colour, change the seeds in
   DESIGN.md and regenerate with `palette.mjs`.
4. New visual recipe? Add a named `cva` variant to the component, with a comment saying
   why, and add it to the state-matrix page.
5. Every view of remote data goes through `DataView` with a skeleton and an empty
   state. Every status is a `Status` with a word. Every icon-only button is an
   `IconButton` with a label. The type checker enforces these; do not cast around it.
6. One filled (`variant="default"`) button per view.
7. Numbers and dates go through `lib/format.ts`.
8. Sample data is labelled as sample, believable, and its totals add up. Missing facts
   are visible placeholders like `[PRICE]`, never invented.
9. Before you finish: `npm run check` (types, CSS, slop-lint) and `npm run render`
   (console errors, overflow, fonts). Fix every quality finding; a slop finding is
   either fixed or allowed in `.sloplintrc.json` with the brief's reason.
<!-- plinth:rules:end -->
```

Each rule maps to a check:

| Rule | Check |
|---|---|
| 1 Components first | Review; the state-matrix page's coverage check lists installed components missing from it |
| 2 Layout-only `className` | The namespace reset (stock classes produce no CSS); `slop-lint` `token-bypass` for raw palette names |
| 3 Generated theme | Header comment in the file; `palette.mjs` regenerates it byte for byte from the seeds |
| 4 Variants with reasons | Review |
| 5 States in the types | `tsc` |
| 6 One filled button | Review on the render (a lint rule could count `variant="default"` per file; not yet written) |
| 7 Formatting | Review |
| 8 Sample data | `slop-lint` `placeholder-identity`, `vanity-stat` |
| 9 Checks | `npm run check`, `npm run render` |

## 2. The order of work for a new screen

Condensed from the `ux-design` skill, for a project where the theme already exists:

1. Read DESIGN.md: mode, subject, reference sentence, signature move.
2. Write the screen's one question and finding in a comment at the top of the file
   (the example's screens do).
3. List blocks as answers to the next questions; delete any that answer none.
4. Compose from `components/ui/*` with real-shaped sample data from a `sample-data.ts`.
5. `npm run check`, then `npm run render`, then look once at desktop and phone, light
   and dark. One pass of fixes; the second pass may only refine or remove.
6. Report in one or two sentences; record any deviation in DESIGN.md.

For a new product, run the `ux-design` skill first (subject inventory, three reference
sentences, seeds), then `plinth init` with the seeds.

## 3. Maintaining the library

- **Every component file opens with its reasons.** A change that contradicts a reason
  updates the reason, citing what changed.
- **The state-matrix page is the contract.** A new component or variant is not done
  until it appears there in every state, light and dark.
- **Quarterly review against the tell registry**
  (`../ux-design/skill/references/tells.md`). If a Plinth default has become a tell
  (the way purple, then cream and terracotta, then emerald did), change the default
  and say so in the changelog. The library's own defaults are the most likely place for
  the next wave to start, because they are copied most.
- **No theme gallery.** Requests for "a few nice preset themes" are answered with the
  direction procedure, for the reason in [`README.md`](./README.md) §3.
- **Evaluate before growing.** New components are added when a product needs them and
  the generated version gets them wrong, not to complete a catalogue.
