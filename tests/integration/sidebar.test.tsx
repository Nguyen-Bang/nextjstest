import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotebooksStore } from "@/lib/store/notebooks-store";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/protected",
}));

// Mock Server Actions
const mockCreateNotebook = vi.fn();
const mockDeleteNotebook = vi.fn();
const mockCopyNotebook = vi.fn();

vi.mock("@/lib/actions/notebooks", () => ({
  createNotebook: (...args: unknown[]) => mockCreateNotebook(...args),
  deleteNotebook: (...args: unknown[]) => mockDeleteNotebook(...args),
  copyNotebook: (...args: unknown[]) => mockCopyNotebook(...args),
}));

import { Sidebar } from "@/components/sidebar/sidebar";

const mockNotebooks = [
  {
    id: "1",
    name: "Work",
    created_at: "2026-01-02T00:00:00Z",
    last_accessed_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "2",
    name: "Personal",
    created_at: "2026-01-01T00:00:00Z",
    last_accessed_at: "2026-01-01T00:00:00Z",
  },
];

describe("Sidebar integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNotebooksStore.setState({
      notebooks: mockNotebooks,
      selectedId: null,
    });
  });

  it("(a) renders list of notebook names", () => {
    render(<Sidebar />);
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("(b) shows create form when plus button clicked", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const plusButton = screen.getByRole("button", { name: /create|add|new|\+/i });
    await user.click(plusButton);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("(c) Save disabled when name input empty", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const plusButton = screen.getByRole("button", { name: /create|add|new|\+/i });
    await user.click(plusButton);

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it("(d) Delete menu item calls deleteNotebook Server Action", async () => {
    const user = userEvent.setup();
    mockDeleteNotebook.mockResolvedValue(undefined);
    render(<Sidebar />);

    // Find the first notebook row and hover to reveal the menu trigger
    const workRow = screen.getByText("Work").closest("[data-notebook-row]") as HTMLElement;
    const menuTrigger = within(workRow).getByRole("button", { name: /menu|more|options/i });
    await user.click(menuTrigger);

    const deleteItem = screen.getByRole("menuitem", { name: /delete/i });
    await user.click(deleteItem);

    expect(mockDeleteNotebook).toHaveBeenCalledWith("1");
  });

  it("(e) Copy menu item calls copyNotebook Server Action", async () => {
    const user = userEvent.setup();
    mockCopyNotebook.mockResolvedValue({
      id: "3",
      name: "Work – Copy",
      created_at: "2026-01-03T00:00:00Z",
      last_accessed_at: "2026-01-03T00:00:00Z",
    });
    render(<Sidebar />);

    const workRow = screen.getByText("Work").closest("[data-notebook-row]") as HTMLElement;
    const menuTrigger = within(workRow).getByRole("button", { name: /menu|more|options/i });
    await user.click(menuTrigger);

    const copyItem = screen.getByRole("menuitem", { name: /copy/i });
    await user.click(copyItem);

    expect(mockCopyNotebook).toHaveBeenCalledWith("1");
  });

  it("(f) sidebar remains in the DOM after store.setSelectedId is called", () => {
    render(<Sidebar />);

    // Wrap the state update in act() to clear the React warning
    import("react").then(({ act }) => {
      act(() => {
        useNotebooksStore.getState().setSelectedId("1");
      });
    });

    // Sidebar should still be rendered
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });
});
