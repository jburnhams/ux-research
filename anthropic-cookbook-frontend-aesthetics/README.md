# Anthropic cookbook: "Prompting for frontend aesthetics"

- **Type**: Cookbook notebook (prompt plus harness) · **Vendor**: Anthropic · **Licence**: MIT (`LICENSE`)
- **Source**: https://github.com/anthropics/claude-cookbooks, `coding/prompting_for_frontend_aesthetics.ipynb`, `main` @ `c43f56d` (2026-10-29)
- **Also published at**: https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
- **Retrieved**: 2026-11-01

## Files

- `prompting_for_frontend_aesthetics.md`: the notebook converted to
  Markdown. Markdown cells are verbatim and code cells are fenced. The
  screenshot PNGs the notebook references (baseline against distilled, for
  a SaaS page, a portfolio and a dashboard) are not copied.

## What it contains

- `DISTILLED_AESTHETICS_PROMPT`: the system-prompt block that names
  "distributional convergence" ("You tend to converge toward generic, 'on
  distribution' outputs. In frontend design, this creates what users call the
  'AI slop' aesthetic") and gives four steering dimensions: typography,
  colour and theme, motion, and backgrounds.
- Isolated single-dimension prompts: `TYPOGRAPHY_PROMPT` (with a named font
  menu) and a `SOLARPUNK_THEME_PROMPT` theme-lock example.
- Three strategies: guide specific dimensions, reference inspirations
  ("IDE themes and cultural aesthetics"), and call out defaults.

## Why it matters here

It is the **first-generation anti-slop prompt**, and the clearest record
of how anti-slop advice ages:

| Cookbook advice | What happened next |
|---|---|
| "Layer CSS gradients, use geometric patterns" for atmosphere | Impeccable's `radial-halo`, `radial-spotlight-glow`, `codex-grid-background` and `repeating-stripes-gradient` rules; taste-skill bans gradients on grounds |
| "One well-orchestrated page load with staggered reveals" | `frontend-design` now says fade-and-slide-up entrances "read as AI-generated"; avoid-ai-design M1 |
| Font menu: Space Grotesk, JetBrains Mono, Fraunces, Playfair, Bricolage Grotesque… | Fraunces and Space Grotesk are now on Impeccable's `overused-font` list; avoid-ai-design T2 lists the cluster at about 15.8% of Show HN sites |
| "Draw from IDE themes" | The near-black, one-acid-accent, monospace look is now `frontend-design`'s second cluster |

The notebook also contradicts itself on fonts. The distilled prompt
warns that "You still tend to converge on common choices (Space Grotesk, for
example)", and the typography prompt then lists Space Grotesk under "Code
aesthetic". The same pattern runs through most of
[`../ux-slop-taxonomy.md`](../ux-slop-taxonomy.md): **a named replacement
becomes the next default.**
