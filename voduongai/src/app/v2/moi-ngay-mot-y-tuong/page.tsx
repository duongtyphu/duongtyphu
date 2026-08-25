import { getPremiumStatus } from "@/lib/v2/premium-access";

import { MoiNgayMotYTuongClient } from "./MoiNgayMotYTuongClient";

export const metadata = { title: "Mỗi ngày một ý tưởng | VO DUONG AI" };

/**
 * `/v2/moi-ngay-mot-y-tuong` — Giai đoạn 1 (Portal 2.0, đợt điều chỉnh mới).
 * Placeholder honest "đang xây dựng" — CHƯA có mockup Claude Design riêng
 * cho trang này (Founder gửi sau, xem CLAUDE.md "ĐỊNH HƯỚNG HIỆN TẠI").
 */
export default async function MoiNgayMotYTuongPage() {
  const premium = await getPremiumStatus();
  return <MoiNgayMotYTuongClient premium={premium} />;
}
