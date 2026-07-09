import { Crown, ArrowRight } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { PREMIUM_PROGRAMS } from "@/components/portal/premium/premium-programs";
import { PremiumProgramCard, type PremiumCourseMatch } from "@/components/portal/premium/PremiumProgramCard";
import { PremiumAdvisor } from "@/components/portal/premium/PremiumAdvisor";
import { PremiumConsult } from "@/components/portal/premium/PremiumConsult";
import { FounderSpotlight } from "@/components/portal/premium/FounderSpotlight";

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

type CourseRow = { id: number; name: string; status: string; price: number };

async function getCourses(): Promise<CourseRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.from("courses").select("id, name, status, price");
  return data ?? [];
}

function matchCourse(
  courses: CourseRow[],
  patterns: string[],
  purchasedCourseIds: Set<string>,
): PremiumCourseMatch {
  const row = courses.find((c) => {
    const name = c.name.toLowerCase();
    return patterns.some((p) => name.includes(p));
  });
  if (!row) return null;
  return {
    id: row.id,
    price: row.price,
    owned: purchasedCourseIds.has(String(row.id)),
    // Admin bật/tắt mở bán qua cột status tại /admin/course-pricing:
    // 'open' → CTA thanh toán; giá trị khác → "Sắp mở đăng ký".
    open: row.status === "open",
  };
}

const PREMIUM_FAQ = [
  {
    q: "Premium khác phần miễn phí ở đâu?",
    a: "Phần miễn phí giúp bạn hiểu và thử. Premium là các chương trình có lộ trình, bài giảng video và kết quả đầu ra cụ thể — dành cho lúc bạn muốn biến AI thành năng lực làm việc thật sự, không chỉ kiến thức.",
  },
  {
    q: "Thanh toán xong bao lâu thì được học?",
    a: "Hệ thống ghi nhận chuyển khoản tự động. Ngay khi thanh toán được xác nhận, bài giảng của chương trình bạn mua được mở khóa trong mục Sản phẩm của tôi — không cần chờ duyệt tay.",
  },
  {
    q: "Tôi chưa chắc nên chọn chương trình nào?",
    a: "Đừng chọn khi chưa chắc. Dùng Companion Advisor ở đầu trang để định vị giai đoạn của bạn, hoặc liên hệ Tư vấn 1:1 — trao đổi trước, quyết định sau.",
  },
  {
    q: "Chính sách hoàn phí thế nào?",
    a: "Điều khoản sử dụng, chính sách bảo mật và chính sách hoàn phí được hiển thị ngay tại bước thanh toán — bạn nên đọc trước khi xác nhận đơn hàng.",
  },
];

export default async function PremiumPage() {
  const [courses, purchasedCourseIds] = await Promise.all([
    getCourses(),
    getPurchasedIds("course_id"),
  ]);

  const programCards = PREMIUM_PROGRAMS.map((program) => ({
    program,
    course: matchCourse(courses, program.matchPatterns, purchasedCourseIds),
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

        <div className="relative mx-auto max-w-6xl space-y-12">
          {/* ── 1. Hero Premium ─────────────────────────────────────────── */}
          <section className="pt-4 text-center md:pt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-[0_0_40px_-5px_rgba(251,191,36,0.4)]">
              <Crown className="h-7 w-7 text-amber-300" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              Premium — Bước tăng tốc khi bạn đã sẵn sàng
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Premium không dành cho việc học nhiều hơn.
              <span className="mt-1 block bg-gradient-to-r from-blue-400 via-violet-400 to-orange-300 bg-clip-text text-transparent">
                Premium dành cho lúc bạn muốn biến AI thành năng lực thật sự.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              Không phải mua thêm một chồng bài giảng. Đây là nơi bạn chọn đúng một lộ trình — và đi hết
              nó với người đồng hành thật.
            </p>
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
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Lớp học AI</p>
              <h2 className="mt-1 text-xl font-extrabold text-white md:text-2xl">
                Ba lớp học — ba cấp độ năng lực
              </h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {classPrograms.map(({ program, course }) => (
                  <PremiumProgramCard key={program.key} program={program} course={course} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Chương trình hệ thống</p>
              <h2 className="mt-1 text-xl font-extrabold text-white md:text-2xl">
                Xây hệ thống Affiliate bằng AI — một mình hoặc cùng đội nhóm
              </h2>
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

          {/* ── 6. FAQ ──────────────────────────────────────────────────────
           * PAYMENT FLOW (chỉ đạo Product Owner): KHÔNG có khối thanh toán
           * chung trong Premium — mỗi chương trình sở hữu luồng thanh toán
           * riêng qua CTA trên chính card của nó (checkout 2 bước sẵn có,
           * mang đúng course id của chương trình đó). Khối "Thanh toán hoạt
           * động thế nào" chung đã được gỡ theo nguyên tắc này. */}
          <section>
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold text-white">Câu hỏi thường gặp</h2>
              {PREMIUM_FAQ.map((item) => (
                <details key={item.q} className="group rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-white/85 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="text-white/40 transition group-open:rotate-45">＋</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed text-white/60">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
