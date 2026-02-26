"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface EditableHeadingProps {
  value: string;
  onSave: (newValue: string) => void;
}

export function EditableHeading({ value, onSave }: EditableHeadingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    }
    // If empty or unchanged, revert
    setEditValue(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleConfirm}
        onKeyDown={handleKeyDown}
        className="text-2xl font-bold h-auto py-1 px-0 border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:border-primary"
      />
    );
  }

  return (
    <h1
      onClick={handleStartEdit}
      className="text-2xl font-bold cursor-pointer hover:text-primary/80 transition-colors"
    >
      {value}
    </h1>
  );
}
