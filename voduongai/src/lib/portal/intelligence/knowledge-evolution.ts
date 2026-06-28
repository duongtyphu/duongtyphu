/**
 * Knowledge Evolution (Sprint 13.0 — Nhiệm vụ 02/04). Knowledge không
 * còn hiển thị theo thứ tự menu cố định — Knowledge nhận
 * `ReflectionMeaning` (Sprint 12.3) và NHẤN MẠNH (không xoá, không ẩn)
 * nội dung phù hợp với ý nghĩa Reflection gần nhất. Không phải
 * recommendation kiểu thương mại ("vì bạn đã xem X nên xem Y") —
 * Knowledge phải giống một người thầy đang chọn điều phù hợp NHẤT cho
 * học trò hôm nay. Xem `docs/LIVING_LEARNING_LOOP.md`.
 */

import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";

export type KnowledgeEvolution = {
  meaning: ReflectionMeaning;
  /** Các chủ đề nên được nhấn mạnh hôm nay — dùng để khớp với tag nội dung. */
  emphasisTags: string[];
  /** Câu giới thiệu giọng người thầy/người đồng hành — Companion dùng câu này. */
  companionLine: string;
};

/**
 * Mỗi `ReflectionMeaning` ứng với MỘT cách nhấn mạnh Knowledge khác
 * nhau. Ba dòng đầu lấy đúng theo ví dụ trong brief; các dòng còn lại
 * giữ cùng logic: ý nghĩa con người vừa chia sẻ → loại tri thức nào sẽ
 * thực sự giúp họ hôm nay (không phải loại tri thức "tiếp theo trong
 * lộ trình").
 */
const KNOWLEDGE_EVOLUTION: Record<ReflectionMeaning, KnowledgeEvolution> = {
  curiosity: {
    meaning: "curiosity",
    emphasisTags: ["explore", "questions", "first-principles"],
    companionLine: "Hôm nay mình nghĩ phần này sẽ phù hợp với sự tò mò bạn vừa chia sẻ.",
  },
  recovery: {
    meaning: "recovery",
    emphasisTags: ["rest", "balance", "reflection"],
    companionLine: "Hôm nay có lẽ không cần học gì nhiều — phần này nhẹ nhàng, phù hợp lúc bạn đang cần chậm lại.",
  },
  contribution: {
    meaning: "contribution",
    emphasisTags: ["community", "leadership", "teaching"],
    companionLine: "Mình nghĩ đến điều bạn vừa chia sẻ về giúp người khác — phần này có thể giúp bạn làm điều đó tốt hơn.",
  },
  persistence: {
    meaning: "persistence",
    emphasisTags: ["practice", "project", "consistency"],
    companionLine: "Bạn đã quay lại hôm nay — mình nghĩ một bài thực hành nhỏ sẽ tiếp nối đúng tinh thần đó.",
  },
  courage: {
    meaning: "courage",
    emphasisTags: ["new-territory", "challenge"],
    companionLine: "Điều bạn vừa đối mặt không dễ — phần này dành cho lúc bạn sẵn sàng thử một điều mới.",
  },
  humility: {
    meaning: "humility",
    emphasisTags: ["foundation", "first-principles"],
    companionLine: "Nhìn lại chính mình như bạn vừa làm là một nền tảng tốt — phần này quay lại những điều gốc.",
  },
  gratitude: {
    meaning: "gratitude",
    emphasisTags: ["community", "story"],
    companionLine: "Mình cảm nhận được sự ấm áp trong điều bạn vừa viết — phần này nói về kết nối với người khác.",
  },
  focus: {
    meaning: "focus",
    emphasisTags: ["practice", "deep-work"],
    companionLine: "Bạn đang rất tập trung hôm nay — phần này hợp để đi sâu vào một kỹ năng cụ thể.",
  },
  discovery: {
    meaning: "discovery",
    emphasisTags: ["explore", "first-principles"],
    companionLine: "Mình mừng vì bạn vừa nhận ra điều đó — phần này có thể mở ra thêm một góc nhìn mới.",
  },
  responsibility: {
    meaning: "responsibility",
    emphasisTags: ["practice", "project", "consistency"],
    companionLine: "Bạn vừa cam kết một điều với chính mình — phần này giúp bạn giữ đúng cam kết đó.",
  },
};

/**
 * Trả về cách Knowledge nên nhấn mạnh hôm nay, hoặc `null` nếu chưa có
 * Reflection nào (không ép một cách nhấn mạnh khi không có tín hiệu).
 */
export function evolveKnowledgeFocus(
  meaning: ReflectionMeaning | null | undefined
): KnowledgeEvolution | null {
  if (!meaning) return null;
  return KNOWLEDGE_EVOLUTION[meaning];
}

/**
 * Companion giới thiệu Knowledge bằng lời, không phải link trần
 * (Sprint 13.0 — Nhiệm vụ 04). Khi chưa có ý nghĩa Reflection nào,
 * Companion giữ im lặng (không bịa một lời giới thiệu không có cơ sở)
 * — trang Knowledge tự rơi về trạng thái tĩnh mặc định.
 */
export function companionKnowledgeIntro(
  meaning: ReflectionMeaning | null | undefined
): string | null {
  const evolution = evolveKnowledgeFocus(meaning);
  return evolution?.companionLine ?? null;
}

/**
 * Sắp xếp lại (không lọc bỏ) một danh sách nội dung theo `emphasisTags`
 * — mục nào khớp tag được đưa lên trước. Đây là "nhấn mạnh", không phải
 * "đổi thứ tự menu": áp dụng cho khu vực gợi ý (Recommended), không áp
 * dụng cho cấu trúc menu/learning path.
 */
export function emphasizeByTags<T extends { emphasisTags?: string[] }>(
  items: T[],
  evolution: KnowledgeEvolution | null
): T[] {
  if (!evolution) return items;
  const matches = (item: T) =>
    (item.emphasisTags ?? []).some((tag) => evolution.emphasisTags.includes(tag));
  const emphasized = items.filter(matches);
  const rest = items.filter((item) => !matches(item));
  return [...emphasized, ...rest];
}
