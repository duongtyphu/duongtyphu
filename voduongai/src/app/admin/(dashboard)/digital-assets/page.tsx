"use client";

import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { DIGITAL_ASSETS_WORKSPACE_SECTIONS } from "@/lib/admin/digitalAssets/navigation";
import { useCollection } from "@/lib/admin/store";
import {
  digitalAssetCategories,
  digitalAssetProjects,
  digitalAssetLinks,
  digitalAssetArticles,
  digitalAssetSettingsSeed,
} from "@/data/digitalAssets";
import { useAdminToast } from "@/lib/admin/toast";
import { useState, useEffect } from "react";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

type MappingRow = { object: string; source: string; consumer: string; note: string };

/**
 * Portal Mapping (Task 1, PROJECTS-SPR-601) — đối chiếu trực tiếp
 * `/portal/duan-cohoi/**`. `ecosystems.ts` (Ecosystem/SubProject/
 * MarketingLink/AffiliateOffer/ExchangeLink) 100% hardcode, 0% CRUD.
 * `digitalAssets.ts` (Project/Category/Link/Article) là CRUD thật (Supabase)
 * nhưng Consumer khác nhau hoàn toàn theo từng object — xem báo cáo
 * docs/admin/PROJECTS_WORKSPACE_MANAGEMENT_PROJECTS-SPR-601.md.
 */
const OBJECT_CONSUMER_MAPPING: MappingRow[] = [
  { object: "Ecosystem (DigiU/SolarGroup/Crypto/Blockchain/Trading)", source: "src/data/portal/ecosystems.ts (hardcode, 5 mục)", consumer: "❌ 0% CRUD", note: "Đối tượng Founder thấy là \"nhóm\" trên Portal — không Admin nào chạm được." },
  { object: "Sub-project (con của Ecosystem)", source: "ecosystems.ts (hardcode, 5 mục)", consumer: "❌ 0% CRUD", note: "3 dưới DigiU, 2 dưới SolarGroup." },
  { object: "Marketing Link / Affiliate Offer / Exchange Link (\"External Link\")", source: "ecosystems.ts (hardcode)", consumer: "❌ 0% CRUD", note: "Gần nhất với \"CTA\"/\"External Link\" trong Scope brief — không tồn tại dạng Admin-editable." },
  { object: "Ecosystem.status (\"Publish\"/\"Visibility\")", source: "ecosystems.ts (hardcode)", consumer: "❌ 0% CRUD", note: "Field có tồn tại trong type nhưng không Admin nào ghi được." },
  { object: "Digital Asset Project", source: "digitalAssets.ts → Supabase digital_asset_projects", consumer: "✅ CRUD thật · ❌ Consumer = 0", note: "Chỉ được đọc bởi route /portal/digital-assets/** đã khai tử — không route sống nào của /portal/duan-cohoi đọc Project." },
  { object: "Digital Asset Link", source: "digitalAssets.ts → Supabase digital_asset_links", consumer: "✅ CRUD thật · ❌ Consumer = 0", note: "Chỉ đọc bởi DigitalAssetProjectCard.tsx, chỉ mount trong route /portal/digital-assets/** đã khai tử." },
  { object: "Digital Asset Category", source: "digitalAssets.ts → Supabase digital_asset_categories", consumer: "✅ CRUD thật · ⚠️ Consumer thật (hẹp)", note: "Đọc live tại /portal/duan-cohoi/bai-viet/[slug] (gắn nhãn danh mục cho bài viết)." },
  { object: "Digital Asset Article", source: "digitalAssets.ts → Supabase digital_asset_articles", consumer: "✅ CRUD thật · ⚠️ Consumer thật (hẹp)", note: "Đọc live tại /portal/duan-cohoi/bai-viet/[slug] (useCollection) — NHƯNG trang Ecosystem lọc bài viết từ mảng tĩnh import cứng, không phải collection sống, nên bài mới Founder thêm KHÔNG xuất hiện trong lưới \"Bài viết liên quan\" của Ecosystem, chỉ truy cập được qua URL trực tiếp." },
  { object: "Digital Asset Settings (disclaimer)", source: "digitalAssets.ts → Supabase digital_asset_settings", consumer: "✅ CRUD thật · ❌ Consumer = 0", note: "0 kết quả khi grep toàn bộ src/app/portal cho việc render field này." },
  { object: "FAQ theo Ecosystem", source: "Không tồn tại", consumer: "❌ 0% CRUD", note: "Chỉ có 1 FAQ tĩnh cấp trang (3 câu, page.tsx), không có FAQ riêng theo từng Ecosystem như Scope brief mô tả." },
];

