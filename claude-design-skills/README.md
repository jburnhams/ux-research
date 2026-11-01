# Claude's design skills

- **Type**: Agent skills shipped by Anthropic: `artifact-design` (served to Claude Code
  sessions with the Artifact tool), the Claude Design canvas skill (`design`), and
  the `dataviz` skill with its palette validator
- **Licence**: Anthropic proprietary. **No skill text is stored here.** This folder is
  analysis with short quotes. Full captures, with provenance, live in the sibling
  collection: `jburnhams/prompts/leaked/claude-code/artifact-skills/` (extracted from the
  Claude Code binary on 2026-09-10: `design.md`, `artifact-design-v2.md`,
  `dataviz-palette.md` and others) and `prompts/leaked/claude-code/bundled-skills/artifact-design.md`.
- **Current text read**: `artifact-design` as loaded in this session on 2026-11-01.
  Its body matches `artifact-design-v2.md` in substance, with light rewording.

The Apache-licensed sibling, `frontend-design`, is stored in full in
[`../anthropic-frontend-design/`](../anthropic-frontend-design).

## `artifact-design`: the one to copy structurally

What it does that the open-source anti-slop skills mostly don't:

1. **Treatment before design.** "Decide the treatment; designing is a given."
   Utilitarian ("a plan, a memo, a demo. Make it polished … but avoid
   over-designing. Most pages don't need a flashy, gigantic hero") against editorial
   ("a landing page, a game, an app or tool they'll keep or share"). "If unsure: a
   well-composed page is always acceptable; an over-designed visual identity
   sometimes isn't." The anti-generic plan review runs *only* for editorial work.
2. **Precedence spelled out.** "The user's own words, then the project's existing
   system, then your choices." Look for CLAUDE.md, a tokens or theme file, and
   existing component styles first.
3. **One subject-only detail, even on a plain page.** "Include at least one detail
   only this subject would have (its real units and scales, its document
   conventions, its terms of art) as content rather than ornament; it costs nothing
   even on a plain page."
4. **"Choose neutrals deliberately."** "A pure mid-grey looks unconsidered; a grey
   with a slight hue bias toward the page's accent looks intentional."
5. **Card styling by role.** "Border, fill, radius, and shadow each mark an element
   as a separate object. Apply them by role … applying the same radius and shadow
   to every block flattens the hierarchy."
6. **"Make the page complete at rest."** Nothing meant to be read waits for an
   observer; "a tool or app opens in a realistic working state … an empty shell
   waiting for input shows nothing."
7. **UI pages shift craft to information design.** "Put the summary before the
   detail. Encode state in form as well as in numbers … Semantic color (good /
   warning / critical) is separate from the accent hue and doesn't count as your
   accent."
8. **Copy rules aimed at model tics.** "Avoid mannered devices: asides set off by
   em-dashes, 'not X, but Y' framing, colon-then-reveal sentences, scare quotes
   around invented labels, and stock phrases."
9. **Bounded verification.** One optional rendered look (desktop and phone, light and
   dark, with a mechanical list of overflow, theme leaks, blocked loads and console
   errors), one pass of edits, publish. "None of this becomes a loop."

Its tell list: "warm cream (#F4F1EA) with a serif display and terracotta accent;
near-black with a lone acid-green or vermilion pop; broadsheet hairline rules with
dense columns; a purple-to-blue gradient hero on white; Inter or Space Grotesk as the
'safe' face; emoji as section markers; everything centered; `rounded-lg` everywhere;
accent bar/rail on rounded cards." The last item is new relative to `frontend-design`
and matches Impeccable's `side-tab` and `border-accent-on-rounded` rules.

## Claude Design canvas skill (`design`)

Relevant for mood-to-theme work ([`../ux-mood-to-theme.md`](../ux-mood-to-theme.md)):

- **"Settle the aesthetic with the user, not for them."** "Ask, or sketch 2–4
  genuinely different low-fi direction artboards and let them pick … Do NOT just
  pick your own aesthetic without the user's input … this is how you get slop!"
- **When you cannot ask**: commit to one direction from whatever signal exists, build
  the deliverable, state the assumption, and put one or two low-fi alternates
  *beside* it, "never instead of it".
- **Options must differ on a nameable axis** ("Warm editorial" against "Dense
  data-first"); "five shades of one aesthetic is no choice at all"; give each option
  "an honest motivation and its main tradeoff — a set where only your favorite gets a
  case made for it is a rigged vote."
- **Colour mechanics in OKLCH**: "subtly-toned whites and blacks; avoid saturations
  above 0.02 for whites"; "0–2 accent colors using oklch. All accents should share the
  same chroma and lightness; vary hue."
- Still carries cookbook-era advice ("atmosphere and depth over flat fills: gradient
  meshes, noise, patterns, layered transparencies, shadows, grain") that its sibling
  `artifact-design` now treats as a tell. See [`../ux-generator-prompts.md`](../ux-generator-prompts.md) §3.

## `dataviz`

A deterministic palette validator (`validate_palette.py` and `.js`): OKLCH
lightness band, chroma floor 0.10, CVD separation under Machado 2009 (ΔE×100 ≥ 8
target, 6 floor), a normal-vision floor of 15, and contrast ≥ 3:1 against the
surface. It separates FAIL from WARN, and states what it cannot check. It is
analysed in `prompts/agent-generative-output.md` §11 and used as the model for the
palette checks in [`../ux-colour-science.md`](../ux-colour-science.md) §5 and
[`../ux-design/`](../ux-design).
