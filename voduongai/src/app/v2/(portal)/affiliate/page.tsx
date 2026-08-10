import Link from "next/link";
import { Copy, MousePointerClick, Share2, Users, Wallet } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { getV2Session } from "@/lib/v2/auth";
import { formatDateTime, formatVnd } from "@/lib/v2/data/client";
import {
  AFFILIATE_STATUS_LABEL,
  listAffiliateTiers,
  listAffiliateTransactions,
} from "@/lib/v2/data/commerce";

export const metadata = { title: "Chương trình Affilate" };

const STATUS_TONE = {
  pending: "gold",
  approved: "violet",
  paid: "green",
  rejected: "red",
} as const;

export default async function AffiliatePage() {
  const [session, tiers, transactions] = await Promise.all([
    getV2Session(),
    listAffiliateTiers(),
    listAffiliateTransactions(),
  ]);

  const referralCode = session?.fullName
    ? session.fullName.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "").toUpperCase()
    : "VDAI";
  const referralLink = `https://voduongai.com/?ref=${referralCode}`;
  const totalCommission = transactions.reduce((sum, tx) => sum + tx.commission, 0);

  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-extrabold">Chương trình Affilate</h1>
          <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
            Giới thiệu người bạn tin tưởng, nhận hoa hồng minh bạch theo từng cấp bậc.
          </p>
        </div>
        <IcoBox
          icon={Share2}
          size="xl"
          background="linear-gradient(145deg,#8b6bff,#5a37e6)"
          color="#fff"
          className="max-[900px]:hidden"
        />
      </div>

      <Card>
        <CardHead title="Liên kết giới thiệu của bạn" />
        <div className="flex flex-wrap items-center gap-3">
          <code className="flex-1 truncate rounded-[var(--v2-radius-sm)] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-4 py-3 text-[13px]">
            {referralLink}
          </code>
          <button
            type="button"
            className="flex items-center gap-2 rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] px-5 py-3 text-[13px] font-bold text-white hover:brightness-110"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            Sao chép
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-[14px] min-[1180px]:grid-cols-4">
        {[
          { id: "clicks", value: "1.284", label: "Lượt click", icon: MousePointerClick, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
          { id: "signups", value: "96", label: "Đăng ký từ liên kết", icon: Users, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "converted", value: "18", label: "Chuyển đổi thành công", icon: Share2, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "commission", value: formatVnd(totalCommission), label: "Hoa hồng tích luỹ", icon: Wallet, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
        ].map((stat) => (
          <div
            key={stat.id}
            className="rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[18px]"
          >
            <IcoBox icon={stat.icon} size="md" background={stat.gradient} color="#fff" className="mb-3" />
            <div className="text-[20px] font-extrabold">{stat.value}</div>
            <div className="mt-1 text-[12px] text-[var(--v2-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <section>
        <SectionHead
          title="Cấp bậc hoa hồng"
          action={
            <Link href={`${V2_PORTAL_BASE}/affiliate/mo-hinh`} className="text-[13px] font-semibold">
              Xem các mô hình
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.id}>
              <CardHead
                title={tier.name}
                action={
                  <span className="text-[16px] font-extrabold text-[var(--v2-violet)]">
                    {tier.commissionPercent}%
                  </span>
                }
              />
              <p className="mb-3 text-[12px] text-[var(--v2-muted)]">
                Từ {tier.minReferrals} lượt giới thiệu thành công
              </p>
              <ul className="flex flex-col gap-2">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-[12.5px] leading-[1.45]">
                    <span className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--v2-violet)]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHead
          title="Lịch sử hoa hồng"
          action={
            <Link
              href={`${V2_PORTAL_BASE}/affiliate/san-giao-dich`}
              className="text-[13px] font-semibold"
            >
              Xem sàn giao dịch
            </Link>
          }
        />
        <Card padding="none">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-wrap items-center gap-3 border-b border-[var(--v2-line)] px-[18px] py-3 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold">{tx.buyerName}</div>
                <div className="text-[11.5px] text-[var(--v2-muted)]">{tx.productName}</div>
              </div>
              <div className="text-[13px] font-extrabold">{formatVnd(tx.commission)}</div>
              <Badge tone={STATUS_TONE[tx.status]}>{AFFILIATE_STATUS_LABEL[tx.status]}</Badge>
              <div className="w-[120px] shrink-0 text-right text-[11px] text-[var(--v2-muted)]">
                {formatDateTime(tx.createdAt)}
              </div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
