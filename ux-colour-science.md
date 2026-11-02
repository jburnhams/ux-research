# Colour science and palette generation for UI

What a palette generator for React and Tailwind needs to know: which colour space to
compute in, how contrast is actually measured, the four ways real systems build
scales, how to validate a palette mechanically, and what the perception research
says about preference and emotion. The working implementation is
[`ux-design/skill/scripts/palette.mjs`](./ux-design/skill/scripts/palette.mjs).

Sources read: `material-color-utilities` (HCT, schemes, dislike, temperature;
[`material-3/`](./material-3)), Tailwind v4 `theme.css`, Adobe Leonardo, Evil Martians
Harmonizer, Radix Colors, the APCA reference repo, Claude `dataviz`'s validator
(via `prompts/`), culori. Licences and commits are in [`sources.md`](./sources.md).

## 1. Colour spaces: compute in a perceptual one

| Space | What it's good for | Where it bites |
|---|---|---|
| **sRGB hex / HSL** | Storage, legacy | HSL lightness is not perceived lightness: `hsl(60 100% 50%)` (yellow) and `hsl(240 100% 50%)` (blue) share "L 50%" but differ by roughly 8:1 in WCAG luminance contrast. A scale built in HSL has uneven steps across hues. Lovable's prompt mandates HSL, which is one reason its palettes need manual fixing |
| **CIELAB / LCh** | L* tracks perceived lightness well; basis of WCAG-adjacent work and of Material's tone | Hue is not linear: blues drift toward purple as chroma drops |
| **OKLab / OKLCH** (Ottosson, 2020) | Better hue linearity than LCh, simple maths, **CSS-native** (`oklch()`), and **Tailwind v4's default palette** | OKLCH L is not WCAG luminance either. Two colours at equal L can have different WCAG contrast against white, so a contrast-targeted scale still needs a contrast solver |
| **HCT** (Google: CAM16 hue and chroma, L* as tone) | Tone *is* L*, so contrast is predictable from tone gap; models viewing conditions | Heavier maths; library-bound (`@material/material-color-utilities`) |
| **Display P3** | Wider gamut on modern screens; OKLCH can address it | Needs a gamut-mapping fallback for sRGB (`@media (color-gamut: p3)`); chroma that only exists in P3 clips unpredictably if you don't map |

**Recommendation**: author and store tokens in OKLCH (it is what Tailwind v4 and modern
CSS speak), but **solve each ramp step against a contrast target**, not a fixed L, and
gamut-map by reducing chroma at constant L and h (the CSS Color 4 approach) rather than
clamping RGB channels.

## 2. Contrast: two formulas, one law

**WCAG 2.x** contrast is `(L1 + 0.05) / (L2 + 0.05)` on relative luminance. AA requires
4.5:1 for body text, 3:1 for large text (≥ 24px, or ≥ 18.66px bold) and for non-text UI
(focus rings, input borders, icons that carry meaning). It is the legal standard
(ADA case law, EN 301 549, the EU Accessibility Act), so **gate on it**.

Known weaknesses: it is symmetric (it ignores polarity, so light-on-dark is rated the
same as dark-on-light), it ignores font size and weight beyond one threshold, and it
over-rates some dark pairs (pure orange on black passes and reads badly).

**APCA** (Accessible Perceptual Contrast Algorithm, Somers; the candidate for WCAG 3)
outputs an Lc value that is polarity-aware and tied to font size and weight. Its
reference README gives the levels: about Lc 90 preferred for body text, 75 the minimum
for body text, 60 for other content text, 45 for large or heavy text, 30 the absolute
minimum for any text (placeholder, disabled), and 15 the floor for non-text. Vercel's
guidelines say "prefer APCA", and Harmonizer and `apcach` build palettes on it.

**Caution on APCA**: the reference code is "All Rights Reserved … Patent(s) pending",
licensed to W3C under specific limits, so don't vendor it into an open repo; use it via
its published npm package under its terms, or report it as advisory only. WCAG 3 is
still a draft.

**Practical rule**: pass WCAG 2 AA as a hard gate, report APCA Lc as a second opinion,
and fix pairs where they disagree badly, which is usually dark mode.

Tone-gap shortcut (from HCT, re-derived in [`ux-material-3.md`](./ux-material-3.md)):
an L* difference of 40 guarantees about 3.17:1 and 51 guarantees about 4.65:1 for any
hue pair. This makes "which step is the text step" a lookup instead of a search.

## 3. Four ways to build a scale

