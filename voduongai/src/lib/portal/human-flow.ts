import type { ChallengeTag } from "@/lib/portal/human-insight";
import { getWhenLifeIsHardLine, type HardTimeTrigger } from "@/lib/portal/when-life-is-hard";

export type PortalOS = "journey" | "knowledge" | "build" | "connect" | "legacy";

export type HumanFlowState = {
  currentOS: PortalOS;
  nextOS: PortalOS;
  currentStage: string;
  nextBestAction: string;
  reason: string;
  progressNarrative: string;
  momentumMessage: string;
  recommendedRoute: string;
  recommendedCTA: string;
  /** Sprint 7.5 — chỉ có khi một thử thách khó khăn đang nổi rõ gần đây. */
  hardTimeLine?: string;
};

const OS_ROUTE: Record<PortalOS, string> = {
  journey: "/portal/journey",
  knowledge: "/portal/knowledge",
  build: "/portal/build",
  connect: "/portal/connect",
  legacy: "/portal/legacy",
};

const NEXT_OS: Record<PortalOS, PortalOS> = {
  journey: "knowledge",
  knowledge: "build",
  build: "connect",
  connect: "legacy",
  legacy: "legacy",
};

const FLOW_STAGES: Record<PortalOS, Omit<HumanFlowState, "currentOS" | "nextOS" | "recommendedRoute">> = {
  journey: {
    currentStage: "Đang làm quen với hành trình",
    nextBestAction: "Hoàn thành lộ trình nhập môn",
    reason: "Một nền móng vững giúp mọi bước sau này đi nhanh hơn và ít hoang mang hơn.",
    progressNarrative: "Bạn đang ở giai đoạn KHỞI ĐẦU. Điều quan trọng nhất lúc này là làm quen, không phải làm nhanh.",
    momentumMessage: "Mỗi bước nhỏ hôm nay đang âm thầm định hình con đường của bạn.",
    recommendedCTA: "Tiếp tục hành trình",
  },
  knowledge: {
    currentStage: "Đã hoàn thành nền tảng AI",
    nextBestAction: "Tạo Landing Page đầu tiên",
    reason: "Bạn đã có đủ kiến thức nền để bắt đầu kiến tạo giá trị thực tế.",
    progressNarrative: "Bạn đang chuyển từ HỌC sang HÀNH ĐỘNG. Điều quan trọng nhất lúc này không phải học thêm thật nhiều, mà là chọn một điều nhỏ để thực hành hôm nay.",
    momentumMessage: "Hôm nay là thời điểm tốt để biến tri thức thành kết quả đầu tiên.",
    recommendedCTA: "Bắt đầu kiến tạo",
  },
  build: {
    currentStage: "Đang kiến tạo giá trị đầu tiên",
    nextBestAction: "Kết nối với cộng đồng để chia sẻ kết quả",
    reason: "Sự trưởng thành đi nhanh hơn khi có người đồng hành và phản hồi thật.",
    progressNarrative: "Bạn đang ở giai đoạn KIẾN TẠO → KẾT NỐI. Một kết quả nhỏ được chia sẻ đúng nơi có thể mở ra nhiều cơ hội mới.",
    momentumMessage: "Những gì bạn đang xây hôm nay sẽ trở thành câu chuyện của ngày mai.",
    recommendedCTA: "Kết nối ngay",
  },
  connect: {
    currentStage: "Đang mở rộng mạng lưới kết nối",
    nextBestAction: "Lưu lại thành tựu và bài học vào My Legacy",
    reason: "Những gì bạn học được từ cộng đồng đáng được giữ lại như một phần di sản của riêng bạn.",
    progressNarrative: "Bạn đang ở giai đoạn KẾT NỐI → LƯU GIỮ. Hãy biến những trải nghiệm vừa qua thành tài sản lâu dài.",
    momentumMessage: "Viên ngọc của bạn đang sáng hơn qua từng kết nối ý nghĩa.",
    recommendedCTA: "Lưu vào di sản",
  },
  legacy: {
    currentStage: "Đang xây dựng di sản số của riêng mình",
    nextBestAction: "Xem lại hành trình và đặt mục tiêu tiếp theo",
    reason: "Nhìn lại những gì đã tích lũy giúp bạn chọn bước tiếp theo rõ ràng hơn.",
    progressNarrative: "Bạn đang ở giai đoạn NHÌN LẠI → ĐẶT MỤC TIÊU MỚI. Di sản hôm nay là nền móng cho hành trình kế tiếp.",
    momentumMessage: "Mỗi điều bạn lưu giữ lại là một minh chứng cho sự trưởng thành của chính mình.",
    recommendedCTA: "Xem di sản của tôi",
  },
};

