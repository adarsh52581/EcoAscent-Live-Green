import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEcoState, formatRelative } from "./storage";

describe("useEcoState", () => {
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