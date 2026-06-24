import Link from "next/link";
import type { CheckoutItemType } from "@/app/portal/checkout/actions";

type CheckoutTarget = {
  itemType: CheckoutItemType;
  itemId: string | number;
  title: string;
  price: number;
};

export function CheckoutButton({ target, label }: { target: CheckoutTarget; label: string }) {
  const params = new URLSearchParams({
    type: target.itemType,
    id: String(target.itemId),
    title: target.title,
    price: String(target.price),
  });

  return (
    <Link
      href={`/portal/checkout?${params.toString()}`}
      className="inline-block rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {label}
    </Link>
  );
}
