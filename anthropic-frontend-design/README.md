# Anthropic `frontend-design` skill

- **Type**: Agent Skill · **Vendor**: Anthropic · **Licence**: Apache-2.0 (`LICENSE.txt`)
- **Source**: https://github.com/anthropics/skills/tree/main/skills/frontend-design, `main` @ `ca45fc4` (2026-10-28)
- **Retrieved**: 2026-11-01. Byte-identical to the copy stored in
  `jburnhams/prompts/anthropic-skills/frontend-design/` (read 2026-09-10), so
  it has not changed in at least seven weeks.

## Files

- `SKILL.md`: the whole skill, 71 lines. A design-studio persona; "ground
  your designs in the subject matter"; typography rules; the **five named
  clusters** of current AI-generated design (cream + serif + terracotta,
  near-black + one acid accent, broadsheet, the SaaS card kit, template
  chrome); a two-pass process (a token plan of 4–6 hex values, type roles,
  ASCII layout concepts and principles, then review the plan against the brief
  *before* coding); a restraint and self-critique section; a section on UX
  writing.

## Why it matters here

This is the reference point every other anti-slop skill in this collection
cites, extends or argues with. Three things in it are unusual:

1. **The vendor names its own fingerprint.** The terracotta accent "often near
   #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it
   reads as a tell."
2. **The brief overrides the list.** "Where the brief pins down a visual
   direction, follow it exactly — the brief's own words always win, including
   when it asks for one of these looks." Without this clause a tell list turns
   into a refusal list.
3. **The plan is reviewed for genericness before code exists.** "Work through a
   similar prompt to see if you arrive somewhere similar." It is a
   self-administered competitor test, applied to the plan rather than to the
   pixels.

Its predecessor is the 2025 cookbook prompt in
[`../anthropic-cookbook-frontend-aesthetics/`](../anthropic-cookbook-frontend-aesthetics).
Comparing the two shows what Anthropic reversed (gradients, staggered
reveals, named font recommendations); see
[`../ux-generator-prompts.md`](../ux-generator-prompts.md) §3.
