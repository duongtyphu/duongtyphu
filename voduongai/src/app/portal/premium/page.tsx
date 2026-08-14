import { Crown, ArrowRight } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { PREMIUM_PROGRAMS } from "@/components/portal/premium/premium-programs";
import { matchCourse } from "@/components/portal/premium/match-course";
import { PremiumProgramCard } from "@/components/portal/premium/PremiumProgramCard";
import { PremiumAdvisor } from "@/components/portal/premium/PremiumAdvisor";
import { PremiumConsult } from "@/components/portal/premium/PremiumConsult";
import { FounderSpotlight } from "@/components/portal/premium/FounderSpotlight";
import { PremiumChromeProvider } from "@/components/portal/premium/PremiumChromeContext";
import { PremiumHeroBlock } from "@/components/portal/premium/PremiumHeroBlock";
import { PremiumSectionHeading } from "@/components/portal/premium/PremiumSectionHeading";
import { PremiumPaymentSteps } from "@/components/portal/premium/PremiumPaymentSteps";
import { PremiumFaqList } from "@/components/portal/premium/PremiumFaqList";
import { getLivePremiumChrome, getLivePremiumPaymentSteps, getLivePremiumFaq } from "@/lib/portal/live-premium";

export const metadata = { title: "Premium | VO DUONG AI" };

/**
 * PORTAL 4.0 — PREMIUM EXPERIENCE RECONSTRUCTION (P0).
 *
 * Premium được thiết kế lại thành một khu vực có ngôn ngữ thị giác RIÊNG:
 * canvas tối full-bleed (phá lề <main> px-4/px-8 py-6/py-8 của PortalShell),
 * glow AI, card glass có chiều sâu, mỗi chương trình một accent màu — khác
 * hẳn nền trắng card sáng của CKOS/Academy/Workspace. Không FOMO, không
 * đếm ngược, không fake học viên/đánh giá/doanh thu.
 *
 * Dữ liệu thật:
 * - Bảng `courses` (Supabase) là nguồn sự thật về GIÁ và trạng thái mở
 *   bán: CTA thanh toán chỉ hiện khi có dòng khớp VÀ status='open' —
 *   Admin bật/tắt trực tiếp tại /admin/course-pricing, không cần sửa
 *   code. Chưa có dòng khớp hoặc status khác → "Sắp mở đăng ký".
 *   (createOrder tra giá server-side từ bảng này.)
 * - `orders.status=confirmed` (getPurchasedIds) → trạng thái "Đã sở hữu".
 *   (Khối "Sản phẩm đang mở bán" từ bảng `products` đã được Product Owner
 *   yêu cầu bỏ khỏi trang này — sản phẩm đã mua vẫn xem ở "Sản phẩm của tôi".)
 *
 * Luồng thanh toán (route sẵn có, KHÔNG tạo mới):
 * Card → /portal/checkout?type=course&id=… (bước 1: thông tin)
 *      → /portal/checkout/order-received/[id] (bước 2: chuyển khoản)
 *      → webhook SePay xác nhận → orders confirmed → mở khóa bài giảng.
 */

// `courses.id` thật là `text` (vd. "ai-coban", "solo"), không phải số — bản cũ
// khai `number` là sai, nay `id` là khoá ghép chính thức nên phải đúng kiểu.
type CourseRow = { id: string; name: string; status: string; price: number };

async function getCourses(): Promise<CourseRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.from("courses").select("id, name, status, price");
  return data ?? [];
}

