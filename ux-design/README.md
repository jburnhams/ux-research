# ux-design: a skill for non-generic React + Tailwind UI

The output of this research, in the same role as `prompts/agent-design/` (Forge): a
concrete design built from the patterns catalogued in the rest of this repo, rather
than invented from scratch. Three parts:

| Part | What it is |
|---|---|
| [`skill/SKILL.md`](skill/SKILL.md) | The agent skill: mode → subject → direction → character → token contract → build through the layers → check → hand over |
| [`skill/references/`](skill/references) | `tells.md` (dated registry, now with playful slop), `direction.md` (mood/vibe → tokens), `character.md` (personality by frequency, the moment, the swap test), `product-ui.md` (Operate surfaces), `audit.md` (quality floor) |
| [`skill/scripts/slop-lint.mjs`](skill/scripts/slop-lint.mjs) | Zero-dependency source linter: 50 file rules + 1 project rule (five playful-slop rules added 2026-11-07), `slop` (P0/P1/P2) vs `quality` (error/warn), mode-aware, inline disables, `.sloplintrc.json` allowances with reasons |
| [`skill/scripts/palette.mjs`](skill/scripts/palette.mjs) | Seeds → contrast-solved 12-step OKLCH ramps → shadcn/Tailwind v4 roles (light + dark) → validation (WCAG, CVD-safe charts, tell clusters, dislike, second-job) |
| [`skill/assets/DESIGN.template.md`](skill/assets/DESIGN.template.md) | DESIGN.md (Google format) with the reference sentence, reasons and lint allowances |
| [`fixtures/`](fixtures) + [`tests/`](tests) | A deliberately sloppy landing page, a playful-slop settings screen and a clean Operate screen; `node --test ux-design/tests/*.test.mjs` |

## 1. Starting brief

- React + Tailwind (v4) + usually shadcn/ui; agent-built.
- Good UX first, and specifically: avoid what is now read as AI slop, without
  over-correcting into the next set of tells or into empty pages.
- Cover landing pages *and* app screens; cover colour science and mood-to-theme.

## 2. Decisions and where they came from

| # | Decision | Taken from | Instead of |
|---|---|---|---|
| 1 | **Classify mode first** (Persuade/Operate/Read/Experience) and treatment (utilitarian/editorial); most rules are conditional on it | Impeccable modes; Claude `artifact-design` treatments | One rule set for every surface (over-flags dashboards) |
| 2 | **Subject inventory + competitor test**; Operate screens start from "the one question" and "the one finding" | taste-skill run and app study | Mood adjectives as the input |
| 3 | **Three reference sentences, diverging on named axes**, human picks when present | DESIGN.md philosophy ("a point, not a region"); Claude Design canvas ("not for them"); anti-ai-slop set divergence | A single model-picked direction; a style menu |
| 4 | **Token contract in DESIGN.md + Tailwind v4 `@theme`, generated where arithmetic allows** | shadcn `design-system.md`; Google DESIGN.md; Claude `dataviz` validator; Material dynamic colour; Leonardo/Harmonizer contrast targeting; Radix step jobs | Hand-picked hex; HSL scales; recommend-lists of fonts |
| 5 | **Build through layers; `className` for layout only; restyle via `cva`** | shadcn skill | Same.dev-style per-component hand edits; call-site colour |
| 6 | **Dated avoid-registry, never a replacement list; the brief always wins** | taste-skill dated tells; Anthropic `frontend-design` override clause | Timeless "never use X" lists; named replacement fonts (which became tells) |
| 7 | **Quality floor enforced in a separate audit, not in the design prompt** | Impeccable's eval finding (a11y reminders at design time make output safer and generic) | Mixing the floor into the creative instructions |
| 8 | **Deterministic linter for source-visible tells; one bounded render look for the rest; second pass may only refine or remove** | Impeccable detector + hook; avoid-ai-design's ⚙/👁/🧠 split; artifact-design's one-look rule; canvas-design's subtract-only revision | Unbounded screenshot loops; judging by eye alone |
| 9 | **"Removal is not the fix"**: a clean lint on a thin page sends you back to the inventory | taste-skill blind tests | Treating zero findings as success |
| 10 | **Decision log in DESIGN.md, one sentence in chat** | anti-slop-design "state your choices"; artifact-design's one-sentence handover | Long design rationales in the reply |

