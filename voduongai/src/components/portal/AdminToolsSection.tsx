"use client";

import Image from "next/image";
import { useCollection } from "@/lib/admin/store";
import { toolsAdminSeed } from "@/data/admin/tools";
import { logoUrl } from "@/lib/logo";

export function AdminToolsSection() {
  const { items, ready } = useCollection("tools", toolsAdminSeed);
  const published = items.filter((t) => t.status === "Published");
  if (!ready || published.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
        Công cụ từ Admin
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {published.map((t) => (
          <a
            key={t.id}
            href={t.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 p-1.5">
                <Image
                  src={logoUrl(t.slug)}
                  alt={`${t.name} logo`}
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                {t.pricing}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">{t.name}</h3>
            <p className="mt-1 text-xs text-white">{t.category}</p>
            <p className="mt-2 text-sm text-white">{t.shortDescription}</p>
            {t.featured && (
              <span className="mt-3 inline-flex rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-violet">
                Nổi bật
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
