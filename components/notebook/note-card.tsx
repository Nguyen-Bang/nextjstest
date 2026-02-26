"use client";

import { MoreHorizontal, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Note } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
}

export function NoteCard({ note, onDelete, onCopy }: NoteCardProps) {
  return (
    <Card data-note-card className="group relative">
      <CardContent className="p-4">
        <p className="whitespace-pre-wrap text-sm">{note.content}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(note.created_at).toLocaleString()}
        </p>
      </CardContent>

      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCopy(note.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(note.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
