# Audit: the quality floor

Run after the build, not during design. These are defects, not taste. The brief cannot
waive them. `slop-lint` catches the rows marked `lint`; the rest need the render, a
keyboard, or a person.

## Perceivable

- [ ] Body and placeholder text ≥ 4.5:1 against its *actual* surface (incl. on muted fills and in dark mode); large text ≥ 3:1. `palette.mjs` checks the token pairs; check the overrides in the render.
- [ ] Input borders, focus rings and meaningful icons ≥ 3:1 (WCAG 1.4.11).
- [ ] Status never by colour alone: icon, word or position as well.
- [ ] Images have `alt` (`alt=""` if decorative) and explicit `width`/`height`. `lint: img-alt, img-dimensions`
- [ ] Text resizes to 200% and reflows at 320px CSS width without loss; no `user-scalable=no`. `lint: zoom-disabled`
- [ ] Line length ≤ ~75ch for prose; line-height ≥ 1.4 for body.

## Operable

- [ ] Every interactive element reachable and usable by keyboard, in a sensible order.
- [ ] Visible focus on everything focusable (`focus-visible:` ring or outline; never `outline-none` alone). `lint: outline-none`
- [ ] Actions are `<button>`, navigation is `<a>`/`<Link>`; no click handlers on `div`/`span`. `lint: div-onclick`
- [ ] Icon-only buttons have an accessible name. `lint: icon-button-label`
- [ ] Hit targets ≥ 24px (44px on touch); checkbox/radio label and control share one target.
- [ ] Sticky headers and overlays never cover the focused element; dialogs trap and return focus; `overscroll-behavior: contain` in sheets and drawers.
- [ ] Motion respects `prefers-reduced-motion`; nothing auto-moves for > 5s without pause. `lint: reduced-motion`
- [ ] No `transition: all`; animate transform/opacity/colour only. `lint: transition-all`

## Understandable

- [ ] Labels on every form control; errors inline, specific, with the fix; first error focused on submit.
- [ ] Paste never blocked; `autocomplete`/`type`/`inputmode` correct. `lint: paste-blocked`
- [ ] Buttons name their action; the same verb carries through the flow.
- [ ] Dates and numbers via `Intl.*`; units with non-breaking spaces.

## Robust

- [ ] No console errors; the page renders (an empty `#root` passes every code check and is still a failure).
- [ ] Loads at the top (`scrollY === 0`); no horizontal overflow at 375px and 1280px (`scrollWidth <= innerWidth`).
- [ ] Long, empty and hostile content handled: `min-w-0` on flex children, `truncate`/`line-clamp`, empty and error states.
- [ ] Dark mode designed, not inverted: `color-scheme: dark`, tokens only, no manual `dark:` colour overrides. `lint: dark-override`
- [ ] Fonts actually load (check the computed font in the render, not the CSS).
- [ ] Browser surfaces themed: text selection, caret, scrollbars, underline offset, focus ring colour.
