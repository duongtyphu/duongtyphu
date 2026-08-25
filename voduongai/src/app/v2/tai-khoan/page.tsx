import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getAccountData } from "@/lib/portal/account-data";

import { TaiKhoanClient } from "./TaiKhoanClient";

export const metadata = { title: "Tài khoản | VO DUONG AI", robots: { index: false } };

/**
 * `/v2/tai-khoan` — task #68. "Hồ sơ người dùng"/"Quản lý quyền riêng tư"
 * di chuyển hẳn sang 2.0 (không chỉ đổi link — nội dung/logic dùng chung
 * `AccountContent`/`getAccountData()` với `/portal/account` 1.0, xem
 * docblock 2 file đó — Single Source of Truth, không copy 2 bản).
 */
export default async function TaiKhoanPage() {
  const [premium, account] = await Promise.all([getPremiumStatus(), getAccountData()]);
  return <TaiKhoanClient premium={premium} user={account.user} orders={account.orders} now={account.now} lifeProfile={account.lifeProfile} />;
}
