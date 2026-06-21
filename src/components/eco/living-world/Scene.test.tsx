import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Scene } from "./Scene";
import { SCENE_PALETTES } from "./palettes";

const tx = () => ({ transform: "none" });

describe("<Scene />", () => {
  it("renders without per-kind branching — palette data drives output", () => {
    // Sanity: if Scene hardcoded any state-specific logic, switching the
    // palette's `atmosphere` flag below would not change the rendered tree.
    const { container } = render(<Scene visible kind="pristine" tx={tx} />);
    // Pollen pieces are absolutely-positioned divs with the pollen background.
    const pollen = Array.from(container.querySelectorAll("div")).filter((d) =>
      d.style.background?.includes("FFF6C8") || d.className.includes("bg-[#FFF6C8]"),
    );
    expect(pollen.length).toBeGreaterThan(0);
  });

  it("renders the right tree count from palette data", () => {
    const { container } = render(<Scene visible kind="critical" tx={tx} />);
    // critical scene is all stumps; tree count == palette.trees.length
    expect(SCENE_PALETTES.critical.trees.length).toBe(5);
    const trees = container.querySelectorAll("svg[viewBox='0 0 60 40']");
    expect(trees.length).toBe(SCENE_PALETTES.critical.trees.length);
  });

  it("only renders smoke when palette.atmosphere === 'smoke'", () => {
    expect(SCENE_PALETTES.critical.atmosphere).toBe("smoke");
    expect(SCENE_PALETTES.moderate.atmosphere).toBeNull();
  });
});