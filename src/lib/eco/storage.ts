import { useEffect, useState, useCallback, useMemo } from "react";
import type { Category, WorldState } from "./actions";
import { worldHeadline, worldState } from "./actions";

export type Action = {
  id: string;
  category: Category;
  label: string;
  co2: number;
  loggedAt: number;
};

const KEY = "ecoascent:v1";
const SEEDED_KEY = "ecoascent:seeded";

/**
 * The single value used as the initial state in BOTH the server render and
 * the very first client render — guarantees no hydration mismatch (React #418).
 * Frozen so accidental mutation surfaces immediately in tests.
 */
export const INITIAL_ACTIONS: readonly Action[] = Object.freeze([]);

type State = { actions: Action[] };

function read(): State {
  if (typeof window === "undefined") return { actions: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { actions: [] };
    const parsed = JSON.parse(raw) as State;
    if (!parsed || !Array.isArray(parsed.actions)) return { actions: [] };
    return parsed;
  } catch {
    return { actions: [] };
  }
}

function write(state: State) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

/** Seed data shown to first-time visitors so the Living World immediately reacts. */
const SEED_ACTIONS: Omit<Action, "id" | "loggedAt">[] = [
  { category: "transit", label: "Car commute", co2: 6 },
  { category: "food", label: "Beef meal", co2: 7 },
  { category: "offset", label: "Cycled instead", co2: -2 },
];

function buildSeed(): Action[] {
  const now = Date.now();
  return SEED_ACTIONS.map((a, i) => ({
    ...a,
    id: `seed-${i}`,
    loggedAt: now - (i + 1) * 3600_000,
  }));
}

/**
 * Resolves the actions visible after hydration: prefers persisted data,
 * falls back to seed data on first visit, otherwise [].
 * Must only be called in the browser (inside `useEffect`).
 */
function resolvePostHydration(): Action[] {
  const existing = read().actions;
  if (existing.length > 0) return existing;
  const alreadySeeded = window.localStorage.getItem(SEEDED_KEY) === "1";
  if (alreadySeeded) return [];
  const seeded = buildSeed();
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ actions: seeded }));
    window.localStorage.setItem(SEEDED_KEY, "1");
  } catch {
    /* ignore quota */
  }
  return seeded;
}

/**
 * Single-responsibility hook that owns the action log: persistence,
 * hydration, and CRUD. Derived values (total CO₂, world state) live in
 * `useWorldState` so this hook stays pure-state.
 *
 * Hydration safety: the lazy initializer returns the same `INITIAL_ACTIONS`
 * constant on the server and on the client's very first render — guaranteeing
 * identical HTML and zero React #418 warnings. Real data is resolved in a
 * post-mount `useEffect`.
 */
export function useActions(): {
  actions: Action[];
  addAction: (a: Omit<Action, "id" | "loggedAt">) => void;
  removeAction: (id: string) => void;
  clearAll: () => void;
  hydrated: boolean;
} {
  const [actions, setActions] = useState<Action[]>(() => INITIAL_ACTIONS as Action[]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setActions(resolvePostHydration());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write({ actions });
  }, [actions, hydrated]);

  const addAction = useCallback((a: Omit<Action, "id" | "loggedAt">) => {
    setActions((prev) => [
      {
        ...a,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        loggedAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const removeAction = useCallback((id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAll = useCallback(() => setActions([]), []);

  return { actions, addAction, removeAction, clearAll, hydrated };
}

/**
 * Pure selector hook that derives the cumulative CO₂, the matching
 * world state bucket, and its headline from a list of actions. Stateless —
 * safe to compose anywhere.
 */
export function useWorldState(actions: ReadonlyArray<Action>): {
  totalCO2: number;
  state: WorldState;
  headline: string;
} {
  return useMemo(() => {
    const totalCO2 = actions.reduce((sum, a) => sum + a.co2, 0);
    const state = worldState(totalCO2);
    return { totalCO2, state, headline: worldHeadline(state) };
  }, [actions]);
}

/**
 * Backwards-compatible convenience that composes {@link useActions} and
 * {@link useWorldState}. New code should prefer the two split hooks.
 */
export function useEcoState(): ReturnType<typeof useActions> & {
  totalCO2: number;
  state: WorldState;
  headline: string;
} {
  const log = useActions();
  const derived = useWorldState(log.actions);
  return { ...log, ...derived };
}

/**
 * Compact human-readable "time ago" string for a past timestamp.
 * Resolution: just-now → minutes → hours → days.
 */
export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
