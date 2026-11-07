# Character without slop: making an interface playful while function stays first

Asked on 2026-11-07: the docs and library here work, but the result is boring. How do
we make it interesting and playful, keep the primary focus on function, and still
avoid the AI-slop look? This doc answers that from the sources, says how strong the
evidence is, and gives the procedure now used in [`ux-design/`](./ux-design) and
[`ui-library/`](./ui-library) ([`ui-library/character.md`](./ui-library/character.md)).

**The answer in one paragraph.** Character is not a layer of decoration added at the
end; it is the product's own world (its materials, words, numbers and rituals) let
through in a few chosen places. Where it goes is decided by **how often a person meets
that thing**: nothing on actions done a hundred times a day, near-imperceptible
feedback on actions done tens of times, ordinary craft on occasional ones, and the
whole delight budget on rare, earned moments (first use, a finished piece of work,
recovery from a failure). How much it does is decided by **what is at stake**. And
it is checked by a **swap test**: if a neighbouring product could ship the same touch
unchanged, it is stock whimsy, which is the corpus median of "playful" in the same way
indigo is the median of "modern".

## 1. Why the current output reads as boring

Reading our own docs against the request, four causes, all deliberate at the time:

1. **The rules only subtract.** The tell registry, 46 lint rules and the audit all say
   what to remove. [`ux-design/skill/SKILL.md`](./ux-design/skill/SKILL.md) step 6.4
   already warns that "removal is not the fix", but nothing said what to add on an
   Operate surface except "one signature move".
