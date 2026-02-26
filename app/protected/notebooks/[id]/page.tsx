import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNotes } from "@/lib/supabase/notes";
import { NotebookPageClient } from "@/components/notebook/notebook-page-client";
import { Suspense } from "react";

interface NotebookPageProps {
  params: Promise<{ id: string }>;
}

async function NotebookContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the notebook
  const { data: notebook, error } = await supabase
    .from("notebooks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !notebook) {
    notFound();
  }

  // Update last_accessed_at
  await supabase
    .from("notebooks")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", id);

  // Fetch notes ordered by created_at DESC
  const notes = await getNotes(id);

  return (
    <NotebookPageClient
      notebook={{
        ...notebook,
        last_accessed_at: new Date().toISOString(),
      }}
      notes={notes}
    />
  );
}

export default function NotebookPage({ params }: NotebookPageProps) {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading notebook…</div>}>
      <NotebookContent params={params} />
    </Suspense>
  );
}
