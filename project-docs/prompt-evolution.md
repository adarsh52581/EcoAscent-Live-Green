# Prompt Evolution

We treated the AI as a junior collaborator and iterated in three phases.

## Phase 1 — Intent
> "Gamified carbon footprint app where my world visibly reacts. Three states:
>  pristine, moderate, critical. No pie charts. No Three.js."

Outcome: scaffold with placeholder copy + a single hero scene.

## Phase 2 — Visual feedback loop
Tightened the brief: cross-fade between palettes over 1s, parallax on cursor,
animated smoke for critical / pollen for pristine. Explicitly forbade
heavy canvas libraries.

## Phase 3 — Narrative + a11y polish
- Replaced robotic copy ("CO₂ tracker") with warm lines
  ("Your world is breathing easy.").
- Tightened leaderboard contrast after user feedback (white text on pale
  green failed WCAG AA — moved to `#0F1A14` background).
- Added semantic landmarks and `aria-pressed` on toggle chips.

## Lessons
- Front-load **non-goals** in the very first prompt — saves rollbacks.
- Ask for hex values, not Tailwind color names, when the theme is custom.
- Always re-prompt with the screenshot when fixing visual bugs.