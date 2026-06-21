import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dock } from "./Dock";

describe("<Dock />", () => {
  it("renders three nav buttons", () => {
    render(<Dock view="world" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /world/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ranks/i })).toBeInTheDocument();
  });

  it("marks the active button with aria-current", () => {
    render(<Dock view="log" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /log/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: /world/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("calls onChange when a different view is clicked", () => {
    const onChange = vi.fn();
    render(<Dock view="world" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /ranks/i }));
    expect(onChange).toHaveBeenCalledWith("board");
  });
});