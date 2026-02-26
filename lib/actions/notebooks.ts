"use server";

import {
  createNotebook as dbCreate,
  updateNotebook as dbUpdate,
  deleteNotebook as dbDelete,
  copyNotebook as dbCopy,
} from "@/lib/supabase/notebooks";
import type {
  Notebook,
  NewNotebook,
  NotebookUpdate,
} from "@/lib/types";

export async function createNotebook(payload: NewNotebook): Promise<Notebook> {
  return dbCreate(payload);
}

export async function updateNotebook(
  id: string,
  patch: NotebookUpdate
): Promise<Notebook> {
  return dbUpdate(id, patch);
}

export async function deleteNotebook(id: string): Promise<void> {
  return dbDelete(id);
}

export async function copyNotebook(sourceId: string): Promise<Notebook> {
  return dbCopy(sourceId);
}
