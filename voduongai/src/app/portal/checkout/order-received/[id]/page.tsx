import { notFound } from "next/navigation";
import { getOrder } from "../../actions";
import { OrderReceipt } from "./OrderReceipt";

export const metadata = { title: "Thanh toán đơn hàng" };

export default async function OrderReceivedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (Number.isNaN(orderId)) notFound();

  const order = await getOrder(orderId);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-gray-900">Cảm ơn bạn!</h1>
      <p className="mt-1 text-sm text-gray-500">Đơn hàng #{order.order_code ?? order.id} đã được ghi nhận.</p>
      <OrderReceipt order={order} />
    </div>
  );
}
