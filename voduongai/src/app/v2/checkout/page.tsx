import { redirect } from "next/navigation";
import { getCachedAuthUser } from "@/lib/supabase-server";
import { getPremiumStatus } from "@/lib/v2/premium-access";
import { CheckoutClient } from "./CheckoutClient";
import type { CheckoutItemType } from "@/app/portal/checkout/actions";

export const metadata = { title: "Hoàn tất đơn hàng | VO DUONG AI", robots: { index: false } };

/**
 * `/v2/checkout` — di chuyển trang thanh toán sang Portal 2.0 (xem docblock
 * `CheckoutClient.tsx`). Auth-check + đọc `searchParams` mirror đúng
 * `/portal/checkout/page.tsx` (1.0) — redirect `/v2/trang-chu` thay vì
 * `/portal` khi thiếu params, `/login` khi chưa đăng nhập.
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const type = params.type as CheckoutItemType | undefined;
  const id = params.id as string | undefined;
  const title = params.title as string | undefined;
  const price = Number(params.price ?? 0);

  if (!type || !id || !title || Number.isNaN(price)) {
    redirect("/v2/trang-chu");
  }

  // BUG HIỆU NĂNG ĐÃ SỬA (Giai đoạn 11, Đợt 5/6): trước đây gọi thêm
  // `supabase.auth.getUser()` RIÊNG ở đây — dù `getPremiumStatus()` đã
  // gọi `getCachedAuthUser()` (dedupe qua React `cache()`) cho đúng phiên
  // render này, lệnh gọi trực tiếp `auth.getUser()` KHÔNG đi qua cùng hàm
  // cache nên vẫn tốn thêm 1 round-trip mạng thật tới Supabase Auth —
  // đúng lớp bug đã sửa tận gốc ở nhiều trang khác ("Sửa nguyên nhân gốc
  // — Portal 2.0 tải chậm"), chỉ sót lại ở trang này (xây sau đợt fix đó).
  const [premium, user] = await Promise.all([getPremiumStatus(), getCachedAuthUser()]);
  const email = user?.email;
  if (!email) redirect("/login");

  return <CheckoutClient premium={premium} email={email} target={{ itemType: type, itemId: id, title, price }} />;
}
