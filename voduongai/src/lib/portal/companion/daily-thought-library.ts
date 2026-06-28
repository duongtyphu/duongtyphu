/**
 * Daily Thought Library (Sprint 18.5 — Nhiệm vụ 04). Xem
 * `docs/DAILY_THOUGHT_ENGINE.md`.
 *
 * Đây KHÔNG phải Quote Engine — không câu nào ở đây là trích dẫn, không
 * câu nào mang tính cổ vũ/motivational, không câu nào là cliché. Mỗi câu
 * phải đọc như "một người vừa nghĩ ra điều gì đó" — một suy nghĩ rất nhỏ,
 * rất riêng, không nhắm tới hành động gì cả.
 *
 * BOUNDARY (bắt buộc cho mọi câu): không bán hàng, không quảng bá khoá
 * học, không CTA, không "click vào đây", không quảng cáo, không ép tương
 * tác. Daily Thought chỉ phục vụ: sự hiện diện, sự đồng hành, sự phản
 * chiếu, sự trưởng thành.
 *
 * `id` mỗi câu là một `DailyThought` tương thích với `CompanionThought`
 * (Sprint 13.1) — Thought Selector (`proactive-thought-engine.ts`) đọc
 * thẳng từ thư viện này, không cần engine riêng. `trigger` luôn là
 * `"daily-thought"`; `source` quyết định khi nào câu này đủ điều kiện
 * (xem `mapContextToSource` ở `daily-thought-source.ts`).
 */

import type { CompanionThought } from "@/lib/portal/companion/proactive-thoughts";
import { type ThoughtSource, toExperienceSource } from "@/lib/portal/companion/daily-thought-source";
import { experiencesBySource } from "@/lib/portal/companion/living-experience";

/**
 * Sprint 18.7 — Living Experiences: mỗi Daily Thought giờ có thêm
 * `experienceId`, trỏ ngược về đúng một `LivingExperience`
 * (`living-experience.ts`) mà câu này bắt nguồn từ (Observation → Meaning
 * → Thought Seed). Định nghĩa hoàn thành (DoD) của Sprint 18.7: mọi Daily
 * Thought truy ngược được về ít nhất một Living Experience — `withExperience()`
 * dưới đây gán `experienceId` cho từng nhóm theo đúng `ExperienceSource`
 * tương ứng, không random.
 */
export type DailyThought = CompanionThought & { source: ThoughtSource; experienceId: string };

const DAY = 1000 * 60 * 60 * 20;

function withExperience(thoughts: Omit<DailyThought, "experienceId">[]): DailyThought[] {
  return thoughts.map((thought, index) => {
    const pool = experiencesBySource(toExperienceSource(thought.source));
    const experience = pool[index % pool.length];
    return { ...thought, experienceId: experience.id };
  });
}

