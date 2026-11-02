# Sources not reached in the first pass (2026-11-01)

Everything this pass tried to read and couldn't, or relied on second-hand. Each entry
says why, what was used instead, and what to check. Tick items off and add findings
under each, or move them into the relevant doc.

## A. Hosts blocked by the session's network allowlist

The cloud environment resolves only allowed domains. To let a later session read
these, add them under **Network access → Allowed domains** in the environment settings
(https://code.claude.com/docs/en/cloud-environments#network-access), or investigate
by hand.

| URL | Why it matters | Used instead | To check |
|---|---|---|---|
| https://www.boardui.com/ | You suggested it | Web search found nothing for the domain (results were unrelated "Board" products) | What it is; its stance on AI-generated UI; any principles, components or tooling worth a source folder |
| https://notboring.dev/ | You suggested it | Web search found nothing for the domain. Closest match: **Not Boring Software** (`notboring.software`), Apple Design Award-winning Weather, Habits, Timer and Calculator apps "built like a game" with 3D skinnable interfaces. Possibly related, unconfirmed | Whether notboring.dev is that studio; whether it publishes design principles or tooling |
| https://m3.material.io/ (incl. `/blog/m3-expressive-motion-theming`, the Expressive research write-up, component guidance) | Current Material guidance prose, research claims, motion theming rationale | Token SCSS from `material-components/material-web` and source from `material-color-utilities` on GitHub ([`material-3/`](./material-3)); search-result snippets for dates | Official dates (I/O 2026 notice reportedly May 19, 2026); the Expressive research methodology and claims; shape-morph guidance; reduced-motion guidance for springs; the 35-shape library |
| https://adriankrebs.ch/blog/design-slop/ | Primary source of the ~1,400-site Show HN study (16 heuristics), whose percentages are quoted throughout | Second-hand via [`avoid-ai-design/ai-tells-catalog.md`](./avoid-ai-design/ai-tells-catalog.md) | The heuristic definitions, per-pattern percentages, false-positive estimate, date |

## B. Not attempted after the allowlist failures (likely blocked, or closed)

Per the session's guidance, no further arbitrary hosts were tried once several failed.

| Source | Why it matters | Status |
|---|---|---|
| https://radix-ui.com/colors/docs (scale "Understanding the scale") | The 12-step functional semantics are stated **from memory** in [`ux-colour-science.md`](./ux-colour-science.md) §3 (1–2 backgrounds, 3–5 component backgrounds, 6–8 borders, 9–10 solids, 11–12 text) | Repo cloned (MIT) but its README defers to the docs site. **Verify** |
| https://news.ycombinator.com/item?id=47864393 | 235-comment discussion of the Krebs study (pushback: "it's just Tailwind", "designers did this before AI") | Second-hand via avoid-ai-design |
| https://gigazine.net/gsc_news/en/20260423-design-slop/ | Write-up of the Krebs study (dates it to about April 2026) | Not read |
| https://www.sailop.com/blog/ai-slop-2026-state-of-the-ai-generated-web | "Section waterfall", silhouette test, "blue-600 → purple-500" fingerprint | Second-hand via avoid-ai-design |
| https://superdesign.dev/blog/ai-design-system-drift, https://overlayqa.com/blog/ai-design-system-drift/ | The "design system drift" framing | Second-hand via avoid-ai-design |
| https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p and Adam Wathan's 2025 acknowledgement of `bg-indigo-500` | The origin story of "AI purple" | Second-hand; **find Wathan's primary post** |
| https://impeccable.style/slop, https://impeccable.style/docs/* | Impeccable's public slop gallery and docs | Repo read instead |
| https://world.hey.com/kostac/spot-the-slop-a-ui-designer-s-guide-to-fixing-ai-defaults-4c448c9c | A UI designer's tell guide | Search snippet only |
| https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website | Causal essay | Search snippet only |
| https://www.925studios.co/blog/ai-slop-web-design-guide, https://pages.thefountaininstitute.com/posts/7-tells-that-a-ui-is-ai-generated, https://noqta.tn/en/blog/ai-design-slop-overused-ui-patterns-fix-2026 | Agency tell lists | Search snippets only; low evidential weight |
| https://cdn.jsdelivr.net/npm/pixelslop@0.3.8/dist/skill/resources/ai-slop-patterns.md | Another skill's pattern catalogue (`pixelslop`) | Not read. jsDelivr may be reachable; **worth a source folder** |
| https://labs.google.com/stitch, Stitch official docs and release notes | "Vibe design" (reportedly March 18, 2026 update) and DESIGN.md import | Only `google-labs-code/stitch-skills` and `design.md` repos read |
| Huemint, Khroma, Coolors | ML or generative palette tools from mood input | Closed products; not inspected |
| https://oklch.com, https://harmonizer.evilmartians.com | Evil Martians' OKLCH picker and APCA palette tool | Harmonizer README read; the repo has **no licence file**, so nothing copied |
| https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell | APCA levels and usage | README read; the reference code is All Rights Reserved, so nothing copied |
| x.com/MyWestLord/article/2068064010600108267 ("45 Claude Design Skills That Kill AI Slop") | A roundup of design skills | Not read (X) |
| https://www.bitdoze.com/best-ai-skills-for-web-design/ | Skills comparison | Not read |

## C. Actions denied in the session

| Action | Why it was denied | Workaround |
|---|---|---|
| `npx impeccable detect --list-rules` (running Impeccable's downloaded engine) | Auto-mode classifier: executing code from an external package | Parsed the rule registry from `crates/foundation/src/registry.rs` with our own script ([`impeccable/antipatterns.tsv`](./impeccable/antipatterns.tsv)). **Running the detector against the fixtures in `ux-design/fixtures/` would be a useful comparison**, if you're happy to allow it |
| A Python one-liner run inside the cloned taste-skill folder | Same classifier: interpreter run in a downloaded directory | Read the files with the Read tool instead; `evals/evals.json` was **not** inspected |
| `api.github.com` | Proxy returns 403 | Used `git clone` (sparse, blobless) for every repo |

## D. Private or unpublished

| Source | Note |
|---|---|
| `pbakaus/impeccable-site`, `~/code/impeccable-evals` | Impeccable's direction catalogue ("the paid-service moat") and eval framework; their numbers are quoted from the public repo's CLAUDE.md only |
| taste-skill `library/*.json` (1.8 MB) | Public, available in the clone, not stored; could be analysed for hue and type distribution the way [`ux-mood-to-theme.md`](./ux-mood-to-theme.md) §3 analyses Impeccable's seeds |

## E. Cited from memory: please verify

| Claim | Where | Primary source to check |
|---|---|---|
| Palmer and Schloss (2010, PNAS), ecological valence theory: blues liked, dark yellow-green disliked | [`ux-colour-science.md`](./ux-colour-science.md) §6 | "An ecological valence theory of human color preference", PNAS 107(19). Material's `dislike_analyzer.ts` cites it, which corroborates the gist |
| Valdez and Mehrabian (1994): brightness tracks pleasure, saturation tracks arousal | same | "Effects of color on emotions", J. Exp. Psych.: General 123(4) |
| Colour vision deficiency prevalence (about 8% of men, 0.5% of women, Northern European ancestry) | same §5 | Any ophthalmology reference |
| Ottosson 2020 OKLab | same §1 | bottosson.github.io/posts/oklab (likely blocked) |
| Legal standing of WCAG 2 (ADA, EN 301 549, EU Accessibility Act) | same §2 | Jurisdiction-specific; treat as indicative |