2. **Every dial on Operate was set to its calm end.** Motion conveys state and nothing
   else; the accent is asked for, not defaulted; one type family; low-chroma primary
   (the example's celadon is at chroma 0.038); no illustration slot in `EmptyState`
   "on purpose"; Expressive motion "not adopted". Each choice is right for a screen
   used all day; together they leave no place for character to live.
3. **The subject reached the theme but not the behaviour.** In the kiln-room example the
   co-op's world shows up as two seed colours and a chart. Its copy, its moments and its
   motion are those of any tool.
4. **Mode was read as a ban rather than a budget.** Impeccable's Operate guidance says
   "delight is saved for moments, not pages" ([`impeccable/reference/operate.md`](./impeccable/reference/operate.md)).
   We kept the first half (not pages) and dropped the second (moments).

So the fix is not to loosen the anti-slop rules. It is to add the positive half they
were missing: where character goes, what it is made of, and how to tell it from the
stock version.

## 2. What the evidence says

| Claim | Source | Strength |
|---|---|---|
| Delight sits on top of function, reliability and usability; "a product can be delightful only if it is usable". Surface delight (animation, jokey microcopy, imagery, sound) "can backfire" on a weak product; deep delight is flow, "the interface behaves like a surgeon's knowledgeable assistant" | Therese Fessenden, NN/g, "A Theory of User Delight" (2017), building on Aarron Walter's *Designing for Emotion* hierarchy | **B**: a practitioner model, widely used, not an experiment |
| People rate better-looking interfaces as easier to use | Kurosu and Kashimura (CHI '95 companion, 26 ATM layouts, 252 people); Tractinsky (CHI '97) replicated it in Israel; Tractinsky, Katz and Ikar (2000) found aesthetics changed *post-use* ratings of usability while actual usability did not | **A−** for perceived usability, read from abstracts and summaries, not the papers. It is about perception: it does not show that attractive interfaces *are* easier, and it cuts both ways (it can hide real problems in testing) |
| Making key elements bigger, higher and more contrasting made them **up to four times faster to find**; expressive styling was rated more playful and preferred, but hurt usability where it broke familiar patterns, and "a strong minority" preferred calmer versions | Google's Material 3 Expressive research, analysed in [`ux-material-3.md`](./ux-material-3.md) §1 | **A−** for the speed result (eye tracking, 10 apps); **C** for the preference figures (designs were tuned toward the rated words) |
| Remembered experience is weighted toward its most intense moment and its end | Kahneman, Fredrickson, Schreiber and Redelmeier (1993), the cold-water study, and later colonoscopy work | **A** in the lab for pain; **extrapolated** when applied to interfaces. Not re-read in this pass |
| People remember the bad more than the good | NN/g, citing negativity bias | **B** |
| Humour in error messages helps | No controlled study of interface error copy was found. The nearest is a 2025 study, seen only as a summary, reporting that people forgave an AI's mistakes more readily when it used self-deprecating humour; practitioner threads report the opposite experience too | **C**, second-hand. Treat jokes on errors as unproven and risky |
| Novelty wears off: "a charming, delightful effect becomes mundane and annoying surprisingly quickly" | Josh Comeau (2025); Emil Kowalski's frequency table; Rauno Freiberg ("animate less for actions performed constantly") | **B**: three experienced practitioners agree; no study |

Net: the evidence supports *some* expressiveness (it changes how usable and memorable
a product feels, and size and contrast changes really do speed people up), supports
spending it on peaks and endings, and does not support jokes where something has gone
wrong. Everything about *where exactly* to put it is practitioner judgement.

## 3. What the sources say, compared

| Source | Stance | Distinctive idea |
|---|---|---|
| **Impeccable `delight`** ([`impeccable/reference/delight.md`](./impeccable/reference/delight.md), Apache-2.0) | "Delight is not a layer of generic whimsy; it is product character revealed through a useful interaction, a humane response, or an unexpectedly considered detail" | One **delight thesis** per product, in a sentence. Moments by emotion: success, waiting, empty and first use, error and recovery, repeated interaction, discovery. Verify: "specific enough that a neighboring product could not use it unchanged"; "the interface remains fast and obvious without the flourish" |
| **Impeccable `bolder`** ([`impeccable/reference/bolder.md`](./impeccable/reference/bolder.md)) | "The reflex answer, reaching for more effects, is the opposite of bold" | "Amplify what the system already owns"; "If every element got louder, the section got flatter" |
| **Emil Kowalski's skills** ([`emil-kowalski-skills/`](./emil-kowalski-skills), MIT) | Restraint first: "sometimes the best animation is no animation" | The **frequency gate**: 100+ a day, never; tens a day, near-imperceptible; occasional, standard; rare or first-time, "the delight budget lives here". Named purposes (feedback, spatial consistency, state, preventing a jarring change, explanation, delight) and "Delight: allowed *only* at the rare/first-time tier". "A playful component can be bouncier. A professional dashboard should be crisp and fast" |
| **Rauno Freiberg**, "Invisible Details of Interaction Design" (2023) | Character through physics and metaphor rather than decoration | Motion carries the gesture's momentum; frequent actions get less motion; **fidgetability** (repeatable, satisfying interactions) flagged honestly as intuition, not research |
| **Josh Comeau**, "Whimsical Animations" landing-page breakdown (2025) | The most maximal source: sparkles, hidden synth, sound, fireworks | "A crucial ingredient for whimsy is *novelty*": copy-pasted effects fail because people have seen them. Sound only for short responses to actions; the continuous fireworks are silent. No reduced-motion guidance in the piece |
| **Mailchimp content style guide** (CC BY-NC 4.0, notes only) | Voice stays, tone moves with the reader's state | "Our humor is straight-faced, subtle, and a touch eccentric"; "forced humor can be worse than none at all"; "If you're unsure, keep a straight face"; "it's always more important to be clear than entertaining". The older guide's **this-but-not-that** pairs ("fun but not childish", "clever but not silly") |
| **Material 3 Expressive** ([`ux-material-3.md`](./ux-material-3.md)) | Expressive by default, Standard for utilitarian products | Expressiveness is mostly size, shape, colour contrast and springs on *hero moments*; "No amount of expressive design will beat basic functionality" |
| **anti-ai-slop** ([`anti-ai-slop/web-ui.md`](./anti-ai-slop/web-ui.md)) | Empty and error states "are the highest-yield 'personality injection' points" | Personality on the unhappy paths |
| **anti-slop-design** ([`anti-slop-design/15-product-types.md`](./anti-slop-design/15-product-types.md)) | Personality as axes, set by product category | "A pension provider: playful, bouncy, illustrated: 'I would not put my retirement here'"; health products: "playful motion [is] actively harmful when the reader may be frightened or unwell" |
| **Vercel WIG** ([`vercel-web-interface-guidelines/`](./vercel-web-interface-guidelines)) | "Animate only to clarify cause/effect or add deliberate delight" | Delight as a named, deliberate exception |

Where they agree, which is most of it:

1. **Function first, then character.** Every source puts usability underneath.
2. **Character comes from the product, not a catalogue.** Impeccable's swap test,
   Comeau's novelty, `bolder`'s "amplify what the system already owns".
3. **Frequency decides placement.** Emil, Rauno and Comeau independently; Impeccable's
   "keep the response satisfying after the hundredth use".
4. **Proportion to consequence.** Impeccable: "routine saves should simply feel
   certain"; major milestones can expand.
5. **Never on loss.** No jokes about money, privacy, blocked work or (here) a cracked
   pot.

Where they disagree, and how it is resolved here:

| Question | One side | Other side | Resolution |
|---|---|---|---|
| Sound | Comeau: press and release sounds, slider ticks | Impeccable: never "without consent or ignore mute settings"; Emil and Rauno silent on it | Off by default on Operate; opt-in, short, tied to an action, never the only feedback. `slop-lint` warns on sound with no off switch |
| Empty-state illustration | anti-ai-slop: highest-yield place for personality | Plinth's `EmptyState`: "no illustration slot exists, on purpose" | Keep the empty state text-first (it must teach the next action). Personality goes into its *words*, from the subject ("All three kilns are cold"). A picture is allowed only on a completion, drawn from the person's data (see §5) |
| Bounce | Emil: springs with bounce 0.1–0.3 for "playful interactions"; Material Expressive springs | Our tell registry: overshoot is dated; `slop-lint bounce-easing` | Still no overshoot on Operate components. A product whose subject *is* bouncy (a children's game, a trampoline park) records an allowance in DESIGN.md with that reason |
| Expressive by default | Material | Impeccable Operate, this repo | Unchanged: Standard on Operate. Expressiveness is spent on moments, not raised everywhere |

## 4. Playful slop: the precedent and the next wave

"Make it playful" is an adjective, and [`ux-mood-to-theme.md`](./ux-mood-to-theme.md)
already showed what adjectives do: they name a region, and a model produces the
centre of it. Google Stitch's own prompt enhancer maps "fun" to "vibrant, playful,
with rounded corners and bold colors" ([`google-stitch-skills/enhance-prompt.SKILL.md`](./google-stitch-skills/enhance-prompt.SKILL.md)),
and its `taste-design` skill asks for "perpetual micro-interactions" where "every active
component should have an infinite loop state (Pulse, Typewriter, Float, Shimmer)"
([`google-stitch-skills/taste-design.SKILL.md`](./google-stitch-skills/taste-design.SKILL.md)).
That is the playful median, written down.

There is a precedent for what happens next. **Corporate Memphis** (also called the
Alegria style, after the illustration system Buck and Xoana Herrera made for Facebook
in 2017) was a deliberately friendly, playful style that spread across tech until it
was criticised as "generic, lazy, overused" and as cheerfulness covering for the
company (Wikipedia's summary of the criticism; AIGA Eye on Design and Protocol pieces
argue the backlash is partly unfair to flat illustration and that it persisted
because companies undervalued illustration). Whatever the merits, it shows the
mechanism this repo keeps finding ([`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §2):
a remedy adopted wholesale becomes the next tell. Wave 4 in our registry (grain,
sketchy SVG, hand-drawn type as an "anti-AI" reflex) is the same thing happening to
"make it look human".

The playful tells, added to [`ux-design/skill/references/tells.md`](./ux-design/skill/references/tells.md):

| Tell | Why it reads as stock | Detect |
|---|---|---|
| Confetti, fireworks or a full-screen celebration on a routine action (save, send, sign-in) | Celebration out of proportion to the effort, from a library every product can install | `slop-lint confetti` |
| Stock whimsy copy: "Oops!", "Whoops", "Uh-oh", "Yay!", "Woohoo", "You're all set!", "Houston, we have a problem", "Looks like you're lost", "It's quiet in here", "Hang tight", "working our magic", "Reticulating splines" | Could be in any product; on errors it makes light of someone's problem | `slop-lint stock-whimsy` (and `vague-error` for "Something went wrong") |
| Stock illustration kits: unDraw, Humaaans, Open Peeps, Storyset, Blush, generic Lottie files; faceless purple people with big limbs | The Corporate Memphis lineage | `slop-lint stock-illustration` |
| Emoji as personality in interface text | Already a tell (`emoji-icon`) | `slop-lint emoji-icon` |
| A mascot that talks on every screen | Reads as a brand exercise; usually says nothing the screen does not | judge |
| Bounce, wiggle, float or shimmer on things that are not moving for a reason; perpetual loops | The Stitch "infinite loop state" instruction; frequent motion grows tiresome | `slop-lint bounce-easing`, `pulse-dot`; judge |
| Hover lift on every card | Already a tell ([`ux-slop-taxonomy.md`](./ux-slop-taxonomy.md) §3e) | judge |
| Sound with no off switch | Fails people in shared spaces and screen-reader users | `slop-lint sound-without-control` (quality) |
| Fake waiting jokes and staged delays before a flourish | Impeccable: "Never fake work or delay completion to stage a flourish" | judge |
| Pastel blobs, rounded-everything and "bold colors" because the brief said "fun" | The adjective mapped to its region's centre | `palette.mjs` warns on tell clusters; judge |
| Streaks, badges and points on a tool nobody asked to gamify | Imported from consumer apps; turns work into a chore chart | judge |

What these have in common is the test that catches them: **could a neighbouring
product use it unchanged?** If yes, it is stock.

## 5. The procedure

Added to the skill as step 3b ([`ux-design/skill/references/character.md`](./ux-design/skill/references/character.md))
and to the library as a layer ([`ui-library/character.md`](./ui-library/character.md)).

### 5.1 Write the character sentence and the voice

- **One sentence**: what the person should feel and why that feeling belongs to this
  product (Impeccable's "delight thesis"). The kiln room: "like the kiln team is looking
  after your work: exact about heat and time, and pleased with you when you have made
  something."
- **Voice as this-but-not-that pairs**, three or four (Mailchimp's form): "plain, not
  cute"; "exact, not approximate"; "unhurried, not chirpy". The second half of each
  pair names the slop version, so the pair is checkable.
- **The subject's own words**: list the jargon, units and phrases of the world
  ("bisque", "cone 6", "safe to open", "the to-fire shelf"). App words ("items",
  "tasks", "content") are where voice goes to die.

### 5.2 Inventory behaviours, not just objects

The existing inventory step (8–12 facts) mostly yields nouns, which become colours.
Add three to five **behaviours**: what physically happens, how it sounds, what the
ritual is, what the experts notice. A kiln glows from dull red to yellow as it heats,
and nothing glows below about 525 °C; the lid stays shut until it is safe; pieces go on
a shelf with so many centimetres above them. Behaviours become motion, data encodings
and moments; nouns only become palettes.

### 5.3 Place it by frequency

| How often the person meets it | Budget | Examples |
|---|---|---|
| 100+ a day: keyboard shortcuts, navigation, typing, the command menu | **None.** Instant | No open animation on the command menu |
| Tens a day: buttons, toggles, hover, list rows, the dashboard's own load | **Near-imperceptible feedback**: 100–160 ms, small (2% press, a colour change) | Plinth's `press` utility |
| Occasional: dialogs, sheets, toasts, a successful save | **Ordinary craft**: 150–250 ms, no overshoot, said plainly ("Saved") | Undo bar sliding in |
| Rare and earned: first use, finishing something that took effort, a milestone, recovering from a failure | **The moment**: one per flow, drawn from the subject, proportional to the stakes, once | The booking's shelf drawing |
| Always, but read rather than used: the screen's signature, the voice, the data encodings | **Character at rest**: no motion, carried by what things are and what they say | The kiln-glow firing chart; "All three kilns are cold" |

The last row matters most for Operate surfaces. Most of a work tool's character
should be **at rest**: in words, in what the data is drawn as, in one signature,
none of which costs the person time.

### 5.4 Choose channels for the mode

| Channel | Operate | Read | Persuade, Experience | Goes to slop when |
|---|---|---|---|---|
| Voice | Subject words in labels, empties and errors; straight-faced | A narrator's voice is welcome | Full voice | It jokes, cheers, or could be any product |
| Signature | One, usually how the main data is drawn | The reading furniture (a timetable's rhythm, a recipe's method layout) | One committed idea, everything around it quiet | There are three of them |
| Colour | Full strength in a few places where the colour is a fact (heat, depth, a team's kit) | Quiet | Free, from the subject | Gradients or brights that encode nothing |
| Type | One family; character in its figures and weights | A text face with personality | Display face, once | Fonts from the overused list, or a costume (mono for "technical", hand-drawn for "human") |
| Motion | Feedback and the moment only | Almost none | One authored moment; hero springs allowed | It plays on load, loops, or bounces by reflex |
| Illustration | Only drawings made from the person's data in the subject's terms | Diagrams | From the subject, commissioned or drawn | It comes from a kit |
| Sound | Off; opt-in for a physical product's feedback | Off | Opt-in | It plays without consent |

### 5.5 Make the moment

For each rare moment: say what happened (past tense, with its object), say what
happens next and when, and, if there is one, show the result in the subject's own
picture made from the person's data. Animate the part that is the result, once, with
a hard ease-out and no overshoot; make it instant under reduced motion; move focus to
the result. Plinth now has a `Done` component that requires the first two
([`ui-library/components.md`](./ui-library/components.md) §3.15).

### 5.6 Check

1. **Swap test**: could a neighbouring product use it unchanged? Then it is stock.
2. **Hundredth-time test**: would it still be welcome the hundredth time? If not, move
   it down the frequency table or remove it.
3. **Bad-day test**: read it as someone whose work just failed. Does it still help?
4. **Remove test**: take it out. If the screen is slower or less clear without it, it
   was function; if the screen is the same, it was decoration, and it must at least pass
   tests 1–3.
5. **Mechanical**: reduced motion, mute, keyboard, a 390px phone, and `slop-lint` (the
   new playful rules are in the default set).

## 6. Applied: the kiln room

The worked example ([`ui-library/examples/`](./ui-library/examples)) was changed to
show the procedure, and its `DESIGN.md` gained a Character section:

- **Character at rest**: the firing chart's line is now coloured as the kiln glows:
  unlit clay brown below 500 °C, then dull red, cherry, orange and yellow at the
  1,222 °C peak (five `--heat-*` tokens, each ≥ 3:1 against the ground in both themes).
  The colour is a fact of the subject, and the y position still carries the value,
  so it is not the "gradient that means nothing" tell. In the dark theme it reads
  as the kiln does at night.
- **Voice**: the empty state says "All three kilns are cold"; the controller error says
  which controller, how old the reading is and where to read the live one.
- **Feedback**: every button gives 2% under a press, over 100 ms.
- **The moment**: finishing a booking now replaces the form with a `Done` view: what
  was booked, what to bring and by when, and a drawing of kiln 2 in section with the
  member's pieces set down on their shelf and the clearance under the shelf above
  worked out ("6 cm clear"). It reuses alternate B from the original DESIGN.md (the
  shelf map), which was rejected as a *form* because it was slow; as a *result* it
  costs the person nothing and answers the two questions they have next.
- **Not added**: confetti, sound, a mascot, motion on the dashboard's load, anything
  on table rows.

Renders: [`booked-light-1440.png`](./ui-library/examples/renders/booked-light-1440.png),
[`booked-dark-390.png`](./ui-library/examples/renders/booked-dark-390.png),
[`kiln-room-dark-1440.png`](./ui-library/examples/renders/kiln-room-dark-1440.png).

## 7. Evidence quality and gaps

- The model (delight on top of usability) and the frequency rule are practitioner
  consensus, not experiments. They agree with each other and with the one large study
  in the set (Google's), which is as good as this topic gets.
- The aesthetic-usability papers were read through abstracts and summaries; the
  peak-end work is cited from memory of the literature, not re-read. Both are flagged
  where used.
- No controlled study of humour in interface errors was found. The 2025 AI-forgiveness
  result was seen only as a summary on Science Says.
- Not compared yet: Jakub Krehel's `better-*` skills (cloned at `f41f027`, read only
  for scope), Comeau's full course, Duolingo-style gamification research, and
  sonification research for interface sound.
- The kiln example shows the calm end of the range. A product whose subject is
  itself playful would show where the dial goes when it is turned up; that is a
  candidate for the next pass.