| Approach | Example | How a step is defined | Strength | Weakness |
|---|---|---|---|---|
| **Fixed lightness ladder** | Tailwind v4 (50 … 950 in OKLCH) | Each step has a nominal L; chroma shaped per hue | Simple, predictable class names | `500` of different hues has different contrast, so "text-*-600 on white" is only safe per hue |
| **Contrast-targeted** | Adobe Leonardo (`ratios: [3, 4.5]` against a named background); Evil Martians Harmonizer (APCA or WCAG per level) | Each step is the colour on a hue path that hits a contrast target against the background | **Every hue's step N has the same contrast**, so swapping a hue can't break text legibility; themes regenerate by changing background lightness | Steps are tied to one background; needs a solver |
| **Functional steps** | Radix Colors (12 steps): 1–2 app backgrounds, 3–5 component backgrounds (normal, hover, active), 6–8 borders and separators (subtle, normal, strong), 9–10 solid fills (normal, hover), 11–12 text (low and high contrast) | Each step has a *job*, tuned by eye for light and dark, plus alpha variants | Maps straight onto component states; the role is the API | Hand-tuned per hue; adding a brand hue means tuning 24 values |
| **Seed → tonal palettes → roles** | Material dynamic colour (HCT) | One or two seeds expanded into tones 0–100 for five palettes, roles picked by tone with contrast curves | A whole light, dark and high-contrast theme from one input; contrast levels for free | Recognisably Material if you keep its role mapping and Tonal Spot muting |

What a React and Tailwind app needs is the **union**: roles from Radix and shadcn,
steps solved against contrast targets as Leonardo does, a seed-driven generator as
Material has, all emitted as OKLCH CSS variables. That is what `palette.mjs` does:

1. Take one or two seeds (from the brief; see [`ux-mood-to-theme.md`](./ux-mood-to-theme.md)).
2. Build a 12-step ramp per hue by solving OKLCH L for target contrasts against the
   light and the dark ground, with chroma shaped to peak mid-ramp and gamut-mapped.
