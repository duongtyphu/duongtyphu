import { MousePointerClick, Percent, Share2, Wallet } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { formatDateTime, formatVnd } from "@/lib/v2/data/client";
import {
  AFFILIATE_STATUS_LABEL,
  AFFILIATE_STATUS_STYLE,
  listAffiliatePrograms,
  listAffiliateTiers,
  listAffiliateTransactions,
} from "@/lib/v2/data/commerce";

export const metadata = { title: "Chương trình Affilate — Admin" };

export default async function AdminAffiliatePage() {
  const [transactions, tiers, programs] = await Promise.all([
    listAffiliateTransactions(),
    listAffiliateTiers(),
    listAffiliatePrograms(),
  ]);

  const txRows: TableRow[] = transactions.map((tx) => ({
    id: tx.id,
    tags: [tx.status],
    cells: [
      {
        t: "user",
        initials: tx.referrerName.slice(0, 2).toUpperCase(),
        name: tx.referrerName,
        sub: tx.referrerEmail,
      },
      { t: "text", v: tx.buyerName },
      { t: "muted", v: tx.productName },
      { t: "strong", v: formatVnd(tx.commission) },
      {
        t: "tag",
        label: AFFILIATE_STATUS_LABEL[tx.status],
        background: AFFILIATE_STATUS_STYLE[tx.status].background,
        color: AFFILIATE_STATUS_STYLE[tx.status].color,
      },
      { t: "muted", v: formatDateTime(tx.createdAt) },
    ],
  }));

  const programRows: TableRow[] = programs.map((program) => ({
    id: program.id,
    cells: [
      { t: "strong", v: program.name },
      { t: "muted", v: program.description },
      { t: "text", v: program.commission },
      {
        t: "status",
        label: program.visible ? "Hiển thị" : "Ẩn",
        color: program.visible ? "var(--v2-green)" : "var(--v2-muted)",
      },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Chương trình Affilate"
        title="Quản lý Chương trình Affilate"
        description="Quản lý cấp hoa hồng, danh sách affiliate và lịch sử thanh toán."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "active", value: "1.240", label: "Affiliate đang hoạt động", icon: Share2, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "11,2%", trend: "up" },
          { id: "paid", value: "142,6 Tr₫", label: "Hoa hồng đã trả (30 ngày)", icon: Wallet, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "18,4%", trend: "up" },
          { id: "clicks", value: "18.420", label: "Lượt click liên kết", icon: MousePointerClick, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "7,6%", trend: "up" },
          { id: "conversion", value: "6,1%", label: "Tỷ lệ chuyển đổi", icon: Percent, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)", delta: "0,4%", trend: "up" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} padding="admin">
            <CardHead
              title={tier.name}
              action={
                <span className="rounded-md bg-[var(--v2-violet-light)] px-[9px] py-[3px] text-[12px] font-extrabold text-[var(--v2-violet)]">
                  {tier.commissionPercent}%
                </span>
              }
            />
            <p className="mb-3 text-[12px] text-[var(--v2-muted)]">
              Từ {tier.minReferrals} lượt giới thiệu thành công
            </p>
            <ul className="flex flex-col gap-2">
              {tier.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2 text-[12.5px]">
                  <span className="text-[var(--v2-violet)]">•</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <DataTable
        title="Lịch sử hoa hồng"
        headers={["Affiliate", "Người mua", "Sản phẩm", "Hoa hồng", "Trạng thái", "Thời gian"]}
        rows={txRows}
        totalLabel="giao dịch"
        searchPlaceholder="Tìm affiliate hoặc người mua..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "pending", label: "Chờ duyệt", tag: "pending" },
          { id: "approved", label: "Đã duyệt", tag: "approved" },
          { id: "paid", label: "Đã thanh toán", tag: "paid" },
          { id: "rejected", label: "Từ chối", tag: "rejected" },
        ]}
      />

      <DataTable
        title="Chương trình & sàn giao dịch"
        headers={["Chương trình", "Mô tả", "Hoa hồng", "Hiển thị"]}
        rows={programRows}
        pageSize={6}
      />
    </div>
  );
}
