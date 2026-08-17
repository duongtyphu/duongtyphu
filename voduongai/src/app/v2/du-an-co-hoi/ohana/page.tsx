import { getPremiumStatus } from "@/lib/v2/premium-access";

import { OhanaClient } from "./OhanaClient";

export const metadata = { title: "Ohana | VO DUONG AI" };

/**
 * `/v2/du-an-co-hoi/ohana` — 1:1 với `Ohana.html`.
 *
 * KHÁC HẲN DigiU/SolarGroup: theo đúng lệnh riêng của Founder ("Lưu ý riêng
 * cho Ohana thiết kế nội dung mới như file portal 2.0 đã gửi — không tự
 * suy đoán ý nghĩa hoặc tự chọn cách map gần đúng nhất"), trang này KHÔNG
 * tái dùng hạ tầng `ecosystem_chrome`/`ecosystem_subprojects`/
 * `ecosystem_articles`/`ecosystem_ratings` của `eco_crypto` (Blockchain &
 * Crypto) — dù cùng vị trí trong menu "Dự án & Cơ hội". "Ohana" là 1 hệ
 * sinh thái hoàn toàn mới (Astronixa/AstroPay/AstroChain/Hybrid Wallet)
 * KHÔNG có bất kỳ tương ứng thật nào trong dữ liệu 1.0 hiện có — ép vào
 * `eco_crypto` sẽ là suy đoán/map gần đúng, đúng điều lệnh cấm.
 *
 * Vì vậy nội dung trang này giữ 100% TĨNH, đúng nguyên văn bản thiết kế —
 * không có "honest empty-state" nào cần áp dụng (đây không phải khoảng
 * trống dữ liệu, mà là nội dung mới CHƯA có bảng Supabase nào phía sau).
 * Nếu sau này Founder muốn Ohana có Admin CRUD riêng (bảng mới, không đụng
 * `eco_crypto`), đó là quyết định/việc riêng, ngoài phạm vi Bước F.
 */
export default async function OhanaPage() {
  const premium = await getPremiumStatus();
  return <OhanaClient premium={premium} />;
}
