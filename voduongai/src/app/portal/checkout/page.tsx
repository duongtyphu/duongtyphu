import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import { CheckoutForm } from "./CheckoutForm";
import type { CheckoutItemType } from "./actions";

export const metadata = { title: "Hoàn tất đơn hàng", description: "Hoàn tất thanh toán đơn hàng tại VO DUONG AI.", robots: { index: false } };

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
    redirect("/portal");
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Hoàn tất đơn hàng</h1>
      <p className="mt-1 text-sm text-white/60">Xác nhận thông tin và tiến hành thanh toán</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-violet">Sản phẩm</p>
        <h2 className="mt-1 text-lg font-bold text-white">{title}</h2>
        <p className="mt-1 text-xl font-extrabold text-brand-orange">
          {price > 0 ? `${price.toLocaleString("vi-VN")}đ` : "Miễn phí"}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">Thông tin của bạn</h2>
        <CheckoutForm
          target={{ itemType: type, itemId: id, title, price }}
          email={email}
        />
      </div>
    </div>
  );
}
