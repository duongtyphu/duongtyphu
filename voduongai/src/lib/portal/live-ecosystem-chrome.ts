import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import { ecosystems, type MarketingLink } from "@/data/portal/ecosystems";

/**
 * Nhóm 3, Phần D (mở rộng) — 5 trang chi tiết hệ sinh thái
 * (/portal/duan-cohoi/[ecosystemSlug]). Nguồn thật cho field static chrome
 * — bảng `ecosystem_chrome` (5 dòng, id = đúng `id` gốc trong ecosystems.ts),
 * quản qua /admin/duan-cohoi/[ecosystemSlug].
 *
 * Mở rộng riêng (theo yêu cầu Founder "phải chỉnh sửa được... giới thiệu
 * hệ sinh thái - Đường link liên kết dự án"): thêm `fullIntro` (đoạn giới
 * thiệu dài) và `links` (thay thế `eco.marketingLinks` tĩnh — chính là
 * "Đường link liên kết dự án" hiển thị qua `MarketingLinkBox`, xem
 * `EcosystemLinksBox.tsx`). CHỈ áp dụng cho hệ sinh thái loại
 * `structureType === "sub-projects"` (nơi `eco.marketingLinks` từng render
 * ở cấp hệ sinh thái) — 3 loại còn lại (two-field/affiliate-list/
 * exchange-list) vẫn đọc tĩnh `fields[].marketingLinks`/`affiliateOffers`/
 * `exchanges`, ngoài phạm vi mở rộng này.
 *
 * Mở rộng thêm lần nữa: `statusBadge`/`highlights`/`whoFor`/
 * `whoNotReady`/`expectedOutcome` (xem comment ở `EcosystemChrome` type)
 * — Founder xác nhận muốn sửa được toàn bộ nội dung chữ ở "session đầu
 * tiên" của trang chi tiết. KHÔNG dùng cho `icon` (function reference,
 * không serialize được — vẫn đọc `eco.slug` resolve icon ở
 * `EcosystemOverview.tsx`) hay `subProjects` (xem `live-subprojects.ts`)/
 * `fields`/`affiliateOffers`/`exchanges`/`potentialAnalysis` — các phần
 * đó vẫn đọc trực tiếp từ src/data/portal/ecosystems.ts (Ecosystem tĩnh)
 * như cũ.
 *
 * Dùng getSupabasePublic() (không cookies()) — cùng pattern
 * live-mirror.ts/live-journal.ts/live-story.ts/live-map.ts/live-garden.ts.
 * Trang chi tiết vẫn dùng generateStaticParams() (SSG, build-time fetch) —
 * cùng cách /portal/resources/[id] đã đọc nội dung Admin-managed mà không
 * cần chuyển route sang dynamic.
 */
export type EcosystemChrome = {
  id: string;
  status: string;
  name: string;
  shortDescription: string;
  fullIntro: string;
  links: MarketingLink[];
  /** "Video dự án" + "Link tải tài liệu" (mở rộng riêng, theo yêu cầu
   * Founder — 2 section mới dưới "Các dự án con") — cùng shape
   * `MarketingLink[]` để tái dùng `MarketingLinksFieldEditor` (label/url/
   * visible/order) không cần kiểu dữ liệu mới. Honestly rỗng cho tới khi
   * Admin thêm — không bịa nội dung. */
  videos: MarketingLink[];
  documents: MarketingLink[];
  /** Mở rộng riêng (theo yêu cầu Founder "chỉnh sửa được tất cả các
   * trường có nội dung chữ ở session đầu tiên") — 5 field trước đó CHỈ
   * đọc tĩnh từ `eco.*` (xem comment cũ ở trên, giờ không còn đúng nữa).
   * `statusBadge` giới hạn đúng 5 giá trị của `EcosystemStatusBadge`
   * (`ecosystems.ts`) — Admin chọn qua select, không gõ tay tự do.
   * `highlights` — mảng câu ghi chú (có thể chứa dấu phẩy trong câu), sửa
   * qua textarea nhiều dòng (`transform: "newline-list"`, xem
   * `EditableRegion.tsx`), KHÔNG dùng `type: "tags"` (tags tách theo dấu
   * phẩy, sẽ cắt sai giữa câu). */
  statusBadge: string;
  highlights: string[];
  whoFor: string;
  whoNotReady: string;
  expectedOutcome: string;
  /** Mở rộng riêng — "Lấy format DigiU làm chuẩn áp dụng cho các dự án
   * khác" (Founder yêu cầu đồng bộ TÍNH NĂNG, giữ bố cục riêng từng loại
   * `structureType`). 3 field dưới đây là bản Admin-editable của 3 danh
   * sách link trước đây CHỈ đọc tĩnh từ `ecosystems.ts`
   * (`eco.affiliateOffers`/`eco.exchanges`/`eco.fields[].marketingLinks`),
   * y hệt cách `links` ở trên đã thay `eco.marketingLinks` tĩnh cho loại
   * "sub-projects". Dùng chung shape `MarketingLink[]` (dùng lại
   * `MarketingLinksFieldEditor`) — `AffiliateOffer.name`/`ExchangeLink.name`
   * map vào `label`. `fieldLinks` khoá theo `EcosystemFieldBox.id` (chỉ
   * loại "two-field" có 2 khoá cố định `field_blockchain`/`field_crypto`). */
  affiliateOffers: MarketingLink[];
  exchanges: MarketingLink[];
  fieldLinks: Record<string, MarketingLink[]>;
};

