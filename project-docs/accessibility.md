# Accessibility

## Commitments
- `<html lang="en">` on the document shell.
- Semantic landmarks: `<main>`, `<nav aria-label="Primary">`, `<header>`, `<section>`, semantic `<table>` with `<caption>` and `<th scope="col">`.
- All icon-only buttons carry an `aria-label` (e.g. "Remove action").
- Toggle chips expose `aria-pressed`; the active dock item exposes `aria-current="page"`.
- The progress bar has `role="progressbar"` plus `aria-valuemin/max/now/text`.
- Form inputs use `<label htmlFor>` association, not placeholder-as-label.
- Color is never the only signal — text + icon + position reinforce state.
- Recent-Actions metadata text uses `text-white/75+` to clear WCAG AA contrast.
- Remove buttons are 44×44 px tap targets (`h-11 w-11`).
- Respects `prefers-reduced-motion`: parallax disabled, smoke/pollen kept subtle.
- The decorative Living World scene is `aria-hidden`; a parallel SR-only
  `<svg role="img">` with `<title>` + `<desc>` (referenced via stable `useId()`
  ids) describes the current world state to assistive tech.

## Known limits
- Animated atmospheric layers (smoke, pollen) are decorative and not described
  individually — the SR-only `<desc>` summarises them at the scene level.