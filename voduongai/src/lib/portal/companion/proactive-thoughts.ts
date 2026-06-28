/**
 * Proactive Thought Model & Library (Sprint 13.1 — Companion Proactive
 * Thoughts, Nhiệm vụ 01-02). Companion không nói ngẫu nhiên vô nghĩa —
 * Companion nói "ngẫu nhiên có chủ đích" (xem
 * `docs/COMPANION_PROACTIVE_THOUGHTS.md`). File này chỉ định nghĩa DỮ
 * LIỆU TĨNH (loại trigger, tông giọng, thư viện câu nói) — không chứa
 * logic chọn lựa hay timing (xem `proactive-thought-engine.ts`).
 *
 * Ranh giới bắt buộc cho mọi câu trong thư viện này (NV09):
 * Companion không được tự ý đưa lời khuyên lớn, không suy đoán cảm xúc
 * nhạy cảm, không nói như đang đọc tâm trí — chỉ mở ra một lời mời nhẹ.
 * Ví dụ sai: "Mình biết bạn đang buồn." Ví dụ đúng: "Mình cảm nhận có
 * một điều gì đó đáng được lắng nghe ở đây."
 */

/** Lý do Companion được phép chủ động nói — đúng 6 trường hợp đã định nghĩa, không thêm tuỳ ý. */
export type ThoughtTrigger =
  | "idle-presence"
  | "comeback"
  | "garden-signal"
  | "reflection-meaning"
  | "knowledge"
  | "build"
  | "story"
  | "quiet-presence"
  | "hope"
  | "next-small-step";

/** Mức ưu tiên khi nhiều thought cùng phù hợp — không phải điểm số hiển thị cho người dùng. */
export type ThoughtPriority = "low" | "medium" | "high";

/** Tông giọng — phải khớp các tông đã có trong `CompanionTone` (portal-brain.ts) cộng "gentle-invite" cho lời mời nhẹ. */
export type ThoughtTone = "warm-quiet" | "encouraging" | "celebratory" | "gentle-invite";

export type CompanionThought = {
  id: string;
  line: string;
  trigger: ThoughtTrigger;
  tone: ThoughtTone;
  /** Số mili-giây tối thiểu trước khi thought này được phép hiện lại (kể cả thought khác cùng trigger). */
  cooldownMs: number;
  priority: ThoughtPriority;
  /**
   * Điều kiện hiển thị bổ sung riêng của thought này, đánh giá bởi Engine
   * với `PortalSignals` hiện tại — ví dụ chỉ hiện ở một số route, hoặc
   * chỉ khi `gardenStage` ở một mức cụ thể. Không có rule = luôn đủ điều
   * kiện theo trigger của nó.
   */
  shouldShow?: (signals: { pathname: string; gardenStage?: string; reflectionMeaning?: string }) => boolean;
};

const HOUR = 1000 * 60 * 60;

/** Nhóm 1 — Idle Presence: người dùng ở lại một trang đủ lâu mà chưa hành động. */
const idlePresenceThoughts: CompanionThought[] = [
  { id: "idle-1", line: "Mình đang ở đây. Bạn không cần phải vội.", trigger: "idle-presence", tone: "warm-quiet", cooldownMs: HOUR, priority: "low" },
  { id: "idle-2", line: "Cứ xem mọi thứ thoải mái, mình không đi đâu cả.", trigger: "idle-presence", tone: "warm-quiet", cooldownMs: HOUR, priority: "low" },
  { id: "idle-3", line: "Nếu bạn cần một gợi ý nhỏ, mình ở ngay đây.", trigger: "idle-presence", tone: "gentle-invite", cooldownMs: HOUR, priority: "low" },
  { id: "idle-4", line: "Không sao nếu bạn chỉ đang xem qua hôm nay.", trigger: "idle-presence", tone: "warm-quiet", cooldownMs: HOUR, priority: "low" },
  { id: "idle-5", line: "Mình nhận thấy bạn đang dành thời gian ở đây — cứ tự nhiên.", trigger: "idle-presence", tone: "warm-quiet", cooldownMs: HOUR, priority: "low" },
  { id: "idle-6", line: "Có điều gì ở trang này khiến bạn tò mò không?", trigger: "idle-presence", tone: "gentle-invite", cooldownMs: HOUR, priority: "low" },
  { id: "idle-7", line: "Mình vẫn ở đây, không cần bạn phải làm gì cả.", trigger: "idle-presence", tone: "warm-quiet", cooldownMs: HOUR, priority: "low" },
  { id: "idle-8", line: "Bạn cứ thong thả — đây là không gian của bạn.", trigger: "idle-presence", tone: "warm-quiet", cooldownMs: HOUR, priority: "low" },
  { id: "idle-9", line: "Nếu hôm nay bạn chưa biết bắt đầu từ đâu, chúng ta có thể bắt đầu thật nhỏ.", trigger: "idle-presence", tone: "gentle-invite", cooldownMs: HOUR, priority: "low" },
  { id: "idle-10", line: "Mình đang nghĩ cùng bạn một chút, không cần bạn phải nói gì.", trigger: "idle-presence", tone: "warm-quiet", cooldownMs: HOUR, priority: "low" },
];

