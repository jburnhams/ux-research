# vibecoded-design-tells (J. Carter Johnson): what people actually complain about

- **Type**: Data study of public Reddit posts and comments about AI-built sites
- **Licence**: code MIT (`LICENSE`); Reddit text belongs to its authors (`DATA_NOTE.md`). **Only the aggregate count CSVs are stored here**, no post or comment text.
- **Source**: https://github.com/JCarterJohnson/vibecoded-design-tells, `main` @ `f7c4aef` (2026-06-23), `unslop-ai-ui/`
- **Retrieved**: 2026-11-01

## Method (from the repo)

3,214,533 posts scanned across 47 AI and SaaS subreddits (2020–2026), from the Arctic
Shift archive; 46,971 on-topic posts about AI-built sites; 3,033 comments from 125
canonical threads. A synonym lexicon tags each tell over a design-context subset. An
adversarial verification pass held 11 of 12 top tells; "mesh / blob / aurora" was
rejected as a keyword artefact. The author: the relative order is more reliable than
the percentages.

## Files

- `tell_counts.csv`: post-level, share of design-context posts, with negative-sentiment share.
- `comment_tell_counts.csv`: comment-level, from the canonical threads.

## The two rankings

| Tell | Posts: share (rank) | Comments: share (rank) | Negative share of posts |
|---|---|---|---|
| "All looks the same" / template | 13.1% (1) | 6.1% (2) | 91% |
| "Screams AI" / slop | 13.0% (2) | 6.4% (1) | 48% |
| Emoji / ✨ / 🚀 in copy | **2.7% (3)** | 0.5% (9) | 33% |
| shadcn / Tailwind default kit | 2.2% (4) | **2.5% (3)** | 41% |
| Too many animations / Framer fade-ins | 2.0% (5) | 1.1% (6) | 40% |
| Three-column feature cards | 1.6% (6) | 0.4% (11) | 41% |
| Dark mode + neon glow | 1.3% (7) | 0.7% (8) | 41% |
| Gradients / gradient text | 1.2% (8) | 2.0% (5) | 59% |
| Stock illustrations | 0.9% (9) | 0.2% | 40% |
| Purple / violet | 0.7% (10) | **2.3% (4)** | **68%** |
| Same hero (huge headline, 2 buttons) | 0.6% | 0.2% | 43% |
| Centred everything | 0.5% | 0.2% | 39% |
| Rounded corners / pills | 0.5% | 0.8% (7) | 50% |
| Generic sans (Inter / Geist) | 0.4% | 0.4% | 57% |
| Glassmorphism | 0.3% | 0.2% | 66% |
| Bento grid | 0.1% | 0.1% | 62% |

## Reading it

- The dominant complaint is **sameness itself**, at five times any specific tell. People
  notice that sites look alike before they can name why. This supports the
  taxonomy's framing of slop as "a default nobody chose" rather than a fixed set of
  patterns.
- Of the specific tells, the **kit defaults** (shadcn and Tailwind), **purple**,
  **gradients**, **emoji** and **fade-in animation** are what people name. Purple is
  mentioned less often in posts but draws the most negative sentiment (68%).
- Typography (Inter and Geist) and layout tells (bento, centred, three cards) are
  rarely named by commenters, even though designer-written catalogues weight them
  heavily. That fits avoid-ai-design's severity split: P0 is what a layperson notices
  (colour, emoji, the kit), and P1 is what a designer notices (type, structure).
- avoid-ai-design's summary ("shadcn/Tailwind defaults and the indigo gradient rank
  highest") matches the **comment** ranking; the **post** ranking puts emoji first among
  specific tells.
