import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * Server-only guard for /api/admin/* route handlers. Mirrors the middleware's
 * is_admin check — needed because middleware only protects page navigations,
 * not direct fetch() calls to API routes.
 */
export async function requireAdmin() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: member } = await supabase.from("members").select("is_admin").eq("id", data.user.id).single();
  if (!member?.is_admin) return null;

  return data.user;
}
