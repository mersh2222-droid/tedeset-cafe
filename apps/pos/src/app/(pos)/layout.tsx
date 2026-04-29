import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import POSSidebar from "@/components/pos-sidebar";

export default async function POSLayout({ children }: { children: React.ReactNode }) {
  let session;
  try {
    session = await requireSession();
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <POSSidebar user={{ name: session.name, role: session.role }} />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
