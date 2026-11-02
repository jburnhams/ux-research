# Web articles on AI slop, drift and design skills

Articles and pages the first pass could only see as search snippets, read in full on
2026-11-02. They are copyrighted prose, so **no text is stored**; this file records
what each says, with short quotes, and how much weight it can bear. Evidence grades:
**A** primary data or method, **B** a practitioner's considered argument,
**C** a list with little support, **D** sales copy.

The Krebs study, its repo and the HN thread have their own folder:
[`../design-slop-cop/`](../design-slop-cop). Material's pages are analysed in
[`../ux-material-3.md`](../ux-material-3.md).

## Origin of "AI purple"

| Source | Grade | What it adds |
|---|---|---|
| **Adam Wathan on X**, 2025-08-07 (https://x.com/adamwathan/status/1953510802159219096; date decoded from the post id) | primary, **not read** | The post itself returns HTTP 402 to unauthenticated readers. Two secondary sources (below) agree it was a "semi-apologetic" acknowledgement of making Tailwind UI's buttons `bg-indigo-500`, with over a million views. The exact wording remains unverified |
| prg.sh, "Why Your AI Keeps Building the Same Purple Gradient Website" (Oct 26, 2025; probably Pragnesh Gajjar) | B | The clearest version of the causal story: indigo was Tailwind UI's demo colour, copied into thousands of tutorials, so an unconstrained prompt returns "the median of every Tailwind CSS tutorial. And that median is purple." "LLMs don't have taste … correlation isn't taste. The model can execute. You have to direct." Links the Wathan post. Fixes follow the Anthropic cookbook |
| Alan West, DEV, "Why Every AI-Built Website Looks the Same (Blame Tailwind's Indigo-500)" (March 25, likely 2026) | C | Same story, no data, no link to the post |
| Sailop, "AI Slop in 2026" (April 28, updated October 18, 2026) | B for the figures, C for the rest | **Measured corrective**: from the HTTP Archive Web Almanac 2025, `indigo-500` rose from 0.03% of pages (2022) to 0.54% (late 2025), and Sailop attributes much of that to Tailwind's growth, "not AI choosing purple". Inter is on about 1.4–1.5% of pages; W3Techs puts Tailwind on 0.3% of sites. Notably, the authors **withdrew** an earlier "nine-month teardown of 47 sites" because they had no record of doing it |

**Net**: the Tailwind-demo origin is plausible and widely repeated, and the rise of
indigo on the web is real, but it is small in absolute terms (about half a percent
of pages) and tracks Tailwind's adoption. Krebs's current data puts filled purple
CTAs at about 5% of Show HN sites. Purple is the most *recognised* tell, not the
most *common* one.

## Named concepts worth keeping

| Concept | Source | Definition |
|---|---|---|
| **Silhouette (lookalike) test** | Sailop | Reduce the homepage to a black-on-white wireframe next to five competitors; if you can't tell them apart, it is structurally slop. Already used by avoid-ai-design |
| **Section waterfall** | Sailop | A run of near-identical, heavily padded sections |
| **Generator versus driver** | Sailop | Generators (v0, Bolt, Lovable) emit a visual signature of their own; drivers (Claude Code, Cursor, Aider, Codex) don't, so their output looks like whatever stack they were pointed at |
| **Default acceptance** | Sailop | The root cause: shipping the first plausible output unchanged |
| **Design-system drift** | Superdesign (Jason Zhou, June 22, 2026); OverlayQA (May 5, 2026) | "Slop is convergence on the generic average, while drift is divergence from your specific system. A page can avoid slop and still drift." |
| **Design with no author** | Kosta Canatselis (July 23, 2026) | Slop is "a diagnosis, not an insult": competent output that reflects the statistical average rather than a choice |

## Drift

- **Superdesign** (B, with a product pitch): four failure modes. *Token fabrication*
  (plausible names like `--color-primary-500` when the system says
  `--brand-action-bg`); *within-session drift* (the same component gets different
  padding later in one session); *between-session amnesia*; *silent breaking changes*
  (the model keeps emitting a component's v1 props). Fixes: freeze tokens in one file
  the agent reads but never regenerates (DESIGN.md, with "use ONLY the tokens above"
  and "stop and ask"); assemble real components; lock stable regions (layout,
  header, sidebar) and edit only the content area; lint for raw hex and off-system
  elements, then render, screenshot and compare. "A DESIGN.md is necessary but not
  sufficient."
- **OverlayQA** (A for its one experiment, D for the conclusion): asked Figma Make to
  build a design system, then a dashboard with it. The dashboard broke its own system
  in one prompt: placeholder stats reused, a purple-to-pink gradient and four new
  chart colours invented, numerals in Bold instead of the system's Medium, and one
  "completed" badge with four violations (system font, a chart token as a status
  colour, hardcoded white, 2px padding off a 4px scale). AI drift "happens in a single
  session, between two consecutive prompts, by the same tool." "A design system is
  only as good as its enforcement."

Both support what [`../ux-design/`](../ux-design) already does (DESIGN.md as the token
contract, `slop-lint` for arbitrary values) and add one rule worth having: **an agent
must never invent a token name**; if a token is missing it asks or adds it to the
contract first. [`../boardui/`](../boardui) and [`../notboring/`](../notboring) show
the same rule written for agents.

## Tell lists

| Source | Grade | Tells not already common in this collection |
|---|---|---|
| Kosta Canatselis, HEY World, "Spot the Slop" (July 23, 2026) | B | **Missing states** (happy path only), **everything visible at once** (no progressive disclosure), absent *or* identical motion. Fix is a human pause between generating and shipping, and three closing questions: "Does this feel like it came from somewhere? Does it have a voice? Would I notice if it disappeared?" |
| Jeff Humble, The Fountain Institute, "7 Tells that a UI is AI-Generated" (about April 2026) | C | **Multicoloured side tabs**, a different accent stripe per card ("quickly becoming the em-dash of AI-generated UI"); **status dots on everything**, diluting a signal that once meant live or connected; neon palettes with no single dominant colour; aurora glows that make the screen look "broken, dirty". Tongue in cheek |
| Noqta, "Escaping AI Slop" (June 4, 2026; bylined "AI Bot") | C | Excessive letter-spacing on uppercase labels; generic "Live"/"New" badges with pulsing dots. Cites Wes Bos's "four horsemen" post. No data |
| 925 Studios, "AI Slop Web Design" (March 19, 2026) | D | Agency sales piece; its statistics (e.g. "over 40% of AI-generated code contains security or design flaws") are unrelated or unsourced. Nothing new |
| Bitdoze, "Best AI Skills for Web Design" (Dragos, August 28, 2026) | C | A ranked list of 11 skills by stars and installs (snapshot August 2026). Six are not yet in this collection: **emil-design-eng** (`emilkowalski/skills`, motion: an easing decision chart and duration tables), **web-design-engineer** (`ConardLi/garden-skills`, 25 recipes anchored to named products), **ui-ux-pro-max** (`nextlevelbuilder/ui-ux-pro-max-skill`, 161 contrast-checked palettes, 57 pairings), **better-\*** (`jakubkrehel/skills`, review-first), **designer-skills** (`Owl-Listener/designer-skills`), **tastemaker** (`codeswithroh/tastemaker`, WCAG matrix and a persistent style lock). Its advice: "one primary + one motion skill (if needed) + one auditor", because overlapping skills fight. Candidates for the next pass |

## Product pages

- **Impeccable's public slop page** (impeccable.style/slop): a three-era timeline
  (2022 purple and glass, 2025 beige editorial, 2026 neobrutalist), 11 annotated
  example pages with the detector overlaid, and a 68-entry catalogue tagged by type
  (AI slop, Quality, Your design system) and detection (source, browser, design
  review). The categories add to 67 and seven entries are marked design-review where
  the header says six, so the page lags the rule registry; use
  [`../impeccable/antipatterns.tsv`](../impeccable/antipatterns.tsv) (62 rules) as the
  source of truth. The docs add that `npx impeccable detect` exits 0 (clean), 2
  (findings) or 1 (a target could not be scanned), that advisories never fail a scan,
  and that a local DESIGN.md turns on design-system checks for fonts, colours, radii
  and type sizes. Comp-led (mockup first) gives "bolder visual directions"; code-led
  "a more coherent first build, with less ambitious visuals", which matches the eval
  numbers already quoted from its CLAUDE.md.
- **Google Stitch**, "Introducing 'vibe design' with Stitch" (Rustin Banks, Google
  Labs blog, **March 18, 2026**, confirming the date the first pass had from search):
  an infinite canvas; a design agent that reasons over the project's history with an
  agent manager for parallel ideas; **design systems extracted from any URL** and
  moved in and out as DESIGN.md; clickable prototypes that generate likely next
  screens; voice critique; an MCP server, SDK and skills. "Vibe design" means starting
  from the business goal, the feeling, or inspiring examples instead of a wireframe.
  The Stitch app itself is a sign-in-only JavaScript app and was not inspected.
