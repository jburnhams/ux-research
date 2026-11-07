# Patterns: composing components into screens

Components decide how a thing looks and behaves. Patterns decide which things are on a
screen, in what order, and why. Most of the difference between a product and a
template is here, which is why the library ships patterns as written rules and worked
screens rather than as blocks to paste.

Research: [`../ux-product-ui.md`](../ux-product-ui.md),
[`../ux-design/skill/references/product-ui.md`](../ux-design/skill/references/product-ui.md),
[`../ux-design/skill/SKILL.md`](../ux-design/skill/SKILL.md) §2 and §5.

## 1. Before any component: mode, question, finding

1. **Mode** of the surface (not the product): Operate, Read, Persuade or Experience.
   Plinth's components assume Operate; §7 and §8 say what changes for the others.
2. **The one question** the screen answers, in the user's words. The example's kiln
   room answers "Is my work out of the kiln yet?" It decides what is biggest and what
   comes first.
3. **The one finding**: the fact in today's data that most needs attention ("Kiln 2 is
   cooling at 212 °C and will be safe to open at about 14:50"). It goes in
   `PageHeader.finding`, beside the action it drives.
4. **Blocks in answer order.** Each block answers the next question a person asks after
   the first. Delete any block that answers none. This replaces the stock order (KPI
   row, big chart, two small charts, table).

The kiln room's blocks, and the question each answers:

| Block | Question |
|---|---|
| PageHeader with finding | Is my work out yet, and when will it be? |
| MetricStrip (3 figures) | How hot is it, how much is waiting, is there room in the next firing? |
| LineChart of the firing | Did the firing go to plan, and how fast is it cooling? |
| DataTable of work | Which pieces are where, and when do they come out? |

## 2. The Operate screen shape

```
┌──────────────────────────────────────────────────────────────┐
│ Noun title (24/600)                         [ one filled CTA ] │
│ scope: date, range, filter                                     │
├──────────────────────────────────────────────────────────────┤
│ The finding, in one sentence.               [ its action ]     │
├──────────────────────────────────────────────────────────────┤
│ label        │ label         │ label                           │
│ figure  unit │ figure        │ figure                          │
│ note         │ note          │ note                            │
├──────────────────────────────────────────────────────────────┤
│ Section heading (18/600)                                       │
│ one line of context                                            │
│ [ the block that answers the next question ]                   │
│                                                                │
│ Section heading                                                │
│ [ table: 4–6 rows visible, or all rows if few ]                │
└──────────────────────────────────────────────────────────────┘
```

- Everything the brief names is on the first screen at 1440×900. Long lists are capped
  at 4–6 rows with "View all" when they would push the rest below the fold.
- One filled button per view. Every other action is outline, ghost or link.
- Sections are separated by space and hairlines, not by putting each one in a card.
  A card is used when the thing *is* a separate object (a person, a file, a booking you
  can pick up and move), and cards are never nested.
- The page opens in a realistic working state, not an empty shell.

See it rendered: [light](./examples/renders/kiln-room-light-1440.png),
[dark](./examples/renders/kiln-room-dark-1440.png),
[phone](./examples/renders/kiln-room-light-390.png),
[loading](./examples/renders/kiln-room-loading-light-1440.png).

## 3. Figures

- Write the figure the question needs, not the one that is easy to count. "Pieces
  waiting in kiln 2" over "Total bookings".
- Totals are summed from the rows on screen (the example computes 14 from the table's
  four cooling bookings), so the figure and the table never disagree.
- A change is written in words with its window ("41 more than October"); zero change is
  grey; an undefined change shows nothing.
- `Intl` formatting, units muted with a non-breaking space, tabular figures.

## 4. Tables

- Columns in the order the person scans: who or what, then quantities, then state,
  then when, then the one action.
- The data's own order unless the person sorts; an initial sort only when there is an
  obvious one (time, priority).
- One status mark per row. One action per row, on rows where it applies.
- On phones the table scrolls inside its labelled region; do not reflow a real table
  into a stack of cards unless each row really is an object a person acts on alone.

## 5. Charts

