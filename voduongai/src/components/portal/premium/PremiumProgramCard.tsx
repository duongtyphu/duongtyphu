import Link from "next/link";
import { Check, ChevronDown, PlayCircle } from "lucide-react";
import type { PremiumProgram } from "./premium-programs";
import { formatVnd } from "./premium-programs";

/**
 * Card chương trình Premium — glass surface trên nền tối, mỗi chương trình
 * một accent riêng (xem `premium-programs.ts`). Server component thuần:
 * phần "Nội dung chính" dùng <details> native để accordion trên mobile
 * không cần JS.
 *
 * Trạng thái CTA (không fake dữ liệu):
 * - `course` có dòng thật trong bảng `courses` → CTA trỏ tới
 *   /portal/checkout (luồng 2 bước sẵn có), hiển thị GIÁ THẬT từ DB.
 * - Chưa có dòng `courses` khớp → hiển thị giá niêm yết từ brief + CTA
 *   "Sắp mở đăng ký" (disabled) — vì createOrder tra giá server-side từ
 *   bảng `courses`, một CTA checkout lúc này chắc chắn thất bại.
 * - Người dùng đã mua (orders.status=confirmed) → badge "Đã sở hữu" + CTA
 *   về "Sản phẩm của tôi".
 */

export type PremiumCourseMatch = {
  id: number;
  price: number;
  owned: boolean;
} | null;

export function PremiumProgramCard({
  program,
  course,
  featured = false,
}: {
  program: PremiumProgram;
  course: PremiumCourseMatch;
  featured?: boolean;
}) {
  const { accent } = program;
  const price = course ? course.price : program.listPrice;
  const owned = course?.owned ?? false;

  const checkoutHref = course
    ? `/portal/checkout?${new URLSearchParams({
        type: "course",
        id: String(course.id),
        title: program.name,
        price: String(course.price),
      }).toString()}`
    : null;

  return (
    <article
      id={`premium-${program.key}`}
      className={`group relative flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur transition duration-300 ${accent.hoverBorder} hover:bg-white/[0.06]`}
    >
      {/* Glow AI phía sau card */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl ${accent.glow}`}
      />
      {/* Dải accent đầu card */}
      <div aria-hidden className={`h-1.5 w-full bg-gradient-to-r ${accent.gradient}`} />

      <div className={`relative flex flex-1 flex-col p-6 ${featured ? "md:p-8" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${accent.gradient}`}
          >
            <program.icon className="h-5 w-5" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}>
              {program.level}
            </span>
            {owned && (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Đã sở hữu
              </span>
            )}
          </div>
        </div>

        <h3 className={`mt-4 font-extrabold text-white ${featured ? "text-xl" : "text-lg"}`}>{program.name}</h3>
        {program.headline && (
          <p className={`mt-1 text-sm font-semibold ${accent.text}`}>{program.headline}</p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-white/70">{program.description}</p>

        {/* Phù hợp với ai */}
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Phù hợp với bạn nếu</p>
          <ul className="mt-2 space-y-1.5">
            {program.audience.map((a) => (
              <li key={a} className="flex items-start gap-2 text-xs leading-relaxed text-white/70">
                <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent.text}`} />
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Vấn đề được giải quyết (V-Solo / V-Scale) */}
        {program.problems && (
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Vấn đề được giải quyết</p>
            <ul className="mt-2 space-y-1.5">
              {program.problems.map((p) => (
                <li key={p} className="flex items-start gap-2 text-xs leading-relaxed text-white/70">
                  <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current ${accent.text}`} aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nội dung chính — accordion native, mobile không bị quá dài */}
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Nội dung chính</p>
          {program.topics.map((topic, ti) => (
            <details
              key={topic.title ?? ti}
              className="group/topic rounded-xl border border-white/10 bg-white/[0.03] open:bg-white/[0.05]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs font-semibold text-white/85 [&::-webkit-details-marker]:hidden">
                {topic.title ?? "Xem nội dung chi tiết"}
                <ChevronDown className="h-4 w-4 shrink-0 text-white/40 transition group-open/topic:rotate-180" />
              </summary>
              <ul className="space-y-1.5 px-4 pb-4">
                {topic.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-white/65">
                    <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current ${accent.text}`} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* Kết quả đầu ra */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Kết quả đầu ra</p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/75">{program.outcome}</p>
        </div>

        {/* Giá + số bài giảng + CTA — đẩy xuống đáy card để hàng card thẳng nhau */}
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={`text-2xl font-extrabold tracking-tight ${accent.text}`}>{formatVnd(price)}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                <PlayCircle className="h-3.5 w-3.5" />
                {program.lessonCount} bài giảng video — mở khóa tự động sau khi thanh toán
              </p>
            </div>
          </div>

          <div className="mt-4">
            {owned ? (
              <Link
                href="/portal/my-products"
                className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
              >
                Vào học ngay →
              </Link>
            ) : checkoutHref ? (
              <Link
                href={checkoutHref}
                className={`inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 ${accent.gradient}`}
              >
                {program.ctaLabel} →
              </Link>
            ) : (
              // Chưa có dòng `courses` thật khớp chương trình này — checkout
              // sẽ thất bại (giá tra server-side), nên nói thật thay vì
              // trỏ tới một luồng thanh toán hỏng.
              <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-5 py-3 text-center">
                <p className="text-sm font-semibold text-white/60">Sắp mở đăng ký</p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  Cần đăng ký sớm? Liên hệ tư vấn 1:1 ở cuối trang.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
