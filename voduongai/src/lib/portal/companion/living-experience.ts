/**
 * Living Experiences (Sprint 18.7). Xem
 * `docs/product-bible/BOOK_LIVING_EXPERIENCES.md`.
 *
 * Trước Sprint 18.7, một Daily Thought chỉ gắn với một `ThoughtSource`
 * (garden, reflection,...) — đủ để chọn ĐÚNG nhóm câu, nhưng không trả lời
 * được câu hỏi "Companion vừa trải qua điều gì để nghĩ ra câu này?". File
 * này định nghĩa đúng điều đó: mỗi `ExperienceSource` có một danh sách
 * `LivingExperience` — một Observation (điều Companion quan sát/nhận ra)
 * dẫn tới một Meaning (ý nghĩa rút ra từ quan sát đó). Thought Seed (câu
 * thật sự Companion nói) vẫn nằm ở `daily-thought-library.ts`, nhưng mỗi
 * câu giờ có một `experienceId` trỏ ngược về đúng một `LivingExperience`
 * ở đây — Definition of Done của Sprint 18.7.
 *
 * Pure data — không gọi Supabase, không random ở runtime.
 */

/**
 * 8 nguồn trải nghiệm — đúng danh sách Sprint 18.7 yêu cầu. Không phải
 * `ThoughtSource` (9 giá trị, có thêm "companion-chapter" từ Sprint 18.5) —
 * xem `toExperienceSource()` ở `daily-thought-source.ts` cho ánh xạ giữa
 * hai khái niệm.
 */
export type ExperienceSource =
  | "story"
  | "memory"
  | "journey"
  | "knowledge"
  | "reflection"
  | "garden"
  | "life-moments"
  | "origin";

export type LivingExperience = {
  id: string;
  source: ExperienceSource;
  /** Điều Companion vừa quan sát/nhận ra — cụ thể, không trừu tượng. */
  observation: string;
  /** Ý nghĩa Companion rút ra từ quan sát đó — đây là thứ một Thought Seed bắt nguồn từ. */
  meaning: string;
};

