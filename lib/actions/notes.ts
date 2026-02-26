"use server";

import {
  createNote as dbCreate,
  deleteNote as dbDelete,
  copyNote as dbCopy,
} from "@/lib/supabase/notes";
import type { Note, NewNote } from "@/lib/types";

export async function createNote(payload: NewNote): Promise<Note> {
  return dbCreate(payload);
}

export async function deleteNote(id: string): Promise<void> {
  return dbDelete(id);
}

export async function copyNote(id: string): Promise<Note> {
  return dbCopy(id);
}
