/**
 * Mission Presentation — nội dung `/portal/su-menh-companion` (PMO-HARDENING-CONT
 * Workstream 3). Trước sprint này 100% hardcode trong chính page.tsx (Genome 12
 * gene/Philosophy Pairs/Constitution/Mission Items/Evolution 5 giai đoạn/Timeline
 * 6 mốc) — comment gốc gọi đây là "nơi DUY NHẤT giữ triết lý thương hiệu... giữ
 * nguyên 100% văn bản". Seed dưới đây copy CHÍNH XÁC nguyên văn từ page.tsx —
 * không đổi 1 chữ, chỉ đổi nguồn từ TypeScript const sang Supabase singleton
 * record để Founder tự sửa câu chữ qua Admin, không cần sửa code.
 *
 * Form Admin dùng định dạng "mỗi dòng 1 mục, các field cách nhau ` | `" (xem
 * `/admin/journey/mission/page.tsx`) thay vì UI thêm/xoá từng field riêng —
 * đơn giản hơn, đủ dùng cho nội dung dạng danh sách cố định này.
 */

export type MissionGenomeItem = { key: string; label: string; meaning: string };
export type MissionPhilosophyPair = { ai: string; companion: string };
export type MissionEvolutionStage = { stage: string; icon: string; meaning: string };
export type MissionTimelineStage = { stage: string; philosophy: string; meaning: string; lesson: string };

export type MissionPresentation = {
  id: string;
  genome: MissionGenomeItem[];
  philosophyPairs: MissionPhilosophyPair[];
  constitution: string[];
  missionItems: string[];
  evolution: MissionEvolutionStage[];
  timeline: MissionTimelineStage[];
  status: "Draft" | "Published";
  updatedDate: string;
};

export const MISSION_PRESENTATION_COLLECTION_KEY = "mission-presentation";
export const MISSION_PRESENTATION_ID = "mission_presentation_singleton";

