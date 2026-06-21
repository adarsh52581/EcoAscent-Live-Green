import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionLog } from "./ActionLog";

describe("<ActionLog />", () => {
  it("logs an action when a preset chip is selected and submit is clicked", () => {
    const onAdd = vi.fn();
    render(<ActionLog actions={[]} onAdd={onAdd} onRemove={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /car commute/i }));
    fireEvent.click(screen.getByRole("button", { name: /log this action/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0]).toMatchObject({
      category: "transit",
      label: "Car commute",
      co2: 6,
    });
  });

  it("shows an error when submitting without picking a preset", () => {
    const onAdd = vi.fn();
    render(<ActionLog actions={[]} onAdd={onAdd} onRemove={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /log this action/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/pick an action/i);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("switches preset list when category tab changes", () => {
    render(<ActionLog actions={[]} onAdd={() => {}} onRemove={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /^food$/i }));
    expect(screen.getByRole("button", { name: /beef meal/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /car commute/i })).not.toBeInTheDocument();
  });

  it("calls onRemove for a logged action", () => {
    const onRemove = vi.fn();
    render(
      <ActionLog
        actions={[
          { id: "x1", category: "transit", label: "Bus ride", co2: 2, loggedAt: Date.now() },
        ]}
        onAdd={() => {}}
        onRemove={onRemove}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /remove action/i }));
    expect(onRemove).toHaveBeenCalledWith("x1");
  });
});
