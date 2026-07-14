"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Layers, Folder, Settings } from "lucide-react";
import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { useCollection } from "@/lib/admin/store";
import { MEDIA_ASSETS_COLLECTION_KEY, MEDIA_ASSETS_SEED, type MediaAsset, type MediaCategory } from "@/lib/admin/media/assetRegistry";
import { MEDIA_FOLDERS_COLLECTION_KEY, MEDIA_FOLDERS_SEED, type MediaFolder } from "@/lib/admin/media/folderRegistry";
import { MEDIA_COLLECTIONS_COLLECTION_KEY, MEDIA_COLLECTIONS_SEED, type MediaCollection } from "@/lib/admin/media/collectionRegistry";
import { MEDIA_TAGS_COLLECTION_KEY, MEDIA_TAGS_SEED, type MediaTag } from "@/lib/admin/media/tagRegistry";

// PMO APPROVAL Task 3/10 — chỉ còn 3 điểm đến gộp (khớp
// MEDIA_WORKSPACE_SECTIONS), không liệt kê lại Images/Videos/Documents/
// Audio/Collections/Tags — nay gộp vào Thư viện / Thư mục & Bộ sưu tập.
const QUICK_ACTIONS = [
  { label: "Thư viện", href: "/admin/media-center/library", icon: Layers },
  { label: "Thư mục & Bộ sưu tập", href: "/admin/media-center/folders", icon: Folder },
  { label: "Cài đặt", href: "/admin/media-center/settings", icon: Settings },
];

const CATEGORY_LABELS: Record<MediaCategory, string> = {
  Image: "Ảnh",
  Video: "Video",
  Document: "Tài liệu",
  Audio: "Âm thanh",
};

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}

/**
 * Media Dashboard (Task 1) — Tổng số Digital Assets/Storage Usage/
 * Recently Uploaded/Recently Used/Asset Distribution, đọc trực tiếp từ
 * Media Asset Registry đã seed thật (không phải Mock Data số 0 như
 * WEB-SPR-001 — đã đủ Registry thật ngay từ Foundation này, cùng cách
 * BRAND-SPR-001 làm cho Brand Studio).
 */
export default function MediaDashboardPage() {
  const assets = useCollection<MediaAsset>(MEDIA_ASSETS_COLLECTION_KEY, MEDIA_ASSETS_SEED);
  const folders = useCollection<MediaFolder>(MEDIA_FOLDERS_COLLECTION_KEY, MEDIA_FOLDERS_SEED);
  const collections = useCollection<MediaCollection>(MEDIA_COLLECTIONS_COLLECTION_KEY, MEDIA_COLLECTIONS_SEED);
  const tags = useCollection<MediaTag>(MEDIA_TAGS_COLLECTION_KEY, MEDIA_TAGS_SEED);

  const ready = assets.ready && folders.ready && collections.ready && tags.ready;

  const distribution = useMemo(() => {
    const counts: Record<MediaCategory, number> = { Image: 0, Video: 0, Document: 0, Audio: 0 };
    for (const a of assets.items) counts[a.category] += 1;
    return counts;
  }, [assets.items]);

  const activeCount = useMemo(() => assets.items.filter((a) => a.status === "Active").length, [assets.items]);
  const gapCount = useMemo(() => assets.items.filter((a) => a.name.startsWith("(Chưa có)")).length, [assets.items]);

  const recentlyUploaded = useMemo(
    () => [...assets.items].sort((a, b) => b.createdDate.localeCompare(a.createdDate)).slice(0, 5),
    [assets.items]
  );
  const recentlyUsed = useMemo(
    () => assets.items.filter((a) => a.usedByNote && !a.usedByNote.startsWith("Khoảng trống")).slice(0, 5),
    [assets.items]
  );

  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Tổng quan Media
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold normal-case text-white/40">
              Dữ liệu thật từ Thư viện Media
            </span>
          </p>
          {!ready ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Tổng số Media" value={assets.items.length} />
              <StatCard label="Đang dùng" value={activeCount} />
              <StatCard label="Khoảng trống (Chưa có)" value={gapCount} />
              <StatCard label="Dung lượng" value="Chưa đo" />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">⚠️ Phát hiện cần Founder xác nhận</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-white/70">
            <li>
              • <strong>2 ảnh founder khác nhau</strong> cho cùng chủ đề (`/founder.png` vs `/images/founder-portrait.jpg`) — xem Images.
            </li>
            <li>
              • <strong>[ĐÃ XỬ LÝ] `garden-care-visual.jpg`</strong> — asset mồ côi đã xóa (STABILIZATION-SPR-1101 Task 13).
            </li>
            <li>
              • <strong>Không có Video/Audio nào tồn tại</strong> trong Portal — 2 module này hiện 100% là khoảng trống.
            </li>
            <li>
              • <strong>PDF khoá học là URL động</strong> (`products.pdf_url`), không đi qua Media Center — Founder tự nhập URL ngoài ở Premium Workspace.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Phân bố theo loại</h2>
          {!ready ? (
            <div className="mt-3 h-16 animate-pulse rounded-lg bg-white/5" />
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.entries(distribution) as [MediaCategory, number][]).map(([cat, count]) => (
                <div key={cat} className="rounded-xl border border-white/10 p-3 text-center">
                  <p className="text-lg font-extrabold text-white">{count}</p>
                  <p className="text-[11px] text-white/40">{CATEGORY_LABELS[cat]}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-white/40">
            {folders.items.length} Thư mục · {collections.items.length} Bộ sưu tập · {tags.items.length} Nhãn
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-bold text-white">Mới tải lên</h2>
            {!ready ? (
              <div className="mt-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : recentlyUploaded.length === 0 ? (
              <p className="mt-3 text-sm text-white/40">Chưa có asset nào.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {recentlyUploaded.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate text-white/80">
                      {a.name} <span className="text-white/40">· {a.category}</span>
                    </span>
                    <span className="shrink-0 text-xs text-white/40">{a.createdDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-bold text-white">Mới sử dụng</h2>
            {!ready ? (
              <div className="mt-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : recentlyUsed.length === 0 ? (
              <p className="mt-3 text-sm text-white/40">Chưa có asset nào ghi nhận Used By.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {recentlyUsed.map((a) => (
                  <li key={a.id} className="text-sm">
                    <span className="text-white/80">{a.name}</span>
                    <p className="truncate text-xs text-white/40">{a.usedByNote}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Truy cập nhanh</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
              >
                <Icon className="h-5 w-5 text-brand-blue" />
                <span className="text-xs font-semibold text-white/80">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MediaWorkspaceShell>
  );
}
