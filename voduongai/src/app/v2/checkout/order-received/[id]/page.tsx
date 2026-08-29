import { notFound } from "next/navigation";
import { getOrder } from "@/app/portal/checkout/actions";
import { getPremiumStatus } from "@/lib/v2/premium-access";
import { OrderReceivedClient } from "./OrderReceivedClient";

export const metadata = { title: "Thanh toán đơn hàng | VO DUONG AI", robots: { index: false } };

export default async function OrderReceivedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (Number.isNaN(orderId)) notFound();

  const [premium, order] = await Promise.all([getPremiumStatus(), getOrder(orderId)]);
  if (!order) notFound();

  return <OrderReceivedClient premium={premium} order={order} />;
}