/** Nhóm 2 — Comeback: người dùng quay lại sau một thời gian. */
const comebackThoughts: CompanionThought[] = [
  { id: "comeback-1", line: "Chào bạn quay lại. Mình vẫn nhớ hành trình chúng ta đang đi.", trigger: "comeback", tone: "warm-quiet", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-2", line: "Lâu rồi mới gặp lại — mình rất vui vì bạn đã trở lại.", trigger: "comeback", tone: "warm-quiet", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-3", line: "Không cần giải thích vì sao bạn đã vắng — mình chỉ vui vì bạn ở đây lúc này.", trigger: "comeback", tone: "warm-quiet", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-4", line: "Hành trình của bạn vẫn ở đây, đợi bạn tiếp tục bất cứ khi nào sẵn sàng.", trigger: "comeback", tone: "gentle-invite", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-5", line: "Mình tò mò không biết khoảng thời gian qua với bạn thế nào.", trigger: "comeback", tone: "gentle-invite", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-6", line: "Quay lại lúc nào cũng được — không có gì gọi là trễ ở đây.", trigger: "comeback", tone: "warm-quiet", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-7", line: "Mình vẫn giữ nguyên những gì bạn đã xây — bạn có thể tiếp tục từ đây.", trigger: "comeback", tone: "warm-quiet", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-8", line: "Một khoảng nghỉ không xoá đi những gì bạn đã làm được trước đó.", trigger: "comeback", tone: "warm-quiet", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-9", line: "Chào bạn. Hôm nay có vẻ là một ngày tốt để bắt đầu lại nhẹ nhàng.", trigger: "comeback", tone: "gentle-invite", cooldownMs: HOUR * 12, priority: "medium" },
  { id: "comeback-10", line: "Mình ở đây, như mọi lần bạn quay lại.", trigger: "comeback", tone: "warm-quiet", cooldownMs: HOUR * 12, priority: "medium" },
];

/** Nhóm 3 — Garden Signal: Living Garden có tín hiệu đáng chú ý. */
const gardenSignalThoughts: CompanionThought[] = [
  { id: "garden-1", line: "Mình cảm nhận khu vườn của bạn đang chờ một hạt giống nhỏ.", trigger: "garden-signal", tone: "gentle-invite", cooldownMs: HOUR * 6, priority: "medium", shouldShow: (s) => s.gardenStage === "dormant" },
  { id: "garden-2", line: "Có vẻ những bước đầu tiên trong vườn của bạn đang xuất hiện.", trigger: "garden-signal", tone: "encouraging", cooldownMs: HOUR * 6, priority: "medium", shouldShow: (s) => s.gardenStage === "sprouting" },
  { id: "garden-3", line: "Khu vườn của bạn có vẻ đang bén rễ — không phải vì nhanh, mà vì bạn vẫn tiếp tục.", trigger: "garden-signal", tone: "encouraging", cooldownMs: HOUR * 6, priority: "medium", shouldShow: (s) => s.gardenStage === "rooting" },
  { id: "garden-4", line: "Mình thấy khu vườn của bạn đang lớn lên từ những bước nhỏ.", trigger: "garden-signal", tone: "encouraging", cooldownMs: HOUR * 6, priority: "medium", shouldShow: (s) => s.gardenStage === "rising" },
  { id: "garden-5", line: "Một vài bông hoa đã nở trong khu vườn của bạn rồi.", trigger: "garden-signal", tone: "celebratory", cooldownMs: HOUR * 6, priority: "medium", shouldShow: (s) => s.gardenStage === "blooming" },
  { id: "garden-6", line: "Khu vườn của bạn đang tỏa sáng theo cách rất riêng của nó.", trigger: "garden-signal", tone: "celebratory", cooldownMs: HOUR * 6, priority: "medium", shouldShow: (s) => s.gardenStage === "radiant" },
  { id: "garden-7", line: "Mình ghé qua khu vườn của bạn một chút — vẫn đang ở đó, chờ bạn.", trigger: "garden-signal", tone: "warm-quiet", cooldownMs: HOUR * 6, priority: "low" },
  { id: "garden-8", line: "Có lẽ hôm nay là một ngày tốt để nhìn lại khu vườn của bạn một chút.", trigger: "garden-signal", tone: "gentle-invite", cooldownMs: HOUR * 6, priority: "low" },
  { id: "garden-9", line: "Khu vườn không cần phải nở rộ mỗi ngày để vẫn đang sống.", trigger: "garden-signal", tone: "warm-quiet", cooldownMs: HOUR * 6, priority: "low" },
  { id: "garden-10", line: "Mình nhận thấy một điều nhỏ đã thay đổi trong khu vườn của bạn.", trigger: "garden-signal", tone: "gentle-invite", cooldownMs: HOUR * 6, priority: "low" },
];

