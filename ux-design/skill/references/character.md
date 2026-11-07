# Character: playful without stock whimsy

Use after the direction is chosen (SKILL.md step 3) and before building. Research and
sources: `ux-character.md` at the root of the ux-research repo.

Character is the product's own world let through in a few chosen places. It is placed
by **how often** a person meets the thing, sized by **what is at stake**, and checked
by the **swap test**: if a neighbouring product could ship it unchanged, it is stock.

## 1. Write it down (DESIGN.md `## Character`)

1. **Sentence**: what the person should feel, and why that belongs to this product.
2. **Voice** as three or four this-but-not-that pairs. The second half names the slop
   version: "plain, not cute"; "exact, not approximate"; "warm, not chirpy".
3. **Words**: the subject's jargon, units and phrases, and the app words they replace
   ("the to-fire shelf", not "your items").
4. **Behaviours**: add 3–5 to the subject inventory. What physically happens, how it
   sounds or moves, the rituals, what experts notice. Behaviours become motion, data
   encodings and moments; nouns only become palettes.

## 2. Place it by frequency

| How often | Budget |
|---|---|
| 100+ a day (shortcuts, navigation, typing, command menu) | None. Instant |
| Tens a day (buttons, toggles, hover, rows, the screen's own load) | Near-imperceptible: 100–160 ms, small (a 2% press, a colour change) |
| Occasional (dialogs, sheets, toasts, a save) | Ordinary craft: 150–250 ms, no overshoot, said plainly ("Saved") |
| Rare and earned (first use, finishing something that took effort, a milestone, recovery) | The moment: one per flow, from the subject, proportional to the stakes, once |
| Read, not used (voice, the signature, data encodings) | Character at rest: no motion, no cost |

On Operate surfaces almost all character belongs in the last row.

## 3. Channels by mode

| Channel | Operate | Read | Persuade, Experience | Slop when |
|---|---|---|---|---|
| Voice | Subject words in labels, empties, errors; straight-faced | A narrator is welcome | Full voice | It jokes, cheers, or fits any product |
| Signature | One: how the main data is drawn | The reading furniture | One committed idea | There are three |
| Colour | Full strength only where it is a fact (heat, depth, a team's kit) | Quiet | From the subject | It encodes nothing |
| Type | One family; character in figures and weights | A text face with personality | Display face, once | Overused faces; costume faces |
| Motion | Feedback and the moment only | Almost none | One authored moment | It plays on load, loops or bounces by reflex |
| Illustration | Only drawings made from the person's data | Diagrams | From the subject | It comes from a kit |
| Sound | Off; opt-in for physical feedback | Off | Opt-in | It plays without consent |

## 4. Make the moment

Say what happened (past tense, with its object). Say what happens next and when. If
the subject has a picture of the result, draw it from the person's data, and animate
only the part that is theirs, once, hard ease-out, no overshoot, instant under reduced
motion. Move focus to the result. It should answer the question the person has next.

## 5. Never

- Confetti or celebration on a routine action; anything that celebrates on a dashboard.
- Stock whimsy copy: "Oops!", "Whoops", "Uh-oh", "Yay!", "Woohoo", "You're all set!",
  "Houston, we have a problem", "It's quiet in here", "Hang tight", "working our magic".
- Jokes on errors, money, privacy, health or lost work. "Something went wrong" is not
  neutral either: say what failed and what to do.
- Stock illustration kits (unDraw, Humaaans, Open Peeps, Storyset, Blush, generic
  Lottie), mascots that talk on every screen, emoji as personality.
- Loops, shimmer, float, wiggle, hover-lift on every card; bounce by reflex.
- Sound with no off switch; staged delays before a flourish; streaks and badges on a
  tool nobody asked to gamify.
- Turning "fun" into pastel blobs, rounded-everything and "bold colors".

## 6. Check

1. Swap test: could a neighbouring product use it unchanged?
2. Hundredth-time test: still welcome the hundredth time?
3. Bad-day test: still helpful to someone whose work just failed?
4. Remove test: is the screen slower or less clear without it?
5. `slop-lint` (`confetti`, `stock-whimsy`, `stock-illustration`, `vague-error`,
   `sound-without-control`), reduced motion, mute, keyboard, a 390px phone.
