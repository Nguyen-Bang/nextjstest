"use client";

import Link from "next/link";
import { MoreHorizontal, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NotebookEntry } from "@/lib/types";

interface NotebookRowProps {
  notebook: NotebookEntry;
  isSelected: boolean;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
}

export function NotebookRow({
  notebook,
  isSelected,
  onDelete,
  onCopy,
}: NotebookRowProps) {
  return (
    <div
      data-notebook-row
      className={`group flex items-center justify-between h-12 px-3 rounded-md hover:bg-accent transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      <Link
        href={`/protected/notebooks/${notebook.id}`}
        className="flex-1 truncate text-sm"
      >
        {notebook.name}
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
            aria-label="Menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onCopy(notebook.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(notebook.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
