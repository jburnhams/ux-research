# Character: the layer that makes a Plinth product its own

Plinth ships no look, and until 2026-11-07 it also shipped no way to have a
personality: every rule said what to leave out. This layer adds the positive half. It
is short on tokens and long on placement, because on a work tool most character lives
in words and in what the data is drawn as, and the rest is a question of *where*.

Research and sources: [`../ux-character.md`](../ux-character.md). The example:
[`examples/DESIGN.md`](./examples/DESIGN.md) (Character section),
[`examples/screens/booked.tsx`](./examples/screens/booked.tsx).

## 1. What the library ships and what the product supplies

| Piece | Owner | Where |
|---|---|---|
| The frequency budget (§3) and the checks (§6) | library | this file; `slop-lint` playful rules |
| `press`, `enter-moment`, `--motion-press`, `--motion-moment`, `--ease-moment` | library | [`tokens.md`](./tokens.md) §9, §13; [`examples/app/globals.css`](./examples/app/globals.css) |
| `Done`, the completion moment | library | [`components.md`](./components.md) §3.15 |
| `LineChart` `colourScale`, for colour that is a fact of the subject | library | [`components.md`](./components.md) §3.8 |
| The character sentence, the voice pairs, the subject's words | product | DESIGN.md `## Character` |
| Subject colours (the example's `--heat-*`) | product | `globals.css`, with reasons in DESIGN.md |
| The signature, the moments and their figures | product | screens, product components (the example's `ShelfFigure`) |
| Allowances (an overshooting spring for a bouncy subject, opt-in sound) | product | DESIGN.md and `.sloplintrc.json`, same reason in both |

## 2. DESIGN.md gains a Character section

```markdown
## Character

- **Sentence**: what the person should feel, and why that belongs to this product.
- **Voice**, this but not that: three or four pairs; the second half names the slop
  version ("plain, not cute"; "exact, not approximate").
- **Words**: the subject's own terms, units and phrases, and the app words they replace.
- **Signature**: the one thing on the main screen that could only be this product.
- **Moments**: each rare, earned moment, what it shows, and what it is made from.
- **Not here**: what was considered and left out, and why.
```

The template is in [`../ux-design/skill/assets/DESIGN.template.md`](../ux-design/skill/assets/DESIGN.template.md).

## 3. The frequency budget

From Emil Kowalski's frequency gate, Rauno Freiberg's "animate less for actions
performed constantly" and Impeccable's "keep the response satisfying after the
hundredth use", with a row added for character that costs no time:

| How often | Budget | Plinth gives you |
|---|---|---|
| 100+ a day (shortcuts, navigation, typing, the command menu) | none | instant state changes |
| Tens a day (buttons, toggles, hover, rows, the screen's own load) | near-imperceptible | `press`: `scale: 0.98` over 100ms; colour transitions at 200ms |
| Occasional (dialogs, sheets, toasts, undo, a successful save) | ordinary craft | 150–350ms, no overshoot; "Saved" in the button |
| Rare and earned (first use, a finished booking or submission, a milestone, recovery) | the moment | `Done`, a figure from the person's data, `enter-moment` once |
| Always, read not used (voice, signature, data encodings) | character at rest | `colourScale`, subject colours, the product's words |

On an Operate product almost all character belongs in the last row. A dashboard is
read many times a day by everyone; it gets a signature and a voice, never a
celebration.

## 4. The moment, built

1. Find the flow's rare ending: the thing a person did that took effort before they
   ever opened the app (the pots they made, the trip they planned, the report they
   wrote).
2. `Done` with a past-tense `title` naming the object, and a `next` that says what
   happens now and when.
3. If the subject has a picture of the result, draw it from the person's data: their
   pieces on the shelf, their seat in the hall, their route on the line. Mark the part
   that is theirs with `enter-moment`. A drawing that is the same for everyone is an
   illustration, and Plinth has no slot for illustrations.
4. Make it answer a question the person has next (in the example: where do my
   pieces go, and do they fit). If it answers nothing, cut it.
5. Reduced motion makes it instant; focus lands on the heading; nothing loops or
   plays a sound.

## 5. Voice in components

Components already require the words (`Status` needs a label, `AsyncButton` needs
pending and done labels, `EmptyState` needs a title, `DataView`'s error needs a
message). The voice decides what goes in them:

| Slot | Stock | In the subject's voice (kiln room) |
|---|---|---|
| Empty title | "Nothing here yet" / "It's quiet in here" | "All three kilns are cold" |
| Error message | "Oops! Something went wrong" | "Kiln 2's controller has not reported since 13:50, so these readings are 20 minutes old. The panel by the kiln-room door shows the live temperature." |
| Done title | "You're all set!" | "Booked: 6 pieces in kiln 2's glaze firing on Tuesday" |
| Pending label | "Hang tight…" | "Booking…" |

Straight-faced is the default (Mailchimp: "If you're unsure, keep a straight face").
Humour is a product decision recorded in DESIGN.md, never on errors, money, privacy,
health or lost work.

## 6. Checks

Mechanical, in `npm run check` (`slop-lint`, default rule set):

| Rule | Category | Catches |
|---|---|---|
| `confetti` | slop P1 | confetti and celebration libraries |
| `stock-whimsy` | slop P1 | "Oops", "Whoops", "Yay", "You're all set!", "Hang tight", "working our magic", "It's quiet in here" and kin |
| `stock-illustration` | slop P1 | unDraw, Humaaans, Open Peeps, Storyset, Blush, LottieFiles |
| `vague-error` | quality warn | "Something went wrong", "An error occurred" |
| `sound-without-control` | quality warn | `new Audio`, `use-sound`, `howler` with no mute or setting in the file |
| `emoji-icon`, `bounce-easing`, `pulse-dot` | slop | already there |

By a person, once, on the render:

1. **Swap test**: could a neighbouring product use it unchanged?
2. **Hundredth-time test**: still welcome the hundredth time?
3. **Bad-day test**: still helpful to someone whose work just failed?
4. **Remove test**: is the screen slower or less clear without it?

## 7. Known limits

- The example shows the calm end of the range (a shared work tool). A product whose
  subject is itself playful would show the dial turned up, and would test whether the
  allowances in §1 are enough. Not built yet.
- `Done` is the only moment component. First-use and recovery moments are described
  here but have no component; they may not need one.
- The playful lint rules are word lists and import names. They catch the stock
  versions; whether a product's own touch passes the swap test is a judgement.
