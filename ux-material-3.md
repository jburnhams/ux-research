# Material 3 and M3 Expressive (late 2026)

Google's Material is the one large, public design system whose *colour, motion and
shape* are fully specified as tokens and code. That makes it a useful reference for
React and Tailwind work even when the product does not look like Material. This doc
covers what Material currently specifies, read first from Google's own repos (the
first pass could not reach `m3.material.io`) and, since 2026-11-02, checked against
the site's guidance pages, its blog and the Expressive research write-up on
design.google.

Stored material: [`material-3/`](./material-3) (token SCSS from
`material-components/material-web` @ `de5470f`, 2026-10-29; colour-engine sources
and dev guides from `material-foundation/material-color-utilities` @ `bd811e4`,
2026-10-19; Apache-2.0). Since 2026-11-02, the Compose motion tokens for both schemes
(`androidx` `androidx-main` @ `badb0138c4`, 2026-11-02; Apache-2.0) in
[`material-3/compose-motion/`](./material-3/compose-motion).

## 1. What "Expressive" changed

Dates, now read from the site: M3 Expressive was launched on **May 13, 2025**
("Start building with Material 3 Expressive"), with the Compose motion-theming post on
May 20, 2025. "M3 Expressive isn't a new version of the system … this isn't 'M4.'" It
added a **motion physics system** (springs, two schemes), an **expanded shape library
of 35 shapes with built-in morphing**, 14 new or updated components (button groups, FAB
menu, loading indicator, split button and toolbars are new), an emphasized type
scale and "vibrant" colour schemes. On **May 19, 2026** (I/O 2026) Material announced
an **Expressive layout system** (a layout scaffold across phone, desktop, watch and
XR, and a spacing system on an 8dp scale applied as tokens to margins, padding and
gaps), expressive lists and menus, and that **Material Android is Compose-first**:
Views 1.14.0 is the last feature release, and Compose 1.5.0 will make the Expressive
APIs stable later in 2026.

### The research behind it (design.google, "Better, Easier, Emotional UX")

Material calls it "the most researched update to Google's design system, ever": **46
studies, more than 18,000 participants**, using eye tracking, surveys and focus
groups, preference experiments and usability tests. The claims, with what they rest
on:

| Claim | Basis given | Read it as |
|---|---|---|
| Expressive designs are preferred by all ages, "up to 87%" among 18–24-year-olds | Preference studies | Preference, not usability; the 87% is the best age group |
| Rated higher on "playful", "energetic", "emotive", "creative", "friendly", "positive vibe" | Attribute ratings designers iterated against | Partly circular: the designs were tuned toward those words |
| +32% "subculture", +34% "modernity", +30% "rebelliousness" | Warren et al. (2019) "coolness" factors | Brand perception, not task performance |
| Key UI elements spotted **up to four times faster**; tap time down "by seconds" | Eye-tracking glasses, 10 apps in both versions, randomised order | The strongest evidence. The example is a Send button made larger, moved above the keyboard and given a secondary colour, so it is mostly **size, position and contrast**, i.e. classic hierarchy |
| The age gap in fixation time largely disappeared (45+ performed like younger users) | Same study | Same mechanism: bigger, higher-contrast targets |

The write-up also names its own limits, which matter more here than the headline
numbers:

- "**Context still matters** … What works in a media player or email app might not be
  suitable for something like a banking interface." An album-art playlist arranged
  "helter-skelter" looked "modern and exciting" but usability suffered; removing text
  labels from email actions decreased usability. "No amount of expressive design will
  beat basic functionality."
- "A strong minority of users preferred calmer, less intense versions."
- Results were affected by users' **lack of familiarity** with the new style.

That is the same split this collection makes between Persuade and Operate surfaces
([`ux-product-ui.md`](./ux-product-ui.md) §1), now with Google's own data behind it:
expressiveness helps where it sharpens hierarchy, and hurts where it breaks a
familiar pattern.

The "expressive tactics" from the launch post are a usable checklist: vary shape
(mixing round and square for "tension"), use contrast between colour roles for the
main action, emphasise type for hierarchy, contain content for emphasis, add fluid
motion, adapt components to context, and combine tactics only for **one or two hero
moments** per product ("too many moments can be overwhelming or distracting").

The token files confirm the structure:

### Motion: springs instead of duration and easing

There are **two schemes**, and the first pass only had one. `material-web`'s
`tokens/_md-sys-motion.scss` carries the **Standard** scheme; the **Expressive**
scheme, which Material calls its "opinionated" default "for most situations,
particularly hero moments and key interactions", is in Compose's
`ExpressiveMotionTokens.kt`:

