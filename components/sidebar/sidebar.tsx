"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotebooksStore } from "@/lib/store/notebooks-store";
import { NotebookRow } from "./notebook-row";
import { CreateNotebookForm } from "./create-notebook-form";
import {
  createNotebook,
  deleteNotebook,
  copyNotebook,
} from "@/lib/actions/notebooks";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const notebooks = useNotebooksStore((s) => s.notebooks);
  const selectedId = useNotebooksStore((s) => s.selectedId);
  const addNotebook = useNotebooksStore((s) => s.addNotebook);
  const removeNotebook = useNotebooksStore((s) => s.removeNotebook);
  const router = useRouter();

  const handleCreate = async (name: string) => {
    const newNotebook = await createNotebook({ name });
    addNotebook({
      id: newNotebook.id,
      name: newNotebook.name,
      created_at: newNotebook.created_at,
      last_accessed_at: newNotebook.last_accessed_at,
    });
    setShowCreateForm(false);
  };

  const handleDelete = async (id: string) => {
    await deleteNotebook(id);
    removeNotebook(id);
    if (selectedId === id) {
      useNotebooksStore.getState().setSelectedId(null);
      router.push("/protected");
    }
  };

  const handleCopy = async (id: string) => {
    const copiedNotebook = await copyNotebook(id);
    addNotebook({
      id: copiedNotebook.id,
      name: copiedNotebook.name,
      created_at: copiedNotebook.created_at,
      last_accessed_at: copiedNotebook.last_accessed_at,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex items-center justify-between border-b border-foreground/10">
        <span className="text-sm font-semibold">Notebooks</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowCreateForm(!showCreateForm)}
          aria-label="New notebook"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showCreateForm && (
        <CreateNotebookForm
          onSave={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto max-h-[240px]">
        {notebooks.length === 0 ? (
          <p className="p-3 text-sm text-muted-foreground">
            No notebooks yet — create your first one
          </p>
        ) : (
          notebooks.map((notebook) => (
            <NotebookRow
              key={notebook.id}
              notebook={notebook}
              isSelected={notebook.id === selectedId}
              onDelete={handleDelete}
              onCopy={handleCopy}
            />
          ))
        )}
      </div>
    </div>
  );
}
