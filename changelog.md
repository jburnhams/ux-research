# Changelog

All notable changes to this repository, grouped by day, newest first. Backfilled from
git history on 2026-11-02 and kept up to date with every change since (see
[`CLAUDE.md`](./CLAUDE.md)).

## 2026-11-07

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
