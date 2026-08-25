import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";

export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — ignored, middleware refreshes the session instead.
          }
        },
      },
    },
  );
}

/**
 * `auth.getUser()` xác thực JWT bằng 1 request mạng thật tới Supabase Auth —
 * KHÔNG rẻ như đọc cookie. Trước khi có hàm này, gần như mọi trang `/v2/*`
 * gọi `getPremiumStatus()` (1 lần `auth.getUser()`) RỒI GỌI LẠI 1 lần nữa
 * trong chính hàm `live-*.ts` của trang đó (`getAcademyProgress()`,
 * `getAccountData()`, `getCompanionFavoriteTools()`...) — 2, có khi 3+ lần
 * xác thực THẬT GIỐNG HỆT NHAU nối tiếp nhau trong CÙNG 1 lượt render, cộng
 * thêm 1 lần `middleware.ts` đã làm trước đó (không dedupe được qua ranh
 * giới middleware — khác runtime/pha request, `cache()` chỉ dedupe trong
 * đúng 1 lượt render Server Component). Đây là nguyên nhân chính khiến
 * Portal 2.0 tải chậm hơn hẳn 1.0 — Founder báo "chuyển mục thì tải rất
 * chậm" (2026-08-25).
 *
 * `cache()` (React, KHÔNG phải `unstable_cache` của Next.js — hàm đó cache
 * XUYÊN SUỐT nhiều request, sai cho dữ liệu theo phiên đăng nhập) chỉ
 * dedupe trong đúng 1 lượt render — gọi hàm này ở 5 nơi khác nhau trong
 * cùng 1 trang giờ chỉ tốn ĐÚNG 1 lần gọi mạng thật, không phải 5 lần.
 * Mọi hàm `live-*.ts`/`page.tsx` cần biết user đang đăng nhập PHẢI gọi hàm
 * này thay vì tự `getSupabaseServer()` + `auth.getUser()` riêng.
 *
 * `try/catch` — `auth.getUser()` KHÔNG chỉ trả lỗi qua `{data, error}` như
 * phần lớn API Supabase khác, nó CÓ THỂ THROW thật (xác nhận qua Vercel
 * runtime logs: `AuthApiError: Invalid Refresh Token` bắt được ở
 * `/middleware` dưới dạng exception, không phải giá trị trả về). Không có
 * `try/catch` nào ở đây trước đó, và KHÔNG file nào trong ~19 nơi gọi hàm
 * này (trước khi gộp về đây) tự bọc riêng — 1 lần refresh token hỏng/mạng
 * chập chờn giữa lúc đang có phiên là đủ để exception này rơi thẳng ra
 * Server Component đang render, bị `/v2/error.tsx` bắt thành "Đã có lỗi
 * xảy ra". Coi lỗi xác thực (thuộc loại tạm thời, không phải lỗi logic) là
 * "chưa đăng nhập" — toàn bộ code downstream đã xử lý `null` an toàn ở mọi
 * nơi (honest fallback), không cần sửa gì thêm.
 */
export const getCachedAuthUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
});
