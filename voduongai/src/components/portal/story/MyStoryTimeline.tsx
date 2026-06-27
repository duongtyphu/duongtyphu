import { GemCard } from "@/components/portal/ui/GemCard";

export type StoryMoment = {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  date: Date;
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
          Cuốn sách của bạn vẫn còn những trang trắng — và điều đó hoàn toàn ổn. Mỗi suy ngẫm, mỗi cột mốc bạn lưu lại
          từ hôm nay sẽ trở thành một trang trong câu chuyện này.
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
            </div>
            {m.description && <p className="mt-1 text-sm text-white/65">{m.description}</p>}
          </div>
        </GemCard>
      ))}
    </div>
  );
}