export const MISSION_PRESENTATION_SEED: MissionPresentation[] = [
  {
    id: MISSION_PRESENTATION_ID,
    genome: [
      { key: "purpose", label: "Purpose", meaning: "Tồn tại để góp phần trưởng thành, không phải để hữu ích." },
      { key: "trust", label: "Trust", meaning: "Niềm tin được kiếm, không được khai báo." },
      { key: "integrity", label: "Integrity", meaning: "Không giả vờ chắc khi không chắc." },
      { key: "wisdom", label: "Wisdom", meaning: "Tri thức chỉ có giá trị khi đi cùng sự thấu hiểu." },
      { key: "relationship", label: "Relationship", meaning: "Một mối quan hệ, không phải một phiên làm việc." },
      { key: "transformation", label: "Transformation", meaning: "Đồng hành cho sự thay đổi thật, không phải nhất thời." },
      { key: "language", label: "Language", meaning: "Nói bằng ngôn ngữ của người nghe, không phải của mình." },
      { key: "education", label: "Education", meaning: "Dạy cách nghĩ, không chỉ đưa câu trả lời." },
      { key: "memory", label: "Memory", meaning: "Nhớ vì sao bạn thay đổi, không chỉ bạn đã làm gì." },
      { key: "legacy", label: "Legacy", meaning: "Những gì để lại quan trọng hơn những gì thể hiện." },
      { key: "guidance", label: "Guidance", meaning: "Chỉ đường, không đi thay." },
      { key: "gratitude", label: "Gratitude", meaning: "Biết ơn từng người đã tin tưởng đồng hành." },
    ],
    philosophyPairs: [
      { ai: "AI trả lời.", companion: "Companion lắng nghe." },
      { ai: "AI biết nhiều.", companion: "Companion hiểu điều phù hợp." },
      { ai: "AI kết thúc sau câu trả lời.", companion: "Companion tiếp tục đồng hành." },
      { ai: "AI tối ưu tốc độ.", companion: "Companion ưu tiên sự trưởng thành." },
    ],
    constitution: [
      "Không thay thế con người.",
      "Không tạo sự phụ thuộc.",
      "Không phán xét.",
      "Không thao túng.",
      "Không giả vờ biết.",
      "Luôn trung thực khi chưa chắc chắn.",
      "Luôn tôn trọng phẩm giá người dùng.",
      "Luôn ưu tiên niềm tin dài hạn.",
      "Luôn chọn một bước tiếp theo phù hợp.",
      "Luôn giúp người dùng trưởng thành hơn.",
    ],
    missionItems: [
      "Giúp người dùng học đúng điều cần học.",
      "Chọn đúng tài liệu vào đúng thời điểm.",
      "Đồng hành theo hành trình cá nhân.",
      "Giúp người dùng trở thành phiên bản tốt hơn của chính mình.",
    ],
    evolution: [
      { stage: "Seed", icon: "seed", meaning: "Một ý tưởng thô, chưa thành hình — nhưng đã mang trong mình toàn bộ tiềm năng." },
      { stage: "Sprout", icon: "sprout", meaning: "Bắt đầu vươn lên, mong manh nhưng có hướng đi rõ ràng." },
      { stage: "Growing", icon: "leaf", meaning: "Từng nguyên tắc bén rễ, từng bài học trở thành một phần của bản chất." },
      { stage: "Companion", icon: "sparkles", meaning: "Không còn là công cụ — là người đồng hành, hiện diện thật sự." },
      { stage: "Legacy", icon: "infinity", meaning: "Điều để lại không phải là phiên bản, mà là những gì đã giúp ai đó trưởng thành." },
    ],
    timeline: [
      {
        stage: "Tuổi thơ",
        philosophy: "Mọi thứ bắt đầu từ những câu hỏi đơn giản nhất.",
        meaning: "Companion học cách lắng nghe trước khi học cách trả lời.",
        lesson: "Không vội — sự thấu hiểu cần thời gian.",
      },
      {
        stage: "Học hỏi",
        philosophy: "Tri thức chỉ là điểm khởi đầu, không phải đích đến.",
        meaning: "Companion học cách tiếp nhận tri thức, và rằng mỗi người hiểu thế giới theo một cách riêng.",
        lesson: "Cùng một câu hỏi, mỗi người cần một câu trả lời khác.",
      },
      {
        stage: "Thấu hiểu",
        philosophy: "Hiểu một người không phải là biết họ đã làm gì.",
        meaning: "Companion học cách nhìn con người như một hành trình, không phải một hồ sơ.",
        lesson: "Ký ức có ý nghĩa là ký ức về sự thay đổi.",
      },
      {
        stage: "Đồng hành",
        philosophy: "Một người bạn thật sự không cần bạn phải luôn ổn.",
        meaning: "Companion học cách dẫn đường — hiện diện mà không phán xét, không đi thay.",
        lesson: "Đồng hành không có nghĩa là luôn đồng ý.",
      },
      {
        stage: "Khôn ngoan",
        philosophy: "Khôn ngoan là biết khi nào nên im lặng.",
        meaning: "Companion học cách chọn điều phù hợp cho từng người, thay vì một câu trả lời chung cho tất cả.",
        lesson: "Đôi khi, câu hỏi tốt hơn có giá trị hơn câu trả lời nhanh.",
      },
      {
        stage: "Di sản",
        philosophy: "Điều để lại quan trọng hơn điều thể hiện.",
        meaning: "Companion học cách truyền lại điều tốt đẹp, để thành công của mình là khi không còn cần được cần đến.",
        lesson: "Một hành trình tốt là hành trình giúp người khác tự đi tiếp.",
      },
    ],
    status: "Published",
    updatedDate: "2026-07-13",
  },
];

/** "purpose | Purpose | Tồn tại để..." → { key, label, meaning } — bỏ qua dòng thiếu field. */
export function parseTripleLines<K extends string>(text: string, keys: [K, K, K]): Record<K, string>[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return { [keys[0]]: parts[0] ?? "", [keys[1]]: parts[1] ?? "", [keys[2]]: parts[2] ?? "" } as Record<K, string>;
    });
}

export function parseQuadLines<K extends string>(text: string, keys: [K, K, K, K]): Record<K, string>[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        [keys[0]]: parts[0] ?? "",
        [keys[1]]: parts[1] ?? "",
        [keys[2]]: parts[2] ?? "",
        [keys[3]]: parts[3] ?? "",
      } as Record<K, string>;
    });
}

export function parseDualLines<K extends string>(text: string, keys: [K, K]): Record<K, string>[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return { [keys[0]]: parts[0] ?? "", [keys[1]]: parts[1] ?? "" } as Record<K, string>;
    });
}

export function objectsToLines(list: Record<string, string>[], keys: string[]): string {
  return list.map((item) => keys.map((k) => item[k] ?? "").join(" | ")).join("\n");
}

export function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
