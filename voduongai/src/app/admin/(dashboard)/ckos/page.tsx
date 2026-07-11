"use client";

import Link from "next/link";
import { useMemo } from "react";
import { KNOWLEDGE_MODULES } from "@/lib/admin/ckos/metadata";
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
  const { byModule, legacyByModule, caseStudies, ready } = useAllKnowledgeCollections();

  const allNewItems = useMemo(
    () => Object.values(byModule).flatMap((c) => c.items),
    [byModule]
  );

  const stats = useMemo(() => {
    const count = (status: string) => allNewItems.filter((it) => it.status === status).length;
    return {
      total: allNewItems.length,
      draft: count("Draft"),
      inReview: count("In Review"),
      changesRequested: count("Changes Requested"),
      approved: count("Approved"),
      published: count("Published"),
      archived: count("Archived"),
    };
  }, [allNewItems]);

  const recentlyUpdated = useMemo(
    () =>
      [...allNewItems]
        .filter((it) => it.updatedDate)
        .sort((a, b) => b.updatedDate.localeCompare(a.updatedDate))
        .slice(0, 8),
    [allNewItems]
  );

  const pendingReview = useMemo(
    () => allNewItems.filter((it) => it.status === "In Review" || it.status === "Changes Requested"),
    [allNewItems]
  );

  const legacyCounts = useMemo(() => {
    const out: Record<string, { total: number; published: number; draft: number }> = {};
    for (const [key, collection] of Object.entries(legacyByModule)) {
      out[key] = {
        total: collection.items.length,
        published: collection.items.filter((it) => it.status === "Published").length,
        draft: collection.items.filter((it) => it.status === "Draft").length,
      };
    }
    return out;
  }, [legacyByModule]);

  const caseStudyCounts = useMemo(
    () => ({
      total: caseStudies.length,
      active: caseStudies.filter((c) => c.active).length,
      draft: caseStudies.filter((c) => !c.active).length,
    }),
    [caseStudies]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">CKOS Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Tổng quan toàn bộ tri thức trong CKOS — Single Source of Truth cho Goals, Tools, Prompts, Workflows,
          Evaluations, Resources, Case Studies, Best Practices, FAQs.
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
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">
              5 module tri thức mới (Goals, Workflows, Evaluations, Best Practices, FAQs)
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              <StatCard label="Total Knowledge" value={stats.total} />
              <StatCard label="Draft" value={stats.draft} />
              <StatCard label="In Review" value={stats.inReview} />
              <StatCard label="Changes Requested" value={stats.changesRequested} />
              <StatCard label="Approved" value={stats.approved} />
              <StatCard label="Published" value={stats.published} />
              <StatCard label="Archived" value={stats.archived} />
            </div>
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
                      <span className="truncate text-white/80">{it.title || "(chưa đặt tiêu đề)"}</span>
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
                      <span className="truncate text-white/80">{it.title || "(chưa đặt tiêu đề)"}</span>
                      <span className="shrink-0 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                        {it.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">
              4 module CKOS đã có sẵn từ trước — chưa áp dụng Lifecycle 6 trạng thái trong sprint này
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["tools", "prompts", "resources"] as const).map((key) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40 capitalize">{key}</p>
                  <p className="mt-1.5 text-lg font-extrabold text-white">{legacyCounts[key]?.total ?? 0}</p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {legacyCounts[key]?.published ?? 0} Published · {legacyCounts[key]?.draft ?? 0} Draft
                  </p>
                </div>
              ))}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">Case Studies</p>
                <p className="mt-1.5 text-lg font-extrabold text-white">{caseStudyCounts.total}</p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {caseStudyCounts.active} Active · {caseStudyCounts.draft} Draft
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Tất cả 9 module</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_MODULES.map((mod) => (
            <Link
              key={mod.key}
              href={mod.route}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
            >
              <p className="font-bold text-white">{mod.label}</p>
              <p className="mt-1 text-xs text-white/50">{mod.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
