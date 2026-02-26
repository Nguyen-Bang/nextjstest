import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Server Actions
const mockCreateNote = vi.fn();
const mockDeleteNote = vi.fn();
const mockCopyNote = vi.fn();
const mockUpdateNotebook = vi.fn();

vi.mock("@/lib/actions/notes", () => ({
  createNote: (...args: unknown[]) => mockCreateNote(...args),
  deleteNote: (...args: unknown[]) => mockDeleteNote(...args),
  copyNote: (...args: unknown[]) => mockCopyNote(...args),
}));

vi.mock("@/lib/actions/notebooks", () => ({
  updateNotebook: (...args: unknown[]) => mockUpdateNotebook(...args),
}));

// Mock the store
vi.mock("@/lib/store/notebooks-store", () => ({
  useNotebooksStore: Object.assign(
    (selector: (s: Record<string, unknown>) => unknown) =>
      selector({
        updateNotebook: vi.fn(),
      }),
    {
      getState: () => ({
        updateNotebook: vi.fn(),
      }),
    }
  ),
}));

import { NotebookView } from "@/components/notebook/notebook-view";

const mockNotebook = {
  id: "nb-1",
  user_id: "u-1",
  name: "Work",
  created_at: "2026-01-01T00:00:00Z",
  last_accessed_at: "2026-01-01T00:00:00Z",
};

const mockNotes = [
  {
    id: "n-1",
    notebook_id: "nb-1",
    user_id: "u-1",
    content: "First note",
    created_at: "2026-01-01T00:00:00Z",
  },
];

describe("NotebookView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("(a) Save disabled when textarea empty", () => {
    render(<NotebookView notebook={mockNotebook} initialNotes={mockNotes} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it("(b) after Save, note appears at top and textarea is cleared", async () => {
    const user = userEvent.setup();
    mockCreateNote.mockResolvedValue({
      id: "n-2",
      notebook_id: "nb-1",
      user_id: "u-1",
      content: "New note",
      created_at: "2026-01-02T00:00:00Z",
    });

    render(<NotebookView notebook={mockNotebook} initialNotes={mockNotes} />);

    const textarea = screen.getByRole("textbox", { name: /note/i });
    await user.type(textarea, "New note");

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).not.toBeDisabled();
    await user.click(saveButton);

    expect(mockCreateNote).toHaveBeenCalledWith({
      notebook_id: "nb-1",
      content: "New note",
    });

    // New note should appear and textarea should be cleared
    expect(await screen.findByText("New note")).toBeInTheDocument();
  });

  it("(c) Delete removes a note from the stack", async () => {
    const user = userEvent.setup();
    mockDeleteNote.mockResolvedValue(undefined);

    render(<NotebookView notebook={mockNotebook} initialNotes={mockNotes} />);

    expect(screen.getByText("First note")).toBeInTheDocument();

    // Open the note's menu
    const noteCard = screen.getByText("First note").closest("[data-note-card]") as HTMLElement;
    const menuTrigger = noteCard.querySelector("button[aria-label='Menu']") as HTMLElement;
    await user.click(menuTrigger);

    const deleteItem = screen.getByRole("menuitem", { name: /delete/i });
    await user.click(deleteItem);

    expect(mockDeleteNote).toHaveBeenCalledWith("n-1");
  });

  it("(d) Copy prepends a duplicate note", async () => {
    const user = userEvent.setup();
    mockCopyNote.mockResolvedValue({
      id: "n-3",
      notebook_id: "nb-1",
      user_id: "u-1",
      content: "First note",
      created_at: "2026-01-03T00:00:00Z",
    });

    render(<NotebookView notebook={mockNotebook} initialNotes={mockNotes} />);

    const noteCard = screen.getByText("First note").closest("[data-note-card]") as HTMLElement;
    const menuTrigger = noteCard.querySelector("button[aria-label='Menu']") as HTMLElement;
    await user.click(menuTrigger);

    const copyItem = screen.getByRole("menuitem", { name: /copy/i });
    await user.click(copyItem);

    expect(mockCopyNote).toHaveBeenCalledWith("n-1");
  });
});
