import { notFound } from "next/navigation";

import { getLiveKnowledgeCollections, getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { LessonDetailClient } from "./LessonDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const seeds = await getLiveKnowledgeSeeds();
  const seed = seeds.find((s) => s.slug === slug);
  return {
    title: seed ? `${seed.title} | Thư viện AI | VO DUONG AI` : "Không tìm thấy bài học | VO DUONG AI",
  };
}

/**
 * `/v2/he-tri-thuc/bai-hoc/[slug]` — trang xem 1 bài học (Lesson) gốc của 2.0,
 * thay thế đích trung gian trỏ ra 1.0 (`/portal/hetrithucai/[slug]`) mà
 * "Thư viện của tôi" (`CkosClient.tsx`) đang dùng.
 *
 * KHÔNG có mockup riêng cho trang này (đã xác nhận với Founder — cùng tình
 * huống với `/v2/he-tri-thuc/[slug]`) — dựng mới dựa trên `he-tri-thuc.css`/
 * tông màu-font sẵn có, tái dùng NGUYÊN VĂN sidebar/topbar của
 * `CkosDocumentClient.tsx` (page-shell duplication, đúng tiền lệ đã áp dụng).
 *
 * Đọc dữ liệu qua `getLiveKnowledgeSeeds()`/`getLiveKnowledgeCollections()`
 * đã có sẵn từ trước (nuôi `/portal/hetrithucai`) — không thêm tầng dữ liệu
 * mới. `KnowledgeSeed` (Lesson) KHÔNG có field `premium` (khác
 * `KnowledgeAsset`/CKOS document) — xác nhận qua
 * `knowledge.types.ts`/`knowledge-seed.types.ts`, nên trang này không khoá
 * Premium (đúng hành vi 1.0: mọi Lesson mở tự do cho user đã đăng nhập).
 *
 * PHẠM VI: chỉ hiển thị nội dung đọc (14-phần Companion Content Standard +
 * Knowledge Experience Content) — KHÔNG mang theo "Learning Engine" của 1.0
 * (`KnowledgeWorkspace.tsx`: Previous/Next, Related Knowledge, Prerequisite,
 * Knowledge Graph, progress bar/checklist có lưu trạng thái, bookmark, Table
 * of Contents, Reading Progress Bar) — theo đúng nguyên tắc "Learning Engine
 * giữ nguyên, không sửa/không nhân bản" đã áp dụng nhất quán trong dự án, và
 * cùng phạm vi đã chốt cho `/v2/hoc-vien-ai` (Bước E.2 — "chỉ trang hub,
 * không có trang xem bài học riêng cho lần đầu này").
 */
export default async function LessonDetailPage({ params }: Props) {
  const { slug } = await params;
  const [seeds, collections, premium] = await Promise.all([
    getLiveKnowledgeSeeds(),
    getLiveKnowledgeCollections(),
    getPremiumStatus(),
  ]);
  const seed = seeds.find((s) => s.slug === slug);
  if (!seed) notFound();
  const collection = collections.find((c) => c.slug === seed.collectionSlug) ?? null;

  return <LessonDetailClient seed={seed} collection={collection} premium={premium} />;
}
