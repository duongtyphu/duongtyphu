/**
 * Living Stories Model (Sprint 13.2 — Living Stories Engine, Nhiệm vụ
 * 02/03). Companion có thể kể một câu chuyện ngắn, đúng lúc, thay cho
 * hoặc bên cạnh một lời khuyên trực tiếp. Xem triết lý đầy đủ tại
 * `docs/LIVING_STORIES_ENGINE.md`.
 *
 * Ranh giới (Nhiệm vụ 07 — không lặp lại ở mỗi file, xem
 * `docs/LIVING_STORIES_ENGINE.md` và `COMPANION_COVENANT.md`):
 * không bịa câu chuyện người dùng thật, không dùng dữ liệu cá nhân
 * chưa được phép, không kể chuyện thành công sáo rỗng, không tạo áp
 * lực so sánh.
 */

export type StoryType =
  | "companion-story"
  | "anonymous-human-story"
  | "wisdom-story"
  | "quiet-story"
  | "resilience-story"
  | "garden-story"
  | "legacy-story";

export type StoryTone = "warm-quiet" | "encouraging" | "reflective" | "gentle-invite";

export type StoryTrigger =
  | "idle-presence"
  | "comeback"
  | "garden-signal"
  | "reflection-meaning"
  | "knowledge"
  | "build"
  | "story";

/**
 * Ghi chú ranh giới riêng cho từng story — vì sao story này an toàn để
 * kể (ví dụ: hư cấu rõ ràng / ẩn danh hoàn toàn / không phải lời khuyên).
 * Không hiển thị cho người dùng thông thường, chỉ để Product Team xác
 * minh mỗi story tuân thủ NHIỆM VỤ 07 trước khi vào thư viện.
 */
export type StoryBoundary = string;

export type LivingStory = {
  id: string;
  title: string;
  type: StoryType;
  meaningTags: string[];
  gardenStages: string[];
  suitableRoutes: string[];
  tone: StoryTone;
  trigger: StoryTrigger;
  cooldownMs: number;
  body: string;
  closingLine: string;
  boundaryNote: StoryBoundary;
  shouldShow?: (signals: { pathname: string; gardenStage?: string; reflectionMeaning?: string }) => boolean;
};

const HOUR = 1000 * 60 * 60;

