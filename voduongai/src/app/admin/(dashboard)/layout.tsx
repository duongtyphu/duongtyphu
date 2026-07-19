import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
