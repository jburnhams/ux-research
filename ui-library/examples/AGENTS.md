# AGENTS.md (example project)

> SAMPLE: a product's agent rules file. The block between the markers is copied from
> `ui-library/agents.md` and belongs to Strata; anything outside it belongs to the project.

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
6. One filled (`variant="default"`) button per view.
7. Numbers and dates go through `lib/format.ts`.
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

## This project

- The kiln room is an Operate surface used on a wall tablet as much as on phones:
  check every change at 390px and with `pointer: coarse` (44px controls).
- Kiln facts (shelf gaps, cone temperatures, safe-to-open threshold) live in
  `screens/sample-data.ts` until the controller API exists; do not hard-code them in
  components.