- One question per chart, one series where possible, one hue plus neutrals.
- Draw what the person compares against: the plan (dashed), the threshold (a labelled
  band), now (a rule). The example's signature move is exactly this: the firing drawn
  the way the kiln controller is programmed, ramp and hold, with the safe-to-open band.
- Label the values that answer the question on the chart itself; keep every reading in
  a table for screen readers.
- Categorical palettes come from `palette.mjs` (`--chart-1…5`), which checks
  separation for colour-blind readers; equal-lightness "harmonious" palettes fail that
  check (worst-pair ΔE 0.4–2.6, `../ux-colour-science.md` §5).

## 6. Forms

From [`book-firing.tsx`](./examples/screens/book-firing.tsx)
([with errors](./examples/renders/book-errors-light-1440.png)):

- One column, labels above controls, related short fields paired on wide screens.
- Explain constraints before the person hits them (hints: "Up to 20 per booking.",
  "Kiln 1 has 45 cm between shelves, kiln 2 has 30 cm.").
- Validate on submit and then live per field as it is corrected. Focus the first
  error. Each error names the problem and the fix in the product's own terms.
- The submit button stays enabled until the request starts, then shows progress in its
  own label (`AsyncButton`). Cancelling is a ghost button or a link, never a second
  filled button.
- Warn before leaving with unsaved changes (`beforeunload` while dirty).
- Never block paste; set `name`, `type`, `inputMode` and `autoComplete`.

## 7. Destructive actions and async feedback

| Situation | Pattern |
|---|---|
| Reversible removal (withdraw a booking, archive) | Act at once, `UndoBar` for 8 s, commit after |
| Irreversible (delete an account, start a firing) | `AlertDialog` naming the object and consequence; the button repeats the verb |
| Saving a form | `AsyncButton`: idle → pending → done (→ idle), or error with "Try again" |
| Finishing something rare that took effort (a booking, a submission, a first project) | `Done`: what happened, what next, and optionally the result drawn from the person's data; see §10 |
| Background work finished | Toast in a polite live region |
| Background work failed | Inline `role="alert"` where the work shows, with recovery |
| Optimistic update | Show the result immediately; roll back and say so on failure |

## 8. Read surfaces

Docs, help, changelogs: `Prose` with a 60–75ch measure, a table of contents for long
pages, headings from the same type steps, real code blocks on `--surface-sunken`.
The Operate rules about restraint apply; the extra job is navigation (where am I,
what is next).

## 9. Persuade surfaces

Plinth ships no hero, feature grid, logo cloud, testimonial, pricing or stats blocks,
because those are where the stock section waterfall comes from. A landing page built
on Plinth uses the same tokens, `Button`, `Prose` and type steps, plus:

1. Write the page as claims, each with its proof, one line per section. The claims
   decide which sections exist and in what order.
2. Add `type-display` (a clamped size) and, if the direction calls for it, a display
   face, recorded in DESIGN.md.
3. Spend boldness in one place: one memorable element made from the product's own
   material, everything around it quiet. Motion, if any, is one authored moment with
   a reduced-motion path, not a fade-up on every section.
4. Run `slop-lint --mode persuade`, which turns on the landing-page rules.

The procedure is the `ux-design` skill's (`../ux-design/skill/SKILL.md` §2–§5), and
the registry of what to avoid is `../ux-design/skill/references/tells.md`.

## 10. Character: where it goes on a screen

The full layer is [`character.md`](./character.md). On a screen it comes down to:

1. **At rest, in three places**: the voice (labels, empties, errors in the subject's
   own words, straight-faced), the signature (how the main data is drawn, coloured by
   a fact of the subject where there is one) and the figures. None of these cost the
   person time, so they can be everywhere the person reads.
2. **In motion, by frequency**: nothing on navigation and shortcuts; `press` on
   buttons; ordinary 150–250 ms transitions on overlays and the undo bar; one moment
   per flow, at its end, only where the flow is rare and took effort.
3. **Never**: on the dashboard's own load, on table rows, on a routine save, on an
   error, or anything that loops.

In the example: the firing line coloured as the kiln glows (signature, at rest), "All
three kilns are cold" (voice, empty), the controller error that says where to read the
live temperature (voice, error), `press` on every button, and the booking's `Done`
with the member's pieces set down on their shelf (the moment).
