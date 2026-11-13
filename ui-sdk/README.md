# UI SDK (vercel-labs/ui)

- **Type**: A headless behaviours library "for agents to build the next generation of user
  interfaces": keyboard, focus, selection, popups and drag and drop as functions in
  `@ui-sdk/core`, about 50 unstyled components in React, Vue, Svelte, Solid and web
  components, a testing kit (`checkPattern`, `checkServer`, `checkDirection`), and a bridge
  (`createAgent`, WebMCP) so an agent can operate the finished interface. Beta (0.1.0-beta.2),
  zero runtime dependencies.
- **Licence**: Apache-2.0. No text is stored here; the analysis uses short quotes.
- **Source**: https://github.com/vercel-labs/ui, `main` @ `8ff6bcf` (2026-11-13), shallow clone
- **Retrieved**: 2026-11-13. Files read: `README.md`, `AGENTS.md`, `contributing/README.md`,
  `contributing/pitfalls.md`, `packages/core/skills/ui-sdk/SKILL.md` and its `references/`
  (`build-interface.md`, `agent-ready.md`, `testing.md`, `patterns.md`),
  `apps/docs/content/docs/agents/` (`index.mdx`, `connect-an-agent/permissions.mdx`),
  and the component and foundation directory listings. Not read: the other contributing
  docs, the specs, the docs site's component pages, the source of any behaviour.

## What it is, for this collection

It is a competitor to React Aria Components, not an addition to it: the same layer
(behaviour and ARIA, no styles) with its own `data-*` state attributes and no table,
virtualiser or colour-science equivalent that Strata uses. Strata's primitives layer was
chosen by Jonathan on 2026-11-12 and this source gives no reason to change it. There is no
visual, colour, type or content guidance in it, so it adds nothing to the slop research.

What it does add is a view of the finished interface as something an agent *operates*:
names must be unique to be findable, risky controls carry a sentence for the person, state
changes arrive through callbacks that can refuse them, and tests check the server output
and right-to-left. Those are written up in [`../ui-library/agents.md`](../ui-library/agents.md) §4.

## Distinctive

- Its rule file says "Comments are rare" and its example rule "tests that pass on a broken
  page don't count"; both agree with strata-react's own rules.
- `pitfalls.md` is a dense list of browser and screen-reader behaviours (VoiceOver,
  NVDA, Safari, Firefox) stated as fact by the maintainers; none was reproduced here.
- Its agent skill refuses hand-rolled `role=` markup next to a shipped component.
