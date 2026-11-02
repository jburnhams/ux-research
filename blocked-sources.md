# Sources not reached, and what happened when they were retried

The first pass (2026-11-01) could not read these. On **2026-11-02** every one was
retried: the session's network allowed almost all of them, and JavaScript-only sites
were rendered in a headless browser. Each row says what was found and where it went.
What is **still** unreached is collected first.

## Still unreached or unverified (as of 2026-11-02)

| Source | Why | What we have instead | To check |
|---|---|---|---|
| Adam Wathan's post on X about `bg-indigo-500` (https://x.com/adamwathan/status/1953510802159219096, 2025-08-07) | X returns HTTP 402 without a login | Two secondary accounts agree on the gist ([`web-articles/`](./web-articles)) | The exact wording |
| x.com/MyWestLord/article/2068064010600108267 ("45 Claude Design Skills That Kill AI Slop") | X requires a login | Bitdoze's 11-skill comparison covers similar ground ([`web-articles/`](./web-articles)) | Whether it names skills not in Bitdoze's list |
| The Stitch app (stitch.withgoogle.com) and its docs | Sign-in-only JavaScript app; `labs.google.com/stitch` is now a 404 | The official launch post (March 18, 2026) and the Stitch skills repo | How URL-to-design-system extraction and DESIGN.md import behave in practice |
| Valdez and Mehrabian (1994) full text; Palmer and Schloss (2010) full text | Paywalled (APA PsycNet, PNAS returned 403) | Both **abstracts** via Europe PMC, which confirm the claims as used ([`ux-colour-science.md`](./ux-colour-science.md) §6) | Effect sizes and samples if a generator ever depends on them |
| Colour vision deficiency prevalence (about 8% of men, 0.5% of women, Northern European ancestry) | Not retried; common reference figure | — | Any ophthalmology reference |
| Legal standing of WCAG 2 (ADA, EN 301 549, EU Accessibility Act) | Jurisdiction-specific | — | Treat as indicative |
| M3 guidance on reduced motion for springs and shape morph | The first pass had it from search snippets; none of the motion, shape or accessibility pages read on 2026-11-02 says it | Material's web curves and `prefers-reduced-motion` | Material's accessibility motion pages, if they exist |
| Evil Martians Harmonizer and APCA reference code | Reachable, but no licence file (Harmonizer) and All Rights Reserved (APCA) | Harmonizer's app and README read; "APCA in a Nutshell" read | Nothing stored, by licence, not by access |
| Huemint, Khroma, Coolors | Closed products | — | Not inspected |
| `pbakaus/impeccable-site`, `~/code/impeccable-evals` | Private | Numbers quoted from Impeccable's public CLAUDE.md | — |

Section C of the first pass (actions denied in the session) still stands for running
Impeccable's downloaded detector against `ux-design/fixtures/`; that needs the
owner's go-ahead. `api.github.com` now answers (HTTP 200).

## Resolved on 2026-11-02

### A. Hosts that were blocked by the allowlist

| URL | Result | Where it went |
|---|---|---|
| https://www.boardui.com/ | **BoardUI**: a React + Tailwind v4 design system for dashboards and agent UIs, with an MCP server and rules for coding agents; free tier MIT | [`boardui/`](./boardui) (its `AGENTS.md` stored); cited in [`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §3g |
| https://notboring.dev/ | **notboring**: components sold as prompts for agents, by a French UI designer. **Not** Not Boring Software, as the first pass guessed. Licence forbids redistributing the prompts | [`notboring/`](./notboring) (analysis only); its "build every state" rule added to [`ux-product-ui.md`](./ux-product-ui.md) §5 |
| https://m3.material.io/ (motion, shape, the launch and I/O 2026 posts) and the Expressive research on design.google | Read (rendered). Corrections: there are **two motion schemes** and the stored tokens were Standard; Expressive (Material's default) uses spatial damping 0.6–0.8. The "4×" claim is real and is eye-tracked time to find key elements. I/O 2026 (May 19) added the Expressive layout system and made Material Android Compose-first | [`ux-material-3.md`](./ux-material-3.md) rewritten in §1; Compose motion tokens stored in [`material-3/compose-motion/`](./material-3/compose-motion) |
| https://adriankrebs.ch/blog/design-slop/ | Read, plus the **MIT repo with results and 190 human labels**. The percentages used across this collection were from the study's first, 500-site version; current figures differ | [`design-slop-cop/`](./design-slop-cop) (patterns, our prevalence count); [`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §1, §3 and §6; [`avoid-ai-design/README.md`](./avoid-ai-design/README.md) |

