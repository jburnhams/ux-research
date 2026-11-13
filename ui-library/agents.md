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

## 4. Interfaces an agent can operate

Sections 1 to 3 are about agents that *build* with Strata. This one is about agents (and
tests) that *operate* the finished screen: a person's assistant filling a form, a browser
agent clearing a queue, a Playwright test. Vercel Labs' UI SDK (beta, read 2026-11-13,
[`../ui-sdk/`](../ui-sdk)) is the one source here that treats this as a design problem. It
does it with a bridge (`createAgent`: `snapshot()` lists named controls with their state
and actions, `act()` runs steps, WebMCP exposes them as tools). Strata adopts none of that
machinery, and React Aria stays the primitives layer; what transfers is a short list of
rules that make a screen operable by anything that reads names and roles.

1. **A control's accessible name is how it is found, so it must be unique where it sits.**
   The SDK matches a label against every label that holds its words, so "Tip" collides
   with "Custom tip", and a "Water the plants" button collides with a "Done today: Water
   the plants" checkbox. This is the reason behind §1's `RowAction` rule: name each
   control in a row with a verb and the row's subject ("Open Water the plants",
   "Withdraw Tom Ellery"), never the bare title. A control that belongs to another (a
   password's Show toggle, a number field's step buttons) needs a name only within its
   component. The visible text and the accessible name should agree, because both people
   and agents search by what they can read.
2. **Mark what needs a person, at the element that does the harm.** The SDK has exactly
   three marks: *confirm* (a sentence saying what happens, "Deletes the project and all
   its data"), *secret* (a field an agent may fill and never read) and *hidden* (a region
   an agent never sees, such as recovery codes). The confirm goes on the button that
   confirms, not the trigger (opening a dialog is harmless) and not the dialog (that
   would gate Cancel). Give the confirming button text that is not part of the
   trigger's ("Delete forever" for a "Delete project" trigger), or a search by text finds
   the trigger. This agrees with the rule that only irreversible removals get a confirm
   dialog (strata-react `CLAUDE.md`, "Building an app on Strata" §4); a reversible one
   needs no mark because `UndoBar` is the safety. Strata has no such marks today; see
   "Not built" below.
3. **State changes go through the component's change callback, not through click or key
   handlers.** A check written in `onClick` or `onKeyDown` never sees a change made
   programmatically. The SDK reports `details.source` (`"keyboard"`, `"mouse"`,
   `"agent"`) and lets the callback refuse. Related: native constraints such as
   `minLength` only run while a person types, so a value set from code skips them;
   validate in the app (Strata's `useAsyncAction` `validate` and the server's 422 already
   are that place).
4. **What a popup shows comes from app state, not from the trigger's click.** An agent
   can open a popup without clicking its trigger. A popup with several triggers is told
   apart by its trigger's text ("Edit Beta"), so each trigger carries its row.
5. **Hand-rolled `role=` next to a shipped component is a bug.** The SDK's skill says a
   `div` with `role="listbox"`, `"menu"`, `"dialog"`, `"tablist"`, `"switch"`, `"slider"`
   or `"tree"` beside an installed package is almost always one. It is the same
   reasoning as "React Aria first".

### Checks worth borrowing for tests

The SDK ships `checkPattern` (roles, names, states, id references and the keyboard model of
a WAI-ARIA pattern in one error listing every problem), `checkServer` (output before
hydration) and `checkDirection` (right to left). Two of those have no counterpart in
Strata's tests: **render the screen on the server and check the markup**, and **run the
keyboard model in a right-to-left page**. Its `AGENTS.md` also says "tests that pass on a
broken page don't count": press Space on *every* switch placed, press Cancel as well as
the confirming button, submit each required field empty, assert each button's name in the
page's own markup, and assert that state attributes you did not set (`aria-disabled`) are
absent. That is a checklist for a screen's integration test, and nothing in it needs a
library.

### Assistive-technology facts from its `pitfalls.md`

Read from the SDK's own list of things that cost debugging time; each is a claim by one
maintainer team, not something we reproduced. Worth knowing before building a custom
combobox or list, and the first is the reason a React Aria part beats a hand-built one:

- iOS VoiceOver ignores `aria-activedescendant`, so a list moves real focus there.
- NVDA stops echoing typed characters once `aria-activedescendant` is set on a text field,
  so set it only after an arrow key.
- Safari does not focus a button on click and skips buttons on Tab by default, so "return
  focus to the trigger" must also handle focus left on the body.
- Anything platform-specific in output (shortcut glyphs, `aria-keyshortcuts`) must start
  neutral and update after hydration, or a Mac gets a hydration mismatch. Not
  checked in strata-react: `src/components/key-glyphs.tsx` is where to look.
- A wrapper element between menu items needs `role="none"` and `display: contents`, or
  position-in-set is wrong for screen readers.
- Opening a modal before the page hydrates makes not-yet-hydrated markup inert.

### Not built, and what was looked for

- **A bridge like `createAgent`** is not proposed. It duplicates what the accessibility
  tree and Playwright's role queries already give an agent, adds a runtime API to every
  component, and needs its own primitives layer. Revisit if a product wants WebMCP tools
  (a proposed web API for a page to offer tools to an agent; the SDK implements it, we did not check its status): the first step would be
  an app-level `Shortcut[]`-style list of named actions, not a new component layer.
- **Confirm, secret and hidden marks** would be attributes (`data-agent-confirm` and so
  on) read by whatever drives the page. Nothing in Strata reads them. If one is added it
  is a decision for strata-react, not this document.
- **A "unique name within a row" test helper** for `renderWithStrata` is the one cheap
  addition: it needs no dependency, reads the accessibility tree, and catches rule 1.
  Proposed in the strata-react entry of the changelog, not built.
- Not found in the SDK: any visual, colour, typography or content guidance. It leaves the
  look entirely to the app, as Strata does, so it gives nothing to the slop research.
