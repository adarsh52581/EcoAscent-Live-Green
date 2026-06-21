import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PresetGrid } from "./PresetGrid";
import { PRESETS } from "@/lib/eco/actions";

const transit = PRESETS.filter((p) => p.category === "transit");

describe("<PresetGrid />", () => {
  it("renders one button per preset", () => {
    render(<PresetGrid presets={transit} selectedId={null} onSelect={() => {}} />);
    expect(screen.getAllByRole("button").length).toBe(transit.length);
  });

  it("marks the selected preset with aria-pressed", () => {
    render(<PresetGrid presets={transit} selectedId="car" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: /car commute/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onSelect with the preset id when clicked", () => {
    const onSelect = vi.fn();
    render(<PresetGrid presets={transit} selectedId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /train ride/i }));
    expect(onSelect).toHaveBeenCalledWith("train");
  });

  it("gracefully renders an empty preset list", () => {
    const { container } = render(<PresetGrid presets={[]} selectedId={null} onSelect={() => {}} />);
    expect(container.querySelectorAll("button").length).toBe(0);
  });
});
