import { mockFetch } from "./client";
import type {
  AffiliateTier,
  AffiliateTransaction,
  PremiumPlan,
  Transaction,
} from "./types";

/* ------------------------------------------------------------- Gói Premium */

const PLANS: PremiumPlan[] = [
  {
    id: "plan_month",
    name: "Premium Tháng",
    priceMonthly: 499000,
    priceYearly: 5988000,
    highlight: false,
    features: [
      "Toàn bộ khoá học Học viện AI",
      "Companion AI không giới hạn lượt hỏi",
      "Hệ tri thức CKOS bản đầy đủ",
      "Cập nhật nội dung mới hằng tuần",
    ],
  },
  {
    id: "plan_6m",
    name: "Premium 6 Tháng",
    priceMonthly: 399000,
    priceYearly: 2394000,
    highlight: true,
    badge: "Phổ biến nhất",
    features: [
      "Mọi quyền lợi của gói Tháng",
      "Tiết kiệm 20% so với trả theo tháng",
      "Ưu tiên hỗ trợ trong 24 giờ",
      "Tham gia buổi hỏi đáp trực tiếp hằng tháng",
      "Bộ mẫu và prompt độc quyền",
    ],
  },
  {
    id: "plan_12m",
    name: "Premium 12 Tháng",
    priceMonthly: 333000,
    priceYearly: 3996000,
    highlight: false,
    badge: "Tiết kiệm nhất",
    features: [
      "Mọi quyền lợi của gói 6 Tháng",
      "Tiết kiệm 33% so với trả theo tháng",
      "1 buổi tư vấn 1:1 cùng chuyên gia",
      "Truy cập sớm khoá học và tính năng mới",
      "Huy hiệu thành viên đồng hành",
    ],
  },
];

export async function listPremiumPlans(): Promise<PremiumPlan[]> {
  return mockFetch(PLANS);
}

export type PremiumFaq = { id: string; question: string; answer: string };

export async function listPremiumFaqs(): Promise<PremiumFaq[]> {
  return mockFetch([
    {
      id: "faq1",
      question: "Tôi có thể huỷ gói bất cứ lúc nào không?",
      answer:
        "Có. Bạn huỷ gia hạn bất cứ lúc nào trong phần Quản lý gói; quyền lợi vẫn giữ tới hết chu kỳ đã thanh toán.",
    },
    {
      id: "faq2",
      question: "Nâng cấp giữa chừng có bị tính lại từ đầu không?",
      answer:
        "Không. Phần chưa dùng của gói hiện tại được quy đổi và trừ thẳng vào gói mới.",
    },
    {
      id: "faq3",
      question: "Premium có bao gồm khoá học ra mắt sau này không?",
      answer:
        "Có. Mọi khoá học mới thuộc Học viện AI đều nằm trong quyền lợi Premium, không tính thêm phí.",
    },
    {
      id: "faq4",
      question: "Tôi dùng được trên bao nhiêu thiết bị?",
      answer:
        "Tài khoản dùng được trên nhiều thiết bị, nhưng chỉ một phiên đăng nhập hoạt động cùng lúc.",
    },
    {
      id: "faq5",
      question: "Có chính sách hoàn phí không?",
      answer:
        "Có. Trong 7 ngày đầu, nếu bạn chưa hoàn thành quá 20% nội dung, bạn được hoàn phí toàn phần.",
    },
  ]);
}

/* --------------------------------------------------------------- Affiliate */

const TIERS: AffiliateTier[] = [
  {
    id: "tier_1",
    name: "Cộng tác viên",
    commissionPercent: 15,
    minReferrals: 0,
    benefits: ["Liên kết giới thiệu riêng", "Bảng theo dõi lượt click", "Thanh toán hằng tháng"],
  },
  {
    id: "tier_2",
    name: "Đối tác",
    commissionPercent: 25,
    minReferrals: 20,
    benefits: ["Mọi quyền lợi Cộng tác viên", "Bộ tài nguyên marketing", "Hỗ trợ riêng qua Zalo"],
  },
  {
    id: "tier_3",
    name: "Đại sứ",
    commissionPercent: 35,
    minReferrals: 100,
    benefits: [
      "Mọi quyền lợi Đối tác",
      "Mã giảm giá riêng cho người bạn giới thiệu",
      "Chia sẻ doanh thu khoá học đồng phát triển",
    ],
  },
];

export async function listAffiliateTiers(): Promise<AffiliateTier[]> {
  return mockFetch(TIERS);
}

