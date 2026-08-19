import { notFound } from "next/navigation";

import { getCkosDocument } from "@/lib/portal/live-ckos";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { CkosDocumentClient } from "./CkosDocumentClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const premium = await getPremiumStatus();
  const doc = await getCkosDocument(slug, premium);
  if (!doc) return { title: "Không tìm thấy tài liệu | VO DUONG AI" };
  return { title: `${doc.title} | Hệ tri thức (CKOS) | VO DUONG AI` };
}

/**
 * `/v2/he-tri-thuc/[slug]` — trang chi tiết tài liệu CKOS.
 *
 * KHÔNG có mockup riêng cho trang này (đã xác nhận với Founder) — dựng mới
 * dựa trên `he-tri-thuc.css`/tông màu-font sẵn có của `/v2/he-tri-thuc`, tái
 * dùng đúng `getCkosDocument()` đã có sẵn từ Bước D (đã tự khoá `body` ở
 * tầng SERVER cho tài liệu Premium khi user chưa Premium — trang này chỉ
 * hiển thị đúng những gì hàm đó trả về, không tự nới quyền).
 */
export default async function CkosDocumentPage({ params }: Props) {
  const { slug } = await params;
  const premium = await getPremiumStatus();
  const doc = await getCkosDocument(slug, premium);
  if (!doc) notFound();

  return <CkosDocumentClient doc={doc} premium={premium} />;
}
