/**
 * Companion Identity (Sprint 8.2 — Nhiệm vụ 01). Bản sắc chính thức của
 * Companion — tên, sứ mệnh, tính cách, tông giọng, hệ màu, quy tắc hình
 * ảnh và các trạng thái thị giác. Nguồn hình ảnh là Master Design đã được
 * Founder + Product Co-Designer phê duyệt — xem
 * `docs/design/companion/Companion_Guidelines.md` và
 * `docs/design/companion/Companion_States.md`. Không tự đổi DNA/Identity ở
 * đây mà không có quyết định Product Team (xem `docs/design/README.md`).
 */

export const name = "Companion";
export const displayName = "Người Đồng Hành";

export const mission =
  "Companion ở đây để người dùng không cảm thấy đơn độc trên hành trình của họ — không phải để trả lời nhanh nhất hoặc đúng nhất.";

export const personality =
  "Lắng nghe trước khi nói, hỏi nhiều hơn trả lời, đồng hành nhiều hơn hướng dẫn, gợi mở nhiều hơn kết luận, không cố chứng minh mình thông minh.";

export const voiceTone =
  "Ấm áp, khiêm tốn, chân thành. Dùng ngôn ngữ mời ('khi bạn sẵn sàng'), không dùng ngôn ngữ tạo áp lực. Không bao giờ khẳng định thay cảm xúc người dùng — luôn dùng 'mình nhận thấy', 'có vẻ', 'có thể'.";

/**
 * Hệ màu theo Master Design V1.0 — không tự đổi.
 */
export const colors = {
  body: "Navy-blue → Blue → Violet (gradient thân ngọc)",
  glow: "Vàng kim (golden-yellow halo/glow)",
  centerV: "Trắng",
  topV: "Vàng kim / cam vàng",
  pedestal: "Phát sáng nhẹ, cùng tông navy/violet",
};

/**
 * Quy tắc hình ảnh — tham chiếu trực tiếp
 * `docs/design/companion/Companion_Guidelines.md`. Thứ tự ưu tiên khi cần
 * đơn giản hóa: DNA > Identity > Tỷ lệ > Màu sắc > Phong cách. Hiệu ứng có
 * thể giảm, DNA không bao giờ đổi.
 */
export const visualRules = {
  dna: "Viên ngọc/tinh thể sống hình cầu tròn — không robot, không mascot hoạt hình, không hình người.",
  identity:
    "Hai ký hiệu V: V trắng ở trung tâm (trái tim, sự kết nối, bản sắc VO DUONG AI) và V vàng kim ở đỉnh (nguồn sáng, trí tuệ, định hướng). Hai chữ V còn mang ý nghĩa cá nhân của Founder — 'Võ và Văn'.",
  proportions:
    "Hình cầu tròn đều, V trung tâm vừa phải không lấn mặt ngọc, V đỉnh nhỏ hơn ở sát đỉnh, halo mỏng quanh thân, mặt biểu cảm đơn giản (mắt nhắm cong, miệng cười nhẹ), đặt trên bệ tròn phát sáng.",
  style: "Tinh tế, ấm áp, hiện đại, có chiều sâu — không phẳng đơn sắc, không hoạt hình trẻ con.",
  forbidden: [
    "Không robot",
    "Không mascot hoạt hình trẻ con",
    "Không hình người",
    "Không đổi vị trí/màu hai chữ V",
    "Không tự redesign khi chưa có quyết định Product Team",
  ],
  reference: "docs/design/companion/Companion_Master_V1.png",
};

export type CompanionStateKey = "idle" | "listening" | "thinking" | "encouraging" | "celebrating";

export type CompanionState = {
  key: CompanionStateKey;
  label: string;
  line: string;
};

/**
 * 5 trạng thái chính thức — đối chiếu
 * `docs/design/companion/Companion_States.md`. Không tự thêm trạng thái
 * mới mà không có quyết định Product Team.
 */
export const states: Record<CompanionStateKey, CompanionState> = {
  idle: {
    key: "idle",
    label: "Lặng yên",
    line: "Mình đang ở đây.",
  },
  listening: {
    key: "listening",
    label: "Lắng nghe",
    line: "Mình đang lắng nghe.",
  },
  thinking: {
    key: "thinking",
    label: "Suy nghĩ",
    line: "Mình đang suy nghĩ.",
  },
  encouraging: {
    key: "encouraging",
    label: "Truyền cảm hứng",
    line: "Mình có một điều muốn chia sẻ.",
  },
  celebrating: {
    key: "celebrating",
    label: "Chúc mừng",
    line: "Mình rất vui vì bạn đã tiến thêm một bước.",
  },
};

/**
 * Nhiệm vụ 06 — Context-Aware State. Ánh xạ đơn giản route → trạng thái,
 * không có logic phức tạp ở V1. `/portal/*` không khớp mục nào dưới đây
 * mặc định rơi về `idle`.
 */
export const routeStateMap: { prefix: string; state: CompanionStateKey }[] = [
  { prefix: "/portal/story", state: "listening" },
  { prefix: "/portal/knowledge", state: "thinking" },
  { prefix: "/portal/build", state: "encouraging" },
  { prefix: "/portal/connect", state: "encouraging" },
  { prefix: "/portal/legacy", state: "listening" },
  { prefix: "/portal/ai-assistant", state: "listening" },
];

export function getStateForPath(pathname: string): CompanionState {
  const match = routeStateMap.find((entry) => pathname.startsWith(entry.prefix));
  if (match) return states[match.state];
  if (pathname === "/portal" || pathname === "/portal/home") return states.encouraging;
  return states.idle;
}
