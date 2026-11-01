# Google Stitch skills

- **Vendor**: Google Labs · **Licence**: Apache-2.0 (`LICENSE`)
- **Source**: https://github.com/google-labs-code/stitch-skills, `main` @ `0337446` (2026-08-17)
- **Retrieved**: 2026-11-01

Stitch is Google's AI UI generator; "vibe design" (reportedly a March 2026 update)
starts from an intent or emotion and generates several directions. These skills let
coding agents drive it through its MCP server.

## Files stored

| File | What it is |
|---|---|
| `enhance-prompt.SKILL.md` | Turns a vague UI request into a Stitch prompt: "Amplify the Vibe" adjective table, a numbered page structure, and a `DESIGN SYSTEM (REQUIRED)` block pulled from DESIGN.md |
| `design-md.SKILL.md` | Reverse-engineers a Stitch project's design language into DESIGN.md |
| `taste-design.SKILL.md` | A port of taste-skill (v1 era) into Stitch's DESIGN.md flow: "premium, anti-generic UI standards: strict typography, calibrated color, asymmetric layouts, perpetual micro-motion" |
| `generate-design.SKILL.md` | Generating screens from a prompt and DESIGN.md |

## Why it matters here

The repo shows **both mood-to-design strategies inside one vendor**:

- `enhance-prompt` expands adjectives into more adjectives ("modern" becomes
  "clean, minimal, with generous whitespace"; "professional" becomes "sophisticated,
  trustworthy, with subtle shadows"), and its default page structure is Header, Hero,
  Content, Footer "Links, social icons, copyright", which is the stock section
  waterfall.
- Google's own DESIGN.md philosophy, in a sibling repo, argues that adjectives
  "describe a region" and a specific reference "describes a point".

`taste-design` also shows how anti-slop rules age when ported: "perpetual
micro-motion" carries taste-skill v1's stance, while taste-skill v2's registry now lists
"infinite loops that mean nothing" and "hover lift on every card" among motion tells.

Analysis: [`../ux-mood-to-theme.md`](../ux-mood-to-theme.md) §2.
