import { AccountContent } from "@/components/portal/account/AccountContent";
import { getAccountData } from "@/lib/portal/account-data";

export const metadata = { title: "Tài khoản", description: "Quản lý hồ sơ, bảo mật và đơn hàng tài khoản VO DUONG AI của bạn.", robots: { index: false } };

export default async function AccountPage() {
  const { user, orders, now, lifeProfile } = await getAccountData();
  return <AccountContent user={user} orders={orders} now={now} lifeProfile={lifeProfile} />;
}
