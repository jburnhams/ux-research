# Anti-slop design skills compared

Ten skill-shaped sources (eleven since Pixelslop was added on 2026-11-02) that try to make an agent produce non-generic UI,
compared stage by stage the way `prompts/code-review-approaches.md` compares
review agents. The generator prompts are compared separately in
[`ux-generator-prompts.md`](./ux-generator-prompts.md).

| Source | Shape | Size | Licence |
|---|---|---|---|
| [Anthropic `frontend-design`](./anthropic-frontend-design) | One SKILL.md | 71 lines | Apache-2.0 |
| [Claude `artifact-design`](./claude-design-skills) | One SKILL.md, served in-session | about 120 lines | proprietary |
| [Impeccable](./impeccable) | Router plus 24 commands, Rust detector, hook, extension | about 430 KB text, 62 rules | Apache-2.0 |
| [taste-skill v2](./taste-skill) | SKILL plus 11 references, dealer, inspector and lint scripts, 1.8 MB library | about 330 KB text | MIT |
| [avoid-ai-design](./avoid-ai-design) | SKILL plus catalogue plus zero-dep scanner | about 70 tells | MIT |
| [anti-ai-slop](./anti-ai-slop) | SKILL plus 3 references | 9 hard rules | MIT |
| [anti-slop-design](./anti-slop-design) | SKILL plus 20 modules | — | MIT |
| [Vercel WIG](./vercel-web-interface-guidelines) | AGENTS.md plus review command | about 150 rules | MIT |
| [shadcn skill](./shadcn-skill) | SKILL plus rules, with live `info --json` context | — | MIT |
| [Google Stitch `taste-design`](./google-stitch-skills) | A port of taste-skill v1 into Stitch's DESIGN.md flow | 191 lines | Apache-2.0 |
| [Pixelslop](./pixelslop) (added 2026-11-02) | SKILL plus 11 subagents, Playwright scanner, fix loop with checkpoints | 26 visual + 16 source patterns, 5 pillars, 8 personas | Apache-2.0 |

## 1. Before any pixels: classify, then ground

| Source | Classifies the surface? | Grounds in the subject how? |
|---|---|---|
| frontend-design | No | "Identify [the subject] yourself … confirm with the client"; "the subject's industry, subject matter, materials, and vernacular are where distinctive visual choices come from" |
| artifact-design | **Yes**: utilitarian against editorial treatment; "When the page is a UI" | One subject-only detail "as content rather than ornament" |
| Impeccable | **Yes**: four modes (Persuade, Operate, Read, Experience), chosen "from the requested surface, not the product" | `init` writes PRODUCT.md; `shape` plans before code |
| taste-skill | **Yes**: page against app screen, each with its own run | **Inventory of 8–12 facts** only this client has; "the competitor test"; "On this page, [something that belongs to the subject] becomes [the device]" |
| anti-slop-design | Product types module with personality axes | Brief including "one competitor to *not* look like" |
| anti-ai-slop | No | One line each for user, job, tone and a real constraint |
| avoid-ai-design | No (audit-oriented) | — |

**Convergence**: the strong sources all say the idea must come from the subject,
not the category. taste-skill's competitor test is the most operational version:
substitute the nearest competitor into your concept sentence, and "if the sentence
still works, the idea belongs to the category."

## 2. Direction: how a look gets chosen

| Source | Mechanism | Guard against the model's own median |
|---|---|---|
| frontend-design | 4–6 hex values, type roles, ASCII wireframes, principles | Review the plan: "work through a similar prompt to see if you arrive somewhere similar" |
| artifact-design | Token plan written directly into `:root` | Editorial-only review against the subject; boldness "in one place" |
| Impeccable | `concept-seed` deals directions from a private catalogue; 128 palette seeds each with a mood and a strategy | Randomness from outside the model; mode rules printed by the engine "because a printed engine line is followed where an extra file read gets skipped" |
| taste-skill | `draw.mjs` deals 3 of 20 researched directions, then type, palette, hero and sections | Randomness plus "Adopt it. Do not blend it with the layout you would have made anyway"; redraws need a stated reason and are reported |
| Claude Design canvas | 2–4 low-fi directions on a nameable axis, chosen by the user | The human picks; "a rigged vote" is called out |
| v0 | `GenerateDesignInspiration` tool | Separate call and budget; "MUST follow it" |
| anti-slop-design | Name a "visual thesis" and pick from axes | — |

**Finding**: the two most engineered skills (Impeccable, taste-skill) both moved the
choice of direction **out of the model** into a dealer with a library, because
"asked to invent a look, a model picks the category default every time." The
library is the expensive part, and Impeccable treats its catalogue as "the
paid-service moat". The cheap alternative is the human: the Claude Design canvas
skill makes the user pick between options that differ on a stated axis.

## 3. Rules: lists, bans and their override

All nine carry an avoid-list. What separates them:

