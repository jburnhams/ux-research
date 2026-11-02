# Changelog

All notable changes to this repository, grouped by day, newest first. Backfilled from
git history on 2026-11-02 and kept up to date with every change since (see
[`CLAUDE.md`](./CLAUDE.md)).

## 2026-11-02

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
