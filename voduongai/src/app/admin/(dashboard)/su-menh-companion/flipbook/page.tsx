"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 6 (Nhóm B), Phần 2 — 7 trang flipbook "Companion qua hình ảnh"
 * (/portal/su-menh-companion/companion-qua-hinh-anh). Mỗi trang là MỘT
 * ảnh nghệ thuật đã thiết kế sẵn (webp) + 1 tiêu đề — khác hẳn 6 khối văn
 * bản ở Phần 1. Chỉ quản title/thứ tự hiển thị — KHÔNG cho sửa/upload ảnh
 * qua Admin này (ảnh vẫn qua quy trình thiết kế/upload asset riêng), nên
 * `src` KHÔNG có trong `fields` (không có ô nhập) — chỉ hiển thị đường dẫn
 * hiện tại trong `renderCard` để Founder đối chiếu.
 */
type FlipbookPage = {
  id: string;
  title: string;
  src: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề trang", type: "text", required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCompanionFlipbookPage() {
  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <VisualEditor<FlipbookPage>
        collectionKey="companion-flipbook-pages"
        title="Ảnh Companion (thứ tự & tiêu đề)"
        itemNoun="trang"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 truncate font-mono text-[11px] text-gray-400">{item.src}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