3. Derive neutrals from the primary hue at very low chroma (≤ 0.02 at the light end,
   following the Claude Design canvas rule "avoid saturations above 0.02 for whites",
   and artifact-design's "a grey with a slight hue bias toward the page's accent").
4. Map steps to shadcn roles (`--background`, `--foreground`, `--primary`,
   `--primary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--border`,
   `--ring`, …) for light and dark.
5. Validate (§5) and emit `globals.css` for Tailwind v4 plus a JSON report.

## 4. Harmony: what actually makes colours go together

- **Hue-wheel harmonies are weak rules.** Complementary, triadic and similar schemes say
  nothing about lightness and chroma, which dominate whether colours sit together. The
  Claude Design canvas rule is a better default: "All accents should share the same
  chroma and lightness; vary hue." Matched L and C with varied h is how Tailwind,
  Radix and Harmonizer keep a multi-hue palette coherent.
  **But not for charts.** Building `palette.mjs` showed that five chart hues at equal
  OKLCH L and C (0.60, 0.14) spaced around the wheel had a worst-pair ΔE×100 of
  **0.4–2.6 under protan or deutan simulation**, against the dataviz target of 8. Hue
  alone carries little for red-green CVD. Categorical palettes need lightness
  variation as well, so the generator searches a hue × lightness grid
  (farthest-point, scored against both the normal-vision and the CVD gate), and it
  passed both gates on all 18 test seeds.
- **Dominance beats balance.** "Dominant colors with sharp accents outperform timid,
  evenly-distributed palettes" (Anthropic cookbook); the 60/30/10 discipline
  (avoid-ai-design C4). One ground, one ink, one accent with a job, plus fields
  (taste-skill's palette library is structured exactly that way: `bg`, `surface`, `ink`,
  `muted`, `accent`, `accentInk`, `fields`).
- **Temperature, not angle.** Material's `TemperatureCache` finds analogous and
  complementary colours by perceived warmth (a CIELAB formula peaking around hue 50°)
  rather than by rotating hue by 180°, which avoids the muddy complements that raw
  rotation produces.
- **Neutrals carry the palette.** Most UI pixels are neutral. A neutral tinted toward
  the accent hue at very low chroma makes a palette look designed; pure `#808080`
  greys "look unconsidered" (artifact-design).
- **Semantic colours are separate.** Success, warning, danger and info are fixed by
  convention and accessibility, are not the accent, and are tuned to the same
  lightness and chroma band as each other (artifact-design, Claude `dataviz` "Status
  palette (fixed, never themed)").
- **Second colour, second job.** If primary and accent sit within about 20° of hue,
  it's "one hue pretending to be two" (avoid-ai-design C8).

## 5. Validate mechanically

"Find the part of your taste that is arithmetic, and ship it as an exit code"
(`prompts/agent-generative-output.md` §11). The checks worth automating:

| Check | Threshold | Severity | Source |
|---|---|---|---|
| Body text against its surface | WCAG ≥ 4.5:1 (light and dark) | FAIL | WCAG 2.2 |
| Large text, icons, focus ring, input border against the surface | ≥ 3:1 | FAIL | WCAG 2.2 (1.4.11) |
| APCA Lc for body text | ≥ 75 (prefer 90) | WARN | APCA README |
| `primary-foreground` on `primary` | ≥ 4.5:1 | FAIL | shadcn role pair |
| Categorical chart colours: CVD separation | OKLab ΔE×100 ≥ 8 target, ≥ 6 floor, worst of protan and deutan under Machado 2009 severity 1.0 | WARN or FAIL | Claude `dataviz` validator |
| Categorical chart colours: normal-vision separation | worst pair ΔE×100 ≥ 15 | FAIL | Claude `dataviz` |
| Chart hue chroma floor | C ≥ 0.10 ("below it a hue reads as gray") | WARN | Claude `dataviz` |
| Primary and accent hue distance | ≥ 20° or a clear L difference | WARN | avoid-ai-design C8 |
| Disliked colour (dark yellow-green: HCT hue 90–111, chroma > 16, tone < 65) | avoid as brand or accent | WARN | Material `DislikeAnalyzer` (Palmer and Schloss 2010) |
| Distance to known tell clusters (cream #F4F1EA ground, terracotta #D97757 accent, indigo-500 and violet-500 primaries) | OKLab ΔE×100 < about 6 | WARN (the brief may ask for it) | frontend-design, Impeccable `cream-palette`, `ai-color-palette` |
| Light neutrals' chroma | ≤ 0.02 | WARN | Claude Design canvas skill |

About 8% of men and 0.5% of women of Northern European descent have red-green colour
vision deficiency. Anything that encodes state by colour also needs a second channel
(icon, label, position or texture): Vercel's "Redundant status cues (not
color-only)" and `dataviz`'s texture fills.

## 6. Perception research: preference and emotion

What is solid enough to use in a generator:

- **Ecological valence theory** (Palmer and Schloss, 2010, PNAS): colour preference
  tracks how much people like the objects associated with a colour. Blues and cyans
  are broadly liked; **dark yellow-green and brownish olive are broadly disliked**
  (associated with mould, rot and waste). Material operationalised exactly this in
  `DislikeAnalyzer`. Preference is shaped by culture and by in-group objects (for
  example university colours), so it can be shifted. This is a reason to derive
  colour from the *subject's* liked objects (its materials, place and artefacts)
  rather than from a hue table.
- **Colour-emotion associations are largely shared across cultures** (Jonauskaite et
  al., 2020, *Psychological Science*: 4,598 participants in 30 nations, 22 languages,
  12 colour terms against 20 emotions; average pattern similarity r = .88), with
  measurable local variation that grows with linguistic and geographic distance.
  Universal mappings are a reasonable default; localise when the audience is
  specific.
- **Lightness and saturation carry more emotional signal than hue.** In the classic
  dimensional studies (Valdez and Mehrabian, 1994), brightness tracks pleasantness and
  saturation tracks arousal. So "calm" is mostly *low chroma and high or mid
  lightness* in any hue, and "energetic" is *high chroma*. For a generator, set L and C
  from the mood first and choose h from the subject second. This is the opposite of
  the common "calm = blue, energy = red" lookup.
- **Hue-emotion stereotypes are weak and context-bound** (red reads as love *and*
  anger; the association exists but varies). Don't build a mood-to-hue table and call
  it science. See [`ux-mood-to-theme.md`](./ux-mood-to-theme.md) for how the
  tools actually do it.

## 7. Dark mode

- **Not an inversion.** Re-solve each step against the dark ground. Saturated hues
  need *less* chroma and more lightness on dark to look the same, and pure black
  grounds make high-chroma text vibrate. Material's dark surface sits at tone 6 (CMF
  at 4), not 0.
- **Elevation by lightness.** On dark, higher surfaces get lighter (Material's
  surface-container ladder); shadows barely read.
- **Polarity matters for contrast**: WCAG treats it symmetrically and APCA doesn't.
  Check the dark theme's muted text separately; it is the most common failure
  (avoid-ai-design C3, C9).
- Set `color-scheme: dark` so native controls and scrollbars follow (Vercel, and
  the artifact contract).

## 8. Libraries and tools

| Tool | Licence | Use it for |
|---|---|---|
| `culori` | MIT | Conversions (OKLCH, OKLab, P3, CAM16), gamut mapping, ΔE, CVD filters, in JS |
| `colorjs.io` | MIT | The same, by CSS Color spec editors; spec-exact gamut mapping |
| `@material/material-color-utilities` | Apache-2.0 | HCT, seed-to-scheme, contrast levels, image extraction, dislike, temperature |
| `@adobe/leonardo-contrast-colors` | Apache-2.0 | Contrast-targeted ramps and themes |
| `@radix-ui/colors` | MIT | Hand-tuned 12-step functional scales (light, dark, alpha, P3) |
| Harmonizer (Evil Martians) | no licence file in the repo | OKLCH and APCA palettes in Figma or on the web; exports Tailwind |
| `apca-w3` | restricted | APCA reference; see §2 |
| Huemint, Coolors, Khroma | closed | Generative and ML palette tools; not inspected |
