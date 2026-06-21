import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Leaderboard } from "./Leaderboard";

describe("<Leaderboard />", () => {
  it("renders as a semantic table with header columns", () => {
    render(<Leaderboard totalCO2={40} />);
    const table = screen.getByRole("table");
    expect(within(table).getByRole("columnheader", { name: /rank/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /house/i })).toBeInTheDocument();
  });

  it("places the user at rank 1 when their score is the lowest", () => {
    render(<Leaderboard totalCO2={0} />);
    const rows = screen.getAllByTestId("leaderboard-row");
    expect(within(rows[0]).getByText(/your house/i)).toBeInTheDocument();
  });

  it("places the user last when their score is the highest", () => {
    render(<Leaderboard totalCO2={500} />);
    const rows = screen.getAllByTestId("leaderboard-row");
    expect(within(rows[rows.length - 1]).getByText(/your house/i)).toBeInTheDocument();
  });

  it("sorts ascending by score (lowest footprint first)", () => {
    render(<Leaderboard totalCO2={40} />);
    const rows = screen.getAllByTestId("leaderboard-row");
    const scores = rows.map((r) => {
      const cells = within(r).getAllByRole("cell");
      return parseFloat(cells[cells.length - 1].textContent ?? "0");
    });
    const sorted = [...scores].sort((a, b) => a - b);
    expect(scores).toEqual(sorted);
  });
});
