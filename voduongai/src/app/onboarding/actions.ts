"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import { sanitizeNextParam } from "@/lib/auth/safe-next";
import { INTEREST_OPTIONS, type InterestId } from "@/lib/portal/identity-onboarding";

export async function completeOnboarding(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();
  const occupation = String(formData.get("occupation") ?? "").trim();
  const aiGoal = String(formData.get("ai_goal") ?? "").trim();
  const interests = formData
    .getAll("interests")
    .map((v) => String(v))
    .filter((id): id is InterestId => INTEREST_OPTIONS.some((opt) => opt.id === id));
  const next = sanitizeNextParam(String(formData.get("next") ?? ""), "/portal/hocvienai");

  if (!fullName || !occupation || !aiGoal || interests.length === 0) {
    return { error: "Vui lòng điền đủ họ tên, nghề nghiệp, mục tiêu và chọn ít nhất 1 lựa chọn." };
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." };

  // Giữ đồng bộ với auth.users.user_metadata.full_name — cùng convention
  // /portal/account/actions.ts's updateProfile() đã dùng cho full_name.
  const { error: authError } = await supabase.auth.updateUser({ data: { full_name: fullName } });
  if (authError) {
    // Log để Founder tra được nguyên nhân thật qua Vercel Function Logs —
    // message lỗi Postgres/Auth không chứa secret, an toàn để log.
    console.error("[onboarding] auth.updateUser failed:", authError.message);
    return { error: "Không thể lưu thông tin, vui lòng thử lại." };
  }

  const { error: memberError } = await supabase
    .from("members")
    .update({
      full_name: fullName,
      avatar_url: avatarUrl || null,
      occupation,
      ai_goal: aiGoal,
      interests,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (memberError) {
    console.error("[onboarding] members.update failed:", memberError.message, memberError.details, memberError.hint);
    return { error: "Không thể lưu thông tin, vui lòng thử lại." };
  }

  redirect(next);
}