const AFFILIATE_TX: AffiliateTransaction[] = [
  { id: "atx_01", referrerName: "Trần Thị Mai", referrerEmail: "tranmai@email.com", buyerName: "Nguyễn Minh Anh", productName: "Premium 12 Tháng", amount: 3996000, commission: 1398600, status: "approved", createdAt: "2026-08-09T19:40:00+07:00" },
  { id: "atx_02", referrerName: "Hoàng Nam", referrerEmail: "hoangnam@email.com", buyerName: "Phạm Thu Hà", productName: "ChatGPT Mastery", amount: 1990000, commission: 497500, status: "paid", createdAt: "2026-08-08T14:12:00+07:00" },
  { id: "atx_03", referrerName: "Lê Hoàng Nam", referrerEmail: "lehnam@email.com", buyerName: "Bùi Tiến Đạt", productName: "Premium 6 Tháng", amount: 2394000, commission: 598500, status: "pending", createdAt: "2026-08-08T09:05:00+07:00" },
  { id: "atx_04", referrerName: "Trần Thị Mai", referrerEmail: "tranmai@email.com", buyerName: "Đỗ Khánh Linh", productName: "AI Automation với No-code", amount: 2990000, commission: 1046500, status: "approved", createdAt: "2026-08-07T21:30:00+07:00" },
  { id: "atx_05", referrerName: "Quang Huy", referrerEmail: "quanghuy@email.com", buyerName: "Trần Văn Sơn", productName: "Premium Tháng", amount: 499000, commission: 74850, status: "rejected", createdAt: "2026-08-06T11:00:00+07:00" },
  { id: "atx_06", referrerName: "Hoàng Nam", referrerEmail: "hoangnam@email.com", buyerName: "Lý Thanh Hằng", productName: "Prompt Engineering nâng cao", amount: 2490000, commission: 622500, status: "paid", createdAt: "2026-08-05T16:45:00+07:00" },
  { id: "atx_07", referrerName: "Đỗ Khánh Linh", referrerEmail: "khanhlinh@email.com", buyerName: "Vũ Đình Trung", productName: "Premium 12 Tháng", amount: 3996000, commission: 999000, status: "approved", createdAt: "2026-08-04T08:20:00+07:00" },
  { id: "atx_08", referrerName: "Lê Hoàng Nam", referrerEmail: "lehnam@email.com", buyerName: "Ngô Bảo Châu", productName: "AI trong Marketing", amount: 2490000, commission: 871500, status: "pending", createdAt: "2026-08-03T13:15:00+07:00" },
];

export const AFFILIATE_STATUS_LABEL: Record<AffiliateTransaction["status"], string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  paid: "Đã thanh toán",
  rejected: "Từ chối",
};

export const AFFILIATE_STATUS_STYLE: Record<
  AffiliateTransaction["status"],
  { background: string; color: string }
> = {
  pending: { background: "#fdf1e0", color: "#a9822c" },
  approved: { background: "var(--v2-violet-light)", color: "var(--v2-violet)" },
  paid: { background: "#e6f7ed", color: "#189a52" },
  rejected: { background: "#fdeef0", color: "var(--v2-red)" },
};

export async function listAffiliateTransactions(): Promise<AffiliateTransaction[]> {
  return mockFetch(AFFILIATE_TX);
}

/** Các sàn/chương trình đối tác hiển thị ở trang "Affilate sàn giao dịch". */
export type AffiliateProgram = {
  id: string;
  name: string;
  description: string;
  commission: string;
  signupUrl: string;
  visible: boolean;
};

export async function listAffiliatePrograms(): Promise<AffiliateProgram[]> {
  return mockFetch([
    { id: "pg1", name: "VO DUONG AI — Khoá học", description: "Giới thiệu khoá học và gói Premium của hệ sinh thái.", commission: "15 – 35%", signupUrl: "/v2/affiliate", visible: true },
    { id: "pg2", name: "DigiU", description: "Nền tảng đào tạo số cho doanh nghiệp vừa và nhỏ.", commission: "20%", signupUrl: "/v2/he-sinh-thai/digiu", visible: true },
    { id: "pg3", name: "SolarGroup", description: "Chương trình đồng đầu tư năng lượng tái tạo.", commission: "Theo thoả thuận", signupUrl: "/v2/he-sinh-thai/solargroup", visible: true },
    { id: "pg4", name: "Ohana", description: "Mạng lưới cộng đồng học tập địa phương.", commission: "10%", signupUrl: "/v2/he-sinh-thai/ohana", visible: true },
    { id: "pg5", name: "Công cụ AI đối tác", description: "Hoa hồng từ các công cụ AI được giới thiệu trong CKOS.", commission: "8 – 30%", signupUrl: "/v2/hoc-vien-ai", visible: false },
  ]);
}

