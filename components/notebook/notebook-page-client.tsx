"use client";

import { useEffect } from "react";
import { useNotebooksStore } from "@/lib/store/notebooks-store";
import { NotebookView } from "@/components/notebook/notebook-view";
import type { Notebook, Note } from "@/lib/types";

interface NotebookPageClientProps {
  notebook: Notebook;
  notes: Note[];
}

export function NotebookPageClient({ notebook, notes }: NotebookPageClientProps) {
  const setSelectedId = useNotebooksStore((s) => s.setSelectedId);
  const updateNotebook = useNotebooksStore((s) => s.updateNotebook);

  useEffect(() => {
    setSelectedId(notebook.id);
    updateNotebook(notebook.id, {
      last_accessed_at: notebook.last_accessed_at,
    });

    return () => {
      // Clear selection when leaving the page
    };
  }, [notebook.id, notebook.last_accessed_at, setSelectedId, updateNotebook]);

  return <NotebookView notebook={notebook} initialNotes={notes} />;
}
