import { notFound } from "next/navigation";

import { getLiveKnowledgeCollections, getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { CollectionDetailClient } from "./CollectionDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const collections = await getLiveKnowledgeCollections();
  const collection = collections.find((c) => c.slug === slug);
  return {
    title: collection ? `${collection.title} | Thư viện AI | VO DUONG AI` : "Không tìm thấy bộ sưu tập | VO DUONG AI",
    description: collection?.description,
  };
}

/**
 * `/v2/he-tri-thuc/bo-suu-tap/[slug]` — trang xem 1 Bộ sưu tập
 * (`knowledge_collections`) gốc của 2.0, thay thế đích trung gian trỏ ra 1.0
 * (`/portal/hetrithucai/collection/[slug]`) mà "Thư viện của tôi"
 * (`CkosClient.tsx`) đang dùng.
 *
 * Cùng nguyên tắc với `bai-hoc/[slug]`: không có mockup riêng, tái dùng
 * chrome + `he-tri-thuc.css`, KHÔNG mang theo "Learning Engine" của
 * `KnowledgeCollectionView.tsx` 1.0 (progress %, Learning Path có trạng thái
 * done/next, gợi ý Collection tiếp theo, Companion suggestion) — chỉ hiển
 * thị đọc: tiêu đề/mô tả + danh sách Bài học thuộc bộ sưu tập, mỗi bài trỏ
 * sang `bai-hoc/[slug]` gốc.
 */
export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const [collections, seeds, premium] = await Promise.all([
    getLiveKnowledgeCollections(),
    getLiveKnowledgeSeeds(),
    getPremiumStatus(),
  ]);
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();
  const collectionSeeds = seeds.filter((s) => s.collectionSlug === collection.slug);

  return <CollectionDetailClient collection={collection} seeds={collectionSeeds} premium={premium} />;
}
