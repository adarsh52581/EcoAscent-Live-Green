import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LivingWorld } from "./LivingWorld";

describe("<LivingWorld />", () => {
  it("renders an accessible SVG with title + desc the aria-labelledby points to", () => {
    const { container } = render(<LivingWorld totalCO2={0} />);
    const svg = container.querySelector('svg[role="img"]');
    expect(svg).not.toBeNull();
    const ids = svg!.getAttribute("aria-labelledby")!.split(" ");
    for (const id of ids) {
      expect(container.querySelector(`#${CSS.escape(id)}`)).not.toBeNull();
    }
    expect(svg!.querySelector("title")!.textContent).toMatch(/pristine/);
  });

  it("describes the critical state when CO₂ is high", () => {
    const { container } = render(<LivingWorld totalCO2={500} />);
    const svg = container.querySelector('svg[role="img"]');
    expect(svg!.querySelector("title")!.textContent).toMatch(/critical/);
  });

  it("describes the moderate state in the moderate band", () => {
    const { container } = render(<LivingWorld totalCO2={30} />);
    const svg = container.querySelector('svg[role="img"]');
    expect(svg!.querySelector("title")!.textContent).toMatch(/moderate/);
  });
});