/** `requireUrl` mặc định `true` (đúng hành vi cũ của `links`/`videos`/
 * `documents`/`fieldLinks` — bỏ qua dòng chưa có URL). `false` dành riêng
 * cho `affiliateOffers`/`exchanges` — 2 danh sách này CỐ TÌNH hiện tên dù
 * chưa có URL thật (khung "Chưa có link tiếp thị thật, sẽ cập nhật khi
 * có." — đúng nguyên tắc no-fake-data đã áp dụng từ `ecosystems.ts` cũ),
 * lọc theo URL ở đây sẽ âm thầm xoá mất các dòng đó. */
function toLinks(value: unknown, requireUrl = true): MarketingLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    .map((v, i) => ({
      id: typeof v.id === "string" ? v.id : `link_${i}`,
      label: typeof v.label === "string" ? v.label : "",
      url: typeof v.url === "string" ? v.url : "",
      order: typeof v.order === "number" ? v.order : i,
      visible: v.visible !== false,
      ...(typeof v.category === "string" ? { category: v.category } : {}),
    }))
    .filter((l) => (requireUrl ? l.url.length > 0 : l.label.length > 0));
}

function toFieldLinks(value: unknown): Record<string, MarketingLink[]> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([fieldId, links]) => [fieldId, toLinks(links)]),
  );
}

/** Fallback tĩnh — lấy TRỰC TIẾP từ `ecosystems.ts` (nguồn thật duy nhất
 * cho nội dung gốc), không copy tay lần 2 (tránh sai lệch/đánh máy nhầm
 * giữa 2 nơi giữ cùng nội dung). */
function staticFallback(ecosystemId: string): EcosystemChrome {
  const eco = ecosystems.find((e) => e.id === ecosystemId);
  return {
    id: ecosystemId,
    status: "Published",
    name: eco?.name ?? "",
    shortDescription: eco?.shortDescription ?? "",
    fullIntro: eco?.fullIntro ?? "",
    links: eco?.marketingLinks ?? [],
    videos: [],
    documents: [],
    statusBadge: eco?.statusBadge ?? "",
    highlights: eco?.highlights ?? [],
    whoFor: eco?.whoFor ?? "",
    whoNotReady: eco?.whoNotReady ?? "",
    expectedOutcome: eco?.expectedOutcome ?? "",
    affiliateOffers: (eco?.affiliateOffers ?? []).map((o) => ({
      id: o.id,
      label: o.name,
      url: o.url ?? "",
      order: o.order,
      visible: o.visible,
      category: o.category,
    })),
    exchanges: (eco?.exchanges ?? []).map((x) => ({
      id: x.id,
      label: x.name,
      url: x.url ?? "",
      order: x.order,
      visible: x.visible,
    })),
    fieldLinks: Object.fromEntries((eco?.fields ?? []).map((f) => [f.id, f.marketingLinks])),
  };
}

export const getLiveEcosystemChrome = cache(async (ecosystemId: string): Promise<EcosystemChrome> => {
  const defaultResult = staticFallback(ecosystemId);

  const supabase = getSupabasePublic();
  if (!supabase) return defaultResult;
  const { data, error } = await supabase
    .from("ecosystem_chrome")
    .select("id, data, status")
    .eq("id", ecosystemId)
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return defaultResult;
  const d = (data.data ?? {}) as Record<string, unknown>;
  return {
    id: data.id,
    status: data.status,
    name: typeof d.name === "string" ? d.name : defaultResult.name,
    shortDescription: typeof d.shortDescription === "string" ? d.shortDescription : defaultResult.shortDescription,
    fullIntro: typeof d.fullIntro === "string" ? d.fullIntro : defaultResult.fullIntro,
    // Array.isArray (không phải length>0) — phân biệt "chưa migrate field
    // này" (fallback tĩnh) với "Admin đã chủ động xoá hết link" (tôn
    // trọng mảng rỗng thật, không âm thầm khôi phục lại link cũ).
    links: Array.isArray(d.links) ? toLinks(d.links) : defaultResult.links,
    videos: Array.isArray(d.videos) ? toLinks(d.videos) : defaultResult.videos,
    documents: Array.isArray(d.documents) ? toLinks(d.documents) : defaultResult.documents,
    statusBadge: typeof d.statusBadge === "string" ? d.statusBadge : defaultResult.statusBadge,
    highlights: Array.isArray(d.highlights) ? d.highlights.filter((h): h is string => typeof h === "string") : defaultResult.highlights,
    whoFor: typeof d.whoFor === "string" ? d.whoFor : defaultResult.whoFor,
    whoNotReady: typeof d.whoNotReady === "string" ? d.whoNotReady : defaultResult.whoNotReady,
    expectedOutcome: typeof d.expectedOutcome === "string" ? d.expectedOutcome : defaultResult.expectedOutcome,
    affiliateOffers: Array.isArray(d.affiliateOffers) ? toLinks(d.affiliateOffers, false) : defaultResult.affiliateOffers,
    exchanges: Array.isArray(d.exchanges) ? toLinks(d.exchanges, false) : defaultResult.exchanges,
    fieldLinks:
      typeof d.fieldLinks === "object" && d.fieldLinks !== null && !Array.isArray(d.fieldLinks)
        ? toFieldLinks(d.fieldLinks)
        : defaultResult.fieldLinks,
  };
});
