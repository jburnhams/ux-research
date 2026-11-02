# AI slop in interface design: what it is, where it comes from, how it moves

"AI slop" in UI is not one look. It is **any default that shows up regardless of
the subject**, and it moves every time the field publishes a fix. This doc is
the cross-source synthesis. Each tell links back to the sources that name it,
and §5 records where those sources disagree, since the disagreements are where
the design decisions are.

Sources compared (each folder has its own README with licence and commit):
[`anthropic-frontend-design/`](./anthropic-frontend-design),
[`anthropic-cookbook-frontend-aesthetics/`](./anthropic-cookbook-frontend-aesthetics),
[`impeccable/`](./impeccable) (62-rule detector),
[`taste-skill/`](./taste-skill) (247-site study),
[`avoid-ai-design/`](./avoid-ai-design) (about 70-tell catalogue, 23 cited sources),
[`anti-ai-slop/`](./anti-ai-slop), [`anti-slop-design/`](./anti-slop-design),
[`vercel-web-interface-guidelines/`](./vercel-web-interface-guidelines),
[`shadcn-skill/`](./shadcn-skill), the generator prompts in
[`generator-prompts/`](./generator-prompts), and Claude's artifact and design
skills ([`claude-design-skills/`](./claude-design-skills)).

---

## 1. Why it happens: the mechanism every source agrees on

Every source gives the same causal story in different words:

- **"Distributional convergence"** (Anthropic cookbook): "You tend to converge
  toward generic, 'on distribution' outputs."
- "An LLM emits the most probable token. For an *unconstrained* visual choice,
  'most probable' is the statistical average of every Tailwind tutorial scraped
  2019–2024" (anti-ai-slop).
- "It does not choose indigo; indigo is the average" (avoid-ai-design).
- "A page built by a model usually looks like the average of every page the model
  has seen … Nothing in it is wrong and nothing in it was decided" (taste-skill).

The React and Tailwind specifics are what make the mechanism concrete. The
median of the corpus is literally the stack's defaults:

| Default in the stack | What it became |
|---|---|
| Tailwind UI's `bg-indigo-500` buttons (Adam Wathan acknowledged the downstream effect publicly in 2025, per avoid-ai-design C1) | The "AI purple" CTA and the indigo-to-violet hero gradient |
| shadcn/ui `components.json` base colour (`zinc`, `slate`, `neutral`), stock `--radius` | The untouched kit. avoid-ai-design K1 puts it on about 23.5% of the Show HN sample, and the Reddit-mined ranking puts it first |
| `next/font` Geist and Geist Mono in `create-next-app`; Inter as the default sans in most kits | Typography that "was never chosen" (T1, T4) |
| `lucide-react` shipped with shadcn | `Sparkles` beside "AI", icons in tinted `rounded-xl` squares (K6, I3) |
| `container mx-auto px-4`, `max-w-7xl mx-auto` | One width forever (L6) |
| `rounded-lg`, `shadow-sm` (Tailwind v4 `--shadow-sm` is `0 1px 3px 0 rgb(0 0 0 / 0.1), …`) | "The same soft grey shadow (rgba(0,0,0,.1)) under each" card (frontend-design cluster 4) |
| Framer Motion `initial={{opacity:0,y:20}} whileInView` in every tutorial | Fade-and-rise on every section (M1) |
| Aceternity and Magic UI registries (Spotlight, Beams, Shimmer Button, Number Ticker) | Stock effects "across Product Hunt's top products" (K10) |

The practical consequence for a React and Tailwind project: **slop is mostly the
stack left as installed**, so most of the fix is a theming decision, not a
component rewrite (see [`ux-react-tailwind.md`](./ux-react-tailwind.md)).

## 2. The waves: why every list goes stale

The single most important finding across sources is that **the remedy becomes
the next tell**. taste-skill is the only source that dates its registry, and
avoid-ai-design names "orders" of default. Lined up:

