import { describe, it, expect } from "vitest";
import { NEIGHBORHOOD_GROUPS } from "./leaderboard-data";

describe("NEIGHBORHOOD_GROUPS seed data", () => {
  it("has at least one peer group", () => {
    expect(NEIGHBORHOOD_GROUPS.length).toBeGreaterThan(0);
  });
  it("every group has a non-empty name and a finite score", () => {
    for (const g of NEIGHBORHOOD_GROUPS) {
      expect(g.name.length).toBeGreaterThan(0);
      expect(Number.isFinite(g.score)).toBe(true);
    }
  });
  it("group names are unique", () => {
    const names = NEIGHBORHOOD_GROUPS.map((g) => g.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