- **The override clause.** frontend-design, artifact-design, Impeccable ("The brief
  wins … Redirecting a clear brief toward your taste is failure") and avoid-ai-design
  all state it. anti-slop-design's "Instant rejects … Reach for any of these and you
  have failed by default" softens it to "requires an explicit, product-specific
  justification". Without the override, a list turns into refusing what the user
  asked for.
- **Dated or timeless.** Only taste-skill dates its tells by wave. The rest present
  2025–26 fashion as permanent principle (anti-slop-design even asks for designs
  "defensible in two years, not tied to a 2024–2026 trend cycle" while listing that
  cycle).
- **Replacements.** taste-skill refuses to name any. The cookbook named fonts, and
  they became tells. anti-ai-slop ships `toolkit.md` with swap-in palettes and
  pairings, which is a future-tell risk by taste-skill's argument.
- **Mode-scoped.** Impeccable and taste-skill relax rules on app screens (1px
  borders, small labels and peer-card rows allowed). The others apply landing-page
  rules everywhere, which over-flags dashboards.

## 4. Build-time quality floor

| Source | Where the floor lives | Notable rules |
|---|---|---|
| Vercel WIG | It *is* the floor | Focus, forms (never block paste, submit stays enabled until the request starts), URL reflects state, `min-w-0` on flex children, `tabular-nums`, `Intl.*`, `touch-action`, `overscroll-behavior` |
| shadcn | Component-correctness rules | Semantic tokens only; `gap` not `space-y`; Dialog needs a Title; `Empty` for empty states; `data-invalid` with `aria-invalid` |
| Impeccable | `craft-floor.md` loaded "immediately before any UI edit"; a11y deliberately **only** in `audit.md` | "Browser surfaces: … text selection, the caret, custom scrollbars, focus rings, underline offset … the one models skip most reliably" |
| frontend-design | One paragraph: "Build to a quality floor without announcing it" | Responsive, visible focus, reduced motion |
| artifact-design | Fundamentals for every page | Complete at rest; tabular figures; consistent repeated elements |

## 5. Verification

| Source | Deterministic | Visual | Loop bound |
|---|---|---|---|
| Impeccable | 62-rule engine over source, static HTML, or a live URL in Chrome; **runs as a post-edit hook** inside the agent; `--github` annotations; exit code 2 on findings | Batched screenshot checks at ship sizes | "Fix what one look shows before looking again" |
| taste-skill | `inspect.mjs` (real browser, computed styles) and `lint.mjs` | Screenshots at three widths, a juror's rubric | Look, fix, look |
| avoid-ai-design | `detect.mjs`, zero deps | Silhouette test against five competitors | — |
| anti-ai-slop | Mechanical copy grep | **Render or it didn't happen**: 4 of 10 apps blank | — |
| artifact-design | Preview's mechanical list | One look, light and dark, desktop and phone | One look, one edit pass, publish |
| Vercel WIG | The review command emits `file:line` findings | — | — |
| shadcn | `showcase-coverage.mjs`; `scrollWidth <= innerWidth`; `scrollY === 0` on load | Screenshot hero, foundations, a form, a dark band | — |
| dataviz | Palette validator with FAIL and WARN | Render and look | — |
| Pixelslop | In-page JS checks on the rendered page at three viewports; grep patterns reported separately and **not counted** ("a page can grep dirty but render clean") | Screenshots; five pillars scored 1–4, each score citing a measurement; eight personas | Fix loop with git checkpoints and rollback |
| Design Slop Cop (Krebs; a study tool, not a skill) | 14 computed-style checks, one file each with named thresholds; 190 labelled sites and a precision/recall eval | None by design | — |

**Finding**: the field is converging on Impeccable's architecture: a deterministic
detector for the source-visible tells, run automatically (hook or CI) rather than
when someone remembers, plus one bounded visual look for the render-only tells.
Pixelslop and Krebs's detector push the deterministic half into the browser: computed
styles, not source, are what they count. Only Krebs's ships labelled ground truth to
measure the detector against.
The other half (whether the idea belongs to the subject) is still judgement and
only taste-skill's competitor test makes it checkable.

## 6. Output contract

- anti-slop-design: "Close with 3–6 lines naming the deliberate decisions and why. If
  you cannot justify a choice, it was slop."
- taste-skill: report every redraw and its reason; list the sample data used.
- shadcn: report the mapping, contrast pairs under 4.5:1, every component file
  edited, every deviation.
- artifact-design: the opposite. "Unless the user asks about the design, one plain
  sentence on the direction is the most to say about it."

The two positions are compatible once the audience is named. For a human waiting on a
page, say one sentence. For a reviewer or a downstream agent, write a decision log
next to the code, which is what DESIGN.md is for.

## 7. What to take

Adopted into [`ux-design/`](./ux-design):

1. Mode or treatment classification first (Impeccable, artifact-design).
2. Subject inventory and the competitor test (taste-skill).
3. A token contract in Tailwind v4 `@theme` plus a DESIGN.md rationale (shadcn,
   Google DESIGN.md), reviewed for genericness before code (frontend-design).
4. A dated tell registry with the brief-wins override and no named replacements
   (taste-skill, frontend-design).
5. The quality floor kept out of the creative prompt and enforced in an audit pass
   (Impeccable's eval finding).
6. A zero-dependency source linter that runs in CI or as a hook (Impeccable,
   avoid-ai-design), separating `slop` from `quality` and source-visible from
   render-only.
7. One bounded render check with a mechanical list (artifact-design, shadcn).
8. A decision log in DESIGN.md (anti-slop-design, shadcn).
