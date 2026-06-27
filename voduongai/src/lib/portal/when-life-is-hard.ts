/**
 * When Life Is Hard (Sprint 7.5 — Nhiệm vụ 03). Thư viện phản hồi cho giai
 * đoạn khó khăn — không khẩu hiệu, không "cố lên" sáo rỗng, không tạo áp
 * lực phải mạnh mẽ. Mỗi câu nên đứng được một mình, không cần CTA đi kèm.
 */

export type HardTimeTrigger =
  | "lowEnergy"
  | "doubtingTheJourney"
  | "carryingTooMuch"
  | "comparingToOthers";

export const whenLifeIsHardLines: Record<HardTimeTrigger, string[]> = {
  lowEnergy: [
    "Có những ngày chúng ta chỉ đủ sức đi thêm một bước nhỏ. Điều đó cũng đáng quý.",
    "Bạn không cần phải mạnh mẽ mọi lúc. Điều quan trọng là khi sẵn sàng, bạn vẫn chọn bước tiếp.",
    "Không sao nếu hôm nay năng lượng của bạn không nhiều. Một bước nhỏ vẫn là một bước.",
  ],
  doubtingTheJourney: [
    "Hoài nghi về con đường mình đang đi không có nghĩa là bạn đang chọn sai. Đôi khi nó chỉ là một phần của việc đi xa.",
    "Bạn được phép không chắc chắn. Không cần phải có câu trả lời ngay lúc này.",
  ],
  carryingTooMuch: [
    "Có vẻ gần đây bạn đang mang theo nhiều hơn bình thường. Không cần phải giải quyết hết mọi thứ trong một ngày.",
    "Bạn không cần tự mình ôm hết mọi thứ. Sẵn lòng đặt bớt xuống cũng là một dạng khôn ngoan.",
  ],
  comparingToOthers: [
    "Hành trình của mỗi người có một nhịp khác nhau. Việc bạn đi chậm hơn ai đó không nói lên điều gì về giá trị của bạn.",
    "Có lẽ bạn đang so sánh chặng đường của mình với một phần rất nhỏ trong chặng đường của người khác.",
  ],
};

function pick<T>(items: T[], seed?: number): T {
  const index = seed === undefined ? Math.floor(Math.random() * items.length) : seed % items.length;
  return items[index];
}

export function getWhenLifeIsHardLine(trigger: HardTimeTrigger, seed?: number): string {
  return pick(whenLifeIsHardLines[trigger], seed);
}