| Token | Standard: damping / stiffness | Expressive: damping / stiffness | Web curve, Expressive (from the specs page) |
|---|---|---|---|
| `spring.fast.spatial` | 0.9 / 1400 | **0.6 / 800** | `cubic-bezier(0.42, 1.67, 0.21, 0.90)`, 350ms |
| `spring.default.spatial` | 0.9 / 700 | **0.8 / 380** | `cubic-bezier(0.38, 1.21, 0.22, 1.00)`, 500ms |
| `spring.slow.spatial` | 0.9 / 300 | **0.8 / 200** | `cubic-bezier(0.39, 1.29, 0.35, 0.98)`, 650ms |
| `spring.fast.effects` | 1 / 3800 | 1 / 3800 | `cubic-bezier(0.31, 0.94, 0.34, 1.00)`, 150ms |
| `spring.default.effects` | 1 / 1600 | 1 / 1600 | `cubic-bezier(0.34, 0.80, 0.34, 1.00)`, 200ms |
| `spring.slow.effects` | 1 / 800 | 1 / 800 | `cubic-bezier(0.34, 0.88, 0.34, 1.00)`, 300ms |

Standard's web curves are `cubic-bezier(0.27, 1.06, 0.18, 1.00)` at 350, 500 and 750ms
for spatial, and the same effects curves. The site says to use real springs on the
web where possible and these curves only "for animations without interruptions or
gestures".

- **Spatial** springs (position, size, rotation, corner radius) overshoot and settle.
  In Standard (0.9) the overshoot is barely visible; in Expressive (0.6–0.8) it is a
  clear bounce. **Effects** springs (colour, opacity) are critically damped (1.0) in
  both: no overshoot, ever.
- "Expressive is Material's recommended motion scheme … **Standard**, with its small
  amount of bounce, feels more functional and should be used for **utilitarian
  products**." A product can use one scheme and swap to the other per element.
- Speed: fast for small components (switches, buttons), default for things that
  partly cover the screen (sheets, an expanded rail), slow for full-screen changes.
- Springs are chosen because they can be **interrupted and retargeted** using their
  current velocity, and because they specify stiffness rather than time, so they
  "feel fast in the context of the device".
- The legacy `duration-*` (short 50–200ms, medium 250–400ms, long 450–600ms, extra-long
  700–1000ms) and easing tokens remain in the file for older components.
- The official pages confirm that "fast" is always faster than "default" or "slow"
  but the exact values vary by device class (watch, phone, tablet). The first pass
  also reported, from search snippets, guidance on a reduced-motion variant for
  springs and shape morph; **none of the motion, shape or accessibility pages read on
  2026-11-02 says this**, so treat it as unconfirmed and keep the web's own rule
  (`prefers-reduced-motion`).

This partly reconciles a disagreement in the anti-slop sources. Impeccable and
avoid-ai-design flag "bounce and elastic easing" as a tell; Material ships springs with
overshoot. The difference is **amount, channel and mode**. Overshoot is only ever on
position and size, never on colour or opacity. Standard's 0.9 is a barely-visible
settle and is Material's own choice for utilitarian products, which matches the
Operate rules here. Expressive's 0.6 on fast spatial (small controls) *is* a visible
bounce, and Material recommends it by default, so the two camps genuinely disagree on
Persuade surfaces. Our resolution stands: Standard-like damping (≈ 0.9) for Operate,
Expressive damping only on a hero moment, and never `animate-bounce` or
`easeOutBack` on content. In Motion for React the equivalents are
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

The guidance pages add four rules that transfer directly:

- **Optical roundness for nested shapes**: "Outer radius − padding = inner radius"
  (48dp − 14dp = 34dp). "Avoid using the same corner radius value for nested
  objects." The generated-UI tell of a `rounded-xl` card holding `rounded-xl`
  children is the violation.
- **No large or full corners on information-dense components** such as cards, and no
  unconventional shapes on text-heavy containers.
- **Tension**: "Material historically focused on rounded shapes. However, using sharp
  shapes, thereby adding tension, creates more dynamic design." Mix square and fully
  rounded deliberately rather than rounding everything to one value.
- **Shape is not semantic** and abstract shapes are for decoration (image crops,
  avatars) "sparingly": "Shapes without clear meaning behind why they're different
  can add more visual clutter than delight."

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
| Spatial and effects split | Springs for position and size (Standard-like damping ≈ 0.9 on app screens; Expressive 0.6–0.8 only on a hero moment); critically damped springs or tweens for colour and opacity; one reduced-motion path |
| Shape by role | A radius ladder assigned to component roles in `@theme`, not one `rounded-lg` |

## 4. Gaps

- Read on 2026-11-02: the launch and I/O 2026 posts, the motion-physics pages and the
  web curve table, the shape overview, corner scale and shape-morph pages, the
  Compose motion-theming post and the design.google research write-up. Component
  usage pages were not read.
- `material-web` is in maintenance mode for the older components; its `labs/`
  directory holds the newer ones, and the token files are the most current
  machine-readable source.
- Jetpack Compose (`androidx`) holds the reference shape-morph implementation
  (`androidx.graphics.shapes`); not read yet. The site says **shape morph is not
  available on the web**.