export default function DigitalAssetsAdminDashboardPage() {
  const { items: categories } = useCollection("digital-asset-categories", digitalAssetCategories);
  const { items: projects } = useCollection("digital-asset-projects", digitalAssetProjects);
  const { items: links } = useCollection("digital-asset-links", digitalAssetLinks);
  const { items: articles } = useCollection("digital-asset-articles", digitalAssetArticles);
  const { items: settings, update: updateSettings, ready: settingsReady } = useCollection(
    "digital-asset-settings",
    digitalAssetSettingsSeed
  );
  const { push } = useAdminToast();

  const [disclaimer, setDisclaimer] = useState("");
  useEffect(() => {
    // Syncs local edit buffer once the async collection load resolves; no
    // pure render-time source for this value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (settingsReady && settings[0]) setDisclaimer(settings[0].disclaimer);
  }, [settingsReady, settings]);

  const affiliateLinks = links.filter((l) => l.isAffiliate);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 5);
  const newestProjects = [...projects]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5);
  const topLink = [...links].sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))[0];
  const categoryProjectCounts = categories
    .map((c) => ({ ...c, count: projects.filter((p) => p.category === c.key).length }))
    .sort((a, b) => b.count - a.count);
  const topCategory = categoryProjectCounts[0];

  function saveDisclaimer() {
    if (!settings[0]) return;
    updateSettings(settings[0].id, { disclaimer });
    push("Đã lưu disclaimer.");
  }

  return (
    <AdminWorkspaceShell title="Projects & Opportunities" description="" rootHref="/admin/digital-assets" sections={DIGITAL_ASSETS_WORKSPACE_SECTIONS}>
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">ĐẦU TƯ CÙNG TÔI — Tổng quan</h1>
          <p className="mt-1 text-sm text-white/50">
            Quản lý toàn bộ danh mục, dự án, link và bài viết của mục ĐẦU TƯ CÙNG TÔI trên Portal (route thật:
            /portal/duan-cohoi — xem bảng Portal Mapping bên dưới).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/digital-assets/projects" className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
            + Thêm dự án mới
          </Link>
          <Link href="/admin/digital-assets/links" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            + Thêm link affiliate
          </Link>
          <Link href="/admin/digital-assets/articles" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            + Thêm bài viết
          </Link>
          <Link href="/admin/digital-assets/categories" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            Quản lý danh mục
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Danh mục" value={categories.length} />
        <StatCard label="Dự án" value={projects.length} />
        <StatCard label="Tổng số link" value={links.length} />
        <StatCard label="Affiliate links" value={affiliateLinks.length} />
        <StatCard label="Bài viết" value={articles.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Dự án nổi bật</h2>
          <ul className="mt-3 space-y-2">
            {featuredProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span className="text-white/80">{p.logo} {p.name}</span>
                <span className="text-xs text-white/40">{p.badge}</span>
              </li>
            ))}
            {featuredProjects.length === 0 && <p className="text-sm text-white/40">Chưa có dự án nổi bật.</p>}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Dự án mới thêm</h2>
          <ul className="mt-3 space-y-2">
            {newestProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span className="text-white/80">{p.logo} {p.name}</span>
                <span className="text-xs text-white/40">{p.createdAt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Link được click nhiều nhất (mock)</h2>
          {topLink ? (
            <div className="mt-3 rounded-lg bg-white/5 px-3 py-3 text-sm">
              <p className="font-semibold text-white">{topLink.title}</p>
              <p className="mt-1 text-xs text-white/40">{topLink.clickCount} lượt click — {topLink.type}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/40">Chưa có dữ liệu.</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Danh mục có nhiều dự án nhất</h2>
          {topCategory ? (
            <div className="mt-3 rounded-lg bg-white/5 px-3 py-3 text-sm">
              <p className="font-semibold text-white">{topCategory.icon} {topCategory.name}</p>
              <p className="mt-1 text-xs text-white/40">{topCategory.count} dự án</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/40">Chưa có dữ liệu.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold text-white">Disclaimer mặc định (ĐẦU TƯ CÙNG TÔI)</h2>
        <p className="mt-1 text-xs text-white/40">Hiển thị ở mọi trang ĐẦU TƯ CÙNG TÔI trên Portal, có thể override riêng theo từng dự án.</p>
        <textarea
          value={disclaimer}
          onChange={(e) => setDisclaimer(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        />
        <button
          onClick={saveDisclaimer}
          className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          Lưu disclaimer
        </button>
      </div>

      <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
        <h2 className="text-sm font-bold text-white">⚠️ Portal Mapping — đối chiếu trực tiếp /portal/duan-cohoi (PROJECTS-SPR-601)</h2>
        <p className="mt-1 text-xs text-white/50">
          Đối tượng brief liệt kê (Project/Category/Article/CTA/External Link/Resource/FAQ/Visibility/Publish) đối chiếu
          với thực tế Consumer trên Portal — không bịa CRUD cho object không có Consumer thật.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="py-2 pr-4 font-semibold">Object</th>
                <th className="py-2 pr-4 font-semibold">Nguồn dữ liệu</th>
                <th className="py-2 pr-4 font-semibold">CRUD / Consumer</th>
                <th className="py-2 font-semibold">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {OBJECT_CONSUMER_MAPPING.map((row) => (
                <tr key={row.object} className="border-b border-white/5 align-top">
                  <td className="py-2 pr-4 font-semibold text-white/80 whitespace-nowrap">{row.object}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-white/60">{row.source}</td>
                  <td className="py-2 pr-4 whitespace-nowrap text-white/70">{row.consumer}</td>
                  <td className="py-2 text-xs text-white/50">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminWorkspaceShell>
  );
}
