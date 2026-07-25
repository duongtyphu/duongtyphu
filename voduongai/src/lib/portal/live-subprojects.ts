import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { MarketingLink } from "@/data/portal/ecosystems";

/**
 * "Thêm được các dự án con" (mở rộng riêng, theo yêu cầu Founder) — thay
 * hẳn `eco.subProjects` (mảng TĨNH trong ecosystems.ts) bằng bảng
 * Supabase generic `ecosystem_subprojects`, dùng chung cho mọi hệ sinh
 * thái hiện có/tương lai — Admin tự thêm/sửa/xoá dự án con qua
 * `SubProjectsAdminPanel.tsx`.
 *
 * KHÔNG lưu `colorIndex` — mỗi dòng nhận màu theo VỊ TRÍ trong danh sách
 * đã sắp `displayOrder` (`getSubProjectSurface(index)`, cùng cách
 * palette cũ cycle theo index — xem `subProjectPalette.ts`).
 */
export type SubProjectRow = {
  id: string;
  status: "Draft" | "Published" | "Hidden";
  ecosystemId: string;
  slug: string;
  name: string;
  shortDescription: string;
  links: MarketingLink[];
  displayOrder: number;
};

function toLinks(value: unknown): MarketingLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    .map((v, i) => ({
      id: typeof v.id === "string" ? v.id : `link_${i}`,
      label: typeof v.label === "string" ? v.label : "",
      url: typeof v.url === "string" ? v.url : "",
      order: typeof v.order === "number" ? v.order : i,
      visible: v.visible !== false,
    }))
    .filter((l) => l.url.length > 0);
}

function toRow(row: { id: string; data: unknown; status: string }): SubProjectRow {
  const d = (row.data ?? {}) as Record<string, unknown>;
  return {
    id: row.id,
    status: (row.status as SubProjectRow["status"]) ?? "Draft",
    ecosystemId: typeof d.ecosystemId === "string" ? d.ecosystemId : "",
    slug: typeof d.slug === "string" ? d.slug : "",
    name: typeof d.name === "string" ? d.name : "",
    shortDescription: typeof d.shortDescription === "string" ? d.shortDescription : "",
    links: toLinks(d.links),
    displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : 0,
  };
}

/** Toàn bộ bảng (mọi hệ sinh thái) — dùng làm `seed` cho
 * `useCollection("ecosystem-subprojects", ...)`, lọc lại theo scope
 * trong Client Component (đúng "seed IS the live data"). */
export const getAllLiveSubProjects = cache(async (): Promise<SubProjectRow[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ecosystem_subprojects").select("id, data, status");
  if (error || !data) return [];
  return data.map(toRow);
});

/** Danh sách dự án con ĐÃ Published của 1 hệ sinh thái, sắp theo
 * `displayOrder` — dùng cho lưới "Các dự án con" ở trang hệ sinh thái. */
export async function getLiveSubProjects(ecosystemId: string): Promise<SubProjectRow[]> {
  const all = await getAllLiveSubProjects();
  return all
    .filter((s) => s.status === "Published" && s.ecosystemId === ecosystemId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/** 1 dự án con theo slug, trong phạm vi 1 hệ sinh thái — dùng cho trang
 * chi tiết `/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]`. */
export async function getLiveSubProjectBySlug(
  ecosystemId: string,
  slug: string,
): Promise<SubProjectRow | undefined> {
  const all = await getAllLiveSubProjects();
  return all.find((s) => s.status === "Published" && s.ecosystemId === ecosystemId && s.slug === slug);
}
