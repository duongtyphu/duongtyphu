import { getSupabaseAdmin } from "@/lib/supabase";

export type IdentityUserRow = {
  id: string;
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
  status: "confirmed" | "unconfirmed" | "banned";
  provider: string;
  registeredAt: string | null;
  lastSignInAt: string | null;
  onboardingCompleted: boolean;
};

/**
 * Danh sách toàn bộ user cho /admin/users. Đọc auth.users qua Admin API
 * (service-role, KHÔNG lộ password/hash — Supabase không bao giờ trả 2 thứ
 * này qua bất kỳ API nào) để lấy created_at/last_sign_in_at/provider/trạng
 * thái xác thực, join với `members` (service-role, bỏ qua RLS vì trang này
 * đã có requireAdmin() gate ở tầng gọi) để lấy full_name/is_admin/
 * onboarding_completed_at — 2 nguồn dữ liệu tách biệt theo đúng kiến trúc
 * Identity Hub (auth.users = identity, members = profile).
 */
export async function listIdentityUsers(): Promise<IdentityUserRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];

  const authUsers: Array<{
    id: string;
    email?: string;
    created_at: string;
    last_sign_in_at?: string | null;
    email_confirmed_at?: string | null;
    banned_until?: string | null;
    app_metadata?: { provider?: string; providers?: string[] };
  }> = [];

  const perPage = 1000;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) break;
    authUsers.push(...data.users);
    if (data.users.length < perPage) break;
  }

  const { data: memberRows } = await admin
    .from("members")
    .select("id, full_name, is_admin, onboarding_completed_at");
  const memberById = new Map((memberRows ?? []).map((m) => [m.id, m]));

  return authUsers
    .map((u): IdentityUserRow => {
      const member = memberById.get(u.id);
      const isBanned = Boolean(u.banned_until && new Date(u.banned_until) > new Date());
      return {
        id: u.id,
        email: u.email ?? null,
        fullName: member?.full_name ?? null,
        isAdmin: Boolean(member?.is_admin),
        status: isBanned ? "banned" : u.email_confirmed_at ? "confirmed" : "unconfirmed",
        provider: u.app_metadata?.provider ?? "email",
        registeredAt: u.created_at ?? null,
        lastSignInAt: u.last_sign_in_at ?? null,
        onboardingCompleted: Boolean(member?.onboarding_completed_at),
      };
    })
    .sort((a, b) => (b.registeredAt ?? "").localeCompare(a.registeredAt ?? ""));
}

/**
 * 1 user cho /admin/users/[id] (trang chi tiết drill-down). Dùng
 * `auth.admin.getUserById()` (tra đúng 1 dòng, không phân trang toàn bộ
 * `auth.users` như `listIdentityUsers()`) + join `members` cùng cách.
 */
export async function getIdentityUserById(id: string): Promise<IdentityUserRow | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data, error } = await admin.auth.admin.getUserById(id);
  if (error || !data?.user) return null;
  const u = data.user;

  const { data: member } = await admin
    .from("members")
    .select("id, full_name, is_admin, onboarding_completed_at")
    .eq("id", u.id)
    .maybeSingle();

  const isBanned = Boolean(u.banned_until && new Date(u.banned_until) > new Date());
  return {
    id: u.id,
    email: u.email ?? null,
    fullName: member?.full_name ?? null,
    isAdmin: Boolean(member?.is_admin),
    status: isBanned ? "banned" : u.email_confirmed_at ? "confirmed" : "unconfirmed",
    provider: u.app_metadata?.provider ?? "email",
    registeredAt: u.created_at ?? null,
    lastSignInAt: u.last_sign_in_at ?? null,
    onboardingCompleted: Boolean(member?.onboarding_completed_at),
  };
}
