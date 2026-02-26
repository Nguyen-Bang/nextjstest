import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNotebooks } from "@/lib/supabase/notebooks";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { Suspense } from "react";

async function DashboardContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const notebooks = await getNotebooks();
  const notebookCount = notebooks.length;
  const lastAccessedNotebook =
    notebooks.length > 0
      ? (() => {
          const sorted = [...notebooks].sort(
            (a, b) =>
              new Date(b.last_accessed_at).getTime() -
              new Date(a.last_accessed_at).getTime()
          );
          return { id: sorted[0].id, name: sorted[0].name };
        })()
      : null;

  return (
    <DashboardStats
      notebookCount={notebookCount}
      lastAccessedNotebook={lastAccessedNotebook}
    />
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <h1 className="font-bold text-2xl">Dashboard</h1>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
