# avoid-ai-design (funboy322 / ungspirit)

- **Type**: Agent skill with a zero-dependency scanner (`scripts/detect.mjs`, not stored)
- **Licence**: MIT (`LICENSE`)
- **Source**: https://github.com/funboy322/avoid-ai-design, `main` @ `2b7c718` (2026-09-24)
- **Retrieved**: 2026-11-01

## Files stored

| File | What it is |
|---|---|
| `SKILL.md` | Audit-then-rewrite workflow |
| `ai-tells-catalog.md` | **The best-sourced tell catalogue in this collection**: about 70 tells in 12 categories, each with a detection signal, why it reads as AI, and a fix for plain CSS *and* React/Tailwind/shadcn; P0, P1 and P2 severity; how it is detected (scanner, render or judgement); a "what not to over-flag" section; 23 cited sources |

## What is distinctive

1. **Severity by who notices.** "P0: a layperson recognizes it as AI-made. P1: a
   designer or developer does. P2: craft and polish."
2. **Detectability is labelled on every tell**: ⚙ found in source by the scanner,
   👁 needs the render, 🧠 needs judgement. That split decides what a linter can
   own and what has to stay with the model or a person.
3. **Orders of default.** First order is the median (purple gradient, Inter,
   untouched shadcn). Second order is "the tasteful escape" (Anthropic's five
   clusters). It also flags a third order forming: the handmade "anti-AI"
   reaction (grain, hand-drawn type, scrapbook collage).
4. **Cross-page drift (X1) is a distinct failure from slop.** "Slop is
   convergence: every site looks the same. Drift is divergence from your own
   system." The fix is a token contract (Google's `DESIGN.md`) reused on every
   page.
5. **It cites evidence for what people actually notice.** A Reddit study (3.2M
   posts across 47 subreddits) ranks shadcn/Tailwind defaults and the indigo
   gradient highest, and glassmorphism, bento and aurora low or rejected. So
   "spend attention on the tells people actually recognize, not the ones they only
   assume."
6. **It never accuses.** "A tell is evidence of a default nobody chose, not proof
   that a model made the page … The fix is the same whoever defaulted."

The per-pattern percentages come from Adrian Krebs's Playwright study of
about 1,400 Show HN sites (`adriankrebs.ch/blog/design-slop/`). That host was
outside this session's network allowlist, so the figures are quoted second-hand
from this catalogue.