| Wave | Look | Who named it as a tell | What caused it |
|---|---|---|---|
| **1. The median (2023–24)** | Purple/indigo gradient, Inter, centred hero over three icon cards, glass, emoji icons, gradient text, glowing CTA | Everyone; the canonical "Purple Problem" | Tailwind and shadcn defaults (§1) |
| **2. The decorated median (2025)** | Eyebrow or kicker above every heading, pill badge above the hero ("✨ New"), one italic or coloured word in the headline, bento grids, near-black with one neon accent and a glow, floating pill nav, fake dashboard hero, pulsing status dot, fade-up on every section | taste-skill wave 2, Impeccable `hero-eyebrow-chip` and `kicker-above-heading` | First-generation anti-slop prompts telling models to add "atmosphere", "staggered reveals", "expressive fonts" (see [`ux-generator-prompts.md`](./ux-generator-prompts.md) §3) |
| **3. The tasteful escape (2025–26)** | Warm cream (#F4F1EA) with a high-contrast serif and terracotta (#D97757); near-black with acid green; broadsheet hairlines and zero radius; mono micro-labels; `A · B · C` meta strings; `WORD — fragment` labels; a `→` on every link | Anthropic `frontend-design` (five clusters), taste-skill wave 3, avoid-ai-design SD1–SD8, anti-ai-slop rule 9 | The published remedy, "warm it up and make it editorial", adopted wholesale. The terracotta is "Anthropic's own Claude-interaction accent" |
| **4. Forming (late 2026)** | Handmade "anti-AI" reaction: grain, hand-drawn type, scrapbook collage; emerald as the "purple escape" accent; sketchy SVG illustrations | avoid-ai-design ("a third order is already forming"), SD8, Impeccable `<codex>` sketchy-SVG ban | Models told to "look human" |

Two consequences shape everything in [`ux-design/`](./ux-design):

1. **Never ship a list of replacements.** "Every published 'use this instead' list
   has become the next wave of tells within months" (taste-skill). The Anthropic
   cookbook recommended Space Grotesk, Fraunces and JetBrains Mono, and all three
   are now on overused lists, Fraunces and Space Grotesk in Impeccable's
   `overused-font` rule itself. Replacements must be *procedures* (derive from the
   subject, deal from a large library, check against the brief), not products.
2. **A tell list is dated data, not a principle.** It needs a date on it and a
   review cadence, the way this repo's sibling `prompts` does weekly passes.

## 3. The catalogue, by layer

Grouped by the layer of a React and Tailwind app where each one lives, with the
detectability split from avoid-ai-design: **src** means it is visible in source
(a linter can own it), **render** means it needs pixels, and **judge** means it
needs intent against the brief. Severity is avoid-ai-design's: **P0** a layperson
notices, **P1** a designer or developer notices, **P2** craft.

### 3a. Colour and surface

| Tell | Sev | Det | Named by |
|---|---|---|---|
| Purple/indigo/violet gradient (135°, hero, CTA, glow) | P0 | src | all; Impeccable `ai-color-palette` |
| Indigo/violet primary button | P1 | src | avoid C2, anti-ai-slop 1 |
| Gradient text (`bg-clip-text text-transparent`) | P0 | src | Impeccable `gradient-text`, taste (banned), frontend-design |
| Coloured glow shadows (`shadow-indigo-500/50`, zero-offset halos) | P1 | src | Impeccable `dark-glow`, avoid C5 |
| Radial halo or spotlight behind the hero | P1 | src | Impeccable `radial-halo`, `radial-spotlight-glow`; avoid M3 ("the Linear glow") |
| Cream or beige ground by reflex; cream plus terracotta | P1 | src | Impeccable `cream-palette`; frontend-design cluster 1; taste wave 3 |
| Near-black (#0B0B0B, #111) standing in for black; one acid accent | P1 | src | frontend-design clusters 2 and 5 |
| `zinc-950` card with `border-white/10` (the default dark SaaS card) | P1 | src | avoid K9 |
| Dark mode nobody asked for | P1 | judge | avoid C7, anti-slop-design |
| Timid, evenly distributed palette; primary and accent within 20° of hue | P1/P2 | render/src | avoid C4 and C8; cookbook ("dominant colors with sharp accents outperform timid, evenly-distributed palettes") |
| Grey text on a coloured surface; muted text below AA | P1 | render | Impeccable `gray-on-color`, `low-contrast`; avoid C9 |
| Glass and backdrop blur as decoration | P1 | src | Impeccable craft floor, avoid K3, taste wave 1. Reddit data says *over-blamed* (§5) |
| Grid-line or stripe backgrounds with no canvas under them | P2 | src | Impeccable `codex-grid-background`, `repeating-stripes-gradient` |

### 3b. Typography

| Tell | Sev | Det | Named by |
|---|---|---|---|
| Inter, Roboto or system stack for everything, no second face | P0 | src | avoid T1, cookbook, Codex/Amp, Emergent |
| The "tasteful free font" cluster as the only design gesture (Space Grotesk, Geist, Syne, Sora, Instrument Serif, Fraunces, Cal Sans; about 15.8% of the Show HN sample) | P1 | src | avoid T2, Impeccable `overused-font` |
| Oversized italic serif hero headline | P1 | src | Impeccable `italic-serif-display`, taste wave 3 |
| One accented word in the headline (italic, colour, gradient, highlighter) | P1 | src | frontend-design (first item), avoid SD5, taste wave 2 |
| Tracked ALL-CAPS eyebrow or kicker above headings | P1 | src | Impeccable bans it outright ("no brief earns it back"); taste data: 16% of top sites against 57% of weak |
| Full-sentence headline at display size, three or more lines | P1 | render | Impeccable `oversized-h1`, taste ("banned over two lines") |
| Flat scale (steps under 1.25×), nine near-equal sizes | P2 | render | Impeccable `flat-type-hierarchy`; taste ("five sizes, far apart") |
| Monospace as a costume for "technical" | P1 | src | Impeccable craft floor, frontend-design cluster 5, taste (banned, though the data shows it on 44% of top sites) |
| Font declared in CSS but never loaded | P1 | src | avoid T7 ("declaring is not shipping") |
| Crushed tracking (below -0.04em) | P2 | src | Impeccable `extreme-negative-tracking` |

### 3c. Layout and page structure

| Tell | Sev | Det | Named by |
|---|---|---|---|
| Centred hero: pill badge, H1, grey subhead, two buttons, screenshot below | P0 | src | avoid L1; taste data: centred statement over media is 7% of top sites against **24%** of weak |
| Three (or six) identical icon-topped feature cards | P0 | src | everyone; Impeccable `icon-tile-stack` |
| The stock section waterfall: hero, logos, features, how-it-works, testimonials, stats, pricing, FAQ, CTA, footer | P1 | src/render | avoid L9 ("the silhouette test"), taste ("write the argument" first), anti-ai-slop 8 |
| Hero-metric template / stat strip of round numbers ("10,000+ teams", "99.9%") | P1 | src | frontend-design, Impeccable `hero-metric` ban, avoid L4, anti-ai-slop 7 (fabricated precision) |
| Three-tier pricing with a ringed "Most Popular" middle | P1 | src | avoid L7 |
| Four-column footer with newsletter box and social row | P1 | src | avoid L8 |
| Everything centred (over 72% centred text) | P1 | render | taste structural, artifact-design |
| Numbered 01 / 02 / 03 markers on non-sequences | P1 | src | frontend-design, Impeccable, avoid SD6, artifact-design ("Structure is information") |
| Bento grid as the default composition | P1/P2 | judge | taste wave 2, avoid L3 (also over-blamed per Reddit) |
| Monotonous spacing; heading closer to the block above than its own content | P2 | render | Impeccable `monotonous-spacing`, `heading-rhythm`; avoid S1 |

### 3d. Components and chrome

| Tell | Sev | Det | Named by |
|---|---|---|---|
| Untouched shadcn defaults (base colour, `--radius`, Card, Button) | P0 | src | avoid K1 and K8 |
| `rounded-2xl shadow-lg` on everything; one radius regardless of hierarchy | P1 | src | frontend-design cluster 4, artifact-design ("`rounded-lg` everywhere"), avoid K2 |
| Hairline border *plus* a wide soft shadow on a whole row of cards (the "ghost card") | P1 | src | Impeccable `gpt-thin-border-wide-shadow` (a GPT-family tell), taste app rules |
| Coloured left or top stripe on a rounded card | P1 | src | Impeccable `side-tab` ("the most recognizable tell"), artifact-design ("accent bar/rail on rounded cards"), Krebs ("almost as reliable … as em-dashes are for text") |
| Icon in a tinted rounded-square chip, one per feature or KPI | P1 | src | Impeccable `icon-tile-stack`, avoid K6, taste app rules ("0 of 23" real screens) |
| Cards inside cards | P2 | render | Impeccable `nested-cards` ("always wrong"), avoid K11 |
| Status-chip soup; decorative pulsing "live" dot | P2 | src | avoid K12, Impeccable `pulsing-dot` |
| Fake window chrome (macOS traffic lights) as the hero | P2 | src | avoid SD7 |
| Stock effect components (Spotlight, Beams, Meteors, Number Ticker, Marquee) | P1 | src | avoid K10, Impeccable `marquee` |
| Emoji as icons or bullets; Unicode glyphs as an icon system | P1 | src | everyone; v0, Same.dev and Lovable prompts all ban it |
| The worn Lucide set: `Sparkles` for AI, `Zap`, `Rocket`, `Shield`, `ArrowRight` | P1 | src | avoid I3 |
| Modal as the first thought | P2 | judge | Impeccable `operate.md` |

### 3e. Motion

| Tell | Sev | Det | Named by |
|---|---|---|---|
| Identical fade-and-rise on every section | P2 | src | frontend-design, avoid M1, Impeccable craft floor |
| Bounce or elastic easing (`animate-bounce`, `easeOutBack`) | P2 | src | Impeccable `bounce-easing` (advisory), avoid M4 |
| Hover lift on every card; scattered micro-interactions | P2 | src | taste motion tells, avoid M2 |
| Count-up numbers on scroll | P2 | src | avoid M5 |
| Content left at `opacity: 0` waiting for an observer that never fires | **error** | render | Impeccable `content-hidden-at-rest`, artifact-design ("Make the page complete at rest") |
| Motion that ignores `prefers-reduced-motion` | P1 | src | everyone in §4 |

### 3f. Copy

| Tell | Sev | Det | Named by |
|---|---|---|---|
| Benefit-speak: elevate, unlock, supercharge, seamless, empower, streamline, leverage, all-in-one, cutting-edge, world-class | P1 | src | Impeccable `marketing-buzzword`, avoid CP1–CP2, anti-ai-slop 6, taste copy tells |
| "Not just X, it's Y"; "X. No Y." aphoristic cadence across sections | P1 | src | Impeccable `aphoristic-cadence`, anti-ai-slop, Codex writing rules |
| Tricolon slogans ("Faster, smarter, simpler") | P2 | src | avoid CP4, taste |
| `→` stapled to button and link text | P1 | src | frontend-design cluster 5, avoid CP3 |
| Generic CTA ("Get started", "Learn more", "Submit") | P2 | src | frontend-design ("'Save changes,' not 'Submit'"), Vercel ("'Save API Key' not 'Continue'"), avoid CP6 |
| Em-dash saturation (8 or more at about 1 per 500 characters) | P2 | src | Impeccable `em-dash-overuse` (advisory only: "humans use em-dashes legitimately") |
| "X theater" framing | P2 | src | Impeccable `theater-slop-phrase` (Codex-family) |
| Performative labels ("Field notes", "Quietly trusted by", "On our desks") | P2 | src | taste wave 3 |
| Placeholder identities: Acme, John Doe, lorem ipsum, pravatar, DiceBear | P1 | src | avoid IM4, taste app rules |
| "Welcome back, Alex 👋" dashboard greeting | P1 | src | taste app tells |

### 3g. Signatures and drift

- **Generator fingerprints left in** (`lovable-tagger`, `gpt-engineer`, v0 meta).
  avoid F1.
- **Cross-page drift**: two pages of one product with different fonts, palette or
  radius. "Slop is convergence … drift is divergence from your own system"
  (avoid X1). Only visible side by side.
- **Model-family tells**. Impeccable is the only source that keys tells to the
  model family: a `<codex>` block (ghost cards, sketchy SVG, stripe and grid
  backgrounds, "theater" copy) next to the general ones, and frontend-design names
  Claude's own terracotta. Expect each model to have its own signature, and any
  tell list tuned on one model to under-report another.

## 4. The quality floor is a different axis

Every anti-slop source also carries a quality floor (contrast, focus, states,
reduced motion, real content, responsive). Vercel's guidelines are almost
*nothing but* the floor. It is worth keeping the two axes apart:

| | Slop axis | Quality axis |
|---|---|---|
| Question | Did anyone decide this? | Does it work for everyone? |
| Failure looks like | Generic, interchangeable, "AI" | Broken, inaccessible, fragile |
| Brief can override? | Yes, always ("the brief wins") | No |
| Best detected by | Pattern rules, then judgement against the brief | Deterministic checks, a browser render, axe-style audits |
| Representative source | Impeccable `slop` rules, taste tells | Vercel WIG, Impeccable `quality` rules, shadcn rules |

A page can be distinctive and broken, or accessible and generic. Impeccable's
finding that **design-time accessibility reminders make models produce safer, more
generic output** (its CLAUDE.md) suggests keeping the floor out of the creative
prompt and enforcing it in a separate audit pass. [`ux-design/`](./ux-design)
follows that split.

## 5. Where the sources disagree

| Topic | Position A | Position B | Resolution used in `ux-design/` |
|---|---|---|---|
| **Backgrounds** | Cookbook, Codex/Amp, Claude Design canvas: "atmosphere and depth over flat fills: gradient meshes, noise, patterns, … grain" | v0: "Avoid gradients entirely"; Impeccable `radial-halo`; taste bans gradients on grounds | Wave 1 advice became wave 2 tells. Flat by default; texture only from the subject's world (Impeccable: "need an actual canvas, map, blueprint, or measuring tool under them") |
| **Entrance motion** | Cookbook, Codex: "one well-orchestrated page load with staggered reveals" | frontend-design: fade-and-slide-up "read as AI-generated"; Impeccable Operate: "No orchestrated page-load sequences" | Mode decides. Persuade: at most one authored moment. Operate: motion only for state, 150–250 ms |
| **Casing** | Vercel: "Title Case for headings/buttons (Chicago style)" | frontend-design, avoid CP5, anti-ai-slop: sentence case | Sentence case; follow a house style if the project has one |
| **Borders and shadows** | Vercel: "Layered shadows", "semi-transparent borders + shadows" | Impeccable `gpt-thin-border-wide-shadow`; taste: "a border or a shadow, never both" | One elevation channel per surface; both only on a genuinely floating layer |
| **Monospace labels and index numbers** | taste data: *more* common on top gallery sites (44% against 24%; 38% against 21%) | taste and Impeccable ban them anyway, as owner taste | Allowed when they encode data (IDs, ranks, real sequences); banned as costume |
| **Glass, bento, aurora** | Banned or warned by taste, anti-slop-design, Impeccable | Reddit study (3.2M posts): rank low as perceived tells; aurora "rejected on verification" | Lower priority; flag only as reflexive defaults |
| **Fonts like Inter and Geist** | Impeccable `overused-font`, avoid T1, cookbook: avoid | Impeccable `operate.md`: "System fonts and familiar sans defaults" are permitted on product UI | Mode-dependent: a tell on Persuade surfaces, acceptable on Operate surfaces if tuned (scale, weights, tabular figures) |
| **Removing tells** | Most skills: remove the pattern | taste: "blind jurors rightly prefer a richer page with tells over an empty page without them" | Removal is never the fix by itself; substance (subject, real content, committed type) comes first |
| **Asking about aesthetics** | Claude Design canvas: "Settle the aesthetic with the user, not for them … this is how you get slop!" | taste and anti-slop-design: "If the request is vague, decide and state your reading in one line instead of asking" | Ask when a human is in the loop and the axis is genuinely open; otherwise commit, state the assumption, offer one alternate |
| **Contrast metric** | Vercel: "prefer APCA over WCAG 2" | Everyone else quotes WCAG 2 ratios | Gate on WCAG 2 AA (still the legal standard); report APCA Lc as advisory ([`ux-colour-science.md`](./ux-colour-science.md)) |
| **Multiple artefacts** | anti-ai-slop: a set "must diverge on the primary axes" | avoid X1: pages must share one system | Different products diverge; pages of one product share a contract |

## 6. Evidence quality

Little of this is peer-reviewed. What exists:

| Evidence | What it measures | Caveat |
|---|---|---|
| Krebs, Show HN study (about 1,400 sites, 16 CSS/DOM heuristics), via avoid-ai-design | Prevalence of each pattern in a slop-prone sample | 5–10% false positives per the author; skews to solo AI-built projects. Primary source not reachable from this session ([`blocked-sources.md`](./blocked-sources.md)) |
| JCarterJohnson `vibecoded-design-tells` (3.2M Reddit posts, 47 subreddits, 2020–26; counts stored in [`vibecoded-design-tells/`](./vibecoded-design-tells)) | Which tells people *complain about*. "All looks the same" and "screams AI" run at about 13% of posts each, five times any specific tell. Comments rank shadcn defaults (2.5%) and purple (2.3%) top; posts rank emoji (2.7%) top. Fonts, bento and centring are rarely named | Vocal-opinion proxy; keyword matching; ranking more reliable than percentages |
| taste-skill study (248 gallery sites plus 23 app screens; model jurors) | Device frequency in top against weak sites | Model jurors on stills; gallery fashion ≠ quality; usability does not rise with score |
| taste-skill blind tests | Pages with tells removed and nothing added lose | Owner-run, small, model jurors |
| Impeccable private evals | Code-led beats comp-led on app screens (3–3.5 against 2.0–2.9); a11y reminders reduce design ambition | Private repo; numbers quoted from CLAUDE.md only |
| anti-ai-slop testing | 4 of 10 generated apps were blank pages that passed every code check | Small, single run |
| Anthropic cookbook | Before and after screenshots of three prompts | Illustrative, not measured |

No source has run a controlled study with **human** raters judging "looks AI-made"
against "looks designed" on matched briefs. That is the open gap, and the
evaluation plan in [`ux-design/README.md`](./ux-design/README.md) §6 is a
proposal for it.
