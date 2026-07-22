import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nhóm 3, Phần D (mở rộng) — 5 trang chi tiết hệ sinh thái
 * (/portal/duan-cohoi/[ecosystemSlug]). Nguồn thật cho 2 field static
 * chrome đã chốt (name/shortDescription) — bảng `ecosystem_chrome`
 * (5 dòng, id = đúng `id` gốc trong ecosystems.ts), quản qua
 * /admin/duan-cohoi/[ecosystemSlug].
 *
 * KHÔNG dùng cho highlights/whoFor/whoNotReady/expectedOutcome/fullIntro/
 * statusBadge/icon hay marketingLinks/subProjects/fields/affiliateOffers/
 * exchanges/potentialAnalysis — các phần đó vẫn đọc trực tiếp từ
 * src/data/portal/ecosystems.ts (Ecosystem tĩnh) như cũ, không đụng.
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
};

function defaultChrome(id: string, name: string, shortDescription: string): EcosystemChrome {
  return { id, status: "Published", name, shortDescription };
}

const STATIC_FALLBACK: Record<string, { name: string; shortDescription: string }> = {
  eco_digiu: {
    name: "Hệ sinh thái DigiU",
    shortDescription: "Nền tảng học và kiếm thu nhập số — mình đang đồng hành và chia sẻ trải nghiệm thực tế.",
  },
  eco_solargroup: {
    name: "SolarGroup",
    shortDescription: "Cơ hội đầu tư cổ phần dài hạn — mình đang nghiên cứu và chia sẻ góc nhìn cá nhân.",
  },
  eco_crypto: {
    name: "Blockchain & Crypto",
    shortDescription: "Kiến thức nền tảng về hai mảng Blockchain và Crypto — bao gồm cả bài học từ sai lầm.",
  },
  eco_blockchain: {
    name: "Làm tiếp thị liên kết (Affiliate)",
    shortDescription: "Nơi mình liệt kê các chương trình/khoá học tiếp thị liên kết đang tìm hiểu hoặc quảng bá.",
  },
  eco_trading: {
    name: "Các sàn giao dịch Crypto",
    shortDescription: "Danh sách các sàn giao dịch crypto mình đang theo dõi hoặc đã dùng thử.",
  },
};

export const getLiveEcosystemChrome = cache(async (ecosystemId: string): Promise<EcosystemChrome> => {
  const fallback = STATIC_FALLBACK[ecosystemId];
  const defaultResult = fallback
    ? defaultChrome(ecosystemId, fallback.name, fallback.shortDescription)
    : defaultChrome(ecosystemId, "", "");

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
  };
});
