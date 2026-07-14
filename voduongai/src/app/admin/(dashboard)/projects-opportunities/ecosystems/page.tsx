"use client";

import { useRouter } from "next/navigation";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PROJECTS_OPPORTUNITIES_SECTIONS } from "@/lib/admin/projectsOpportunities/navigation";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { useCollection, genId } from "@/lib/admin/store";
import { ecosystemsSeed, ECOSYSTEMS_COLLECTION_KEY, emptyEcosystem, type Ecosystem } from "@/data/portal/ecosystems";
import { ECOSYSTEM_ICONS, getEcosystemSurface } from "@/components/portal/opportunities/ecosystemVisuals";
import { Layers } from "lucide-react";

/**
 * PROJECTS-SPR-602 — danh sách Hệ sinh thái (Ecosystem), thay thế hoàn
 * toàn 2 trang CRUD cũ "Dự án"/"Link dự án" (model DigitalAssetProject/Link,
 * Consumer = 0 trên /portal/duan-cohoi thật). Mỗi Ecosystem giờ là 1 object
 * bám đúng Portal — bấm "Sửa" mở editor đầy đủ (Cơ bản/Nội dung/CTA-Link/
 * Dự án con/Tiêu chí đánh giá/FAQ/Bài viết liên quan/SEO/Publish).
 */
export default function EcosystemsListPage() {
  const router = useRouter();
  const { items, ready, add } = useCollection<Ecosystem>(ECOSYSTEMS_COLLECTION_KEY, ecosystemsSeed);
  const sorted = [...items].sort((a, b) => a.order - b.order);

  function createNew() {
    const id = genId("eco");
    const next = { ...emptyEcosystem(items.length + 1), id };
    add(next);
    router.push(`/admin/projects-opportunities/ecosystems/${id}`);
  }

  return (
    <AdminWorkspaceShell title="Projects & Opportunities" description="" rootHref="/admin/projects-opportunities" sections={PROJECTS_OPPORTUNITIES_SECTIONS}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white">Hệ sinh thái</h1>
            <p className="mt-1 text-sm text-white/50">
              Quản lý toàn bộ Ecosystem hiển thị tại /portal/duan-cohoi (Canonical Product). Mỗi Ecosystem gồm
              Project Detail, Dự án con, CTA/Link, Tiêu chí đánh giá, FAQ, Bài viết liên quan, SEO, Publish.
            </p>
          </div>
          <button onClick={createNew} className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
            + Thêm hệ sinh thái
          </button>
        </div>

        {!ready ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((eco) => {
              const Icon = ECOSYSTEM_ICONS[eco.icon] ?? Layers;
              const surface = getEcosystemSurface(eco.colorKey);
              return (
                <button
                  key={eco.id}
                  onClick={() => router.push(`/admin/projects-opportunities/ecosystems/${eco.id}`)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-brand-blue/40 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge tone={STATUS_TONE[eco.status] ?? "gray"}>{eco.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{eco.name || "(chưa đặt tên)"}</p>
                  <p className="mt-1 text-xs text-white/40">/{eco.slug || "—"}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/50 line-clamp-2">{eco.shortDescription}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-white/40">
                    <span className="rounded-full bg-white/5 px-2 py-0.5">{eco.links.length} link</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5">{(eco.subProjects ?? []).length} dự án con</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5">{eco.faq.length} FAQ</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5">{eco.relatedArticleIds.length} bài viết</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </AdminWorkspaceShell>
  );
}
