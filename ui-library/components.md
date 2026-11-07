# Components: inventory, conventions and specs

Each spec here is the design; the components marked with a source link are implemented in
[strata-react](https://github.com/jburnhams/strata-react)
([`src/components/`](https://github.com/jburnhams/strata-react/tree/main/src/components)), with
a [Storybook](https://jburnhams.github.io/strata-react/) story for every state and an
[API reference](https://jburnhams.github.io/strata-react/api/). The worked example renders them
on the [state-matrix page](./examples/renders/system-light-1280.png). The rest are specified
here and follow the same conventions.

## 1. Conventions every component follows

1. **Tokens only.** Colours, type steps, radii and shadows come from
   [`tokens.md`](./tokens.md). No raw palette colours, no arbitrary values
   (`p-[17px]`, `bg-[#…]`), no `dark:` colour overrides. After the namespace reset most
   of these do not compile anyway.
2. **`cva` for variants, shadcn's names.** `variant` and `size` keep shadcn's values so
   copied code and agents' knowledge transfer; Strata changes what they look like, not
   what they are called. New recipes are new variant names, never redefinitions.
3. **`className` is accepted and merged with `cn()`**, for layout at the call site
   (width, grid placement, margin). It is not a styling escape hatch: the agent rules
   ([`agents.md`](./agents.md)) forbid colour and type classes there, and the namespace
   reset removes the stock ones.
4. **States are in the types.** If a component can be loading, empty, failed, pending
   or done, its props say so, and the type checker refuses an instance that leaves a
   state out. Examples: `DataView` requires `skeleton` and `empty`; `Status` requires
   its word; `IconButton` requires `label`; `AsyncButton` requires `done`.
5. **Accessibility is wired inside.** Labels, `aria-describedby`, `aria-invalid`,
   `aria-sort`, live regions and focus outlines are the component's job, not the
   caller's. The base layer gives every focusable element a visible outline.
6. **Comments carry the reasons.** Each file opens with why it is shaped the way it is,
   citing the finding. An agent editing the file reads the reason before changing the
   number (notboring: "keep the comments; they say why the numbers are what they
   are").
7. **Numbers go through `lib/format.ts`** (`Intl.NumberFormat`, `Intl.DateTimeFormat`,
   a non-breaking space before units). Quantities are right-aligned with
   `tabular-nums`.
8. **Copy inside components is specific.** Default labels say what happens ("Try
   again", "Undo", "Withdraw"), use sentence case, and carry the same verb through
   ("Book firing", "Booking…", "Booked").

## 2. Inventory

| Component | Built on | Status | Spec |
|---|---|---|---|
| Button | `<button>`, Radix `Slot` | example | [§3.1](#31-button-and-iconbutton) |
| IconButton | Button | example | [§3.1](#31-button-and-iconbutton) |
| AsyncButton, `useAsyncAction` | Button | example | [§3.2](#32-asyncbutton) |
| Field, Input, Textarea, NativeSelect | native elements | example | [§3.3](#33-field-and-controls) |
| ChoiceGroup | native radios in a fieldset | example | [§3.3](#33-field-and-controls) |
| Checkbox | native checkbox | strata-react | [§3.3](#33-field-and-controls) |
| Switch, ToggleGroup | Radix | spec | [§3.3](#33-field-and-controls) |
| Status | `<span>` | example | [§3.4](#34-status) |
| Metric, MetricStrip | `<dl>` | example | [§3.5](#35-metric-and-metricstrip) |
| DataView, `Load<T>`, EmptyState, Skeleton | – | example | [§3.6](#36-dataview-emptystate-skeleton) |
| DataTable, TableSkeleton | `<table>` | example | [§3.7](#37-datatable) |
| RowAction, `useSelection`, BulkBar | Button, live region | strata-react | [§3.7](#37-datatable) |
| LineChart | SVG | example | [§3.8](#38-linechart-and-barchart) |
| BarChart | SVG | spec | [§3.8](#38-linechart-and-barchart) |
| PageHeader | – | example | [§3.9](#39-pageheader) |
| UndoBar, `useUndoable` | live region | example | [§3.10](#310-undobar-and-alertdialog) |
| AlertDialog, Dialog, Sheet, Popover, Menu, Tooltip | Radix | spec | [§3.11](#311-overlays) |
| AppShell, Tabs, CommandMenu, Breadcrumb | Radix, `cmdk` | spec | [§3.12](#312-navigation) |
| `useHotkeys`, KeysLegend, `useActiveItem`, ActiveList | window `keydown`, `<dl>`, `<ul>` | strata-react | [§3.16](#316-keyboard-triage) |
| Toast, Alert | live region | spec | [§3.13](#313-toast-and-alert) |
| Prose, TableOfContents, Callout | – | spec | [§3.14](#314-read-surfaces) |
| Done | – | example | [§3.15](#315-done) |

## 3. Specs

### 3.1 Button and IconButton

[`button.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/button.tsx)

- **Variants**: `default` (the filled accent), `outline`, `secondary`, `ghost`,
  `destructive`, `link`. **Sizes**: `default`, `sm`, `icon`, all from `--control-h`.
- **The default variant is `outline`.** The filled accent must be asked for, and a
  view has at most one. Generated screens put the accent on every button; 12 of 23
  real product screens had no filled primary at all (taste-skill, via
  `../ux-product-ui.md` §3).
- **States**: default, hover (step 10 for solids, step 3–4 fills otherwise),
  focus-visible (base layer outline), active, disabled (`opacity-50`, no pointer
  events), loading (see AsyncButton).
- `type="button"` unless set, so a button in a form does not submit by accident.
- **IconButton** requires `label`, which becomes `aria-label` and the native tooltip.
  An unlabelled icon button is a compile error.
- **Generated versions get wrong**: the accent everywhere; arrow glyphs stapled to
  labels ("Get started →"); `transition-all`; `outline-none` with no replacement;
  "Submit" and "Learn more" as labels.

### 3.2 AsyncButton

[`async-button.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/async-button.tsx)

- **Props**: `phase: "idle" | "pending" | "done" | "error"`, `labels: { idle, pending,
  done, error? }`, plus Button's. `useAsyncAction(fn)` returns `[phase, run]` and
  settles `done` back to `idle` after 2 s.
- **One object through its states**: the label changes in place ("Book firing",
  "Booking…", "Booked", "Try again") with an icon for pending, done and error. The
  button is not swapped for a spinner (notboring's save → saving → saved).
- **No layout shift**: all labels are stacked in one grid cell, so the button is
  always as wide as its longest label.
- **Enabled until the request starts**, disabled only while pending
  (`../ux-product-ui.md` §5). The outcome is announced in a polite `role="status"`.
- **Generated versions get wrong**: disabling submit until the form is valid (the
  person cannot find out what is wrong); a spinner replacing the label; no done state,
  so nobody knows it worked.

### 3.3 Field and controls

[`field.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/field.tsx)

- **Field** takes `label`, `hint`, `error` and one control as its child, and provides
  the control's `id`, `aria-describedby` (error, then hint) and `aria-invalid` through
  context. Controls inside a Field cannot end up unlabelled.
- **Errors** sit directly under the control with an icon, in `text-danger`, and say
  what happened and how to fix it ("Kiln 2's shelves are 30 cm apart, and your
  tallest piece is 38 cm. Choose kiln 1, which takes up to 45 cm."). Never only a red
  border, never only a toast.
- **Input, Textarea, NativeSelect** share one control style and `--control-h`. Pass
  `name`, `type`, `inputMode` and `autoComplete`; never block paste.
- **NativeSelect is the default select.** On a touch screen and for short lists, the
  platform picker beats a custom listbox. A Radix `Select` or `Combobox` is added when
  a product needs search or rich options.
- **ChoiceGroup**: native radios in a `fieldset` with a `legend`; each label wraps its
  control so the whole row is one hit target; `accent-primary` themes the native mark.
  Use for 2–5 options that benefit from a sentence of detail each. Use `ToggleGroup`
  for 2–7 short options that switch a view.
- **Checkbox** (built in strata-react, [`checkbox.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/checkbox.tsx)):
  the native control, not Radix as first specified, for the same reason as ChoiceGroup:
  keyboard, forms and `accent-primary` come free. Label and control share one target;
  `label` is required; a hidden label is the aria-label, never visually hidden text
  (strata-react issue #11: a hidden span joined to visible text did not form a name with
  its space); `checked="mixed"` for a select-all over part of a list.
- **Switch** (spec): Radix, label and control share one target, only for settings that
  apply immediately.
- **Generated versions get wrong**: placeholders as labels; errors only on submit at
  the top of the form; `required` stars with no explanation; custom selects that break
  keyboard typeahead.

### 3.4 Status

[`status.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/status.tsx)

- **Props**: `tone: "neutral" | "info" | "success" | "warning" | "danger"`, `icon?`,
  `children: string` (required).
- Pale tint, dark ink of the same hue, a word, and an optional icon. Never colour
  alone; never a saturated chip with white text; no pulsing variant.
- A product maps its own states onto tones once, in one table (the example's
  `states` record in [`kiln-room.tsx`](./examples/screens/kiln-room.tsx)), rather than
  choosing a colour per call site.
- **Generated versions get wrong**: a coloured dot with no word; a pulsing "live" dot
  with nothing live behind it; the brand colour meaning success.

### 3.5 Metric and MetricStrip

[`metric.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/metric.tsx)

- **MetricStrip** is one `<dl>` split by hairlines, 1 column on phones and equal
  columns from `sm`. **Metric** takes `label`, `value` (formatted), `unit?`, `note?`.
- No `icon`, `sparkline` or `trend` prop exists. A change is written in words with its
  window in `note` ("41 more than October"); the trend gets its own chart.
- Figures are `type-figure` (28px, 500, tabular) in ink. Units are muted.
- **Generated versions get wrong**: four cards with an icon in a tinted circle each; a
  green "+12.5%" pill and a sparkline on every figure; 48px bold figures in the brand
  colour; round vanity totals. None of the 23 real screens had icons or sparklines on
  their figures (`../ux-product-ui.md` §3).

### 3.6 DataView, EmptyState, Skeleton

[`data-view.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/data-view.tsx)

- `Load<T>` is `{ status: "loading" } | { status: "error"; message; retry } |
  { status: "ready"; data }`. **DataView** takes `state`, `isEmpty`, `skeleton`,
  `empty` and a render function for the data; `skeleton` and `empty` are required.
- **Loading**: a skeleton that mirrors the final layout (`TableSkeleton` for tables),
  `aria-busy` on the container, never a spinner in the middle of content.
- **Error**: `role="alert"`, the message in plain words, and a "Try again" that calls
  `retry`.
- **EmptyState** takes `title`, a sentence, and an action. There is no illustration
  slot: an empty state teaches the next action. For an empty *chart*, draw the zero
  line and one sentence in the frame instead.
- Other data-view states a product still has to design: zero (a real zero is not
  "empty"), sparse, dense, and very long strings (`min-w-0`, `truncate`).

### 3.7 DataTable

[`data-table.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/data-table.tsx)

- **Columns**: `key`, `header`, `cell`, `numeric?`, `sort?`, `truncate?`, `className?`.
  `caption` is required: it names the table and labels its scroll region.
- 12px muted sentence-case headers; row rules, no zebra; numeric columns right-aligned
  with tabular figures; one status mark and at most one action per row, shown only on
  rows where it applies (the example's "Withdraw" appears only on booked rows).
- Sortable headers are buttons with an arrow that shows the current direction, and
  `aria-sort` on the `<th>`.
- The table sits in a focusable, labelled region that scrolls horizontally on narrow
  screens. Cells that do not need to wrap are marked `whitespace-nowrap`.
- **Row actions** are `RowAction`: a small ghost button that shows its verb and is
  named "<verb> <row>" ("Withdraw Tom Ellery"), so eight rows do not give eight
  controls called "Withdraw"; the column header is hidden, not empty (`hideHeader`).
  It keeps the row's pitch, so rows with and without the action are the same height.
- **Selection** (built in strata-react, issue #11) is opt-in, because checkboxes belong
  only where a bulk action exists (one of 23 product screens in the study had them).
  `selection` adds a checkbox column named per row (`rowLabel` is required) with a
  "Select all shown" header that is mixed when partly chosen and skips rows
  `isSelectable` rules out. `useSelection` prunes the chosen keys to rows that exist, so
  a bulk action never reaches a row that a removal, refetch or filter took away.
  `BulkBar` holds the count in a polite live region of its own, the actions (one filled,
  named with its count: "Withdraw 2") and Clear selection. A reversible bulk removal goes
  through `useUndoable`, as a single one does.
- **Generated versions get wrong**: uppercase tracked headers; zebra rows; checkbox,
  avatar, chip and kebab on every row; left-aligned proportional numbers.

### 3.8 LineChart and BarChart

[`line-chart.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/line-chart.tsx)

- **LineChart**: one measured series, a 2px straight line, no fill, no markers except
  the labelled peak and current reading. Optional `planned` (dashed neutral), `band`
  (a threshold that matters, labelled in the plot) and the current-reading rule.
- Four gridlines at a step people write on a scale (1, 2, 2.5, 4 or 5 × 10ⁿ), no
  y-axis line, no legend box: a small key in the caption, and direct labels on the
  data. All readings are in a screen-reader table.
- It draws in real pixels measured with `ResizeObserver`, so 12px labels stay 12px on
  a phone instead of shrinking with a scaled `viewBox`.
- Colour: one hue, passed by the caller from the tokens (`--chart-1…5`, or a status
  ink when the series *is* a status).
- `colourScale` (added 2026-11-07): colours the line by its own value, for subjects
  where that colour is a fact (a kiln's glow by temperature, water by depth, a
  heart-rate zone). The gradient runs in chart space, so a colour always sits at the
  same value; the peak and current points take the colour of their value; the key
  shows the steps with `colourScaleLabel` ("coloured as the kiln glows"). The y
  position still carries the value, so colour is never the only cue. Every step must
  clear 3:1 against the ground. Without a subject reason in DESIGN.md it is the
  "gradient that encodes nothing" tell; use one hue.
- **BarChart** (spec): bars start at zero; values printed on or beside bars; one hue,
  with a second hue only to mark the one bar the finding is about.
- **Generated versions get wrong**: gradient area fills; smoothed splines; a dot on
  every point; a rainbow palette with a hue per bar; values only in tooltips; axes
  that end at an arbitrary maximum.

### 3.9 PageHeader

[`page-header.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/page-header.tsx)

- `title` (a noun, `type-title`), `scope` (date, range or filter), `actions` (the main
  job's control, usually the one filled button), and `finding: { text, action? }`.
- The finding is the fact in today's data that most needs attention, in a sentence,
  with the action it drives beside it. It is the first thing read under the title.
- **Generated versions get wrong**: "Welcome back, Alex 👋"; a search, bell and avatar
  top bar on every screen; a 48px landing-page title on an app screen.

### 3.10 UndoBar and AlertDialog

[`undo.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/undo.tsx)

- `useUndoable(windowMs = 8000)` returns `{ pending, schedule, undo }`. The caller
  hides the item at once, `schedule`s the commit with a message, and restores it on
  `undo`. A second removal commits the first.
  From strata-react 0.2 ([PR #17](https://github.com/jburnhams/strata-react/pull/17))
  the hook owns which items are out of view (`isRemoved(id)`), so the caller filters
  rather than keeping its own hidden set; `commit` may return a promise; `flush()`
  commits now for an action that depends on the removal; and a failed commit brings
  the item back and shows the removal's `failure` sentence and the described error in
  the same bar, with Try again and Dismiss. Only one removal is pending at a time, and
  unmounting inside the window commits rather than drops it.
- **UndoBar** is a polite live region, always mounted, fixed to the bottom; the page
  keeps bottom padding so it never covers the focused row. A failure stays until it is
  retried or dismissed: the screen said the removal was done, so a failure that times
  out unseen leaves the screen lying.
- **AlertDialog** (spec, Radix) is for what cannot be undone. Its title names the
  object and the consequence; the confirm button repeats the verb ("Delete 3
  firings"), not "OK".

### 3.11 Overlays

Dialog, Sheet, Popover, Menu and Tooltip are Radix primitives restyled to
`rounded-overlay`, `shadow-overlay` and `bg-popover`. Dialogs and sheets always have a
title (visible or `sr-only`), trap and return focus, and set
`overscroll-behavior: contain`. A modal is never the first idea for a form that fits
on the page.

### 3.12 Navigation

**AppShell**: a side nav on the page ground (not a navy or tinted sidebar), the
current item as a neutral pill (`bg-muted`, no left bar), and an optional top bar only
when it holds something used on every screen. **Tabs**: Radix, state in the URL.
**CommandMenu**: `cmdk` in a Dialog. **Breadcrumb**: plain links with a `/` separator
in muted ink. Filters, tabs, pagination and open panels are reflected in the URL.

### 3.13 Toast and Alert

**Toast**: a polite live region for confirmations of background work; never for
errors a person must act on (those go inline). **Alert**: an inline callout with a
tint, an icon and a sentence, `role="alert"` only when it appears in response to an
action. Neither has a coloured side stripe on a rounded box.

### 3.14 Read surfaces

**Prose**: body measure 60–75ch, line height ≥ 1.5, headings from the same type
steps, links underlined with `text-primary-11`. **TableOfContents**: a list of anchor
links, the current section marked by weight, not colour alone. **Callout**: Alert with
`tone`.

### 3.15 Done

[`done.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/done.tsx). The completion moment, and the one
place the library spends a delight budget ([`character.md`](./character.md) §3).

- `title` (required): what happened, past tense, with its object ("Booked: 6 pieces in
  kiln 2's glaze firing on Tuesday").
- `next` (required): what the person does now, or what happens next and when. A finish
  with no next step is a dead end however pleasant it looks.
- `figure` (optional): a drawing of the result made from the person's own data in the
  subject's terms (their pieces on a shelf, their route, their seat). Never a stock
  illustration. The part that *is* the result carries the `enter-moment` utility
  (500ms, hard ease-out, no overshoot, once; instant under reduced motion).
- `actions` (optional): one filled button at most, as everywhere.
- Focus moves to the heading on mount (`focusOnMount`, default on), so keyboard and
  screen-reader users land on the result. The base layer hides the focus ring on a
  script-focused heading, which is not a control.
- Used only for rare, earned completions (a booking, a submission, an import, a
  first project). A routine save gets the `AsyncButton`'s "Saved", not a `Done`.
- **Generated versions get wrong**: confetti; "Yay!" or "You're all set!"; a stock
  illustration of people high-fiving; no next step; a toast that disappears before it
  is read; focus left on a button that no longer exists.

### 3.16 Keyboard triage

[`hotkeys.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/hotkeys.tsx),
[`active-list.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/active-list.tsx)

Added in strata-react for Operate screens that clear a queue (approve, return, next),
raised from an app built on it (strata-react issue #7). It follows from the frequency
budget in [`character.md`](./character.md): an answer given a hundred times a day gets
one key and an instant change.

- **One list of shortcuts** (`{ keys, label, run }`) drives both `useHotkeys` and
  `KeysLegend`, so a key cannot work without being shown, and the legend cannot show a
  key that does nothing.
- `useHotkeys` ignores keys typed into inputs, textareas, selects and contenteditable
  (WCAG 2.1.4 Character Key Shortcuts), chords with Ctrl, Meta or Alt, IME
  composition, and held keys unless the shortcut is marked `repeat` (moving is,
  answering is not).
- `useActiveItem` tracks the active item by key; it is a roving tab stop with
  `aria-current`. When it leaves the list, the item that took its place becomes active
  and focus follows if it was in the list, so the next key still works. An Undo that
  puts it back makes it active again, which is how it pairs with `useUndoable`.
- **ActiveList** marks the active row with a rule in ink as well as a tint, moves with
  the arrow keys, Home and End inside the list, and requires an `empty` state.
- **KeysLegend** is a caption-sized `<dl>` of `<kbd>`s, hidden on coarse pointers.
- **Generated versions get wrong**: shortcuts that fire while typing in a search box;
  a legend kept by hand that drifts from the handler; focus dropped to `<body>` after
  an answer, so the next key does nothing; the active row shown by colour alone.
