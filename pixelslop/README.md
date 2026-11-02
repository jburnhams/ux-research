# Pixelslop (gabelul / Booplex)

- **Type**: Agent skill plus subagents for Claude Code and Codex CLI. It opens the
  real page in Playwright at three viewports, extracts computed styles and contrast,
  checks a catalogue of AI-slop patterns, scores five pillars, evaluates through eight
  user personas, and can run a fix loop with git checkpoints and rollback.
- **Licence**: Apache-2.0 (`LICENSE`). Its `NOTICE` says it adapts "anti-pattern
  detection lists, design quality guidelines" from Anthropic's `frontend-design`
  skill.
- **Source**: https://github.com/gabelul/pixelslop, `main` @ `45cd615` (2026-08-25);
  npm `pixelslop` 0.3.8 (2026-07-16), whose `dist/skill/resources/ai-slop-patterns.md`
  was the URL listed in the first pass's blocked sources
- **Retrieved**: 2026-11-02

## Files stored

| File | What it is |
|---|---|
| `SKILL.md` | The entry skill: resolve the URL, configure the run, hand off to the orchestrator, fix loop, cleanup. Defaults to exhaustive (`--fast` opts out) because "an AI agent … won't remember to pass `--thorough`" |
| `ai-slop-patterns.md` | **The pattern catalogue**: 26 visual patterns (each with a JS detection snippet, screenshot cues and severity 1–3), 16 source patterns (`S1`–`S16`, grep-based), severity bands and false-positive guidance |
| `scoring.md` | The five-pillar rubric (Hierarchy, Typography, Color, Responsiveness, Accessibility), 1–4 each, every score tied to named browser evidence |

Not stored: the eleven agent specs (`dist/agents/`), the other skill resources
(`typeset`, `colorize`, `arrange`, `harden`, `clarify`, `distill`, `adapt`,
`cognitive-load`, `heuristics`, `interaction-design`, `visual-eval`,
`evidence-schema`), the personas, the CLI and the 850+ tests.

## What is distinctive

1. **Render first, read source second.** Visual patterns are measured in the page;
   source patterns are "supplementary signals, not added to the count", because "a
   page can grep dirty but render clean". That is the opposite emphasis to this
   collection's `slop-lint`, and the right one for render-only tells.
2. **Severity per pattern and a count-based band**, the same idea as Krebs's tiers
   ([`../design-slop-cop/`](../design-slop-cop)): CLEAN 0–1, MILD 2–3, SLOPPY 4–6,
   TERMINAL 7+. Severity 3 ("strong fingerprint") is reserved for gradient text, dark
   with glowing accents, cyan-on-dark, and the hero-metric layout.
3. **Evidence or no score.** "Every single score must cite specific browser evidence
   … If you cannot point to a concrete observation that justifies the score, you do
   not have enough information to assign one." Each pillar level lists the
   measurements that justify it (heading sizes within 4px of each other, CTA weight
   against neighbours, line length, and so on).
4. **Personas as lenses**: screen-reader, low-vision, keyboard, rushed-mobile,
   slow-connection, non-native-English, design-critic, first-time-visitor. Their
   findings map back to the same fix categories; custom personas are JSON files.
5. **False-positive guidance by context**, close to Impeccable's: Inter on a
   developer tool, dark mode, cards on a dashboard, centred landing pages and modals
   for destructive confirmation are all legitimate. "Defaults are slop. Choices are
   design."

## Relation to other sources

The catalogue's names and order overlap heavily with Impeccable's rule set (hero
metric layout, identical card grids, nested cards, side-tab accent borders, bounce
easing, modal overuse, gray text on colour), so treat it as a descendant of the same
lineage rather than independent evidence. What it adds: **cyan-on-dark** and
**neon-on-dark** as separate palette tells, **decorative sparklines with no data**,
**monospace for "tech vibes"**, **redundant heading-and-subtitle copy**, **every
button primary**, and **uniform hover-zoom on images**. It has no prevalence data.

Two defects worth knowing if you copy its snippets: the README says 25 patterns while
the catalogue has 26, and pattern 4's guard tests `!isDark` (a function reference)
instead of `!isDark()`, so it never fires.

Compared in [`../ux-anti-slop-skills.md`](../ux-anti-slop-skills.md) (source table and §5).
