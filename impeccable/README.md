# Impeccable (Paul Bakaus)

- **Type**: Agent skill plus a deterministic detector engine (Rust/WASM), editor hooks and a Chrome extension
- **Licence**: Apache-2.0 (`LICENSE`, `NOTICE.md` copied alongside)
- **Source**: https://github.com/pbakaus/impeccable, `main` @ `e89e3ad` (2026-11-01). Site: https://impeccable.style
- **Retrieved**: 2026-11-01

The largest and most engineered source in this collection: one skill with 24
sub-commands, about 430 KB of reference text, and a rule engine with 62
registered anti-patterns that runs as a CLI, in CI, as a post-edit hook
inside the agent, and as a browser overlay.

## Files stored

| File | What it is |
|---|---|
| `SKILL.src.md` | The router: core principles, setup, "How to design", the four **modes** (Persuade, Operate, Read, Experience), the commands table |
| `reference/craft-floor.md` | The quality floor (verify list), the **Refuse** list, and a `<codex>` block of model-family-specific bans |
| `reference/operate.md` | Depth for app UI, dashboards and tools: "the product slop test", one family, fixed rem scale, ratio 1.125–1.2, every component state, 150–250 ms motion, "modal as first thought" banned |
| `reference/mode-operate.md`, `mode-persuade.md` | Mode rules for directions and comps |
| `reference/critique.md`, `audit.md`, `polish.md` | Evaluate and refine playbooks |
| `reference/typeset.md`, `colorize.md`, `layout.md`, `animate.md`, `clarify.md` | Per-dimension enhancement playbooks |
| `reference/delight.md`, `reference/bolder.md` | **Added 2026-11-07 from `main` @ `687bc38` (2026-11-06)**: the personality playbook (one "delight thesis", moments by emotion, "a neighboring product could not use it unchanged") and the amplification playbook ("reaching for more effects is the opposite of bold"). Read for [`../ux-character.md`](../ux-character.md) |
| `antipatterns.tsv` | **Extracted by us** from `crates/foundation/src/registry.rs`: all 62 rules with id, category (`slop` or `quality`, 31 each), severity and description |

Not stored: the Rust engine, live mode, native iOS and Android references,
generated provider copies, and `new-work.md` (64 KB, the direction-dealing
procedure, which depends on a private paid catalogue).

## What is distinctive

1. **Mode before taste.** "Choose the mode from the requested surface, not the
   product": a tool's landing page is Persuade, its settings screen is Operate.
   On Operate, "familiarity is often a feature" and "the tool should disappear
   into the task". This axis resolves most of the apparent contradictions between
   anti-slop sources; see [`../ux-product-ui.md`](../ux-product-ui.md).
2. **Model-specific tells.** `craft-floor.md` has a `<codex>` block (ghost cards,
   sketchy SVG, stripe and grid backgrounds, "X theater" copy) that is emitted only
   for that model family. The registry has matching rules (`gpt-thin-border-wide-shadow`,
   `codex-grid-background`, `theater-slop-phrase`). It is the only source here that
   treats each model as having its own fingerprint.
3. **The detector runs as an edit hook.** "This is where most slop gets caught:
   without the hook, the detector only runs when someone remembers to run it."
   The repo's CLAUDE.md treats hook latency as part of a rule's cost.
4. **Accessibility is deliberately kept out of the design-time prompt.** From the
   repo's CLAUDE.md: "a11y lives in audit.md, not in SKILL.md or the mode guidance.
   Models over-cautious themselves into safe, underdesigned output when reminded
   about accessibility at design time." It is a finding from their private evals,
   and it is the opposite of what `frontend-design` and Vercel do.
5. **Evals with a stated result.** CLAUDE.md: "In blind ratings, comps of working
   screens and documents scored 2.0 to 2.9 across five rule changes while
   code-led builds of the same briefs scored 3 to 3.5 and were always complete."
   That is why Operate and Read surfaces are always built in code rather than from a
   generated image comp.
6. **Prose denylist enforced by the build.** Em dashes, "seamless", "elevate",
   "delve" and similar fail `bun run build` on its own READMEs, and a narrower list
   fails on the skill text.

## Cautions

- The detector's `overused-font` rule names Inter, Roboto, Fraunces, Geist, Plus
  Jakarta Sans and Space Grotesk. Inter and Geist are reasonable choices for
  Operate surfaces, and Impeccable's own `operate.md` says "System fonts and
  familiar sans defaults" are permitted there. Apply the rule per mode, not
  globally.
- The direction catalogue ("the paid-service moat") is private, so the
  `new-work` flow cannot be reproduced from the public repo.
