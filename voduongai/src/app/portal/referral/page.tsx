import { siteConfig } from "@/lib/site";
import { getSupabaseServer } from "@/lib/supabase-server";
import { CopyLinkButton } from "@/components/portal/CopyLinkButton";

export const metadata = { title: "Hoa hồng giới thiệu" };

type Referral = {
  id: number;
  referred_email: string;
  commission_amount: number;
  status: string;
  created_at: string;
};

type Member = { id: string; referral_code: string | null; created_at: string };

const statusLabel: Record<string, string> = {
  pending: "Vừa đăng ký",
  confirmed: "Đã có đơn hàng",
  paid: "Đã trả hoa hồng",
};

async function getReferralData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { email: null, member: null as Member | null, referrals: [] as Referral[] };
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { email: null, member: null, referrals: [] };

  const { data: member } = await supabase
    .from("members")
    .select("id, referral_code, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const { data: referrals } = await supabase
    .from("referrals")
    .select("id, referred_email, commission_amount, status, created_at")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false });

  return {
    email: user.email ?? null,
    member: member ?? null,
    referrals: referrals ?? [],
  };
}

export default async function ReferralPage() {
  const { email, member, referrals } = await getReferralData();
  const referralCode = member?.referral_code ?? null;

  const pending = referrals.filter((r) => r.status === "pending");
  const confirmed = referrals.filter((r) => r.status === "confirmed");
  const paid = referrals.filter((r) => r.status === "paid");
  const totalPaid = paid.reduce((sum, r) => sum + r.commission_amount, 0);
  const totalPending = [...pending, ...confirmed].reduce((sum, r) => sum + r.commission_amount, 0);

  const refLink = referralCode ? `${siteConfig.url}/?ref=${referralCode}` : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Hoa hồng giới thiệu</h1>
        <p className="mt-2 text-white">
          Giới thiệu người khác tham gia VDAI Academy và nhận hoa hồng thật trên mỗi đơn hàng được xác nhận.
        </p>
      </div>

      {!email && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white">
          Đăng nhập để lấy link giới thiệu và xem hoa hồng của bạn.
        </div>
      )}

      {email && !refLink && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white">
          Tài khoản của bạn chưa được cấp mã giới thiệu. Liên hệ {siteConfig.contact.email} để được hỗ trợ.
        </div>
      )}

      {email && refLink && (
        <>
          <div className="card-shine glow-blue rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Link giới thiệu của bạn</p>
            <div className="mt-3 flex items-center gap-3">
              <input
                readOnly
                value={refLink}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
              />
              <CopyLinkButton value={refLink} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Đã trả</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{totalPaid.toLocaleString("vi-VN")}đ</p>
              <p className="mt-1 text-xs text-white/60">{paid.length} lượt</p>
            </div>
            <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Đang chờ</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{totalPending.toLocaleString("vi-VN")}đ</p>
              <p className="mt-1 text-xs text-white/60">{pending.length + confirmed.length} lượt</p>
            </div>
            <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Tổng lượt giới thiệu</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{referrals.length}</p>
            </div>
          </div>

          {member?.created_at && (
            <p className="text-xs text-white/40">
              Tham gia từ {new Date(member.created_at).toLocaleDateString("vi-VN")}
            </p>
          )}

          <div>
            <h2 className="text-lg font-bold text-white">Lịch sử giới thiệu</h2>
            {referrals.length === 0 ? (
              <p className="mt-3 text-sm text-white/60">Chưa có lượt giới thiệu nào — chia sẻ link ở trên để bắt đầu.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {referrals.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{r.referred_email}</p>
                      <p className="text-xs text-white/50">{new Date(r.created_at).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{r.commission_amount.toLocaleString("vi-VN")}đ</p>
                      <p className="text-xs text-white/50">{statusLabel[r.status] ?? r.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
