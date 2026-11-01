# Material 3 and M3 Expressive (late 2026)

Google's Material is the one large, public design system whose *colour, motion and
shape* are fully specified as tokens and code. That makes it a useful reference for
React and Tailwind work even when the product does not look like Material. This doc
covers what Material currently specifies, read from Google's own repos, because
`m3.material.io` was outside this session's network allowlist
([`blocked-sources.md`](./blocked-sources.md)).

Stored material: [`material-3/`](./material-3) (token SCSS from
`material-components/material-web` @ `de5470f`, 2026-10-29; colour-engine sources
and dev guides from `material-foundation/material-color-utilities` @ `bd811e4`,
2026-10-19; Apache-2.0).

## 1. What "Expressive" changed

From the official site's I/O 2026 notice (via search results; dated May 19, 2026,
with M3 Expressive first announced at I/O 2025 and on Pixel from September 2025):
a **motion physics system** that is token-driven, an **expanded shape library of 35
shapes with built-in morphing**, new components (toolbars, split buttons, button
groups, flexible app bars), and an "emphasized" type scale. Third-party summaries
make unverified claims (for example a "4x increase in element recognition"); treat
those as marketing until the primary research page can be read.

The token files confirm the structure:

### Motion: springs instead of duration and easing

`tokens/_md-sys-motion.scss` (latest):

| Token | Damping | Stiffness |
|---|---|---|
| `spring.fast.spatial` | 0.9 | 1400 |
| `spring.default.spatial` | 0.9 | 700 |
| `spring.slow.spatial` | 0.9 | 300 |
| `spring.fast.effects` | 1 | 3800 |
| `spring.default.effects` | 1 | 1600 |
| `spring.slow.effects` | 1 | 800 |

- **Spatial** springs move and resize things and are slightly underdamped (0.9), so
  they settle with a hint of overshoot. **Effects** springs (colour, opacity) are
  critically damped (1.0): no overshoot, ever.
- The legacy `duration-*` (short 50–200ms, medium 250–400ms, long 450–600ms, extra-long
  700–1000ms) and easing tokens remain in the file for older components.
- Per the official motion-theming post (via search), "fast" is always faster than
  "default" or "slow", but the exact values vary by device class (watch, phone,
  tablet), and the guidance recommends a reduced-motion variant for shape morph and
  springs.

This reconciles a disagreement in the anti-slop sources. Impeccable and avoid-ai-design
flag "bounce and elastic easing" as a tell; Material ships a spring with overshoot. The
difference is **amount and channel**. Material's 0.9 damping is a barely-visible settle
on position only, never on colour or opacity, and never the cartoon bounce of
`animate-bounce` or `easeOutBack`. In Motion for React the equivalents are
`{ type: "spring", stiffness: 700, damping: … }`. Note that Motion's `damping`
is an absolute coefficient rather than Material's damping *ratio*, so convert with
`c = 2ζ√(k·m)` (ζ = 0.9, k = 700, m = 1 gives c ≈ 47.6).

### Shape: a corner scale with "increased" steps

`tokens/_md-sys-shape.scss`: none 0, extra-small 4px, small 8px, medium 12px, large
16px, **large-increased 20px**, extra-large 28px, **extra-large-increased 32px**,
**extra-extra-large 48px**, plus full (pill). Expressive added the "increased" steps
and a 48px step, which push Material toward much rounder containers than the 8px
`rounded-lg` web median. Shape is assigned **by role** (chips small, cards medium,
dialogs extra-large, FABs large), which is the same point artifact-design makes
("Apply them by role").

### Type: the emphasized scale

`_md-sys-typescale-emphasized.scss` adds an emphasized variant of every role (display,
headline, title, body, label × large, medium, small), and the old emphasized tokens in
the base file are marked `@deprecated … use emphasized token instead`. Baseline values
are useful defaults for product UI: body-large 1rem / 1.5rem line / 0.03125rem
tracking; display-large 3.5625rem / 4rem / -0.015625rem.

## 2. Colour: dynamic colour from one or two seeds

`material-color-utilities` is the most complete open colour engine available, and it
is the reference implementation for **generating a whole theme from a single seed
colour**. Key ideas (details in [`ux-colour-science.md`](./ux-colour-science.md)):

