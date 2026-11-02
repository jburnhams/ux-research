# Design Slop Cop (Adrian Krebs): the Show HN study

- **Type**: A measured study plus its open detector. A headless browser loads each
  landing page, an in-page script reads the DOM and computed styles, and each pattern
  is a deterministic check. No screenshots are judged and no model scores the visuals.
- **Licence**: MIT (`LICENSE`), code and data
- **Sources**:
  - Blog post: https://adriankrebs.ch/blog/design-slop/ ("Scoring Show HN submissions
    for AI design patterns", April 20, 2026; marked human-written, with scoring and
    analysis AI-assisted)
  - Repo: https://github.com/AdrianKrebs/design-slop-cop, `main` @ `e2fab6c` (2026-07-07)
  - Live scanner and gallery: https://slopcop.adriankrebs.ch, `/show`, `/patterns`
  - HN discussion: https://news.ycombinator.com/item?id=47864393 (333 points, 235 comments)
  - GIGAZINE write-up, April 23, 2026: https://gigazine.net/gsc_news/en/20260423-design-slop/
- **Retrieved**: 2026-11-02. Until then this collection quoted the study second-hand
  through [`../avoid-ai-design/ai-tells-catalog.md`](../avoid-ai-design/ai-tells-catalog.md).

## Files stored

| File | What it is |
|---|---|
| `patterns.tsv` | The 14 detector patterns: id, label, description, category, and the rule summarised from `src/patterns/<id>.js` with its thresholds (extracted by us) |
| `prevalence.csv` | **Computed by us** from the repo's `results/tier-{clean,mild,heavy}.json`: how many of the 1,390 scored sites each pattern flagged, plus the human labels for that pattern in `dataset/labels.jsonl` (190 labelled sites, latest record per site) |
| `LICENSE` | MIT |

The detector code, the screenshots and the per-site results are not stored. Clone the
repo to re-run it (`node check.js <url> --json`).

## The study has three versions, and the numbers differ

This matters because the percentages quoted across this collection came from the
first one.

| Version | Sample | Patterns | Tiers |
|---|---|---|---|
| **1. As first published** (April 20–23, 2026; reported by GIGAZINE and quoted by dang in the HN thread) | 500 Show HN posts | 15 | Heavy (5+) 21% (105), Mild (2–4) 46% (230), Clean (0–1) 33% (165) |
| **2. The blog post as it reads now** | "About 1,400" in the intro, **1,590** in the results, "from the last few weeks" | "16", though 18 items are listed | High (4+) 22% (347), Medium (2–3) 32% (508), Low (0–1) 46% (735) |
| **3. The repo snapshot** (`results/`, posts dated 2026-04-10 to 2026-05-09, 21 undated) | 1,390 sites | 14 in the README and registry; the results also carry a retired `all_caps_headings` | Under the old tiers: heavy (4+) 283 (20%), mild (2–3) 452 (33%), clean (0–1) 655 (47%). `src/score.js` now uses 5+ High, 3–4 Medium, 1–2 Low, 0 None |

**Per-pattern rates, version 1 against version 3**:

| Pattern | v1, 500 sites (GIGAZINE) | v3, 1,390 sites (our count from the repo) |
|---|---|---|
| Gradients | 28% | 26.0% |
| shadcn/ui unmodified | 23.5% | not a detector pattern any more (`shadcn_signature` survives only in the labels) |
| Centered hero | 23.5% | 20.9% |
| Perma dark mode | 20.3% | **34.7%** |
| Icon card grid | 20.1% | 21.7% (retired from the current registry) |
| Glassmorphism | 17.1% | 14.0% |
| Templated fonts | 15.8% | 10.4% |
| Accent stripe | 13% | 6.3% |
| Stat banner | 12.2% | 5.0% |
| Purple / indigo CTA | 10.7% | 5.4% |
| All-caps labels | 10.5% | 9.4% (retired) |
| Numbered steps | 9.4% | 16.3% |
| Headline badge | 4.7% | 16.5% |
| Coloured glow | 4.3% | 5.4% |
| Emoji nav | 3.8% | 1.4% |
| FAQ accordion | not in v1 | 14.2% |
| Hero font mix | not in v1 | not in the results; added later |

