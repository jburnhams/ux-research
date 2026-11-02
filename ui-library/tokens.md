# Tokens: the contract every component reads

Tokens are the only channel for colour, type, radius, elevation, motion and density.
Components never name a value; they name a role. A product changes how it looks by
changing tokens, and every component follows.

The complete, compiling example is
[`examples/app/globals.css`](./examples/app/globals.css) plus
[`examples/app/theme.generated.css`](./examples/app/theme.generated.css). Research
behind each section: [`../ux-colour-science.md`](../ux-colour-science.md),
[`../ux-material-3.md`](../ux-material-3.md),
[`../ux-react-tailwind.md`](../ux-react-tailwind.md).

## 1. Two files, two owners

| File | Written by | Holds | Edit by |
|---|---|---|---|
| `app/theme.generated.css` | `palette.mjs` | shadcn colour roles, `--neutral-1…12`, `--primary-1…12`, `--secondary-1…12`, `--chart-1…5`, light and dark, registered in `@theme inline` | regenerating with new seeds |
| `app/globals.css` | the product, from the library's template | namespace reset, status roles, surfaces, density, motion, contrast-more overrides, type utilities, radius, elevation, base layer | hand, with a reason beside each value |

```bash
node ux-design/skill/scripts/palette.mjs --primary "#5b6e5a" --secondary "#c4621c" --contrast 0.5 \
  --out app/theme.generated.css
# palette checks: 42 pass, 0 warn, 0 fail
```

## 2. The namespace reset

Directly after `@import "tailwindcss"`:

```css
@theme {
  --color-*: initial;
  --text-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --font-*: initial;
}
```

Verified against Tailwind 4.3.3 by compiling a probe file: with the reset,
`bg-indigo-500`, `bg-white`, `text-sm`, `rounded-xl` and `shadow-lg` produce no CSS,
while every token below still does. The reset must come *after* the Tailwind import;
placed before it, Tailwind's theme re-registers the defaults and nothing is removed
(this was the first attempt, and the probe caught it).

Kept on purpose: spacing (`--spacing`, the 4px grid), breakpoints, font weights,
leading and tracking, and the `animate-*` keyframes. `bg-transparent`, `bg-current`
and `accent-*` with a token still work.

## 3. Colour roles

From `palette.mjs` (method: `../ux-colour-science.md` §3; the generator solves each
of 12 steps per hue for a contrast target in OKLCH, in the Radix step jobs):

| Steps | Job | Example use |
|---|---|---|
| 1–2 | app and subtle grounds | `--background`, `--surface-sunken` |
| 3–5 | component fills: normal, hover, pressed | `--muted`, `--accent`, `hover:bg-neutral-4` |
| 6–8 | borders: subtle, normal, strong | `--border` (6), `--input` (8), `--ring` (8) |
| 9–10 | solid fills, and their hover | `--primary` (9), `hover:bg-primary-10` |
| 11–12 | text: low and high contrast | `--muted-foreground` (11), `--foreground` (12), `text-primary-11` for links |

shadcn's names are kept (`--background`, `--foreground`, `--primary`, `--muted`,
`--accent`, `--border`, `--input`, `--ring`, `--destructive`, `--card`,
`--popover`, `--chart-1…5`), so anything written for shadcn reads them correctly.

**Seeds come from the subject.** In the example the primary is the studio's celadon
glaze (`#5b6e5a`) and the secondary is the colour of the kiln's peephole at about
1,000 °C (`#c4621c`). Both reasons are in
[`examples/DESIGN.md`](./examples/DESIGN.md). A seed with no reason in DESIGN.md is a
review finding.

## 4. Status roles

Status is semantic and fixed, never the accent. Each tone is a pale tint and a dark ink
of one hue:

| Token pair | Light: tint / ink | Dark: tint / ink | Used for |
|---|---|---|---|
| `--success-subtle` / `--success` | `oklch(95.4% 0.035 150.6)` / `oklch(45.9% 0.109 150.1)` | `oklch(25.9% 0.045 150.3)` / `oklch(70.5% 0.09 150.1)` | done, ready, healthy |
| `--warning-subtle` / `--warning` | `oklch(95.5% 0.025 52.2)` / `oklch(47.6% 0.11 50.6)` | `oklch(25.9% 0.045 50.1)` / `oklch(71.3% 0.09 50.9)` | needs care soon (in the example: hot) |
| `--danger-subtle` / `--danger` | `oklch(95.5% 0.022 27.8)` / `oklch(48% 0.111 27)` | `oklch(26% 0.045 27)` / `oklch(71.7% 0.089 27.3)` | failed, blocked, error text |
| `--info-subtle` / `--info` | `oklch(95.5% 0.023 246)` / `oklch(46.5% 0.11 244.6)` | `oklch(26% 0.045 244.4)` / `oklch(70.8% 0.09 245.3)` | neutral news |
| `--muted` / `--muted-foreground` | from the ramps | from the ramps | inactive, booked, pending |

Rules:

- The ink is solved to **≥ 6:1** against its own tint *and* against the page ground,
  so it doubles as error text on the page (`text-danger` under a field). Solved with
  `../ux-design/skill/scripts/lib/color.mjs`; the values above are the solver's output.
- Status hues sit **≥ 20° from each other** and from the accent where they could be
  confused. The example's warning takes the secondary seed's hue (50°) on purpose: in
  a kiln room "hot" *is* the caution state. Danger stays at 27°, 23° away. Success
  (150°) is near the celadon primary (144°) but at three times its chroma; that
  proximity is recorded in DESIGN.md, and every status carries a word and an icon.
