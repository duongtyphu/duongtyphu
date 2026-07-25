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
 *
 * `images`/`links` (mở rộng riêng, theo yêu cầu Founder "để admin linh
 * động và tuỳ biến bài viết hơn") — danh sách KHÔNG giới hạn số lượng,
 * KHÔNG chèn tại vị trí con trỏ trong `content` (dự án chưa có trình
 * soạn thảo dạng khối/markdown nào, Founder xác nhận chọn phương án đơn
 * giản: gắn theo bài, hiển thị ở khu vực riêng trong trang chi tiết —
 * ảnh phụ hiện dưới nội dung, link hiện thành dãy nút ở cuối bài).
 * `imageUrl` (ảnh bìa/thumbnail cho thẻ trong băng chạy) GIỮ NGUYÊN tách
 * biệt với `images[]` (ảnh phụ trong bài) — không gộp 2 khái niệm.
 * `links[]` THAY THẾ hẳn 2 field đơn `linkLabel`/`linkUrl` cũ (bài viết
 * seed trước đó đã migrate qua `execute_sql`, xem migration file) — mỗi
 * link có cờ `affiliate` để Admin tự đánh dấu link nào là link tiếp thị
 * liên kết (hiển thị nhãn "Affiliate" ngoài Portal cho minh bạch, đúng
 * tinh thần NO-FAKE-DATA/minh bạch đã áp dụng xuyên suốt dự án).
 */
export type ArticleImage = { url: string; caption: string };
export type ArticleLink = { label: string; url: string; affiliate: boolean };

export type EcosystemArticleRow = {
  id: string;
  status: "Draft" | "Published" | "Hidden";
  ecosystemId: string;
  subProjectId: string;
  slug: string;
  title: string;
  content: string;
  imageUrl: string;
  images: ArticleImage[];
  links: ArticleLink[];
  seoTitle: string;
  metaDescription: string;
  displayOrder: number;
};

function toImages(value: unknown): ArticleImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    .map((v) => ({
      url: typeof v.url === "string" ? v.url : "",
      caption: typeof v.caption === "string" ? v.caption : "",
    }))
    .filter((img) => img.url.length > 0);
}

function toLinks(value: unknown): ArticleLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    .map((v) => ({
      label: typeof v.label === "string" ? v.label : "",
      url: typeof v.url === "string" ? v.url : "",
      affiliate: v.affiliate === true,
    }))
    .filter((link) => link.url.length > 0);
}

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
    images: toImages(d.images),
    links: toLinks(d.links),
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