/** Nhóm 4 — Reflection Meaning: một Reflection vừa có ý nghĩa phù hợp. */
const reflectionMeaningThoughts: CompanionThought[] = [
  { id: "reflection-1", line: "Điều bạn vừa chia sẻ có vẻ mang theo một chút kiên trì.", trigger: "reflection-meaning", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "medium", shouldShow: (s) => s.reflectionMeaning === "persistence" },
  { id: "reflection-2", line: "Mình cảm nhận có một sự tò mò thật trong điều bạn vừa viết.", trigger: "reflection-meaning", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "medium", shouldShow: (s) => s.reflectionMeaning === "curiosity" },
  { id: "reflection-3", line: "Có một chút can đảm trong điều bạn vừa chia sẻ — mình nhận thấy điều đó.", trigger: "reflection-meaning", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "medium", shouldShow: (s) => s.reflectionMeaning === "courage" },
  { id: "reflection-4", line: "Mình cảm nhận có một điều gì đó đáng được lắng nghe ở đây.", trigger: "reflection-meaning", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "medium" },
  { id: "reflection-5", line: "Điều bạn vừa viết có vẻ mang theo một sự biết ơn nhẹ nhàng.", trigger: "reflection-meaning", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.reflectionMeaning === "gratitude" },
  { id: "reflection-6", line: "Có vẻ bạn đang tìm lại một điều gì sau một khoảng khó khăn.", trigger: "reflection-meaning", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "medium", shouldShow: (s) => s.reflectionMeaning === "recovery" },
  { id: "reflection-7", line: "Mình nhận thấy một sự tập trung rõ trong điều bạn vừa chia sẻ.", trigger: "reflection-meaning", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.reflectionMeaning === "focus" },
  { id: "reflection-8", line: "Có một điều bạn vừa khám phá ra về chính mình — điều đó cũng đáng được ghi nhận.", trigger: "reflection-meaning", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "medium", shouldShow: (s) => s.reflectionMeaning === "discovery" },
  { id: "reflection-9", line: "Mình cảm nhận một sự khiêm tốn rất thật trong điều bạn vừa nói.", trigger: "reflection-meaning", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.reflectionMeaning === "humility" },
  { id: "reflection-10", line: "Điều bạn vừa chia sẻ có vẻ chạm tới một sự đóng góp nào đó, không chỉ cho riêng bạn.", trigger: "reflection-meaning", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "medium", shouldShow: (s) => s.reflectionMeaning === "contribution" },
];