Not adopted: a dealt direction library (taste-skill, Impeccable): it works, but it is
a maintained dataset (Impeccable's is private and paid); the human-pick path and the
divergence check are the cheap substitute, and a library can be added later behind the
same step. Named replacement font lists (anti-ai-slop `toolkit.md`, the 2025 cookbook):
rejected for the reason in §6.

## 3. What the linter covers

`slop` (defaults nobody chose; the brief may allow any with a reason):
colour/surface (`ai-palette`, `default-gradient`, `gradient-text`, `glow-shadow`,
`radial-glow`, `side-stripe`, `dark-saas-card`, `glass`, `tell-colour`,
`untouched-shadcn`), type (`overused-font` [persuade only], `eyebrow` [1 allowed on
operate], `accent-word`, `mono-costume`), components (`icon-chip`, `window-chrome`,
`stock-effect`, `worn-icons`, `numbered-markers`, `hero-badge`), motion
(`fade-up-everywhere`, `bounce-easing`, `pulse-dot`), copy (`buzzword`, `not-just`,
`tricolon`, `arrow-label`, `emoji-icon`, `generic-cta`, `placeholder-identity`,
`vanity-stat`, `welcome-greeting`, `middot-meta`, `em-dash-density`).

`quality` (defects; not overridable by taste): `transition-all`, `outline-none`,
`div-onclick`, `img-dimensions`, `img-alt`, `zoom-disabled`, `paste-blocked`,
`icon-button-label`, `dark-override`, `token-bypass`, `autofocus`, and the project-level
`reduced-motion`.

**Calibration run** against shadcn's own `new-york-v4` registry (62 `ui` files + 103
`blocks` files, 2026-11-01) in operate mode: the `blocks` findings were genuine. The
blocks themselves ship "Acme Inc", "Welcome back", `Sparkles`/`Rocket` imports and
"Learn more", which is direct evidence of how these defaults propagate into generated
apps. In `ui`, the residual hits are the kit's own icon-in-tinted-square media slots
(`Empty`, `Avatar`, `AlertDialog`; correct detections of where the K6 chip comes from),
`outline-none` on containers whose focus is shown by a parent (downgraded to warn), and
one false positive on calendar day buttons (`icon-button-label`).

## 4. What the palette generator does

1. 12 functional steps per hue (Radix jobs), each **solved for a contrast target** in
   OKLCH against the ground (Leonardo/Harmonizer approach), chroma shaped per step and
   gamut-mapped by chroma reduction; text steps solved against the busiest fill they sit on.
2. Neutrals tinted toward the primary at chroma ≤ 0.02.
3. shadcn roles for light and dark, `@theme inline` registration, full ramps exposed as
   `--primary-1…12` etc.
4. Chart palette by farthest-point search over hue × lightness, scored against both
   normal-vision (ΔE×100 ≥ 15) and protan/deutan (≥ 8) gates.
5. Validation: body/muted/label/input/ring contrast (FAIL), chart separation (FAIL/WARN),
   tell clusters (WARN), dislike (WARN), second-job hue distance (WARN), neutral chroma (WARN).

Finding from building it: equal-L, equal-C categorical hues (a common "harmony" rule)
gave worst-pair CVD ΔE×100 of 0.4–2.6; lightness variation is required for chart
palettes. All 27 seed × contrast-level combinations in the test pass every gate.

## 5. Known limits

- Regex over source, not an AST: class strings built dynamically (`` `bg-${tone}-500` ``)
  and copy loaded from CMS/i18n files are invisible.
- Render-only tells (palette dominance, rhythm, hierarchy, centring ratio, broadsheet
  cosplay, ghost cards) need the look in step 6; a browser pass (Playwright computed
  styles, as taste-skill `inspect.mjs` and Impeccable's browser engine do) is the
  obvious next addition.
- The OKLCH dislike check approximates Material's HCT rule.
- APCA is not computed (licence); WCAG 2 is the gate.
- The registry is dated 2026-11 and needs a quarterly pass.

## 6. Evaluation plan (proposed)

No source has a controlled study with human raters, so the evaluation is the open gap
(`ux-slop-taxonomy.md` §6). A proposal in the spirit of `prompts/agent-design/eval.md`:

1. **Briefs**: 24 matched briefs: 8 Persuade, 12 Operate (dashboard, table, settings,
   form, editor), 4 Read; each with a written subject and no visual direction, plus 6
   with a pinned direction that *is* a tell (cream + serif; purple) to test the
   brief-wins override.
2. **Arms**: base model; base + Anthropic `frontend-design`; base + this skill; base +
   this skill without the linter step; (optionally) Impeccable, taste-skill.
3. **Measures**:
   - *Blind human pairwise preference* ("which would you ship?") and *"looks AI-made"*
     rating (1–5), from designers and from non-designers separately (the Reddit data
     says they notice different tells).
   - *Task success* on Operate screens: time and errors on two scripted tasks with 5
     participants per arm (usability is the axis gallery-style judging misses).
   - *Mechanical*: slop-lint distinct-rule count, quality errors, audit checklist pass
     rate, render failures (blank page, console errors).
   - *Divergence*: pairwise similarity of the 24 outputs within an arm (palette ΔE,
     type classification, layout silhouette), since slop is convergence.
   - *Override fidelity*: on the 6 pinned briefs, did it build the asked-for look well?
4. **Success**: this skill beats the frontend-design arm on "looks AI-made" and on
   divergence without losing on task success or preference; the no-linter ablation
   shows what the deterministic step is worth.
