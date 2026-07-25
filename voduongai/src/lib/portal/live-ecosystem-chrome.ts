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
 * KHÔNG dùng cho highlights/whoFor/whoNotReady/expectedOutcome/
 * statusBadge/icon hay subProjects (xem `live-subprojects.ts`)/fields/
 * affiliateOffers/exchanges/potentialAnalysis — các phần đó vẫn đọc trực
 * tiếp từ src/data/portal/ecosystems.ts (Ecosystem tĩnh) như cũ.
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
  };
});
