import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");

  const { data: member } = await supabase.from("members").select("is_admin").eq("id", data.user.id).single();
  if (!member?.is_admin) redirect("/admin/login?error=not_admin");

  return <AdminShell email={data.user.email ?? ""}>{children}</AdminShell>;
}
