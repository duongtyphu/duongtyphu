"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  referralCode: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  banned: boolean;
};

export async function listUsers(): Promise<{ users: AdminUser[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { users: [], configured: false };

  const { data: authData, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error || !authData) return { users: [], configured: true };

  const { data: members } = await supabase.from("members").select("id, full_name, referral_code");
  const memberMap = new Map((members ?? []).map((m) => [m.id, m]));

  const users: AdminUser[] = authData.users.map((u) => {
    const member = memberMap.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "—",
      fullName: member?.full_name ?? (u.user_metadata?.full_name as string | undefined) ?? null,
      referralCode: member?.referral_code ?? null,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      banned: Boolean(u.banned_until && new Date(u.banned_until) > new Date()),
    };
  });

  users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { users, configured: true };
}

export async function setUserBanned(id: string, banned: boolean) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.auth.admin.updateUserById(id, {
    ban_duration: banned ? "876000h" : "none",
  });
  if (error) return { error: "Không thể cập nhật tài khoản, vui lòng thử lại." };

  revalidatePath("/admin/users");
  return { error: null };
}
