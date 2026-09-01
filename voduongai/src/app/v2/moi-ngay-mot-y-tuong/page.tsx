import { getPremiumStatus } from "@/lib/v2/premium-access";

import { MoiNgayMotYTuongClient } from "./MoiNgayMotYTuongClient";

export const metadata = { title: "Mỗi ngày một ý tưởng | VO DUONG AI" };

/**
 * `/v2/moi-ngay-mot-y-tuong` — Portal 2.0. Placeholder "đang xây dựng" của
 * Giai đoạn 1 đã dọn sạch, đang xây nội dung thật (xem
 * `MoiNgayMotYTuongClient.tsx`).
 */
export default async function MoiNgayMotYTuongPage() {
  const premium = await getPremiumStatus();
  return <MoiNgayMotYTuongClient premium={premium} />;
}