- Status is never colour alone: the `Status` component requires a word
  ([`components.md`](./components.md#34-status)).

## 5. Surfaces

Layering by tone, not by shadow (Material's surface ladder; on dark, higher surfaces
are lighter): `--background` for the page, `--surface-sunken` (`--neutral-2`, and
`--neutral-1` in dark) for wells such as code and read-only panels, `--card` and
`--popover` for raised objects. A product with nested panels adds steps from the
neutral ramp rather than a new shadow.

## 6. Type

One family on Operate surfaces is usually right. The example uses Public Sans: plain,
sturdy, true tabular figures, legible at arm's length on a wall tablet. A display
face is added only for a Persuade surface, and then used once.

Steps are utilities, not `--text-*` keys:

| Utility | Size / line | Weight | Use |
|---|---|---|---|
| `type-caption` | 12 / 16 | 400 | table headers, chart axes, status labels |
| `type-label` | 14 / 20 | 500 | form labels, metric labels, buttons |
| `type-body-sm` | 14 / 20 | 400 | table cells, hints, secondary lines |
| `type-body` | 16 / 24 | 400 | body text, inputs |
| `type-heading` | 18 / 24 | 600 | section headings |
| `type-title` | 24 / 32 | 600 | the page's noun title |
| `type-figure` | 28 / 36 | 500, tabular | headline figures |

Operate scale, ratio about 1.125–1.2, fixed rem, nothing above 28px (taste-skill's
real screens: titles 18–32px, figures 24–30px, "nothing at 48"). Persuade products
add `type-display` with a clamped size.

`lib/utils.ts` teaches `tailwind-merge` that `type-*` is a font-size group, so
`cn("type-label", "text-muted-foreground")` keeps both. Without it, `cn()` cannot
classify `type-*` and conflicts resolve unpredictably; with stock shadcn the same
problem drops `text-muted-foreground` beside a custom `text-*` size.

## 7. Radius

By role, with optical nesting (Material: inner radius = outer radius − padding; never
the same radius on nested objects):

| Token | Example value | Role |
|---|---|---|
| `--radius-control` | 4px | buttons, inputs, selects, skeleton bars |
| `--radius-surface` | 6px | alerts, panels, cards where a card is earned |
| `--radius-overlay` | 8px | menus, popovers, dialogs, the undo bar |
| `--radius-pill` | 9999px | status marks, toggles |

The stance (sharp, soft, round) comes from the reference sentence's formality, not
from a default. Large radii are not used on information-dense components.

## 8. Elevation

One channel per surface. Things on the page are separated by hairlines (`border-border`,
about 1.1–1.3:1 against the ground); only what floats above the page (menus, popovers,
dialogs, the undo bar) gets `shadow-overlay`. No other shadow exists after the reset,
so the "hairline plus wide soft shadow on every card" tell cannot be typed.

## 9. Motion

| Token | Value | Used for |
|---|---|---|
| `--motion-effects` | 200ms | colour, opacity, border (state changes) |
| `--motion-spatial` | 350ms | position and size: sheets, expanding rows |
| `--ease-effects` | `cubic-bezier(0.34, 0.8, 0.34, 1)` | Material's default effects curve: no overshoot, ever |
| `--ease-spatial` | `cubic-bezier(0.27, 1.06, 0.18, 1)` | Material Standard spatial: a barely visible settle |
| `transition-state` (utility) | the named properties above | every interactive component; never `transition: all` |

Motion on Operate surfaces conveys a state change and nothing else. The theme carries
one reduced-motion path (`prefers-reduced-motion: reduce` collapses durations), so
components do not each need their own. A spring for a Persuade hero moment is a
product token, recorded in DESIGN.md with its reason.

## 10. Density

```css
:root { --control-h: 2.5rem; --control-h-sm: 2rem; }
[data-density="compact"] { --control-h: 2rem; --control-h-sm: 1.75rem; }
@media (pointer: coarse) {
  :root, [data-density="compact"] { --control-h: 2.75rem; --control-h-sm: 2.75rem; }
}
```

Every control's height reads `--control-h` (`h-(--control-h)`), so button, input and
select move together. On a coarse pointer every control, small or compact, is a 44px
target: the touch rule comes after the compact one so it always wins (checked in
Chromium with touch emulation: all buttons 44px with `data-density="compact"`).

## 11. Contrast and dark mode

- **More contrast**: the text roles from the same seeds at `palette.mjs --contrast 1`,
  applied under `@media (prefers-contrast: more)`. The light inks are scoped to
  `:root:not(.dark)` so they never land on a dark root (an unscoped `:root` rule there
  would turn dark-mode text near-black). Only roles that gain contrast are overridden (see the limit in [`README.md`](./README.md) §7).
- **Dark** is generated, not inverted: each step is re-solved against the dark ground
  (`../ux-colour-science.md` §7). `color-scheme: dark` is set so native controls and
  scrollbars follow. `@custom-variant dark (&:is(.dark *))` scopes dark tokens to a
  subtree. Components never use `dark:` colour classes; if one is needed, a token is
  missing.

## 12. Base layer

The library sets what no component should have to remember: page ground and ink, the
font, one `:focus-visible` outline in `--ring` for everything focusable, the
selection colour (`--primary-5`), underline offset, and `color-scheme`.
