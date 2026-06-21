import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecentActions } from "./RecentActions";

describe("<RecentActions />", () => {
  it("shows an empty-state message when there are no actions", () => {
    render(<RecentActions actions={[]} onRemove={() => {}} />);
    expect(screen.getByText(/waiting for its first story/i)).toBeInTheDocument();
  });

  it("renders one row per action and calls onRemove with the right id", () => {
    const onRemove = vi.fn();
    render(
      <RecentActions
        actions={[
          { id: "a", category: "transit", label: "Bus ride", co2: 2, loggedAt: Date.now() },
          { id: "b", category: "food", label: "Beef meal", co2: 7, loggedAt: Date.now() },
        ]}
        onRemove={onRemove}
      />,
    );
    expect(screen.getAllByRole("button", { name: /remove action/i })).toHaveLength(2);
    fireEvent.click(screen.getAllByRole("button", { name: /remove action/i })[1]);
    expect(onRemove).toHaveBeenCalledWith("b");
  });
});