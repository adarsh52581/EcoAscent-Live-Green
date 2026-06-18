import { describe, it, expect } from "vitest";
import { worldState, PRESETS, CATEGORY_META } from "./actions";

describe("worldState thresholds", () => {
  it("pristine for low totals (including negative)", () => {
    expect(worldState(-50)).toBe("pristine");
    expect(worldState(0)).toBe("pristine");
    expect(worldState(19.99)).toBe("pristine");
  });
  it("moderate between 20 and 80", () => {
    expect(worldState(20)).toBe("moderate");
    expect(worldState(79.99)).toBe("moderate");
  });
  it("critical at or above 80", () => {
    expect(worldState(80)).toBe("critical");
    expect(worldState(1000)).toBe("critical");
  });
});

describe("PRESETS catalog", () => {
  it("has unique ids", () => {
    const ids = PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("offsets are negative, others non-negative", () => {
    for (const p of PRESETS) {
      if (p.category === "offset") expect(p.co2).toBeLessThan(0);
      else expect(p.co2).toBeGreaterThanOrEqual(0);
    }
  });
  it("every preset category has metadata", () => {
    for (const p of PRESETS) {
      expect(CATEGORY_META[p.category]).toBeDefined();
    }
  });
});