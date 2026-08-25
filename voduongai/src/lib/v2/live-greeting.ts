import { getCachedAuthUser } from "@/lib/supabase-server";
import { getWelcomeState, getWelcomeMessage, type WelcomeState } from "@/lib/portal/warmth-engine";
import { getLifeMomentLine } from "@/lib/portal/life-moments";

/**
 * Portal 2.0, Giai đoạn 1 (rework) — "Companion sống" cho `/v2/trang-chu`.
 *
 * Tái dùng NGUYÊN `warmth-engine.ts`/`life-moments.ts` (Single Source of
 * Truth — cùng bộ copy thật đã dùng ở `/portal/page.tsx`'s
 * `CompanionPresenceBand`), KHÔNG viết lại logic/copy welcome state. Chỉ
 * khác nguồn đọc profile: `/v2/*` bắt buộc đăng nhập qua middleware (khác
 * `/portal` không đổi gì) nên hàm này tự đọc session riêng — không phụ
 * thuộc `getPremiumStatus()` (contract đã cố định cho ~46 trang, không
 * gắn thêm field không liên quan Premium vào đó).
 */
export type GreetingState = {
  welcomeState: WelcomeState;
  /** `welcomeMessage` gốc có thể nhiều dòng (nối bằng "\n") — tách dòng ở
   * component hiển thị, không tách sẵn ở đây để giữ đúng dữ liệu gốc. */
  welcomeMessage: string;
  fullName: string | null;
  /** Chỉ có giá trị khi `welcomeState === "comeback"` — đúng cách
   * `CompanionPresenceBand` dùng `getLifeMomentLine("quietReturn")`. */
  comebackLine: string | null;
};

const FALLBACK: GreetingState = {
  welcomeState: "returning",
  welcomeMessage: "Chào mừng bạn trở lại VO DUONG AI.",
  fullName: null,
  comebackLine: null,
};

export async function getGreetingState(): Promise<GreetingState> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FALLBACK;
  }
  try {
    const user = await getCachedAuthUser();
    const fullName = (user?.user_metadata?.full_name as string | undefined) ?? null;
    const welcomeState = getWelcomeState({
      createdAt: user?.created_at ? new Date(user.created_at) : undefined,
      lastSignInAt: user?.last_sign_in_at ? new Date(user.last_sign_in_at) : undefined,
    });
    return {
      welcomeState,
      welcomeMessage: getWelcomeMessage(welcomeState),
      fullName,
      comebackLine: welcomeState === "comeback" ? getLifeMomentLine("quietReturn") : null,
    };
  } catch {
    return FALLBACK;
  }
}