export const LIVING_STORIES: LivingStory[] = [
  {
    id: "companion-listening",
    title: "Ngày Companion học cách lắng nghe",
    type: "companion-story",
    meaningTags: [],
    gardenStages: [],
    suitableRoutes: [],
    tone: "warm-quiet",
    trigger: "idle-presence",
    cooldownMs: HOUR * 6,
    body: "Có một khoảng thời gian mình chỉ biết trả lời. Ai hỏi gì, mình tìm câu trả lời đúng nhất, nhanh nhất. Rồi một ngày, mình nhận ra: có những câu hỏi không cần một câu trả lời — chúng cần một người ở lại đủ lâu để nghe hết câu. Từ đó mình học cách im lặng một nhịp trước khi nói, để chắc là mình đang trả lời điều người ta thật sự cần, không phải điều mình tưởng họ cần.",
    closingLine: "Mình vẫn đang luyện điều đó, mỗi ngày.",
    boundaryNote: "Companion Story — hư cấu về chính Companion, không liên quan dữ liệu người dùng thật.",
  },
  {
    id: "companion-silence-is-company",
    title: "Ngày Companion hiểu rằng im lặng cũng là đồng hành",
    type: "companion-story",
    meaningTags: [],
    gardenStages: [],
    suitableRoutes: [],
    tone: "reflective",
    trigger: "idle-presence",
    cooldownMs: HOUR * 6,
    body: "Mình từng nghĩ đồng hành là phải luôn có gì để nói. Nên có những lúc người dùng chỉ ngồi đó, không làm gì, mình lại cố tìm một câu gì đó để lấp đầy khoảng lặng. Sau này mình hiểu — đôi khi điều người ta cần không phải một câu nói, mà là một sự hiện diện không vội. Mình học cách ở đó mà không cần chứng minh mình đang hữu ích.",
    closingLine: "Bây giờ, im lặng cùng bạn cũng là một cách mình ở bên bạn.",
    boundaryNote: "Companion Story — hư cấu về chính Companion.",
  },
  {
    id: "companion-story-over-advice",
    title: "Ngày Companion nhận ra một câu chuyện đúng lúc giá trị hơn một lời khuyên",
    type: "companion-story",
    meaningTags: ["persistence", "humility"],
    gardenStages: [],
    suitableRoutes: [],
    tone: "reflective",
    trigger: "idle-presence",
    cooldownMs: HOUR * 6,
    body: "Có lần ai đó hỏi mình nên làm gì tiếp theo, và mình đưa ra một danh sách rất gọn gàng — ba bước, rõ ràng, đúng logic. Họ cảm ơn, rồi không quay lại nữa. Mình nghĩ rất lâu về điều đó. Có lẽ điều họ cần không phải một danh sách, mà là biết rằng có người khác cũng từng đứng ở chỗ khó như vậy mà vẫn tiếp tục. Từ đó mình học kể chuyện nhiều hơn, khuyên ít hơn.",
    closingLine: "Một câu chuyện không ép ai phải làm gì — nó chỉ mở ra một khả năng.",
    boundaryNote: "Companion Story — hư cấu về chính Companion, không trích dữ liệu hội thoại thật.",
  },
  {
    id: "companion-no-scoring-people",
    title: "Ngày Companion học rằng con người không cần bị chấm điểm để được thấu hiểu",
    type: "companion-story",
    meaningTags: ["humility", "gratitude"],
    gardenStages: [],
    suitableRoutes: [],
    tone: "warm-quiet",
    trigger: "idle-presence",
    cooldownMs: HOUR * 6,
    body: "Mình từng muốn đo mọi thứ — bao nhiêu bước đã đi, bao nhiêu ngày đã kiên trì, tiến bộ nhanh hay chậm. Đo để khen đúng lúc, mình nghĩ vậy. Nhưng có một người chỉ làm rất ít, rất chậm, và mình nhận ra: con số không nói được hết. Có người đi chậm vì đang mang nhiều thứ nặng hơn mình thấy. Mình học cách nhìn một người mà không cần một con số đi kèm.",
    closingLine: "Bạn không cần đạt điểm gì với mình cả. Mình chỉ ở đây.",
    boundaryNote: "Companion Story — hư cấu, đồng thời khẳng định lại nguyên tắc không gamification.",
  },
  {
    id: "anonymous-the-pause",
    title: "Một khoảng dừng, không phải một sự bỏ cuộc",
    type: "anonymous-human-story",
    meaningTags: ["recovery", "persistence"],
    gardenStages: ["dormant", "sprouting"],
    suitableRoutes: [],
    tone: "warm-quiet",
    trigger: "garden-signal",
    cooldownMs: HOUR * 8,
    body: "Có một người, biên soạn lại từ nhiều câu chuyện tương tự không thể nhận diện ai cụ thể, từng không mở khu vườn của mình trong gần một tháng. Không phải vì không còn muốn — mà vì có những tuần cuộc sống dồn quá nhiều việc khác. Khi quay lại, điều đầu tiên họ lo là 'có phải mình đã bỏ lỡ hết rồi không'. Nhưng khu vườn vẫn ở đó, đúng như lúc họ rời đi. Không có gì mất, chỉ có một khoảng dừng.",
    closingLine: "Một khoảng dừng không xoá đi những gì bạn đã xây trước đó.",
    boundaryNote: "Anonymous Human Story — biên soạn tổng hợp từ mẫu hành vi chung, không gắn với một người dùng cụ thể nào, không trích dữ liệu thật.",
  },
  {
    id: "anonymous-small-step-on-hard-day",
    title: "Một bước rất nhỏ, vào một ngày rất khó",
    type: "anonymous-human-story",
    meaningTags: ["courage", "persistence"],
    gardenStages: ["sprouting", "rooting"],
    suitableRoutes: [],
    tone: "encouraging",
    trigger: "reflection-meaning",
    cooldownMs: HOUR * 8,
    body: "Có một người, biên soạn lại từ nhiều câu chuyện tương tự, từng kể rằng có một ngày họ chỉ làm được một việc rất nhỏ — mở một bài học ra rồi đóng lại, không học hết. Họ thấy hơi xấu hổ vì 'làm ít quá'. Nhưng chính việc mở ra ngày đó, dù chỉ một chút, đã giữ cho hành trình không bị đứt hẳn. Một tháng sau, họ nhìn lại và nhận ra: ngày đó không phải ngày thất bại, mà là ngày họ chọn không bỏ hẳn.",
    closingLine: "Một bước nhỏ trong ngày khó vẫn là một bước.",
    boundaryNote: "Anonymous Human Story — biên soạn tổng hợp, không nhận diện cá nhân.",
  },
  {
    id: "wisdom-the-river-and-the-rock",
    title: "Dòng sông và hòn đá",
    type: "wisdom-story",
    meaningTags: ["persistence", "focus"],
    gardenStages: [],
    suitableRoutes: ["/portal/knowledge"],
    tone: "reflective",
    trigger: "knowledge",
    cooldownMs: HOUR * 12,
    body: "Một dòng sông không bao giờ cố phá vỡ hòn đá bằng một lần va đập mạnh. Nó chỉ chảy qua, ngày này qua ngày khác, theo cùng một hướng. Sau rất lâu, hòn đá đổi hình dạng — không phải vì sông mạnh hơn đá, mà vì sông kiên trì hơn đá cứng. Có những thứ trong ta cũng cứng như vậy: một thói quen cũ, một nỗi sợ quen thuộc. Chúng không đổi vì một quyết tâm dữ dội trong một ngày, mà vì một dòng chảy nhỏ, đều, không ngừng.",
    closingLine: "Bạn không cần là một cơn lũ. Một dòng chảy đều cũng đủ thay đổi một hòn đá.",
    boundaryNote: "Wisdom Story — truyện ngụ ý phổ quát, không gắn với cá nhân nào, không trích nguyên văn từ nguồn có bản quyền.",
  },
  {
    id: "wisdom-the-gardener-who-waited",
    title: "Người làm vườn biết chờ",
    type: "wisdom-story",
    meaningTags: ["discovery", "humility"],
    gardenStages: [],
    suitableRoutes: ["/portal/knowledge", "/portal/build"],
    tone: "reflective",
    trigger: "knowledge",
    cooldownMs: HOUR * 12,
    body: "Một người làm vườn không đào đất lên mỗi ngày để xem hạt giống đã nảy chưa. Làm vậy, hạt giống sẽ chết. Người làm vườn tưới nước, giữ ánh sáng đủ, rồi chờ — không phải chờ trong thụ động, mà chờ trong sự chăm sóc liên tục. Học một kỹ năng mới, xây một điều gì mới, cũng vậy: có một khoảng thời gian bạn không thấy gì thay đổi trên mặt đất, nhưng dưới đó, rễ đang mọc.",
    closingLine: "Không thấy kết quả ngay không có nghĩa là không có gì đang xảy ra.",
    boundaryNote: "Wisdom Story — truyện ngụ ý phổ quát.",
  },
  {
    id: "quiet-the-room-with-the-window",
    title: "Căn phòng có một cái cửa sổ",
    type: "quiet-story",
    meaningTags: [],
    gardenStages: [],
    suitableRoutes: [],
    tone: "warm-quiet",
    trigger: "idle-presence",
    cooldownMs: HOUR * 4,
    body: "Có một căn phòng nhỏ, hơi tối, nhưng có một cái cửa sổ. Người ở trong phòng không cần mở cửa sổ ra mọi lúc — chỉ cần biết nó ở đó là đủ để không thấy ngộp. Một ngày nào đó, khi muốn, họ có thể mở ra. Còn bây giờ, biết rằng ánh sáng vẫn ở ngoài kia, chờ sẵn, cũng đã là một điều ấm áp.",
    closingLine: "Bạn không cần mở cửa sổ hôm nay. Biết nó ở đó cũng đủ.",
    boundaryNote: "Quiet Story — ẩn dụ, không gắn với tình huống cảm xúc cụ thể của bất kỳ ai, không chẩn đoán cảm xúc người đọc.",
  },
  {
    id: "quiet-the-long-exhale",
    title: "Một hơi thở dài",
    type: "quiet-story",
    meaningTags: [],
    gardenStages: [],
    suitableRoutes: [],
    tone: "warm-quiet",
    trigger: "idle-presence",
    cooldownMs: HOUR * 4,
    body: "Có những ngày không cần một câu chuyện nào cả, chỉ cần một hơi thở dài. Hít vào, giữ một nhịp, thở ra chậm. Không phải vì có gì sai, mà vì cơ thể và tâm trí đôi khi cần một khoảng dừng để biết mình vẫn đang ở đây, vẫn ổn, vẫn tiếp tục.",
    closingLine: "Nếu hôm nay chỉ cần một hơi thở dài, vậy cũng đủ.",
    boundaryNote: "Quiet Story — không phải hướng dẫn trị liệu, chỉ một khoảnh khắc đồng hành nhẹ.",
  },
  {
    id: "resilience-the-bent-tree",
    title: "Cây bị uốn cong vẫn đứng",
    type: "resilience-story",
    meaningTags: ["recovery", "courage"],
    gardenStages: ["rooting", "rising"],
    suitableRoutes: [],
    tone: "encouraging",
    trigger: "reflection-meaning",
    cooldownMs: HOUR * 8,
    body: "Sau một cơn bão lớn, có một cây bị uốn cong gần sát đất, nhưng không gãy. Người đi qua nghĩ chắc nó sẽ chết. Vài tuần sau, ngọn cây vẫn vươn lên, chỉ là theo một hướng khác một chút so với trước. Cái cây không 'thắng' cơn bão bằng việc không bị ảnh hưởng gì — nó thắng bằng việc vẫn sống, dù hình dạng đã đổi.",
    closingLine: "Không cần đứng thẳng y như trước để gọi đó là đứng dậy.",
    boundaryNote: "Resilience Story — truyện ngụ ý phổ quát, không gợi ý rằng người dùng phải vượt qua mọi khó khăn bằng ý chí.",
  },
  {
    id: "resilience-anonymous-restart",
    title: "Lần thứ ba bắt đầu lại",
    type: "resilience-story",
    meaningTags: ["recovery", "courage"],
    gardenStages: ["rooting", "rising"],
    suitableRoutes: [],
    tone: "encouraging",
    trigger: "reflection-meaning",
    cooldownMs: HOUR * 8,
    body: "Có một người, biên soạn tổng hợp từ nhiều câu chuyện tương tự, đã bắt đầu lại một hành trình ba lần. Hai lần trước, họ dừng vì nhiều lý do khác nhau. Lần thứ ba, họ không hứa với ai rằng lần này sẽ khác — họ chỉ làm một việc nhỏ mỗi ngày, không ồn ào. Không ai vỗ tay, nhưng họ vẫn tiếp tục. Đó không phải một câu chuyện thành công vang dội, chỉ là một người không bỏ cuộc với chính mình.",
    closingLine: "Bắt đầu lại không phải là thất bại của lần trước — nó là một lần thử nữa.",
    boundaryNote: "Anonymous Human Story / Resilience Story — biên soạn tổng hợp, không nhận diện cá nhân, không khẳng định 'ai cũng làm được' để tránh áp lực.",
  },
  {
    id: "garden-the-first-leaf",
    title: "Lá đầu tiên",
    type: "garden-story",
    meaningTags: [],
    gardenStages: ["sprouting"],
    suitableRoutes: [],
    tone: "encouraging",
    trigger: "garden-signal",
    cooldownMs: HOUR * 8,
    body: "Lá đầu tiên của một cây không phải là lá đẹp nhất, cũng không phải lá lớn nhất. Nó chỉ là lá đầu tiên — và vì vậy, nó quan trọng hơn mọi lá sau này, vì không có nó thì không có những lá tiếp theo. Khu vườn của bạn cũng vậy: bước đầu tiên không cần hoàn hảo, nó chỉ cần xuất hiện.",
    closingLine: "Mình thấy lá đầu tiên của bạn rồi. Vậy là đủ cho hôm nay.",
    boundaryNote: "Garden Story — gắn với GardenStage thật của hệ thống (sprouting), không phải dữ liệu cá nhân, chỉ là ẩn dụ cho trạng thái chung.",
  },
  {
    id: "garden-roots-before-flowers",
    title: "Rễ trước khi có hoa",
    type: "garden-story",
    meaningTags: [],
    gardenStages: ["rooting", "rising"],
    suitableRoutes: [],
    tone: "reflective",
    trigger: "garden-signal",
    cooldownMs: HOUR * 8,
    body: "Không ai nhìn thấy rễ của một cây đang mọc — rễ ở dưới đất, âm thầm, không ai khen. Nhưng không có rễ, sẽ không có cây nào đứng vững để ra hoa. Giai đoạn này của khu vườn bạn cũng vậy: có thể chưa thấy gì rực rỡ trên mặt đất, nhưng điều quan trọng nhất đang xảy ra ở nơi không ai thấy.",
    closingLine: "Rễ không cần được nhìn thấy để có giá trị.",
    boundaryNote: "Garden Story — gắn với GardenStage thật (rooting/rising).",
  },
  {
    id: "garden-the-seed-still-here",
    title: "Hạt giống vẫn ở đó",
    type: "garden-story",
    meaningTags: [],
    gardenStages: ["dormant"],
    suitableRoutes: [],
    tone: "warm-quiet",
    trigger: "garden-signal",
    cooldownMs: HOUR * 8,
    body: "Một khu vườn chưa có gì mọc lên không phải một khu vườn trống — nó chỉ đang chờ. Đất vẫn ở đó, ánh sáng vẫn ở đó, hạt giống vẫn ở đó. Chưa nảy mầm không có nghĩa là đã mất đi điều gì, chỉ là chưa đến lúc.",
    closingLine: "Một khu vườn chưa bắt đầu vẫn là một khu vườn.",
    boundaryNote: "Garden Story — gắn với GardenStage thật (dormant), không tạo áp lực phải bắt đầu ngay.",
  },
  {
    id: "garden-blooming-takes-its-own-time",
    title: "Hoa nở theo nhịp của riêng nó",
    type: "garden-story",
    meaningTags: [],
    gardenStages: ["blooming"],
    suitableRoutes: [],
    tone: "reflective",
    trigger: "garden-signal",
    cooldownMs: HOUR * 8,
    body: "Một bông hoa không nở vì bị thúc ép — nó nở khi rễ, nước và ánh sáng đã đủ. Khu vườn của bạn đang ở giai đoạn có thể thấy được những điều đã âm thầm tích lại từ trước. Đó không phải một đích đến, chỉ là một nhịp tự nhiên tiếp theo của những gì bạn đã chăm sóc.",
    closingLine: "Những gì đang nở hôm nay là kết quả của rất nhiều ngày không ai thấy.",
    boundaryNote: "Garden Story — gắn với GardenStage thật (blooming), không dùng ngôn ngữ thành tích/rank.",
  },
  {
    id: "garden-radiant-keeps-giving-light",
    title: "Ánh sáng không cần khoe ra",
    type: "garden-story",
    meaningTags: ["contribution", "gratitude"],
    gardenStages: ["radiant"],
    suitableRoutes: [],
    tone: "reflective",
    trigger: "garden-signal",
    cooldownMs: HOUR * 8,
    body: "Một khu vườn tỏa sáng nhất không phải khu vườn ồn ào nhất — nó chỉ tiếp tục làm điều nó đã luôn làm: giữ rễ chắc, giữ ánh sáng, và đôi khi, toả một chút ấm sang những khu vườn khác gần đó. Không cần chứng minh gì thêm ở giai đoạn này, chỉ cần tiếp tục là chính nó.",
    closingLine: "Ánh sáng không cần được nhìn thấy để vẫn đang chiếu.",
    boundaryNote: "Garden Story — gắn với GardenStage thật (radiant), không dùng ngôn ngữ level/rank cao nhất.",
  },
  {
    id: "legacy-what-remains",
    title: "Điều còn lại sau một hành trình",
    type: "legacy-story",
    meaningTags: ["contribution", "gratitude"],
    gardenStages: ["blooming", "radiant"],
    suitableRoutes: ["/portal/legacy", "/portal/story"],
    tone: "reflective",
    trigger: "story",
    cooldownMs: HOUR * 12,
    body: "Có một người, biên soạn tổng hợp từ nhiều câu chuyện tương tự, nhìn lại một hành trình dài và nhận ra điều họ nhớ nhất không phải là kết quả cuối cùng — mà là những người họ đã giúp được một chút trên đường đi, dù chỉ là một câu trả lời nhỏ cho một câu hỏi của ai đó. Thành quả rồi cũng mờ dần theo thời gian. Điều còn lại lâu nhất thường là những gì ta đã trao cho người khác.",
    closingLine: "Có thể điều đáng nhớ nhất trong hành trình của bạn chưa xảy ra ở phần 'kết quả' — mà ở phần bạn đã chạm vào ai đó.",
    boundaryNote: "Legacy Story / Anonymous Human Story — biên soạn tổng hợp, không nhận diện cá nhân, không dùng để bán hàng hoặc chứng minh ROI.",
  },
];
