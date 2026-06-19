# Architecture

## Stack
- **TanStack Start v1** (React 19 + Vite 7) — file-based routing, SSR-ready.
- **Tailwind v4** via `@tailwindcss/vite` — design tokens in `src/styles.css`.
- **lucide-react** for icons. No canvas / WebGL dependencies — the Living World is
  CSS gradients + inline SVG so it stays under 50 KB and runs on low-end phones.

## State model
Single source of truth: `useEcoState()` hook in `src/lib/eco/storage.ts`.
It persists an `Action[]` to `localStorage` under the key `ecoascent:v1`.
Derived values (`totalCO2`, `worldState`) are pure functions of that array.

```text
useEcoState  ──►  totalCO2  ──►  worldState() ──►  <LivingWorld /> palette
      │                              │
      └──► actions[] ──► <ActionLog />, <Leaderboard />
```

## Component map
```text
src/
├── routes/index.tsx          # composition root, view switcher
├── components/eco/
│   ├── LivingWorld.tsx           # shell: parallax + SR title/desc
│   ├── living-world/
│   │   ├── Scene.tsx             # one sky+hills+trees backdrop
│   │   ├── Trees.tsx             # tree / stump SVG
│   │   ├── Atmosphere.tsx        # smoke + pollen particles
│   │   └── palettes.ts           # scene colors + tree composition
│   ├── WorldMeter.tsx            # health bar + headline
│   ├── ActionLog.tsx             # orchestrator
│   ├── action-log/
│   │   ├── CategoryTabs.tsx      # segmented control
│   │   ├── PresetGrid.tsx        # preset chips
│   │   └── RecentActions.tsx     # logged-action list
│   ├── Leaderboard.tsx           # neighborhood ranking (semantic table)
│   └── Dock.tsx                  # bottom nav
└── lib/eco/
    ├── actions.ts                # PRESETS + worldState() + worldHeadline()
    ├── leaderboard-data.ts       # neighborhood seed groups
    └── storage.ts                # useEcoState hook + formatRelative
```

Components are deliberately small (most under 100 LOC) and stateless where
possible. Each visual concern lives in its own file so reviewers can audit one
responsibility at a time. All exported functions and components carry TSDoc.