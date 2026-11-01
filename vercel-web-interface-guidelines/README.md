# Vercel Web Interface Guidelines

- **Type**: Guidelines (`AGENTS.md`) plus a review command (`command.md`), also packaged as the `web-design-guidelines` skill in `vercel-labs/agent-skills`
- **Licence**: MIT (`LICENSE`)
- **Source**: https://github.com/vercel-labs/web-interface-guidelines, `main` @ `434b7f9` (2026-10-05)
- **Retrieved**: 2026-11-01

## Files

- `AGENTS.md`: MUST, SHOULD and NEVER rules: keyboard, targets, forms, state and
  navigation, feedback, touch, animation, layout, content and accessibility,
  performance, theming, hydration, design.
- `command.md`: the `/web-interface-guidelines` review prompt. It reads the
  files, checks them against a condensed rule list, and outputs terse `file:line`
  findings grouped by file.

## Why it matters here

This is the **interaction-quality floor** for React apps, and it says
almost nothing about aesthetics. It is a different layer from every anti-slop
skill: a page can pass all of it and still be slop, and a distinctive page can
fail most of it. Its rules are mostly detectable in source (`transition-all`,
`outline-none` without `focus-visible`, `<div onClick>`, images without
dimensions, `user-scalable=no`, blocked paste, hard-coded date formats), which
is why [`../ux-design/`](../ux-design) borrows its anti-patterns for the linter's
`quality` category.

## Where it disagrees with the anti-slop sources

- **Casing.** "Title Case for headings/buttons (Chicago style)" (command.md).
  Anthropic `frontend-design`, avoid-ai-design CP5 and anti-ai-slop all prefer
  sentence case.
- **Elevation.** "SHOULD: Layered shadows (ambient + direct)" and "Crisp edges via
  semi-transparent borders + shadows." Impeccable registers
  `gpt-thin-border-wide-shadow` (a hairline border plus a wide diffuse shadow on a
  whole row of cards) as a generated-UI signature, and taste-skill's app rules say
  "a border or a shadow, never both".
- **Contrast metric.** "Prefer APCA over WCAG 2". Every other source here quotes
  WCAG 2 ratios (4.5:1 and 3:1).

These are reconciled in [`../ux-slop-taxonomy.md`](../ux-slop-taxonomy.md) §5.
