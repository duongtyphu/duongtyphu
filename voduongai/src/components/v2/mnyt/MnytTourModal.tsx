"use client";

/**
 * Modal "Tour giới thiệu" (1/6 modal Giai đoạn 6) — 1:1 với mockup dòng
 * 1061-1077: 4 bước (dot progress), tự hiện lần đầu ghé thăm
 * (`!LS.has('tour_seen')`, mockup dòng 1910) — dự án đã có sẵn field
 * `prefs.tourSeen` (Giai đoạn 4/5) đúng cho mục đích này, `MnytShellClient`
 * chỉ cần hiện modal khi `!prefs.tourSeen` và gọi `persistPrefs({tourSeen:
 * true})` khi đóng — không cần state/cột DB mới.
 *
 * Mockup gốc chỉ định nghĩa 3 nội dung (`tourTitles`/`tourDescs`) cho 4 dot
 * (bug rỗng ở bước cuối) — đã viết đủ bước 4 thật (giới thiệu Bản đồ lĩnh
 * vực, tính năng thật đã có trong app), không lặp lại lỗi thiếu nội dung.
 */

import { useMnytModalEscape } from "@/lib/mnyt/use-modal-escape";

type TourStep = { title: string; desc: string };

const TOUR_STEPS_VI: TourStep[] = [
  { title: "Chào mừng bạn!", desc: "Mỗi ngày một ý tưởng AI mới, học trong vài phút." },
  { title: "Học mỗi ngày 5 bước", desc: "Khái niệm → Prompt → Thử thách → Áp dụng → Ghi nhớ." },
  { title: "Theo dõi tiến trình", desc: "Giữ chuỗi ngày học, mở khoá huy hiệu và chứng nhận." },
  { title: "Khám phá theo lĩnh vực", desc: "35 lĩnh vực AI thực tế — chọn lộ trình phù hợp với bạn, học theo tốc độ riêng." },
];

const TOUR_STEPS_EN: TourStep[] = [
  { title: "Welcome!", desc: "One new AI idea every day, learned in minutes." },
  { title: "Learn in 5 steps a day", desc: "Concept → Prompt → Challenge → Apply → Takeaway." },
  { title: "Track your progress", desc: "Keep your streak, unlock badges and certificates." },
  { title: "Explore by field", desc: "35 real-world AI fields — pick a path that fits you and learn at your own pace." },
];

type Props = {
  lang: "vi" | "en";
  step: number;
  onNext: () => void;
  onSkip: () => void;
};

export function MnytTourModal({ lang, step, onNext, onSkip }: Props) {
  const isVi = lang === "vi";
  const steps = isVi ? TOUR_STEPS_VI : TOUR_STEPS_EN;
  const current = steps[Math.min(step, steps.length - 1)];
  const isLast = step >= steps.length - 1;

  // Mockup gốc: Escape = closeTour() — cùng hành vi nút "Bỏ qua".
  useMnytModalEscape(onSkip);

  const t = {
    next: isVi ? "Tiếp" : "Next",
    done: isVi ? "Bắt đầu" : "Start",
    skip: isVi ? "Bỏ qua" : "Skip",
  };

  return (
    <div className="mnyt-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mnyt-tour-card">
        <div className="mnyt-tour-dots">
          {steps.map((s, i) => (
            <span key={s.title} className="mnyt-tour-dot" data-active={i === step} aria-hidden />
          ))}
        </div>
        <h2 className="mnyt-tour-title">{current.title}</h2>
        <p className="mnyt-tour-desc">{current.desc}</p>
        <div className="mnyt-tour-actions">
          <button type="button" onClick={onSkip} className="mnyt-tour-skip-btn">
            {t.skip}
          </button>
          <button type="button" onClick={onNext} className="mnyt-tour-next-btn">
            {isLast ? t.done : t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
