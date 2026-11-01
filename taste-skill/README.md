# taste-skill v2 (Leonxlnx)

- **Type**: Agent skill with Node scripts (direction dealer, real-browser inspector, linter) and a JSON library distilled from gallery sites
- **Licence**: MIT (`LICENSE`)
- **Source**: https://github.com/Leonxlnx/taste-skill, `main` @ `12af471` (2026-10-25)
- **Retrieved**: 2026-11-01

## Files stored

| File | What it is |
|---|---|
| `SKILL.md` | "The run": read the brief, inventory 8–12 subject-specific facts, write the page as claims plus proof, draw three directions from the library and choose one, find "the idea", one live thing, build, inspect, look and fix |
| `references/tells.md` | **The dated registry**: first wave (2023–24), second wave (2025), third wave (2025–26, "the fix that became the look"), gallery fashion, structural, copy and motion tells, and "why removal is not enough" |
| `references/research.md` | The study behind it: 248 sites (One Page Love and Awwwards, captured 2026-10-05), a panel of 21 model reviewers, top against weak frequencies for each device, plus a 100-site October study and a 23-screen app study |
| `references/app-screens.md` | The separate run for dashboards, admin, settings and inboxes: §13 house rules relaxed for apps, §14 **tells of generated dashboards** against what the 23 real screens do |
| `references/critique.md`, `copy.md`, `colour.md`, `type.md`, `layout.md` | Supporting references |

Not stored: `library/*.json` (about 1.8 MB of directions, palettes, heroes and
sections), `scripts/`, `assets/`, examples.

## What is distinctive

1. **It never names a replacement.** "It never names a replacement font, colour or
   component: every published 'use this instead' list has become the next wave of
   tells within months. Replacements here are procedures … not products." The
   Anthropic cookbook's history (see
   [`../anthropic-cookbook-frontend-aesthetics/`](../anthropic-cookbook-frontend-aesthetics))
   shows why.
2. **Randomness as a way out of the mode.** `draw.mjs` deals three of twenty
   researched directions and the model chooses among them, because "asked to invent
   a look, a model picks the category default every time."
3. **Measured frequencies, top against weak**, with an honest limits section
   (model jurors, still frames, one day, "fashion as much as quality"). Examples:
   centred statement hero 7% of top sites against 24% of weak sites; tiny tracked
   capitals 16% against 57%; but monospace labels 44% against 24% and index
   numbering 38% against 21%, so they are *more* common on the best sites. They are
   banned anyway, "by the owner's decision", and the skill says so openly.
4. **"Removal is not enough."** "Blind jurors rightly prefer a richer page with
   tells over an empty page without them." A page stripped of tells with nothing
   added is "an empty page with good manners", which it calls the *avoidance
   aesthetic*.
5. **Apps get their own rules.** 1px borders, small labels and rows of identical
   peer cards are *allowed* on app screens, with limits. Gradients, glows, icon
   chips on KPIs, sparklines on KPIs ("0 of 23"), rainbow charts and vanity
   numbers are not.

## Cautions

- The study's jurors are models scoring screenshots, not people using the site.
  Usability "does not rise with the rest: the best sites are no easier to use than
  the average one."
- Several bans (violet and indigo on app screens, monospace labels) are explicitly
  the owner's taste rather than findings.
