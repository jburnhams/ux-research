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
node ux-design/skill/scripts/palette.mjs --primary "#4d7a52" --secondary "#c4621c" --contrast 0.5 \
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
glaze where it pools thick (`#4d7a52`) and the secondary is the colour of the kiln's peephole at about
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

strata-react's [`src/lib/utils.ts`](https://github.com/jburnhams/strata-react/blob/main/src/lib/utils.ts) teaches `tailwind-merge` that `type-*` is a font-size group, so
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
| `--motion-press` | 100ms | press feedback (`scale`) |
| `--motion-moment`, `--ease-moment` | 500ms, `cubic-bezier(0.23, 1, 0.32, 1)` | a rare completion's one entrance; a hard ease-out with no overshoot |
| `transition-state` (utility) | the named properties above, plus `scale` at the press duration | every interactive component; never `transition: all` |
| `press` (utility) | `scale: 0.98` while active | buttons: the only motion on something used tens of times a day |
| `enter-moment` (utility) | `@starting-style` opacity 0, 0.75rem up | the result in a `Done` figure; CSS only, runs once on mount |

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

## 13. Character tokens

Most of a product's character lives in words and in what its data is drawn as, not in
tokens ([`character.md`](./character.md)). Three kinds of token carry the rest:

- **Motion budget**: `--motion-press` and `--motion-moment` above. They are the
  library's, and the frequency table in `character.md` decides which one a thing gets.
- **Subject colours**: a product may add a small named set of colours that are facts
  of its world, used only where they encode that fact. The example's `--heat-unlit`,
  `--heat-dull-red`, `--heat-cherry`, `--heat-orange` and `--heat-yellow` are the
  colours seen through a kiln's peephole, used only on the firing line (light
  4.3–8.1:1, dark 4.1–12.4:1 against the ground). Each one has a reason in DESIGN.md;
  one without a reason is a review finding, as with seeds.
- **Character allowances**: anything the frequency table would normally refuse (a
  spring with overshoot for a product whose subject bounces, a sound for a physical
  product's feedback) is a product token with its reason, and a `slop-lint`
  allowance with the same reason.

## 14. A default look for a framework (2026-11-25)

A framework that ships no look makes every app choose one, and an agent asked to "make it look
good" reaches for the stock one. strata-react now ships a finished look **as the default**
(`strata-react/strata.css` = contract + look); an app with its own theme imports
`strata-react/strata.bare.css`, which is the old contract unchanged, and an app that keeps the
default overrides any value in a later block. Rules for such a default, with the reason for each:

- **The look is a layer on a contract that stays whole.** Never restyle by changing a value in the
  contract file: an app built on the old value moves silently. The bare contract is kept as its own
  entry, so opting out is one import and nothing else moves.
- **Generated ramps plus a hand layer with a reason per value.** Seeds petrol `#00798f` and marigold
  `#f2a900`, `palette.mjs --contrast 0.5 --ground tinted` (42 checks pass); status roles solved to
  6:1 (a check found the first light warning ink at 5.99 and it was darkened).
- **Off the slop list on purpose** (`ux-slop-taxonomy.md` §3a): not indigo or violet, not cream plus
  terracotta, not near-black plus one acid accent. The ground is tinted toward the primary so the page
  reads as one colour family.
- **One warm accent, placed by meaning.** Marigold marks where attention already is (selection, the
  active item of a keyboard-worked list), never status, never a gradient or glow. Hover and "chosen"
  stay on the neutral ramp, so the warm wash means "this one, now".
- **Three radii that differ** (6, 10, 14 px) and one shadow, tinted with the primary's ink, for what
  floats only (taxonomy §3d).
- **One family used twice, not two families.** Instrument Sans at normal width for text; at 85% width
  and weight 700 for titles and big figures (condensed, so "212 °C" stays compact beside its label).
  Chosen by Jonathan from 12 text faces rendered on the kiln screen. Inter is neutral enough, and the
  taxonomy's tell is a single face with nothing second, not Inter itself; Geist is as neutral and sits
  in the overused cluster (§3b, P1). Onest and Schibsted Grotesk space figures and colons loosely, which
  hurts a data app. JetBrains Mono for code and keys.
- **No serif on Operate titles.** A serif page title on a dashboard reads as an editorial costume
  (§3b). A reading serif is opt-in for Read surfaces: Source Serif 4 (sturdy, large x-height, clear
  numerals and units), chosen over Newsreader, Literata, Lora, Crimson Pro and Bitter.
- **Palettes are themes beside the colour scheme, chosen independently** (Jonathan, 2026-11-25). Four
  more ship with the default (pine and coral, cobalt and tangerine, steel and mint, clay and teal), each
  a light and a dark block keyed on `data-palette` on the element that carries `.dark`; the default is
  the plain root, so "no attribute" and "petrol" are the same. Rules that came from building it:
  status colours (success, warning, danger, info) are **shared by every palette**, so a status never
  changes meaning with the brand; a swatch is drawn by scoping the palette on the swatch itself, so the
  dark form must also match `.dark [data-palette]`, and any role declared once at the root as a
  reference (`--accent: var(--secondary-3)`) is redeclared per palette, because it is computed at the
  root; the picker names every palette in words (a swatch is never the only name); steel's first seed
  put the dark primary at 2.99:1 on the ground (under 3:1) and was moved. Cautions kept from the
  specimen: coral's pale wash on an active row can read as error beside a danger chip, and clay and teal
  sits near cream-and-terracotta, so neither suits a default (the default stays petrol and marigold).
