/* ── Notebook ─────────────────────────────────────────── */

export interface Notebook {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  last_accessed_at: string;
}

export interface NewNotebook {
  name: string;
}

export interface NotebookUpdate {
  name?: string;
  last_accessed_at?: string;
}

/* ── Note ────────────────────────────────────────────── */

export interface Note {
  id: string;
  notebook_id: string;
  content: string;
  created_at: string;
}

export interface NewNote {
  notebook_id: string;
  content: string;
}

/* ── Sidebar / Store ─────────────────────────────────── */

export interface NotebookEntry {
  id: string;
  name: string;
  created_at: string;
  last_accessed_at: string;
}

export interface NotebooksState {
  notebooks: NotebookEntry[];
  selectedId: string | null;
  setNotebooks: (notebooks: NotebookEntry[]) => void;
  setSelectedId: (id: string | null) => void;
  addNotebook: (notebook: NotebookEntry) => void;
  removeNotebook: (id: string) => void;
  updateNotebook: (id: string, patch: Partial<NotebookEntry>) => void;
}

/* ── Dashboard ───────────────────────────────────────── */

export interface DashboardStats {
  notebookCount: number;
  lastAccessedNotebook: { id: string; name: string } | null;
}
