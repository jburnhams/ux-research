# Tells: the dated registry (as of 2026-11)

A tell is a default that appears regardless of the subject. Each was once a good idea
on a good site; it became a tell by being produced everywhere without a reason. The
brief can ask for any of these; then build it well. **Det** = how it is found:
`lint` (slop-lint rule id), `render` (needs the pixels), `judge` (needs the brief).

Sources and evidence for every row: `ux-research/ux-slop-taxonomy.md`.

## Wave 1 (2023–24): the median

| Tell | Det |
|---|---|
| Purple/indigo/violet as the unchosen accent; the indigo→purple (or blue→purple) diagonal gradient on hero, CTA or background | `ai-palette`, `default-gradient` |
| Gradient-filled headline or metric text | `gradient-text` |
| Coloured glow shadows and zero-offset halos | `glow-shadow` |
| Glass panels and backdrop blur as decoration | `glass` |
| Three identical icon-topped feature cards | `icon-chip` + judge |
| Centred hero: pill badge, H1, grey subhead, two buttons, screenshot below | `hero-badge` + judge |
| Emoji as icons or bullets | `emoji-icon` |
| Inter / Roboto / the system stack as the only face (Persuade surfaces) | `overused-font` |
| Untouched shadcn theme: zinc/slate base, stock `--primary`, stock `--radius` | `untouched-shadcn` |

## Wave 2 (2025): the decorated median

| Tell | Det |
|---|---|
| Tracked ALL-CAPS eyebrow/kicker above headings | `eyebrow` |
| "✨ New / Introducing" pill above the hero | `hero-badge` |
| One word of the headline in italic serif, colour or highlight | `accent-word` |
| Near-black ground, one neon accent, a glow | `glow-shadow`, `radial-glow` |
| Blurred colour blob or radial spotlight behind the hero | `radial-glow` |
| Bento grid as the default composition | judge |
| Fade-and-rise on every section; hover lift on every card | `fade-up-everywhere` |
| Pulsing "live" dot with nothing live behind it | `pulse-dot` |
| Fake product chrome: macOS dots, grey-bar dashboard hero | `window-chrome` |
| Stock effects: Spotlight, Beams, Meteors, Shimmer Button, Number Ticker, Marquee | `stock-effect` |
| The worn Lucide set: `Sparkles` for AI, `Zap`, `Rocket`, `Shield` | `worn-icons` |

## Wave 3 (2025–26): the tasteful escape

The published remedy ("warm it up, make it editorial") became the most recognisable
generated look.

| Tell | Det |
|---|---|
| Warm cream/parchment ground (near #F4F1EA) with a high-contrast serif and a terracotta/clay accent (near #D97757) | `tell-colour` |
| Near-black (#0B0B0B, #111) with a lone acid-green or vermilion accent | judge |
| Broadsheet cosplay: hairline rules everywhere, zero radius, dense columns, on something that isn't a publication | render |
| Oversized italic serif hero headline | judge |
| The "tasteful free font" cluster as the only design gesture (Space Grotesk, Fraunces, Instrument Serif, Geist, Syne, Sora…) | `overused-font` |
| Monospace micro-labels as a "technical" costume | `mono-costume` |
| Template chrome: `A · B · C` meta strings, `WORD — fragment` labels, a `→` on every link | `middot-meta`, `arrow-label` |
| Decorative 01 / 02 / 03 markers on things that aren't a sequence | `numbered-markers` |
| Performative labels ("Field notes", "Quietly trusted by", "On our desks") | judge |

## Wave 4 (forming, late 2026)

| Tell | Det |
|---|---|
| Emerald or teal as the "purple escape" accent when nothing asked for green | `palette.mjs` warn |
| Handmade "anti-AI" reflex: grain, sketchy SVG illustrations, hand-drawn type, scrapbook collage, when the subject doesn't earn it | judge |
| Hairline border plus a wide soft shadow on every card in a row (the "ghost card") | render |
| Decorative grid-line or stripe backgrounds with no canvas, map or blueprint under them | judge |
| "X theater" framing in copy | judge |

## Structure (any wave)

| Tell | Det |
|---|---|
| The stock section waterfall (hero, logos, features, how-it-works, testimonials, stats, pricing, FAQ, CTA, footer) whatever the product | judge (silhouette test against 5 competitors) |
| Round vanity numbers ("10,000+ teams", "99.9%") and invented proof | `vanity-stat` |
| Three-tier pricing with a ringed "Most Popular" middle, regardless of the real plans | judge |
| Four-column footer with newsletter and social row, whatever links exist | judge |
| Everything centred; one width (`max-w-7xl mx-auto`) forever | render |
| One radius and one soft shadow on every surface; cards inside cards | render |
| Coloured left/top stripe on a rounded card | `side-stripe` |
| Content left at `opacity: 0` until an observer fires | render |
| Cross-page drift: pages of one product with different fonts, palette or radius | judge (compare side by side) |

## Copy

| Tell | Det |
|---|---|
| Benefit-speak: supercharge, unlock the power, elevate, empower, seamless, streamline, leverage, cutting-edge, world-class, all-in-one, effortless | `buzzword` |
| "Not just X, it's Y"; "Not a feature. A platform."; aphorism closing every section | `not-just` |
| Tricolon slogans ("Faster. Smarter. Better.") | `tricolon` |
| "Get started", "Learn more", "Submit" as labels | `generic-cta` |
| Placeholder identities: Acme, John Doe, lorem ipsum, pravatar, DiceBear | `placeholder-identity` |
| Em-dash saturation | `em-dash-density` |
| "Welcome back, Alex 👋" | `welcome-greeting` |

## Generated dashboards (Operate)

| Tell | Instead |
|---|---|
| Dark navy or tinted sidebar with a coloured active pill and a left bar | Sidebar on the page ground; neutral pill |
| Four KPI cards, each with an icon in a tinted circle | One container split by hairlines, label over value |
| A green "+12.5%" pill and a sparkline on every KPI | Deltas in words with their window, grey for zero; the trend in its own chart |
| KPI figures at 36–48px bold in the brand colour | 24–30px at 400–600 in ink |
| Gradient area chart, smoothed spline, a dot on every point; a hue per bar | 2px straight line, no fill, no markers; one hue per chart |
| Zebra table, uppercase tracked headers, checkbox, avatar, chip and kebab on every row | 12px grey sentence-case headers, rules, one status mark, one action where needed |
| Left-aligned proportional digits | Right-aligned tabular figures, units in grey |
| The accent on every button, tab and link | The accent on data, selection and at most one control |
| An illustration and "No data yet" in an empty chart | The zero line, and one sentence |

## Not over-flagged

- Glassmorphism, bento and aurora backgrounds rank low among the tells people actually
  complain about (3.2M-post Reddit study). Flag them only as reflexes.
- Inter, Geist and the system stack are acceptable on Operate surfaces when tuned
  (scale, weights, tabular figures). slop-lint skips `overused-font` in operate mode.
- One gradient tied to the brand, within one hue, is not slop.
- Judge combinations: one accented headline word on an otherwise authored page is a nit;
  five distinct tells together is a template.
