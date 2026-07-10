import { Mail } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";

export type MonthlyLetterStats = {
  monthLabel: string;
  reflectionCount: number;
  capsuleCount: number;
  memberSinceLabel?: string;
  hasAnyHistory?: boolean;
};

/** Export cho MyStoryBook (Journey P3) tái sử dụng logic viết thư —
 * chỉ đổi CÁCH TRÌNH BÀY (không còn GemCard), nội dung/luật viết giữ
 * nguyên một nguồn duy nhất ở đây. */
export function buildLetter(stats: MonthlyLetterStats): string {
  const lines: string[] = [];

  if (stats.reflectionCount > 0) {
    lines.push(
      stats.reflectionCount === 1
        ? "Tháng này bạn đã dừng lại để suy ngẫm ít nhất một lần — đó là một điều không nhỏ."
        : `Tháng này bạn đã dành ${stats.reflectionCount} lần để nhìn lại chính mình. Đó là một sự kiên trì đáng được ghi nhận.`
    );
  } else {
    lines.push("Tháng này có thể bạn đã bận, hoặc cần thời gian cho riêng mình — điều đó hoàn toàn bình thường.");
  }

  if (stats.capsuleCount > 0) {
    lines.push(`Bạn đã lưu lại ${stats.capsuleCount} khoảnh khắc đáng nhớ vào hành trình của mình.`);
  }

  lines.push("Mỗi bước nhỏ bạn đi qua đang dần trở thành phiên bản tốt hơn của chính bạn.");

  return lines.join(" ");
}

/**
 * Answers: "Portal có đang viết một lá thư cho tôi, hay chỉ xuất một bản báo cáo?"
 */
export function MonthlyLetterCard({ stats }: { stats: MonthlyLetterStats }) {
  const letter = stats.hasAnyHistory === false
    ? "Lá thư đầu tiên sẽ được viết khi hành trình của bạn có đủ những dấu chân đầu tiên."
    : buildLetter(stats);

  return (
    <GemCard variant="featured">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-blue-600" />
        <h2 className="gemos-card-title text-sm font-bold text-gray-900">Lá thư tháng {stats.monthLabel}</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{letter}</p>
    </GemCard>
  );
}
