# Testing

## Toolchain
- **Vitest** (jsdom) + **@testing-library/react** for hooks and components.
- `bun test` runs the suite; `bun run test:coverage` produces a V8 report.

## What's covered
| Module                 | Tests                                       |
| ---------------------- | ------------------------------------------- |
| `lib/eco/actions.ts`   | Threshold boundaries (incl. negative totals), preset invariants, category metadata coverage. |
| `lib/eco/storage.ts`   | Add / remove / clear / total math, corrupt-`localStorage` recovery, relative-time formatting. |

## Edge cases explicitly exercised
- Negative cumulative CO₂ (heavy offsetters).
- Corrupt JSON in `localStorage`.
- Sub-minute, sub-hour, sub-day, multi-day timestamps in `formatRelative`.

## How to add a test
Co-locate `*.test.ts(x)` next to the module. The setup file already polyfills
`jest-dom` matchers and clears `localStorage` between tests.