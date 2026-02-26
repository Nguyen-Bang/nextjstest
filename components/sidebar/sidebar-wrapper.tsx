"use client";

import { useEffect } from "react";
import { useNotebooksStore } from "@/lib/store/notebooks-store";
import { Sidebar } from "@/components/sidebar/sidebar";
import type { NotebookEntry } from "@/lib/types";

interface SidebarWrapperProps {
  initialNotebooks: NotebookEntry[];
}

export function SidebarWrapper({ initialNotebooks }: SidebarWrapperProps) {
  const setNotebooks = useNotebooksStore((s) => s.setNotebooks);

  useEffect(() => {
    setNotebooks(initialNotebooks);
  }, [initialNotebooks, setNotebooks]);

  return <Sidebar />;
}
