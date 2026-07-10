import Link from "next/link";
import { ArrowRight, Notebook } from "lucide-react";
import { GrowthActivityPanel } from "@/components/portal/growth/GrowthActivityPanel";

export const metadata = {
  title: "Nhật ký học tập",
  description: "Bản ghi học tập cá nhân của bạn — những gì đã xảy ra, đã học, đã tạo ra.",
};

/**
 * JOURNEY PLATFORM — Product Owner DECISION 1 (P1):
 * Toàn bộ bài viết do Admin đăng (blog/article) đã được đưa RA KHỎI trang
 * này — quyền sở hữu bài viết thuộc về Blog AI, không nhân bản bài viết
 * trong Journey. Nhật ký học tập là BẢN GHI HỌC TẬP CÁ NHÂN của người
 * dùng, không phải một trang blog.
 *
 * P1 giữ trang ở dạng tối giản trung thực: bản ghi hoạt động thật
 * (growth-view — cùng nguồn với Hub/Khu vườn) + lối về Hub + một con trỏ
 * duy nhất về Blog AI. Trải nghiệm nhật ký đầy đủ (mỗi entry trả lời 4
 * câu: chuyện gì / học gì / tạo gì / tiếp tục gì) là Phase P4 của
 * JOURNEY_PLATFORM_ARCHITECTURE.md — không dựng trước ở đây.
 */
export default function LearningJournalPage() {
  return (
    <div className="space-y-8">
      <nav className="text-sm text-gray-500">
        <Link href="/portal/hanhtrinhcuatoi" className="font-semibold text-blue-600 transition hover:text-blue-700">
          📖 Hành trình của tôi
        </Link>{" "}
        / Nhật ký học tập
      </nav>

      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-green-50/40 to-white p-7 shadow-token-sm sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
          <Notebook className="h-4 w-4" /> Nhật ký học tập
        </div>
        <h1 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
          Bản ghi những gì bạn thực sự đã học và tạo ra
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
          Đây là nhật ký CỦA BẠN — không phải trang bài viết. Mỗi hoạt động thật trong Portal
          được ghi lại ở đây, theo thời gian, không tô vẽ.
        </p>
      </section>

      {/* Bản ghi thật — growth-view tự hiển thị trạng thái rỗng trung thực
       * khi chưa có hoạt động nào. */}
      <GrowthActivityPanel variant="journal" />

      {/* Con trỏ duy nhất về Blog AI — bài viết KHÔNG được nhân bản ở đây.
       * Gợi ý bài viết theo ngữ cảnh (nếu có sau này) cũng chỉ tham chiếu
       * về Blog AI, không trở thành trải nghiệm chính của Nhật ký. */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-token-sm">
        <p className="text-sm text-gray-500">
          Tìm bài viết và kiến thức từ VO DUONG AI? Chúng ở Blog AI — không còn nằm trong nhật ký này.
        </p>
        <Link
          href="/blogai"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
        >
          Mở Blog AI <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
