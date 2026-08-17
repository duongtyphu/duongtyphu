"use client";

/* =============================================================================
 * `/v2/admin/du-an-co-hoi` — nội dung Admin, tái dùng NGUYÊN CSS/lớp
 * `.duo`/`.cat-grid`/`.cat-card`/`.card` của trang Portal thật
 * (`/v2/du-an-co-hoi/du-an-co-hoi.css`) để hình ảnh trực quan khớp đúng
 * Portal — không dựng theo bộ khung KPI/DataTable chung
 * (`@/components/v2/ui/*`) hay bám layout bespoke riêng của
 * `Admin Du an Co hoi.html`.
 *
 * KHÔNG render sidebar/topbar của Portal (`.app`/`.sidebar`/`.topbar`) —
 * khung Admin đã có sẵn `AdminSidebar`/`Topbar` ở
 * `src/app/v2/admin/layout.tsx`. Chỉ mượn phần `.content` (center-col +
 * right-col) và style thẻ/card bên trong.
 *
 * Sửa nhanh (name/shortDescription/status) qua `updateEcosystemQuick()`
 * (`actions.ts`) — ghi thẳng bảng `ecosystem_chrome` mà cả Portal 1.0 lẫn
 * 2.0 đều đọc. Chỉnh sửa sâu hơn (fullIntro/highlights/links/dự án con/
 * bài viết/đánh giá...) trỏ sang `/admin/duan-cohoi/[slug]` (1.0) — nơi
 * đã có UI Live-edit đầy đủ cho toàn bộ các field này, không xây lại
 * trùng (Single Source of Truth cho cả DATA lẫn UI phức tạp).
 * ========================================================================= */

import Link from "next/link";
import { useState, useTransition } from "react";

import type { EcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import type { SubProjectRow } from "@/lib/portal/live-subprojects";
import type { EcosystemArticleRow } from "@/lib/portal/live-ecosystem-articles";
import type { EcosystemRatingRow } from "@/lib/portal/live-ecosystem-ratings";

import "../../inter-gf.css";
import "../../du-an-co-hoi/du-an-co-hoi.css";

import { updateEcosystemQuick } from "./actions";

const ECO_META: Record<string, { slug: string; bg: string; icon: React.ReactNode }> = {
  eco_digiu: {
    slug: "digiu",
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    icon: <><circle cx="7" cy="8" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="12" cy="16" r="3" /></>,
  },
  eco_solargroup: {
    slug: "solargroup",
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  },
  eco_crypto: {
    slug: "blockchain-crypto",
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    icon: <path d="M4 19h16M7 15l3-4 3 3 5-7" />,
  },
  eco_blockchain: {
    slug: "lam-affilate",
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    icon: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  },
  eco_trading: {
    slug: "sangiaodich",
    bg: "linear-gradient(145deg,#ff6b6b,#c22e46)",
    icon: <><path d="M4 19h4v-9H4zM10 19h4V5h-4zM16 19h4v-6h-4z" /></>,
  },
};

function QuickEditForm({ eco, onDone }: { eco: EcosystemChrome; onDone: () => void }) {
  const [name, setName] = useState(eco.name);
  const [shortDescription, setShortDescription] = useState(eco.shortDescription);
  const [status, setStatus] = useState(eco.status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    startTransition(async () => {
      try {
        await updateEcosystemQuick(eco.id, { name, shortDescription, status });
        onDone();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại.");
      }
    });
  };

  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
      <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>
        Tên hệ sinh thái
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: 3, padding: "7px 9px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 12.5 }}
        />
      </label>
      <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginTop: 8, marginBottom: 4 }}>
        Mô tả ngắn
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          rows={2}
          style={{ display: "block", width: "100%", marginTop: 3, padding: "7px 9px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 12.5, resize: "vertical" }}
        />
      </label>
      <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginTop: 8, marginBottom: 4 }}>
        Trạng thái
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: 3, padding: "7px 9px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 12.5 }}
        >
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Hidden">Hidden</option>
        </select>
      </label>
      {error ? <p style={{ color: "var(--red, #d64545)", fontSize: 11.5, marginTop: 6 }}>{error}</p> : null}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          type="button"
          disabled={pending}
          onClick={save}
          style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "none", background: "var(--violet)", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
        >
          {pending ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          type="button"
          onClick={onDone}
          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--line)", background: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}

