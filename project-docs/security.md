# Security Posture

EcoAscent is a **client-only** app. No backend, no auth, no third-party API calls.

| Concern              | Mitigation                                                  |
| -------------------- | ----------------------------------------------------------- |
| Hardcoded secrets    | None exist — there are no network calls requiring keys.     |
| XSS via user input   | All user labels rendered as text nodes via React (escaped). |
| localStorage poison  | `useEcoState` wraps `JSON.parse` in try/catch (tested).     |
| Input length abuse   | Custom note capped at 80 chars in UI + 60 char validator.   |
| Dependency drift     | Lockfile committed; `bun audit` on every PR.                |
| CORS / API exposure  | N/A — no fetch calls leave the origin.                      |

## If a backend is added later
- Secrets go through Lovable Cloud's secret manager, never `.env` in git.
- Edge functions must declare explicit CORS allow-lists.
- All writes gated by Supabase RLS + `has_role()` security-definer fn.