# EcoAscent — Build Plan

A single-page gamified carbon footprint app with a reactive "Living World," action logging, and a social leaderboard. All state persists to LocalStorage.

## Scope & Stack

- TanStack Start (existing template), React + Tailwind v4
- LocalStorage for persistence (no backend needed)
- `lucide-react` for icons (already standard in shadcn template)
- Pure CSS/SVG for environment art — no Three.js, no canvas libs
- Single route: `/` (replace the placeholder in `src/routes/index.tsx`)

## Files to Create

```
src/routes/index.tsx              -> Replace placeholder; hosts the 3 views + dock
src/lib/eco/storage.ts            -> LocalStorage hooks (actions, score)
src/lib/eco/actions.ts            -> Action catalog + CO2 values
src/components/eco/LivingWorld.tsx        -> Parallax SVG scene, 3 states
src/components/eco/WorldMeter.tsx         -> Glassmorphic health meter overlay
src/components/eco/ActionLog.tsx          -> Form + recent actions list
src/components/eco/Leaderboard.tsx        -> Ranked fictional groups + "YOU"
src/components/eco/Dock.tsx               -> Bottom glass pill nav
```

## Data Model (LocalStorage key: `ecoascent:v1`)

```ts
type Action = {
  id: string;
  category: 'transit' | 'food' | 'offset';
  label: string;       // e.g. "Beef meal", "Cycled to work"
  co2: number;         // kg CO2, negative for offsets
  loggedAt: number;
};
type State = { actions: Action[] };
// Derived: totalCO2 = sum(actions.co2), clamped display 0..120+
```

Action catalog (sample):
- Transit: Car commute +6, Short flight +90, Bus +2, Train +1
- Food: Beef meal +7, Chicken +2, Vegan meal +0.5
- Offset: Cycled −2, Planted tree −20, Skipped flight −50

## Feature 1 — Living World (Home)

Three discrete states based on `totalCO2`:
- Pristine `< 20`: sky gradient `#7CC4F2 → #E8F4FF`, golden sun `#FFD36B`, layered green hills `#3FA76A / #2E8854`, 5 SVG trees, subtle floating particles (pollen).
- Moderate `20–80`: sky `#9FB8C9 → #E2DFCB`, dimmer sun, 3 trees, yellowing grass `#8FA85A`.
- Critical `> 80`: sky `#3A2A2A → #B25A2E`, no sun (red disk), tree stumps, animated CSS smoke puffs (3 divs, `@keyframes` drift + fade).

Parallax: 3 SVG layers translated on mousemove (desktop) and on scroll, with `transform: translate3d` and `will-change`. Reduced-motion respected.

Smooth crossfade between states via opacity transitions on layered scenes (all 3 rendered, active one `opacity-100`).

## Feature 2 — Action Log

- Category tabs (Transit / Food / Offset) → preset chips with CO2 value visible
- Optional custom label input (defensive: trim, non-empty, max 60 chars; show inline error)
- "Log action" button → append to state, toast confirmation
- Recent Actions list (last 10), each row: icon, label, signed CO2 badge (green for negative, amber/red for positive), relative time, delete button

## Feature 3 — Leaderboard

Fixed groups with seeded scores:
```
Maple Hostel 12, Oak Tower 34, Cedar Hall 56, Birch Court 78, Pine Lodge 102
```
Insert user as "You" with live `totalCO2`, sort ascending (lower = better), highlight user row with green ring + "YOU" badge. Show delta vs. next rank.

## Navigation Dock

Fixed bottom-center, pill shape, glass: `bg-black/40 backdrop-blur-md` + white border `border-white/10`. Three icons (Home / Plus / Trophy) with active indicator. View state held in `index.tsx` via `useState<'world'|'log'|'board'>`.

## Visual / Design Rules

- Hardcoded hex Tailwind classes throughout (e.g. `bg-[#0F0F0F]`, `text-[#E8F4FF]`)
- Glass cards: `bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl`
- Warm, human copy ("Your world is breathing easy today.", "Small steps, real impact.")
- Fully responsive: dock and overlays scale; scenes use `viewBox` SVGs (fluid)
- Respect `prefers-reduced-motion` for parallax + smoke

## Out of Scope

- Auth / multi-user sync (groups are fictional)
- Backend / Lovable Cloud
- Charts library

## Verification

After build: load `/`, log a Beef meal → world shifts to Moderate; log a flight → Critical with smoke; reload page → state persists; leaderboard rank updates live.