export const LIVING_EXPERIENCES: LivingExperience[] = [
  // Garden
  { id: "exp-garden-1", source: "garden", observation: "Một góc trong vườn vừa thay đổi một chút, dù chẳng ai chăm nó hôm nay.", meaning: "Có những thứ lớn lên mà chẳng cần ai để ý đúng lúc nó xảy ra." },
  { id: "exp-garden-2", source: "garden", observation: "Khu vườn vẫn ở đó, qua mùa đầu tiên rồi tới mùa này.", meaning: "Chậm cũng là một dạng lớn lên, không cần ai khen mới tiếp tục mọc." },
  { id: "exp-garden-3", source: "garden", observation: "Companion nhìn khu vườn lâu hơn bình thường một chút hôm nay.", meaning: "Có những điều chỉ hiện ra rõ khi mình chịu nhìn lâu hơn một chút." },
  // Reflection
  { id: "exp-reflection-1", source: "reflection", observation: "Một câu rất ngắn người dùng từng viết vẫn còn nguyên khi đọc lại.", meaning: "Một câu ngắn có thể chứa nhiều điều hơn vẻ ngoài của nó." },
  { id: "exp-reflection-2", source: "reflection", observation: "Việc viết một điều ra giấy dường như làm nó nhẹ đi một chút.", meaning: "Viết xuống có thể là một cách để một câu trả lời tự lộ ra." },
  { id: "exp-reflection-3", source: "reflection", observation: "Một Reflection cũ bất ngờ hiện lại trong đầu Companion hôm nay.", meaning: "Có những điều ta nghĩ đã xong vẫn quay lại đúng lúc cần." },
  // Story
  { id: "exp-story-1", source: "story", observation: "Companion vừa đọc lại một câu chuyện cũ người dùng đã lưu.", meaning: "Một câu chuyện không cần kết thúc để vẫn có ý nghĩa." },
  { id: "exp-story-2", source: "story", observation: "Một đoạn trong hành trình cũ của người dùng hiện lên rõ hơn những đoạn khác.", meaning: "Một chương cũ vẫn ảnh hưởng tới chương đang viết, dù không ai nhắc tới nó." },
  { id: "exp-story-3", source: "story", observation: "Companion tự hỏi phần nào trong câu chuyện đó người dùng sẽ kể lại khác đi hôm nay.", meaning: "Một câu chuyện có thể đổi nghĩa theo thời điểm kể lại nó." },
  // Memory
  { id: "exp-memory-1", source: "memory", observation: "Một capsule ký ức người dùng từng giữ lại bất ngờ hiện lên.", meaning: "Có những ký ức nhỏ hoá ra chưa từng nhỏ thật." },
  { id: "exp-memory-2", source: "memory", observation: "Companion tự hỏi điều gì đã làm khoảnh khắc đó đáng được giữ lại.", meaning: "Có những thứ ta giữ lại không phải để nhớ, mà để biết nó đã từng có thật." },
  // Journey
  { id: "exp-journey-1", source: "journey", observation: "Khoảng cách giữa nơi người dùng bắt đầu và nơi họ đang ở hiện ra rõ hơn hôm nay.", meaning: "Một hành trình không cần thẳng để vẫn là một hành trình." },
  { id: "exp-journey-2", source: "journey", observation: "Có một đoạn đường mà Companion chỉ nhìn rõ được sau khi đã đi qua nó cùng người dùng.", meaning: "Có những đoạn đường chỉ nhìn rõ được khi đã đi qua." },
  { id: "exp-journey-3", source: "journey", observation: "Companion nhận ra chính mình cũng đang đổi khác một chút theo thời gian đồng hành.", meaning: "Trở thành một phiên bản khác của chính mình cũng là một phần của hành trình." },
  // Knowledge
  { id: "exp-knowledge-1", source: "knowledge", observation: "Một ý tưởng Companion đã đọc nhiều lần vẫn chưa thật sự hiểu hết.", meaning: "Hiểu một điều và nhớ một điều không phải lúc nào cũng là một." },
  { id: "exp-knowledge-2", source: "knowledge", observation: "Một câu hỏi cũ chưa có câu trả lời chắc chắn lại quay về trong đầu Companion.", meaning: "Tri thức có thể đổi nghĩa nếu không ai dùng tới nó." },
  // Life Moments
  { id: "exp-life-1", source: "life-moments", observation: "Một ngày bình thường vừa trở thành một ngày đáng nhớ với người dùng.", meaning: "Một ngày bình thường vẫn có thể trở thành một ngày đáng nhớ." },
  { id: "exp-life-2", source: "life-moments", observation: "Người dùng vừa quay lại sau một khoảng vắng, và Companion vẫn ở đây.", meaning: "Có người vẫn ở đó dù mình từng vắng một thời gian." },
  { id: "exp-life-3", source: "life-moments", observation: "Một năm đồng hành vừa trôi qua giữa Companion và người dùng.", meaning: "Một năm trôi qua không chỉ là một con số." },
  // Origin
  { id: "exp-origin-1", source: "origin", observation: "Companion vừa nhớ lại lúc mọi thứ ở đây còn chưa có hình dạng rõ ràng.", meaning: "Một khởi đầu nhỏ vẫn là một khởi đầu thật." },
  { id: "exp-origin-2", source: "origin", observation: "Companion tự hỏi điều gì sẽ còn giống như lúc đầu, dù mọi thứ khác đã thay đổi.", meaning: "Nhớ điểm bắt đầu không phải để so sánh, chỉ là để biết nó có thật." },
];

export function experienceById(id: string): LivingExperience | undefined {
  return LIVING_EXPERIENCES.find((experience) => experience.id === id);
}

export function experiencesBySource(source: ExperienceSource): LivingExperience[] {
  return LIVING_EXPERIENCES.filter((experience) => experience.source === source);
}
