import {
  getCkosCategories,
  getCkosDocuments,
  getCkosStages,
  getCkosStats,
} from "@/lib/portal/live-ckos";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { CkosClient } from "./CkosClient";

export const metadata = { title: "Hệ tri thức (CKOS) | VO DUONG AI" };

/**
 * `/v2/he-tri-thuc` — Bước E.1.
 *
 * Server Component: đọc dữ liệu thật + xác định trạng thái Premium (cần
 * `cookies()` nên bắt buộc chạy ở server), rồi truyền xuống `CkosClient`
 * (Client Component vì bản gốc có 2 view chuyển qua lại và chip lọc đổi
 * trạng thái active).
 *
 * Nội dung khối "CKOS là gì?" nằm ngay tại đây thay vì trong DB: đây là 1
 * đoạn giới thiệu CỐ ĐỊNH của bản thiết kế (không phải nội dung Founder sửa
 * thường xuyên), giữ nguyên văn từ file thiết kế gốc — đúng nguyên tắc
 * "không đổi text so với bản thiết kế". Nếu sau này cần sửa qua Admin, đó là
 * việc riêng (thêm 1 dòng chrome), không tự làm ở bước này.
 */
const CKOS_INTRO =
  "CKOS (Vo Duong AI Knowledge Operating System) là hệ tri thức toàn diện, được xây dựng để giúp bạn học, hiểu và ứng dụng AI vào thực tế một cách hiệu quả và bền vững.";

export default async function CkosPage() {
  const [categories, documents, stages, stats, premium] = await Promise.all([
    getCkosCategories(),
    getCkosDocuments(),
    getCkosStages(),
    getCkosStats(),
    getPremiumStatus(),
  ]);

  return (
    <CkosClient
      categories={categories}
      documents={documents}
      stages={stages}
      stats={stats}
      premium={premium}
      ckosIntro={CKOS_INTRO}
    />
  );
}
