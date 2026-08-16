import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getSupabaseServer } from "@/lib/supabase-server";

import { SuMenhCompanionClient } from "./SuMenhCompanionClient";

export const metadata = { title: "Sứ mệnh Companion | VO DUONG AI" };

/**
 * `/v2/su-menh-companion` — Bước F. Trang chủ yếu là copy tĩnh (sứ mệnh/giá
 * trị cốt lõi/nguyên tắc hoạt động — bản tuyên ngôn thương hiệu, không phải
 * dữ liệu user). CHỈ 1 điểm có dữ liệu thật: "Đồng hành cùng bạn từ ..." —
 * đổi từ ngày cố định trong bản thiết kế sang ngày tạo tài khoản thật
 * (`members.created_at`) của user đang đăng nhập.
 */
export default async function SuMenhCompanionPage() {
  const premium = await getPremiumStatus();

  let joinedAt: string | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: member } = await supabase
        .from("members")
        .select("created_at")
        .eq("id", userData.user.id)
        .maybeSingle();
      joinedAt = (member?.created_at as string | null) ?? null;
    }
  }

  return <SuMenhCompanionClient premium={premium} joinedAt={joinedAt} />;
}
