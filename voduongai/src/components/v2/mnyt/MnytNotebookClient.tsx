"use client";

/**
 * View "Sổ tay ý tưởng" (Giai đoạn 7) — `/v2/moi-ngay-mot-y-tuong/so-tay-y-tuong`.
 * Không có mockup gốc riêng (README chỉ nhắc "printable notebook page" như
 * 1 hạng mục độc lập, khác 10 view 1:1 mockup) — thiết kế mới bám đúng
 * ngôn ngữ thị giác `.mnyt` sẵn có (nền tối, token màu chung), thêm 1 lớp
 * `@media print` riêng để khi in/"Save as PDF" ra bản GIẤY SÁNG (không lãng
 * phí mực nền tối), ẩn toolbar/header/bottom-nav — chỉ còn đúng nội dung
 * sổ tay.
 *
 * `window.print()` — không thêm thư viện tạo PDF (dự án chưa có tiền lệ,
 * trình duyệt đã có sẵn "Print → Save as PDF" đúng nhu cầu "Xuất PDF" của
 * nút gốc ở View Hồ sơ).
 */

import Link from "next/link";

import type { MnytTopicSummary } from "@/lib/portal/live-mnyt";
import { MNYT_ROUTES, mnytDetailHref } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

type Props = {
  lang: "vi" | "en";
  learnerName: string | null;
  streak: number;
  badgeCount: number;
  generatedAtLabel: string;
  topics: MnytTopicSummary[];
};

export function MnytNotebookClient({ lang, learnerName, streak, badgeCount, generatedAtLabel, topics }: Props) {
  const isVi = lang === "vi";
  const displayName = learnerName?.trim();

  const t = {
    back: isVi ? "← Quay lại hồ sơ" : "← Back to profile",
    print: isVi ? "🖨 In / Xuất PDF" : "🖨 Print / Export PDF",
    title: displayName ? (isVi ? `Sổ tay ý tưởng của ${displayName}` : `${displayName}'s idea notebook`) : isVi ? "Sổ tay ý tưởng của bạn" : "Your idea notebook",
    summary: isVi ? `${topics.length} ý tưởng đã học · Chuỗi ${streak} ngày · ${badgeCount} huy hiệu` : `${topics.length} ideas learned · ${streak}-day streak · ${badgeCount} badges`,
    generatedOn: isVi ? `Xuất ngày ${generatedAtLabel}` : `Generated on ${generatedAtLabel}`,
    empty: isVi
      ? "Bạn chưa hoàn thành ý tưởng nào — sổ tay sẽ tự động ghi lại mỗi khi bạn học xong 1 ý tưởng."
      : "You haven't completed any idea yet — this notebook fills in automatically as you learn.",
    ideaLabel: isVi ? "Ý tưởng" : "Idea",
    minutes: isVi ? "phút" : "min",
    exploreCta: isVi ? "Khám phá ý tưởng hôm nay →" : "Explore today's idea →",
  };

  return (
    <section className="mnyt-notebook" data-screen-label="Notebook">
      <div className="mnyt-notebook-toolbar">
        <Link href={MNYT_ROUTES.profile} className="mnyt-notebook-back">
          {t.back}
        </Link>
        <button type="button" className="mnyt-notebook-print-btn" onClick={() => window.print()}>
          {t.print}
        </button>
      </div>

      <div className="mnyt-notebook-cover">
        <h1 className="mnyt-notebook-cover-title">{t.title}</h1>
        <p className="mnyt-notebook-cover-summary">{t.summary}</p>
        <p className="mnyt-notebook-cover-date">{t.generatedOn}</p>
      </div>

      {topics.length === 0 ? (
        <div className="mnyt-notebook-empty">
          <p>{t.empty}</p>
          <Link href={MNYT_ROUTES.home} className="mnyt-notebook-empty-cta">
            {t.exploreCta}
          </Link>
        </div>
      ) : (
        <div className="mnyt-notebook-list">
          {topics.map((topic) => {
            const title = isVi ? topic.title : topic.titleEn || topic.title;
            const category = isVi ? topic.categoryName : topic.categoryNameEn || topic.categoryName;
            const hook = isVi ? topic.hook : topic.hookEn || topic.hook;
            return (
              <Link key={topic.id} href={mnytDetailHref(topic.id)} className="mnyt-notebook-entry" style={{ ["--entry-accent" as string]: topic.color }}>
                <div className="mnyt-notebook-entry-head">
                  <span className="mnyt-notebook-entry-day">
                    {t.ideaLabel} #{topic.day}
                  </span>
                  <span className="mnyt-notebook-entry-cat" style={{ color: topic.color }}>
                    {category}
                  </span>
                </div>
                <h2 className="mnyt-notebook-entry-title">{title}</h2>
                <p className="mnyt-notebook-entry-hook">{hook}</p>
                <div className="mnyt-notebook-entry-meta">
                  {topic.difficulty} · ~{topic.estMinutes} {t.minutes}
                  {topic.tools.length > 0 ? ` · ${topic.tools.join(", ")}` : ""}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