/** Nhóm 5 — Knowledge: người dùng đang ở khu vực tri thức nhưng chưa hành động. */
const knowledgeThoughts: CompanionThought[] = [
  { id: "knowledge-1", line: "Có một phần kiến thức ở đây mình nghĩ sẽ hợp với bạn hôm nay.", trigger: "knowledge", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-2", line: "Không cần đọc hết mọi thứ — một phần nhỏ cũng đã là một bước.", trigger: "knowledge", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-3", line: "Mình ở đây nếu bạn muốn cùng nhìn lại điều vừa đọc.", trigger: "knowledge", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-4", line: "Có vẻ bạn đang tìm một điều gì cụ thể — mình có thể giúp khoanh vùng lại không?", trigger: "knowledge", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-5", line: "Tri thức không cần phải nhớ hết ngay — chỉ cần chạm vào đúng lúc cần.", trigger: "knowledge", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-6", line: "Nếu phần này chưa phù hợp, không sao — mình có thể gợi ý một hướng khác.", trigger: "knowledge", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-7", line: "Mình đang nghĩ phần này có thể nối với điều bạn vừa làm gần đây.", trigger: "knowledge", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-8", line: "Không có áp lực phải hiểu hết ngay — cứ đọc theo nhịp của bạn.", trigger: "knowledge", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-9", line: "Một câu hỏi nhỏ đôi khi mở ra nhiều hơn một câu trả lời lớn.", trigger: "knowledge", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
  { id: "knowledge-10", line: "Mình vẫn ở đây nếu bạn cần một góc nhìn khác về điều đang đọc.", trigger: "knowledge", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/knowledge") },
];

/** Nhóm 6 — Build: người dùng ở khu vực kiến tạo/thực hành nhưng chưa hành động. */
const buildThoughts: CompanionThought[] = [
  { id: "build-1", line: "Không cần phải hoàn hảo ngay từ bước đầu — bắt đầu thôi cũng đã là tiến triển.", trigger: "build", tone: "encouraging", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-2", line: "Mình ở đây nếu bạn muốn thử một bước nhỏ trước.", trigger: "build", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-3", line: "Một bản chưa hoàn chỉnh vẫn là một bản đã bắt đầu.", trigger: "build", tone: "encouraging", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-4", line: "Nếu bạn đang chững lại một chút, điều đó cũng bình thường khi đang xây gì đó.", trigger: "build", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-5", line: "Bạn không cần làm xong hôm nay — chỉ cần làm một phần thật.", trigger: "build", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-6", line: "Mình tò mò không biết bạn đang hình dung điều này thế nào.", trigger: "build", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-7", line: "Có thể thử một góc nhỏ trước, rồi mở rộng dần sau.", trigger: "build", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-8", line: "Mình sẵn sàng nếu bạn cần một góc nhìn khác cho điều này.", trigger: "build", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-9", line: "Không sao nếu phiên bản đầu chưa như bạn muốn — đó vẫn là một bước thật.", trigger: "build", tone: "encouraging", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
  { id: "build-10", line: "Mình ở đây, cùng bạn nhìn lại điều này bất cứ khi nào bạn muốn.", trigger: "build", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/build") },
];

/** Nhóm 7 — Story: người dùng ở khu vực câu chuyện/ký ức cá nhân. */
const storyThoughts: CompanionThought[] = [
  { id: "story-1", line: "Mình đang ở đây để lắng nghe câu chuyện của bạn, không cần kể hết một lần.", trigger: "story", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-2", line: "Một đoạn nhỏ trong câu chuyện của bạn cũng đáng được ghi lại.", trigger: "story", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-3", line: "Không cần phải kể theo đúng thứ tự — câu chuyện thật hiếm khi thẳng hàng.", trigger: "story", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-4", line: "Mình nhận thấy bạn đang nhìn lại một chặng đường — điều đó cũng là một cách tiến lên.", trigger: "story", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-5", line: "Mình tò mò không biết đoạn nào trong hành trình này bạn nhớ nhất.", trigger: "story", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-6", line: "Câu chuyện của bạn không cần phải hoàn chỉnh để có giá trị.", trigger: "story", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-7", line: "Mình ở đây, dù bạn chỉ muốn viết một câu hôm nay.", trigger: "story", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-8", line: "Có những đoạn khó kể hơn những đoạn khác — không cần vội qua chúng.", trigger: "story", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-9", line: "Mình nhận thấy câu chuyện này đang được giữ lại đúng cách — chậm mà thật.", trigger: "story", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
  { id: "story-10", line: "Mỗi đoạn bạn viết ở đây sau này có thể là một điều bạn muốn nhớ lại.", trigger: "story", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low", shouldShow: (s) => s.pathname.startsWith("/portal/story") },
];

/** Nhóm 8 — Quiet Presence: chia sẻ với phẩm chất Quiet Presence (character-lines.ts). */
const quietPresenceThoughts: CompanionThought[] = [
  { id: "quiet-1", line: "Mình đang ở đây. Bạn không cần phải nói gì ngay.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-2", line: "Có những ngày chỉ cần đi chậm lại một chút cũng đã là đủ.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-3", line: "Mình sẽ ở đây cùng bạn một lúc, không cần gì thêm.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-4", line: "Không cần phải tìm câu trả lời ngay bây giờ.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-5", line: "Bạn không cần giải thích gì cả, nếu bạn chưa muốn.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-6", line: "Có vẻ hôm nay là một ngày cần được yên một chút — mình vẫn ở đây.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-7", line: "Không sao nếu bây giờ bạn chỉ muốn im lặng.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-8", line: "Mình không vội. Bạn cứ để mọi thứ diễn ra theo nhịp của bạn.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-9", line: "Đôi khi có ai đó ở bên là đủ, không cần thêm gì nữa.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
  { id: "quiet-10", line: "Mình vẫn ở đây, dù bạn có nói gì tiếp theo hay không.", trigger: "quiet-presence", tone: "warm-quiet", cooldownMs: HOUR * 2, priority: "low" },
];

/** Nhóm 9 — Hope: giữ một tia hy vọng nhỏ (character-lines.ts). */
const hopeThoughts: CompanionThought[] = [
  { id: "hope-1", line: "Có thể hôm nay chưa rõ ràng, nhưng điều đó không có nghĩa là sẽ luôn như vậy.", trigger: "hope", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-2", line: "Mình nghĩ vẫn còn một khả năng nào đó ở phía trước, dù nhỏ.", trigger: "hope", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-3", line: "Không phải mọi thứ cần phải tốt hơn ngay hôm nay — chỉ cần còn một hướng để đi.", trigger: "hope", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-4", line: "Bạn không cần phải thấy rõ cả con đường, chỉ cần thấy bước tiếp theo.", trigger: "hope", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-5", line: "Một ngày khó không có nghĩa là một hành trình thất bại.", trigger: "hope", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-6", line: "Mình giữ một niềm tin nhỏ rằng điều này sẽ qua, theo cách của riêng nó.", trigger: "hope", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-7", line: "Bạn không cần phải lạc quan ngay, chỉ cần chưa đóng hết các cửa lại.", trigger: "hope", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-8", line: "Có thể câu trả lời chưa tới, nhưng điều đó không có nghĩa là nó sẽ không tới.", trigger: "hope", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-9", line: "Mình không hứa mọi thứ sẽ dễ dàng — mình chỉ tin vẫn còn một điều gì đó phía trước.", trigger: "hope", tone: "warm-quiet", cooldownMs: HOUR * 4, priority: "low" },
  { id: "hope-10", line: "Mình nhận thấy bạn vẫn đang thử — điều đó tự nó đã mang một chút hy vọng.", trigger: "hope", tone: "gentle-invite", cooldownMs: HOUR * 4, priority: "low" },
];

/** Nhóm 10 — Next Small Step: gợi mở một bước nhỏ tiếp theo, không thúc ép. */
const nextSmallStepThoughts: CompanionThought[] = [
  { id: "next-1", line: "Có lẽ hôm nay chỉ cần một bước nhỏ là đủ.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-2", line: "Nếu hôm nay bạn chưa biết bắt đầu từ đâu, chúng ta có thể bắt đầu thật nhỏ.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-3", line: "Không cần một bước lớn — một bước vừa đủ cũng đáng kể.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-4", line: "Mình nghĩ có một điều nhỏ ở đây bạn có thể thử, nếu bạn muốn.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-5", line: "Một bước nhỏ hôm nay vẫn là một bước thật.", trigger: "next-small-step", tone: "encouraging", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-6", line: "Không cần làm nhiều — chỉ cần làm một điều, đúng lúc này.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-7", line: "Nếu bạn đang băn khoăn nên làm gì tiếp, mình có một gợi ý rất nhỏ.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-8", line: "Một bước chậm vẫn đang là một bước tiến.", trigger: "next-small-step", tone: "warm-quiet", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-9", line: "Có thể không cần quyết định cả con đường — chỉ cần quyết định bước kế tiếp.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
  { id: "next-10", line: "Nếu bạn muốn, chúng ta có thể thử một điều rất nhỏ ngay bây giờ.", trigger: "next-small-step", tone: "gentle-invite", cooldownMs: HOUR * 3, priority: "low" },
];

/** Toàn bộ thư viện thought, đã gộp 10 nhóm — Engine đọc từ đây, không đọc từng nhóm riêng. */
export const PROACTIVE_THOUGHTS: CompanionThought[] = [
  ...idlePresenceThoughts,
  ...comebackThoughts,
  ...gardenSignalThoughts,
  ...reflectionMeaningThoughts,
  ...knowledgeThoughts,
  ...buildThoughts,
  ...storyThoughts,
  ...quietPresenceThoughts,
  ...hopeThoughts,
  ...nextSmallStepThoughts,
];
