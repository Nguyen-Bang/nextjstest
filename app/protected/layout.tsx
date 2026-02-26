import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper";
import { getNotebooks } from "@/lib/supabase/notebooks";
import Link from "next/link";
import { Suspense } from "react";

async function SidebarLoader() {
  const notebooks = await getNotebooks();
  const notebookEntries = notebooks.map((n) => ({
    id: n.id,
    name: n.name,
    created_at: n.created_at,
    last_accessed_at: n.last_accessed_at,
  }));
  return <SidebarWrapper initialNotebooks={notebookEntries} />;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 shrink-0">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/protected" className="text-lg">N</Link>
          </div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
      <div className="flex-1 flex">
        <aside className="w-64 border-r border-foreground/10 shrink-0 hidden md:block">
          <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading…</div>}>
            <SidebarLoader />
          </Suspense>
        </aside>
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
