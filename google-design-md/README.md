# Google DESIGN.md format

- **Vendor**: Google Labs · **Licence**: Apache-2.0 (`LICENSE`) · **Status**: `alpha`
- **Source**: https://github.com/google-labs-code/design.md, `main` @ `6e5da53` (2026-10-16)
- **Retrieved**: 2026-11-01

## Files

| File | What it is |
|---|---|
| `PHILOSOPHY.md` | Why the format is prose-first: "The quality of a generated design is determined less by the precision of its values than by how clearly the intent is described"; "Adjectives describe a region. A specific reference describes a point"; negative constraints "arrive for free when the reference is specific enough" |
| `spec.md` | The format: YAML tokens (`colors`, `typography`, `rounded`, `spacing`, `components`, `{path.to.token}` references) plus ordered `##` prose sections (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts) |
| `example-paws-and-paths.*` | A worked example: DESIGN.md, its `design_tokens.json` and a generated `tailwind.config.js` |

The CLI (`npx @google/design.md lint` and `diff`) runs eleven rules: broken
references, missing primary colour or typography, component colour pairs under WCAG AA
4.5:1, unused tokens, section order and key typos. `diff` flags token regressions
between versions, which catches design-system drift in review.

## Why it matters here

DESIGN.md has become the common **contract file** between a design direction and the
agents that build against it. It is read by Stitch, the shadcn skill
(`design-system.md`), avoid-ai-design (X1 "drift"), Impeccable (`document`, the
`design-system-*` detector rules) and the Stitch `taste-design` skill.
[`../ux-design/`](../ux-design) uses it as the place the direction, its rationale and
its do's and don'ts live, with `globals.css` generated from its tokens.

Note: the philosophy's own example ("warmed xerox stock" `#F4F0E4` with a vermilion
accent) sits at OKLab ΔE×100 0.76 from Anthropic's cluster-1 cream. A specific
reference can still land on a stock look; see
[`../ux-mood-to-theme.md`](../ux-mood-to-theme.md) §3.
