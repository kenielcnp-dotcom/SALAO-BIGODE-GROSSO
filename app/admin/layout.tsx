import { requireOwnerPage } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Defesa em profundidade: o proxy.ts já bloqueia /admin/* sem sessão,
// mas essa checagem roda de novo aqui no layout (e cada Server Action
// admin reverifica por conta própria — ver lib/auth.ts).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwnerPage();

  return (
    <div className="grid min-h-screen bg-void-black md:grid-cols-[244px_1fr]">
      <AdminSidebar />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
