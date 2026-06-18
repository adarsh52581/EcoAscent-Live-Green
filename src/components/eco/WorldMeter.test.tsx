import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorldMeter } from "./WorldMeter";

describe("<WorldMeter />", () => {
  it("shows the pristine headline at low CO₂", () => {
    render(<WorldMeter totalCO2={0} count={0} />);
    expect(screen.getByText(/breathing easy/i)).toBeInTheDocument();
  });

  it("shows the moderate headline in the moderate band", () => {
    render(<WorldMeter totalCO2={30} count={3} />);
    expect(screen.getByText(/air is getting heavier/i)).toBeInTheDocument();
  });

  it("shows the strained headline in the strained band", () => {
    render(<WorldMeter totalCO2={70} count={5} />);
    expect(screen.getByText(/struggling/i)).toBeInTheDocument();
  });

  it("shows the critical headline at high CO₂ with progressbar aria values", () => {
    render(<WorldMeter totalCO2={120} count={10} />);
    expect(screen.getByText(/choking/i)).toBeInTheDocument();
    const bar = screen.getByRole("progressbar", { name: /world health/i });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });
});