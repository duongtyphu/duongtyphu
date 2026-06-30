"use client";

import { useCollection } from "@/lib/admin/store";
import { checklistsSeed } from "@/data/admin/resources";

export default function ChecklistsPage() {
  const { items, ready } = useCollection("checklists", checklistsSeed);
  const checklists = [...items].filter((r) => r.status === "Published");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Checklist</h1>
        <p className="mt-2 text-gray-900">
          Danh sách kiểm tra ngắn gọn giúp bạn không bỏ sót bước quan trọng nào.
        </p>
      </div>
      {!ready ? null : checklists.length === 0 ? (
        <p className="text-sm text-gray-400">Chưa có checklist nào được công bố.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {checklists.map((r) => {
            const href = r.fileUrl || r.downloadLink || "#";
            return (
              <a
                key={r.id}
                href={href}
                target={href !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
              >
                <span className="inline-flex rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
                  {r.type}
                </span>
                <h3 className="mt-3 text-sm font-bold text-gray-900">{r.name}</h3>
                <p className="mt-2 text-sm text-gray-900">{r.description}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
