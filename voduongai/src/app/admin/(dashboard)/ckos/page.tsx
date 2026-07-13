"use client";

import Link from "next/link";
import { useMemo } from "react";
import { KNOWLEDGE_MODULES, moduleByKey } from "@/lib/admin/ckos/metadata";
import { useAllKnowledgeCollections } from "@/lib/admin/ckos/useAllKnowledgeCollections";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}

export default function CkosDashboardPage() {
  const { byModule, ready } = useAllKnowledgeCollections();

  const allItems = useMemo(
    () =>
      Object.entries(byModule).flatMap(([moduleKey, collection]) => {
        const titleKey = moduleByKey(moduleKey)?.titleKey ?? "title";
        return collection.items.map((it) => ({
          ...it,
          _title: String(it[titleKey] ?? it.title ?? "") || "(chưa đặt tiêu đề)",
        }));
      }),
    [byModule]
  );

  const stats = useMemo(() => {
    const count = (status: string) => allItems.filter((it) => it.status === status).length;
    return {
      total: allItems.length,
      draft: count("Draft"),
      inReview: count("In Review"),
      changesRequested: count("Changes Requested"),
      approved: count("Approved"),
      published: count("Published"),
      archived: count("Archived"),
    };
  }, [allItems]);

  const recentlyUpdated = useMemo(
    () =>
      [...allItems]
        .filter((it) => it.updatedDate)
        .sort((a, b) => String(b.updatedDate).localeCompare(String(a.updatedDate)))
        .slice(0, 8),
    [allItems]
  );

  const pendingReview = useMemo(
    () => allItems.filter((it) => it.status === "In Review" || it.status === "Changes Requested"),
    [allItems]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">CKOS Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Tổng quan toàn bộ tri thức trong CKOS — Single Source of Truth cho Goals, Tools, Prompts, Workflows,
          Evaluations, Resources (Template/Ebook/Checklist/SOP), Case Studies, Best Practices, FAQs. Kiến trúc thống
          nhất từ ADM-SPR-004 — cả 13 collection đều dùng chung Metadata/Lifecycle/Relationship/Version standard.
        </p>
      </div>

      {!ready ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            <StatCard label="Total Knowledge" value={stats.total} />
            <StatCard label="Draft" value={stats.draft} />
            <StatCard label="In Review" value={stats.inReview} />
            <StatCard label="Changes Requested" value={stats.changesRequested} />
            <StatCard label="Approved" value={stats.approved} />
            <StatCard label="Published" value={stats.published} />
            <StatCard label="Archived" value={stats.archived} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm font-bold text-white">Recently Updated</h2>
              {recentlyUpdated.length === 0 ? (
                <p className="mt-3 text-sm text-white/40">Chưa có mục nào.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {recentlyUpdated.map((it) => (
                    <li key={it.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate text-white/80">{it._title}</span>
                      <span className="shrink-0 text-xs text-white/40">{it.updatedDate}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm font-bold text-white">Pending Review</h2>
              {pendingReview.length === 0 ? (
                <p className="mt-3 text-sm text-white/40">Không có mục nào đang chờ review.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {pendingReview.map((it) => (
                    <li key={it.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate text-white/80">{it._title}</span>
                      <span className="shrink-0 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                        {it.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Tất cả 9 module CKOS</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_MODULES.filter((m) => !m.resourceFamily || m.key === "resources").map((mod) => {
            const count = byModule[mod.key]?.items.length ?? 0;
            return (
              <Link
                key={mod.key}
                href={mod.route}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-white">{mod.label}</p>
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-white/70">{count}</span>
                </div>
                <p className="mt-1 text-xs text-white/50">{mod.description}</p>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-white/40">
          Resources có 4 collection anh em cùng kiến trúc:{" "}
          {KNOWLEDGE_MODULES.filter((m) => m.resourceFamily && m.key !== "resources")
            .map((m) => `${m.label} (${byModule[m.key]?.items.length ?? 0})`)
            .join(", ")}
          .
        </p>
      </div>
    </div>
  );
}
