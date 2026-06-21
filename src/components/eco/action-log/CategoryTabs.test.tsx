import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryTabs } from "./CategoryTabs";

describe("<CategoryTabs />", () => {
  it("marks the active tab with aria-pressed", () => {
    render(<CategoryTabs value="food" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /food/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /transit/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange when a different tab is clicked", () => {
    const onChange = vi.fn();
    render(<CategoryTabs value="transit" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /green offsets/i }));
    expect(onChange).toHaveBeenCalledWith("offset");
  });
});