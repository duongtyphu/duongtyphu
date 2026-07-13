"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { FOUNDER_SECTIONS } from "@/lib/admin/founder/navigation";
import { usePublishPipelineStats, type PublishTrackedItem } from "@/lib/admin/founder/publishPipelineStats";

function Bucket({ title, tone, items, emptyNote }: { title: string; tone: string; items: PublishTrackedItem[]; emptyNote?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-xs text-white/40">{emptyNote ?? "Không có item nào."}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((it) => (
            <li key={it.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm">
              <p className="font-semibold text-white/80">{it.title || "(chưa có tiêu đề)"}</p>
              <p className="mt-0.5 text-xs text-white/40">
                {it.sourceLabel} · cập nhật {it.updatedDate || "—"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Review Queue thật (FOUNDER-SPR-1001 Task 3) — thay Placeholder cũ
 * (ADM-SPR-200 Task 7). Gộp từ 15 collection thật có khái niệm Review
 * (13 CKOS + Website Pages + Website Shared Sections) qua
 * usePublishPipelineStats() — cùng nguồn dữ liệu với Publish Center ở
 * Founder Operation Center (/admin/founder), không tạo Review Manifest
 * mới ngoài kế hoạch cũ.
 */
export default function ReviewQueuePage() {
  const { items, ready, trackedCollectionCount } = usePublishPipelineStats();

  const pending = items.filter((it) => it.status === "Review" || it.status === "In Review");
  const approved = items.filter((it) => it.status === "Approved");
  const needsChange = items.filter((it) => it.status === "Changes Requested");

  return (
    <AdminWorkspaceShell
      title="Review Queue"
      description={
        ready
          ? `Gộp thật từ ${trackedCollectionCount} collection có khái niệm Review (13 CKOS + Website Pages + Shared Sections) — 34+ collection khác trong Admin chỉ Active/Inactive, không có bước Review, không xuất hiện ở đây.`
          : "Đang tải..."
      }
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Bucket title="Pending Review" tone="bg-blue-500/10 text-blue-300" items={pending} />
        <Bucket title="Approved" tone="bg-violet-500/10 text-violet-300" items={approved} />
        <Bucket title="Needs Change" tone="bg-orange-500/10 text-orange-300" items={needsChange} />
        <Bucket
          title="Rejected"
          tone="bg-red-500/10 text-red-300"
          items={[]}
          emptyNote={
            'Không tồn tại trạng thái "Rejected" ở bất kỳ collection nào trong Admin hiện tại — trạng thái gần nhất là "Archived", nhưng đó là hậu-Published (gỡ khỏi Portal), không phải từ chối duyệt. Không tự thêm trạng thái mới (đúng "Không tạo tài liệu Product mới").'
          }
        />
      </div>
    </AdminWorkspaceShell>
  );
}