/**
 * Nhiệm vụ 04 (Sprint 7.2) — Next Insight: khi một thử thách (challenge)
 * được Reflection nhắc tới nhiều nhất gần đây, nó ưu tiên một hành động
 * nhỏ, vừa sức thay vì bước tiếp theo mặc định của OS hiện tại.
 */
const CHALLENGE_OVERRIDE: Partial<Record<ChallengeTag, { nextBestAction: string; reason: string }>> = {
  "Thiếu tự tin": {
    nextBestAction: "Thực hành một bài tập nhỏ, vừa sức hôm nay",
    reason: "Có vẻ gần đây bạn đang thiếu tự tin — một kết quả nhỏ ngay lúc này quan trọng hơn một khóa học nâng cao.",
  },
  "Thiếu kiến thức": {
    nextBestAction: "Ôn lại một bài học nền tảng trước khi đi tiếp",
    reason: "Có vẻ một vài kiến thức nền vẫn cần được củng cố trước khi bước tiếp.",
  },
  "Thiếu động lực": {
    nextBestAction: "Đọc lại một thành tựu nhỏ bạn đã lưu trong My Story",
    reason: "Có lẽ nhìn lại những gì bạn đã làm được sẽ giúp bạn có thêm động lực.",
  },
  "Thiếu hệ thống": {
    nextBestAction: "Dùng một Template hoặc SOP có sẵn thay vì làm từ đầu",
    reason: "Có vẻ bạn đang cần một quy trình rõ ràng hơn là thêm kiến thức mới.",
  },
  "Thiếu thời gian": {
    nextBestAction: "Chọn một nhiệm vụ 5 phút trong Nhiệm vụ 30 ngày",
    reason: "Có vẻ thời gian là rào cản lớn nhất lúc này — một bước rất nhỏ vẫn là tiến bộ.",
  },
};

const CHALLENGE_HARD_TIME_TRIGGER: Partial<Record<ChallengeTag, HardTimeTrigger>> = {
  "Thiếu tự tin": "doubtingTheJourney",
  "Thiếu kiến thức": "doubtingTheJourney",
  "Thiếu động lực": "lowEnergy",
  "Thiếu hệ thống": "carryingTooMuch",
  "Thiếu thời gian": "carryingTooMuch",
};

/**
 * Mock-data version of the Human Flow Engine — same shape will later read
 * from real progress data (missions, courses, community activity) instead
 * of a hardcoded currentOS. `dominantChallenge` (from human-understanding.ts)
 * is optional and, when present, overrides the default next-best-action and
 * adds a quiet "When Life Is Hard" line (Sprint 7.5) before the CTA.
 */
export function getHumanFlowState(currentOS: PortalOS = "knowledge", dominantChallenge?: ChallengeTag): HumanFlowState {
  const nextOS = NEXT_OS[currentOS];
  const stage = FLOW_STAGES[currentOS];
  const override = dominantChallenge ? CHALLENGE_OVERRIDE[dominantChallenge] : undefined;
  const hardTimeTrigger = dominantChallenge ? CHALLENGE_HARD_TIME_TRIGGER[dominantChallenge] : undefined;

  return {
    currentOS,
    nextOS,
    recommendedRoute: OS_ROUTE[nextOS],
    ...stage,
    ...(override ?? {}),
    ...(hardTimeTrigger ? { hardTimeLine: getWhenLifeIsHardLine(hardTimeTrigger) } : {}),
  };
}
