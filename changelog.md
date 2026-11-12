# Changelog

All notable changes to this repository, grouped by day, newest first. Backfilled from
git history on 2026-11-02 and kept up to date with every change since (see
[`CLAUDE.md`](./CLAUDE.md)).

## 2026-11-12

**React Aria first: the rule for choosing a primitive** (branch `claude/aria-first-rule`). Jonathan asked for the rules to say: use a React Aria component, extend it if needed, make our own only if strictly needed. It follows from strata-react #73, whose first number field and slider were native on an unchecked belief that React Aria's number field clamps typed values (it has `commitBehavior="validate"`), and which was rebuilt on React Aria.

- `CLAUDE.md`: new section "Primitives: React Aria first".
- `ui-library/README.md`: the dependency paragraph states the rule and points to strata-react's `CLAUDE.md`, where the full wording is.

**React Aria replaces Radix in the component-library design; overlays built** (branch `claude/project-thread-3sxvh5`). Jonathan chose React Aria Components over Radix, Base UI and `cmdk` for strata-react (strata-react #83), and the first overlays were built on it (strata-react #85, issue #70). The design docs named Radix throughout, so this corrects them.

- `ui-library/components.md`: **correction**: the inventory, §3.10, §3.11 and §3.12 now say React Aria (they said Radix, `cmdk` and `Slot`). Checkbox, ChoiceGroup, Tabs and SelectableGrid are marked as built on React Aria in strata-react. §3.11 records what the overlay work settled: a non-closable dialog while work runs, an alert dialog that stays open with the reason when its confirm fails, a required popover label, a tooltip on hover and focus that `IconButton` uses, three stacking layers, and that overlay screenshots must include portalled content.
- `ui-library/README.md`: **correction**: the stack line, the custom-select note, the dependency list and the overlay row now say React Aria. The overlay row marks all but Menu as built.
- Not yet written back: rules for the new ground (workspace layout, drag and drop, timeline, undo history). Those follow with their components, since each rule should come from what was built.

**Dependencies need Jonathan's decision first** (branch `claude/project-thread-3sxvh5`). While planning the open strata-react issues, Jonathan asked that new dependencies be put to him before they are adopted, and that this be a firm rule.

- `CLAUDE.md`: **new** section "Dependencies: consult Jonathan first", covering adding, replacing, removing and pinning majors, and saying to spike on a scratch branch and present options.

## 2026-11-11

**Move the examples to TypeScript 7** (branch `claude/project-thread-d1q9sc`). Dependabot #20 (TypeScript 5.9 to 7.0) failed its typecheck, and Jonathan asked for the major bumps to be migrated. This branch replaces #20.

- `ui-library/examples/package.json`, `package-lock.json`: TypeScript 7.0. The examples use only `tsc`, so unlike strata-react (strata-react PR #67) they need no TypeScript 6 API package.
- `ui-library/examples/tsconfig.json`: dropped `baseUrl`, which TypeScript 7 removed. `paths` (`@/*`) already resolves from the tsconfig's own folder, and esbuild reads it the same way.
- `ui-library/examples/lib/css.d.ts` (**new**): declares `*.css` modules. TypeScript 7 checks side-effect imports by default, and `scripts/entry.tsx` imports the font stylesheets that way.
- `ui-library/examples/renders/`: re-rendered with `npm run render` (10 screenshots, no problems reported).

**Move the book-firing example to strata-react 0.1.6's `useAsyncAction`** (branch `claude/project-thread-d1q9sc`). Dependabot PR #28 (esbuild 0.28.2 and strata-react 0.1.6) failed its typecheck because `useAsyncAction` now returns an object (`phase`, `run`, `error`) instead of a `[phase, run]` pair. This branch carries that update plus the fix, and supersedes #28.

- `ui-library/examples/package.json`, `ui-library/examples/package-lock.json`: esbuild 0.28.2 and strata-react 0.1.6 (from Dependabot #28).
- `ui-library/examples/screens/book-firing.tsx`: destructures the object form and passes `error` to `AsyncButton` with a "Try again" error label, so a failed booking is announced in words.
- `ui-library/examples/renders/kiln-room-loading-light-1440.png`, `system-light-1280.png`: re-rendered against strata-react 0.1.6.

## 2026-11-09

**Settle how a bulk bar's filled action sits with the screen's own primary** (branch `claude/project-thread-3yp85x`). Building python-app-template on strata-react put a filled "Remove 2" in the `BulkBar` and a filled "Send greeting" on the same screen, and a review flagged it as two filled buttons. The docs said both "one filled button per view" (`patterns.md` §2) and "BulkBar … one filled" (`components.md` §3.7) without saying which wins; Jonathan asked for a decision. The decision: one filled button per view *at a time*. While rows are chosen, the bulk action is the filled one and the screen's primary steps down to outline until the selection clears, because choosing rows is the person naming their next step and the bar exists only while they mean it. The taste-skill study already pointed this way ("one filled bulk action for the list", `taste-skill/references/app-screens.md`); the other reading, an outline bulk action whenever the screen has a primary, was not taken because it makes the action the person just asked for the weakest thing on screen.

- `ui-library/patterns.md`: §2's rule now reads "per view at a time" and says the bulk action takes the filled slot while a selection exists. This is a clarification of the earlier rule, which was silent on selection.
- `ui-library/components.md`: §3.7's `BulkBar` bullet says the screen's primary steps down to outline while the bar is up, with the one-line way to write it.
- `ui-library/agents.md`, `ui-library/examples/AGENTS.md`: rule 6 carries the same sentence.

## 2026-11-08

**Record Disclosure and expandable table rows as built in strata-react** (branch `claude/project-thread-d9xjs0`, PR #16). strata-react issue #34 (from the Bright Horizons port) asked for a disclosure with a summary slot and a lazily loaded body, in place of each app's own `<details>`; it is built in strata-react as `Disclosure`, `useExpanded` and `DataTable`'s `expansion`, and this records it as an extension of the design.

- `ui-library/components.md`: an inventory row, a pointer from §3.7 DataTable, and **new** §3.18 Disclosure and expandable rows (numbered 3.18 when merged, after §3.17 Status dashboards): why not `<details>` (it mounts every closed body, so every row's request runs on load), the button and naming rules, open keys in the URL through `useExpanded`, the table's detail row, and why there is no height animation despite Emil Kowalski's accordion recipe (the frequency budget in `character.md` §5.3).
- `ui-library/README.md`: the inventory's Data row lists expandable rows and Disclosure, and §8's URL row names `useExpanded({ param })`.

**Record the stale state of `DataView` as built in strata-react** (branch `claude/project-thread-vqq9vb`). strata-react issue #26 found that a refetch failing after a good read turned a polling dashboard into an error panel, because TanStack Query keeps the data but sets the query's status to error and `toLoad` mapped that to `Load`'s error. strata-react now keeps the data with a `stale` reason; this records the new state in the spec it implements.

- `ui-library/components.md`: §3.6 gains the **stale** state (`Load`'s ready carries an optional `stale`; `DataView` shows a polite `StaleNotice` with the reason, the time the data was read and Try again; screens can pass their own words), and says only a read that never produced data is an error. The reasons cite `taste-skill/references/app-screens.md`, which already said a refresh keeps the old values and an error says when the data was last good; the earlier spec had no state for that.
- `ui-library/README.md`: §8 gains a row mapping the stale state to `toLoad` and `useInfiniteLoad`.

**Record Thumbnail as built in strata-react** (branch `claude/project-thread-vlns5m`). strata-react issue #33, raised while porting the Bright Horizons review app, asked for a lazy image with a fixed aspect ratio, a skeleton and a named fallback for crops that 404. It is built in strata-react on the same branch; this records it against the DataView spec it extends.

- `ui-library/components.md`: §3.6 gains Thumbnail and ThumbnailSkeleton (the four DataView states for one image, required `alt` and `missing`, loading on approach, no fade-in by the character-by-frequency rule); the inventory table lists them.
- `ui-library/README.md`: the inventory's Data row includes Thumbnail.

**Record strata-react's selectable image grid and range selection** (branch `claude/project-thread-hvbukq`; strata-react issue #32). strata-react issue #32, from the Bright Horizons port, asked for a grid of images to choose from with select all, Shift-click ranges and a starting selection that follows the data. strata-react built it as `SelectableGrid` over the same selection hook as `DataTable`, so the table gained ranges too. This records the design; it follows the existing §3.7 rules rather than changing them.

- `ui-library/components.md`: an inventory row for `SelectableGrid`, and two §3.7 bullets: ranges (Shift-click and Shift+Space, in the order shown) with `initial` applying to rows when they first appear, and the grid (each tile one label, the box on a chip, fixed-aspect frames, the table's select-all and virtualisation).
- `ui-library/README.md`: the inventory's Data row lists `SelectableGrid`.

**Record the date and date-time formatters built in strata-react** (branch `claude/project-thread-2h7kpg`, PR #12; strata-react PR #36). strata-react issue #31, from porting the Bright Horizons review app, asked for a date-with-time formatter because the History screen had built its own `Intl.DateTimeFormat`; strata-react added `format.date` and `format.dateTime` and made every date formatter callable with a Date, ISO string or epoch milliseconds. This follows the rule here that numbers and dates go through `format`, and names the formatter so agents stop hand-building one.

- `ui-library/components.md`: rule 7 names the date formatters and when each is used.
- `ui-library/agents.md`: rule 7 says a history row is `format.dateTime(row.at)` and forbids an `Intl.DateTimeFormat` in a screen.

## 2026-11-07

**Status dashboard components, from strata-react** (branch `claude/project-thread-4qi9pb`, PR #11). strata-react issue #25 asked for a usage bar with thresholds, a composition bar with a table, a destination card and a compact Appearance control, after jburnhams/homepage hand-rolled them; strata-react PR #29 builds them as `Meter`, `CompositionBar`, `LinkCard` and `ColorSchemeChoice compact`. They follow rules already set out here rather than adding new findings, so this records how they apply.

- `ui-library/components.md`: **new** §3.17 "Status dashboards" (numbered 3.17 when merged, because §3.16 is Keyboard triage) and an inventory row. It covers the meter role and value text, named thresholds shown as status words, the composition bar's table and five-token limit, the one-link card, and the compact three-way colour-scheme choice.

**LineChart y-axis pins and thinning x labels, from strata-react** (branch `claude/project-thread-jaj9fq`). strata-react issue #23 asked for `yMax` (and maybe `yMin`) so a percentage chart does not autoscale a near-idle machine into a busy-looking one; the strata-react change also fixes the kiln chart's x labels overlapping at phone width.

- `ui-library/components.md` §3.8: adds the y-axis rule (zero to a nice maximum by default, `yMin`/`yMax` for a range that is a fact of the subject, a pin never crops a reading) and the x labels thinning evenly when they would collide. The section did not say before where the y-axis starts.
**Record row selection, BulkBar, Checkbox and RowAction as built in strata-react** (branch `claude/project-thread-pkwejq`). strata-react issue #11 (raised from strata-listory) asked for row selection and named row actions on `DataTable`; they were built in strata-react PR #20, and this records where that follows and departs from the spec here.

- `ui-library/components.md`: Checkbox is now built, as the native control rather than Radix as first specified (a departure, with the reason); Switch stays a spec. §3.7 gains `RowAction` (row actions named for their row, header hidden rather than empty) and opt-in selection (`selection`, `useSelection` pruning to rows that exist, `BulkBar` with the count in its own polite live region). The inventory table lists them.
- `ui-library/README.md`: the inventory's "Built in strata-react" column now includes Checkbox, RowAction and row selection.
**Record strata-react's keyboard triage pattern** (branch `claude/project-thread-9k96br`, PR #8; strata-react PR #18). strata-react issue #7 asked for single-key shortcuts and an active-item list for screens that clear a queue; it is built there, and this records it as an extension of the design, following the frequency budget in `character.md`.

- `ui-library/components.md`: an inventory row and **new** §3.16 Keyboard triage (`useHotkeys`, `KeysLegend`, `useActiveItem`, `ActiveList`): one shortcut list drives the handler and the legend, the typing and chord rules (WCAG 2.1.4), focus moving on after an answer, and what generated versions get wrong.
- `ui-library/README.md`: §8 maps the pattern to strata-react as an extension of the design.

**Undo bar failure state, from strata-react** (branch `claude/project-thread-0n52d4`). strata-react issue #8 asked for `flush()`, a promise-returning commit and a way to restore an item when the commit fails; strata-react PR #17 implements it and extends the design in §3.10, which said nothing about a failed commit.

- `ui-library/components.md` §3.10: adds what strata-react 0.2 does (the hook owns hidden items, `flush()`, failure shown in the bar with Try again and Dismiss, one pending removal, commit on unmount). The 0.1 description is kept, since the examples pin `^0.1.3`; `ui-library/examples/screens/kiln-room.tsx` and `system.tsx` will need `UndoBar undoable={...}` and a `failure` sentence when they move to 0.2.

**Present strata-react as the implementation of `ui-library/`, and install it from npm** (branch `claude/project-thread-nwljes`, PR #6). Jonathan asked for the example to use the published package and for the docs to discuss the library as the implementation of the research. strata-react 0.1.3 is on npm since today.

- `ui-library/examples/package.json`, `package-lock.json`: `strata-react` is now `^0.1.3` from npm instead of a GitHub dependency pinned to `00ad35e`; the package is renamed `strata-examples`. The lock was regenerated from scratch with every platform's native packages. `npm run check` and `npm run render` pass, and the renders are unchanged (pixelmatch: at most 1 differing pixel, so the screenshots were not recommitted).
- Rename: the design's placeholder name **Plinth** becomes **Strata** in every current doc (`README.md`, `ux-character.md`, `emil-kowalski-skills/README.md`, `ui-library/*.md`, `ui-library/examples/` docs, site script and stylesheet, and the `strata:rules` markers). Earlier changelog entries keep "Plinth".
- `ui-library/README.md`: retitled "the design behind strata-react"; the opening says the docs here are the why and strata-react the what, and which wins when they disagree. Decision 3 is revised (correction): the design specified a shadcn copy-in registry, and it is implemented as an npm package because one framework is shared across products. The architecture, distribution and dependencies sections describe the package (four CSS imports; React Router and TanStack Query, Table and Virtual underneath; no `init` command yet). The inventory column is now "Built in strata-react" (fourteen of twenty-five components). The enforcement table adds strata-react's Storybook, visual baselines and MSW unit tests. **New** §8 maps each part of the design to the implementation and says where it extends or revises it.
- `ui-library/agents.md`, `ui-library/examples/AGENTS.md`: the rules block no longer refers to a registry, `npx shadcn add` or `plinth init`, which were never built. A missing component is added to strata-react with stories and tests, a new variant goes there with a story, formatting comes from strata-react's `format`, and products copy the block by hand.
- `README.md`, `ui-library/components.md`, `ui-library/examples/README.md`: describe strata-react as the implementation, with links to npm, the docs site, Storybook and the API reference.

**The worked example now runs on strata-react**, on branch `claude/project-thread-nwljes`. Jonathan turned jburnhams/strata-react into his own React + Tailwind framework built from `ui-library/` (strata-react PR #1, merged), and asked that its first use be this repo's examples and live demos. The kiln room keeps its theme, screens and sample data and imports everything else.

- `ui-library/examples/components/ui/` and `lib/utils.ts`: removed. The eleven components and `cn()` now come from `strata-react`, pinned to its merge commit (`00ad35e`) as a GitHub dependency in `package.json`, with React Router and TanStack Query added as its peers; Radix Slot, cva, clsx and tailwind-merge are no longer direct dependencies.
- `ui-library/examples/app/globals.css`: imports `strata-react/strata.css` for the namespace reset, type steps, radius, elevation, motion, density, base layer and the status-role mapping, and keeps only the product's layer: status values, the title's voice (`--title-weight`, `--title-stretch`, `--title-tracking`, which strata-react's `type-title` reads), faces, contrast-more inks, heat and glaze colours. 238 lines down to 117.
- `ui-library/examples/package-lock.json`: regenerated from scratch after the Pages build's `npm ci` failed on the PR. The first lock was written over an existing `node_modules` and listed only the Linux x64 builds of Tailwind's oxide, lightningcss and @parcel/watcher, which npm 11 on Node 26 rejects as out of sync. Renders are unchanged (pixelmatch: 0 differing pixels).
- `ui-library/examples/screens/*`: import from `strata-react`; `lib/format.ts` re-exports strata-react's `format`.
- `ui-library/examples/renders/`: re-rendered and compared with pixelmatch against the previous renders: all ten are pixel-identical (0 differing pixels), so the move changed no output. `npm run check` (tsc, Tailwind, slop-lint: 16 files, 0 findings) and `npm run render` pass, and `node --test ux-design/tests/*.test.mjs` passes 7 of 7.
- `ui-library/components.md`, `tokens.md`, `README.md`, `examples/README.md`, `examples/AGENTS.md`, root `README.md`: links to the component files now point at strata-react's `src/`; the ui-library README says the design is implemented and how strata-react departs from it (a package rather than a copy-in registry; TanStack and React Router underneath), and its "Designed, not published" limit is replaced.
- `.github/workflows/pages.yml`: Node 26, which strata-react requires.

**More colour in the kiln room**, on branch `claude/project-thread-l74ku1` (a fresh
branch from `main` after PR #4 merged). Jonathan found the playful pass too subtle and
asked for more colour and visual flair. All of it is drawn from the subject, so it
stays within `ux-character.md`.

- `ui-library/examples/app/theme.generated.css`: regenerated from a deeper celadon seed,
  `#4d7a52` (primary chroma 0.079, up from 0.038); 42 checks pass. `globals.css`: the
  contrast-more inks re-taken from the new seed; seven `--glaze-*` tokens; a display
  face (Archivo, wdth 125, weight 800) on `type-title`, now 28px.
- **New** `screens/kiln-strip.tsx`: the three kilns side by side, replacing the plain
  metric strip on the kiln room. Each shows its state, its figure, a temperature trace in
  the glow colours, and a glaze tile per booking. **New** `screens/glaze-tile.tsx`: a
  test-tile swatch, used beside each firing in the table ("Celadon, cone 6").
- `screens/sample-data.ts`: bookings carry a glaze. `scripts/entry.tsx` loads Archivo;
  `scripts/render.mjs` checks that it loaded. `package.json`: `@fontsource-variable/archivo`.
- `DESIGN.md`, `ui-library/tokens.md`: the new seed, the glazes, the display face and
  the strip, with reasons. All screenshots re-rendered.

**Character without slop: making the output playful while function stays first**, on
branch `claude/project-thread-l74ku1`. Asked why the docs and library read as boring
and how to make them interesting and playful without losing the focus on function or
falling into the AI-slop look. Three scopes were offered (research and rules only; that
plus a character layer and a reworked kiln example; that plus a second, louder example);
this change is the middle one, and the second example is listed as a next step.

- `ux-character.md` — **new**: why the output read as boring (the rules only subtract,
  every Operate dial at its calm end, the subject reaching the palette but not the
  behaviour), the evidence on delight with grades, ten sources compared, the
  disagreements and their resolutions (sound, empty-state illustration, bounce,
  Expressive by default), playful slop with the Corporate Memphis precedent, and the
  procedure: character sentence and voice pairs, behaviours in the inventory, placement
  by frequency, channels by mode, the moment, and four checks (swap, hundredth time,
  bad day, remove).
- `ui-library/character.md` — **new**: the character layer: what the library ships and
  what the product supplies, the DESIGN.md Character section, the frequency budget,
  how to build a moment, voice in component slots, the checks, known limits.
- `ui-library/README.md`: decisions 17–19 (character by frequency, a completion is a
  component, colour may encode a fact of the subject); the "Expressive motion not
  adopted" note now says the character layer keeps it; inventory and counts (24
  specified, 11 in the example); enforcement table and known limits updated.
- `ui-library/tokens.md`: motion table gains `--motion-press`, `--motion-moment`,
  `--ease-moment`, `press` and `enter-moment`; new §13 on character tokens.
- `ui-library/components.md`: new §3.15 `Done`; `LineChart` gains `colourScale`.
  **Correction**: §3.8 said the example's temperature line uses `--warning`; it now
  uses the heat scale.
- `ui-library/patterns.md`: a row for rare completions; new §10 on where character
  goes on a screen. `ui-library/agents.md` and `examples/AGENTS.md`: a rule for
  character and a step for the flow's moment.
- `ui-library/examples/`: `globals.css` gains five `--heat-*` subject colours (checked
  at 4.3–8.1:1 light and 4.1–12.4:1 dark against the ground), press and moment motion
  tokens, and a base rule hiding the focus ring on a script-focused heading;
  `Button` gets `press`; `LineChart` gets `colourScale`; **new** `components/ui/done.tsx`,
  `screens/booked.tsx`, `screens/shelf-figure.tsx`, `screens/heat.ts`; the kiln room's
  firing line is coloured as the kiln glows and its empty state reads "All three kilns
  are cold"; the booking form now ends in the `Done` view with kiln 2 drawn in section
  and the member's pieces set down on their shelf; the state-matrix page shows `Done`,
  the heat line and a more specific controller error. `DESIGN.md` gains a Character
  section. Render script: two new views (`booked`, light 1440 and dark 390) and a
  700ms wait for the moment; all ten screenshots re-rendered. The Pages site gains a
  Character page.
- `ux-design/skill/`: **new** `references/character.md`; `SKILL.md` gains step 3b and
  character checks in step 6, and its description now covers "correct but boring";
  `references/tells.md` gains a playful-slop section; `assets/DESIGN.template.md` gains
  a Character section and front-matter keys.
- `ux-design/skill/scripts/slop-lint.mjs`: five rules: `confetti`, `stock-whimsy`,
  `stock-illustration` (slop P1), `vague-error` and `sound-without-control` (quality
  warn). 50 file rules plus one project rule. **New** fixture
  `ux-design/fixtures/slop/app/playful.tsx`; the test expects all five.
- `emil-kowalski-skills/` — **new** (MIT): three skills stored with a README.
  `impeccable/reference/delight.md` and `bolder.md` — **new**, from `687bc38`.
- `web-articles/README.md`: notes on NN/g, Comeau, Freiberg, Mailchimp, Corporate
  Memphis, the aesthetic-usability papers and the humour summary.
- `sources.md`, `README.md`, `ux-design/README.md`: sources, start-here entry, finding
  12, rule counts (46 → 51), next-pass candidates.
- Review fixes on PR #4 (Codex review): the confirmation is now its own state rather than
  the button's phase, which settled back to idle after two seconds and hid it; it is
  derived from the submitted firing and kiln (`firingTypes` gains a `next` firing with
  its day, drop-off time and collection), with the shelf drawing only for kiln 2 when the
  pieces fit; "Book more pieces" resets the form instead of linking to the current hash;
  and the safe-to-open temperature comes from `SAFE_TO_OPEN_C` rather than a typed 200 °C.
- Not found: any controlled study of humour in interface error messages. The
  aesthetic-usability papers and the 2025 humour study were read only as abstracts or
  summaries; peak-end is cited from the literature, not re-read. Jakub Krehel's
  `better-*` skills were cloned but not compared.

## 2026-11-02

**Component library design: `ui-library/`**, on branch `claude/project-thread-2o640l`.
Asked to use the research to design a React and Tailwind UX library, the way `prompts`
turned its research into Forge, and to write it up with examples. The design became a
library that ships no look, because the research's main finding is that the stack's
defaults are what make generated UI look the same.

- `ui-library/` — **new**:
  - `README.md`: the brief, the stance, 16 decisions each with its source and what it
    replaces, what was not adopted, the architecture and layer ownership,
    distribution as a shadcn-format registry, the inventory, enforcement, known limits.
  - `tokens.md`: the token contract, including the Tailwind namespace reset (verified
    against Tailwind 4.3.3: it must come after `@import "tailwindcss"`; placed before
    it, nothing is removed), status tint and ink pairs solved to ≥ 6:1, type steps as
    `@utility`, radius by role, motion and density tokens.
  - `components.md`: conventions and specs for 23 components, each with what generated
    versions get wrong.
  - `patterns.md`: the Operate screen shape, figures, tables, charts, forms,
    destructive and async patterns, and what Read and Persuade surfaces get.
  - `agents.md`: the rules block for a project's `AGENTS.md`, each rule mapped to a
    check, and how the library is maintained.
  - `examples/`: a fictional pottery co-op's kiln room. A theme generated with
    `palette.mjs`, ten components, a dashboard, a booking form and a state-matrix page,
    a filled-in `DESIGN.md` and `AGENTS.md`, a render script with the audit's
    mechanical checks, and eight screenshots. Type-checks, compiles, renders without
    console errors or overflow, and passes `slop-lint` in operate mode with no findings.
- `ux-design/tests/tools.test.mjs` — new test: the worked example passes `slop-lint`.
- `README.md` — `ui-library/` added to "Start here". `CLAUDE.md` — the test rule now
  covers `ui-library/`.
- Found while building, recorded in `ui-library/README.md` §7: `palette.mjs --contrast 1`
  lowers the dark theme's foreground slightly (L 96.5% to 95.0%) while raising muted
  text; `palette.mjs` has no status roles, so they were solved by hand with its colour
  library; `slop-lint` does not yet flag stock size classes (`text-sm`) in a project
  that has removed them. No new sources were read for this change.
- Review fixes on the same PR (Codex review): high-contrast light inks no longer
  override a dark root; small and compact controls stay 44px on touch; kiln facts moved
  into `sample-data.ts` and the booking form derives its choices, hints and errors from
  them; the form asks before in-app navigation discards entries; the kiln room derives
  rows from each load instead of only the first; the state-matrix page now shows every
  example component (Textarea, ChoiceGroup, PageHeader, LineChart, UndoBar,
  TableSkeleton were missing).
- GitHub Pages site, asked for in the same thread: `.github/workflows/pages.yml` (**new**)
  runs the repo tests, `npm run check` and a site build on pull requests, and deploys on
  pushes to `main`. `ui-library/examples/scripts/build-site.mjs` and `scripts/site.css`
  (**new**) render the six ui-library docs to HTML styled with the example's Plinth
  theme, rewrite doc links to `.html` and repo links to GitHub, and add the live demo
  (`demo/`, screens by hash, `?theme=dark`, `?density=compact`) and the screenshots.
  `package-lock.json` (**new**) so CI can `npm ci`; `marked` added for the Markdown.
  Checked locally: a clean `npm ci` then `check` and `site` pass, all nine pages load
  over HTTP with no errors or overflow, and all 17 internal links resolve. Pages must
  be switched to "GitHub Actions" in the repository settings before the first deploy.

**Blocked sources retried and processed**, on branch `claude/project-thread-ox5cth`.
Asked to look at the doc listing sources the first pass could not reach and process
the ones now visible. Almost every host now answers; JavaScript-only sites were
rendered in headless Chromium. Only X (login wall) and the Stitch app (sign-in) are
still out of reach.

- **New source folders**:
  - `design-slop-cop/` — Adrian Krebs's Show HN study and its MIT detector:
    `patterns.tsv` (14 computed-style rules with thresholds) and `prevalence.csv`
    (our count over the repo's 1,390 scored sites, with the 190 human labels). The
    README sets out the study's three versions (500 sites in April, 1,590 in the
    current blog text, 1,390 in the repo), whose per-pattern figures differ, and
    summarises all 235 HN comments.
  - `pixelslop/` — Apache-2.0 render-first anti-slop skill: SKILL, the 26 + 16 pattern
    catalogue, the five-pillar scoring rubric.
  - `boardui/` — BoardUI's `AGENTS.md`, a design system's rules for coding agents
    (MIT free tier).
  - `notboring/` — analysis only (the licence forbids redistributing its prompts):
    components as prompts, "build every state", map tokens rather than add globals.
    It is not Not Boring Software, as the first pass guessed.
  - `web-articles/` — graded notes on eleven articles: the origin of AI purple, Sailop's
    HTTP Archive figures, design-system drift (Superdesign, OverlayQA), tell lists,
    Impeccable's public slop page and docs, the Stitch "vibe design" launch, and a
    skills comparison naming six skills not yet covered.
  - `material-3/compose-motion/` — Compose's Expressive and Standard motion tokens.
- **Corrections**:
  - `ux-material-3.md` — Material has two motion schemes and the stored web tokens were
    **Standard**; **Expressive**, the recommended default, uses spatial damping 0.6–0.8.
    Web cubic-bezier equivalents added. The research write-up is now read (46 studies,
    18,000+ participants; "up to four times faster" to find key elements, largely from
    size, position and contrast; its own caveat that breaking familiar patterns hurt
    usability). Dates fixed (launch May 13, 2025; I/O 2026 on May 19, 2026, with the
    Expressive layout system and Compose-first Android). Shape guidance added (optical
    roundness, no large corners on dense components). The reduced-motion claim from
    search snippets is marked unconfirmed.
  - `ux-slop-taxonomy.md` — Krebs cited from the primary source, with version-bound
    figures; purple reframed as the most recognised tell, not the most common;
    dark-with-grey-text is the most common. New tells: multicoloured side tabs, status
    dots everywhere, cyan or neon on dark, decorative sparklines, every button
    primary, generic FAQ accordions, no progressive disclosure. Drift mechanisms
    added to §3g. Material's research added to the evidence table.
  - `ux-colour-science.md` — Radix's 12 steps verified (with the Lc 60/90 guarantee),
    APCA levels with their size and weight pairs, Oklab provenance, and the Palmer and
    Schloss and Valdez and Mehrabian abstracts (with the regression coefficients).
  - `avoid-ai-design/README.md` — its percentages are from the study's first version.
  - `ux-anti-slop-skills.md` — Pixelslop and Krebs's detector added to the comparison
    and the verification table. `ux-product-ui.md` §5 — an object-lifecycle row.
- `blocked-sources.md` rewritten: what is still unreached first, then what each retry
  found and where it went. `sources.md`, `README.md` (two new findings, new
  candidates) updated.
- `changelog.md` and `CLAUDE.md` — new; `CLAUDE.md` asks every change to add an entry
  here.

## 2026-11-01

**First pass: UX research on AI design slop for React + Tailwind** (PR #1, merged
2026-11-02). Asked to investigate best practice in UX design the way `prompts`
investigates agent prompts, and to produce our own docs to follow.

- Primary sources stored by source, each with a README: Anthropic `frontend-design`
  and the frontend-aesthetics cookbook, Claude's design skills (analysis only),
  Impeccable (with its rule registry and mood seeds extracted), taste-skill v2,
  avoid-ai-design, anti-ai-slop, anti-slop-design, Vercel's interface guidelines, the
  shadcn skill, Google DESIGN.md and Stitch skills, Material 3 tokens and colour
  engine, a Reddit tell study, and the design sections of generator prompts from
  `prompts`.
- Synthesis docs: `ux-slop-taxonomy.md`, `ux-generator-prompts.md`,
  `ux-anti-slop-skills.md`, `ux-react-tailwind.md`, `ux-product-ui.md`,
  `ux-material-3.md`, `ux-colour-science.md`, `ux-mood-to-theme.md`.
- `ux-design/` — the output: a skill for React + Tailwind with a dated tell registry,
  a mood-to-token procedure, Operate-surface rules and an audit, plus `slop-lint`
  (46 rules) and `palette.mjs`, with fixtures and tests.
- `sources.md` (repos, commits, licences, fetch recipe) and `blocked-sources.md`
  (what could not be reached).
