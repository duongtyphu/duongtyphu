"use client";

import { useCollection } from "@/lib/admin/store";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { ToolCard } from "@/components/portal/ToolCard";

export default function ToolsPage() {
  const { items, ready } = useCollection<AdminTool>("tools", toolsAdminSeed);

  const published = items
    .filter((t) => t.status === "Published")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thư viện công cụ</h1>
        <p className="mt-2 text-white">
          Công cụ AI tôi đã thử nghiệm và sử dụng thực tế, theo từng nhóm.
        </p>
      </div>

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-[20px] bg-white/5" />
          ))}
        </div>
      ) : published.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white/60">
          Chưa có công cụ nào được đăng.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {published.map((t) => (
            <ToolCard
              key={t.id}
              id={t.id}
              href={`/portal/tools/${t.slug}`}
              name={t.name}
              category={t.category}
              description={t.shortDescription}
              useCase={t.useCase}
              pricing={t.pricing}
              iUseThis={t.badge === "Tôi đang dùng"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