/* ------------------------------------------------------ Giao dịch thanh toán */

const TRANSACTIONS: Transaction[] = [
  { id: "tx_01", buyerName: "Nguyễn Minh Anh", buyerEmail: "minhanh@email.com", productName: "Premium 12 Tháng", amount: 3996000, method: "VNPay", status: "succeeded", createdAt: "2026-08-10T09:12:00+07:00", reference: "VDA-2026-8841" },
  { id: "tx_02", buyerName: "Phạm Thu Hà", buyerEmail: "thuha@email.com", productName: "ChatGPT Mastery", amount: 1990000, method: "Chuyển khoản", status: "succeeded", createdAt: "2026-08-10T08:40:00+07:00", reference: "VDA-2026-8840" },
  { id: "tx_03", buyerName: "Bùi Tiến Đạt", buyerEmail: "tiendat@email.com", productName: "Premium 6 Tháng", amount: 2394000, method: "Momo", status: "pending", createdAt: "2026-08-10T07:55:00+07:00", reference: "VDA-2026-8839" },
  { id: "tx_04", buyerName: "Đỗ Khánh Linh", buyerEmail: "khanhlinh@email.com", productName: "AI Automation với No-code", amount: 2990000, method: "VNPay", status: "succeeded", createdAt: "2026-08-09T20:30:00+07:00", reference: "VDA-2026-8838" },
  { id: "tx_05", buyerName: "Trần Văn Sơn", buyerEmail: "vanson@email.com", productName: "Premium Tháng", amount: 499000, method: "Thẻ quốc tế", status: "failed", createdAt: "2026-08-09T18:05:00+07:00", reference: "VDA-2026-8837" },
  { id: "tx_06", buyerName: "Lý Thanh Hằng", buyerEmail: "thanhhang@email.com", productName: "Prompt Engineering nâng cao", amount: 2490000, method: "Momo", status: "succeeded", createdAt: "2026-08-09T15:22:00+07:00", reference: "VDA-2026-8836" },
  { id: "tx_07", buyerName: "Vũ Đình Trung", buyerEmail: "dinhtrung@email.com", productName: "Premium 12 Tháng", amount: 3996000, method: "Chuyển khoản", status: "refunded", createdAt: "2026-08-08T10:11:00+07:00", reference: "VDA-2026-8835" },
  { id: "tx_08", buyerName: "Ngô Bảo Châu", buyerEmail: "baochau@email.com", productName: "AI trong Marketing", amount: 2490000, method: "VNPay", status: "succeeded", createdAt: "2026-08-08T09:03:00+07:00", reference: "VDA-2026-8834" },
];

export const PAYMENT_STATUS_LABEL: Record<Transaction["status"], string> = {
  succeeded: "Thành công",
  pending: "Đang xử lý",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};

export const PAYMENT_STATUS_STYLE: Record<
  Transaction["status"],
  { background: string; color: string }
> = {
  succeeded: { background: "#e6f7ed", color: "#189a52" },
  pending: { background: "#fdf1e0", color: "#a9822c" },
  failed: { background: "#fdeef0", color: "var(--v2-red)" },
  refunded: { background: "var(--v2-violet-light)", color: "var(--v2-violet)" },
};

export async function listTransactions(): Promise<Transaction[]> {
  return mockFetch(TRANSACTIONS);
}

export type Coupon = {
  id: string;
  code: string;
  discount: string;
  usedCount: number;
  limit: number;
  expiresAt: string;
  active: boolean;
};

export async function listCoupons(): Promise<Coupon[]> {
  return mockFetch([
    { id: "cp1", code: "VDAI2026", discount: "20%", usedCount: 184, limit: 500, expiresAt: "2026-12-31", active: true },
    { id: "cp2", code: "HOCAI50", discount: "500.000 ₫", usedCount: 92, limit: 100, expiresAt: "2026-09-30", active: true },
    { id: "cp3", code: "COMEBACK", discount: "15%", usedCount: 41, limit: 200, expiresAt: "2026-10-15", active: true },
    { id: "cp4", code: "SUMMER25", discount: "25%", usedCount: 300, limit: 300, expiresAt: "2026-07-31", active: false },
  ]);
}
