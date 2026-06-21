import { describe, beforeEach, it, expect } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import {
  INITIAL_ACTIONS,
  formatRelative,
  useActions,
  useEcoState,
  useWorldState,
  type Action,
} from "./storage";

describe("useEcoState", () => {
  beforeEach(() => {
    // Mark as already-seeded so tests start from a clean, empty log.
    window.localStorage.setItem("ecoascent:seeded", "1");
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useEcoState());
    expect(result.current.actions).toEqual([]);
    expect(result.current.totalCO2).toBe(0);
  });

  it("adds, totals, and removes actions", () => {
    const { result } = renderHook(() => useEcoState());
    act(() => {
      result.current.addAction({ category: "transit", label: "Car", co2: 6 });
      result.current.addAction({ category: "offset", label: "Tree", co2: -20 });
    });
    expect(result.current.actions).toHaveLength(2);
    expect(result.current.totalCO2).toBeCloseTo(-14);
    const firstId = result.current.actions[0].id;
    act(() => result.current.removeAction(firstId));
    expect(result.current.actions).toHaveLength(1);
  });

  it("clearAll empties the log", () => {
    const { result } = renderHook(() => useEcoState());
    act(() => {
      result.current.addAction({ category: "food", label: "Beef", co2: 7 });
      result.current.clearAll();
    });
    expect(result.current.actions).toEqual([]);
  });

  it("survives corrupt localStorage gracefully", () => {
    window.localStorage.setItem("ecoascent:v1", "{not json");
    const { result } = renderHook(() => useEcoState());
    expect(result.current.actions).toEqual([]);
  });

  it("first render output matches the SSR-safe INITIAL_ACTIONS (no hydration mismatch)", () => {
    // Capture the value of `actions` from the very first render — before any
    // effects have flushed — to lock in identical server/client output.
    let firstRenderValue: ReadonlyArray<Action> | null = null;
    function Probe() {
      const { actions } = useEcoState();
      if (firstRenderValue === null) firstRenderValue = actions;
      return null;
    }
    render(<Probe />);
    expect(firstRenderValue).toEqual(INITIAL_ACTIONS);
  });
});

describe("useActions / useWorldState split", () => {
  beforeEach(() => {
    window.localStorage.setItem("ecoascent:seeded", "1");
  });

  it("useActions owns the log without computing totals", () => {
    const { result } = renderHook(() => useActions());
    expect("totalCO2" in result.current).toBe(false);
    act(() => result.current.addAction({ category: "food", label: "Beef", co2: 7 }));
    expect(result.current.actions).toHaveLength(1);
  });

  it("useWorldState derives totalCO2 / state / headline purely", () => {
    const actions: Action[] = [
      { id: "1", category: "transit", label: "Flight", co2: 90, loggedAt: 0 },
    ];
    const { result } = renderHook(() => useWorldState(actions));
    expect(result.current.totalCO2).toBe(90);
    expect(result.current.state).toBe("critical");
    expect(result.current.headline.toLowerCase()).toMatch(/choking|act/);
  });
});

describe("formatRelative", () => {
  it("returns 'just now' for <1m", () => {
    expect(formatRelative(Date.now())).toBe("just now");
  });
  it("returns minutes, hours, days", () => {
    const now = Date.now();
    expect(formatRelative(now - 5 * 60_000)).toBe("5m ago");
    expect(formatRelative(now - 3 * 3600_000)).toBe("3h ago");
    expect(formatRelative(now - 2 * 86400_000)).toBe("2d ago");
  });
});
