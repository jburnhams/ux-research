# Agents: working inside a Strata project, and maintaining strata-react

Most code built on this library will be written by coding agents. Drift (pages of one
product with different fonts, palettes and radii) is a failure the research
attributes to agents working without constraints
([`../web-articles/`](../web-articles), Superdesign and OverlayQA), and BoardUI's
answer is to put the design system's rules where the agent reads them
([`../boardui/`](../boardui)). Strata does the same, and backs each rule with a check.

## 1. The rules block

A product built on strata-react copies this block into its `AGENTS.md` (or `CLAUDE.md`)
between the markers, so a later version can replace it without touching the rest. (An
`init` command that writes it is specified, not built.) The example's copy is
[`examples/AGENTS.md`](./examples/AGENTS.md).

```markdown
<!-- strata:rules:start -->
## UI: Strata

This project's UI is built on Strata components, imported from `strata-react`. Its look is set
by `app/theme.generated.css` (generated), `app/globals.css` (tokens) and `DESIGN.md`
(the reasons). Read DESIGN.md before changing anything visual.

1. Use a strata-react component before writing markup (the API reference lists them).
   Missing one? Add it to strata-react, with its stories and tests, rather than writing
   a lookalike in the product.
2. `className` at call sites is for layout only: grid, flex, gap, width, span, order,
   margin, breakpoints. No colour, type size, radius or shadow classes there; those
   come from component variants. Stock classes like `bg-white`, `text-sm`,
   `rounded-lg` and `shadow-md` do not exist in this project.
3. Never edit `app/theme.generated.css`. To change colour, change the seeds in
   DESIGN.md and regenerate with `palette.mjs`.
4. New visual recipe? Add a named `cva` variant to the component in strata-react, with a
   comment saying why and a story for it.
5. Every view of remote data goes through `DataView` with a skeleton and an empty
   state. Every status is a `Status` with a word. Every icon-only button is an
   `IconButton` with a label. The type checker enforces these; do not cast around it.
6. One filled (`variant="default"`) button per view at a time. While rows are chosen,
   the `BulkBar` action is the filled one and the screen's own primary goes to `outline`.
7. Numbers and dates go through strata-react's `format` (`createFormat(locale)`): a log or
   history row is `format.dateTime(row.at)`, a record's date `format.date(...)`, each taking the
   API's ISO string as it is. Never build an `Intl.DateTimeFormat` in a screen.
8. Sample data is labelled as sample, believable, and its totals add up. Missing facts
   are visible placeholders like `[PRICE]`, never invented.
9. Character goes where DESIGN.md's Character section says, and nowhere else: subject
   words in labels, empties and errors; no jokes on errors; motion only by the
   frequency table in Strata's `character.md`; a rare, earned completion uses `Done`.
   No confetti, stock illustrations, "Oops"-style copy, emoji or sound without an off
   switch (slop-lint checks these).
10. Before you finish: `npm run check` (types, CSS, slop-lint) and `npm run render`
   (console errors, overflow, fonts). Fix every quality finding; a slop finding is
   either fixed or allowed in `.sloplintrc.json` with the brief's reason.
<!-- strata:rules:end -->
```

Each rule maps to a check:

| Rule | Check |
|---|---|
| 1 Components first | Review; strata-react's Storybook has every component in every state |
| 2 Layout-only `className` | The namespace reset (stock classes produce no CSS); `slop-lint` `token-bypass` for raw palette names |
| 3 Generated theme | Header comment in the file; `palette.mjs` regenerates it byte for byte from the seeds |
| 4 Variants with reasons | Review; strata-react's visual baselines change only with a story |
| 5 States in the types | `tsc` |
| 6 One filled button | Review on the render (a lint rule could count `variant="default"` per file; not yet written) |
| 7 Formatting | Review |
| 8 Sample data | `slop-lint` `placeholder-identity`, `vanity-stat` |
| 9 Checks | `npm run check`, `npm run render` |

## 2. The order of work for a new screen

Condensed from the `ux-design` skill, for a project where the theme already exists:

1. Read DESIGN.md: mode, subject, reference sentence, signature move, character
   sentence and voice.
2. Write the screen's one question and finding in a comment at the top of the file
   (the example's screens do).
3. List blocks as answers to the next questions; delete any that answer none.
4. Compose from strata-react's components with real-shaped sample data from a `sample-data.ts`.
5. Find the flow's rare moment, if it has one (usually its end), and make it with
   `Done` from the subject; leave everything frequent plain.
6. `npm run check`, then `npm run render`, then look once at desktop and phone, light
   and dark. One pass of fixes; the second pass may only refine or remove.
7. Report in one or two sentences; record any deviation in DESIGN.md.

For a new product, run the `ux-design` skill first (subject inventory, three reference
sentences, seeds), then `palette.mjs` with the seeds, the four CSS imports from
[`README.md`](./README.md) §4, and this rules block.

## 3. Maintaining the library

- **Every component file opens with its reasons.** A change that contradicts a reason
  updates the reason, citing what changed.
- **The state-matrix page is the contract.** A new component or variant is not done
  until it appears there in every state, light and dark.
- **Quarterly review against the tell registry**
  (`../ux-design/skill/references/tells.md`). If a Strata default has become a tell
  (the way purple, then cream and terracotta, then emerald did), change the default
  and say so in the changelog. The library's own defaults are the most likely place for
  the next wave to start, because they are copied most.
- **No theme gallery.** Requests for "a few nice preset themes" are answered with the
  direction procedure, for the reason in [`README.md`](./README.md) §3.
- **Evaluate before growing.** New components are added when a product needs them and
  the generated version gets them wrong, not to complete a catalogue.
