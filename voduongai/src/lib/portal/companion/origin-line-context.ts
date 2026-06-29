/**
 * Origin Line Context Map (Sprint 18.10 — Origin Line Ritual Wiring).
 * Xem `docs/COMPANION_ORIGIN_RELATIONSHIP.md`, `docs/PRESENCE_COORDINATOR.md`,
 * `docs/product-bible/BOOK_CORE_MEMORY.md`.
 *
 * Core Memory (Sprint 18.9, `core-memory.ts`) đã định nghĩa cổng kiến trúc:
 * `CoreMemoryContext` (5 giá trị) + `getOriginLineFromCoreMemory()`. File này
 * KHÔNG thay thế cổng đó — nó là một tầng mô tả phong phú hơn, ở phía gọi
 * (caller side): 6 ngữ cảnh cụ thể hơn brief yêu cầu, mỗi ngữ cảnh ánh xạ
 * xuống đúng MỘT trong 5 giá trị `CoreMemoryContext` đã có, cộng thêm
 * reason/allowedFrequency/tone/shouldShow/boundary để mỗi nơi gọi không
 * phải tự đoán lại các luật tiết chế này.
 *
 * `ceremony` (Core Memory) được hai ngữ cảnh ở đây dùng chung:
 * `first_footprint_ceremony` và `mirror_of_growth` — đúng tinh thần "không
 * overbuild": không có ngữ cảnh Core Memory mới, chỉ có metadata caller-side
 * mới.
 */

import type { CoreMemoryContext } from "@/lib/portal/companion/core-memory";

export type OriginLineRitualContext =
  | "origin_room"
  | "companion_chapter"
  | "first_footprint_ceremony"
  | "mirror_of_growth"
  | "founder_moment"
  | "special_ritual";

export type OriginLineFrequency = "once_per_session" | "once_per_day" | "once_ever_per_context";

export type OriginLineShouldShowInput = {
  /** Đã hiển thị Origin Line ở context này trong session hiện tại chưa. */
  shownThisSession: boolean;
  /** Đã hiển thị Origin Line ở context này trong ngày hôm nay chưa. */
  shownToday: boolean;
  /** Đã từng hiển thị ở context này (mọi thời điểm) chưa — dùng cho ngữ cảnh "once_ever". */
  shownEver: boolean;
  isFounderPresent?: boolean;
};

export type OriginLineContextDefinition = {
  context: OriginLineRitualContext;
  /** Ngữ cảnh Core Memory tương ứng để gọi `getOriginLineFromCoreMemory()`. */
  coreMemoryContext: CoreMemoryContext;
  /** Vì sao Origin Line được phép xuất hiện ở đây. */
  reason: string;
  allowedFrequency: OriginLineFrequency;
  /** Hướng dẫn giọng nói — không phải copy, chỉ là ràng buộc cho người viết. */
  tone: string;
  /** Luật quyết định có hiển thị hay không, dựa trên trạng thái đã thấy. */
  shouldShow: (input: OriginLineShouldShowInput) => boolean;
  /** Ranh giới không được vượt qua ở ngữ cảnh này. */
  boundary: string;
};

