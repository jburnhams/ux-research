# notboring.dev

- **Type**: A paid catalogue of UI components **delivered as prompts** for coding
  agents, plus an MCP server (`claude mcp add -t http notboring
  https://notboring.dev/api/mcp`; 25 free calls without a key). Made by Benjamin, a
  French UI designer: "Your agent can build anything and still has no taste — so I
  gave it mine."
- **Licence**: proprietary. A copied component may be used in your own projects, but
  "You may not resell it, redistribute the prompt, or publish it as part of another
  component library." **No prompt text is stored here.** This folder is analysis with
  short quotes.
- **Source**: https://notboring.dev/ , `/license`, `/c/button` (read 2026-11-02)
- **Not related**, as far as the site says, to Not Boring Software
  (`notboring.software`), the studio behind the Weather, Habits and Timer apps. The
  first pass guessed they might be; the site never mentions it.

## What it does that is worth copying

Each component page offers a prompt (the Button's is 16,182 characters) that tells
the agent to add the component, and then hands it two jobs that most anti-slop
skills leave implicit:

1. **Map our tokens to yours, don't add globals.** The CSS reads a few custom
   properties (`--font-ui`, `--ink`, `--ink-rgb`, `--on-ink`) and does not define
   them. The prompt calls this "THE PART THAT NEEDS YOUR JUDGMENT": map each one to
   what the project already uses for that job, or define it locally on the
   component's root "so nothing leaks out". That is the drift fix applied at the
   point of import.
2. **Build every state, not the demo state.** "This block is built for every state its
   object can really be in — empty, one, full, refused, undone, pressed twice,
   interrupted halfway … work out that list before you write, and build the whole of
   it. Never settle for the minimum that makes the screenshot right."
3. **Comments carry the reasons.** "Keep the comments. They say why the numbers are
   what they are." The Button's source explains, for instance, why save → saving →
   saved is one pill whose width follows the label on a spring and whose labels slide
   up in sequence, rather than a swap to a spinner: "A crossfade in place would say
   the button was uncertain; a lift says it moved on."

Points 2 and 3 are the same idea as artifact-design's "make the page complete at rest"
and Kosta Canatselis's "missing states" tell ([`../web-articles/`](../web-articles)),
made concrete at component level. They are folded into
[`../ux-product-ui.md`](../ux-product-ui.md)'s states section.
