import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Affiliate Hub — 3 bảng generic (`id/data jsonb/status/order`) đã tồn tại
 * sẵn trong Supabase từ trước (đăng ký trong `supabaseCollections.ts`:
 * `affiliate-hub-sections`/`affiliate-products`/`affiliate-hub-top-products`),
 * có dữ liệu seed thật (7 section hướng dẫn, 1 sản phẩm, 1 nổi bật) nhưng
 * KHÔNG có trang Portal nào đọc và KHÔNG có Admin UI nào quản — đây là lần
 * đầu nối dây. Không migration mới, không đổi schema.
 *
 * `affiliate_links` (bảng thứ 4 cùng nhóm, có track `clicks`/`conversions`)
 * CHỦ ĐỘNG KHÔNG nối ở đây — 0 dòng dữ liệu, không có cơ chế click-tracking
 * thật nào trong dự án (không route redirect/ghi log nào tồn tại), nên
 * `clicks`/`conversions` sẽ là số liệu bịa nếu hiển thị — vi phạm nguyên
 * tắc NO-FAKE-DATA. Để nguyên mồ côi cho tới khi có quyết định riêng.
 */

export type AffiliateHubSection = {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  relatedResource?: string;
  relatedPrompt?: string;
  relatedTool?: string;
  relatedAffiliateProduct?: string;
  ctaText: string;
  ctaHref: string;
  order: number;
  status: string;
};

export type AffiliateProduct = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  audience: string;
  useCase: string;
  workflow: string;
  pros: string[];
  cons: string[];
  pricing: string;
  affiliateUrl: string;
  isAffiliate: boolean;
  videoUrl?: string;
  badge: string;
  featured: boolean;
  status: string;
};

export type AffiliateHubTopProduct = {
  id: string;
  productId: string;
  productName: string;
  badge: string;
  order: number;
  guideHref: string;
  trialHref: string;
  status: string;
};

export const getLiveAffiliateHubSections = cache(async (): Promise<AffiliateHubSection[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("affiliate_hub_sections")
    .select("id, data, status")
    .eq("status", "Published");
  if (error || !data) return [];
  // Thứ tự hiển thị thật nằm ở `data.order` (Founder tự nhập số), KHÔNG
  // phải cột "order" ngoài (luôn 0 với schema generic dùng qua route
  // /api/admin/collections — cùng lý do đã ghi ở "Chuyển đổi"/ecosystem
  // articles: cột đó không trả về qua GET route generic).
  return data
    .map((row) => {
      const d = (row.data ?? {}) as Record<string, unknown>;
      return {
        id: row.id as string,
        key: String(d.key ?? row.id),
        title: String(d.title ?? ""),
        description: String(d.description ?? ""),
        icon: String(d.icon ?? "🔗"),
        relatedResource: d.relatedResource ? String(d.relatedResource) : undefined,
        relatedPrompt: d.relatedPrompt ? String(d.relatedPrompt) : undefined,
        relatedTool: d.relatedTool ? String(d.relatedTool) : undefined,
        relatedAffiliateProduct: d.relatedAffiliateProduct ? String(d.relatedAffiliateProduct) : undefined,
        ctaText: String(d.ctaText ?? ""),
        ctaHref: String(d.ctaHref ?? "/portal/affiliate-hub"),
        order: Number(d.order ?? 0),
        status: String(row.status ?? "Draft"),
      };
    })
    .sort((a, b) => a.order - b.order);
});

export const getLiveAffiliateProducts = cache(async (): Promise<AffiliateProduct[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("affiliate_products")
    .select("id, data, status")
    .eq("status", "Published");
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      name: String(d.name ?? ""),
      slug: String(d.slug ?? row.id),
      logo: d.logo ? String(d.logo) : undefined,
      category: String(d.category ?? ""),
      shortDescription: String(d.shortDescription ?? ""),
      longDescription: String(d.longDescription ?? ""),
      audience: String(d.audience ?? ""),
      useCase: String(d.useCase ?? ""),
      workflow: String(d.workflow ?? ""),
      pros: Array.isArray(d.pros) ? (d.pros as string[]) : [],
      cons: Array.isArray(d.cons) ? (d.cons as string[]) : [],
      pricing: String(d.pricing ?? ""),
      affiliateUrl: String(d.affiliateUrl ?? ""),
      isAffiliate: Boolean(d.isAffiliate),
      videoUrl: d.videoUrl ? String(d.videoUrl) : undefined,
      badge: String(d.badge ?? "None"),
      featured: Boolean(d.featured),
      status: String(row.status ?? "Draft"),
    };
  });
});

export const getLiveAffiliateProductBySlug = cache(async (slug: string): Promise<AffiliateProduct | null> => {
  const products = await getLiveAffiliateProducts();
  return products.find((p) => p.slug === slug) ?? null;
});

export const getLiveAffiliateHubTopProducts = cache(async (): Promise<AffiliateHubTopProduct[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("affiliate_hub_top_products")
    .select("id, data, status")
    .eq("status", "Active");
  if (error || !data) return [];
  return data
    .map((row) => {
      const d = (row.data ?? {}) as Record<string, unknown>;
      return {
        id: row.id as string,
        productId: String(d.productId ?? ""),
        productName: String(d.productName ?? ""),
        badge: String(d.badge ?? "New"),
        order: Number(d.order ?? 0),
        guideHref: String(d.guideHref ?? "/portal/affiliate-hub"),
        trialHref: String(d.trialHref ?? ""),
        status: String(row.status ?? "Inactive"),
      };
    })
    .sort((a, b) => a.order - b.order);
});
