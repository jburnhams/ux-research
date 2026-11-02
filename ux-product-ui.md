# Product UI: apps, dashboards, forms, settings

Most React and Tailwind work is not a landing page. It is an app: a dashboard, a
table, a settings screen, an editor. The anti-slop literature was written mostly
for marketing pages, and applying it unchanged to apps produces a different failure:
**strangeness without purpose**. This doc collects what the sources say when the
surface is one people work in.

Primary sources: Impeccable [`operate.md`](./impeccable/reference/operate.md) and
[`mode-operate.md`](./impeccable/reference/mode-operate.md); taste-skill
[`app-screens.md`](./taste-skill/references/app-screens.md) (23-screen study);
artifact-design "When the page is a UI"; Vercel WIG; shadcn rules; Material 3
([`ux-material-3.md`](./ux-material-3.md)).

## 1. The mode switch

Impeccable's modes are the clearest framing:

> **Operate:** the visitor completes a task. App UI, dashboards, editors, admin,
> settings, tools. Scanability, consistency, native expectations, and the real
> usage scene outrank expression. Brand lives in precise details.

and the test that replaces the landing-page slop test:

> Familiarity is often a feature here. The test is whether a category-fluent user
> can trust the interface immediately or must pause at every subtly-off component.
> Product UI's failure mode isn't flatness, it's strangeness without purpose.

So on an Operate surface:

| Landing-page rule | On an app screen |
|---|---|
| Avoid Inter, Geist, the system stack | Allowed ("System fonts and familiar sans defaults"); one well-tuned family is often right |
| Fluid, dramatic type scale | Fixed rem scale, ratio 1.125–1.2; titles 18–32px, figures 16–40px (taste: "nothing at 48") |
| No hairlines, no small labels, no peer-card rows | Allowed with limits: 1px borders at about 1.1–1.3:1, small sentence-case labels at 4.5:1, 3–6 peer cards in a row |
| One orchestrated page-load moment | **No** page-load sequences; 150–250 ms transitions that convey state |
| Bold, committed palette | "Restrained is the floor"; the accent goes on data, the primary action and selection only |
| Distinctive navigation | Standard patterns: top bar plus side nav, breadcrumbs, tabs, command palette; "reinventing standard affordances for flavor" is banned |

The world (brand, subject) "lends four things and only these: type, palette,
density, and one signature move. It never supplies the layout, the navigation model,
or the controls" (Impeccable). Example signature moves: "service health drawn as a
transit map, a schedule set in a timetable's column rhythm."

## 2. Start from the screen's one question

taste-skill's app run starts not with a style but with a sentence:

> Every screen answers one question first: "Did today's sales come in?", "Which
> deploy broke?", "Who is waiting for a reply?"

It decides what is biggest, what comes first and what is cut. Then name **the one
finding** ("the 23:28 deploy doubled the error rate") and put it where it is read
first, next to the action it drives. Then list blocks as answers to the next
questions, and delete any block with no question. This removes the stock order
"KPI row, big chart, two small charts, table".

Three tested rules from the same study:
- Everything the brief names is on the first screen at 1440×900 (cap lists at 4–6
  rows with "View all").
- The most frequent job is one click away, with its control where the answer shows.
- Show the evidence beside the answer: an annotated spike beats a second chart.

artifact-design says the same more briefly: "Put the summary before the detail.
Encode state in form as well as in numbers … Semantic color (good / warning /
critical) is separate from the accent hue."

## 3. Tells of generated dashboards

From taste-skill §14, each set against what 23 real product screens do:

