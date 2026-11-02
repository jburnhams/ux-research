# shadcn/ui agent skill

- **Type**: Agent skill shipped in the shadcn/ui repo (`skills/shadcn/`), injected with live project context via `npx shadcn@latest info --json`
- **Licence**: MIT (`LICENSE.md`)
- **Source**: https://github.com/shadcn-ui/ui/tree/main/skills/shadcn, `main` @ `c0d63c3` (2026-11-01)
- **Retrieved**: 2026-11-01

## Files stored

| File | What it is |
|---|---|
| `SKILL.md` | Principles, critical rules (styling, forms, composition, icons, chat), component selection table, workflow, preset switching, design systems from `DESIGN.md` |
| `design-system.md` | DESIGN.md to themed app: role mapping onto shadcn variables, radius pinned per class, elevation, fonts, `type-*` utilities, dark mode, focus, restyling through `cva` variants, control heights moving together, verification |
| `customization.md` | Theming, CSS variables, the four ways to customise a component (variant, className, new variant, wrapper) |
| `rules/styling.md`, `rules/composition.md` | Incorrect and correct code pairs |

## Why it matters here

shadcn is the single largest source of the "untouched kit" look. avoid-ai-design
K1 puts unmodified shadcn defaults on about 23.5% of the Show HN sites, and the
Reddit study ranks them first. Yet the vendor's own skill tells agents *not* to
restyle components ad hoc: "`className` for layout, not styling. Never override
component colors or typography." That reads like a recipe for the default look,
but `design-system.md` resolves it. Distinctiveness belongs **in the theme and
the variants**, not in call-site classes:

- map every brand role onto the semantic variables (`--primary`, `--muted`,
  `--accent` and so on) in the one `tailwindCssFile`;
- pin each `rounded-*` step the components use, rather than trusting the
  `--radius` multiplier;
- override the shadow scale in `@theme`;
- turn type tokens into `@utility type-*` classes (because `cn()` treats unknown
  `text-*` classes as colours and drops one);
- restyle by editing `cva` variants in the installed source, keeping the variant
  names;
- "control heights move together": change the button and every field together or
  forms misalign.

That layering (tokens, then variants, then composition, with className for
layout only) is the backbone of the React and Tailwind guidance in
[`../ux-react-tailwind.md`](../ux-react-tailwind.md) and
[`../ux-design/`](../ux-design).

Contrast with Same.dev's prompt ("NEVER stay with default shadcn/ui components …
BEFORE building the main application, **edit** each one of them"), which gets
the goal right and the layer wrong.
