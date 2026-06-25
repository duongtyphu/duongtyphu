"use client";

import { useCollection } from "@/lib/admin/store";
import { servicesSeed } from "@/data/admin/services";
import { siteConfig } from "@/lib/site";

export function AdminServicesSection() {
  const { items, ready } = useCollection("services", servicesSeed);
  const published = [...items]
    .filter((s) => s.status === "Published")
    .sort((a, b) => a.order - b.order);

  if (!ready) return null;

  if (published.length === 0) {
    return <p className="text-sm text-white/40">Chưa có dịch vụ nào được công bố.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {published.map((s) => {
        const href =
          s.ctaType === "email"
            ? `mailto:${s.ctaValue || siteConfig.contact.email}`
            : s.ctaValue || "#";
        return (
          <div key={s.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-white">{s.description}</p>
            <a href={href} target={s.ctaType === "link" ? "_blank" : undefined} rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:underline">
              {s.ctaLabel} →
            </a>
          </div>
        );
      })}
    </div>
  );
}