export function AdminDuAnCoHoiClient({
  chromes,
  allSubProjects,
  allArticles,
  allRatings,
}: {
  chromes: EcosystemChrome[];
  allSubProjects: SubProjectRow[];
  allArticles: EcosystemArticleRow[];
  allRatings: EcosystemRatingRow[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalSubProjects = allSubProjects.filter((s) => s.status === "Published").length;
  const totalArticles = allArticles.filter((a) => a.status === "Published").length;
  const totalDocuments = chromes.reduce((sum, c) => sum + c.documents.filter((d) => d.visible).length, 0);
  const totalRatingsMet = allRatings.filter((r) => r.ratingStatus === "met").length;

  return (
    <div className="duo">
      <div className="content" style={{ padding: "24px 28px" }}>
        <div className="center-col">
          <div className="page-head">
            <h1>Quản lý Dự án &amp; Cơ hội</h1>
            <p>
              Sửa nhanh tên/mô tả/trạng thái 5 hệ sinh thái ngay tại đây — hiển thị đúng như trang{" "}
              <code>/v2/du-an-co-hoi</code> thật. Chỉnh sửa nội dung chi tiết (giới thiệu, dự án con, bài
              viết, đánh giá) ở trang quản trị đầy đủ.
            </p>
          </div>

          <div>
            <div className="section-head">
              <h3>5 hệ sinh thái</h3>
            </div>
            <div className="cat-grid" style={{ marginTop: 14 }}>
              {chromes.map((eco) => {
                const meta = ECO_META[eco.id];
                const subCount = allSubProjects.filter((s) => s.ecosystemId === eco.id && s.status === "Published").length;
                return (
                  <div key={eco.id} className="cat-card" style={{ cursor: "default" }}>
                    <div className="ico" style={{ background: meta.bg }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                        {meta.icon}
                      </svg>
                    </div>
                    <h5>{eco.name}</h5>
                    <p>
                      {subCount > 0 ? `${subCount} dự án con · ` : ""}
                      <span
                        style={{
                          fontWeight: 700,
                          color: eco.status === "Published" ? "#189a52" : "#a9822c",
                        }}
                      >
                        {eco.status}
                      </span>
                    </p>
                    <p style={{ marginTop: 2 }}>{eco.shortDescription}</p>

                    {editingId === eco.id ? (
                      <QuickEditForm eco={eco} onDone={() => setEditingId(null)} />
                    ) : (
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button
                          type="button"
                          onClick={() => setEditingId(eco.id)}
                          style={{ flex: 1, padding: "7px 9px", borderRadius: 8, border: "1px solid var(--line)", background: "#fff", fontWeight: 700, fontSize: 11.5, cursor: "pointer" }}
                        >
                          Sửa nhanh
                        </button>
                        <Link
                          href={`/admin/duan-cohoi/${meta.slug}`}
                          style={{ flex: 1, textAlign: "center", padding: "7px 9px", borderRadius: 8, border: "none", background: "var(--violet)", color: "#fff", fontWeight: 700, fontSize: 11.5, cursor: "pointer", textDecoration: "none" }}
                        >
                          Quản lý đầy đủ →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="right-col">
          <div className="card">
            <div className="card-head">
              <h4>Tổng quan dữ liệu thật</h4>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
              {chromes.length} hệ sinh thái · {totalSubProjects} dự án con · {totalArticles} bài viết ·{" "}
              {totalDocuments} tài liệu · {totalRatingsMet} tiêu chí đánh giá &quot;Đạt&quot;.
            </p>
          </div>

          <div className="card help-card2">
            <h4 style={{ marginBottom: 8 }}>Chỉnh sửa sâu hơn?</h4>
            <p>
              Giới thiệu chi tiết, dự án con, bài viết &quot;Cập nhật thông tin mới&quot;, video/tài liệu,
              đánh giá tiềm năng — quản lý đầy đủ ở Admin 1.0 (cùng bảng dữ liệu, Portal 2.0 đọc trực tiếp).
            </p>
            <Link className="help-link-btn" href="/admin/duan-cohoi/digiu">
              Mở trang quản trị đầy đủ →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