Some of the movement is the larger sample and some is rule tuning (the headline-badge
rule now also catches faint "ghost pills" and small-caps eyebrows; the purple rule
now needs a *filled* purple element; the accent stripe needs a saturated colour). So
**treat any single percentage as approximate and version-bound**, and prefer the
ranking. Three patterns are robustly common in this sample: dark-with-grey-text,
gradients, and the centered hero with an icon-card grid. Purple, which the folk
account puts first, is about 5–11%.

## What is distinctive

1. **It measures defaults, not authorship.** Krebs: a single pattern proves nothing,
   so sites are tiered by count; the detector "measures style defaults rather than
   authorship". AI-style design is "uninspired" rather than bad, and pre-LLM sites
   looked like Bootstrap templates.
2. **Everything is a computed-style check.** Each pattern is one file with
   `extract(ctx)` (runs in the browser) and `score(signal, T)` (runs in Node), with
   named thresholds. That is the architecture this collection's
   [`slop-lint`](../ux-design) lacks for render-only tells, and the obvious template
   for adding a browser engine to it.
3. **It ships a ground-truth set and an eval.** 190 labelled sites (`present` /
   `not_present` / `skip` per pattern), `npm run eval` for precision and recall, and
   a balanced 50 (25 well-known sites, 25 Show HN) for verdict labelling. The README
   puts false positives at about 5–10% "across ~150 labeled sites". In the labels,
   the patterns humans most often rejected were the accent stripe (19 present,
   11 not), sidebar emoji (3, 3) and all-caps headings (17, 7), which is probably why
   two of those were retired. The labels were taken mostly on flagged sites, so they
   say more about precision than about recall.
4. **The font list came from designers on Reddit** (an r/UXDesign thread): Space
   Grotesk, Instrument Serif, Fraunces, Bricolage Grotesque, Sora, Young Serif, Bodoni,
   Syne. It matches only when the face is the page default (heading font, or at least
   25% of body text), not a one-word accent.
5. **The origin claim is n = 1.** The study began from one designer's remark that
   coloured left borders are "almost as reliable a sign of AI-generated design as
   em-dashes are for text"; Krebs then asked other designers for patterns. A
   commenter in the HN thread made exactly this objection ("possibly Baader-Meinhof").

## The HN discussion (all 235 comments read)

Positions, in rough order of volume:

- **"It's the stack, not the model."** port11: the patterns "come from the obsession
  with Tailwind"; forgotTheLast: "more of a NextJs thing than an LLM thing"; several
  note rounded cards predate AI. userbinator: "the AI has learned what the average
  webpage looks like."
- **Contrast and accessibility** drew the longest sub-thread: dark sites in "various
  shades of dark brown or beige" with marginal body text. simonw reports that adding
  "make sure it has good accessibility" to the prompt works.
- **Design as a proxy for effort**, not for AI: "no commitment and little thought to
  what's being shown" (tptacek); a "sloppification" score as an indicator of
  oversights (ofjcihen).
- **Pushback on the method**: no baseline run on pre-2023 Show HN posts, script not yet
  released at the time (it is now), and "these patterns were already very common
  before AI" (nomdep).
- **Extra tells named**: coloured left borders, "tags and superfluous numbers"
  (joegibbs), the beige scheme that replaced Tailwind purple (ChrisArchitect, about
  the study's own blog), the slop-font list, low-contrast dark text, default
  shadcn output.
- Krebs did not comment; the submitter changed the title after simonw objected to
  "vibe coded".

## How it is used here

- [`../ux-slop-taxonomy.md`](../ux-slop-taxonomy.md) §6 now cites this folder directly
  and flags which figures are version 1.
- `prevalence.csv` replaces second-hand percentages where a current figure is wanted.
- `patterns.tsv` is the reference for porting render-only rules into `slop-lint`.
