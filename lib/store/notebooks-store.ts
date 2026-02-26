import { create } from "zustand";
import type { NotebookEntry, NotebooksState } from "@/lib/types";

export const useNotebooksStore = create<NotebooksState>((set) => ({
  notebooks: [],
  selectedId: null,

  setNotebooks: (notebooks: NotebookEntry[]) => set({ notebooks }),

  setSelectedId: (id: string | null) => set({ selectedId: id }),

  addNotebook: (notebook: NotebookEntry) =>
    set((state) => ({ notebooks: [notebook, ...state.notebooks] })),

  removeNotebook: (id: string) =>
    set((state) => ({
      notebooks: state.notebooks.filter((n) => n.id !== id),
    })),

  updateNotebook: (id: string, patch: Partial<NotebookEntry>) =>
    set((state) => ({
      notebooks: state.notebooks.map((n) =>
        n.id === id ? { ...n, ...patch } : n
      ),
    })),
}));
