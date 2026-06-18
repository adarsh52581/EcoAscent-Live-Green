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
│   ├── LivingWorld.tsx       # 3 cross-fading SVG scenes + parallax
│   ├── WorldMeter.tsx        # health bar + headline
│   ├── ActionLog.tsx         # preset chips + custom note
│   ├── Leaderboard.tsx       # neighborhood ranking
│   └── Dock.tsx              # bottom nav
└── lib/eco/
    ├── actions.ts            # PRESETS catalog + worldState()
    └── storage.ts            # useEcoState hook + formatRelative
```

Components are deliberately small (<200 LOC each) and stateless where possible.