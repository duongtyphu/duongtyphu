import { notFound } from "next/navigation";

import { getCkosCategories, getCkosDocuments } from "@/lib/portal/live-ckos";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { CategoryDetailClient } from "./CategoryDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categories = await getCkosCategories();
  const category = categories.find((c) => c.slug === slug);
  return {
    title: category
      ? `${category.name} | Hệ tri thức (CKOS) | VO DUONG AI`
      : "Không tìm thấy danh mục | VO DUONG AI",
    description: category?.description,
  };
}

/**
 * `/v2/he-tri-thuc/danh-muc/[slug]` — trang xem đầy đủ tài liệu thuộc 1
 * trong 6 "Danh mục tri thức nổi bật" (Nền tảng AI/Prompt Engineering/Ứng
 * dụng AI/Công cụ AI/Kỹ năng & Tư duy/Tri thức nâng cao).
 *
 * KHÔNG có mockup riêng (đã xác nhận với Founder — cùng tình huống với
 * `/v2/he-tri-thuc/[slug]`/`bai-hoc/[slug]`/`bo-suu-tap/[slug]`) — dựng mới
 * dựa trên `he-tri-thuc.css`/tông màu-font sẵn có, tái dùng NGUYÊN VĂN
 * sidebar/topbar (page-shell duplication, đúng tiền lệ). Đây chính là đích
 * thật cho 6 thẻ danh mục ở view "Tất cả tri thức" — trước đó mỗi thẻ chỉ
 * hiển thị số đếm, không bấm được (nút "Xem tất cả →" ở "Danh mục tri thức
 * nổi bật" đã bị xoá trước đó vì "chưa có trang xem đầy đủ riêng").
 *
 * Đọc `getCkosDocuments()` đã có sẵn (Bước D — KHÔNG bao giờ chứa `body`,
 * chỉ tóm tắt/metadata) rồi lọc theo `categorySlug` — không thêm hàm data
 * layer mới, vì danh sách chỉ 13 tài liệu tổng (đủ nhẹ để lọc phía server
 * component sau khi fetch 1 lần, đúng cách `getCkosPopularDocuments()` đã
 * làm).
 */
export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [categories, documents, premium] = await Promise.all([
    getCkosCategories(),
    getCkosDocuments(),
    getPremiumStatus(),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const categoryDocuments = documents.filter((d) => d.categorySlug === slug);

  return <CategoryDetailClient category={category} documents={categoryDocuments} premium={premium} />;
}
