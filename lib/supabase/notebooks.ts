import { createClient } from "@/lib/supabase/server";
import type {
  Notebook,
  NewNotebook,
  NotebookUpdate,
} from "@/lib/types";

export async function getNotebooks(): Promise<Notebook[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notebooks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createNotebook(payload: NewNotebook): Promise<Notebook> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from("notebooks")
    .insert({ name: payload.name, user_id: userData.user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNotebook(
  id: string,
  patch: NotebookUpdate
): Promise<Notebook> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notebooks")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotebook(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notebooks").delete().eq("id", id);

  if (error) throw error;
}

export async function copyNotebook(
  sourceId: string
): Promise<Notebook> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  // 1. Fetch the source notebook
  const { data: source, error: fetchError } = await supabase
    .from("notebooks")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (fetchError || !source) throw fetchError ?? new Error("Notebook not found");

  // 2. Create the copy
  const { data: copy, error: copyError } = await supabase
    .from("notebooks")
    .insert({ name: `${source.name} – Copy`, user_id: userData.user.id })
    .select()
    .single();

  if (copyError || !copy) throw copyError ?? new Error("Failed to copy notebook");

  // 3. Copy all notes from the source notebook
  const { data: notes } = await supabase
    .from("notes")
    .select("content")
    .eq("notebook_id", sourceId);

  if (notes && notes.length > 0) {
    const noteCopies = notes.map((n: { content: string }) => ({
      notebook_id: copy.id,
      content: n.content,
      user_id: userData.user.id,
    }));
    const { error: notesError } = await supabase
      .from("notes")
      .insert(noteCopies);

    if (notesError) throw notesError;
  }

  return copy;
}
