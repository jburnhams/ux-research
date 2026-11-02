# React and Tailwind: where the defaults live and where to change them

Most generated slop in a React and Tailwind codebase is the stack as installed
([`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §1). This doc maps each design
decision to the **layer** of the stack where it belongs, so a distinctive design
lives in one place and every component inherits it, instead of being scattered as
call-site classes that drift.

## 1. The layers

```
 1. Brief / DESIGN.md        why: subject, mode, direction, do's and don'ts   (prose)
 2. Theme tokens             what: @theme / :root CSS variables             (globals.css)
 3. Primitive variants       how components use tokens: cva variants        (components/ui/*)
 4. Composition              which components, in what structure            (feature components)
 5. Call-site className      layout only: grid, gap, span, order           (pages)
```

The rule, from shadcn's own skill: **"`className` for layout, not styling. Never
override component colors or typography."** The rule is not "never customise". It
says customisation belongs at layers 2 and 3, and shadcn's `design-system.md`
spells out how. Same.dev's instruction to hand-edit every component before building
gets the goal right and the layer wrong: it multiplies the places a palette lives.

| Decision | Layer | Mechanism (Tailwind v4) |
|---|---|---|
| Palette roles (ground, ink, primary, accent, muted, border, ring, destructive) | 2 | `:root { --background: …; --primary: … }` plus `.dark { … }`, registered in `@theme inline { --color-background: var(--background) }` |
| Extra roles (a hover fill, a second surface) | 2 | New variable plus `@theme inline` registration (shadcn: `--primary-active`, `--surface-card`) |
| Radius per role | 2 | Pin each `--radius-*` step the components actually use; don't trust the `--radius` multiplier |
| Elevation | 2 | Override `--shadow-*` in `@theme` (not `inline`); set `--shadow-xs: 0 0 #0000` for a hairline-only system |
| Type faces | 2 | `--font-sans`, `--font-serif`, `--font-mono`, `--font-heading`; load via Fontsource or `next/font` and confirm in the render |
| Type scale | 2 | `@utility type-display-lg { … }`, **not** `--text-*` keys, because `cn()` treats unknown `text-*` classes as colours and drops one when it sits next to `text-muted-foreground` (shadcn) |
| Motion durations and easing | 2 | `--ease-*`, `--animate-*` in `@theme`; a reduced-motion override in `@media (prefers-reduced-motion: reduce)` |
| Control heights, icon spacing, focus treatment | 3 | Edit `cva` variants in `components/ui/*`; "control heights move together" (button, input, select, toggle, tabs) |
| New recipe (a hero button, a pill badge) | 3 | Add a named variant, keep existing names |
| Card or not, nesting, section order | 4 | Composition and the brief |
| Grid, gap, spans, responsive structure | 5 | Call-site classes |

## 2. Tailwind v4 specifics that matter

- **The default palette is OKLCH** (`packages/tailwindcss/theme.css`, read at
  `654f89f`): `--color-indigo-500: oklch(58.5% 0.233 277.117)`, `--color-purple-500:
  oklch(62.7% 0.265 303.9)`. The steps are perceptually even, which is better than v3,
  but they are the same hues every generated site reaches for. Using
  `bg-indigo-500` directly in a component is both a slop tell and a token bypass.
- **`@theme` against `@theme inline`**: `inline` makes the utility resolve to the
  variable reference (so `.dark` overrides work); a plain `@theme` bakes values. Colour
  roles go through `inline`; the shadow scale is overridden in plain `@theme` (shadcn).
- **Dark mode**: `@custom-variant dark (&:is(.dark *))` scopes dark tokens to a subtree,
  so a single section can render dark (shadcn: "use it for dark bands, featured pricing
  cards and footers"). Theme the second mode deliberately; don't invert.
- **No manual `dark:` colour overrides** in components (shadcn). If a component needs
  `dark:bg-…`, the token is missing.
- **`@utility`** for compound recipes (type steps, focus rings) instead of `@apply` chains
  scattered in components.
- **Arbitrary values** (`p-[17px]`, `bg-[#1a4be0]`) at call sites are drift. v0's
  prompt bans them in favour of the scale; Impeccable's `design-system-*` rules flag
  values outside DESIGN.md.

## 3. shadcn/ui specifically

The most common single slop source (K1). The vendor's fix, condensed from
`shadcn-skill/design-system.md`:

1. Start from a preset or style deliberately (`nova`, `vega`, `maia`, `lyra`, `mira`,
   `luma`); don't accept the CLI default by inertia. Record why in DESIGN.md.
2. Map DESIGN.md roles onto shadcn's variable table (canvas → `--background`, ink →
   `--foreground`, primary CTA → `--primary`, soft band → `--muted`, ghost hover →
   `--accent`, hairline → `--border`, focus → `--ring`, …).
3. Pin the radius classes the installed components use (`grep -ohE "rounded-…"
   components/ui/*.tsx | sort | uniq -c`).
4. Override shadows, fonts and type utilities.
5. Restyle through `cva` variants; keep variant names standard.
6. Change control heights together.
7. Build a design-system page (state matrices, contrast pairs, do and don't pairs),
   and check coverage so every installed component appears.
8. Verify: typecheck, no console errors, `scrollY === 0` on load, no horizontal
   overflow at 375 and 1280px, toggle dark once.

Component-level correctness rules from the same skill that also prevent tells:
`Empty` for empty states (no hand-rolled "No data yet"), `Skeleton` not custom
`animate-pulse`, `Badge` not styled spans, `Alert` for callouts (avoiding the
side-stripe card), `ToggleGroup` for 2–7 options, Dialog, Sheet and Drawer always
titled, `gap-*` not `space-y-*`.

## 4. Libraries that ship tells

| Library | Tell risk | Use instead |
|---|---|---|
| `lucide-react` (default with shadcn) | `Sparkles`, `Zap`, `Rocket`, `Shield`, `ArrowRight`, icons in tinted chips | Pick the icon set for the direction (`iconLibrary` in `components.json`); one stroke weight; icons beside labels, not stacked above headings |
| Framer Motion / Motion | Copy-pasted `initial={{opacity:0,y:20}} whileInView` on every section | One authored moment on Persuade; `MotionConfig reducedMotion="user"`; state transitions only on Operate |
| Aceternity, Magic UI registries | Spotlight, Beams, Meteors, Shimmer Button, Number Ticker, Marquee | Build the one effect from the product's own data, or cut it |
| `next/font` defaults (Geist) | "Deployed the starter, never themed it" | Choose faces in DESIGN.md; keep Geist Mono for code if wanted |
| Recharts via shadcn `Chart` | Rainbow series, gradient area fills, a dot on every point | One hue per chart, 2px line, no fill on most; see [`ux-product-ui.md`](./ux-product-ui.md) §4 |
| `tw-animate-css` | `animate-bounce`, `animate-ping` on decorative dots | Easing tokens; pulse only for genuinely live data |

## 5. Detectable in source: what a linter can own

From avoid-ai-design's ⚙ marks, Impeccable's text-engine rules, Vercel's
anti-patterns and shadcn's rules, these are reliably visible in `.tsx` and `.css`
without rendering. They make up the rule set of
[`ux-design/skill/scripts/slop-lint.mjs`](./ux-design/skill/scripts/slop-lint.mjs):

- Raw palette utilities for the indigo, violet and purple families, and the
  gradient pairs (`from-indigo-500 to-purple-600`, `bg-linear-to-br`).
- `bg-clip-text` with `text-transparent` (gradient text).
- Coloured shadows (`shadow-indigo-500/50`, `shadow-[0_0_…]`).
- `border-l-4 border-l-{color}` on a `rounded-*` element (side stripe).
- `uppercase` with `tracking-wide|wider|widest` and `text-xs|sm` (eyebrow).
- Icon chip: `size-10|12` or `h-12 w-12` with `rounded-*` and a tinted background,
  wrapping a Lucide icon.
- `animate-bounce`, spring `bounce`, `easeOutBack`; `animate-ping` on a small dot.
- Repeated `whileInView` with `opacity: 0` entrances.
- `backdrop-blur` counts.
- `→` and emoji in JSX text; buzzwords; "not just … it's"; "Get started" and
  "Learn more"; em-dash density; lorem, Acme, John Doe, pravatar, DiceBear.
- Overused faces in `next/font` imports or `--font-*`.
- Hex literals near the cream (#F4F1EA) and terracotta (#D97757) cluster centres,
  by OKLab distance.
- Quality: `transition-all`, `outline-none` without `focus-visible`, `<div onClick>`,
  `<img>` without width and height, `user-scalable=no`, `onPaste` with
  `preventDefault`, `dark:` colour overrides, raw palette colours where tokens exist.

What a linter cannot own (render or judgement): palette dominance, rhythm,
hierarchy, whether centring is right, whether the idea belongs to the subject, and
whether text is actually readable on its real background. Those need the render
look and a person.
