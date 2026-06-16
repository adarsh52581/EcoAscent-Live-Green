import { useEffect, useState, useCallback } from "react";
import type { Category } from "./actions";

export type Action = {
  id: string;
  category: Category;
  label: string;
  co2: number;
  loggedAt: number;
};

const KEY = "ecoascent:v1";

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

export function useEcoState() {
  const [actions, setActions] = useState<Action[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setActions(read().actions);
    setHydrated(true);
  }, []);

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

  const totalCO2 = actions.reduce((sum, a) => sum + a.co2, 0);

  return { actions, addAction, removeAction, clearAll, totalCO2, hydrated };
}

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