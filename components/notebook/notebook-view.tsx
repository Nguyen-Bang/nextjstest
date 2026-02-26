"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditableHeading } from "./editable-heading";
import { NoteCard } from "./note-card";
import { createNote, deleteNote, copyNote } from "@/lib/actions/notes";
import { updateNotebook } from "@/lib/actions/notebooks";
import { useNotebooksStore } from "@/lib/store/notebooks-store";
import type { Notebook, Note } from "@/lib/types";

interface NotebookViewProps {
  notebook: Notebook;
  initialNotes: Note[];
}

export function NotebookView({ notebook, initialNotes }: NotebookViewProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const storeUpdateNotebook = useNotebooksStore((s) => s.updateNotebook);

  const trimmedContent = content.trim();

  const handleSave = async () => {
    if (!trimmedContent || isSaving) return;

    setIsSaving(true);
    try {
      const newNote = await createNote({
        notebook_id: notebook.id,
        content: trimmedContent,
      });
      setNotes((prev) => [newNote, ...prev]);
      setContent("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCopyNote = async (id: string) => {
    const copiedNote = await copyNote(id);
    setNotes((prev) => [copiedNote, ...prev]);
  };

  const handleRename = async (newName: string) => {
    await updateNotebook(notebook.id, { name: newName });
    storeUpdateNotebook(notebook.id, { name: newName });
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <EditableHeading value={notebook.name} onSave={handleRename} />

      <div className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note..."
          aria-label="Note content"
          className="min-h-[100px]"
        />
        <Button
          onClick={handleSave}
          disabled={!trimmedContent || isSaving}
        >
          Save
        </Button>
      </div>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No notes yet — write your first one above.
          </p>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onCopy={handleCopyNote}
            />
          ))
        )}
      </div>
    </div>
  );
}
