import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
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

  const [premium, supabase] = await Promise.all([getPremiumStatus(), getSupabaseServer()]);
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) redirect("/login");

  return <CheckoutClient premium={premium} email={email} target={{ itemType: type, itemId: id, title, price }} />;
}