- **HCT** (hue, chroma, tone): CAM16 hue and chroma with L* (CIELAB lightness) as
  tone. Because tone is L*, **contrast is predictable from tone difference alone**,
  regardless of hue. This is Google's published rule of thumb (gap ≥ 40 for 3:1,
  ≥ 50 for 4.5:1). We re-derived it from the L*-to-luminance formula: the worst
  case sits at the light extreme, where tones 60/100 give 3.17:1 and 50/100 give
  4.48:1. So "50" lands a hair under 4.5 at that one end; use 51 to be safe.
- **Tonal palettes**: each key colour is expanded to tones 0–100 at constant hue and
  chroma (clamped where sRGB can't reach).
- **Scheme variants** (`variant.ts`): Monochrome, Neutral, Tonal Spot (the Android
  default), Vibrant, Expressive, Fidelity, Content, Rainbow, Fruit Salad, and **CMF**,
  new in spec 2026. Each variant is a *policy* for deriving the five palettes (primary,
  secondary, tertiary, neutral, neutral-variant) plus error from the seed. Content and
  Fidelity keep the seed's chroma (for brand or image-derived colour); Tonal Spot mutes
  it; Expressive rotates hues.
- **`SchemeCmf` (2026)** takes **two source colours**: primary from the first, tertiary
  from the second, secondary at 0.5× chroma, neutrals at 0.2× chroma tinted toward the
  seed hue, and an error hue chosen relative to both. It throws unless spec version is
  `'2026'`.
- **Contrast levels** −1 (reduced), 0 (default), 0.5 (medium), 1.0 (high), each role
  defined by a `ContrastCurve` of target ratios across those levels (for example
  4.5 → 4.5 → 7 → 11). The theme recomputes tones to hit the ratio, so a user's
  high-contrast setting is a token input, not a separate palette.
- **Surface containers**: surface, surface-dim, surface-bright, and container lowest,
  low, default, high and highest replaced elevation tint as the way to separate
  layers. That is tone steps instead of shadows, the same move taste-skill's app rules
  make ("opaque surfaces one tone step from the ground").
- **`DislikeAnalyzer`**: rejects "dark yellow-greens" (hue 90–111, chroma > 16, tone <
  65) and lightens them, citing Palmer and Schloss (2010) on universal distaste
  correlated with "biological waste and rotting food". It is the only shipped
  colour-*preference* rule in any system here.
- **`Score`** ranks colours extracted from an image (quantised with Celebi, Wu and
  WSMeans) by chroma and pixel proportion, so a photo can seed the theme.
- **`TemperatureCache`** computes warm and cool analogous colours and complements
  using a temperature formula over CIELAB (`-0.5 + 0.02·C^1.07·cos(h − 50°)`), which
  gives harmonies that respect perceived warmth rather than raw hue angle.

## 3. Using Material ideas in React and Tailwind without looking like Material

Material's *look* (rounded tonal containers, tonal-spot pastels, FABs) is itself a
recognisable default ("this is an Android app"). Its *mechanisms* transfer:

| Mechanism | Tailwind and React use |
|---|---|
| Seed → tonal palettes → roles | Generate `--primary`, `--muted`, `--accent`, `--border` and surface steps from one or two brand seeds with `@material/material-color-utilities` (npm), export to CSS variables, pick the variant that matches the mode (Content or Fidelity for brand, Neutral or Monochrome for Operate) |
| Tone-gap contrast | Choose text and surface tone pairs by L* difference; verify with WCAG |
| Contrast levels | Ship `[data-contrast="more"]` token overrides computed from the same seeds, honouring `prefers-contrast: more` |
| Surface containers | Use 3–5 surface tone steps instead of shadows for app layering |
| Spatial and effects split | Springs (low overshoot) for position and size; critically damped tweens for colour and opacity; one reduced-motion path |
| Shape by role | A radius ladder assigned to component roles in `@theme`, not one `rounded-lg` |

## 4. Gaps

- The Material site's prose guidance (principles, the Expressive research write-up,
  component usage do's and don'ts) could not be read from this session.
- `material-web` is in maintenance mode for the older components; its `labs/`
  directory holds the newer ones, and the token files are the most current
  machine-readable source.
- Jetpack Compose (`androidx`) holds the reference shape-morph implementation
  (`androidx.graphics.shapes`); not read in this pass.
