import { GemCard } from "@/components/portal/ui/GemCard";

export type StoryMoment = {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  date: Date;
  /** Sprint 13.4 — ví dụ "Companion · Living Story" khi moment đến từ một Living Story đã lưu. */
  source?: string;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Answers: "Portal có đang kể lại hành trình của tôi, không chỉ liệt kê dữ liệu?"
 */
export function MyStoryTimeline({ moments }: { moments: StoryMoment[] }) {
  if (moments.length === 0) {
    return (
      <GemCard>
        <p className="text-sm text-white/65">
          Câu chuyện của bạn đang chờ những dòng đầu tiên. Một khoảnh khắc nhỏ hôm nay có thể trở thành viên ngọc đáng
          nhớ ngày mai.
        </p>
      </GemCard>
    );
  }

  return (
    <div className="space-y-3">
      {moments.map((m) => (
        <GemCard key={m.id} className="flex items-start gap-3">
          <span className="text-lg leading-none">{m.emoji}</span>
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-sm font-bold text-white">{m.title}</h3>
              <span className="text-xs text-white/40">{formatDate(m.date)}</span>
              {m.source && (
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/35">
                  {m.source}
                </span>
              )}
            </div>
            {m.description && <p className="mt-1 text-sm text-white/65">{m.description}</p>}
          </div>
        </GemCard>
      ))}
    </div>
  );
}
