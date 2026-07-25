import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * "Cập nhật thông tin mới" — băng bài viết chạy liên tục cho hệ sinh thái
 * VÀ dự án con, dùng CHUNG 1 bảng `ecosystem_articles` cho mọi hệ sinh
 * thái hiện có và tương lai (6, 7, 8...) — không hardcode theo từng hệ
 * sinh thái, lọc theo `ecosystemId`/`subProjectId` trong `data` jsonb.
 *
 * `subProjectId: ""` = bài viết cấp hệ sinh thái (hiển thị ở trang hub
 * ecosystem); `subProjectId` khác rỗng = bài viết CHỈ của đúng 1 dự án
 * con đó (không lẫn vào băng bài viết cấp hệ sinh thái).
 *
 * `displayOrder` là field THƯỜNG bên trong `data` (không phải cột `order`
 * ở ngoài — cột đó không trả về qua GET /api/admin/collections/[table],
 * xem route đó) — Admin tự nhập số thứ tự, không kéo-thả (đơn giản hoá,
 * tránh phức tạp reorder() bulk-replace ảnh hưởng chéo giữa các hệ sinh
 * thái khác nhau cùng bảng).
 */
export type EcosystemArticleRow = {
  id: string;
  status: "Draft" | "Published" | "Hidden";
  ecosystemId: string;
  subProjectId: string;
  slug: string;
  title: string;
  content: string;
  imageUrl: string;
  linkLabel: string;
  linkUrl: string;
  seoTitle: string;
  metaDescription: string;
  displayOrder: number;
};

function toRow(row: { id: string; data: unknown; status: string }): EcosystemArticleRow {
  const d = (row.data ?? {}) as Record<string, unknown>;
  return {
    id: row.id,
    status: (row.status as EcosystemArticleRow["status"]) ?? "Draft",
    ecosystemId: typeof d.ecosystemId === "string" ? d.ecosystemId : "",
    subProjectId: typeof d.subProjectId === "string" ? d.subProjectId : "",
    slug: typeof d.slug === "string" ? d.slug : "",
    title: typeof d.title === "string" ? d.title : "",
    content: typeof d.content === "string" ? d.content : "",
    imageUrl: typeof d.imageUrl === "string" ? d.imageUrl : "",
    linkLabel: typeof d.linkLabel === "string" ? d.linkLabel : "",
    linkUrl: typeof d.linkUrl === "string" ? d.linkUrl : "",
    seoTitle: typeof d.seoTitle === "string" ? d.seoTitle : "",
    metaDescription: typeof d.metaDescription === "string" ? d.metaDescription : "",
    displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : 0,
  };
}

/** Toàn bộ bảng (mọi hệ sinh thái/dự án con) — dùng làm `seed` cho
 * `useCollection("ecosystem-articles", ...)` ở Server Component, lọc lại
 * theo scope ngay trong Client Component (đúng nguyên tắc "seed IS the
 * live data" — seed phải cùng shape RAW với dữ liệu fetch thật). */
export const getAllLiveEcosystemArticles = cache(async (): Promise<EcosystemArticleRow[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ecosystem_articles").select("id, data, status");
  if (error || !data) return [];
  return data.map(toRow);
});

/** Danh sách bài viết ĐÃ Published cho đúng 1 hệ sinh thái (và tuỳ chọn 1
 * dự án con), sắp theo `displayOrder` — dùng để render băng chạy thật ở
 * Portal. */
export async function getLiveEcosystemArticles(
  ecosystemId: string,
  subProjectId = "",
): Promise<EcosystemArticleRow[]> {
  const all = await getAllLiveEcosystemArticles();
  return all
    .filter((a) => a.status === "Published" && a.ecosystemId === ecosystemId && a.subProjectId === subProjectId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/** 1 bài viết theo slug, trong phạm vi 1 hệ sinh thái (không phân biệt
 * cấp hệ sinh thái/dự án con — slug do Admin tự đảm bảo không trùng). */
export async function getLiveEcosystemArticleBySlug(
  ecosystemId: string,
  slug: string,
): Promise<EcosystemArticleRow | undefined> {
  const all = await getAllLiveEcosystemArticles();
  return all.find((a) => a.status === "Published" && a.ecosystemId === ecosystemId && a.slug === slug);
}
