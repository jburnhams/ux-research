# How generators prompt for design, and how the prompts cause the look

The app builders (Lovable, v0, Same.dev, Emergent, Orchids, Google AI Studio),
the coding agents (Codex, Amp) and Anthropic's own surfaces (cookbook,
`frontend-design`, `artifact-design`, the Claude Design canvas skill) each carry
a design section in their system prompt. Read side by side, they show that
**a lot of AI slop is prompted, not emergent**, and that each vendor's fix was a
reaction to the previous generation's output.

Verbatim excerpts with line ranges: [`generator-prompts/design-sections.md`](./generator-prompts/design-sections.md).
Claude's skills: [`claude-design-skills/`](./claude-design-skills).

## 1. Stage by stage

| Stage | Lovable | v0 | Same.dev | Emergent | Orchids | AI Studio | Codex / Amp | Anthropic `artifact-design` (current) |
|---|---|---|---|---|---|---|---|---|
| **Direction before code** | "write what it evokes and what existing beautiful designs you can draw inspiration from"; list "colors, gradients, animations, fonts" | `GenerateDesignInspiration` **tool call** produces a brief, then "If you generate a design brief, you MUST follow it" | Clone flow only: "analyze the design, communicate a plan" | None | Uses a supplied `design_system_reference` | None | None | Read the request: *utilitarian* or *editorial* treatment; token plan written into `:root`; editorial plans reviewed for genericness |
| **Token discipline** | "CRITICAL: The design system is everything"; HSL only; semantic tokens; "never … text-white, bg-white" | 3–5 colours total; max 2 font families; semantic tokens; no direct colours | Customise every shadcn component file | None | Tailwind v4 `@theme`, `var(--color-*)` | Tailwind CDN only, no CSS files | "define CSS variables" | Every colour a token, light and dark both designed |
| **Colour rules** | "leverage colors and animations"; `--gradient-primary`, `--primary-glow` | "Avoid gradients entirely unless explicitly asked"; analogous stops only | "Avoid using purple, indigo, or blue" | "DO NOT use default dark purple-blue or dark purple-pink"; 80/20 gradient rule; "Never … typical basic red blue green" | — | "sufficient color contrast" | "avoid purple-on-white defaults. No purple bias or dark mode bias" | Neutrals with a hue bias; names the four current clusters |
| **Type rules** | — | ≤2 families; body ≥14px; example code loads **Geist** and Inter | — | "Do not use system-UI font" | Google Fonts `@import` first | — | "avoid default stacks (Inter, Roboto, Arial, system)" | Pair a display and body face; about 65ch; one scale |
| **Motion** | "ambitious styles and animations" | — | — | "60fps"; glassmorphism, neumorphism, 3D transforms encouraged | — | — | "page-load, staggered reveals" | "One orchestrated moment"; "extra animation adds to the impression that the design is AI-generated" |
| **Backgrounds** | gradients via tokens | "NEVER generate … gradient circles, blurry squares, or decorative blobs" | — | "Depth through layers … glass morphism" | — | — | "Don't rely on flat, single-color backgrounds; use gradients, shapes, or subtle patterns" | Not encouraged |
| **Icons and emoji** | — | "NEVER use emojis as icons"; 16/20/24px | "NEVER use emojis" | — | — | — | — | "emoji as section markers" listed as a tell |
| **Review step** | — | — | Reflect on deploy screenshots | "Act as a quick design reviewer" for padding, contrast, shadcn usage | — | — | — | One optional preview look at desktop and phone, light and dark, then publish |
| **Motivation language** | "make sure to wow them … Otherwise you'll feel bad"; "Already beautiful!" | "Ship something interesting rather than boring, but never ugly" | "Take pride in the originality" | "give an 'aha' moment" | — | "world-class senior frontend React engineer" | "intentional, bold, and a bit surprising" | "design lead at a small, versatile studio" |

## 2. Prompted slop: the clearest cases

- **Lovable writes the wave-1 look into its own example tokens.** Its "✅ CORRECT"
  sample defines `--gradient-primary: linear-gradient(135deg, hsl(var(--primary)),
  hsl(var(--primary-glow)))` and a primary-tinted shadow, then says "Beautiful
  designs are your top priority … leverage colors and animations." That is the
  135° gradient and the coloured glow (§3a of the taxonomy), shipped as the model
  answer. "Never implement a feature to switch between light and dark mode" is a
  second, quieter default. **Lesson: a prompt's code example is the strongest
  instruction in it.** Whatever the example uses becomes the median.
- **v0 tells the model what to avoid, then its own transcript reaches for it.** The
  worked example after `GenerateDesignInspiration` reads: "I will use a bento grid
  and other components provided in my examples." The brief tool was meant to
  break the median, and the transcript shows the model routing the brief straight
  back to the example library.
