import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Premium — Dashboard Live-edit (theo yêu cầu riêng của Founder, sau khi
 * Nhóm 3 đã đóng). Nguồn thật cho phần chữ tĩnh an toàn của
 * `/portal/premium`: Hero (eyebrow/title 2 dòng/subtitle), 2 nhãn section,
 * 4 bước thanh toán, 4 câu FAQ — quản qua `/admin/premium/dashboard`.
 *
 * KHÔNG dùng cho: bảng `courses` (giá/trạng thái mở bán — quản riêng qua
 * `/admin/course-pricing`, GIỮ NGUYÊN không đổi theo đúng yêu cầu),
 * `PREMIUM_PROGRAMS` (5 chương trình, icon/accent màu — rủi ro giống
 * `ecosystems.ts`), `PremiumAdvisor` (6 tình huống, `targetHref` gắn
 * anchor thật), `PremiumConsult` (số điện thoại/Zalo), `FounderSpotlight`
 * (hồ sơ Founder) — tất cả vẫn tĩnh trong code, không đụng.
 *
 * Dùng getSupabasePublic() (không cookies()) — cùng pattern mọi
 * `live-*.ts` khác trong Nhóm 3.
 */
export type PremiumChrome = {
  id: string;
  status: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  classSectionEyebrow: string;
  classSectionTitle: string;
  systemSectionEyebrow: string;
  systemSectionTitle: string;
  paymentSectionTitle: string;
  faqSectionTitle: string;
};

export type PremiumPaymentStep = { id: string; status: string; step: string; title: string; text: string };
export type PremiumFaqItem = { id: string; status: string; q: string; a: string };

const DEFAULT_CHROME: PremiumChrome = {
  id: "premium",
  status: "Published",
  heroEyebrow: "Premium — Bước tăng tốc khi bạn đã sẵn sàng",
  heroTitleLine1: "Premium không dành cho việc học nhiều hơn.",
  heroTitleLine2: "Premium dành cho lúc bạn muốn biến AI thành năng lực thật sự.",
  heroSubtitle:
    "Không phải mua thêm một chồng bài giảng. Đây là nơi bạn chọn đúng một lộ trình — và đi hết nó với người đồng hành thật.",
  classSectionEyebrow: "Lớp học AI",
  classSectionTitle: "Ba lớp học — ba cấp độ năng lực",
  systemSectionEyebrow: "Chương trình hệ thống",
  systemSectionTitle: "Xây hệ thống Affiliate bằng AI — một mình hoặc cùng đội nhóm",
  paymentSectionTitle: "Thanh toán hoạt động thế nào",
  faqSectionTitle: "Câu hỏi thường gặp",
};

const DEFAULT_PAYMENT_STEPS: PremiumPaymentStep[] = [
  { id: "step_1", status: "Published", step: "1", title: "Chọn chương trình", text: "Bấm CTA đăng ký trên card — bạn được đưa tới trang thanh toán với đúng chương trình đã chọn." },
  { id: "step_2", status: "Published", step: "2", title: "Xác nhận thông tin", text: "Điền họ tên, số điện thoại và xác nhận đơn hàng (giá được hệ thống kiểm tra lại phía máy chủ)." },
  { id: "step_3", status: "Published", step: "3", title: "Chuyển khoản", text: "Chuyển khoản theo hướng dẫn ở trang đơn hàng — hệ thống tự động ghi nhận thanh toán." },
  { id: "step_4", status: "Published", step: "4", title: "Mở khóa tự động", text: "Ngay khi thanh toán được xác nhận, bài giảng video của chương trình được mở khóa trong tài khoản của bạn." },
];

const DEFAULT_FAQ: PremiumFaqItem[] = [
  { id: "faq_1", status: "Published", q: "Premium khác phần miễn phí ở đâu?", a: "Phần miễn phí giúp bạn hiểu và thử. Premium là các chương trình có lộ trình, bài giảng video và kết quả đầu ra cụ thể — dành cho lúc bạn muốn biến AI thành năng lực làm việc thật sự, không chỉ kiến thức." },
  { id: "faq_2", status: "Published", q: "Thanh toán xong bao lâu thì được học?", a: "Hệ thống ghi nhận chuyển khoản tự động. Ngay khi thanh toán được xác nhận, bài giảng của chương trình bạn mua được mở khóa trong mục Sản phẩm của tôi — không cần chờ duyệt tay." },
  { id: "faq_3", status: "Published", q: "Tôi chưa chắc nên chọn chương trình nào?", a: "Đừng chọn khi chưa chắc. Dùng Companion Advisor ở đầu trang để định vị giai đoạn của bạn, hoặc liên hệ Tư vấn 1:1 — trao đổi trước, quyết định sau." },
  { id: "faq_4", status: "Published", q: "Chính sách hoàn phí thế nào?", a: "Điều khoản sử dụng, chính sách bảo mật và chính sách hoàn phí được hiển thị ngay tại bước thanh toán — bạn nên đọc trước khi xác nhận đơn hàng." },
];

const CHROME_STRING_KEYS = (Object.keys(DEFAULT_CHROME) as (keyof PremiumChrome)[]).filter(
  (key) => key !== "id" && key !== "status",
);

export const getLivePremiumChrome = cache(async (): Promise<PremiumChrome> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_CHROME;
  const { data, error } = await supabase
    .from("premium_chrome")
    .select("id, data, status")
    .eq("id", "premium")
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return DEFAULT_CHROME;
  const d = (data.data ?? {}) as Record<string, unknown>;
  const result = { ...DEFAULT_CHROME, id: data.id, status: data.status };
  for (const key of CHROME_STRING_KEYS) {
    if (typeof d[key] === "string") result[key] = d[key] as string;
  }
  return result;
});

export const getLivePremiumPaymentSteps = cache(async (): Promise<PremiumPaymentStep[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_PAYMENT_STEPS;
  const { data, error } = await supabase
    .from("premium_payment_steps")
    .select("id, data, status")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data || data.length === 0) return DEFAULT_PAYMENT_STEPS;
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      status: row.status,
      step: String(d.step ?? ""),
      title: String(d.title ?? ""),
      text: String(d.text ?? ""),
    };
  });
});

export const getLivePremiumFaq = cache(async (): Promise<PremiumFaqItem[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_FAQ;
  const { data, error } = await supabase
    .from("premium_faq")
    .select("id, data, status")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data || data.length === 0) return DEFAULT_FAQ;
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      status: row.status,
      q: String(d.q ?? ""),
      a: String(d.a ?? ""),
    };
  });
});
