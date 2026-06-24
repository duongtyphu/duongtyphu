"use client";

import { useCollection } from "@/lib/admin/store";
import { bannersSeed } from "@/data/admin/portalBuilder";

export function NotificationTicker() {
  const { items, ready } = useCollection("portal-banners", bannersSeed);
  const active = items.filter((b) => b.status === "Active");
  if (!ready || active.length === 0) return null;

  return (
    <div className="mb-6 flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-orange/15 via-brand-orange/5 to-brand-orange/15 py-2">
      <span className="ml-5 shrink-0 text-sm">{active[0].icon || "🔔"}</span>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
        <div className="notice-ticker-track inline-flex w-max gap-14 whitespace-nowrap">
          {active.map((n) => (
            <span key={n.id} className="text-sm font-bold text-brand-orange">
              {n.message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
