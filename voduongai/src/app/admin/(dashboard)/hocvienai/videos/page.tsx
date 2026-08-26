"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Mục 4b (kế hoạch gốc 14 hạng mục) — Học viện AI 2.0, tab "Khóa học & Lộ
 * trình", lưới video YouTube. Đọc bởi `getAcademyVideos()`
 * (`src/lib/portal/live-academy-slides.ts`), hiển thị ở `/v2/hoc-vien-ai`.
 */
type VideoItem = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "youtubeUrl", label: "Link YouTube", type: "text", required: true, placeholder: "https://youtu.be/..." },
  { key: "description", label: "Mô tả ngắn", type: "textarea", full: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminAcademyVideosPage() {
  return (
    <AdminAtmosphere atmosphereClassName="academy-atmosphere-bg">
      <VisualEditor<VideoItem>
        collectionKey="academy-videos"
        title="Học viện AI — Video hướng dẫn"
        itemNoun="video"
        fields={fields}
        breadcrumb={[
          { label: "Học viện" },
          { label: "Học viện AI", href: "/admin/hocvienai/work-needs" },
          { label: "Video hướng dẫn" },
        ]}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
            <p className="mt-1 truncate text-xs text-brand-blue">{item.youtubeUrl}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