| Generated habit | Real screens |
|---|---|
| Dark navy or tinted sidebar with a coloured active pill and a left bar | Sidebar on the page ground; neutral grey pill. A left bar appears once in 23 |
| "Welcome back, Alex 👋" | A noun title at 24/600 |
| Four KPI cards, each with an icon in a tinted circle | One container split by hairlines, label over value; **no icons on any of the 23** |
| A green "+12.5%" pill on every KPI | Deltas on 9 of 20 screens, in words with their window; grey for zero |
| A sparkline on every KPI | **None on any of the 23**; the trend gets its own chart |
| KPI values at 36–48px, bold, brand colour | 24–30px at 400–600, in ink |
| Gradient area chart, smoothed spline, dot on every point | A 2px straight line, no fill on 7 of 10, no markers |
| Rainbow palette, a hue per bar | One hue per chart; at most four hues on a screen |
| Zebra table, uppercase tracked headers, checkbox, avatar, chip and kebab on every row | 12px grey sentence-case headers, rules, one status mark, one action where needed |
| Left-aligned proportional digits | Right-aligned tabular figures, fixed decimals, units in grey |
| Saturated status chips with white text | Pale tints with dark text of the same hue |
| The accent on every button, tab and link | No filled primary on 12 of 23; near-black where there is one |
| Search, bell and avatar top bar on every screen | No top bar on 9 of 23 |
| Placeholder people, round vanity totals | The product's own data at real size; totals summed from rows |
| An illustration and "No data yet" in an empty chart | The zero line drawn, and one sentence in the frame |

The closing line applies to every mode: "A screen with every tell removed and nothing
put in their place is a tidy template. What fills the space is the product."

## 4. Charts inside apps

Consolidated from taste-skill, anti-slop-design module 19, Claude `dataviz` and
artifact-design:

- One question, one series where possible; one hue per chart; neutrals for context.
- 3–5 faint gridlines, no y-axis line, no legend for a single series; ticks rounded
  above the maximum.
- Bar charts start at zero; values not only in hover tooltips.
- Thin ring donuts with the legend as a table, or a bar instead.
- Validate any categorical palette (CVD separation, contrast against the surface);
  see [`ux-colour-science.md`](./ux-colour-science.md) §5.
- "Draw charts to scale … make every label name a value the chart actually reaches"
  (artifact-design).

## 5. States: the polish gap

"Generated UI renders the happy path and skips the states a craftsperson would
build" (avoid-ai-design K7; Kosta Canatselis lists "missing states" among seven
designer-spotted tells, [`web-articles/`](./web-articles)). The required set, merged
from Impeccable, Vercel, shadcn and notboring:

| Component kind | States to design |
|---|---|
| Every interactive control | default, hover, focus-visible, active, disabled, loading, error (Impeccable: "Don't ship with half of these") |
| Data views | loading (skeleton that mirrors final layout; "not spinners in the middle of content"), empty (teaches the next action), zero (zero line, not an illustration), sparse, dense, error with recovery, very long content |
| Forms | inline errors next to fields, focus the first error on submit, submit enabled until the request starts, then spinner with the label kept; never block paste; `autocomplete`, `name`, `type` and `inputmode`; warn on unsaved changes |
| Destructive actions | confirm or undo window, never immediate |
| Async feedback | `aria-live="polite"` toasts; optimistic UI with rollback |
| Navigation state | URL reflects filters, tabs, pagination and expanded panels; back restores scroll |
| Object lifecycle | Every state the object can really be in, not the one the demo opens on: empty, one, full, refused, undone, pressed twice, interrupted halfway. notboring's component prompts make this the agent's job ("work out that list before you write, and build the whole of it"), and keep one object through its states (save → saving → saved is one pill whose label changes) rather than swapping it for a spinner ([`notboring/`](./notboring)) |

## 6. Copy in product UI

Converged across frontend-design, artifact-design, Vercel and Impeccable `clarify`:

- Name things by what users recognise ("notifications", not "webhook config").
- A control says exactly what happens ("Save changes", "Save API Key"), and the
  same verb carries through ("Publish" then "Published").
- Errors say what happened and how to fix it; they don't apologise and are never
  vague.
- Empty screens are invitations to act.
- `…` for options that open follow-ups ("Rename…") and for loading ("Saving…").
- Numerals for counts; `Intl.*` for dates and numbers; non-breaking spaces in
  `10 MB`.
- Casing: sentence case (see the disagreement in
  [`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §5).

## 7. Build path

Impeccable's evals: image comps of working screens scored 2.0–2.9 while code-led
builds of the same briefs scored 3–3.5 "and were always complete", so Operate and
Read surfaces are always built directly in code. For React that means: compose real
shadcn or Radix primitives with real-shaped sample data in the first pass, rather
than generating a picture of an app and then translating it.
