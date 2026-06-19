import { useEffect, useLayoutEffect, useState, useCallback, useMemo } from "react";
import type { Category } from "./actions";

export type Action = {
  id: string;
  category: Category;
  label: string;
  co2: number;
  loggedAt: number;
};

const KEY = "ecoascent:v1";
const SEEDED_KEY = "ecoascent:seeded";

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

/** SSR-safe synchronous resolver: returns existing actions, seed for first-time
 *  visitors, or [] on the server. Runs in `useState`'s lazy initializer so the
 *  very first client render already shows a populated world. */
function resolveInitial(): Action[] {
  if (typeof window === "undefined") return [];
  const existing = read().actions;
  if (existing.length > 0) return existing;
  const alreadySeeded = window.localStorage.getItem(SEEDED_KEY) === "1";
  if (alreadySeeded) return [];
  const seeded = buildSeed();
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ actions: seeded }));
    window.localStorage.setItem(SEEDED_KEY, "1");
  } catch {
    /* ignore */
  }
  return seeded;
}

/**
 * React hook that owns the user's eco-action log.
 * Persists to localStorage, recovers from corrupt JSON, seeds first-time
 * visitors with a few sample actions, and memoises derived totals.
 */
export function useEcoState() {
  // Lazy init keeps SSR safe (returns []) while the client gets seeded data
  // synchronously on first render. A useLayoutEffect bridges SSR -> CSR before
  // paint so users never see the empty "0.0 kg / 0 actions" flash.
  const [actions, setActions] = useState<Action[]>(resolveInitial);
  const [hydrated, setHydrated] = useState(typeof window !== "undefined");

  useLayoutEffect(() => {
    if (hydrated) return;
    setActions(resolveInitial());
    setHydrated(true);
  }, [hydrated]);

  useEffect(() => {
    if (hydrated) write({ actions });
  }, [actions, hydrated]);

  const addAction = useCallback(
    (a: Omit<Action, "id" | "loggedAt">) => {
      setActions((prev) => [
        {
          ...a,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          loggedAt: Date.now(),
        },
        ...prev,
      ]);
    },
    [],
  );

  const removeAction = useCallback((id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAll = useCallback(() => setActions([]), []);

  const totalCO2 = useMemo(
    () => actions.reduce((sum, a) => sum + a.co2, 0),
    [actions],
  );

  return { actions, addAction, removeAction, clearAll, totalCO2, hydrated };
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