const ORIGIN_LINE_CONTEXT_DEFINITIONS: Record<OriginLineRitualContext, OriginLineContextDefinition> = {
  origin_room: {
    context: "origin_room",
    coreMemoryContext: "origin-room",
    reason:
      "Origin Room là không gian duy nhất người dùng chủ động chọn đến để nhìn lại nguồn gốc — Origin Line ở đây không làm gián đoạn một luồng việc khác.",
    allowedFrequency: "once_per_day",
    tone: "Trầm, ngắn, như một dòng nhật ký — không phải lời chào, không phải khẩu hiệu.",
    shouldShow: ({ shownToday }) => !shownToday,
    boundary: "Không bubble, không CTA, không lặp lại nhiều lần trong cùng một lượt ghé.",
  },
  companion_chapter: {
    context: "companion_chapter",
    coreMemoryContext: "companion-chapter",
    reason:
      "Companion Chapter là nơi Companion tự nhìn lại hành trình của chính nó — Origin Line là một mảnh ký ức nền hợp lý ở đây, không phải nội dung ngẫu nhiên.",
    allowedFrequency: "once_per_session",
    tone: "Như Companion đang tự nhắc bản thân, không hướng tới người dùng.",
    shouldShow: ({ shownThisSession }) => !shownThisSession,
    boundary: "Chỉ hiện khi Companion Chapter thật sự có nội dung để hiển thị — không hiện vào ô trống.",
  },
  first_footprint_ceremony: {
    context: "first_footprint_ceremony",
    coreMemoryContext: "ceremony",
    reason:
      "First Footprint là nghi thức gốc của mọi hành trình — nếu Origin Line từng được nhắc trong một nghi thức, đây là nơi hợp lý nhất, ở bước Closing.",
    allowedFrequency: "once_ever_per_context",
    tone: "Như một lời hứa rất nhỏ, không phải lời giới thiệu thương hiệu.",
    shouldShow: ({ shownEver }) => !shownEver,
    boundary:
      "Không thêm bước mới vào Ceremony Framework (Opening → Reflection → Companion → Closing) — nếu dùng, chỉ chèn vào Closing đã có, không tạo bước riêng cho Origin Line.",
  },
  mirror_of_growth: {
    context: "mirror_of_growth",
    coreMemoryContext: "ceremony",
    reason:
      "Mirror of Growth là nơi nhìn lại — nhưng phản chiếu hành trình NGƯỜI DÙNG, không phải nguồn gốc Companion, nên Origin Line chỉ hợp lý khi không có vật liệu phản chiếu nào khác (mùa yên lặng).",
    allowedFrequency: "once_per_day",
    tone: "Rất nhẹ, không lấn vào không gian dành cho hành trình của người dùng.",
    shouldShow: ({ shownToday }) => !shownToday,
    boundary:
      "Không thay thế nội dung phản chiếu thật của người dùng — chỉ có thể xuất hiện khi `hasReflectionMaterial` là false, và không bao giờ là dòng đầu tiên người dùng thấy.",
  },
  founder_moment: {
    context: "founder_moment",
    coreMemoryContext: "founder-moment",
    reason:
      "Một khoảnh khắc thật sự có ý nghĩa với riêng Founder (ví dụ lần đầu mở Origin Room) — không phải một lời chào riêng mỗi lần đăng nhập.",
    allowedFrequency: "once_ever_per_context",
    tone: "Một câu, không ca tụng, không khác biệt hoá Founder khỏi người dùng khác về trải nghiệm.",
    shouldShow: ({ shownEver, isFounderPresent }) => !!isFounderPresent && !shownEver,
    boundary:
      "Không thần tượng hoá Founder (`docs/FOUNDER_HUMILITY_PRINCIPLE.md`) — không có Portal UX khác biệt nào khác cho Founder ngoài câu này.",
  },
  special_ritual: {
    context: "special_ritual",
    coreMemoryContext: "special-ritual",
    reason:
      "Một nghi thức đặc biệt, không định kỳ (ví dụ một cột mốc lớn của sản phẩm) — không phải một route hay một nút bấm thường ngày.",
    allowedFrequency: "once_ever_per_context",
    tone: "Trang trọng, hiếm, đúng tinh thần một nghi thức — không phải thông báo sản phẩm.",
    shouldShow: ({ shownEver }) => !shownEver,
    boundary: "Không tạo ra một nghi thức mới chỉ để có chỗ dùng Origin Line — chỉ dùng khi nghi thức đó tự nó đã tồn tại với lý do riêng.",
  },
};

export function getOriginLineContextDefinition(context: OriginLineRitualContext): OriginLineContextDefinition {
  return ORIGIN_LINE_CONTEXT_DEFINITIONS[context];
}

export function getAllOriginLineContexts(): OriginLineContextDefinition[] {
  return Object.values(ORIGIN_LINE_CONTEXT_DEFINITIONS);
}

/**
 * NV03/Founder Moment — placeholder adapter. Sprint 18.10 KHÔNG có một
 * nguồn dữ liệu thật để biết "đây có phải lần đầu Founder mở Origin Room"
 * hay "Companion Growth Log vừa có entry lớn" — vì chưa có bảng theo dõi
 * lượt ghé Origin Room theo người dùng, và Growth Log hiện là một file
 * doc tĩnh, không phải dữ liệu runtime. Trả về `null` một cách trung thực,
 * không fake event — đây là gap được brief cho phép để lại làm Technical
 * Debt, không phải lỗi.
 */
export function getFounderMomentTrigger(): null {
  return null;
}
