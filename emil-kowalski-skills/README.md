# Emil Kowalski's skills (motion and interface craft)

- **Type**: Agent skills (Markdown), 20+ skills on animation, interface polish, native and React Native work
- **Licence**: MIT (`LICENSE` copied alongside)
- **Source**: https://github.com/emilkowalski/skills, `main` @ `c8a7962` (2026-11-04)
- **Retrieved**: 2026-11-07

Emil Kowalski built Sonner (toasts) and Vaul (drawers). The repo was listed as
"emil-design-eng" among the candidate skills in [`../web-articles/`](../web-articles);
it was read for the character pass ([`../ux-character.md`](../ux-character.md)).

## Files stored

| File | What it is |
|---|---|
| `animate.SKILL.md` | Building one animation: should it animate at all (the frequency table), named purpose, cheapest tool, properties, easing and duration tables, interruption, reduced motion and hover gating, a "never ship" table |
| `find-animation-opportunities.SKILL.md` | A read-only search for places that should animate, behind a four-question gate (frequency, purpose, speed, function); "expect to reject most candidates" |
| `emil-design-eng.SKILL.md` | The general philosophy: taste is trained, unseen details compound, the Sonner principles, motion matched to a component's personality |

Not stored: the other skills (`review-animations`, `improve-animations`, `animate-expo`,
`apple-design`, `write-swift`, `break-ui`, `choreograph`, `animation-vocabulary` and
others), which go deeper on implementation than this repo needs.

## What is distinctive

1. **Frequency decides whether anything moves.** 100+ times a day: "No animation.
   Ever." Tens of times: near-imperceptible. Occasional: standard. Rare or first-time:
   "The delight budget lives here." Keyboard-initiated actions are "a disqualifier, not
   a judgment call" (Raycast has no open/close animation). This is the backbone of the
   frequency budget in [`../ui-library/character.md`](../ui-library/character.md).
2. **Delight is a named purpose with a tier.** The purposes are feedback, spatial
   consistency, state indication, preventing a jarring change, explanation and
   delight, and delight is "allowed *only* at the rare/first-time tier".
3. **Exact values, not adjectives.** Easing curves (`cubic-bezier(0.23, 1, 0.32, 1)`
   for UI ease-out), durations by element (press 100–160ms, dropdowns 150–250ms,
   "UI animations stay under 300ms"), never `scale(0)`, never `ease-in` on UI,
   transitions rather than keyframes for anything triggered rapidly. Plinth's
   `--ease-moment` and `--motion-press` come from here.
4. **Restraint as the default posture.** "An opportunity finder that suggests motion
   everywhere is worse than useless."
5. **Bounce is allowed, sparingly.** "Keep bounce at 0.1–0.3, and avoid bounce in most
   UI: reserve it for drag-to-dismiss and playful interactions." This repo keeps
   overshoot out of Operate components and treats it as a product allowance
   ([`../ux-character.md`](../ux-character.md) §3).
