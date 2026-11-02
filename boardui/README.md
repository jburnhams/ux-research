# BoardUI

- **Type**: A React design system for dashboards and agentic interfaces (React 19,
  Tailwind CSS v4, React Aria, TanStack Table, Recharts, Remix Icon), designed in
  Figma, with a CLI and an MCP server so coding agents can install components and
  read tokens. 103 components including 19 charts, agent-specific pieces (composer
  attachments, agent progress, thinking indicators, web search) and 400+ tokens.
- **Licence**: the free tier is MIT (`LICENSE`, © Mertcan Dundar Esmergul); Pro
  templates are a paid single-user or 5-user licence (€149–€349, one-off)
- **Sources**: https://www.boardui.com/ (read 2026-11-02);
  https://github.com/BoardUI/boardui, `main` @ `ec5c5eb` (2026-10-03)
- **Retrieved**: 2026-11-02. In the first pass this domain was unreachable and web
  search returned nothing for it.

## Files stored

| File | What it is |
|---|---|
| `AGENTS.md` | **BoardUI's rules for coding agents**, written into a project by `npx boardui init` and kept in sync between `<!-- boardui:rules:start/end -->` markers |

## What it is, for this collection

BoardUI takes no explicit stance on AI slop. It is useful as **a worked example of the
fix the drift sources recommend**: a design system that tells the agent, in the
project, what it may and may not write.

1. **Components first, install rather than imitate.** "Missing a component? Install it
   … instead of writing a lookalike." This is the "constrain the agent to real
   components" fix in Superdesign's drift article
   ([`../web-articles/`](../web-articles)).
2. **Semantic tokens only, raw palette classes banned.** "Never use raw palette
   classes (`text-gray-500`, `bg-white`, `border-neutral-200`) or hex/oklch literals."
   Dark mode comes from the tokens, so `dark:` overrides with raw colours are banned
   too. This is the rule `slop-lint` enforces as arbitrary-value and raw-palette
   findings.
3. **Composite type utilities** (`text-title-1-medium`, `text-body-regular`) set size,
   weight, line height and tracking together, and stacking `text-sm font-medium
   leading-5` is banned. That is the `@utility type-*` approach in
   [`../ux-react-tailwind.md`](../ux-react-tailwind.md).
4. **Radius by role, stated as numbers**: cards and panels `rounded-3xl`, inputs and
   menu rows `rounded-md` to `rounded-xl`, pills `rounded-full`.
5. **Unusually specific mechanics**: RTL through a `DirectionProvider` with a BCP 47
   locale and logical properties, and an exact recipe for the top edge of internal
   scroll regions (two masked backdrop-blur layers plus a surface-to-transparent
   gradient, faded in over the first 24px of scroll, opacity on the layers and never
   the parent).

Its own look (large `rounded-3xl` cards, soft tinted surfaces) is close to the 2025–26
"AI dashboard" median, so it is a reference for *how to bind an agent to a system*,
not for what the system should look like.