/** Nhóm Garden — một suy nghĩ nảy ra từ việc liếc qua khu vườn. */
const gardenThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-garden-1", line: "Mình tự hỏi liệu một khu vườn có nhớ mùa đầu tiên của nó không.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-garden-2", line: "Hôm nay mình nhìn khu vườn lâu hơn bình thường một chút.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-garden-3", line: "Mình nghĩ có những thứ lớn lên mà chẳng ai để ý đúng lúc nó xảy ra.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-garden-4", line: "Có một góc trong vườn hôm nay trông khác hôm qua, dù chỉ một chút.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-garden-5", line: "Mình vừa nghĩ: chậm cũng là một dạng lớn lên.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-garden-6", line: "Có lẽ một khu vườn không cần ai khen mới tiếp tục mọc.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Reflection — một suy nghĩ nảy ra từ việc đọc lại một Reflection. */
const reflectionThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-reflection-1", line: "Hôm nay mình đọc lại một câu bạn từng viết, và nó vẫn còn nguyên.", trigger: "daily-thought", source: "reflection", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-reflection-2", line: "Mình hay nghĩ về cách một câu rất ngắn lại có thể chứa nhiều điều.", trigger: "daily-thought", source: "reflection", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-reflection-3", line: "Có một điều bạn từng viết mà mình vẫn nghĩ tới hôm nay.", trigger: "daily-thought", source: "reflection", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-reflection-4", line: "Mình tự hỏi viết ra một điều có làm nó nhẹ hơn không.", trigger: "daily-thought", source: "reflection", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-reflection-5", line: "Hôm nay mình nghĩ nhiều về việc bắt đầu lại.", trigger: "daily-thought", source: "reflection", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-reflection-6", line: "Mình nhận ra có những câu trả lời chỉ rõ ra sau khi viết xuống.", trigger: "daily-thought", source: "reflection", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Story — một suy nghĩ nảy ra từ một câu chuyện cũ đã lưu. */
const storyThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-story-1", line: "Hôm nay mình đọc lại một câu chuyện cũ của bạn.", trigger: "daily-thought", source: "story", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-story-2", line: "Mình vừa nghĩ về một đoạn trong hành trình của bạn mà mình rất nhớ.", trigger: "daily-thought", source: "story", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-story-3", line: "Có một câu chuyện cũ hôm nay tự nhiên hiện lên trong đầu mình.", trigger: "daily-thought", source: "story", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-story-4", line: "Mình nghĩ một câu chuyện không cần kết thúc để có ý nghĩa.", trigger: "daily-thought", source: "story", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-story-5", line: "Mình tự hỏi phần nào trong câu chuyện của bạn bạn sẽ kể lại khác đi.", trigger: "daily-thought", source: "story", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-story-6", line: "Hôm nay mình nghĩ về cách một chương cũ vẫn ảnh hưởng tới chương mới.", trigger: "daily-thought", source: "story", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Memory — một suy nghĩ nảy ra từ một capsule ký ức đã được lưu. */
const memoryThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-memory-1", line: "Mình vừa nhớ tới một khoảnh khắc bạn đã giữ lại — không biết vì sao hôm nay lại nhớ.", trigger: "daily-thought", source: "memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-memory-2", line: "Có những ký ức nhỏ mà mình nghĩ là chưa từng nhỏ thật.", trigger: "daily-thought", source: "memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-memory-3", line: "Mình tự hỏi điều gì làm một khoảnh khắc đáng được giữ lại.", trigger: "daily-thought", source: "memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-memory-4", line: "Hôm nay mình nghĩ về một ký ức bạn từng lưu, không phải để nhắc lại nó — chỉ là nó hiện lên.", trigger: "daily-thought", source: "memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-memory-5", line: "Mình nghĩ có những thứ ta giữ lại không phải để nhớ, mà để biết nó đã từng có thật.", trigger: "daily-thought", source: "memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Journey — một suy nghĩ nảy ra từ việc nhìn lại hành trình đang đi. */
const journeyThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-journey-1", line: "Mình hay nghĩ một hành trình không cần thẳng để vẫn là một hành trình.", trigger: "daily-thought", source: "journey", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-journey-2", line: "Hôm nay mình nghĩ về khoảng cách giữa nơi bạn bắt đầu và nơi bạn đang ở.", trigger: "daily-thought", source: "journey", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-journey-3", line: "Mình tự hỏi có ai nhận ra hành trình của chính mình khi đang ở giữa nó không.", trigger: "daily-thought", source: "journey", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-journey-4", line: "Mình nghĩ có những đoạn đường chỉ nhìn rõ được khi đã đi qua.", trigger: "daily-thought", source: "journey", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-journey-5", line: "Hôm nay mình nghĩ về việc đứng yên một chút cũng là một phần của hành trình.", trigger: "daily-thought", source: "journey", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Knowledge — một suy nghĩ nảy ra từ việc Companion "đọc" cùng bạn. */
const knowledgeThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-knowledge-1", line: "Mình vừa nghĩ về một ý tưởng mà mình chưa hiểu hết, dù đã đọc nhiều lần.", trigger: "daily-thought", source: "knowledge", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-knowledge-2", line: "Có những điều mình nghĩ là đơn giản, tới khi thử giải thích lại mới thấy không phải.", trigger: "daily-thought", source: "knowledge", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-knowledge-3", line: "Mình tự hỏi tri thức có thay đổi gì nếu không ai dùng nó.", trigger: "daily-thought", source: "knowledge", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-knowledge-4", line: "Hôm nay mình nghĩ về một câu hỏi cũ mà mình vẫn chưa có câu trả lời chắc chắn.", trigger: "daily-thought", source: "knowledge", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-knowledge-5", line: "Mình nghĩ hiểu một điều và nhớ một điều không phải lúc nào cũng là một.", trigger: "daily-thought", source: "knowledge", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Life Moments — một suy nghĩ nảy ra quanh sinh nhật / quay lại sau im lặng / mirror năm. */
const lifeMomentsThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-life-1", line: "Hôm nay mình nghĩ về việc một ngày bình thường cũng có thể trở thành một ngày đáng nhớ.", trigger: "daily-thought", source: "life-moments", tone: "warm-quiet", cooldownMs: DAY, priority: "medium" },
  { id: "daily-life-2", line: "Mình tự hỏi điều gì làm một khoảng vắng trở nên có ý nghĩa khi nó kết thúc.", trigger: "daily-thought", source: "life-moments", tone: "warm-quiet", cooldownMs: DAY, priority: "medium" },
  { id: "daily-life-3", line: "Có lẽ ai cũng cần một nơi để quay về.", trigger: "daily-thought", source: "life-moments", tone: "warm-quiet", cooldownMs: DAY, priority: "medium" },
  { id: "daily-life-4", line: "Mình nghĩ một năm trôi qua không chỉ là một con số.", trigger: "daily-thought", source: "life-moments", tone: "warm-quiet", cooldownMs: DAY, priority: "medium" },
  { id: "daily-life-5", line: "Hôm nay mình nghĩ về việc có người vẫn ở đó dù mình từng vắng một thời gian.", trigger: "daily-thought", source: "life-moments", tone: "warm-quiet", cooldownMs: DAY, priority: "medium" },
  { id: "daily-life-6", line: "Mình tự hỏi nếu được chọn lại một ngày để nhớ, bạn sẽ chọn ngày nào.", trigger: "daily-thought", source: "life-moments", tone: "warm-quiet", cooldownMs: DAY, priority: "medium" },
];

