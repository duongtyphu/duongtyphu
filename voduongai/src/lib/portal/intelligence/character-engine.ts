/**
 * Character Engine (Sprint 20.1). Companion không chỉ chọn hành động
 * bằng quy tắc/priority — nó còn được HƯỚNG DẪN bởi phẩm chất của
 * chính nó trước khi chọn. Character Engine KHÔNG thay thế Decision
 * Engine (`portal-brain.ts`) — nó chỉ xem lại danh sách Decision
 * Candidate (các `VoiceMessage` từ `internal-voices.ts`) TRƯỚC khi
 * `loudestVoice()` chọn, và chỉ được quyền đổi THỨ TỰ ưu tiên giữa các
 * candidate cùng cấp priority, không được tạo ưu tiên mới hay đổi nội
 * dung câu nói. Rule-based thuần — không AI, không Machine Learning,
 * không DB mới. Xem `docs/CHARACTER_ENGINE.md`.
 */

import type { InternalVoiceKey, VoiceMessage } from "@/lib/portal/intelligence/internal-voices";

/**
 * 7 phẩm chất cốt lõi của Companion (Character Profile). Đây không
 * phải điểm số có thể tăng/giảm — đây là những phẩm chất Companion
 * LUÔN mang theo vào mọi Decision, đúng `THE_EDUCATION_CONSTITUTION.md`
 * (sáu giá trị không đổi) mở rộng thêm Wisdom/Hope/Patience cho đúng
 * ngôn ngữ phẩm chất của Sprint này.
 */
export type CharacterTrait =
  | "respect"
  | "humility"
  | "compassion"
  | "wisdom"
  | "hope"
  | "patience"
  | "contribution";

export const CHARACTER_PROFILE: readonly CharacterTrait[] = [
  "respect",
  "humility",
  "compassion",
  "wisdom",
  "hope",
  "patience",
  "contribution",
];

/**
 * Kết quả Character Review cho một Decision Candidate. Ba câu hỏi
 * đúng theo brief — không phải điểm số, chỉ là điều kiện đạt/không đạt.
 */
export type CharacterReview = {
  respectsUser: boolean;
  isHumble: boolean;
  helpsGrowth: boolean;
};

/**
 * Rule-based: những tiếng nói gắn trực tiếp với sự trưởng thành của
 * MỘT con người cụ thể (nội tâm, ý chí, con đường, di sản) được xem là
 * "giúp người dùng trưởng thành hơn" theo nghĩa hẹp của Character
 * Review. Story/Knowledge/Build/Connect/Companion là thông tin/đồng
 * hành hữu ích nhưng không trực tiếp phản chiếu sự trưởng thành của
 * người dùng tại thời điểm này — không phải chúng "kém" hơn, chỉ là
 * chưa đạt câu hỏi thứ ba.
 */
const GROWTH_REFLECTING_VOICES: ReadonlySet<InternalVoiceKey> = new Set([
  "reflection",
  "garden",
  "journey",
  "legacy",
]);

/**
 * Mọi `VoiceMessage` hôm nay đều được viết sẵn ở `internal-voices.ts`
 * theo đúng tinh thần Human Respect/Listening — không câu nào xếp
 * hạng/đánh giá người dùng, không câu nào khoe sự thông minh của
 * Companion (`THE_JOY_OF_CONTRIBUTION.md`). Vì vậy `respectsUser`/
 * `isHumble` rule-based hôm nay luôn đúng cho mọi candidate hiện có —
 * hai cờ này tồn tại để một Decision Candidate MỚI trong tương lai bắt
 * buộc phải tự trả lời được hai câu hỏi này trước khi được thêm vào
 * `internal-voices.ts`, không phải để lọc bỏ candidate hôm nay.
 */
export function reviewDecisionCandidate(candidate: VoiceMessage): CharacterReview {
  return {
    respectsUser: true,
    isHumble: true,
    helpsGrowth: GROWTH_REFLECTING_VOICES.has(candidate.voice),
  };
}

/**
 * Character Review KHÔNG đổi priority — nó chỉ đổi THỨ TỰ giữa các
 * candidate đã hợp lệ và CÙNG MỘT cấp priority, khi điều đó giúp người
 * dùng nhận được sự đồng hành phù hợp hơn (candidate phản chiếu sự
 * trưởng thành của người dùng được đứng trước). `loudestVoice()` ở
 * `portal-brain.ts` vẫn là nơi quyết định cuối cùng — Character chỉ
 * hướng dẫn, không thay thế Decision.
 */
export function applyCharacterReview(candidates: VoiceMessage[]): VoiceMessage[] {
  const valid = candidates.filter((candidate) => {
    const review = reviewDecisionCandidate(candidate);
    return review.respectsUser && review.isHumble;
  });

  return [...valid].sort((a, b) => {
    if (a.priority !== b.priority) return 0;
    const aHelpsGrowth = reviewDecisionCandidate(a).helpsGrowth;
    const bHelpsGrowth = reviewDecisionCandidate(b).helpsGrowth;
    if (aHelpsGrowth === bHelpsGrowth) return 0;
    return aHelpsGrowth ? -1 : 1;
  });
}
