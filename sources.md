# Where the sources came from

Every repo read in the first pass (2026-11-01) and in the retry of blocked sources
(2026-11-02), the commit read, the paths that matter, the licence, and what was stored. Re-fetch any of them in a minute with the recipe below.
What could *not* be read is in [`blocked-sources.md`](./blocked-sources.md).

## Fetch recipe

In the first pass `api.github.com` returned 403 through this environment's proxy (it
answered on 2026-11-02); plain git always works. Blobless +
sparse keeps every repo small:

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/<owner>/<repo> <dir>
git -C <dir> sparse-checkout set <dir/path> [...]
git -C <dir> sparse-checkout set --skip-checks <single/file.md>   # files, not dirs
git -C <dir> ls-tree -r --name-only HEAD | grep -i <term>          # find paths without network
```

## Repos

| Source | Repo | Commit (date) | Paths that matter | Licence | Stored here |
|---|---|---|---|---|---|
| Anthropic `frontend-design` | `anthropics/skills` | `ca45fc4` (2026-10-28) | `skills/frontend-design/` | Apache-2.0 | [`anthropic-frontend-design/`](./anthropic-frontend-design) (whole skill) |
| Anthropic cookbook, frontend aesthetics | `anthropics/claude-cookbooks` | `c43f56d` (2026-10-29) | `coding/prompting_for_frontend_aesthetics.ipynb` | MIT | [`anthropic-cookbook-frontend-aesthetics/`](./anthropic-cookbook-frontend-aesthetics) (notebook as Markdown) |
| Impeccable | `pbakaus/impeccable` | `e89e3ad` (2026-11-01) | `skill/SKILL.src.md`, `skill/reference/`, `crates/foundation/src/registry.rs` (rule registry), `crates/context/src/palette_data.rs` (mood seeds), `CLAUDE.md` (eval findings) | Apache-2.0 | [`impeccable/`](./impeccable): router, 13 references, `antipatterns.tsv` and `palette-seeds.tsv` (extracted by us) |
| taste-skill v2 | `Leonxlnx/taste-skill` | `12af471` (2026-10-25) | `skills/taste-skill/SKILL.md`, `references/`, `library/*.json`, `evals/` | MIT | [`taste-skill/`](./taste-skill): SKILL + 8 references |
| avoid-ai-design | `funboy322/avoid-ai-design` | `2b7c718` (2026-09-24) | `SKILL.md`, `references/ai-tells-catalog.md`, `scripts/detect.mjs` | MIT | [`avoid-ai-design/`](./avoid-ai-design): SKILL + catalogue |
| anti-ai-slop | `Vinayak-Shukla-03/anti-ai-slop` | `c414eba` (2026-07-02) | `SKILL.md`, `references/` | MIT | [`anti-ai-slop/`](./anti-ai-slop) |
| anti-slop-design | `Ferousco-dev/anti-slop-design` | `484f99e` (2026-10-02) | `skills/anti-slop-design/` (20 modules) | MIT | [`anti-slop-design/`](./anti-slop-design): SKILL + 3 modules |
| Vercel Web Interface Guidelines | `vercel-labs/web-interface-guidelines` | `434b7f9` (2026-10-05) | `AGENTS.md`, `command.md` | MIT | [`vercel-web-interface-guidelines/`](./vercel-web-interface-guidelines) |
| Vercel agent skills | `vercel-labs/agent-skills` | `1a2c79d` (2026-10-27) | `skills/web-design-guidelines/`, `skills/react-best-practices/` | — | not stored (WIG repo is the source) |
| shadcn/ui skill | `shadcn-ui/ui` | `c0d63c3` (2026-11-01) | `skills/shadcn/`, `apps/v4/registry/new-york-v4/{ui,blocks}` (linter calibration) | MIT | [`shadcn-skill/`](./shadcn-skill): SKILL, design-system, customization, 2 rule files |
| Google DESIGN.md | `google-labs-code/design.md` | `6e5da53` (2026-10-16) | `PHILOSOPHY.md`, `docs/spec.md`, `examples/` | Apache-2.0 | [`google-design-md/`](./google-design-md) |
| Google Stitch skills | `google-labs-code/stitch-skills` | `0337446` (2026-08-17) | `plugins/stitch-utilities/skills/{enhance-prompt,design-md,taste-design}`, `plugins/stitch-design/skills/generate-design` | Apache-2.0 | [`google-stitch-skills/`](./google-stitch-skills) (4 skills) |
| Material Web tokens | `material-components/material-web` | `de5470f` (2026-10-29) | `tokens/versions/latest/sass/_md-sys-*.scss` | Apache-2.0 | [`material-3/tokens/`](./material-3/tokens) |
| Material colour utilities | `material-foundation/material-color-utilities` | `bd811e4` (2026-10-19) | `dev_guide/`, `typescript/{hct,scheme,dynamiccolor,dislike,temperature,score}` | Apache-2.0 | [`material-3/color-utilities/`](./material-3/color-utilities) (guides + 6 sources) |
| Reddit tell study | `JCarterJohnson/vibecoded-design-tells` | `f7c4aef` (2026-06-23) | `unslop-ai-ui/*.csv`, `DATA_NOTE.md` | MIT (code; text is authors') | [`vibecoded-design-tells/`](./vibecoded-design-tells) (aggregate CSVs only) |
| Tailwind CSS v4 | `tailwindlabs/tailwindcss` | `654f89f` (2026-11-01) | `packages/tailwindcss/theme.css` (default OKLCH palette, radius, shadows) | MIT | not stored; quoted |
| Adobe Leonardo | `adobe/leonardo` | `eb6481d` (2026-07-08) | `packages/contrast-colors/README.md` | Apache-2.0 | not stored; analysed |
| Radix Colors | `radix-ui/colors` | `dbdb854` (2025-12-17) | `src/light.ts`, `src/dark.ts` (docs on radix-ui.com) | MIT | not stored |
| Evil Martians Harmonizer | `evilmartians/harmonizer` | `4b45439` (2026-10-02) | `README.md` | **no licence file** | not stored; quoted |
| APCA reference | `Myndex/apca-w3` | `6c5c066` (2026-05-06) | `README.md` (Lc levels) | **All Rights Reserved** (licensed to W3C) | not stored; quoted |
| culori | `Evercoder/culori` | `7613e69` (2026-10-15) | — | MIT | not stored; recommended |
| Design Slop Cop (Krebs) | `AdrianKrebs/design-slop-cop` | `e2fab6c` (2026-07-07) | `src/patterns/*.js`, `src/score.js`, `results/tier-*.json`, `dataset/labels.jsonl` | MIT | [`design-slop-cop/`](./design-slop-cop): pattern table and our prevalence count |
| Pixelslop | `gabelul/pixelslop` | `45cd615` (2026-08-25); npm 0.3.8 | `dist/skill/SKILL.md`, `dist/skill/resources/` | Apache-2.0 | [`pixelslop/`](./pixelslop): SKILL, pattern catalogue, scoring rubric |
| BoardUI | `BoardUI/boardui` | `ec5c5eb` (2026-10-03) | `AGENTS.md`, `styles/` | MIT (free tier) | [`boardui/`](./boardui): `AGENTS.md` |
| Compose Material 3 motion tokens | `android.googlesource.com/platform/frameworks/support` | `androidx-main` @ `badb0138c4` (2026-11-02) | `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/{Expressive,Standard}MotionTokens.kt` | Apache-2.0 | [`material-3/compose-motion/`](./material-3/compose-motion) |
| Impeccable (re-read) | `pbakaus/impeccable` | `687bc38` (2026-11-06) | `plugin/skills/impeccable/reference/{delight,bolder,overdrive,quieter}.md` | Apache-2.0 | [`impeccable/reference/`](./impeccable/reference): `delight.md`, `bolder.md` (added 2026-11-07) |
| Emil Kowalski's skills | `emilkowalski/skills` | `c8a7962` (2026-11-04) | `skills/{animate,find-animation-opportunities,emil-design-eng}/SKILL.md` | MIT | [`emil-kowalski-skills/`](./emil-kowalski-skills): three skills |
| Jakub Krehel's skills (`better-*`) | `jakubkrehel/skills` | `f41f027` (2026-11-07) | `skills/better-ui/`, `better-typography/`, `better-accessibility/`, `interface-review/` | MIT | not stored; cloned and scoped only, not yet compared |
| OpenAI skills | `openai/skills` | `49f948f` (2026-06-23) | `skills/.curated/figma-create-design-system-rules/` | per-skill | not stored (no frontend-design skill found) |

## From the sibling `prompts` collection

`jburnhams/prompts` @ `e5dcbf1`: design sections excerpted verbatim into
[`generator-prompts/design-sections.md`](./generator-prompts/design-sections.md) with
line ranges, from `leaked/lovable/`, `leaked/v0/`, `leaked/same-dev/`,
`leaked/emergent/`, `leaked/orchids/`, `leaked/google-gemini/`, `codex/gpt-5.2-codex_prompt.md`,
`leaked/amp/amp-code.md`. Claude's artifact and design skills are analysed from
`leaked/claude-code/artifact-skills/` (captured 2026-09-10) and from the
`artifact-design` skill as served in this session (2026-11-01); no text stored
([`claude-design-skills/`](./claude-design-skills)). Prior analysis reused:
`prompts/agent-generative-output.md` §9–§11.

## From the owner's apps (read 2026-11-12, for the comparison and voting design)

Read for [`ui-library/compare-and-decide.md`](./ui-library/compare-and-decide.md); nothing stored, the repos are the owner's and are linked from there. `jburnhams/strata-stills` @ `f35410e` (`src/stratastills/arena.py`, `server/arena.html`, `web/src/components/Loupe.tsx`), `jburnhams/strata-models` @ `6f4489b` (`web/src/components/EvalPage.tsx`, `PhrasePlayer.tsx`), `jburnhams/strata-listory` @ `65c2170` (`web/src/components/MatchQueuePage.tsx`, `useMatchReviewQueue.ts`, `src/app/linkage/queue.py`, `compare.py`), `jburnhams/bright-horizons` @ `a385191` (`web/src/screens/Review.tsx`, `Links.tsx`, `Face.tsx`).

## Web pages read

| Page | Via |
|---|---|
| https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics | WebFetch (then the repo notebook) |
| https://github.com/google-labs-code/design.md, https://github.com/JCarterJohnson/vibecoded-design-tells | WebFetch, then cloned |
| Search results for M3 Expressive, Stitch vibe design, Jonauskaite et al. 2020, anti-slop skills | WebSearch (snippets only; cited as such) |

### Read on 2026-11-02 (retry of blocked sources)

Pages that need JavaScript (m3.material.io, design.google, impeccable.style,
notboring.dev, the Stitch app, X) were rendered in stock headless Chromium; the rest
were read with WebFetch. Abstracts came from the Europe PMC REST API.

| Page | Via | Used in |
|---|---|---|
| https://adriankrebs.ch/blog/design-slop/, https://news.ycombinator.com/item?id=47864393, https://gigazine.net/gsc_news/en/20260423-design-slop/ | WebFetch | [`design-slop-cop/`](./design-slop-cop) |
| https://www.boardui.com/ | WebFetch | [`boardui/`](./boardui) |
| https://notboring.dev/, `/license`, `/c/button` | Browser | [`notboring/`](./notboring) |
| m3.material.io: `/blog/building-with-m3-expressive` (2025-05-13), `/blog/m3-expressive-motion-theming` (2025-05-20), `/blog/whats-new-at-io26` and `/blog/material-is-compose-first` (2026-05-19), `/styles/motion/overview/how-it-works`, `/styles/motion/overview/specs`, `/styles/shape/overview-principles`, `/styles/shape/corner-radius-scale`, `/styles/shape/shape-morph`, `/foundations/designing/motion` | Browser | [`ux-material-3.md`](./ux-material-3.md) |
| https://design.google/library/expressive-material-design-google-research | Browser | [`ux-material-3.md`](./ux-material-3.md) §1 |
| https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale, https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell, https://bottosson.github.io/posts/oklab/, https://oklch.com, https://harmonizer.evilmartians.com | WebFetch / browser | [`ux-colour-science.md`](./ux-colour-science.md) |
| Europe PMC records for Palmer and Schloss 2010 (doi:10.1073/pnas.0906172107) and Valdez and Mehrabian 1994 (doi:10.1037/0096-3445.123.4.394) | REST API (abstracts) | [`ux-colour-science.md`](./ux-colour-science.md) §6 |
| Sailop, Superdesign, OverlayQA, DEV (Alan West), prg.sh, HEY World (Kosta Canatselis), 925 Studios, Fountain Institute, Noqta, Bitdoze, impeccable.style `/slop` and `/docs`, blog.google Stitch launch | WebFetch / browser | [`web-articles/`](./web-articles) |

### Read on 2026-11-07 (character and delight)

| Page | Via | Used in |
|---|---|---|
| https://www.nngroup.com/articles/theory-user-delight/ (Fessenden, 2017) | WebFetch | [`ux-character.md`](./ux-character.md) §2, [`web-articles/`](./web-articles) |
| https://www.joshwcomeau.com/blog/whimsical-animations (2025, updated 2026-05-05) | WebFetch | [`ux-character.md`](./ux-character.md) §3 |
| https://rauno.me/craft/interaction-design (Freiberg, July 2023) | WebFetch | [`ux-character.md`](./ux-character.md) §3 |
| https://styleguide.mailchimp.com/voice-and-tone/ (CC BY-NC 4.0) | WebFetch | [`ux-character.md`](./ux-character.md) §3, §5.1 |
| Search results: Corporate Memphis criticism (Wikipedia mirrors, AIGA Eye on Design, Protocol via Slashdot); aesthetic-usability (Kurosu and Kashimura 1995, Tractinsky 1997, Tractinsky et al. 2000); humour in error messages (Science Says summary of a 2025 study) | WebSearch (snippets and summaries; cited as such) | [`ux-character.md`](./ux-character.md) §2, §4 |

### Read on 2026-11-13 (agent-operable interfaces)

| Page | Via | Used in |
|---|---|---|
| https://github.com/vercel-labs/ui (`main` @ `8ff6bcf`, 2026-11-13): README, AGENTS.md, contributing/README.md and pitfalls.md, the `ui-sdk` skill and its references, the agents docs | shallow `git clone` | [`ui-sdk/`](./ui-sdk), [`ui-library/agents.md`](./ui-library/agents.md) §4 |
