# EcoAscent — Watch your world react

A gamified carbon-footprint awareness app built for **PromptWars Virtual Challenge 3**.
Most carbon trackers show numbers. Numbers don't change behavior — **feeling** does.
EcoAscent reframes the user's daily choices as a **Living World** that visibly thrives,
strains, or chokes in response to the actions they log.

🌐 **Live demo:** https://world-heal-hero.lovable.app

---

## Chosen vertical

**Sustainability & Climate Action.** Persona: the *climate-curious individual* —
someone who cares about their footprint but bounces off spreadsheet-style
trackers. EcoAscent is the smart, dynamic assistant for that persona: it takes
the day's logged choices as context and responds with a living visual world
plus a human-voiced headline ("Your world is breathing easy" → "Your world is
choking. Time to act."). The decision logic — which scene, which copy, which
leaderboard rank — is derived from the user's running CO₂ context, not
hard-coded screens.

## Approach & logic

1. **Context** = the user's `Action[]` history in `localStorage`.
2. **Reasoner** = pure function `worldState(totalCO2)` → `pristine | moderate | critical` (thresholds 20 kg / 80 kg).
3. **Response** = three layers driven off that single state:
   - Visual: cross-fading SVG palette + smoke/pollen intensity in `LivingWorld`.
   - Verbal: headline + health bar color in `WorldMeter`.
   - Social: rank position in the neighborhood `Leaderboard`.
4. **Feedback latency** is sub-second so the cause→effect link is felt, not read.

## How it works

- Open the app → `useEcoState` hydrates actions from `localStorage`.
- Tap a preset chip (or add a custom note) in **Log** → action is prepended, totals recompute, `worldState()` re-derives, every consumer re-renders.
- Switch to **World** to see the scene shift; **Board** shows where you rank.
- Everything is client-only — no sign-up, no network calls, works offline.

## Assumptions made

- CO₂ values are illustrative averages (e.g. short flight ≈ 90 kg) — the goal
  is behavioral feedback, not scientific-grade accounting.
- A single device = a single user; multi-device sync is out of scope.
- The neighborhood leaderboard uses representative seed peers so a brand-new
  user still gets the social-comparison signal on first open.
- Modern evergreen browser with `localStorage` available; SSR renders an empty
  state and hydrates on the client.

---

## Why this exists

Climate-curious people already know "flying is bad" — they haven't internalized scale.
EcoAscent closes the emotional feedback loop in under a second: log an action, watch
the world's palette, smoke, pollen, and tree population react.

## Features

- **Living World scene** — three cross-fading SVG palettes (pristine / moderate / critical) with parallax, smoke, and pollen.
- **Action Log** — preset chips for transit, food, and green offsets, plus a custom note.
- **World Meter** — single-glance health bar with a human headline.
- **Neighborhood Leaderboard** — gamified social comparison.
- **Offline-first** — zero sign-up, zero API keys, persists to `localStorage`.

## Tech stack

- TanStack Start v1 (React 19 + Vite 7), file-based routing, SSR-ready
- Tailwind v4 via `@tailwindcss/vite` with semantic tokens in `src/styles.css`
- lucide-react icons; pure CSS + inline SVG for the world scene (no canvas / WebGL)
- Vitest + Testing Library + jsdom for the test suite

## Run locally

```bash
bun install
bun run dev            # http://localhost:8080
npm test               # or: bunx vitest run
npm run test:coverage  # V8 coverage report
```

> `bun test` invokes Bun's native test runner and will skip `vitest.config.ts`.
> Use `npm test` or `bunx vitest run` to execute the Vitest suite.

## Project documentation

Full design and process notes live under [`project-docs/`](./project-docs):

| Doc | What it covers |
| --- | --- |
| [`problem-statement.md`](./project-docs/problem-statement.md) | The user pain we target and our non-goals |
| [`architecture.md`](./project-docs/architecture.md) | Stack, state model, component map, data-flow diagram |
| [`prompt-evolution.md`](./project-docs/prompt-evolution.md) | How the AI was directed across three phases |
| [`security.md`](./project-docs/security.md) | Threat model and mitigations |
| [`testing.md`](./project-docs/testing.md) | Test strategy, coverage, and edge cases |
| [`accessibility.md`](./project-docs/accessibility.md) | A11y commitments and WCAG contrast notes |

## How this submission addresses each evaluation parameter

| Parameter | Where it lives |
| --- | --- |
| Problem alignment | `project-docs/problem-statement.md` — emotional-feedback thesis |
| Code quality | Small (<200 LOC) single-purpose components, pure `worldState()`, strict TS |
| Architectural elegance | `project-docs/architecture.md` — single-source-of-truth hook, derived state |
| Security | `project-docs/security.md` — no network, no secrets, validated/escaped input, corrupt-storage recovery (tested) |
| Testing | `src/lib/eco/*.test.ts` — 12 passing Vitest tests, edge cases including negative totals and corrupt JSON |
| Accessibility | Semantic landmarks, `aria-pressed` chips, `<label htmlFor>`, `role="alert"`, `prefers-reduced-motion` honored, WCAG-AA contrast |

## License

MIT — built with [Lovable](https://lovable.dev).
