"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateNotebookFormProps {
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}

export function CreateNotebookForm({ onSave, onCancel }: CreateNotebookFormProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = name.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedName || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(trimmedName);
      setName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 space-y-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Notebook name"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!trimmedName || isSubmitting}
        >
          Save
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
