# Working in ux-research

Research into how AI agents design interfaces and what makes the result good UX,
for React + Tailwind (and shadcn/ui). Layout and conventions are in
[`README.md`](./README.md); where every source came from is in
[`sources.md`](./sources.md).

## Keep the changelog current

Every change to this repository adds an entry to [`changelog.md`](./changelog.md) **in
the same commit or PR as the change**. Do not leave it for later.

- Group entries by day under `## YYYY-MM-DD`, newest day first. If today's heading
  exists, add to it; otherwise add a new heading at the top.
- Start each entry with a bold one-line title naming the piece of work, the branch it
  was done on (and the PR number once known), then one or two sentences on what was
  asked and anything that changed the plan.
- Follow with bullets naming each file or folder touched (in backticks) and what
  changed in it. Say **new** for new files, and call out corrections to earlier
  claims explicitly, because readers rely on the docs being right.
- Record what was looked for and not found, or could not be reached, when it matters
  for the next pass.
- Write in plain prose, full sentences in the opening line, no marketing words.
- Do not rewrite older entries except to fix a factual error; if a later change
  supersedes one, say so in the new entry.

## Dependencies: consult Jonathan first

**Adding, replacing or removing a dependency needs Jonathan's decision before it happens.** This
is critically important, not a courtesy. Applies to `dependencies`, `peerDependencies` and
`devDependencies` in strata-react, the examples, the template and any app built on them. Do not
install one to try it and leave it in; spike it on a scratch branch, and put the options to him
(what it replaces, what it costs in size and styling fit, what else could do the job) before
adopting it. The same goes for pinning a major version. Where a rule here or in strata-react
names a library (for example the primitives layer), that choice was his and is changed only by him.

## Other house rules

- **Sources**: store primary sources by source in their own folder with a README
  (type, licence, source URL and commit, retrieval date, files stored, what is
  distinctive). Store text only when the licence allows; otherwise write analysis
  with short quotes, as `claude-design-skills/` and `notboring/` do. Add every repo
  or page read to `sources.md`.
- **Unreachable sources** go in [`blocked-sources.md`](./blocked-sources.md) with why
  and what was used instead; move them to its "Resolved" section when they are read.
- **Evidence**: say where each figure comes from and how strong it is; prefer the
  primary source, and flag second-hand or version-bound numbers.
- **Tests**: `node --test ux-design/tests/*.test.mjs` must pass after any change to
  `ux-design/` or `ui-library/` (the suite lints `ui-library/examples/`). After changing
  the example's code, also run `npm run check` and `npm run render` in
  `ui-library/examples/` and commit the updated screenshots.
