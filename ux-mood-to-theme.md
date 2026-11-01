# From concept, keyword, mood or vibe to a theme

"Make it feel calm and premium" is the most common design brief and the one most
likely to produce the median. This doc compares how the tools turn a mood into
tokens, shows that **mood vocabulary converges as badly as palettes do**, and sets
out the procedure [`ux-design/`](./ux-design) uses.

## 1. The core problem, stated best by Google's DESIGN.md

From [`google-design-md/PHILOSOPHY.md`](./google-design-md/PHILOSOPHY.md):

> "Modern, clean, trustworthy, premium" evokes nothing specific. A model creates
> something in the center of what those words describe, creating an output that is
> typically generic. **Adjectives describe a region. A specific reference describes a
> point.**

and:

> A design that references "A 1970s graduate lecture handout in the tradition of an old
> and established university" evokes a complete world: the one color of ink, the
> generous margins, the serif set at a reading size, and the absence of decoration …
> The negative constraints arrive for free when the reference is specific enough.

This matches taste-skill's study ("high scores go with a concept taken from the
subject") and Anthropic's "the subject's industry, subject matter, materials, and
vernacular are where distinctive visual choices come from." A mood word is an input
to *choosing a reference*, not a direct input to choosing colours.

## 2. Seven approaches in the wild

| # | Approach | Example | What it produces | Verdict |
|---|---|---|---|---|
| 1 | **Adjective expansion** | Google Stitch `enhance-prompt` "Amplify the Vibe": "modern" → "clean, minimal, with generous whitespace"; "fun" → "vibrant, playful, with rounded corners and bold colors" | More adjectives, a bigger region | **Produces the median.** It contradicts Google's own DESIGN.md philosophy in a sibling repo |
| 2 | **Brief tool** | v0 `GenerateDesignInspiration(goal, context)`: "If you generate a design brief, you MUST follow it" | A separate model call writes the brief | Better than inline, but v0's own transcript then reaches for "a bento grid and other components provided in my examples" |
| 3 | **Pick an extreme** | Claude Design canvas: "Tone: pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial…" | A style label | Moves off the centre, but the list is itself a menu, and menus become tells |
| 4 | **Reference world** | DESIGN.md's "1970s graduate lecture handout"; Impeccable's palette seeds ("Negroni hour at a Milanese bar: bittersweet crimson, vermouth and amaro under low tungsten"); taste-skill's subject inventory | A point in design space with built-in constraints | **Strongest**, if the reference comes from the subject and not from a stock of "tasteful" references (§3) |
| 5 | **Dealt from a curated library** | taste-skill `draw.mjs` deals 3 of 20 directions with type, palette and sections from 247 sites; Impeccable `concept-seed` deals from a private catalogue | Randomness from outside the model | Strong against convergence; the cost is building and maintaining the library |
| 6 | **Human picks among axis-separated options** | Claude Design canvas: 2–4 low-fi directions differing on a nameable axis ("Warm editorial" against "Dense data-first"), each with "an honest motivation and its main tradeoff" | A choice the user made | Strongest when a human is present; the canvas skill says skipping it "is how you get slop" |
| 7 | **Extraction from an artefact** | Material `Score` and quantisers rank colours from an image as seeds; Stitch `extract-design-md` pulls a DESIGN.md from a URL; Same.dev's site cloning | Colours and type taken from something real | Good for brand continuity (the image *is* the reference); copying a competitor's site is the opposite of differentiation |
| — | ML palette generators | Huemint, Khroma (closed; not inspected) | Palettes learned from data or from user likes | Unknown; a learned model trends to its training median by construction |

## 3. Reference worlds converge too: evidence

[`impeccable/palette-seeds.tsv`](./impeccable/palette-seeds.tsv) holds the 128 OKLCH
seed colours Impeccable ships, each with a hand-written mood reference and a strategy.
This is the most careful mood-to-colour dataset in the collection, written by people
actively fighting slop. Counted over the mood strings:

| Term | Seeds containing it | Share |
|---|---|---|
| "considered" | 32 | 25% |
| "terracotta" | 13 | 10% |
| "apothecary" | 12 | 9% |
| "Negroni" / "oxblood" | 5 each | 4% |
| "Aesop" (a brand) | 4 | 3% |

Hue distribution of the seeds: 44 of 128 (34%) sit between 0° and 59° (reds,
oranges, terracottas); 20 in 240–269° (blue-violet); **zero** in 300–329°. A "tasteful"
reference vocabulary (apothecary, Milanese bar, linen, brass, oxblood, foundry
specimen) and a warm-red bias are visible. That is the third-wave tell
(cream plus terracotta) reappearing in the anti-slop tool's own seed set, and it
matches Impeccable's own `cream-palette` rule flagging the result.

Google's DESIGN.md philosophy example is the same: `paper: '#F4F0E4'` ("warmed
xerox stock, never pure white") with a vermilion accent. That ground is OKLab ΔE×100 = 0.76 from
Anthropic's cluster 1 ground (#F4F1EA), which is visually indistinguishable.

**Lesson**: a reference-world generator needs the same two guards as a palette
generator. (a) The reference must come from *this subject's* inventory, not from a
stock of tasteful references. (b) There must be a diversity check against what the
generator has produced before and against the known tell clusters.

## 4. The procedure

The procedure [`ux-design/`](./ux-design) uses (skill step 3, "Direction"):

