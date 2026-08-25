import "server-only";

import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";

export type V2Session = {
  userId: string;
  email: string;
  fullName: string;
  initials: string;
  isAdmin: boolean;
  isPremium: boolean;
};

/** "Võ Đương" -> "VĐ"; email fallback -> 2 ký tự đầu. */
function toInitials(name: string, email: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  if (words.length === 1 && words[0].length > 0) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

/**
 * Phiên đăng nhập cho khu vực `/v2`.
 *
 * Auth là THẬT — dùng lại Supabase session và cột `members.is_admin` như phần
 * còn lại của ứng dụng. Chỉ phần nội dung của 46 màn 2.0 là mock (xem
 * `src/lib/v2/data/`).
 *
 * Trả `null` khi chưa đăng nhập hoặc khi biến môi trường Supabase chưa cấu hình
 * (môi trường preview/CI) — bên gọi tự quyết định redirect.
 */
export async function getV2Session(): Promise<V2Session | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const supabase = await getSupabaseServer();
    const user = await getCachedAuthUser();
    if (!user) return null;

    const { data: member } = await supabase
      .from("members")
      .select("full_name, is_admin")
      .eq("id", user.id)
      .single();

    const email = user.email ?? "";
    const fullName =
      member?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? email;

    return {
      userId: user.id,
      email,
      fullName,
      initials: toInitials(fullName, email),
      isAdmin: Boolean(member?.is_admin),
      // TODO(v2): chưa có nguồn quyền lợi Premium thống nhất — bảng `members`
      // không có cột nào, trạng thái hiện suy ra từ `orders` rải rác nhiều nơi.
      // Tạm để false (sidebar hiện khối "Nâng cấp Premium") cho tới khi lớp
      // entitlement được gom về một chỗ.
      isPremium: false,
    };
  } catch {
    return null;
  }
}
