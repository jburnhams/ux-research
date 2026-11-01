# ux-research

Research into how AI agents design user interfaces, and what makes the result good UX
rather than "AI slop", with **React + Tailwind (and shadcn/ui)** as the target stack. It
is the companion to [`jburnhams/prompts`](https://github.com/jburnhams/prompts) and
follows the same structure: primary sources stored by source, cross-cutting synthesis
docs, and an original design built from them.

First pass: **2026-11-01**.

## Start here

**[→ `ux-slop-taxonomy.md`](./ux-slop-taxonomy.md)**: what AI slop in UI is, why it
happens (the stack's defaults are the corpus median), how it moves in **waves** (the
published fix becomes the next tell: purple gradients → eyebrows and glow →
cream + serif + terracotta → the handmade reflex), the full catalogue by layer with
detectability and severity, the slop-vs-quality split, the eleven places the sources
disagree and how each is resolved, and how strong the evidence is.

**[→ `ux-design/`](./ux-design)**: the output. A skill for React + Tailwind
([`SKILL.md`](./ux-design/skill/SKILL.md)), a dated tell registry, a mood-to-token
procedure, Operate-surface rules, a quality audit, a zero-dependency **source linter**
(`slop-lint`, 46 rules, mode-aware) and a **palette generator** (`palette.mjs`: seeds →
contrast-solved OKLCH ramps → shadcn/Tailwind v4 tokens → validation), with fixtures and
tests (`node --test ux-design/tests/*.test.mjs`).

## Synthesis docs

| Doc | Question it answers |
|---|---|
| [`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) | What are the tells, where did they come from, which sources disagree? |
| [`ux-generator-prompts.md`](./ux-generator-prompts.md) | How do Lovable, v0, Same, Emergent, Orchids, AI Studio, Codex/Amp and Anthropic prompt for design, and how do those prompts *cause* the look? Anthropic's four generations of anti-slop advice; the Codex frontend block that was dropped |
| [`ux-anti-slop-skills.md`](./ux-anti-slop-skills.md) | Ten anti-slop skills compared stage by stage: classify, ground, direct, rules, floor, verify, report |
| [`ux-react-tailwind.md`](./ux-react-tailwind.md) | Which layer of a React + Tailwind + shadcn app each design decision belongs in; Tailwind v4 specifics; the libraries that ship tells; what a linter can own |
| [`ux-product-ui.md`](./ux-product-ui.md) | Apps, dashboards, tables and forms: why landing-page rules misfire there, "the one question", generated-dashboard tells against 23 real screens, states |
| [`ux-material-3.md`](./ux-material-3.md) | Material 3 Expressive as of late 2026: spring motion tokens, the shape scale, the emphasized type scale, dynamic colour (HCT, ten scheme variants incl. the new two-seed CMF, contrast levels), and what transfers to Tailwind |
| [`ux-colour-science.md`](./ux-colour-science.md) | Colour spaces (OKLCH, HCT), WCAG vs APCA, four ways to build a scale, harmony, mechanical validation, CVD, preference and emotion research, dark mode |
| [`ux-mood-to-theme.md`](./ux-mood-to-theme.md) | Turning a concept, keyword, mood or vibe into a theme: seven approaches in the wild, evidence that mood vocabularies converge too, and the procedure used here |
| [`blocked-sources.md`](./blocked-sources.md) | Everything this pass could not reach or verify, for follow-up |
| [`sources.md`](./sources.md) | Repos, commits, paths and licences; fetch recipe |

## Primary sources

| Folder | Source | Licence |
|---|---|---|
| [`anthropic-frontend-design/`](./anthropic-frontend-design) | Anthropic `frontend-design` skill | Apache-2.0 |
| [`anthropic-cookbook-frontend-aesthetics/`](./anthropic-cookbook-frontend-aesthetics) | Anthropic's 2025 "distributional convergence" prompt | MIT |
| [`claude-design-skills/`](./claude-design-skills) | Claude `artifact-design`, Design canvas and `dataviz` skills (analysis only) | proprietary |
| [`impeccable/`](./impeccable) | Impeccable: modes, craft floor, 62-rule detector registry, 128 mood palette seeds | Apache-2.0 |
| [`taste-skill/`](./taste-skill) | taste-skill v2: dated tell registry, 248-site and 23-app-screen studies | MIT |
| [`avoid-ai-design/`](./avoid-ai-design) | The best-sourced tell catalogue (about 70 tells, severity × detectability) | MIT |
| [`anti-ai-slop/`](./anti-ai-slop), [`anti-slop-design/`](./anti-slop-design) | Two further anti-slop skills | MIT |
| [`vercel-web-interface-guidelines/`](./vercel-web-interface-guidelines) | Vercel's interaction-quality rules | MIT |
| [`shadcn-skill/`](./shadcn-skill) | shadcn/ui's own agent skill: theming through tokens and `cva` variants | MIT |
| [`google-design-md/`](./google-design-md) | Google DESIGN.md format and philosophy | Apache-2.0 |
| [`google-stitch-skills/`](./google-stitch-skills) | Google Stitch skills ("vibe" prompt enhancement, DESIGN.md extraction) | Apache-2.0 |
| [`material-3/`](./material-3) | Material 3 Expressive tokens and the colour engine | Apache-2.0 |
| [`vibecoded-design-tells/`](./vibecoded-design-tells) | Which tells Reddit users actually complain about (3.2M posts) | MIT (counts only) |
| [`generator-prompts/`](./generator-prompts) | Design sections of app-builder and coding-agent prompts, excerpted from `prompts` | see `prompts` |

## Findings worth knowing first

1. **Slop is mostly the stack as installed.** Tailwind UI's `bg-indigo-500`, shadcn's
   zinc theme and stock `--radius`, Geist from `create-next-app`, Lucide in tinted
   squares, Framer's `whileInView` fade-up. Most of the fix is a theming decision at
   the token and variant layer, not a component rewrite. shadcn's own blocks still
   ship "Acme Inc", "Welcome back" and `Sparkles` icons.
2. **Every published fix becomes the next tell.** The 2025 Anthropic cookbook
   recommended gradients, staggered reveals and Space Grotesk/Fraunces; all are on 2026
   tell lists. So the registry here is dated, and names what to avoid, never what to
   use instead.
3. **Some of the look is prompted.** Lovable's own "correct" example defines
   `--gradient-primary` at 135° with a `--primary-glow`; v0's transcript reaches for a
   bento grid right after its anti-generic brief tool.
4. **Mode decides the rules.** On app screens familiarity is a feature: Inter is fine,
   1px borders and small labels are fine, page-load choreography is not. Landing-page
   anti-slop rules over-flag dashboards.
5. **Removing tells isn't enough.** Blind judges prefer a richer page with tells to an
   empty page without them. The substance has to come from the subject.
6. **Adjectives describe a region, a reference describes a point.** Mood words should
   pick a specific reference from the subject's world. Even curated mood vocabularies
   converge (25% of Impeccable's 128 seed moods say "considered").
7. **People notice sameness first.** "All looks the same" and "screams AI" run at about
   13% of on-topic Reddit posts each, five times any specific tell; of the specific ones,
   kit defaults, purple, gradients, emoji and fade-ins dominate, and fonts and layout are
   rarely named.
8. **Accessibility belongs in the audit, not the brief.** Impeccable found design-time
   a11y reminders make models produce safer, more generic output; enforce the floor
   afterwards, mechanically.
9. **Equal-lightness "harmonious" chart palettes fail colour-blind users.** Worst-pair
   ΔE under protan/deutan simulation was 0.4–2.6 (target 8); lightness must vary.

## Candidates for the next pass

- Read the blocked sources ([`blocked-sources.md`](./blocked-sources.md)): boardui.com,
  notboring.dev, m3.material.io, the Krebs Show HN study.
- A browser engine for slop-lint (Playwright computed styles) for the render-only tells,
  and a comparison against Impeccable's detector on the same fixtures.
- Analyse taste-skill's `library/*.json` for hue, type and layout distribution.
- Material's shape morphing (`androidx.graphics.shapes`) and the M3 Expressive research.
- Run the evaluation in [`ux-design/README.md`](./ux-design/README.md) §6.
- Weekly pass, as in `prompts`: new skill releases, tell drift, new generator prompts.