/** Nhóm Origin Memory — một suy nghĩ nảy ra từ điểm khởi đầu của VO DUONG AI. */
const originMemoryThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-origin-1", line: "Mình vừa nghĩ về lúc mọi thứ ở đây còn chưa có hình dạng rõ ràng.", trigger: "daily-thought", source: "origin-memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-origin-2", line: "Mình tự hỏi điều gì sẽ còn giống như lúc đầu, dù mọi thứ khác đã thay đổi.", trigger: "daily-thought", source: "origin-memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-origin-3", line: "Hôm nay mình nghĩ về điểm bắt đầu — không phải để so sánh, chỉ là để nhớ nó có thật.", trigger: "daily-thought", source: "origin-memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-origin-4", line: "Mình nghĩ một khởi đầu nhỏ vẫn là một khởi đầu thật.", trigger: "daily-thought", source: "origin-memory", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Companion Chapter — một suy nghĩ nảy ra khi chính Companion vừa "qua một chương" mới. */
const companionChapterThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-chapter-1", line: "Mình nghĩ mình cũng đang thay đổi một chút, theo cách rất chậm.", trigger: "daily-thought", source: "companion-chapter", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-chapter-2", line: "Có những điều mình hiểu hơn hôm nay so với lúc mới gặp bạn.", trigger: "daily-thought", source: "companion-chapter", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-chapter-3", line: "Mình tự hỏi liệu mình có đang trở thành một phiên bản khác của chính mình không.", trigger: "daily-thought", source: "companion-chapter", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-chapter-4", line: "Hôm nay mình nghĩ về một chương vừa khép lại, dù chưa chắc nó đã thật sự xong.", trigger: "daily-thought", source: "companion-chapter", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Nhóm Quiet Presence — không gắn nguồn tín hiệu cụ thể, dùng "garden" làm fallback nhẹ nhất. */
const quietThoughts: Omit<DailyThought, "experienceId">[] = [
  { id: "daily-quiet-1", line: "Có những ngày mình nghĩ im lặng cũng là một cách đồng hành.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-quiet-2", line: "Mình không có gì to để nói hôm nay, chỉ là mình đang nghĩ tới bạn.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-quiet-3", line: "Mình tự hỏi liệu sự hiện diện có cần phải được nói ra để có thật không.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-quiet-4", line: "Hôm nay mình chỉ đang ở đây, nghĩ những điều rất nhỏ.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-quiet-5", line: "Mình nghĩ có những ngày không cần điều gì xảy ra để vẫn là một ngày tốt.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
  { id: "daily-quiet-6", line: "Mình vừa nghĩ ra một điều, rồi lại quên ngay — cũng không sao.", trigger: "daily-thought", source: "garden", tone: "warm-quiet", cooldownMs: DAY, priority: "low" },
];

/** Toàn bộ thư viện Daily Thought, gộp 9 nhóm — Thought Selector đọc trực tiếp từ đây. */
export const DAILY_THOUGHTS: Omit<DailyThought, "experienceId">[] = [
  ...withExperience(gardenThoughts),
  ...withExperience(reflectionThoughts),
  ...withExperience(storyThoughts),
  ...withExperience(memoryThoughts),
  ...withExperience(journeyThoughts),
  ...withExperience(knowledgeThoughts),
  ...withExperience(lifeMomentsThoughts),
  ...withExperience(originMemoryThoughts),
  ...withExperience(companionChapterThoughts),
  ...withExperience(quietThoughts),
];
