import { describe, it, expect, beforeEach } from "vitest";
import { useNotebooksStore } from "@/lib/store/notebooks-store";
import type { NotebookEntry } from "@/lib/types";

const mockNotebook: NotebookEntry = {
  id: "1",
  name: "Test Notebook",
  created_at: "2026-01-01T00:00:00Z",
  last_accessed_at: "2026-01-01T00:00:00Z",
};

const mockNotebook2: NotebookEntry = {
  id: "2",
  name: "Second Notebook",
  created_at: "2026-01-02T00:00:00Z",
  last_accessed_at: "2026-01-02T00:00:00Z",
};

describe("notebooks-store", () => {
  beforeEach(() => {
    // Reset store to initial state
    useNotebooksStore.setState({
      notebooks: [],
      selectedId: null,
    });
  });

  it("addNotebook prepends a notebook to the list", () => {
    useNotebooksStore.getState().addNotebook(mockNotebook);
    expect(useNotebooksStore.getState().notebooks).toHaveLength(1);
    expect(useNotebooksStore.getState().notebooks[0]).toEqual(mockNotebook);

    useNotebooksStore.getState().addNotebook(mockNotebook2);
    expect(useNotebooksStore.getState().notebooks).toHaveLength(2);
    expect(useNotebooksStore.getState().notebooks[0]).toEqual(mockNotebook2);
  });

  it("removeNotebook removes a notebook by id", () => {
    useNotebooksStore.setState({ notebooks: [mockNotebook, mockNotebook2] });
    useNotebooksStore.getState().removeNotebook("1");
    expect(useNotebooksStore.getState().notebooks).toHaveLength(1);
    expect(useNotebooksStore.getState().notebooks[0].id).toBe("2");
  });

  it("updateNotebook patches a notebook by id", () => {
    useNotebooksStore.setState({ notebooks: [mockNotebook] });
    useNotebooksStore.getState().updateNotebook("1", { name: "Updated" });
    expect(useNotebooksStore.getState().notebooks[0].name).toBe("Updated");
  });

  it("setSelectedId updates the selected notebook id", () => {
    useNotebooksStore.getState().setSelectedId("1");
    expect(useNotebooksStore.getState().selectedId).toBe("1");

    useNotebooksStore.getState().setSelectedId(null);
    expect(useNotebooksStore.getState().selectedId).toBeNull();
  });

  it("setNotebooks replaces the entire notebook list", () => {
    useNotebooksStore.getState().setNotebooks([mockNotebook, mockNotebook2]);
    expect(useNotebooksStore.getState().notebooks).toHaveLength(2);
    expect(useNotebooksStore.getState().notebooks[0]).toEqual(mockNotebook);
    expect(useNotebooksStore.getState().notebooks[1]).toEqual(mockNotebook2);
  });
});