### B. Sources not attempted in the first pass

| Source | Result | Where it went |
|---|---|---|
| Radix Colors "Understanding the scale" | **Verified.** The 12 step jobs match what was written from memory, with finer detail (7 includes focus rings; 11 and 12 guarantee APCA Lc 60 and 90 on step 2; which step-9 colours take dark text) | [`ux-colour-science.md`](./ux-colour-science.md) §3 |
| HN discussion of the Krebs study (235 comments) | Read in full | [`design-slop-cop/README.md`](./design-slop-cop/README.md) |
| GIGAZINE write-up | Read; it carries the first version's per-pattern figures | [`design-slop-cop/README.md`](./design-slop-cop/README.md) |
| Sailop, "AI Slop in 2026" | Read. Adds HTTP Archive figures on `indigo-500` and Inter, and withdrew its own earlier 47-site study | [`web-articles/`](./web-articles) |
| Superdesign and OverlayQA on design-system drift | Read; four drift mechanisms and a one-prompt drift experiment | [`web-articles/`](./web-articles); [`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §3g |
| DEV (Alan West) on indigo-500 | Read; no primary link. prg.sh supplied the Wathan post's URL | [`web-articles/`](./web-articles) |
| impeccable.style/slop and /docs | Read; the public catalogue lags the rule registry; detector exit codes and DESIGN.md checks documented | [`web-articles/`](./web-articles) |
| Kosta Canatselis, "Spot the Slop" | Read; adds missing states and no progressive disclosure | [`web-articles/`](./web-articles); [`ux-product-ui.md`](./ux-product-ui.md) §5 |
| prg.sh, purple-gradient essay | Read | [`web-articles/`](./web-articles) |
| 925 Studios, Fountain Institute, Noqta tell lists | Read; Fountain adds multicoloured side tabs and status dots everywhere; 925 is sales copy | [`web-articles/`](./web-articles); [`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §3d |
| `pixelslop` pattern catalogue | Read, with its Apache-2.0 repo | [`pixelslop/`](./pixelslop) (SKILL, catalogue, scoring rubric); [`ux-anti-slop-skills.md`](./ux-anti-slop-skills.md) |
| Stitch "vibe design" | Official post found and read: March 18, 2026, confirmed | [`web-articles/`](./web-articles) |
| oklch.com | Read: Evil Martians' OKLCH picker with P3/Rec2020 gamut display and sRGB fallback | Nothing new to store |
| Harmonizer | App read; no licence, nothing stored | — |
| "APCA in a Nutshell" | Read; Lc levels now carry their font-size and weight pairs | [`ux-colour-science.md`](./ux-colour-science.md) §2 |
| Bitdoze skills comparison | Read; six skills not yet in this collection | [`web-articles/`](./web-articles); README candidates |

### E. Claims that were cited from memory

| Claim | Result |
|---|---|
| Palmer and Schloss (2010) | **Confirmed** from the abstract (PNAS 107(19):8877–8882). The abstract's disliked example is browns; the dark yellow-green band is Material's operationalisation. Text adjusted |
| Valdez and Mehrabian (1994) | **Confirmed** from the abstract, with coefficients (Pleasure = .69B + .22S; Arousal = −.31B + .60S). Text now gives them |
| Ottosson 2020 Oklab | **Confirmed** (post dated Dec 23, 2020; matrices revised Jan 2021; code public domain or MIT) |
