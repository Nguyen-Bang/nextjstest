import { createClient } from "@/lib/supabase/server";
import type { Note, NewNote } from "@/lib/types";

export async function getNotes(notebookId: string): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("notebook_id", notebookId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createNote(payload: NewNote): Promise<Note> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from("notes")
    .insert({
      notebook_id: payload.notebook_id,
      content: payload.content,
      user_id: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) throw error;
}

export async function copyNote(id: string): Promise<Note> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  // Fetch the source note
  const { data: source, error: fetchError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !source) throw fetchError ?? new Error("Note not found");

  // Create the copy with same content and notebook_id
  const { data: copy, error: copyError } = await supabase
    .from("notes")
    .insert({
      notebook_id: source.notebook_id,
      content: source.content,
      user_id: userData.user.id,
    })
    .select()
    .single();

  if (copyError) throw copyError;
  return copy;
}
