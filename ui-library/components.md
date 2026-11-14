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
   `tabular-nums`. Dates have named formatters for each use (`clock`, `day`, `shortDay`,
   `date`, `dateTime`) in Intl's locale-ordered styles, callable with a Date or an ISO
   string, so a screen never builds its own `Intl.DateTimeFormat` (strata-react issue #31).
8. **Copy inside components is specific.** Default labels say what happens ("Try
   again", "Undo", "Withdraw"), use sentence case, and carry the same verb through
   ("Book firing", "Booking…", "Booked").

## 2. Inventory

| Component | Built on | Status | Spec |
|---|---|---|---|
| Button | React Aria `Button` | example | [§3.1](#31-button-and-iconbutton) |
| IconButton | Button | example | [§3.1](#31-button-and-iconbutton) |
| AsyncButton, `useAsyncAction` | Button | example | [§3.2](#32-asyncbutton) |
| Field, Input, Textarea, NativeSelect | native elements | example | [§3.3](#33-field-and-controls) |
| ChoiceGroup | React Aria `RadioGroup` | strata-react | [§3.3](#33-field-and-controls) |
| Checkbox | React Aria `Checkbox` | strata-react | [§3.3](#33-field-and-controls) |
| Switch, ToggleGroup | React Aria | spec | [§3.3](#33-field-and-controls) |
| Status | `<span>` | example | [§3.4](#34-status) |
| Metric, MetricStrip | `<dl>` | example | [§3.5](#35-metric-and-metricstrip) |
| DataView, `Load<T>`, EmptyState, Skeleton | – | example | [§3.6](#36-dataview-emptystate-skeleton) |
| Thumbnail, ThumbnailSkeleton | `<img>`, IntersectionObserver | strata-react | [§3.6](#36-dataview-emptystate-skeleton) |
| DataTable, TableSkeleton | `<table>` | example | [§3.7](#37-datatable) |
| RowAction, `useSelection`, BulkBar | Button, live region | strata-react | [§3.7](#37-datatable) |
| SelectableGrid | React Aria `Checkbox` | strata-react | [§3.7](#37-datatable) |
| Disclosure, `useExpanded`, DataTable `expansion` | `<button aria-expanded>` | strata-react | [§3.18](#318-disclosure-and-expandable-rows) |
| `useHistory`, `useHistoryState`, `useAutoSave`, SaveStatus | window `keydown`, status text | strata-react | [§3.19](#319-document-history-and-save-state) |
| Workspace, Split, Pane, `useWorkspaceState` | React Aria `useMove` | strata-react | [§3.20](#320-workspace-layout) |
| Timeline, `useTimelineZoom`, `noOverlap` | React Aria slider hooks, `useDrop` | strata-react | [§3.21](#321-timeline) |
| RouteMap, `geo` | Leaflet (optional peer, own entry) | strata-react | [§3.22](#322-maps-of-routes) |
| LineChart | SVG | example | [§3.8](#38-linechart-and-barchart) |
| BarChart | SVG | spec | [§3.8](#38-linechart-and-barchart) |
| PageHeader | – | example | [§3.9](#39-pageheader) |
| UndoBar, `useUndoable` | live region | example | [§3.10](#310-undobar-and-alertdialog) |
| Dialog, AlertDialog, Sheet (`placement="end"`), Popover, Tooltip | React Aria | strata-react |
| Menu | React Aria | spec | [§3.11](#311-overlays) |
| AppShell, Tabs, CommandMenu, Breadcrumb | React Router, React Aria (`Tabs`, and `Autocomplete` for the command menu) | AppShell and Tabs in strata-react | [§3.12](#312-navigation) |
| `useHotkeys`, KeysLegend, `useActiveItem`, ActiveList | window `keydown`, `<dl>`, `<ul>` | strata-react | [§3.16](#316-keyboard-triage) |
| Toast, Alert | live region | spec | [§3.13](#313-toast-and-alert) |
| Prose, TableOfContents, Callout | – | spec | [§3.14](#314-read-surfaces) |
| Done | – | example | [§3.15](#315-done) |
| Meter, CompositionBar, LinkCard, compact ColorSchemeChoice | `role="meter"`, `<table>`, `<a>`, native radios | strata-react | [§3.17](#317-status-dashboards) |

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
  { status: "ready"; data; stale? }`. **DataView** takes `state`, `isEmpty`, `skeleton`,
  `empty` and a render function for the data; `skeleton` and `empty` are required.
- **Loading**: a skeleton that mirrors the final layout (`TableSkeleton` for tables),
  `aria-busy` on the container, never a spinner in the middle of content.
- **Error**: `role="alert"`, the message in plain words, and a "Try again" that calls
  `retry`. Only a read that never produced data is an error.
- **Stale**: a refresh that fails after a good read keeps the data on screen. `stale`
  carries the reason, when the data was read and a retry, and `DataView` shows a
  `StaleNotice` above the data: a polite status (not an alert, since nothing was lost),
  the reason, "Showing data from 13:50." (the weekday too when it was not today) and Try
  again. A screen with readings passes its own words ("These readings are from 13:50.").
  Replacing a dashboard with an error panel on one failed poll throws away numbers the
  person was using; failing silently lets them act on old numbers as live. Follows
  [`taste-skill` app-screens](../taste-skill/references/app-screens.md) (a refresh keeps
  the old values; an error says when the data was last good). Added in strata-react
  issue #26, found when a polling dashboard (jburnhams/homepage) went blank on a failed
  refetch, because TanStack Query keeps the data but sets the query's status to error.
- **EmptyState** takes `title`, a sentence, and an action. There is no illustration
  slot: an empty state teaches the next action. For an empty *chart*, draw the zero
  line and one sentence in the frame instead.
- **Thumbnail** (built in strata-react, issue #33) is the same four states for one remote
  image: a box with its `aspect` ratio before anything loads (no layout shift), a
  `Skeleton` while it loads, the photo, and on failure or `src={null}` the required
  `missing` words ("Photo not found") as an `img` named "<alt>: <missing>", never the
  browser's broken-image icon. `alt` is required. The request waits until the box nears the
  screen (the same IntersectionObserver hook as InfiniteList's sentinel) and the photo
  replaces its skeleton without a fade, since thumbnails are seen many times a day.
  `ThumbnailSkeleton` is its shape for a DataView skeleton.
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
  named with its count: "Withdraw 2") and Clear selection. While the bar is up, its
  action is the view's one filled button: the screen's own primary steps down to outline
  until the selection is cleared (`variant={selection.count ? "outline" : "default"}`),
  so the rule in `patterns.md` §2 holds in every state, not only the resting one. A reversible bulk removal goes
  through `useUndoable`, as a single one does.
- **Ranges and a starting selection** (strata-react issue #32). Shift-click, or
  Shift+Space from the keyboard, sets every selectable row from the last one clicked to
  this one to this row's new state, in the order shown (after sorting), as Gmail and the
  macOS Finder do; a plain click moves the anchor. `useSelection`'s `initial` (keys, or
  a test on the row) chooses a row the first time it appears, so rows pre-chosen from
  the data (likely matches, flagged items) still start chosen when the data loads after
  mount or a next page arrives, and a row the person cleared is not chosen again.
- **SelectableGrid** (strata-react issue #32, from a review screen of face crops) is
  the same selection drawn as a grid of pictures, for choosing by eye. Each tile is one
  label (picture, box, one detail line), so a click anywhere on the picture toggles it,
  as photo apps work; the box sits on a chip of the page ground so it shows on any
  photo and is named from the row. Pictures sit in a fixed-aspect frame so nothing
  shifts as they load. "Select all shown", ranges and virtualisation from 100 items
  behave exactly as the table's, because both use one hook.
- **Expandable rows** (built in strata-react, issue #34) are opt-in through `expansion`;
  see [§3.18](#318-disclosure-and-expandable-rows).
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
- The y-axis runs from zero (lower only for a negative reading) to a nice maximum.
  `yMin`/`yMax` (added 2026-11-07, strata-react issue #23) pin either end where the range
  is a fact of the subject: a percentage is 0 to 100%, so a machine at 1% CPU sits on the
  floor instead of filling an autoscaled 0 to 8% axis and looking busy. A pin widens to
  show a reading past it; it never crops one.
- Because labels keep their size, the x labels thin themselves (every second, third…
  tick, so the spacing stays even) when they would collide, and the end labels stay
  inside the plot. The kiln chart's day-and-time labels overlapped at 390px before this.
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
- **AlertDialog** (strata-react, React Aria) is for what cannot be undone. Its title names the
  object and the consequence; the confirm button repeats the verb ("Delete 3
  firings"), not "OK".

### 3.11 Overlays

Dialog, Sheet, Popover, Menu and Tooltip are React Aria components restyled to
`rounded-overlay`, `shadow-overlay` and `bg-popover` (one shared surface). Dialogs and
sheets always have a title (visible or `sr-only`), trap and return focus, and set
`overscroll-behavior: contain`. A modal is never the first idea for a form that fits
on the page.

Built in strata-react (2026-11-12, issue #70) with these settled points: `Dialog` can be
made not closable while work cannot be interrupted (no close control, Escape or outside
press), so an export does not lose its Close button halfway; `AlertDialog` ignores
outside presses, focuses Cancel first, requires the confirm verb, and stays open with the
server's reason when an async confirm fails; `Popover` requires a label; `Tooltip` opens
on hover and on keyboard focus, holds words only, and is how `IconButton` shows its
required label. Stacking is three named layers (bar, overlay, tip), so an app never writes
a z-index. Overlays enter with the ordinary effects duration and close at once. A
screenshot of an overlay must include what is portalled out of the story root.

### 3.12 Navigation

**AppShell**: a side nav on the page ground (not a navy or tinted sidebar), the
current item as a neutral pill (`bg-muted`, no left bar), and an optional top bar only
when it holds something used on every screen. **Tabs**: React Aria, state in the URL.
**CommandMenu**: a React Aria `Autocomplete` with a menu in a Dialog (decided 2026-11-12: `cmdk` is not used). **Breadcrumb**: plain links with a `/` separator
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

### 3.17 Status dashboards

Added 2026-11-07 from strata-react issue #25 (jburnhams/homepage hand-rolled all four):
[`meter.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/meter.tsx),
[`composition.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/composition.tsx),
[`link-card.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/link-card.tsx),
[`theme.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/theme.tsx).
These apply rules already set out here (§3.4, §3.8, `patterns.md` §3 and §5) to new shapes,
not new findings.

- **Meter** (a level such as disk space): `role="meter"`, not `progressbar`, because
  the level can go down as well as up. Its name is what is measured; its
  `aria-valuetext` is the printed reading ("72% used"). The figure is always beside the
  bar. Thresholds are what the reading is compared against (as `band` is on a chart),
  drawn as notches. **Each threshold must name its state** ("Nearly full"); once it is
  crossed the fill takes the status ink and the word is shown as a `Status` (§3.4), so
  colour is never the only cue. Thresholds are shares of the maximum, so one set
  covers disks of every size; `worseWhen="lower"` turns them round for a battery. Below
  every threshold the fill is `--chart-1`, as on a LineChart: "fine" needs no colour.
- **CompositionBar** (what a whole is made of): a stacked bar for proportion over a
  table that names every part, its amount and its share, in the caller's order. The
  bar is hidden from screen readers because the table holds it all. Parts take
  `--chart-1…5` in order (the palette checked for colour-blind separation); a sixth
  part has no token, which is the cue to make an "Other" part. A remainder that the
  parts do not fill must be named ("Free").
- **LinkCard** (a destination, such as an app on a homepage): a card is right because
  each destination is a separate object (`patterns.md` §3). One link per card, on the
  title, stretched over the card with `::after`, so the name is the title and the
  description and status marks are the link's description; one tab stop; nothing else
  on the card is interactive. Links that leave the app carry an arrow. No lift or
  shadow on hover ([`character.md`](./character.md): a homepage card is pressed many
  times a day).
- **ColorSchemeChoice `compact`**: for an app with no settings page, the three choices
  (system, light, dark) as icon segments named "Appearance", still native radios with
  each choice's words as its name and tooltip. Never a two-way toggle, which loses
  "match this device" the first time it is pressed.
- **Generated versions get wrong**: a bare bar with the percentage only in a tooltip; a
  bar that turns red with no word; a donut chart with a legend for memory; a card whose
  whole text is the link's name, or a card with a button inside a link; a sun/moon
  toggle with no system option.

### 3.18 Disclosure and expandable rows

[`disclosure.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/disclosure.tsx),
[`data-table.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/data-table.tsx)

Added in strata-react for a row that shows more of itself in place (a batch's faces under
it in a history list, a firing's pieces under its line in the log), raised from the Bright
Horizons review app, which had written its own `<details>` (strata-react issue #34).

- **Not `<details>`.** A closed `<details>` still mounts its content, so a list of forty
  rows whose bodies each load their own data makes forty requests on load. `Disclosure`
  mounts its body only while open: a `useLoad` in the body runs on first open, and the
  query cache answers a later one. The body owns its loading, empty and error states
  through `DataView`, inside the open row, so one failed detail does not take the list
  down.
- The trigger is a native button with `aria-expanded`, and `aria-controls` while the
  body exists (WAI-ARIA disclosure pattern). The summary is the button's name, so it
  holds text and marks, never controls; a row's action sits beside it (`actions`). Focus
  stays on the button through open and close.
- **`useExpanded`** holds the open keys for a whole list or table, and with `param`
  keeps them in the URL (`?open=f-0411`, one parameter per key), so an opened row can be
  linked and survives a reload (the URL rule in [`patterns.md`](./patterns.md) and §3.12). `single` makes an accordion;
  it is off by default because people compare two rows.
- **In a table**, `DataTable`'s `expansion` adds a toggle column (header kept for screen
  readers as "Details"). Each toggle is named for what it shows ("Work in Bisque, cone 04
  in Kiln 1, Mon 06:05"), with the state in `aria-expanded`, not the name. The detail is a
  row under its row with no rule between them, spanning the data columns so it starts
  under the first; `isExpandable` drops the toggle from rows with nothing to show. A
  virtualised table measures each detail row.
- **No height animation.** Emil Kowalski's recipes give accordions a height transition,
  but rows in a list are opened tens of times a session, which [`character.md`](./character.md)
  §5.3 puts at "near-imperceptible" or none. Only the chevron turns.
- **Generated versions get wrong**: `<details>` or a hidden `div` that mounts every body
  and fires every request on load; a chevron `div` with a click handler and no button;
  toggles all called "Expand"; buttons nested inside the summary; open state lost on
  reload.

### 3.19 Document history and save state

[`history.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/history.tsx),
[`save.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/save.tsx)

Added in strata-react for an app where a person edits one document over a long session (a
video project, a drawing, a form builder), raised from strata-vid (strata-react issue #81), whose
undo had no step names and whose autosave said nothing on screen, even when it failed.

- **Which undo.** §3.10 (`useUndoable`) is for one item leaving a list: it acts at once, commits to
  the server after a few seconds, and one removal is pending at a time. A history is for a
  document the person keeps editing, where every change can be walked back for the whole session.
  A removal inside a document is a history step, not an `UndoBar` message.
- **A step is a name and two functions** (`undo`, `redo`), so the history does not care whether the
  app's store keeps patches, snapshots or commands. `useHistoryState` is the snapshot case for plain
  React state. The history never holds the document.
- **Steps are named, and the name is in the control.** "Undo move clip", not "Undo": the person
  can tell what the key will do before pressing it. The label is the phrase after the verb. Undo and
  Redo are `Command`s (§3.16 commands), so the menu item, the toolbar button and the shortcut read
  one object: label, enabled state, reason when disabled ("Nothing to undo"), chord (Mod+Z, and
  Mod+Shift+Z or Mod+Y for Redo). They do not fire in a text field, which keeps its own undo.
- **A drag is one step.** `begin(label)` returns `end`, and every step pushed between becomes one,
  so a drag or a gesture undoes in one press. A control that fires many events (a slider) pushes
  with one `key` and consecutive pushes merge. A new step after an undo drops what could have been
  redone. A `limit` (default 100) drops the oldest, and `atLimit` lets the screen say so.
- **Save state has four words**: "Saved 10:42", "Saving…", "Unsaved changes", "Not saved" with the
  reason and "Try again". The same verb through every state, labels stacked in one grid cell at a
  fixed width so nothing beside the sign moves ([`character.md`](./character.md) §3). The time is
  a clock time, not "2 minutes ago", because nothing on screen ticks.
- **A routine save is quiet** (no toast, no tick), as `character.md` §5 asks. A failed save is the
  bad-day case: it is announced politely once with its reason and what is still safe ("Your changes
  are still here"), and the recovery is announced too. Saves are debounced, never overlap, and an
  edit made during a save is saved after it. A document with an explicit Save command sets no delay
  and stays "Unsaved changes" until it is saved.
- **Leaving.** A document that saves itself needs no `beforeunload` prompt except while a save is
  pending or failed; `useLeaveGuard(active)` is on only then ([`patterns.md`](./patterns.md) §6).
  This replaces `window.confirm("Unsaved changes will be lost")` in a project that autosaves.
- **Generated versions get wrong**: a bare "Undo" with no name; every slider tick a step; Ctrl+Z
  handled on the window so it also fires inside a text field; an autosave with no sign on screen;
  "Saved!" with a toast and a tick animation on every save; a failure that only logs to the console;
  a `confirm` on leaving a document that saves itself.

### 3.20 Workspace layout

[`workspace.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/workspace.tsx)

Added in strata-react for a screen that is a workspace of panes (a video editor, an IDE-style
tool, mail with a reading pane), raised from strata-vid (strata-react issue #68), which had a
fixed CSS grid (`300px 1fr 300px`, `50px 1fr 200px`) where nothing could be resized or hidden.
This is new ground: [`patterns.md`](./patterns.md) covers Operate screens and says little about
tools, so these are the decisions.

- **When.** `AppShell` is for moving between screens. A workspace is one screen whose regions
  stay on view together and that the person sizes to the job. Everything the brief names is on
  the first screen (patterns.md §2); the panes are regions separated by hairlines, never cards.
- **Shape.** Splits (row or column) hold panes and other splits; one pane per split grows to take
  what is left (the stage), the rest have sizes the person sets. A bar across the top is just an
  element above the split. A row of three over a full-width bottom pane is a column split holding
  a row split and a pane.
- **One header on every pane**: its name, the few actions it owns, and a collapse button. An app
  where every panel draws its own bar in its own style (strata-vid's `Library`, `Clip Properties`,
  `TIMELINE`) reads as several apps. A pane is a landmark (a `section` named by its header).
- **Resizing is a separator the keyboard can use.** `role="separator"` with `aria-valuenow`,
  `-min` and `-max`, in the tab order: arrows move it (10px, Shift 50px), Home and End go to the
  limits, Enter or a double-click restores the default size. A pane has a minimum and a maximum;
  the stage keeps its own minimum and a drag stops where it would be crossed; shrinking the
  window takes from the panes only down to their minimums.
- **Folding leaves a way back.** A collapsible pane folds to a rail one control wide (beside the
  stage) or to its header bar (above or below it), with a visible "Show Library" button, never to
  nothing. A menu item or shortcut can do the same from outside. A folded pane stays mounted so
  a timeline keeps its scroll.
- **Remembered without app code.** Sizes and folded panes are per-person preferences, kept under a
  name in local storage inside try/catch (storage throws in private windows and with blocked site
  data) and falling back to the defaults. They are not in the URL: a link should not carry one
  person's layout. This refines the URL rule in §3.12, which is for what a person would link to.
- **Narrow widths are the component's rule.** Below 720px of the workspace's own width,
  side-by-side splits stack, and their collapsible panes start folded to header bars, one tap to
  open. That is not remembered, since it is the width and not a choice.
- **No animation.** Resizing and folding happen many times a session
  ([`character.md`](./character.md) §3): they change at once. Header and rail sizes come from
  `--control-h`, so density follows the tokens ([`tokens.md`](./tokens.md) §10).
- **React Aria first.** React Aria Components 1.22 has no splitter or panel part (its `Separator`
  is a static rule, `useSeparator` is for a non-focusable one, and the table's column resizing is
  its own), so the layout is ours on `useMove`, which gives pointer, touch and arrow-key movement.
- **Generated versions get wrong**: a fixed `grid-template-columns` with no way to resize; a drag
  handle that is a `div` with only a mouse handler (no keyboard, no role, no value); a pane that
  collapses to nothing; panels each with their own header style; sizes lost on reload; side panels
  that squeeze the stage to a sliver on a small window; a collapse animation on a control used
  fifty times a day.

### 3.21 Timeline

[`timeline.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/timeline.tsx)

Added in strata-react for a time axis of lanes (a video edit, a kiln schedule, a rota), raised
from strata-vid (issues #77 and #121). The picture is one: a ruler, lanes, items with a start and
a length, a current-time rule, markers. These are the decisions that were not already in §3.8 or
§3.20.

- **The component draws, the app decides.** Every move, trim, lane change, selection and drop is
  reported and applied by the app, so overlap rules, snapping to its grid and undo (§3.19) stay in
  one place. A change the app refuses is shown while it is being made, with an icon and the reason
  in words, and is not reported.
- **Keyboard first.** One tab stop for the items with focus moving inside it; arrows move between
  items and lanes; Ctrl+arrows nudge, Alt+arrows trim; the current time is a slider on the ruler.
  Every change is announced in words ("run-02.mp4 moved to 0:14, Track 1").
- **A drop from outside is a move that starts elsewhere.** Dragging a file from a library onto a
  lane reports the lane and the time, snapped the same way as a move, and refuses with a reason
  while the drag is still over the lane (the same `validate` voice). The preview is a dashed box of
  a length the app gives, because a drag does not reveal its items until it lands. The keyboard
  path is React Aria's: focus a source, Enter, Tab to a lane, Enter. It has no pointer position, so
  it lands at the current time, and the lane says where and whether it may. A button that adds at
  the current time is a fine extra, never the only way.
- **A lane is as tall as what it shows.** One control height for a label, two or three for
  thumbnails or a waveform, always a multiple of `--control-h` so density still applies.
- **A kind's colour is the app's.** A kind named by an app (a GPX clip) keeps one colour whichever
  other kinds are on the timeline; the order-of-appearance chart palette is only the fallback.
  The stripe is never the only sign: the kind is also a word.
- **The lane header sizes to its content, with a cap**, so three controls do not cost the name its
  room; a name past the cap is truncated with its full text on hover.
- **Generated versions get wrong**: items that can only be moved with a mouse; a drop that lands
  "somewhere" without a time or a lane; an outside drop that ignores the lane's lock; lanes fixed
  at one height so a thumbnail strip is a sliver; kinds coloured by array order, so a colour
  changes when a track is added.

### 3.22 Maps of routes

[`route-map.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/map/route-map.tsx)

Added in strata-react for apps that show where something went (activity and route apps, fleet and
delivery views, field work, GPS playback), raised from strata-vid and jonathanburnhams.com
(strata-react issue #80). Both had hand-rolled Leaflet maps with a route colour chosen by hand and
no check that it could be seen on the chosen tiles. This is new ground; these are the decisions.

- **A map is its own entry.** The library is heavy, so it sits behind `strata-react/map` with the map
  library an optional peer; an app that draws no maps installs nothing. The map's own stylesheet is
  put in the page by the component, so using a map is an import and not an import plus a CSS step.
- **Leaflet, without a React binding.** A binding makes every layer an element, so a position that
  moves sixty times a second re-renders the routes beside it. Make the map once, draw routes in one
  effect that runs when the routes change, and move the position with one `setLatLng`. The rule that
  follows: **a position update redraws nothing else**, and the app keeps its routes in a stable array.
- **Tiles are the app's, with the attribution its provider requires, shown.** A light set and a dark
  one follow the colour scheme. An app with no dark tiles gets the light ones under a filter, which
  is a fallback: a dark product should supply dark tiles. Fixture tiles in tests and stories, never a
  live provider (a screenshot must not depend on a tile server).
- **Colour is a role, resolved when drawn.** SVG strokes written by a library take a real colour, so
  a role (`var(--chart-2)`) is resolved against the map's element and redrawn when the scheme changes.
  Routes default to the chart palette in order. Check that a route's colour has 3:1 against the tiles
  it is drawn on (§3.8's rule for steps); that was the check the two apps lacked.
- **Colour by value follows §3.8.** Use it only where the colour is a fact of the subject (speed,
  gradient, heart-rate zone), in steps the app chose, with a key that names each step and where it
  starts, so colour is never the only cue. A run of one step is one line, not a segment per point.
- **One route is a picture with a direction.** Chevrons along it (evenly spaced by distance, the
  bearing smoothed so GPS jitter does not turn one sideways) and a filled start and a ringed finish;
  a loop is one mark. Shapes, not only colour, tell start from finish. With several routes these are
  off, because chevrons on every line are noise.
- **Fit to content on first show and when the set of routes changes**, not when a route's points are
  replaced: a person who has zoomed in is not thrown back.
- **Leave Leaflet's corners alone.** Zoom is top start and attribution is bottom end; an app's own
  control or figure goes top end or bottom start, below the colour key, never over a required notice.
- **Keyboard and screen readers.** Leaflet's container is a focus stop (arrows pan, + and − zoom),
  named by a label and described by a text alternative generated from the data: each route, its
  length, a loop or not, and how far along the position is. That position is not a live region and is
  updated at most once a second; announcing sixty positions a second is worse than silence. Choosing
  a route by pointer is `onSelect`; the keyboard path is the app's list of routes beside the map, since
  a line inside Leaflet's SVG has no keyboard equivalent.
- **No animation.** Zoom, fade and inertia are off: a map is panned constantly
  ([`character.md`](./character.md) §3), and a tile that fades in makes a screenshot depend on timing.
- **Distances through `format`** (`format.distance`, metric or imperial); route geometry (`geo`) lives
  in the main entry so a text alternative or a profile needs no map library.
- **A map can be picture content, not a page's map** (strata-react issue #161, from strata-vid, where a
  route inset is composed over footage and must match an export drawn on a canvas). Set up once, it has
  to look the same on every frame. Three rules: the **zoom is a number the app sets** (any value, so an
  animation is a prop that changes every frame; unset, the map fits its routes as before); **centred
  follow holds the view exactly on a position, with no animation**, by panning to a whole-pixel view
  worked out from position and zoom alone, because Leaflet's own centred pan truncates each step and the
  final view then depends on the path taken (frame N is the same however it was reached); a reset gives
  the same view but empties the tile layer on every call, which flickers at one update per frame;
  and **several positions are each one marker kept by id**, tied to a route, drawn in that route's
  colour, named in the text alternative along its own route. The §3.22 rule still holds: no route is
  redrawn for any of it. Dark tiles set equal to the light ones keep the picture the same in both
  schemes. Route ends and arrows already turn off per route, so the picture needs nothing more.
- **Generated versions get wrong**: a route colour picked by hand and never checked against the tiles;
  react-leaflet with the routes inside the component that holds the moving position, so every frame
  redraws every route; a dark app with bright tiles; the provider's attribution hidden behind an
  overlay; a map that cannot be panned from the keyboard and says nothing to a screen reader; colour by
  value with no key; a zoom animation under a screenshot test.
- **Items on the map (strata-react issues #181 to #184).** A set of items is `markers`, drawn only
  near the view so 500 cost what the visible ones cost. State is a **shape as well as colour** (circle,
  ringed larger circle for selected, diamond for flagged) and the key names the states on the map. A
  close group is **fanned out deterministically in world pixels** (a pure function of the zoom, so
  panning never moves it and zooming in settles it) with leader lines to the true places; never
  clustering that hides the items. A marker is a button inside one group, so the keyboard path is the
  app's list beside the map and the map adds no tab stops. A stretch of a route is drawn heavier with
  its marker at the middle. **Choosing a place** is `picking`: a click, or arrows moving a crosshair
  (Shift for big steps, Enter, Escape), and the answer says which route is nearest and how far off, so
  the app can refuse a place that is nowhere near. Route lines stop taking clicks while picking. The
  view is reported once when it settles and restored from a saved one; a "Reset view" control returns
  to the fit.
- **One cursor across views of the same run.** Chart, map and seek bar each show where the person is
  pointing or where playback is. They share one canonical unit and each member maps to and from it, a
  member never reacts to its own writes, and the pointer wins over playback and hands back to it. One
  polite live region speaks the reading, throttled, never one per member.

### 3.23 Timed media: windows, waveforms, transcripts, streams and 360 pictures

[`media-player.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/media-player.tsx),
[`waveform.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/waveform.tsx),
[`transcript-view.tsx`](https://github.com/jburnhams/strata-react/blob/main/src/components/transcript-view.tsx),
[`src/hls/`](https://github.com/jburnhams/strata-react/blob/main/src/hls/index.ts),
[`src/panorama/`](https://github.com/jburnhams/strata-react/blob/main/src/panorama/panorama-viewer.tsx)

Added in strata-react for strata-360, which reviews speech, music and 360 footage in small pieces
(strata-react issues #178 to #180, #185, #186). These are the decisions; they extend §3.16 (keys) and
the transport parts of the player.

- **Play a window of a file, one player at a time.** A window (`start`, `end` seconds) bounds playback:
  it starts at `start`, stops or loops at `end`, and a play from outside it begins at `start`. The bar
  and time show the window unless the whole file is wanted with the window marked. The end is checked
  every animation frame, not on `timeupdate` (about four a second), or a phrase runs on a quarter of a
  second into the next word. Say it ("Playing 0:12 to 0:15", polite). Rows that play a piece share one
  element and are `PlayWindowButton`s: named for what they play ("Play phrase 12"), a pressed toggle so
  the name does not change while a screen reader is moving down fifty of them. Starting one player
  pauses the others in its group; a group is a name or a region, and a player that unmounts leaves it.
  Speech is played with the pitch kept at every rate.
- **A waveform is for putting the playhead on something.** Peaks in (any length, resampled to the
  width) or a file decoded in the browser with progress and Cancel, never a frozen page. It is one
  slider, as the seek bar is, with the time as its value; zoom with `+` `-` `0` and Ctrl and the wheel,
  and the slider's range is the visible part so a click lands where it is drawn. Marks differ by line
  (thin, medium, heavy, dashed), never only by colour; beats are drawn but not listed for screen
  readers (400 is not a list) and are left out when they would crowd. Spans are tinted bands with a
  bar along the top and are named in a list. A selected range is Shift and drag, or `[` and `]` at the
  playhead, so it can be made from the keyboard.
- **A transcript is read in DOM order and followed by sight, not by announcement.** The heard phrase has
  a bar and `aria-current`, the heard word is underlined, not only tinted; the word is not announced
  as it changes (a polite sentence per phrase is an opt-in). Words are buttons that seek. Follow scrolls
  the heard phrase into view until the person scrolls away, and only a scroll that follows something
  they did counts (wheel, touch, a key, a scrollbar press), or a layout shift would turn it off for
  nobody. "Jump to now" names the phrase it goes to. Long transcripts are virtualised, which cannot keep
  an off-screen row mounted (React Aria's Virtualizer persists only the focused and dragged rows), so
  the button carries the heard phrase's text.
- **A stream the element cannot play is attached, not special-cased.** An engine takes the element over
  behind one small interface (attach, detach, reload), so the player, the compare grid and a 360 view
  all use streams the same way. Quietly retry what the engine can recover (a dropped connection, a
  decoder hiccup: three times, reset when a segment loads); after that the player's own load error
  appears in words, and Try again restarts at the time playback had reached. Chromium's native HLS
  failed on a growing playlist that hls.js plays, so the engine is preferred wherever it can run.
- **A source still being made is a state, not an ending.** Say "Still being made" with the app's own
  progress; the seek bar spans the whole length if it is known and draws the part that exists as ready;
  playing into the end of what exists waits (and says so, politely) and carries on when more arrives,
  and never calls the source ended.
- **A 360 view is a window, a canvas and a set of ways in.** Yaw, pitch and field of view in degrees
  are a controlled value; setting it from outside never animates (the app's aim modes are its own
  functions of time). Drag pans with the picture following the pointer, wheel and pinch zoom, arrows
  pan and `+` `-` `0` zoom and reset, and the direction is said in words ("Looking 40° right, 5° up")
  on the picture always and as a polite status only once the view has been still. Markers are DOM laid
  over it with a projection helper, so they are text and take focus. Without WebGL2 the flat picture
  is shown with the same controls and a line saying so, and the helper follows the flat drawing.
  Cost: one texture upload per drawn video frame, none for a still, and no drawing while off screen.

### 3.24 Conversation, pictures from a set, windows on a picture, sequences, trees and marking text

Findings from the third batch of strata-360's screens (strata-react issues #187 to #192).

- **A thread announces an ending, not a stream.** An answer that grows token by token is not a live
  region; one polite sentence says when it finished or failed. The log follows growth only while the
  person is at the bottom, and a Jump to latest returns them. A failed answer says what happened in the
  product's words with Try again on that turn, so a retry never adds a turn. The box sends on Enter,
  keeps Shift+Enter as a new line, ignores Enter during IME composition, and while an answer is on its
  way is disabled with the reason written under it, send becoming Stop.
- **Rich text from a model is a tree, never markup.** Bold, code, lists and http(s) or mailto links
  only; anything else is text. Known ids become buttons, longest first and never inside a longer word
  (`f-0412-b` before `f-0412`, no match in `f-04123`).
- **A viewer between a grid and a picture is a dialog with a set.** Arrow keys, Home and End step the
  set and say "3 of 40"; they stand aside when the zoomed picture pans with them, or a toolbar or field
  has them. Neighbours are fetched ahead, a failed picture says so in words, and focus returns to the
  tile that opened it. Details sit beside the picture from 720px and fold under it below that.
- **Editing a rectangle is a draft until kept.** A drag or key changes a draft shown at once; letting
  go, Enter or leaving keeps it, Escape throws it away, each keyboard change said in words with
  position and size. Aspect and bounds hold through pointer, keys and typed numbers alike. A from/to
  pair draws a line between the centres and a Watch that supplies the eased rectangle at `t`; with
  reduced motion it jumps to the end.
- **A gapless sequence changes two windows at once, so the cut is the control.** Each cut is a slider
  with its own room, supplied by the app, which knows the media behind each side; a drag stopped by the
  room says why in words and is kept once on release, and arrows step along the beat grid (Shift a
  second). A step that cannot move says why too. Both windows' new lengths are announced.
- **A tree that loads as it opens has four states per node**: loading, failed with Try again, empty
  with words, and loaded. The open set can live in the URL. A folder chooser is a tree, a path that is
  also editable text, Up, recents and a New folder field that shows the server's refusal under it.
  React Aria 1.22's `Tree` does not pass `hasChildItems` to its row hook, so a closed lazy branch needs
  a hidden placeholder child to be expandable by keyboard.
- **Marking text is selecting ids, not DOM.** A selection is a run of ids in the app's order, so a drag
  or Shift+click across rows a virtual list has unmounted still selects every word between. A mark has
  a role colour, an underline pattern, an icon in the toolbar and its meaning in text for a screen
  reader, never colour alone. The words are not tab stops; one region has a caret moved with arrows,
  Shift extends, and the caret word and selection size are announced. Single-key chords never fire while
  typing and are disabled, with the reason, while nothing is selected. Undo is the app's history
  command, named for the step.

### 3.25 Judging pairs: click to choose, autoplay and looping a clip

- **A click on the picture you prefer is an answer** (strata-react #201), the same one as the key and the
  button, so `pending` switches it off and a click during a save is dropped. The frame that already owns
  pan, band and double click decides: press and release within 4 px and 500 ms is a pick; movement is a
  pan; a double click zooms, so a pick waits 300 ms for a second click and is cancelled by one.
  Where a click is ambiguous there is no pick and the words say so: fade and difference blend both
  sides. Side by side picks the frame; swipe the side of the divider; blink the side showing. Hovering
  shows a pointer cursor, an outline on the side and "Click to choose A", in labels only when blind. The
  frame keeps its name and gets the choice as its accessible description. A screen where a click must
  only pan turns it off (`pick={false}`).
- **Judging a loop means it starts itself and repeats** (#203): autoplay begins when every video can play
  in step, muted because browsers refuse autoplay with sound (unless the person already chose a level),
  falls back to paused when refused, and starts again for each new pair from 0. Reduced motion keeps it
  off unless the app says "always". Looping the whole clip applies only while no range is set; a range
  the judge marks wins until cleared. Seeking and stepping still pause, and a pause stays a pause.
- Looked for and not found: a React Aria part for a click-versus-pan gesture; the frame measures it from
  pointer events.

### 3.26 Marked stretches in a player, the app's hold on it, and a player a phone wide

- **A stretch the app knows about is drawn on the bar and acted on once** (strata-react #207). Each kind
  has a behaviour: `auto` acts as playback reaches it (skip to its end, or mute it when the picture is
  wanted but the sound is not) and says so with Undo for a few seconds ("Skipped intro"); `ask` puts one
  button over the picture ("Skip intro ›", also on a key while it shows); `off` only draws it. Acting is
  on playback entering the stretch while playing, never while paused, so scrubbing inside one is not
  fought with. A stretch that was skipped, or let play after Undo, is not acted on again, a muted one
  gives its sound back on leaving (unless the person already moved the volume), and a source still being
  made waits until the end of a stretch exists before skipping into it. The memory is keyed by the spans'
  content, because apps write the array inline.
- **Colour is a status role per kind, never the only carrier**: the range is a named image with its times
  ("Recap, 0:40 to 1:10"), a tooltip, and the button names the kind in words. The same five tones as a
  chart's spans; a categorical palette is the product's to add.
- **The app's own thing over a playing picture needs a place and the state.** A video keeps a box of its
  own shape (the app's `aspect`, else its own, else 16:9 before the metadata loads) so nothing jumps and
  an overlay has a stable box; the overlay covers the picture only, never the controls, and what is in
  it is clickable and focusable. The player's state and requests are handed out through a ref (an object
  ref holds the latest without rendering again), so a chapter list or a comment list can seek without
  finding the element inside the player.
- **A control row has to shrink before it overflows** (#213): in a row a phone wide the volume slider's
  track gives way while the button and the readout keep their size; "100%" never runs past the edge.
- **A stream that is still being made starts at its beginning** (#208): the start exists and the edge
  moves, so the engine's "live edge" default is wrong for it; the app's own start time wins when given,
  and each way a stream fails is worded by the product.

### 3.27 Pictures from a third party, and a second look from roles

- **A picture from a host the app does not control fails in ways only the app can read** (strata-react
  #209): the first size does not exist for every item (a list of sources, tried in order), the host
  answers a missing item with a 200 and a small grey placeholder (the app sees each loaded image and can
  reject it, and the next source is tried as if it had failed), and a failed picture is a fact worth
  recording (told once, never for a record that has no picture). A decorative avatar whose name sits
  beside it has nothing to say when it is missing: it is presentation, not an image named "".
- **A region can have a second look from roles alone** (#210). Colours, radii, fonts and heights already
  were variables; the three fixed things that stopped more components being used that way become roles
  with today's value as the default: each type step's size, leading and weight, a button's side padding
  and icon size, and the next-page rows (the idle and loading rows drawn by the app, the hairline above
  them optional). What an app cannot replace stays the component's: the sentinel, the live region, focus
  moving to the first new item, and the failure row, so a second look cannot lose what makes a list of
  pages work.

### 3.28 A key the server keeps, a number nudged, choices that imply others, and a transcript with doubt

From strata-react #221 to #224 (strata-360's settings, clock, redo dialog and transcript screens).

- **A secret the server keeps is a state, not an input.** Not set, set, editing, saving, refused. While set
  and untouched there is no input in the page: a field showing dots shows the key's length, and an input
  that is merely hidden is still one a browser, an extension or a test can read. The field says "Set"
  and when, if the app knows, and offers Replace, Remove and Test. Editing is masked, with a Show toggle
  named for what it reveals ("Show API key"), `autocomplete="new-password"` so a password manager does
  not fill an unrelated login, and the value held in state only: never the URL, storage or a log. A field
  set and untouched reports nothing to its form, so submitting never overwrites the stored key with an
  empty one. Remove is irreversible and breaks whatever uses the key, so it is a confirm that names what
  stops working. A refused key puts the server's reason on the field and keeps the entry. The result of
  a Test is text with an icon beside the field, not a toast and not colour.
- **A value set a little at a time wants nudge buttons, and one that costs work wants a preview.**
  Step buttons ("−10 −1 −0.1 +0.1 +1 +10", each named "Subtract 1 s") repeat while held, after a
  delay, and stop at the limits. An app's suggestion is a row saying what and why in words with "Use
  this value"; it never changes the field itself, because the suggestion is a claim the person has not
  checked. When a change re-does work (re-timing every clip), changes are held: the preview says what
  would change, Apply (the view's one filled button, named for what it does, "Re-time clips") commits
  once, and Revert puts the saved value back. A per-keystroke commit would run the expensive thing for
  every digit typed.
- **A choice can imply others, and the person must see why.** Keep what they chose apart from what that
  brings in, and derive the second every time, so clearing the cause releases the effect. A key that
  something chosen implies is ticked and cannot be cleared on its own; the row says, in words, which
  chosen row it is included because of (an icon is not a reason), a refused clear is announced, and a
  summary line counts both ("12 results will be forgotten: 8 chosen, 4 that depend on them"), which is
  also the destructive confirm's description and the source of its count. In a lazy tree a parent is
  drawn from what has loaded under it (checked, mixed, empty), and ticking a branch never opened reads
  it, opens it and chooses everything under it, as if it had been expanded and then ticked (Jonathan,
  2026-11-13): a tick that chose only the parent's own key would leave rows the person cannot see
  unchosen while the box says they are in.
- **Doubt is shown by more than colour and can be worked through.** A doubtful word is dotted-underlined
  and named for a screen reader, its phrase says "Doubtful", the controls count the phrases and filter to
  them. A phrase's own mark ("Not sung") is a word on the row, set from a menu that offers the other
  marks and Clear. Correcting text is in place, from the keyboard (Enter on the row, F2 anywhere in it);
  the box keeps its own keys, Ctrl or Cmd+Enter saves, Escape cancels, focus returns to the row, and each
  outcome is announced. A hover card opens after a rest, on focus as well as hover, closes on Escape, is
  built only for the phrase it is open on, and is never the only way to what it shows.

### 3.29 Fitting a pair to the window, one toast region, and adopting a system a screen at a time

- **A frame's height limit is measured, not guessed** (strata-react #229). A fixed allowance for "the rest of the
  page" ("the window less 14rem") is wrong both ways as soon as a page has a header, a bar or a legend of its own: pictures
  of another shape make it scroll, and extra controls make it scroll more. Measure instead: the window from the top of
  the pair, less what the component draws besides its frames (taken from the bottom of its last child, not its height,
  which a stretched full-screen box would inflate), less what follows it in the page, shared between the rows of frames
  (side by side is one row, stacked is two), never under a floor a pair can still be told apart at (120 px). Re-measure
  when the page, the window or full screen changes, and stop when the number stops changing. The caller names only what
  cannot be measured (padding and gaps around it). In full screen the frame fills what the component's own controls
  leave, whatever the caller passed: a pixel value computed for the page is wrong there. The fixed guess stays for a
  caller that wants no measuring. Found while testing it: a picture that loads with no size (an SVG without one)
  must not set the aspect to NaN; keep the default shape.
- **Two of a one-per-app thing is caught, not doubled** (#230). A region that owns a queue (toasts) lets the first
  mounted draw and a second draw nothing, and says so in development, naming the fix. The usual cause is the same in an
  app and in a test: a layout draws the region and a helper (or a page) draws another. Making the test helper stop
  drawing one fixes only the test; the guard also catches the same mistake in the app.
- **A system whose reset breaks the app's own classes needs a way in that does not** (#225). A design system that clears
  the stock colour, size, radius, shadow and font names is right for a new product and an all-at-once cliff for a
  product with thousands of lines of the stock ones (even `@apply bg-stone-100` fails to build). Ship the same
  stylesheet without the reset, made from the same source so the two cannot drift, a list of what stock classes are
  left by file and line with the role that replaces each (and a flag that fails while any remain, to hold the line in
  CI), and say which import is for a new app and which for an existing one. The roles the components use must still
  be supplied, and the stock variables still exist in that mode, so an app can point its roles at the colours it has
  and keep today's look while it moves over. The list is a text scan, so it is a list to work from, not a proof.

### 3.30 A native tip on a button, and a chooser that knows what a folder is

- **A button refuses `title`; a tip is a tooltip** (strata-react #231). A native `title` has no keyboard focus, no
  touch, a long unstyled delay, and the primitives layer's button does not forward it, so a tip carried over from a
  plain button vanishes with nothing said. Passing it through would give the poor version; refusing it in the type (and
  warning once in development for an untyped caller) sends the author to the tooltip, which opens on focus as well as
  hover. A button whose only content is one symbol (`✕`) has no name from its text and warns the same way. A tooltip
  names or explains a control; it is never the only place the information lives.
- **A chooser says what a folder is, and why it cannot be chosen** (#233). What the server knows about a folder
  (already a project, holds camera files) is a word beside the name on a tint, never colour alone, and part of the
  row's name for a screen reader. The filled button is disabled for a folder that cannot be chosen and the reason is
  beside it in words, tied to it with a description, because a disabled button that does not say why is a dead end;
  its label names the action ("Create project here"). A folder that already is the thing wanted is chosen when it is
  opened instead of entered (its subfolders are not offered), decided by the app; and a listing may carry a sentence
  about the folder itself ("3 camera files here") shown under the tree, so the person sees what the rule saw.

### 3.31 A book read as a book, tiles that open, boxes on a picture, turning a scan, and a range behind a line

Findings from strata-scan (scanned books) and strata-360 (strata-react issues #237 to #244).

- **Tiles that open and tiles that choose are two components with one layout.** A press on a chosen-from grid
  toggles, and its box and name assume a bulk action; a press on a grid of pages goes to the page. Each tile is a link
  (a route in the app, with the router's basename, or a URL) or an action, never neither, so one that does nothing
  cannot be written. A tile is named by one sentence ("Page 14, 4, 368 words, needs a look"), not by whatever its
  pieces read; a status that matters sits on the picture's corner as a word on a tint; arrows move in two
  dimensions; the loading shape is the same grid of picture boxes. Both grids draw from 100 tiles virtualised.
- **Read-only boxes on a picture are one layer in the picture's pixels, linked to a list.** Hundreds of OCR lines or
  detected faces are one SVG drawn in the picture's units and fitted the way `object-fit: contain` fits the picture,
  so a box lands on its pixels in a frame of any shape and zooms with it; outlines keep their width at any zoom, and
  are outline only so the type stays readable. Tone is a status role (unsure lines in the warning role), never the
  only cue: each box is named by its words and confidence. The picture and its transcript are one object: pointing
  at or choosing a line lights its box, choosing a box scrolls the list to its line and focuses it. The keyboard goes
  through boxes in reading order (rows top to bottom, left to right), not the order the data came in.
- **A book is read in spreads, and a page has two names.** A viewer for scanned pages is not a photo set: its unit is a
  spread, the first page stands alone on the right as a printed book opens, and below a width it is one page. The
  scan's position ("22") and the printed label ("12", "iv") both name a page, the position reads "Page 22 (12) of
  44", and go-to takes either, trying the printed label first because that is what is in front of the reader. Paging
  is arrows, Page Up and Down, Home and End and a click on a page's outer half (the zone outlined and named under the
  pointer); a zoomed page keeps the arrows for panning. The position is in the URL and said in a polite region, a
  thumbnail strip carries a badge on the pages that need a look, and a text pane sits beside the pages. No page-curl:
  turning a page is done hundreds of times a session (`../ux-character.md`).
- **An open item is in the URL, and the history is not a flip book.** Opening a picture pushes an entry so Back closes
  it; stepping through the set replaces the entry so Back leaves the viewer instead of walking back through forty
  pictures. A link opens on that item and an id the set does not have is closed.
- **Turning a scan is done in the browser, in the turned canvas's units.** A small skew (0.2° to 2°) is the common
  correction and is fiddly with a number alone, so the control is a slider in tenths of a degree with a typed value,
  two quarter turns and Level, and level lines to line text up against. The picture is drawn turned (a CSS rotation,
  no round trip per degree) on a canvas that holds it, and every window is in that canvas's units, so the editor, the
  server and the app agree. The convention to match on the server: degrees, clockwise, about the centre, canvas grown
  to the turned bounding box. Windows turn with the picture, centre rotated and size kept, held inside the canvas.
- **A spread of two windows has a gutter between them.** Moving the gutter resizes both; Split into two and Make one
  are actions on the editor (cut down the middle, join to the union), and the gutter is a separator with arrows.
- **A downsampled line keeps its extremes.** A series reduced to a point per stretch loses the highest and lowest
  reading, which is what an elevation or speed track is for, so each point may carry them as a flat pale area behind
  the line in the series colour. The axis widens to hold them, and they are said wherever the reading is: the
  readout ("2 km: 340 m (310 m to 372 m)"), a column of the table and a key entry. The threshold band keeps its own
  name; this is the range.
- **A box that is not ready says why, in the product's words.** A composer disabled because the footage is still
  being indexed shows the reason under the box and ties it with a description; the reason is the prop, so a bare
  `disabled` cannot be written.
- **A visual test serves the build as production does.** An app built with relative asset paths gets a base tag from
  its own server; a file server that does not makes `/books/1` ask for `/books/assets/...` and paint an empty page.
  The runner adds the tag, and fails a shot whose script or stylesheet did not arrive, so an empty page can never be a
  baseline.

### 3.32 A view toolbar, a photo grid, a tree with a current row, and a job that starts from a button

Findings from strata-stills (a photo browser, a job queue) and strata-scan (strata-react issues #245 to #250).

- **How a set is looked at is one toolbar, and it is remembered.** Sort, group, tile size, picture shape, grid or
  list and a text filter are the same six controls on every browsing screen, so they are one component over one
  hook. It is a toolbar (one tab stop, arrows between the controls); on a phone everything but the filter folds into
  a "View" popover. Short lists of words are native selects. The direction button is named from the sort key's own
  words ("Newest first", "Oldest first"), because "Ascending" says nothing about dates. The filter shows its count
  ("82 of 140") in a polite region. State is kept where the person left it (local storage, inside try/catch) and,
  when the screen is linked to, in the address (`?sort=taken-desc&group=hour&size=180`), which wins over storage.
  The filter text is never stored: a filter that is still on tomorrow reads as a list that lost rows.
- **Sorting is natural, with nulls last both ways, and stable.** "IMG_2" comes before "IMG_10"; a picture with no date
  goes to the end whichever way the dates run; ties keep the order they came in.
- **A slider in a toolbar keeps its own Home and End.** The toolbar's Home and End go to the first and last control,
  which took them from a size slider; a range input is treated as a typing target is.
- **A photo grid zooms by pixels, keeps the place, and chooses like the file manager.** Tile size is a continuous
  width, changed from the toolbar slider, `+` and `-` and Ctrl/Cmd+wheel (also a trackpad pinch), and the scroll
  position is held as a share of the content so the picture in view stays in view. A click toggles in a bulk-action
  screen; where the work is looking, a click chooses one, Ctrl/Cmd adds, Shift extends, Ctrl/Cmd+A chooses all,
  Escape clears and a double click or Enter opens. Groups have sticky headings, a box that is mixed when part of the
  group is chosen, and a fold. A choice the filter hides stays chosen and is counted in words, with a way to clear
  just those. A tile that cannot be chosen says why on the tile.
- **Groups are rows of one virtualised grid.** A group's heading is a full-width row in the same list as the tiles
  (a layout that lets the grid work out its columns, then starts each group on a new row), so a grouped grid is
  virtualised like any other and arrow keys cross headings. The heading at the top stays there while its tiles
  scroll; Enter on it folds the group and Space chooses it. Not decided yet: a justified layout for pictures of
  their own shapes, a marquee, touch pinch, and the next heading pushing the stuck one up as it arrives.
- **A tree has a current row beside the ticked ones.** "The folder I am looking at" and "the folders I have ticked"
  are different things on one screen: a press on a name moves the current row (highlighted, `aria-current`), the box
  ticks. Counts sit right-aligned in the row, a badge is a word on a tint, both are part of the row's name; children
  are sorted once for the tree, not in every read; a deep link opens the ancestors and scrolls to the row. Ticking
  a branch that has not been read does not open it when the app can say what is under it: the live region says "2019
  and its 91 folders" and the keys are chosen, so a year is never read just to be ticked.
- **A button that starts a job is busy until the server answers, then the job is somewhere else.** The button is
  disabled and busy (and says so to a screen reader) for the request only; the answer is a toast that says it is
  queued, with a link to the jobs page, and a second when it finishes. A failed start stays on the button as "Try
  again", with no toast. A progress line reads "12 of 40 done, 28 remaining · the item it is on", one shape for
  every job. A row's action is the same button, ghost and small.
- **A toast with nowhere to appear is a development error.** Calling the toast with no region mounted warns once,
  naming the fix; mounting a region for the app would double the toasts of apps that already have one.
