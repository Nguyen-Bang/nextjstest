import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableHeading } from "@/components/notebook/editable-heading";

describe("EditableHeading", () => {
  it("(a) click heading → input appears", async () => {
    const user = userEvent.setup();
    render(<EditableHeading value="My Notebook" onSave={vi.fn()} />);

    const heading = screen.getByRole("heading", { level: 1 });
    await user.click(heading);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("(b) clear input + blur → heading reverts to original text", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableHeading value="My Notebook" onSave={onSave} />);

    const heading = screen.getByRole("heading", { level: 1 });
    await user.click(heading);

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.tab(); // blur

    // Should revert, onSave NOT called
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "My Notebook"
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("(c) type new name + Enter → heading shows new name", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableHeading value="My Notebook" onSave={onSave} />);

    const heading = screen.getByRole("heading", { level: 1 });
    await user.click(heading);

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "New Name{Enter}");

    expect(onSave).toHaveBeenCalledWith("New Name");
  });
});
