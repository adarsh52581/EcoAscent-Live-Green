# Testing

## Toolchain
- **Vitest** (jsdom) + **@testing-library/react** for hooks and components.
- `bunx vitest run` runs the suite; `bunx vitest run --coverage` produces a V8 report.
- Coverage thresholds enforced in `vitest.config.ts` (lines/functions/statements ≥ 70%, branches ≥ 60%).

## What's covered (50 tests across 12 files)

### Logic / hooks
| Module                       | Tests                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `lib/eco/actions.ts`         | Threshold boundaries (incl. negative totals), headline copy, preset invariants, category metadata.  |
| `lib/eco/storage.ts`         | `useActions` CRUD, `useWorldState` derivation, corrupt-`localStorage` recovery, `formatRelative`, SSR-parity test locking in `INITIAL_ACTIONS` as the first render value. |
| `lib/eco/leaderboard-data.ts`| Seed-peer invariants: non-empty, finite scores, unique names.                                       |

### UI components (React Testing Library)
| Component                              | Tests                                                                |
| -------------------------------------- | -------------------------------------------------------------------- |
| `components/eco/Dock.tsx`              | Renders nav buttons, marks active with `aria-current`, fires onChange. |
| `components/eco/LivingWorld.tsx`       | Title/desc per state, valid `aria-labelledby` targets in the SR-only SVG. |
| `components/eco/living-world/Scene.tsx`| Renders from palette data (no per-kind branching), tree-count matches palette, atmosphere flag obeyed. |
| `components/eco/ActionLog.tsx`         | Preset selection + submit, validation error, category switching, remove. |
| `components/eco/action-log/CategoryTabs.tsx` | aria-pressed on active, onChange on click.                     |
| `components/eco/action-log/PresetGrid.tsx`   | One button per preset, selection state, onSelect, empty-list guard. |
| `components/eco/action-log/RecentActions.tsx`| Empty state, per-row remove with correct id.                  |
| `components/eco/WorldMeter.tsx`        | Headline per state, progressbar aria values incl. clamped at 0.       |
| `components/eco/Leaderboard.tsx`       | Semantic table w/ column headers, user-rank edge cases, ascending sort. |

## Edge cases explicitly exercised
- Negative cumulative CO₂ (heavy offsetters).
- Brand-new user with zero actions (rank #1 vs. last).
- Corrupt JSON in `localStorage`.
- Empty preset list.
- Sub-minute, sub-hour, sub-day, multi-day timestamps in `formatRelative`.
- SSR / first-client-render parity for `useEcoState`.

## How to add a test
Co-locate `*.test.tsx` next to the module. The setup file (`src/test/setup.ts`)
polyfills `jest-dom` matchers and `matchMedia`, and clears `localStorage`
between tests.