export default async function PremiumPage() {
  const [courses, purchasedCourseIds, chrome, paymentSteps, faq] = await Promise.all([
    getCourses(),
    getPurchasedIds("course_id"),
    getLivePremiumChrome(),
    getLivePremiumPaymentSteps(),
    getLivePremiumFaq(),
  ]);

  const programCards = PREMIUM_PROGRAMS.map((program) => ({
    program,
    course: matchCourse(courses, program.courseId, purchasedCourseIds),
  }));
  const ownedProgramNames = programCards.filter((c) => c.course?.owned).map((c) => c.program.name);

  const classPrograms = programCards.filter((c) =>
    ["ai-coban", "ai-nangcao", "openclaw"].includes(c.program.key),
  );
  const systemPrograms = programCards.filter((c) => ["v-solo", "v-scale"].includes(c.program.key));

  return (
    // Canvas tối full-bleed — bù đúng padding của <main> trong PortalShell
    // (px-4 py-6 md:px-8 md:py-8) để cả trang Premium là một không gian riêng.
    <div className="-mx-4 -my-6 min-h-full md:-mx-8 md:-my-8">
      <div
        className="relative overflow-hidden px-4 py-8 md:px-8 md:py-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,76,222,0.35), transparent), linear-gradient(180deg, #0B1020 0%, #0E1428 45%, #0B1020 100%)",
        }}
      >
        {/* Ánh sáng AI nền */}
        <div aria-hidden className="pointer-events-none absolute left-1/4 top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-[60%] h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

        {/* Content Gutter — cùng khung rounded-3xl p-6 md:p-8 với các trang
         * pillar khác (Home/CKOS/Academy/Projects/AI Workspace), lộ khí
         * quyển Premium ở viền ngoài thay vì nội dung chạm sát mép. */}
        <div className="relative rounded-3xl p-6 md:p-8">
        <PremiumChromeProvider seedChrome={chrome}>
        <div className="mx-auto max-w-6xl space-y-12">
          {/* ── 1. Hero Premium ─────────────────────────────────────────── */}
          <section className="pt-4 text-center md:pt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-[0_0_40px_-5px_rgba(251,191,36,0.4)]">
              <Crown className="h-7 w-7 text-amber-300" />
            </div>
            <PremiumHeroBlock />
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#chuong-trinh"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] transition hover:opacity-90"
              >
                Chọn lộ trình phù hợp <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#companion-advisor"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/75 backdrop-blur transition hover:bg-white/10 hover:text-white"
              >
                Tôi chưa chắc mình cần Premium
              </a>
            </div>
          </section>

          {/* ── 2. Companion Advisor ────────────────────────────────────── */}
          <PremiumAdvisor ownedProgramNames={ownedProgramNames} />

          {/* ── 3. 5 chương trình chính ─────────────────────────────────── */}
          <section id="chuong-trinh" className="scroll-mt-24 space-y-8">
            <div>
              <PremiumSectionHeading eyebrowKey="classSectionEyebrow" titleKey="classSectionTitle" />
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {classPrograms.map(({ program, course }) => (
                  <PremiumProgramCard key={program.key} program={program} course={course} />
                ))}
              </div>
            </div>

            <div>
              <PremiumSectionHeading eyebrowKey="systemSectionEyebrow" titleKey="systemSectionTitle" />
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {systemPrograms.map(({ program, course }) => (
                  <PremiumProgramCard key={program.key} program={program} course={course} featured />
                ))}
              </div>
            </div>
          </section>

          {/* ── 4. Tư vấn 1:1 (khối riêng) ──────────────────────────────── */}
          <PremiumConsult />

          {/* ── 5. Người đồng hành cùng bạn ─────────────────────────────── */}
          <FounderSpotlight />

          {/* ── 6. Ghi chú thanh toán + FAQ ─────────────────────────────────
           * PAYMENT FLOW: mọi CTA thanh toán vẫn thuộc về từng card chương
           * trình (course id riêng, checkout 2 bước sẵn có). Khối 4 bước
           * dưới đây chỉ là THÔNG TIN — Product Owner quyết định giữ lại. */}
          <section>
            <PremiumPaymentSteps seed={paymentSteps} />
            <PremiumFaqList seed={faq} />
          </section>
        </div>
        </PremiumChromeProvider>
        </div>
      </div>
    </div>
  );
}