1. **Classify the surface** (Persuade, Operate, Read, Experience). On Operate,
   the mood mostly sets density, palette restraint and one signature move, never
   layout or controls ([`ux-product-ui.md`](./ux-product-ui.md)).
2. **Inventory the subject**: 8–12 facts only this product has (its materials, place,
   numbers, constraints, rituals, printed artefacts). This is taste-skill's step 1,
   unchanged.
3. **Translate mood words into axes, not values.** Each mood word moves one or more
   levers. The table is a set of design heuristics consistent with §6 of
   [`ux-colour-science.md`](./ux-colour-science.md) (lightness and chroma carry most
   emotional signal), not a validated mapping:

   | Axis | Low end words | High end words | Levers it moves |
   |---|---|---|---|
   | Energy | calm, quiet, restful, considered | energetic, loud, urgent, playful | Accent chroma (≈0.05 → 0.25), number of saturated fields, motion stiffness (Material slow → fast springs), type weight contrast |
   | Weight | airy, light, delicate | heavy, solid, grounded, industrial | Ground lightness, ink weight, type weight and width, border thickness |
   | Temperature | cool, clinical, technical | warm, homely, crafted | Neutral hue bias (blue-grey → warm grey) at chroma ≤ 0.02; accent temperature (Material temperature model) |
   | Formality | casual, friendly, playful | formal, institutional, precise | Radius ladder (pill and 16px+ → 0–4px), type classification (humanist, rounded → grotesk, serif), casing, copy register |
   | Density | spacious, editorial | dense, data-first, utilitarian | Spacing scale base, type size steps, row heights, number of panels |
   | Era / material | contemporary | period, print, analogue | Type classification and specific period references; texture *only* if the material is real to the subject |
   | Contrast | soft, muted, gentle | stark, high-contrast, graphic | Ground and ink tone gap beyond the AA floor, Material contrast level (0 → 1) |

4. **Write three reference sentences**, each a *point*, each from a different item of
   the inventory, using taste-skill's form: "On this page/screen, [something that
   belongs to the subject] becomes [the device]." Run the competitor test on each:
   substitute the nearest competitor; if the sentence still works, discard it.
5. **Make the three directions diverge on named axes**: ground (light, dark or
   saturated field), type classification, accent hue (≥ 60° apart), radius stance
   (square, soft or round). Check each against the tell clusters (cream and
   terracotta, near-black and acid, indigo and violet, Geist/Inter on #f8f8f8). If two
   directions could be mistaken for one designer's, regenerate one (anti-ai-slop's
   set-divergence rule).
6. **Choose.** With a human present, show the three as low-fi option cards with an
   honest tradeoff each (Claude Design canvas). Without one, choose the direction
   whose reference most belongs to the subject, state the assumption in one line, and
   keep the other two in DESIGN.md as alternates.
7. **Derive tokens from the reference, not the adjectives**:
   - **Hue** from the subject's real objects (the place's paint, the product's
     material, the brand's existing mark), which also follows ecological valence
     theory (colours of liked objects are liked);
   - **L and C** from the energy, weight and contrast axes;
   - feed one or two seeds to `palette.mjs` (Material-style two-seed scheme) and
     validate;
   - choose type by classification and period from the reference, then find a face
     *not* on the overused list for this mode;
   - set radius, spacing and motion tokens from formality, density and energy.
8. **Write it down**: DESIGN.md with the reference sentence in Overview (DESIGN.md's
   "prose is where the design lives"), tokens in YAML, and do's and don'ts that the
   reference implies. Then generate `globals.css` from it.

## 5. Worked example

Brief: *"An app for sea swimmers to check tides and water temperature. Calm,
trustworthy, a bit of personality."*

- Surface: **Operate** (a tool used daily on a phone, often in bright light by the
  sea).
- Adjective path (what to avoid): "calm, trustworthy" usually produces a teal or blue
  gradient, Inter, rounded white cards, a wave illustration and "Dive in 🌊". That is
  the median.
- Inventory: tide tables printed in harbour-master offices; the colour of the
  specific bay at 7am; buoy and flag colours (red and yellow lifeguard flags); water
  temperature in °C to one decimal; the RNLI-style safety signage; wetsuit neoprene;
  the swim club's 6:30 meet time; "the slack water window".
- Reference sentences:
  1. "The tide table becomes the screen": a printed harbour tide table's column rhythm
     sets the layout, with tabular figures as the hero and a single ink colour.
  2. "Safety flags become the signal system": red and yellow used *only* for
     conditions, on a neutral sea-grey ground.
  3. "The water's colour at dawn becomes the ground": a full-field, low-chroma
     green-grey sampled from a photo of the actual bay.
- Axes: energy low (accent C ≈ 0.08–0.12 except the flag colours, which are semantic
  and fixed), contrast *high* (outdoor glare, so Material contrast level 0.5 and body
  APCA Lc ≥ 90), formality medium (4–8px radius), density medium-high (it's a tool).
- Choice (no human): direction 1, with direction 2's flag rule folded in as the state
  system. Seeds: the harbour-table ink (a deep blue-black) and the sea-grey.
  Typeface: a sturdy grotesk with true tabular figures; no display face (Operate).
  The signature move: the slack-water window drawn as a band across the tide curve.

None of these decisions could be made from "calm, trustworthy" alone. All of them
came from the inventory.
