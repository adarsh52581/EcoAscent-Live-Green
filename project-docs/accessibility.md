# Accessibility

## Commitments
- Semantic landmarks: `<main>`, `<nav aria-label="Primary">`, `<header>`, `<section>`, `<ol>`.
- All icon-only buttons carry `aria-label` (e.g. "Remove action").
- Toggle chips expose `aria-pressed` so screen readers announce selection state.
- Form inputs use `<label htmlFor>` association, not placeholder-as-label.
- Color is never the only signal — text + icon + position reinforce state.
- Respects `prefers-reduced-motion`: parallax disabled, smoke/pollen kept subtle.
- Color contrast on the leaderboard "You" row revised to meet WCAG AA after
  user feedback (white on `#0F1A14`, 14:1 ratio).

## Known limits
- The Living World scene is decorative (`aria-hidden`). The World Meter exposes
  the same information in text form.