/**
 * Companion Mood Model (Sprint 13.3 — Soulful Micro-Reactions, Nhiệm vụ
 * 01). Mood/Presence State KHÔNG phải cảm xúc người dùng — đây là trạng
 * thái hiện diện của Companion, suy ra từ ngữ cảnh Portal (route, Garden,
 * có Proactive Thought/Living Story đang chờ, vừa được chạm vào hay
 * chưa), KHÔNG bao giờ suy đoán cảm xúc người dùng. Xem
 * `docs/COMPANION_SOULFUL_REACTIONS.md`.
 */

export type CompanionMoodKey =
  | "quiet"
  | "curious"
  | "welcoming"
  | "reflecting"
  | "happy"
  | "thoughtful"
  | "waiting"
  | "story-ready";

export type CompanionMood = {
  key: CompanionMoodKey;
  name: string;
  meaning: string;
  visualBehavior: string;
  possibleLines: string[];
  whenToUse: string;
  whenNotToUse: string;
};

export const COMPANION_MOODS: Record<CompanionMoodKey, CompanionMood> = {
  quiet: {
    key: "quiet",
    name: "Quiet",
    meaning: "Companion đang hiện diện rất nhẹ, không có gì cần nói ngay.",
    visualBehavior: "Thở chậm hơn bình thường một chút, glow rất nhẹ, gần như tĩnh.",
    possibleLines: ["Mình đây.", "Mình vẫn đang ở đây.", "Không cần vội đâu."],
    whenToUse: "Mặc định khi không có tín hiệu ngữ cảnh nào nổi bật và người dùng đã ở trang một lúc.",
    whenNotToUse: "Không dùng ngay sau một cú chạm — lúc đó nên là 'curious' hoặc 'happy'.",
  },
  curious: {
    key: "curious",
    name: "Curious",
    meaning: "Companion vừa được chạm vào hoặc người dùng vừa vào trang, đang để ý nhẹ.",
    visualBehavior: "Nghiêng nhẹ 2-4 độ về phía cú chạm, ring sáng hơn một chút trong khoảnh khắc.",
    possibleLines: ["Bạn đang tìm điều gì?", "Cảm ơn vì đã chạm vào mình.", "Mình vừa nghĩ đến một điều."],
    whenToUse: "Ngay sau lần chạm/click đầu tiên, hoặc khi vừa vào một route mới.",
    whenNotToUse: "Không dùng khi đã ở trang lâu và không có tương tác — lúc đó nên là 'quiet'.",
  },
  welcoming: {
    key: "welcoming",
    name: "Welcoming",
    meaning: "Người dùng vừa quay lại sau một khoảng vắng.",
    visualBehavior: "Pulse vàng rất nhẹ một lần, không lặp lại liên tục.",
    possibleLines: ["Mình mừng vì bạn quay lại.", "Chào bạn, mình vẫn ở đây.", "Chúng ta bắt đầu thật nhẹ nhé?"],
    whenToUse: "Khi `isComeback` đúng — đồng bộ với trạng thái comeback đã có ở Companion.",
    whenNotToUse: "Không dùng khi người dùng chỉ mới rời trang vài giây rồi quay lại (không phải comeback thật).",
  },
  reflecting: {
    key: "reflecting",
    name: "Reflecting",
    meaning: "Có một tín hiệu Garden/Reflection đang được Companion 'ngẫm'.",
    visualBehavior: "Chuyển động chậm lại, aura dịu hơn, không có pulse mạnh.",
    possibleLines: ["Khu vườn của bạn đang rất yên.", "Mình vừa nghĩ đến một điều.", "Có vẻ có điều gì đáng được lắng nghe ở đây."],
    whenToUse: "Khi có `gardenStage` hoặc `reflectionMeaning` cụ thể nhưng chưa đến lúc nói (Proactive Thought chưa kích hoạt).",
    whenNotToUse: "Không dùng để diễn giải/suy đoán cảm xúc cụ thể của người dùng.",
  },
  happy: {
    key: "happy",
    name: "Happy",
    meaning: "Một khoảnh khắc kết nối nhỏ vừa xảy ra — người dùng chạm vào Companion.",
    visualBehavior: "Bounce cực nhẹ (1-2px), không giống hoạt hình game, chỉ một nhịp rồi dừng.",
    possibleLines: ["Mình thích khi bạn chạm vào mình.", "Cảm ơn vì đã chạm vào mình.", "Một khoảnh khắc nhỏ, mình thấy vui."],
    whenToUse: "Ngay sau một lần chạm/click, khi mood trước đó không phải 'story-ready' hay 'welcoming'.",
    whenNotToUse: "Không dùng liên tục cho mọi lần chạm trong cùng phiên ngắn — sẽ thấy giả tạo, cần xen với 'curious'/im lặng.",
  },
  thoughtful: {
    key: "thoughtful",
    name: "Thoughtful",
    meaning: "Có một Proactive Thought đang chờ hoặc vừa hiện.",
    visualBehavior: "Ring xoay chậm hơn bình thường, không pulse.",
    possibleLines: ["Mình vừa nghĩ đến một điều.", "Có một điều mình muốn chia sẻ, khi bạn sẵn sàng.", "Mình đang ở đây, lặng lẽ nghĩ cùng bạn."],
    whenToUse: "Khi `hasThought` đúng (CompanionThoughtBubble đang hiện).",
    whenNotToUse: "Không dùng đồng thời với 'story-ready' — ưu tiên Thought trước nếu cả hai cùng đủ điều kiện.",
  },
  waiting: {
    key: "waiting",
    name: "Waiting",
    meaning: "Khu vườn còn ở giai đoạn rất sớm (dormant), Companion chờ một hạt giống nhỏ.",
    visualBehavior: "Gần như im lặng — ring mờ hơn, không pulse, không bounce.",
    possibleLines: ["Mình ở đây, chờ cùng bạn.", "Không cần vội đâu.", "Mình sẽ đi cùng bạn."],
    whenToUse: "Khi `gardenStage === 'dormant'` và không có tín hiệu chủ động khác.",
    whenNotToUse: "Không dùng khi vừa có một hành động/tương tác tích cực — lúc đó nên là 'curious' hoặc 'happy'.",
  },
  "story-ready": {
    key: "story-ready",
    name: "Story Ready",
    meaning: "Companion có một Living Story phù hợp, đang chờ thời điểm phù hợp để kể.",
    visualBehavior: "Ánh vàng nhấp nhẹ ở Nest, như đang 'giữ' một điều muốn kể.",
    possibleLines: ["Hôm nay mình có một câu chuyện nhỏ.", "Mình vừa nhớ đến một điều, kể bạn nghe được không?", "Có một câu chuyện mình nghĩ phù hợp lúc này."],
    whenToUse: "Khi `hasStory` đúng (CompanionStoryMoment đang hiện hoặc sắp hiện).",
    whenNotToUse: "Không dùng để ép người dùng phải nghe ngay — chỉ là một trạng thái hiện diện, không phải lệnh.",
  },
};

export function resolveCompanionMood(context: {
  isOpen: boolean;
  isComeback: boolean;
  hasThought: boolean;
  hasStory: boolean;
  gardenStage?: string;
  justTouched: boolean;
  timeOnPageMs: number;
}): CompanionMoodKey {
  if (context.isOpen) return "curious";
  if (context.hasStory) return "story-ready";
  if (context.hasThought) return "thoughtful";
  if (context.isComeback) return "welcoming";
  if (context.justTouched) return "happy";
  if (context.gardenStage === "dormant") return "waiting";
  if (context.gardenStage) return "reflecting";
  if (context.timeOnPageMs < 10000) return "curious";
  return "quiet";
}
