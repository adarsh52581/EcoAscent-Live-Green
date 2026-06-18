import { describe, it, expect } from "vitest";
import { worldState, worldHeadline, WORLD_THRESHOLDS, PRESETS, CATEGORY_META } from "./actions";

describe("worldState thresholds", () => {
  it("pristine for low totals (including negative)", () => {
    expect(worldState(-50)).toBe("pristine");
    expect(worldState(0)).toBe("pristine");
    expect(worldState(WORLD_THRESHOLDS.pristine - 0.01)).toBe("pristine");
  });
  it("moderate between pristine and moderate threshold", () => {
    expect(worldState(WORLD_THRESHOLDS.pristine)).toBe("moderate");
    expect(worldState(WORLD_THRESHOLDS.moderate - 0.01)).toBe("moderate");
  });
  it("strained between moderate and strained threshold", () => {
    expect(worldState(WORLD_THRESHOLDS.moderate)).toBe("strained");
    expect(worldState(WORLD_THRESHOLDS.strained - 0.01)).toBe("strained");
  });
  it("critical at or above strained threshold", () => {
    expect(worldState(WORLD_THRESHOLDS.strained)).toBe("critical");
    expect(worldState(1000)).toBe("critical");
  });
});

describe("worldHeadline", () => {
  it("returns a non-empty string for every state", () => {
    for (const s of ["pristine", "moderate", "strained", "critical"] as const) {
      expect(worldHeadline(s).length).toBeGreaterThan(0);
    }
  });
  it("escalates emotionally toward critical", () => {
    expect(worldHeadline("critical").toLowerCase()).toMatch(/choking|act/);
    expect(worldHeadline("pristine").toLowerCase()).toMatch(/breathing|easy/);
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