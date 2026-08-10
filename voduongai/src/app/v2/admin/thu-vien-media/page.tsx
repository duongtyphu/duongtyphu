import { FileText, HardDrive, Image as ImageIcon, Video } from "lucide-react";

import { UploadSlot } from "@/components/v2/ui/Controls";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { formatDate } from "@/lib/v2/data/client";
import { MEDIA_KIND_LABEL, listMedia } from "@/lib/v2/data/ops";

export const metadata = { title: "Thư viện Media — Admin" };

const KIND_STYLE = {
  image: { background: "var(--v2-violet-light)", color: "var(--v2-violet)" },
  video: { background: "#e6f0ff", color: "#1d5fd8" },
  document: { background: "#fdf1e0", color: "#a9822c" },
} as const;

/** 392 -> "392 KB"; 48200 -> "47,1 MB" */
function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1).replace(".", ",")} MB`;
}

export default async function AdminThuVienMediaPage() {
  const assets = await listMedia();

  const rows: TableRow[] = assets.map((asset) => ({
    id: asset.id,
    tags: [asset.kind],
    cells: [
      { t: "strong", v: asset.name },
      {
        t: "tag",
        label: MEDIA_KIND_LABEL[asset.kind],
        background: KIND_STYLE[asset.kind].background,
        color: KIND_STYLE[asset.kind].color,
      },
      { t: "muted", v: asset.folder },
      { t: "text", v: formatSize(asset.sizeKb) },
      { t: "text", v: `${asset.usedIn} nơi` },
      { t: "muted", v: formatDate(asset.uploadedAt) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tổng quan › Thư viện Media"
        title="Thư viện Media"
        description="Quản lý tập trung ảnh, video và tài liệu dùng trên Portal & Landing Page."
      />

      <KpiGrid
        items={[
          { id: "storage", value: "2.148 GB", label: "Đã dùng / 5.000 GB", icon: HardDrive, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "images", value: "6.842", label: "Tổng số ảnh", icon: ImageIcon, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
          { id: "videos", value: "312", label: "Tổng số video", icon: Video, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "docs", value: "1.096", label: "Tài liệu / khác", icon: FileText, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
        ]}
      />

      <UploadSlot label="Kéo thả tệp vào đây, hoặc bấm để chọn từ máy (ảnh, video, PDF — tối đa 200 MB)" />

      <DataTable
        title="Tệp trong thư viện"
        headers={["Tên tệp", "Loại", "Thư mục", "Dung lượng", "Đang dùng", "Ngày tải lên"]}
        rows={rows}
        totalLabel="tệp"
        totalOverride={8250}
        searchPlaceholder="Tìm theo tên tệp hoặc thư mục..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "image", label: "Ảnh", tag: "image" },
          { id: "video", label: "Video", tag: "video" },
          { id: "document", label: "Tài liệu", tag: "document" },
        ]}
      />
    </div>
  );
}