- **Emergent's palette rule targets the colour, not the reflex.** "Diversify your
  color palette beyond purple/blue and purple/pink" moves the median by one step
  (avoid-ai-design SD8: emerald becomes "the purple-escape accent"), while "Use
  2–3x more spacing than feels comfortable" and "Think glass morphism, neumorphism,
  and 3D transforms" create new defaults.
- **Same.dev bans whole hue families** ("Avoid using purple, indigo, or blue colors
  unless specified"). Blue is the most-liked hue in colour-preference research
  (see [`ux-colour-science.md`](./ux-colour-science.md) §6) and a reasonable
  choice for many products. Banning a hue fixes nothing. Banning the
  *unchosen* hue is the fix.

## 3. Anthropic's four generations

Anthropic is the only vendor with four public, dated iterations, which makes it
the best record of how anti-slop advice ages:

| Generation | Source | Says about gradients | Motion | Fonts | Named tells |
|---|---|---|---|---|---|
| 1. Cookbook (2025) | [`anthropic-cookbook-frontend-aesthetics/`](./anthropic-cookbook-frontend-aesthetics) | "Layer CSS gradients, use geometric patterns" | "staggered reveals" | Recommends Space Grotesk, Fraunces, JetBrains Mono, Playfair, Bricolage… | Inter, Roboto, purple-on-white |
| 1b. Claude Design canvas skill (shipped in Claude Code, captured 2026-09-10) | `prompts/leaked/claude-code/artifact-skills/design.md` | "gradient meshes, noise, patterns, layered transparencies, shadows, grain" | "one well-orchestrated reveal" | "not Arial/Inter" | "Tone: pick an extreme" |
| 2. `frontend-design` (Apache, current) | [`anthropic-frontend-design/`](./anthropic-frontend-design) | "gradient washes as decoration" is a tell | fade-and-slide-up "read as AI-generated" | "not the default families you would reach for" | Five clusters incl. its own #D97757 |
| 3. `artifact-design` (served in-session, November 2026) | [`claude-design-skills/`](./claude-design-skills) | — | "sometimes less is more, and extra animation adds to the impression that the design is AI-generated" | "Inter or Space Grotesk as the 'safe' face" is a tell | The clusters, plus "accent bar/rail on rounded cards" |

Three things changed between generations:

1. **From "add" to "decide".** Generation 1 tells the model what to add
   (gradients, patterns, reveals). Generations 2 and 3 tell it to ground choices in
   the subject and to spend boldness in one place.
2. **From a font menu to no menu.** The named fonts in generation 1 became tells.
   Generations 2 and 3 name only fonts *to avoid*.
3. **From one stance to two treatments.** `artifact-design` opens by classifying
   the request as utilitarian ("a plan, a memo, a demo … avoid over-designing")
   or editorial ("a landing page, a game, an app or tool they'll keep"), and
   applies the anti-generic review only to the editorial ones. This is the same
   axis as Impeccable's modes ([`ux-product-ui.md`](./ux-product-ui.md)) and the
   most useful structural idea in this collection.

The canvas skill is still on generation 1's advice (grain, mesh gradients) while
its sibling skill calls that look a tell, an inconsistency inside one product.

## 4. Codex: a block that was dropped

Codex's `## Frontend tasks` block ("avoid collapsing into 'AI slop' … Use
expressive, purposeful fonts … use gradients, shapes, or subtle patterns …
staggered reveals") appears verbatim in `gpt-5.1-codex-max` and `gpt-5.2-codex`
and in Amp's prompt, which copied it. It is **absent** from the later `gpt-5.6`
and `gpt-6-astra` instructions in `prompts/codex/`. Those prompts instead gained a
*writing* anti-slop list ("delve", "foster", "leverage", "This isn't about X. It's
about Y.") whose second half is the copy-tell list of §3f in the taxonomy. One
reading is that the visual block moved into skills or was judged to do more harm
than good; the prompts themselves don't say. Impeccable's `<codex>` block suggests
the GPT family still has its own visual fingerprint (ghost cards, grid
backgrounds, "theater" copy).

## 5. What a good design section of a prompt has

Synthesised from what worked and what backfired above:

1. **A classification step**: treatment or mode first. The rest is conditional
   on it.
2. **A direction artefact before code**: a token plan, a brief from a tool, or a
   DESIGN.md. It must be checked against the brief for genericness, not just
   written.
3. **Tokens as the only channel for colour, type, radius and shadow**, which v0,
   Lovable and Orchids all get right. It is what makes the direction enforceable
   and the output themeable.
4. **Examples that are not themselves defaults.** If the example code must name
   values, make them visibly placeholder roles ("fill these from the brief",
   avoid-ai-design's approach) rather than a gradient or Geist.
5. **A dated avoid-list with the "brief wins" override**, never a recommend-list.
6. **A review step with a narrower move set than the build step** (the canvas-design
   "refine, don't add" pattern from `prompts/agent-generative-output.md` §9) and a
   look at the render.
7. **No guilt motivation.** "Otherwise you'll feel bad" and "wow them" push toward
   more decoration, which is the wrong direction for every mode except Persuade.
