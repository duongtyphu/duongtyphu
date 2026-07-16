"use client";

import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PROJECTS_OPPORTUNITIES_SECTIONS } from "@/lib/admin/projectsOpportunities/navigation";
import { useCollection } from "@/lib/admin/store";
import { ecosystemsSeed, ECOSYSTEMS_COLLECTION_KEY, type Ecosystem } from "@/data/portal/ecosystems";
import { digitalAssetCategories, digitalAssetArticles, type DigitalAssetArticle } from "@/data/digitalAssets";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

type MappingRow = { object: string; source: string; consumer: string };

/**
 * PROJECTS-SPR-602 (Founder Directive: Projects & Opportunities Canonical
 * Product) — Dashboard mới, thay Portal Mapping cũ (PROJECTS-SPR-601, toàn
 * "❌ 0% CRUD") bằng bảng phản ánh đúng hiện trạng SAU sprint này: Ecosystem/
 * Sub-project/CTA-Link/Tiêu chí đánh giá/FAQ/Publish giờ có CRUD thật qua
 * `/admin/projects-opportunities/ecosystems`, bám đúng model
 * `src/data/portal/ecosystems.ts` mà /portal/duan-cohoi đọc trực tiếp.
 */
const OBJECT_CONSUMER_MAPPING: MappingRow[] = [
  { object: "Ecosystem (Project Detail)", source: "Supabase \"ecosystems\" (quản lý trong Admin)", consumer: "✅ Quản lý thật · Portal đọc thật (/portal/duan-cohoi + mini-site)" },
  { object: "Dự án con (Child Project)", source: "Ecosystem.subProjects[]", consumer: "✅ Quản lý thật · Portal đọc thật (mini-site dự án con)" },
  { object: "CTA / Project Link", source: "Ecosystem.links[] / subProjects[].links[] / fields[].links[]", consumer: "✅ Quản lý thật · Portal đọc thật (nút CTA trên Portal)" },
  { object: "Tiêu chí đánh giá (Evaluation)", source: "Ecosystem.potentialAnalysis[] (fallback: bộ mặc định)", consumer: "✅ Quản lý thật · Portal đọc thật (bảng Phân tích tiềm năng)" },
  { object: "FAQ theo Ecosystem", source: "Ecosystem.faq[] (mới — trước đây không tồn tại)", consumer: "✅ Quản lý thật · Portal đọc thật (mục FAQ trên mini-site, mới thêm)" },
  { object: "Bài viết liên quan (Related Content)", source: "Ecosystem.relatedArticleIds[] (fallback: khớp Danh mục)", consumer: "✅ Quản lý thật · Portal đọc thật (Founder tự chọn qua Bài viết liên quan)" },
  { object: "Danh mục (Category)", source: "Supabase \"digital-asset-categories\"", consumer: "✅ Quản lý thật · Portal đọc thật (nhãn Bài viết + fallback lọc)" },
  { object: "Bài viết (Article)", source: "Supabase \"digital-asset-articles\"", consumer: "✅ Quản lý thật · Portal đọc thật (/portal/duan-cohoi/bai-viet/[slug])" },
];

export default function ProjectsOpportunitiesDashboardPage() {
  const { items: ecosystems, ready } = useCollection<Ecosystem>(ECOSYSTEMS_COLLECTION_KEY, ecosystemsSeed);
  const { items: articles } = useCollection<DigitalAssetArticle>("digital-asset-articles", digitalAssetArticles);

  const published = ecosystems.filter((e) => e.status === "Published");
  const totalSubProjects = ecosystems.reduce((n, e) => n + (e.subProjects ?? []).length, 0);
  const totalLinks = ecosystems.reduce(
    (n, e) => n + e.links.length + (e.subProjects ?? []).reduce((s, p) => s + p.links.length, 0) + (e.fields ?? []).reduce((s, f) => s + f.links.length, 0),
    0
  );
  const totalFaq = ecosystems.reduce((n, e) => n + e.faq.length, 0);
  const missingRealLinks = ecosystems.reduce((n, e) => n + e.links.filter((l) => !l.url.trim()).length, 0);

  return (
    <AdminWorkspaceShell title="Projects & Opportunities" description="" rootHref="/admin/projects-opportunities" sections={PROJECTS_OPPORTUNITIES_SECTIONS}>
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-extrabold text-white">Projects & Opportunities — Tổng quan</h1>
          <p className="mt-1 text-sm text-white/50">
            Quản lý trực tiếp <code>/portal/duan-cohoi</code> (Canonical Product theo Founder Directive) — Ecosystem,
            Dự án con, CTA/Link, Tiêu chí đánh giá, FAQ, Bài viết liên quan, SEO, Publish.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Hệ sinh thái" value={ready ? ecosystems.length : "…"} sub={`${published.length} Published`} />
          <StatCard label="Dự án con" value={ready ? totalSubProjects : "…"} />
          <StatCard label="CTA / Link" value={ready ? totalLinks : "…"} sub={missingRealLinks > 0 ? `${missingRealLinks} chưa có URL thật` : undefined} />
          <StatCard label="FAQ" value={ready ? totalFaq : "…"} />
          <StatCard label="Danh mục" value={digitalAssetCategories.length} />
          <StatCard label="Bài viết" value={articles.length} sub={`${articles.filter((a) => a.status === "Published").length} Published`} />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold text-white">Portal Mapping</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="px-4 py-3 font-semibold">Object</th>
                  <th className="px-4 py-3 font-semibold">Nguồn dữ liệu</th>
                  <th className="px-4 py-3 font-semibold">Consumer</th>
                </tr>
              </thead>
              <tbody>
                {OBJECT_CONSUMER_MAPPING.map((row) => (
                  <tr key={row.object} className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold text-white">{row.object}</td>
                    <td className="px-4 py-3 text-white/60">{row.source}</td>
                    <td className="px-4 py-3 text-white/60">{row.consumer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/projects-opportunities/ecosystems" className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
            Quản lý Hệ sinh thái
          </Link>
          <Link href="/admin/projects-opportunities/articles" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">
            Quản lý Bài viết
          </Link>
          <Link href="/admin/projects-opportunities/categories" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">
            Quản lý Danh mục
          </Link>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
