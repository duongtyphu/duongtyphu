// ============================================================
// Không gian AI — Seed Data
// Dữ liệu nền cho khu vực AI Workspace của VO DUONG AI Portal
// ============================================================

// ─────────────────────────────────────────────
// 1. AiNeedCategory
// ─────────────────────────────────────────────

export type AiNeedCategory = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  color: string; // tailwind color name, e.g. "blue"
  subtasks: string[];
  recommendedToolSlugs: string[];
  relatedArticleSlugs: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const NEED_CATEGORIES: AiNeedCategory[] = [
  {
    slug: "viet-noi-dung",
    title: "Viết nội dung",
    description:
      "Dùng AI để tạo bài viết, email, caption, landing page và mọi loại nội dung văn bản nhanh hơn gấp 5-10 lần so với viết tay.",
    emoji: "✍️",
    color: "blue",
    subtasks: [
      "Viết bài Facebook",
      "Viết Blog",
      "Viết Email",
      "Viết Landing Page",
      "Viết SEO",
      "Viết kịch bản",
    ],
    recommendedToolSlugs: ["chatgpt", "claude", "gemini"],
    relatedArticleSlugs: [
      "quy-trinh-dung-ai-viet-bai-facebook",
      "cach-dung-claude-viet-noi-dung-dai",
      "10-prompt-co-ban-cho-nguoi-moi",
    ],
    ctaLabel: "Xem Prompt mẫu",
    ctaHref: "/khong-gian-ai/prompts?need=viet-noi-dung",
  },
  {
    slug: "thiet-ke-hinh-anh",
    title: "Thiết kế hình ảnh",
    description:
      "Tạo banner, thumbnail, poster và infographic chuyên nghiệp bằng AI mà không cần kỹ năng thiết kế chuyên sâu.",
    emoji: "🎨",
    color: "purple",
    subtasks: [
      "Tạo banner mạng xã hội",
      "Tạo thumbnail YouTube",
      "Tạo poster sự kiện",
      "Tạo infographic",
    ],
    recommendedToolSlugs: ["canva-ai", "midjourney"],
    relatedArticleSlugs: ["ai-image-la-gi-nen-bat-dau-voi-cong-cu-nao"],
    ctaLabel: "Khám phá công cụ",
    ctaHref: "/khong-gian-ai/cong-cu?need=thiet-ke-hinh-anh",
  },
  {
    slug: "lam-video",
    title: "Làm video",
    description:
      "AI hỗ trợ toàn bộ quy trình sản xuất video: từ viết kịch bản, dựng clip, thêm voiceover cho đến tạo short video viral.",
    emoji: "🎬",
    color: "red",
    subtasks: [
      "Viết kịch bản video",
      "Chỉnh sửa video AI",
      "Tạo voiceover tự động",
      "Tạo short video",
    ],
    recommendedToolSlugs: ["runway", "capcut-ai"],
    relatedArticleSlugs: [],
    ctaLabel: "Xem hướng dẫn",
    ctaHref: "/khong-gian-ai/prompts?need=lam-video",
  },
  {
    slug: "lap-trinh",
    title: "Lập trình",
    description:
      "Viết code nhanh hơn, debug thông minh hơn và review pull request tự động với sự hỗ trợ của AI.",
    emoji: "💻",
    color: "green",
    subtasks: [
      "Viết code tự động",
      "Debug lỗi",
      "Đánh giá code",
      "Tạo API",
    ],
    recommendedToolSlugs: ["cursor", "chatgpt", "claude"],
    relatedArticleSlugs: ["cach-dung-cursor-cho-nguoi-moi-hoc-lap-trinh"],
    ctaLabel: "Xem Prompt mẫu",
    ctaHref: "/khong-gian-ai/prompts?need=lap-trinh",
  },
  {
    slug: "marketing",
    title: "Marketing",
    description:
      "Lên chiến lược, phân tích đối thủ và tạo nội dung quảng cáo hiệu quả với AI — tiết kiệm chi phí thuê agency.",
    emoji: "📣",
    color: "orange",
    subtasks: [
      "Lên chiến lược marketing",
      "Tạo content quảng cáo",
      "Phân tích đối thủ",
      "Viết email marketing",
    ],
    recommendedToolSlugs: ["chatgpt", "perplexity", "gemini"],
    relatedArticleSlugs: [
      "ung-dung-ai-trong-affiliate-marketing",
      "quy-trinh-dung-ai-viet-bai-facebook",
    ],
    ctaLabel: "Xem Prompt mẫu",
    ctaHref: "/khong-gian-ai/prompts?need=marketing",
  },
  {
    slug: "tu-dong-hoa",
    title: "Tự động hóa",
    description:
      "Kết nối các ứng dụng, xây dựng workflow tự động và lên lịch đăng bài không cần can thiệp thủ công.",
    emoji: "⚙️",
    color: "slate",
    subtasks: [
      "Kết nối ứng dụng",
      "Tạo workflow tự động",
      "Auto-posting nội dung",
      "Tự động hóa email",
    ],
    recommendedToolSlugs: ["n8n", "make"],
    relatedArticleSlugs: ["tu-dong-hoa-cong-viec-voi-n8n-la-gi"],
    ctaLabel: "Khám phá công cụ",
    ctaHref: "/khong-gian-ai/cong-cu?need=tu-dong-hoa",
  },
  {
    slug: "phan-tich-du-lieu",
    title: "Phân tích dữ liệu",
    description:
      "Đưa số liệu thô vào AI và nhận ngay báo cáo phân tích, insight và khuyến nghị hành động trong vài phút.",
    emoji: "📊",
    color: "cyan",
    subtasks: [
      "Đọc và tóm tắt báo cáo",
      "Phân tích số liệu bán hàng",
      "Tạo insight từ dữ liệu",
      "Vẽ biểu đồ giải thích",
    ],
    recommendedToolSlugs: ["chatgpt", "perplexity"],
    relatedArticleSlugs: ["cach-dung-ai-phan-tich-du-lieu-co-ban"],
    ctaLabel: "Xem Prompt mẫu",
    ctaHref: "/khong-gian-ai/prompts?need=phan-tich-du-lieu",
  },
  {
    slug: "dich-thuat",
    title: "Dịch thuật",
    description:
      "Dịch văn bản, tài liệu kỹ thuật và trang web sang nhiều ngôn ngữ với chất lượng tự nhiên, giữ nguyên ngữ cảnh.",
    emoji: "🌐",
    color: "teal",
    subtasks: [
      "Dịch văn bản thông thường",
      "Dịch tài liệu kỹ thuật",
      "Dịch đa ngôn ngữ",
      "Bản địa hóa nội dung",
    ],
    recommendedToolSlugs: ["chatgpt", "gemini", "deepl-ai"],
    relatedArticleSlugs: [],
    ctaLabel: "Xem Prompt mẫu",
    ctaHref: "/khong-gian-ai/prompts?need=dich-thuat",
  },
  {
    slug: "nghien-cuu",
    title: "Nghiên cứu",
    description:
      "Tìm kiếm, tổng hợp và kiểm chứng thông tin từ nhiều nguồn nhanh hơn gấp 10 lần so với tìm kiếm thủ công.",
    emoji: "🔍",
    color: "indigo",
    subtasks: [
      "Tìm kiếm thông tin",
      "Tổng hợp nhiều nguồn",
      "Fact-check thông tin",
      "Nghiên cứu đối thủ",
    ],
    recommendedToolSlugs: ["perplexity", "chatgpt"],
    relatedArticleSlugs: [
      "cach-dung-perplexity-nghien-cuu-nhanh-hon",
      "lo-trinh-hoc-ai-cho-nguoi-moi",
    ],
    ctaLabel: "Xem Prompt mẫu",
    ctaHref: "/khong-gian-ai/prompts?need=nghien-cuu",
  },
];

// ─────────────────────────────────────────────
// 2. AiProfessionGroup
// ─────────────────────────────────────────────

export type AiProfessionGroup = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  popularNeedSlugs: string[];
  recommendedToolSlugs: string[];
  relatedArticleSlugs: string[];
  companionMessage: string;
  skillGroups: string[];
  sampleArticles: string[];
  samplePrompts: string[];
  sampleChecklists?: string[];
  sampleTemplates?: string[];
  sampleSops?: string[];
  disclaimer?: string;
  isPremiumDeep?: boolean;
};

export const PROFESSION_GROUPS: AiProfessionGroup[] = [
  {
    slug: "dan-van-phong",
    title: "Dân văn phòng",
    description:
      "Ứng dụng AI vào Word, Excel, PowerPoint, email, báo cáo, họp và xử lý tài liệu hằng ngày.",
    emoji: "👨‍💼",
    popularNeedSlugs: ["viet-noi-dung", "phan-tich-du-lieu", "nghien-cuu"],
    recommendedToolSlugs: ["chatgpt", "claude", "gemini"],
    relatedArticleSlugs: [],
    companionMessage:
      "Nếu bạn làm việc văn phòng mỗi ngày, mình gợi ý bắt đầu từ AI Chat, sau đó học cách dùng AI cho email, tài liệu, Excel và PowerPoint.",
    skillGroups: [
      "AI nền tảng cho dân văn phòng",
      "AI cho soạn thảo văn bản",
      "AI cho email và giao tiếp",
      "AI cho Excel và dữ liệu",
      "AI cho PowerPoint và trình chiếu",
      "AI cho tài liệu PDF",
      "AI cho họp và biên bản",
      "AI cho lập kế hoạch công việc",
      "AI cho tự động hóa công việc lặp lại",
      "AI cho phát triển sự nghiệp",
    ],
    sampleArticles: [
      "AI cho dân văn phòng là gì? Vì sao nên học ngay bây giờ?",
      "7 việc dân văn phòng có thể làm nhanh hơn nhờ AI",
      "Cách dùng ChatGPT để viết email chuyên nghiệp",
      "Cách dùng AI để tóm tắt tài liệu dài trong vài phút",
      "Cách dùng AI để viết báo cáo tuần",
      "Cách dùng AI để làm PowerPoint nhanh hơn",
      "AI giúp Excel như thế nào cho người không rành công thức?",
      "Cách dùng AI để viết biên bản họp và action items",
      "Cách dùng AI để lập kế hoạch công việc trong tuần",
      "20 prompt AI cần có cho dân văn phòng",
      "Những lỗi dân văn phòng thường gặp khi dùng AI",
      "Lộ trình 30 ngày nâng cao năng lực làm việc bằng AI",
    ],
    samplePrompts: [
      "Viết email chuyên nghiệp",
      "Trả lời email khó",
      "Tóm tắt tài liệu PDF",
      "Viết báo cáo tuần",
      "Viết báo cáo tháng",
      "Tạo dàn ý PowerPoint",
      "Viết kịch bản thuyết trình",
      "Giải thích công thức Excel",
      "Phân tích bảng dữ liệu",
      "Viết biên bản họp",
      "Tạo danh sách action items",
      "Lập kế hoạch công việc tuần",
      "Viết thông báo nội bộ",
      "Soạn quy trình SOP",
      "Dịch email sang tiếng Anh",
      "Chỉnh văn phong chuyên nghiệp",
      "Tạo checklist công việc",
      "So sánh hai tài liệu",
      "Tóm tắt ý chính từ cuộc họp",
      "Chuẩn bị nội dung đề xuất với sếp",
    ],
    sampleChecklists: [
      "Checklist bắt đầu học AI cho dân văn phòng",
      "Checklist viết email bằng AI trước khi gửi",
      "Checklist tạo báo cáo bằng AI",
      "Checklist làm slide bằng AI",
      "Checklist tóm tắt tài liệu bằng AI",
      "Checklist họp hiệu quả với AI",
      "Checklist dùng AI an toàn tại công ty",
      "Checklist đo hiệu quả làm việc sau khi dùng AI",
    ],
    sampleTemplates: [
      "Template kế hoạch công việc tuần",
      "Template báo cáo tuần",
      "Template báo cáo tháng",
      "Template biên bản họp",
      "Template email chuyên nghiệp",
      "Template kế hoạch thuyết trình",
      "Template bảng theo dõi công việc",
      "Template SOP công việc lặp lại",
    ],
    sampleSops: [
      "SOP viết báo cáo tuần bằng AI",
      "SOP tóm tắt tài liệu dài bằng AI",
      "SOP chuẩn bị slide thuyết trình bằng AI",
      "SOP xử lý email mỗi ngày bằng AI",
      "SOP biến biên bản họp thành danh sách công việc",
    ],
    isPremiumDeep: true,
  },
  {
    slug: "nguoi-ban-hang-va-kinh-doanh",
    title: "Người bán hàng & kinh doanh",
    description:
      "AI hỗ trợ viết mô tả sản phẩm hấp dẫn, trả lời khách hàng nhanh hơn và phân tích dữ liệu bán hàng để tối ưu doanh thu.",
    emoji: "🛒",
    popularNeedSlugs: ["viet-noi-dung", "marketing", "phan-tich-du-lieu"],
    recommendedToolSlugs: ["chatgpt", "gemini", "canva-ai"],
    relatedArticleSlugs: ["cach-dung-ai-cho-nguoi-ban-hang"],
    companionMessage:
      "Nếu bạn đang kinh doanh hoặc bán hàng online, mình gợi ý bắt đầu từ cách viết mô tả sản phẩm và chăm sóc khách hàng bằng AI.",
    skillGroups: [
      "AI viết mô tả sản phẩm",
      "AI chăm sóc khách hàng",
      "AI viết tin nhắn bán hàng",
      "AI nghiên cứu khách hàng",
      "AI lên kế hoạch bán hàng",
    ],
    sampleArticles: [
      "Cách dùng AI viết mô tả sản phẩm bán chạy hơn",
      "Dựng kịch bản chăm sóc khách hàng bằng AI trong 15 phút",
      "Cách dùng AI viết tin nhắn chốt đơn thuyết phục",
      "Dùng AI nghiên cứu chân dung khách hàng mục tiêu",
      "Lên kế hoạch bán hàng tháng bằng AI cho người mới",
    ],
    samplePrompts: [
      "Viết mô tả sản phẩm hấp dẫn",
      "Trả lời tin nhắn khách hàng khó tính",
      "Viết tin nhắn nhắc khách chốt đơn",
      "Phân tích chân dung khách hàng mục tiêu",
      "Lập kế hoạch bán hàng tháng",
      "Viết kịch bản telesale",
      "Tạo bộ câu hỏi khảo sát khách hàng",
      "Phân tích lý do khách hàng rời bỏ",
    ],
  },
  {
    slug: "affiliate-marketing",
    title: "Affiliate Marketing",
    description:
      "Dùng AI để nghiên cứu sản phẩm, tạo nội dung review và xây dựng hệ thống affiliate bán chạy hơn mà ít tốn công sức hơn.",
    emoji: "🤝",
    popularNeedSlugs: ["viet-noi-dung", "nghien-cuu", "marketing"],
    recommendedToolSlugs: ["chatgpt", "perplexity", "claude"],
    relatedArticleSlugs: ["cach-dung-ai-cho-affiliate-marketer", "ung-dung-ai-trong-affiliate-marketing"],
    companionMessage:
      "Nếu bạn làm Affiliate Marketing, mình gợi ý bắt đầu từ nghiên cứu ngách và viết nội dung review bằng AI.",
    skillGroups: [
      "AI nghiên cứu ngách",
      "AI viết nội dung",
      "AI xây phễu",
      "AI phân tích khách hàng",
      "AI tối ưu chuyển đổi",
    ],
    sampleArticles: [
      "Cách dùng AI nghiên cứu ngách affiliate tiềm năng",
      "Viết bài review sản phẩm affiliate bằng AI trong 30 phút",
      "Dùng AI xây phễu bán hàng affiliate cơ bản",
      "Phân tích hành vi khách hàng affiliate bằng AI",
      "Tối ưu tỷ lệ chuyển đổi landing page affiliate bằng AI",
    ],
    samplePrompts: [
      "Nghiên cứu ngách affiliate tiềm năng",
      "Viết bài review sản phẩm thuyết phục",
      "Viết outline phễu bán hàng",
      "Phân tích đối thủ cùng ngách",
      "Viết tiêu đề landing page thu hút",
      "Tối ưu call-to-action",
      "Viết email nurturing cho affiliate",
      "So sánh 2 sản phẩm affiliate cùng ngách",
    ],
  },
  {
    slug: "content-creator",
    title: "Content Creator",
    description:
      "AI là cộng sự đắc lực cho content creator — từ ý tưởng nội dung, kịch bản video đến thiết kế thumbnail trong vài phút.",
    emoji: "🎥",
    popularNeedSlugs: ["viet-noi-dung", "lam-video", "thiet-ke-hinh-anh"],
    recommendedToolSlugs: ["chatgpt", "canva-ai", "runway"],
    relatedArticleSlugs: ["cach-dung-ai-cho-content-creator"],
    companionMessage:
      "Nếu bạn làm nội dung sáng tạo, mình gợi ý bắt đầu từ lên ý tưởng và viết kịch bản video bằng AI.",
    skillGroups: [
      "AI ý tưởng nội dung",
      "AI kịch bản video",
      "AI caption",
      "AI hình ảnh",
      "AI lịch đăng bài",
    ],
    sampleArticles: [
      "30 ý tưởng nội dung tạo bằng AI trong 5 phút",
      "Viết kịch bản video ngắn bằng AI cho người mới",
      "Cách dùng AI viết caption thu hút tương tác",
      "Tạo hình ảnh minh họa cho content bằng AI",
      "Lên lịch đăng bài 1 tháng bằng AI",
    ],
    samplePrompts: [
      "Lên 10 ý tưởng nội dung theo chủ đề",
      "Viết kịch bản video 60 giây",
      "Viết caption gây tò mò",
      "Tạo mô tả ảnh cho AI Image",
      "Lên lịch đăng bài tuần",
      "Viết hook mở đầu video",
      "Tạo tiêu đề video thu hút click",
      "Viết mô tả video cho YouTube",
    ],
  },
  {
    slug: "designer",
    title: "Designer",
    description:
      "AI không thay thế designer mà giúp designer làm việc nhanh hơn — tạo concept, generate tài sản hình ảnh và viết brief.",
    emoji: "🖌️",
    popularNeedSlugs: ["thiet-ke-hinh-anh", "viet-noi-dung", "lam-video"],
    recommendedToolSlugs: ["midjourney", "canva-ai", "chatgpt"],
    relatedArticleSlugs: ["cach-dung-ai-cho-designer"],
    companionMessage:
      "Nếu bạn làm thiết kế, mình gợi ý bắt đầu từ tạo moodboard và ý tưởng thiết kế bằng AI.",
    skillGroups: [
      "AI moodboard",
      "AI ý tưởng thiết kế",
      "AI hình ảnh",
      "AI logo concept",
      "AI trình bày portfolio",
    ],
    sampleArticles: [
      "Tạo moodboard thiết kế bằng AI trong 10 phút",
      "Cách dùng AI để brainstorm ý tưởng thiết kế",
      "Tạo hình ảnh concept bằng AI cho dự án thiết kế",
      "Dùng AI tạo ý tưởng logo ban đầu",
      "Trình bày portfolio thiết kế ấn tượng hơn với AI",
    ],
    samplePrompts: [
      "Tạo moodboard theo phong cách",
      "Gợi ý bảng màu cho thương hiệu",
      "Tạo prompt Midjourney cho concept thiết kế",
      "Gợi ý ý tưởng logo ban đầu",
      "Viết mô tả dự án cho portfolio",
      "Tạo brief thiết kế từ yêu cầu khách hàng",
      "Gợi ý bố cục trang trình bày",
      "Viết caption giới thiệu dự án thiết kế",
    ],
  },
  {
    slug: "lap-trinh-vien",
    title: "Lập trình viên",
    description:
      "AI giúp lập trình viên viết code nhanh hơn, debug chính xác hơn và hiểu codebase lạ trong vài phút thay vì vài giờ.",
    emoji: "👨‍💻",
    popularNeedSlugs: ["lap-trinh", "phan-tich-du-lieu", "tu-dong-hoa"],
    recommendedToolSlugs: ["cursor", "claude", "chatgpt"],
    relatedArticleSlugs: ["cach-dung-ai-cho-lap-trinh-vien"],
    companionMessage:
      "Nếu bạn là lập trình viên, mình gợi ý bắt đầu từ dùng AI đọc code và debug nhanh hơn.",
    skillGroups: [
      "AI đọc code",
      "AI debug",
      "AI viết tài liệu kỹ thuật",
      "AI refactor",
      "AI học công nghệ mới",
    ],
    sampleArticles: [
      "Dùng AI đọc hiểu codebase lạ trong vài phút",
      "Debug lỗi nhanh hơn với AI cho người mới học code",
      "Viết tài liệu kỹ thuật bằng AI cho dự án của bạn",
      "Cách dùng AI refactor code sạch hơn",
      "Học công nghệ mới nhanh hơn với sự hỗ trợ của AI",
    ],
    samplePrompts: [
      "Giải thích đoạn code khó hiểu",
      "Tìm nguyên nhân lỗi trong đoạn code",
      "Viết docstring cho function",
      "Đề xuất cách refactor đoạn code",
      "Giải thích khái niệm lập trình mới",
      "Viết README cho dự án",
      "Viết unit test cho function",
      "So sánh hai cách tiếp cận trong code",
    ],
  },
  {
    slug: "sinh-vien",
    title: "Sinh viên",
    description:
      "AI giúp sinh viên nghiên cứu tài liệu nhanh hơn, tóm tắt sách giáo khoa, dịch tài liệu tiếng Anh và lên kế hoạch học tập.",
    emoji: "🎓",
    popularNeedSlugs: ["nghien-cuu", "viet-noi-dung", "dich-thuat"],
    recommendedToolSlugs: ["chatgpt", "perplexity", "gemini"],
    relatedArticleSlugs: ["cach-dung-ai-cho-sinh-vien"],
    companionMessage:
      "Nếu bạn là sinh viên, mình gợi ý bắt đầu từ dùng AI để học tập và tóm tắt bài giảng.",
    skillGroups: [
      "AI học tập",
      "AI tóm tắt bài",
      "AI làm đề cương",
      "AI ôn thi",
      "AI thuyết trình",
    ],
    sampleArticles: [
      "AI hỗ trợ sinh viên học tập hiệu quả hơn ra sao?",
      "Tóm tắt bài giảng dài bằng AI trong vài phút",
      "Cách dùng AI làm đề cương tiểu luận nhanh hơn",
      "Ôn thi hiệu quả hơn với sự hỗ trợ của AI",
      "Chuẩn bị bài thuyết trình bằng AI cho sinh viên",
    ],
    samplePrompts: [
      "Tóm tắt chương sách giáo khoa",
      "Giải thích khái niệm khó hiểu",
      "Lập đề cương tiểu luận",
      "Tạo bộ câu hỏi ôn tập",
      "Dịch tài liệu tiếng Anh sang tiếng Việt",
      "Tạo dàn ý bài thuyết trình",
      "Kiểm tra lỗi chính tả và ngữ pháp",
      "Lập kế hoạch ôn thi theo tuần",
    ],
  },
  {
    slug: "giao-vien",
    title: "Giáo viên",
    description:
      "AI hỗ trợ giáo viên soạn bài giảng, tạo bài kiểm tra, giải thích khái niệm khó và dịch tài liệu nước ngoài cho học sinh.",
    emoji: "👩‍🏫",
    popularNeedSlugs: ["viet-noi-dung", "nghien-cuu", "dich-thuat"],
    recommendedToolSlugs: ["chatgpt", "gemini", "claude"],
    relatedArticleSlugs: ["cach-dung-ai-cho-giao-vien"],
    companionMessage:
      "Nếu bạn là giáo viên, mình gợi ý bắt đầu từ dùng AI để soạn giáo án và tạo bài tập.",
    skillGroups: [
      "AI soạn giáo án",
      "AI tạo bài tập",
      "AI chấm nhận xét",
      "AI tạo slide",
      "AI cá nhân hóa học tập",
    ],
    sampleArticles: [
      "Soạn giáo án nhanh hơn với sự hỗ trợ của AI",
      "Tạo bộ bài tập đa dạng bằng AI cho từng bài học",
      "Dùng AI hỗ trợ chấm bài và viết nhận xét",
      "Tạo slide bài giảng chuyên nghiệp bằng AI",
      "Cá nhân hóa lộ trình học cho từng học sinh bằng AI",
    ],
    samplePrompts: [
      "Soạn giáo án theo chủ đề bài học",
      "Tạo bộ câu hỏi trắc nghiệm",
      "Viết nhận xét bài làm học sinh",
      "Tạo dàn ý slide bài giảng",
      "Giải thích khái niệm khó theo cách dễ hiểu",
      "Gợi ý hoạt động lớp học sáng tạo",
      "Tạo đề kiểm tra theo mức độ khó tăng dần",
      "Viết thông báo gửi phụ huynh",
    ],
  },
  {
    slug: "chu-doanh-nghiep",
    title: "Chủ doanh nghiệp",
    description:
      "AI giúp chủ doanh nghiệp tiết kiệm thời gian vận hành, phân tích thị trường nhanh và tự động hóa các quy trình lặp đi lặp lại.",
    emoji: "📈",
    popularNeedSlugs: ["marketing", "phan-tich-du-lieu", "tu-dong-hoa"],
    recommendedToolSlugs: ["chatgpt", "perplexity", "n8n"],
    relatedArticleSlugs: ["cach-dung-ai-cho-chu-doanh-nghiep"],
    companionMessage:
      "Nếu bạn là chủ doanh nghiệp, mình gợi ý bắt đầu từ dùng AI để lập kế hoạch và phân tích thị trường.",
    skillGroups: [
      "AI lập kế hoạch",
      "AI phân tích thị trường",
      "AI xây quy trình",
      "AI tuyển dụng",
      "AI báo cáo quản trị",
    ],
    sampleArticles: [
      "Lập kế hoạch kinh doanh quý bằng AI cho chủ doanh nghiệp",
      "Phân tích thị trường và đối thủ nhanh hơn với AI",
      "Xây dựng quy trình vận hành chuẩn bằng AI",
      "Dùng AI hỗ trợ sàng lọc hồ sơ tuyển dụng",
      "Tạo báo cáo quản trị hàng tháng bằng AI",
    ],
    samplePrompts: [
      "Lập kế hoạch kinh doanh quý",
      "Phân tích đối thủ cạnh tranh",
      "Viết quy trình SOP cho bộ phận",
      "Viết mô tả công việc tuyển dụng",
      "Tạo báo cáo quản trị tháng",
      "Phân tích rủi ro vận hành",
      "Lên kịch bản họp chiến lược",
      "Tóm tắt báo cáo tài chính cơ bản",
    ],
  },
  {
    slug: "nha-dau-tu",
    title: "Nhà đầu tư",
    description:
      "Sử dụng AI để nghiên cứu thông tin, phân tích dữ liệu, tóm tắt tài liệu và ra quyết định thận trọng hơn.",
    emoji: "💰",
    popularNeedSlugs: ["nghien-cuu", "phan-tich-du-lieu"],
    recommendedToolSlugs: ["chatgpt", "perplexity", "claude"],
    relatedArticleSlugs: [],
    companionMessage:
      "Nếu bạn là nhà đầu tư cá nhân, mình gợi ý dùng AI để nghiên cứu và tóm tắt thông tin — AI không đưa ra lời khuyên đầu tư, quyết định cuối cùng luôn là của bạn.",
    disclaimer:
      "AI trong mục này chỉ hỗ trợ nghiên cứu và tổng hợp thông tin. Đây không phải là lời khuyên đầu tư, không cam kết lợi nhuận và không dự đoán chắc chắn kết quả. Mọi quyết định đầu tư là trách nhiệm của cá nhân bạn.",
    skillGroups: [
      "AI cho nghiên cứu dự án",
      "AI cho đọc báo cáo",
      "AI cho phân tích tin tức",
      "AI cho so sánh cơ hội",
      "AI cho quản lý danh mục theo thông tin cá nhân",
      "AI cho nhận diện rủi ro",
      "AI cho tóm tắt whitepaper / roadmap",
    ],
    sampleArticles: [
      "AI giúp nhà đầu tư nghiên cứu nhanh hơn như thế nào?",
      "Cách dùng AI để tóm tắt whitepaper và tài liệu dự án",
      "Cách dùng AI để so sánh nhiều cơ hội đầu tư",
      "Checklist dùng AI để đánh giá rủi ro dự án",
      "Những điều AI không thể thay bạn quyết định khi đầu tư",
      "Prompt nghiên cứu dự án dành cho nhà đầu tư cá nhân",
    ],
    samplePrompts: [
      "Tóm tắt whitepaper",
      "Phân tích roadmap",
      "So sánh hai dự án",
      "Liệt kê rủi ro tiềm ẩn",
      "Tóm tắt tin tức mới",
      "Giải thích thuật ngữ đầu tư",
      "Đọc báo cáo dài",
      "Tạo checklist thẩm định",
      "So sánh mô hình kinh doanh",
      "Chuẩn bị câu hỏi trước khi tham gia dự án",
    ],
    isPremiumDeep: false,
  },
];

// ─────────────────────────────────────────────
// 3. AiTool
// ─────────────────────────────────────────────

export type AiTool = {
  slug: string;
  name: string;
  tagline: string;
  companionSummary: string;
  website: string;
  pricing: "Miễn phí" | "Freemium" | "Trả phí";
  pricingNote: string;
  category:
    | "AI Chat"
    | "AI Hình ảnh"
    | "AI Video"
    | "AI Lập trình"
    | "AI Tự động hóa"
    | "AI Marketing"
    | "AI Phân tích"
    | "AI Dịch thuật";
  bestFor: string[];
  notGoodFor: string[];
  featured: boolean;
  badge: "Tôi đang dùng" | "Recommended" | "Affiliate" | null;
  relatedArticleSlugs: string[];
  relatedNeedSlugs: string[];
};

/**
 * @deprecated Từ Bước C (migrate Công cụ AI sang Supabase) —
 * /portal/aiworkspace và /portal/aiworkspace/[slug] giờ đọc từ bảng
 * Supabase `tools` qua src/lib/portal/live-tools.ts (getLiveTools()),
 * không còn dùng mảng này. Giữ nguyên 1-2 tuần phòng hờ rollback nhanh
 * (đổi lại import ở 2 file đó thay vì phải khôi phục từ git history).
 * NEED_CATEGORIES/PROFESSION_GROUPS/AI_ARTICLES/AI_PROMPTS vẫn dùng mảng
 * này để tra cứu chéo theo slug (recommendedToolSlugs/relatedToolSlugs) —
 * KHÔNG xoá, chỉ đánh dấu không còn là nguồn hiển thị chính.
 */
export const AI_TOOLS: AiTool[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    tagline: "Trợ lý AI thông minh nhất hiện nay",
    companionSummary:
      "ChatGPT phù hợp cho mọi nhu cầu viết nội dung, nghiên cứu và hỏi đáp. Người mới bắt đầu nên bắt đầu từ đây.",
    website: "https://chatgpt.com",
    pricing: "Freemium",
    pricingNote: "Bản Free dùng được GPT-4o giới hạn. Plus $20/tháng không giới hạn.",
    category: "AI Chat",
    bestFor: [
      "Viết nội dung tiếng Việt",
      "Brainstorm ý tưởng",
      "Giải thích khái niệm phức tạp",
      "Lên kế hoạch công việc",
    ],
    notGoodFor: [
      "Tìm kiếm thông tin real-time (bản Free)",
      "Tạo hình ảnh (cần bản Plus)",
    ],
    featured: true,
    badge: "Tôi đang dùng",
    relatedArticleSlugs: [
      "ai-chat-la-gi-nguoi-moi-nen-bat-dau-tu-dau",
      "so-sanh-chatgpt-claude-gemini",
      "10-prompt-co-ban-cho-nguoi-moi",
    ],
    relatedNeedSlugs: [
      "viet-noi-dung",
      "nghien-cuu",
      "marketing",
      "phan-tich-du-lieu",
      "dich-thuat",
    ],
  },
  {
    slug: "claude",
    name: "Claude",
    tagline: "AI viết nội dung dài và phân tích tài liệu tốt nhất",
    companionSummary:
      "Claude phù hợp cho những ai cần viết nội dung dài, phân tích tài liệu hoặc hỗ trợ lập trình với ngữ cảnh sâu.",
    website: "https://claude.ai",
    pricing: "Freemium",
    pricingNote: "Bản Free đủ dùng cho hầu hết công việc. Pro $20/tháng cho dùng nhiều hơn.",
    category: "AI Chat",
    bestFor: [
      "Viết bài dài, chuyên sâu",
      "Phân tích tài liệu PDF",
      "Lập trình và review code",
      "Nghiên cứu học thuật",
    ],
    notGoodFor: [
      "Tìm kiếm thông tin thời gian thực",
      "Tạo hình ảnh",
    ],
    featured: true,
    badge: "Tôi đang dùng",
    relatedArticleSlugs: [
      "cach-dung-claude-viet-noi-dung-dai",
      "so-sanh-chatgpt-claude-gemini",
    ],
    relatedNeedSlugs: ["viet-noi-dung", "lap-trinh", "nghien-cuu"],
  },
  {
    slug: "gemini",
    name: "Gemini",
    tagline: "AI của Google — tìm kiếm thông tin và đa phương tiện",
    companionSummary:
      "Gemini kết nối với dữ liệu Google, rất mạnh khi cần tìm kiếm thông tin hiện tại hoặc phân tích hình ảnh.",
    website: "https://gemini.google.com",
    pricing: "Freemium",
    pricingNote: "Bản Free mạnh hơn ChatGPT Free. Advanced $20/tháng tích hợp toàn bộ Google Workspace.",
    category: "AI Chat",
    bestFor: [
      "Tìm kiếm thông tin mới nhất",
      "Phân tích hình ảnh",
      "Tích hợp Google Workspace",
      "Đa phương tiện",
    ],
    notGoodFor: [
      "Viết nội dung dài (thua Claude)",
      "Lập trình chuyên sâu",
    ],
    featured: true,
    badge: "Recommended",
    relatedArticleSlugs: ["so-sanh-chatgpt-claude-gemini"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu", "dich-thuat"],
  },
  {
    slug: "perplexity",
    name: "Perplexity AI",
    tagline: "Công cụ nghiên cứu AI với nguồn dẫn chứng",
    companionSummary:
      "Perplexity là công cụ nghiên cứu tốt nhất — mỗi câu trả lời đều có nguồn dẫn chứng rõ ràng.",
    website: "https://www.perplexity.ai",
    pricing: "Freemium",
    pricingNote: "Bản Free đủ dùng tốt. Pro $20/tháng cho tìm kiếm chuyên sâu hơn.",
    category: "AI Phân tích",
    bestFor: [
      "Nghiên cứu với nguồn tin",
      "Fact-check thông tin",
      "Tổng hợp nội dung từ nhiều nguồn",
    ],
    notGoodFor: [
      "Viết nội dung sáng tạo",
      "Lập trình",
    ],
    featured: true,
    badge: "Tôi đang dùng",
    relatedArticleSlugs: ["cach-dung-perplexity-nghien-cuu-nhanh-hon"],
    relatedNeedSlugs: ["nghien-cuu", "phan-tich-du-lieu", "marketing"],
  },
  {
    slug: "cursor",
    name: "Cursor",
    tagline: "IDE AI cho lập trình viên",
    companionSummary:
      "Cursor là editor tốt nhất cho lập trình với AI — viết code, sửa lỗi và hiểu codebase nhanh hơn 10 lần.",
    website: "https://www.cursor.com",
    pricing: "Freemium",
    pricingNote: "Bản Hobby miễn phí 2000 autocomplete/tháng. Pro $20/tháng không giới hạn.",
    category: "AI Lập trình",
    bestFor: [
      "Viết code nhanh hơn",
      "Debug tự động",
      "Hiểu codebase lớn",
    ],
    notGoodFor: [
      "Người chưa biết lập trình cơ bản",
      "Thiết kế UI thuần túy",
    ],
    featured: true,
    badge: "Tôi đang dùng",
    relatedArticleSlugs: ["cach-dung-cursor-cho-nguoi-moi-hoc-lap-trinh"],
    relatedNeedSlugs: ["lap-trinh"],
  },
  {
    slug: "canva-ai",
    name: "Canva AI",
    tagline: "Thiết kế chuyên nghiệp không cần biết design",
    companionSummary:
      "Canva AI phù hợp cho người không có kỹ năng thiết kế — tạo banner, thumbnail, poster chuyên nghiệp trong vài phút.",
    website: "https://www.canva.com",
    pricing: "Freemium",
    pricingNote: "Bản Free có sẵn nhiều template. Pro ~$15/tháng mở khóa AI features đầy đủ.",
    category: "AI Hình ảnh",
    bestFor: [
      "Banner mạng xã hội",
      "Thumbnail YouTube",
      "Poster sự kiện",
      "Infographic",
    ],
    notGoodFor: [
      "Hình ảnh nghệ thuật chất lượng cao",
      "Concept art phức tạp",
    ],
    featured: true,
    badge: "Tôi đang dùng",
    relatedArticleSlugs: ["ai-image-la-gi-nen-bat-dau-voi-cong-cu-nao"],
    relatedNeedSlugs: ["thiet-ke-hinh-anh", "marketing"],
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    tagline: "Tạo hình ảnh nghệ thuật với AI",
    companionSummary:
      "Midjourney cho ra hình ảnh đẹp và nghệ thuật nhất hiện nay — phù hợp cho creative projects.",
    website: "https://www.midjourney.com",
    pricing: "Trả phí",
    pricingNote: "Gói cơ bản $10/tháng (200 ảnh). Standard $30/tháng không giới hạn.",
    category: "AI Hình ảnh",
    bestFor: [
      "Hình ảnh sáng tạo cao",
      "Concept art",
      "Branding hình ảnh độc đáo",
    ],
    notGoodFor: [
      "Người mới hoàn toàn (cần học prompt)",
      "Thiết kế thực dụng nhanh",
    ],
    featured: false,
    badge: null,
    relatedArticleSlugs: ["ai-image-la-gi-nen-bat-dau-voi-cong-cu-nao"],
    relatedNeedSlugs: ["thiet-ke-hinh-anh"],
  },
  {
    slug: "runway",
    name: "Runway",
    tagline: "Tạo và chỉnh sửa video với AI",
    companionSummary:
      "Runway là công cụ AI video tiên tiến nhất — chỉnh sửa video, tạo hiệu ứng và generate video từ text.",
    website: "https://runwayml.com",
    pricing: "Trả phí",
    pricingNote: "Basic $15/tháng (125 credits). Standard $35/tháng cho dùng thường xuyên.",
    category: "AI Video",
    bestFor: [
      "Chỉnh sửa video AI",
      "Generate video ngắn",
      "Hiệu ứng đặc biệt",
    ],
    notGoodFor: [
      "Video dài hơn 30 giây (tốn nhiều credit)",
      "Người mới chưa biết video",
    ],
    featured: false,
    badge: null,
    relatedArticleSlugs: [],
    relatedNeedSlugs: ["lam-video"],
  },
  {
    slug: "n8n",
    name: "n8n",
    tagline: "Tự động hóa công việc không cần code",
    companionSummary:
      "n8n giúp kết nối các ứng dụng và tự động hóa quy trình làm việc — tiết kiệm hàng giờ mỗi ngày.",
    website: "https://n8n.io",
    pricing: "Freemium",
    pricingNote: "Self-host miễn phí. Cloud từ $20/tháng. Phù hợp cho người biết một chút kỹ thuật.",
    category: "AI Tự động hóa",
    bestFor: [
      "Kết nối API",
      "Auto-posting nội dung",
      "Tự động hóa email marketing",
    ],
    notGoodFor: [
      "Người hoàn toàn không biết kỹ thuật",
      "Cần setup nhanh trong 5 phút",
    ],
    featured: false,
    badge: "Tôi đang dùng",
    relatedArticleSlugs: ["tu-dong-hoa-cong-viec-voi-n8n-la-gi"],
    relatedNeedSlugs: ["tu-dong-hoa"],
  },
  {
    slug: "make",
    name: "Make",
    tagline: "Xây dựng automation không cần lập trình",
    companionSummary:
      "Make (trước đây là Integromat) phù hợp cho người mới bắt đầu automation — giao diện kéo thả dễ dùng.",
    website: "https://www.make.com",
    pricing: "Freemium",
    pricingNote: "Free 1000 operations/tháng. Core $9/tháng. Dễ dùng hơn n8n cho người mới.",
    category: "AI Tự động hóa",
    bestFor: [
      "Automation cho người mới",
      "Kết nối Shopify, WooCommerce",
      "Quy trình bán hàng tự động",
    ],
    notGoodFor: [
      "Automation phức tạp cần logic nâng cao",
      "Xử lý dữ liệu lớn",
    ],
    featured: false,
    badge: null,
    relatedArticleSlugs: ["tu-dong-hoa-cong-viec-voi-n8n-la-gi"],
    relatedNeedSlugs: ["tu-dong-hoa"],
  },
];

// ─────────────────────────────────────────────
// 4. AiArticle
// ─────────────────────────────────────────────

/**
 * @deprecated Việc 7 (Nhóm B) — Blog AI trong AI Workspace giờ đọc bảng
 * `blog` thật qua getLiveBlogPosts() (src/lib/portal/live-blog.ts), không
 * còn dùng AI_ARTICLES/AiArticle. `relatedToolSlugs`/`relatedNeedSlugs`
 * không có tương đương trong bảng thật — Founder xác nhận bỏ hẳn tính
 * năng lọc bài liên quan theo Tool/Need. Giữ lại type + mảng dữ liệu này
 * làm tham khảo/rollback, không còn consumer nào import.
 */
export type AiArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  featured: boolean;
  relatedToolSlugs: string[];
  relatedNeedSlugs: string[];
};

export const AI_ARTICLES: AiArticle[] = [
  {
    id: "art-001",
    slug: "ai-chat-la-gi-nguoi-moi-nen-bat-dau-tu-dau",
    title: "AI Chat là gì? Người mới nên bắt đầu từ đâu?",
    excerpt:
      "AI Chat là các trợ lý thông minh có khả năng trò chuyện, viết nội dung và giải quyết vấn đề như một người thật. Nếu bạn chưa từng dùng AI, ChatGPT là điểm khởi đầu tốt nhất — miễn phí, tiếng Việt tốt và dễ làm quen. Bài viết này giải thích rõ AI Chat hoạt động thế nào và bạn có thể dùng nó làm gì ngay hôm nay.",
    category: "AI",
    publishedAt: "2026-01-10",
    featured: true,
    relatedToolSlugs: ["chatgpt", "claude", "gemini"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu"],
  },
  {
    id: "art-002",
    slug: "cach-chon-cong-cu-ai-phu-hop-voi-cong-viec",
    title: "Cách chọn công cụ AI phù hợp với công việc của bạn",
    excerpt:
      "Với hàng chục công cụ AI ra đời mỗi tháng, việc chọn đúng công cụ cho công việc của mình là điều không hề dễ. Bài viết này đưa ra khung quyết định đơn giản: xác định nhu cầu, so sánh theo tiêu chí phù hợp và thử nghiệm trước khi trả phí. Bạn sẽ không cần dùng hơn 3 công cụ AI để xử lý 90% công việc hàng ngày.",
    category: "AI",
    publishedAt: "2026-01-15",
    featured: true,
    relatedToolSlugs: ["chatgpt", "claude", "perplexity"],
    relatedNeedSlugs: ["viet-noi-dung", "marketing", "nghien-cuu"],
  },
  {
    id: "art-003",
    slug: "10-prompt-co-ban-cho-nguoi-moi",
    title: "10 prompt cơ bản cho người mới dùng AI",
    excerpt:
      "Prompt (câu lệnh) là cách bạn ra lệnh cho AI — viết prompt tốt sẽ cho kết quả tốt hơn gấp 3 lần. Bài viết này chia sẻ 10 mẫu prompt thực tế mà người mới có thể dùng ngay cho viết bài, nghiên cứu và lập kế hoạch. Mỗi prompt đều có ví dụ trước và sau để bạn thấy rõ sự khác biệt.",
    category: "AI",
    publishedAt: "2026-01-20",
    featured: true,
    relatedToolSlugs: ["chatgpt", "claude"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu"],
  },
  {
    id: "art-004",
    slug: "so-sanh-chatgpt-claude-gemini",
    title: "So sánh ChatGPT, Claude và Gemini cho người mới",
    excerpt:
      "Ba công cụ AI phổ biến nhất hiện nay đều có điểm mạnh riêng: ChatGPT linh hoạt nhất, Claude viết dài tốt nhất, Gemini tích hợp Google tốt nhất. Bài viết so sánh trực tiếp từng tiêu chí để bạn biết nên dùng cái nào cho việc gì. Kết luận: hầu hết người Việt nên bắt đầu với ChatGPT, sau đó thêm Claude nếu cần viết chuyên sâu.",
    category: "AI",
    publishedAt: "2026-01-25",
    featured: false,
    relatedToolSlugs: ["chatgpt", "claude", "gemini"],
    relatedNeedSlugs: ["viet-noi-dung"],
  },
  {
    id: "art-005",
    slug: "cach-dung-claude-viet-noi-dung-dai",
    title: "Cách dùng Claude để viết nội dung dài",
    excerpt:
      "Claude có khả năng ghi nhớ ngữ cảnh rất dài, giúp nó viết bài blog, white paper hoặc ebook mà không bị lạc chủ đề. Bài viết này hướng dẫn quy trình từng bước: từ việc đưa brief, outline đến việc yêu cầu Claude viết từng phần và ghép lại thành bản hoàn chỉnh. Áp dụng đúng, bạn có thể tạo ra bài 2000 từ chất lượng trong dưới 30 phút.",
    category: "AI",
    publishedAt: "2026-02-01",
    featured: false,
    relatedToolSlugs: ["claude"],
    relatedNeedSlugs: ["viet-noi-dung"],
  },
  {
    id: "art-006",
    slug: "cach-dung-perplexity-nghien-cuu-nhanh-hon",
    title: "Cách dùng Perplexity để nghiên cứu nhanh hơn",
    excerpt:
      "Perplexity khác với ChatGPT ở chỗ nó tìm kiếm internet thời gian thực và trích dẫn nguồn cho từng câu trả lời. Điều này giúp bạn nghiên cứu thị trường, tìm hiểu đối thủ hoặc fact-check thông tin mà không phải mở 10 tab trình duyệt. Bài viết chia sẻ 5 cách dùng Perplexity hiệu quả nhất cho người làm nội dung và kinh doanh.",
    category: "AI",
    publishedAt: "2026-02-08",
    featured: false,
    relatedToolSlugs: ["perplexity"],
    relatedNeedSlugs: ["nghien-cuu", "phan-tich-du-lieu"],
  },
  {
    id: "art-007",
    slug: "quy-trinh-dung-ai-viet-bai-facebook",
    title: "Quy trình dùng AI để viết bài Facebook trong 10 phút",
    excerpt:
      "Nhiều người dùng AI nhưng vẫn mất 1-2 tiếng viết một bài Facebook vì không có quy trình rõ ràng. Bài viết này chia sẻ quy trình 4 bước: xác định mục tiêu bài viết, đưa thông tin đầu vào cho AI, chỉnh sửa giọng văn cá nhân và đăng bài. Với quy trình này, bạn có thể tạo ra 3-5 bài Facebook chất lượng mỗi ngày.",
    category: "AI",
    publishedAt: "2026-02-15",
    featured: true,
    relatedToolSlugs: ["chatgpt", "claude"],
    relatedNeedSlugs: ["viet-noi-dung", "marketing"],
  },
  {
    id: "art-008",
    slug: "ung-dung-ai-trong-affiliate-marketing",
    title: "Ứng dụng AI trong Affiliate Marketing",
    excerpt:
      "Affiliate Marketing cạnh tranh ngày càng khốc liệt, và những người dùng AI đang có lợi thế rõ rệt về tốc độ và chất lượng nội dung. Bài viết này chia sẻ cách dùng AI để nghiên cứu sản phẩm, viết review thuyết phục, tạo so sánh sản phẩm và tối ưu SEO cho trang affiliate. Bao gồm các prompt thực tế đã được kiểm chứng.",
    category: "Affiliate",
    publishedAt: "2026-02-20",
    featured: false,
    relatedToolSlugs: ["chatgpt", "perplexity", "claude"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu", "marketing"],
  },
  {
    id: "art-009",
    slug: "ai-image-la-gi-nen-bat-dau-voi-cong-cu-nao",
    title: "AI Image là gì và nên bắt đầu với công cụ nào?",
    excerpt:
      "AI Image là công nghệ tạo ra hình ảnh từ mô tả văn bản — bạn viết 'một người phụ nữ đứng trước cửa tiệm café ở Hà Nội' và AI tạo ra ảnh đó trong 10 giây. Bài viết so sánh Canva AI và Midjourney: Canva phù hợp cho người cần thiết kế thực dụng, Midjourney phù hợp cho người cần nghệ thuật sáng tạo. Kèm hướng dẫn bắt đầu ngay hôm nay.",
    category: "AI",
    publishedAt: "2026-03-01",
    featured: false,
    relatedToolSlugs: ["canva-ai", "midjourney"],
    relatedNeedSlugs: ["thiet-ke-hinh-anh"],
  },
  {
    id: "art-010",
    slug: "cach-dung-cursor-cho-nguoi-moi-hoc-lap-trinh",
    title: "Cách dùng Cursor cho người mới học lập trình",
    excerpt:
      "Cursor biến việc học lập trình trở nên dễ hơn rất nhiều — bạn có thể hỏi AI giải thích từng dòng code, yêu cầu viết function và debug lỗi ngay trong editor. Bài viết này hướng dẫn người mới cài đặt Cursor, cách đặt câu hỏi hiệu quả và tránh các sai lầm phổ biến khi phụ thuộc quá nhiều vào AI mà không học nền tảng. Phù hợp cho người học Python, JavaScript hoặc bắt đầu với no-code.",
    category: "AI",
    publishedAt: "2026-03-08",
    featured: false,
    relatedToolSlugs: ["cursor", "chatgpt"],
    relatedNeedSlugs: ["lap-trinh"],
  },
  {
    id: "art-011",
    slug: "tu-dong-hoa-cong-viec-voi-n8n-la-gi",
    title: "Tự động hóa công việc với n8n là gì?",
    excerpt:
      "n8n là công cụ automation mã nguồn mở giúp bạn kết nối các ứng dụng và tự động hóa quy trình mà không cần lập trình phức tạp. Bài viết giải thích n8n hoạt động thế nào, so sánh với Make và Zapier, và đưa ra 3 ví dụ tự động hóa thực tế: tự động đăng bài lên mạng xã hội, gửi báo cáo bán hàng hàng ngày và thu thập lead từ form về Google Sheet.",
    category: "AI",
    publishedAt: "2026-03-15",
    featured: false,
    relatedToolSlugs: ["n8n", "make"],
    relatedNeedSlugs: ["tu-dong-hoa"],
  },
  {
    id: "art-012",
    slug: "cach-dung-ai-phan-tich-du-lieu-co-ban",
    title: "Cách dùng AI để phân tích dữ liệu cơ bản",
    excerpt:
      "Bạn không cần biết Excel hay SQL để phân tích dữ liệu — chỉ cần copy dữ liệu vào ChatGPT và hỏi đúng câu hỏi. Bài viết hướng dẫn cách upload file CSV vào ChatGPT, cách hỏi để lấy insight từ số liệu bán hàng, và cách yêu cầu AI viết công thức Excel thay vì tự nghĩ. Kèm 5 prompt mẫu cho phân tích dữ liệu thực tế.",
    category: "AI",
    publishedAt: "2026-03-22",
    featured: false,
    relatedToolSlugs: ["chatgpt", "perplexity"],
    relatedNeedSlugs: ["phan-tich-du-lieu"],
  },
  {
    id: "art-013",
    slug: "prompt-engineering-la-gi-huong-dan-tu-co-ban",
    title: "Prompt Engineering là gì? Hướng dẫn từ cơ bản",
    excerpt:
      "Prompt Engineering là nghệ thuật viết câu lệnh cho AI để nhận được kết quả tốt nhất — đây là kỹ năng quan trọng nhất bạn cần học khi làm việc với AI. Bài viết này giải thích 5 nguyên tắc prompt cốt lõi: rõ ràng về vai trò, cung cấp ngữ cảnh, chỉ định định dạng đầu ra, đưa ví dụ mẫu và lặp lại để cải thiện. Kèm bài tập thực hành ngay.",
    category: "AI",
    publishedAt: "2026-04-01",
    featured: true,
    relatedToolSlugs: ["chatgpt", "claude"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu"],
  },
  {
    id: "art-014",
    slug: "5-loi-thuong-gap-khi-dung-ai-va-cach-khac-phuc",
    title: "5 lỗi thường gặp khi dùng AI và cách khắc phục",
    excerpt:
      "Nhiều người dùng AI nhưng không đạt kết quả tốt vì mắc phải những lỗi cơ bản: đặt câu hỏi quá ngắn, tin tưởng AI 100% mà không kiểm tra, dùng sai công cụ cho từng việc. Bài viết phân tích 5 lỗi phổ biến nhất và đưa ra cách khắc phục cụ thể cho từng lỗi. Đọc xong bạn sẽ thấy kết quả AI cải thiện ngay lập tức.",
    category: "AI",
    publishedAt: "2026-04-10",
    featured: false,
    relatedToolSlugs: ["chatgpt", "claude", "gemini"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu"],
  },
  {
    id: "art-015",
    slug: "lo-trinh-hoc-ai-cho-nguoi-moi-bat-dau",
    title: "Lộ trình học AI cho người mới bắt đầu",
    excerpt:
      "Học AI không cần biết lập trình hay toán học nâng cao — bạn chỉ cần một lộ trình đúng và kỷ luật thực hành. Bài viết này đưa ra lộ trình 90 ngày chia thành 3 giai đoạn: làm quen công cụ (30 ngày), thành thạo prompt (30 ngày), và xây dựng quy trình công việc với AI (30 ngày). Mỗi giai đoạn có mục tiêu cụ thể và bài tập thực hành hàng tuần.",
    category: "AI",
    publishedAt: "2026-04-20",
    featured: true,
    relatedToolSlugs: ["chatgpt", "claude", "perplexity"],
    relatedNeedSlugs: ["nghien-cuu", "viet-noi-dung"],
  },
  // ─── 8 bài viết theo nghề nghiệp (sync với blog.ts) ─────────────────────
  {
    id: "art-p01",
    slug: "cach-dung-ai-cho-chu-doanh-nghiep",
    title: "Chủ doanh nghiệp dùng AI để làm gì? 7 ứng dụng thực tế ngay hôm nay",
    excerpt: "AI không chỉ dành cho kỹ sư hay marketer — chủ doanh nghiệp đang là nhóm hưởng lợi nhiều nhất từ AI. Từ phân tích số liệu đến tự động hóa quy trình, đây là 7 cách AI giúp bạn vận hành doanh nghiệp nhanh và thông minh hơn.",
    category: "AI",
    publishedAt: "2026-06-10",
    featured: true,
    relatedToolSlugs: ["chatgpt", "perplexity", "n8n"],
    relatedNeedSlugs: ["marketing", "phan-tich-du-lieu", "tu-dong-hoa"],
  },
  {
    id: "art-p02",
    slug: "cach-dung-ai-cho-affiliate-marketer",
    title: "Affiliate Marketer dùng AI: Từ nghiên cứu đến ra đơn nhanh hơn gấp 3",
    excerpt: "Những người làm Affiliate đang dùng AI để nghiên cứu sản phẩm, viết review thuyết phục, tối ưu SEO và xây hệ thống content — tất cả trong thời gian ngắn hơn. Đây là quy trình thực tế từ A đến Z.",
    category: "Affiliate",
    publishedAt: "2026-06-12",
    featured: true,
    relatedToolSlugs: ["chatgpt", "perplexity", "claude"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu", "marketing"],
  },
  {
    id: "art-p03",
    slug: "cach-dung-ai-cho-nguoi-ban-hang",
    title: "Người bán hàng online dùng AI: Viết mô tả sản phẩm, chốt đơn và phân tích doanh số",
    excerpt: "Bán hàng online ngày càng cạnh tranh hơn — nhưng người biết dùng AI đang có lợi thế rõ rệt về tốc độ tạo nội dung và chất lượng chăm sóc khách hàng.",
    category: "AI",
    publishedAt: "2026-06-14",
    featured: false,
    relatedToolSlugs: ["chatgpt", "gemini", "canva-ai"],
    relatedNeedSlugs: ["viet-noi-dung", "marketing", "phan-tich-du-lieu"],
  },
  {
    id: "art-p04",
    slug: "cach-dung-ai-cho-content-creator",
    title: "Content Creator dùng AI: Lên ý tưởng, viết kịch bản và thiết kế thumbnail trong 30 phút",
    excerpt: "Content creator là nhóm được hưởng lợi nhiều nhất từ AI trong năm 2026. Từ lên kế hoạch nội dung hàng tuần đến sản xuất video — AI rút ngắn thời gian sản xuất từ nhiều ngày xuống còn vài giờ.",
    category: "AI",
    publishedAt: "2026-06-16",
    featured: true,
    relatedToolSlugs: ["chatgpt", "canva-ai", "runway"],
    relatedNeedSlugs: ["viet-noi-dung", "lam-video", "thiet-ke-hinh-anh"],
  },
  {
    id: "art-p05",
    slug: "cach-dung-ai-cho-designer",
    title: "Designer dùng AI: Không phải để thay thế, mà để làm việc nhanh gấp đôi",
    excerpt: "AI không thay thế designer — nhưng designer dùng AI sẽ thay thế designer không dùng AI. Đây là những công cụ và quy trình giúp designer tăng tốc độ làm việc mà vẫn giữ nguyên chất lượng sáng tạo.",
    category: "AI",
    publishedAt: "2026-06-18",
    featured: false,
    relatedToolSlugs: ["midjourney", "canva-ai", "chatgpt"],
    relatedNeedSlugs: ["thiet-ke-hinh-anh", "viet-noi-dung"],
  },
  {
    id: "art-p06",
    slug: "cach-dung-ai-cho-lap-trinh-vien",
    title: "Lập trình viên dùng AI: Cursor, Claude và quy trình tăng tốc code mỗi ngày",
    excerpt: "AI đã thay đổi cách lập trình viên làm việc — không phải thay thế tư duy của developer, mà khuếch đại tốc độ thực thi. Đây là quy trình thực tế từ những developer đang dùng AI hiệu quả nhất.",
    category: "AI",
    publishedAt: "2026-06-20",
    featured: true,
    relatedToolSlugs: ["cursor", "claude", "chatgpt"],
    relatedNeedSlugs: ["lap-trinh", "phan-tich-du-lieu"],
  },
  {
    id: "art-p07",
    slug: "cach-dung-ai-cho-giao-vien",
    title: "Giáo viên dùng AI: Soạn giáo án, tạo bài kiểm tra và giải thích khái niệm khó",
    excerpt: "AI đang trở thành trợ lý đắc lực nhất cho giáo viên — không phải để thay thế giảng dạy, mà để giải phóng thời gian soạn tài liệu để giáo viên tập trung vào điều quan trọng hơn: hiểu và truyền cảm hứng cho học sinh.",
    category: "AI",
    publishedAt: "2026-06-22",
    featured: false,
    relatedToolSlugs: ["chatgpt", "gemini", "claude"],
    relatedNeedSlugs: ["viet-noi-dung", "nghien-cuu", "dich-thuat"],
  },
  {
    id: "art-p08",
    slug: "cach-dung-ai-cho-sinh-vien",
    title: "Sinh viên dùng AI đúng cách: Nghiên cứu nhanh, viết báo cáo, không đạo văn",
    excerpt: "AI là công cụ học tập mạnh nhất mà sinh viên hiện nay có — nhưng dùng sai sẽ phản tác dụng. Đây là cách dùng AI để học tốt hơn và không vi phạm học thuật.",
    category: "AI",
    publishedAt: "2026-06-24",
    featured: false,
    relatedToolSlugs: ["chatgpt", "perplexity", "gemini"],
    relatedNeedSlugs: ["nghien-cuu", "viet-noi-dung", "dich-thuat"],
  },
];

// ─────────────────────────────────────────────
// 5. AiPrompt
// ─────────────────────────────────────────────

export type AiPrompt = {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  toolSlug: string;
  needSlug: string;
  featured: boolean;
};

export const AI_PROMPTS: AiPrompt[] = [
  {
    id: "prompt-001",
    slug: "viet-bai-facebook-gioi-thieu-san-pham",
    title: "Viết bài Facebook giới thiệu sản phẩm",
    description: "Tạo bài viết Facebook hấp dẫn để giới thiệu sản phẩm, kèm hook mở đầu và call-to-action.",
    prompt:
      "Bạn là chuyên gia viết nội dung mạng xã hội cho thị trường Việt Nam. Hãy viết một bài Facebook để giới thiệu sản phẩm sau:\n\nTên sản phẩm: [TÊN SẢN PHẨM]\nĐặc điểm nổi bật: [MÔ TẢ ĐẶC ĐIỂM]\nKhách hàng mục tiêu: [ĐỐI TƯỢNG]\nGiá bán: [GIÁ]\n\nYêu cầu:\n- Mở đầu bằng một câu hook gây chú ý (đặt câu hỏi hoặc đưa ra con số ấn tượng)\n- Nêu rõ vấn đề khách hàng đang gặp phải\n- Giải thích sản phẩm giải quyết vấn đề đó thế nào\n- Kết thúc bằng call-to-action rõ ràng (comment, inbox, hoặc nhấn link)\n- Độ dài 150-250 từ, giọng văn gần gũi, tự nhiên như người thật viết\n- Thêm 3-5 emoji phù hợp tại các vị trí hợp lý",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: true,
  },
  {
    id: "prompt-002",
    slug: "viet-email-chao-hang-chuyen-nghiep",
    title: "Viết email chào hàng chuyên nghiệp",
    description: "Tạo email chào hàng thuyết phục, cá nhân hóa và có tỷ lệ phản hồi cao.",
    prompt:
      "Bạn là chuyên gia bán hàng B2B với 10 năm kinh nghiệm viết email lạnh (cold email) hiệu quả. Hãy viết một email chào hàng chuyên nghiệp với thông tin sau:\n\nNgành nghề người nhận: [NGÀNH NGHỀ]\nVấn đề họ thường gặp: [VẤN ĐỀ]\nSản phẩm/dịch vụ tôi muốn giới thiệu: [SẢN PHẨM]\nLợi ích cụ thể: [LỢI ÍCH]\n\nYêu cầu:\n- Tiêu đề email ngắn gọn, cá nhân hóa, không dùng từ spam\n- Mở đầu nhắc tới vấn đề cụ thể của họ (không nói về tôi trước)\n- Giới thiệu giải pháp ngắn gọn trong 2-3 câu\n- Đưa ra bằng chứng hoặc con số cụ thể nếu có\n- Kết thúc bằng CTA đơn giản: đề xuất cuộc gọi 15 phút hoặc demo\n- Tổng độ dài không quá 150 từ, giọng văn lịch sự nhưng tự tin",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: true,
  },
  {
    id: "prompt-003",
    slug: "tom-tat-tai-lieu-dai-5-diem-chinh",
    title: "Tóm tắt tài liệu dài thành 5 điểm chính",
    description: "Trích xuất nhanh 5 insight quan trọng nhất từ tài liệu dài hoặc PDF.",
    prompt:
      "Bạn là trợ lý nghiên cứu chuyên nghiệp. Tôi sẽ cung cấp cho bạn một đoạn văn bản hoặc tài liệu dài. Hãy phân tích và tóm tắt theo yêu cầu sau:\n\n[DÁN NỘI DUNG TÀI LIỆU VÀO ĐÂY]\n\nSau khi đọc, hãy trả lời theo cấu trúc:\n1. Chủ đề chính: (1 câu mô tả tài liệu nói về gì)\n2. Năm điểm chính: (liệt kê 5 ý quan trọng nhất, mỗi ý 1-2 câu)\n3. Số liệu đáng chú ý: (nêu các con số, thống kê quan trọng nếu có)\n4. Kết luận hoặc khuyến nghị: (tóm tắt kết luận của tài liệu)\n5. Câu hỏi cần làm rõ thêm: (2-3 điểm bạn cần tìm hiểu thêm về chủ đề này)\n\nViết bằng tiếng Việt, ngắn gọn và dễ hiểu.",
    category: "Nghiên cứu",
    toolSlug: "claude",
    needSlug: "nghien-cuu",
    featured: true,
  },
  {
    id: "prompt-004",
    slug: "len-ke-hoach-noi-dung-30-ngay",
    title: "Lên kế hoạch nội dung 30 ngày",
    description: "Tạo lịch nội dung chi tiết cho 30 ngày với đa dạng chủ đề và định dạng bài viết.",
    prompt:
      "Bạn là chiến lược gia nội dung (content strategist) chuyên về mạng xã hội tại Việt Nam. Hãy tạo kế hoạch nội dung cho 30 ngày tới với thông tin sau:\n\nLĩnh vực/ngành: [LĨNH VỰC]\nNền tảng đăng bài: [FACEBOOK / INSTAGRAM / TIKTOK / LINKEDIN]\nMục tiêu: [XÂY DỰNG THƯƠNG HIỆU / BÁN HÀNG / TĂNG FOLLOW]\nTần suất đăng: [SỐ BÀI/TUẦN]\n\nHãy lập bảng kế hoạch bao gồm:\n- Ngày đăng bài\n- Chủ đề bài viết\n- Loại nội dung (tip, story, giới thiệu sản phẩm, hỏi đáp, behind-the-scenes...)\n- Ý tưởng hook mở đầu\n- Hashtag gợi ý\n\nĐảm bảo đa dạng chủ đề, không lặp lại quá nhiều và xen kẽ giữa nội dung giáo dục, giải trí và bán hàng theo tỷ lệ 60-20-20.",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: true,
  },
  {
    id: "prompt-005",
    slug: "phan-tich-diem-manh-yeu-doi-thu",
    title: "Phân tích điểm mạnh/yếu của đối thủ",
    description: "Nghiên cứu toàn diện về đối thủ cạnh tranh để tìm ra cơ hội cho sản phẩm của mình.",
    prompt:
      "Hãy nghiên cứu và phân tích đối thủ cạnh tranh sau đây cho tôi:\n\nTên đối thủ: [TÊN CÔNG TY/THƯƠNG HIỆU]\nNgành: [NGÀNH NGHỀ]\nThị trường: [VIỆT NAM / ĐÔNG NAM Á / ...]\n\nPhân tích theo các tiêu chí:\n1. Sản phẩm/dịch vụ: họ cung cấp gì, giá như thế nào\n2. Điểm mạnh rõ ràng: họ đang làm tốt điều gì\n3. Điểm yếu/hạn chế: khách hàng phàn nàn điều gì về họ\n4. Chiến lược marketing: họ đang dùng kênh nào, thông điệp gì\n5. Tệp khách hàng: họ đang phục vụ ai\n6. Cơ hội cho tôi: tôi có thể cạnh tranh hoặc khác biệt thế nào\n\nDùng nguồn thông tin từ website, review khách hàng, mạng xã hội và tin tức gần đây. Trích dẫn nguồn cho mỗi thông tin.",
    category: "Marketing",
    toolSlug: "perplexity",
    needSlug: "marketing",
    featured: false,
  },
  {
    id: "prompt-006",
    slug: "viet-kich-ban-video-youtube",
    title: "Viết kịch bản video YouTube",
    description: "Tạo kịch bản video YouTube hoàn chỉnh với hook, nội dung và outro chuyên nghiệp.",
    prompt:
      "Bạn là người viết kịch bản YouTube chuyên nghiệp với kinh nghiệm tạo ra các video đạt hàng triệu lượt xem. Hãy viết kịch bản cho video với thông tin:\n\nChủ đề video: [CHỦ ĐỀ]\nĐộ dài mục tiêu: [5 / 10 / 15 PHÚT]\nĐối tượng xem: [MÔ TẢ KHÁN GIẢ]\nMục tiêu video: [GIÁO DỤC / BÁN HÀNG / XÂY DỰNG THƯƠNG HIỆU]\n\nKịch bản cần có:\n- HOOK (0-15 giây): câu mở đầu gây tò mò hoặc hứa hẹn giá trị\n- GIỚI THIỆU (15-45 giây): bạn là ai, video này cho ai\n- NỘI DUNG CHÍNH: chia thành 3-5 phần rõ ràng với transition\n- CTA GIỮA VIDEO: nhắc subscribe hoặc tương tác nhẹ nhàng\n- KẾT LUẬN: tóm tắt bài học chính\n- OUTRO: CTA cuối và gợi ý xem video tiếp theo\n\nViết theo dạng lời nói tự nhiên, không quá formal, kèm ghi chú [B-ROLL] hoặc [GRAPHICS] tại các điểm cần hình ảnh minh họa.",
    category: "Làm video",
    toolSlug: "chatgpt",
    needSlug: "lam-video",
    featured: true,
  },
  {
    id: "prompt-007",
    slug: "viet-mo-ta-san-pham-ban-hang-online",
    title: "Viết mô tả sản phẩm bán hàng online",
    description: "Tạo mô tả sản phẩm hấp dẫn cho Shopee, Lazada, TikTok Shop hoặc website.",
    prompt:
      "Bạn là chuyên gia viết mô tả sản phẩm cho thương mại điện tử Việt Nam. Hãy viết mô tả sản phẩm đầy đủ cho:\n\nTên sản phẩm: [TÊN]\nDanh mục: [DANH MỤC]\nĐặc điểm kỹ thuật: [THÔNG SỐ]\nGiá bán: [GIÁ]\nNền tảng bán: [SHOPEE / LAZADA / TIKTOK SHOP / WEBSITE]\n\nViết theo cấu trúc:\n1. Tiêu đề sản phẩm: tối ưu từ khóa, bao gồm tên + đặc điểm nổi bật + thương hiệu (dưới 150 ký tự)\n2. Mô tả ngắn: 3-5 bullet points nêu lợi ích chính (không phải tính năng)\n3. Mô tả chi tiết: 200-400 từ, bắt đầu bằng pain point của khách hàng, sau đó giải thích sản phẩm giải quyết thế nào\n4. Thông số kỹ thuật: bảng hoặc danh sách rõ ràng\n5. Hướng dẫn sử dụng: các bước đơn giản\n6. Cam kết/chính sách: đổi trả, bảo hành\n\nTối ưu cho tìm kiếm trên sàn TMĐT Việt Nam.",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: false,
  },
  {
    id: "prompt-008",
    slug: "nghien-cuu-xu-huong-thi-truong-moi-nhat",
    title: "Nghiên cứu xu hướng thị trường mới nhất",
    description: "Tìm hiểu xu hướng thị trường hiện tại với nguồn dẫn chứng cụ thể và dữ liệu cập nhật.",
    prompt:
      "Hãy nghiên cứu xu hướng thị trường hiện tại cho tôi trong lĩnh vực:\n\nLĩnh vực: [NGÀNH NGHỀ]\nKhu vực địa lý: [VIỆT NAM / ĐÔNG NAM Á / TOÀN CẦU]\nKhung thời gian: 6-12 tháng gần nhất\n\nCung cấp thông tin:\n1. Top 5 xu hướng lớn nhất hiện nay trong lĩnh vực này\n2. Số liệu tăng trưởng thị trường (kèm nguồn)\n3. Những thay đổi hành vi người tiêu dùng đáng chú ý\n4. Các đối thủ/thương hiệu đang tăng trưởng nhanh nhất\n5. Cơ hội kinh doanh chưa được khai thác\n6. Rủi ro và thách thức cần lưu ý\n\nMỗi điểm cần có nguồn dẫn chứng cụ thể (báo cáo, bài báo, dữ liệu). Ưu tiên nguồn từ năm nay hoặc năm ngoái.",
    category: "Nghiên cứu",
    toolSlug: "perplexity",
    needSlug: "nghien-cuu",
    featured: false,
  },
  {
    id: "prompt-009",
    slug: "lap-ke-hoach-hoc-tap-3-thang",
    title: "Lập kế hoạch học tập 3 tháng",
    description: "Tạo lộ trình học tập chi tiết và khả thi cho bất kỳ kỹ năng hoặc lĩnh vực nào.",
    prompt:
      "Bạn là chuyên gia tư vấn học tập và phát triển bản thân. Hãy tạo kế hoạch học tập 3 tháng cho tôi:\n\nKỹ năng/lĩnh vực muốn học: [KỸ NĂNG]\nMục tiêu cụ thể sau 3 tháng: [MỤC TIÊU]\nThời gian có thể học mỗi ngày: [SỐ GIỜ]\nKiến thức nền hiện tại: [MÔ TẢ TRÌNH ĐỘ HIỆN TẠI]\nNgân sách cho khóa học/tài liệu: [NGÂN SÁCH]\n\nKế hoạch cần bao gồm:\n- Tháng 1: giai đoạn nền tảng (mục tiêu + hoạt động hàng tuần)\n- Tháng 2: giai đoạn thực hành (dự án thực tế)\n- Tháng 3: giai đoạn nâng cao và ứng dụng\n- Nguồn tài liệu miễn phí và trả phí cụ thể\n- Cách đo lường tiến độ sau mỗi tháng\n- Milestone cụ thể để biết mình đang đúng hướng\n\nKế hoạch phải thực tế, không quá tải và có thể thực hiện ngay từ ngày mai.",
    category: "Nghiên cứu",
    toolSlug: "chatgpt",
    needSlug: "nghien-cuu",
    featured: false,
  },
  {
    id: "prompt-010",
    slug: "tao-20-y-tuong-noi-dung-thang-toi",
    title: "Tạo 20 ý tưởng nội dung cho tháng tới",
    description: "Brainstorm nhanh 20 ý tưởng nội dung đa dạng, phù hợp với thương hiệu và đối tượng.",
    prompt:
      "Bạn là creative director chuyên về content marketing. Hãy brainstorm 20 ý tưởng nội dung cho tháng tới với thông tin:\n\nThương hiệu/cá nhân: [MÔ TẢ]\nNgành: [NGÀNH]\nNền tảng chính: [FACEBOOK / INSTAGRAM / TIKTOK / LINKEDIN]\nĐối tượng mục tiêu: [MÔ TẢ]\nGiọng điệu thương hiệu: [CHUYÊN NGHIỆP / GẦN GŨI / HÀI HƯỚC / ...]\n\nTạo 20 ý tưởng đa dạng, bao gồm:\n- 5 bài giáo dục/tips hữu ích\n- 4 bài kể chuyện (story) cá nhân hoặc khách hàng\n- 3 bài giới thiệu sản phẩm/dịch vụ tự nhiên\n- 3 bài behind-the-scenes hoặc quá trình làm việc\n- 3 bài tương tác (câu hỏi, poll, challenge)\n- 2 bài trending hoặc bắt trend phù hợp\n\nMỗi ý tưởng ghi rõ: tiêu đề gợi ý + dạng bài viết + hook mở đầu + tại sao ý tưởng này phù hợp với đối tượng.",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: false,
  },
  {
    id: "prompt-011",
    slug: "dich-tai-lieu-tieng-anh-sang-tieng-viet-tu-nhien",
    title: "Dịch tài liệu tiếng Anh sang tiếng Việt tự nhiên",
    description: "Dịch văn bản kỹ thuật hoặc tài liệu dài với chất lượng tự nhiên, giữ nguyên nghĩa gốc.",
    prompt:
      "Bạn là dịch giả chuyên nghiệp chuyên dịch tài liệu kinh doanh và kỹ thuật từ tiếng Anh sang tiếng Việt. Hãy dịch đoạn văn bản sau:\n\n[DÁN VĂN BẢN TIẾNG ANH VÀO ĐÂY]\n\nYêu cầu dịch:\n- Dịch tự nhiên như người Việt viết, không dịch từng từ cứng nhắc\n- Giữ nguyên thuật ngữ chuyên ngành nếu tiếng Việt chưa có từ tương đương (có thể để trong ngoặc đơn kèm giải thích)\n- Giữ nguyên cấu trúc đoạn văn, heading và bullet point của bản gốc\n- Tên riêng, tên công ty, tên sản phẩm giữ nguyên tiếng Anh\n- Số liệu, ngày tháng giữ nguyên theo định dạng gốc\n- Sau khi dịch xong, ghi chú các từ/cụm từ bạn không chắc chắn về cách dịch",
    category: "Dịch thuật",
    toolSlug: "chatgpt",
    needSlug: "dich-thuat",
    featured: false,
  },
  {
    id: "prompt-012",
    slug: "phan-tich-so-lieu-ban-hang-va-dua-ra-insight",
    title: "Phân tích số liệu bán hàng và đưa ra insight",
    description: "Phân tích dữ liệu bán hàng thô và nhận ngay các insight và khuyến nghị hành động.",
    prompt:
      "Bạn là chuyên gia phân tích dữ liệu kinh doanh. Tôi sẽ cung cấp số liệu bán hàng và cần bạn phân tích:\n\n[DÁN SỐ LIỆU VÀO ĐÂY — có thể là bảng Excel, CSV hoặc danh sách]\n\nPhân tích và trả lời:\n1. Tổng quan: doanh thu tổng, đơn hàng, giá trị đơn trung bình\n2. Xu hướng: tăng hay giảm so với kỳ trước? Vì sao?\n3. Sản phẩm tốt nhất: top 3 sản phẩm bán chạy nhất\n4. Sản phẩm cần cải thiện: sản phẩm bán kém, cần xem xét\n5. Thời điểm bán tốt: ngày/giờ/tuần nào bán nhiều nhất\n6. Khách hàng: khách mua lại hay chủ yếu là khách mới\n7. Cơ hội rõ ràng: 3 điều tôi nên làm ngay để tăng doanh thu\n8. Rủi ro: điều gì cần chú ý hoặc có thể gây giảm doanh thu\n\nViết ngắn gọn, dùng bullet points, ưu tiên thông tin thực tế có thể hành động ngay.",
    category: "Phân tích dữ liệu",
    toolSlug: "chatgpt",
    needSlug: "phan-tich-du-lieu",
    featured: false,
  },
  {
    id: "prompt-013",
    slug: "viet-caption-instagram-hap-dan",
    title: "Viết caption Instagram hấp dẫn",
    description: "Tạo caption Instagram cuốn hút với hook mạnh, nội dung giá trị và hashtag tối ưu.",
    prompt:
      "Bạn là chuyên gia content Instagram với tệp follower trung thành và tỷ lệ tương tác cao. Hãy viết caption cho bài đăng Instagram:\n\nChủ đề/nội dung hình ảnh: [MÔ TẢ HÌNH]\nThông điệp muốn truyền đạt: [THÔNG ĐIỆP]\nĐối tượng theo dõi: [MÔ TẢ]\nPhong cách tài khoản: [LIFESTYLE / BUSINESS / PERSONAL BRAND / ...]\n\nViết caption bao gồm:\n- Dòng đầu tiên: hook cực mạnh (câu hỏi, sự thật gây sốc, hoặc câu nói chạm cảm xúc)\n- Phần thân: nội dung giá trị hoặc câu chuyện ngắn (3-5 câu)\n- Kết thúc: CTA tương tác (hỏi ý kiến, tag bạn bè, hoặc save để xem lại)\n- Hashtag: 10-15 hashtag phù hợp, mix giữa phổ biến và niche\n\nViết 2 phiên bản: một ngắn (dưới 150 từ) và một dài hơn (150-300 từ) để tôi chọn.",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: false,
  },
  {
    id: "prompt-014",
    slug: "tao-prompt-midjourney-cho-banner-quang-cao",
    title: "Tạo prompt Midjourney cho banner quảng cáo",
    description: "Tạo prompt tiếng Anh chi tiết để generate hình ảnh banner quảng cáo chuyên nghiệp với Midjourney.",
    prompt:
      "Bạn là chuyên gia viết prompt cho Midjourney, chuyên tạo hình ảnh quảng cáo thương mại chất lượng cao. Hãy viết prompt Midjourney chi tiết cho banner quảng cáo:\n\nSản phẩm/dịch vụ: [MÔ TẢ]\nTông màu thương hiệu: [MÀU SẮC]\nPhong cách thiết kế: [HIỆN ĐẠI / TỐI GIẢN / SANG TRỌNG / ...]\nKhách hàng mục tiêu: [ĐỐI TƯỢNG]\nKích thước: [1:1 / 16:9 / 9:16]\n\nViết prompt theo cấu trúc:\n1. Mô tả cảnh chính (subject)\n2. Phong cách (style, art direction)\n3. Ánh sáng và màu sắc (lighting, color palette)\n4. Chất lượng và thông số kỹ thuật (quality parameters)\n5. Tham số Midjourney: --ar [tỷ lệ] --v 6 --q 2\n\nViết 3 biến thể prompt khác nhau để tôi thử nghiệm. Viết prompt bằng tiếng Anh và giải thích mỗi prompt bằng tiếng Việt.",
    category: "Thiết kế hình ảnh",
    toolSlug: "chatgpt",
    needSlug: "thiet-ke-hinh-anh",
    featured: false,
  },
  {
    id: "prompt-015",
    slug: "review-va-cai-thien-doan-code-python",
    title: "Đánh giá và cải thiện đoạn code Python",
    description: "Nhờ AI đánh giá code Python, tìm lỗi, tối ưu hiệu suất và đề xuất cải tiến.",
    prompt:
      "Bạn là senior Python developer với 10 năm kinh nghiệm. Hãy đánh giá đoạn code sau và đưa ra phản hồi chi tiết:\n\n```python\n[DÁN CODE VÀO ĐÂY]\n```\n\nPhân tích theo các tiêu chí:\n1. Lỗi (bugs): có lỗi logic hoặc runtime error nào không? Chỉ rõ dòng nào và giải thích\n2. Code style: có tuân theo PEP 8 và best practices Python không?\n3. Hiệu suất: có chỗ nào có thể tối ưu tốc độ hoặc bộ nhớ không?\n4. Bảo mật: có vấn đề bảo mật tiềm ẩn nào không (SQL injection, input validation...)?\n5. Khả năng bảo trì: code có dễ đọc, dễ sửa sau này không?\n6. Edge cases: có trường hợp đặc biệt nào code chưa xử lý?\n\nSau phần phân tích, viết lại đoạn code đã được cải thiện và giải thích những thay đổi bạn đã thực hiện.",
    category: "Lập trình",
    toolSlug: "claude",
    needSlug: "lap-trinh",
    featured: false,
  },
  {
    id: "prompt-016",
    slug: "viet-readme-cho-du-an-github",
    title: "Viết README cho dự án GitHub",
    description: "Tạo file README chuyên nghiệp và đầy đủ cho dự án mã nguồn mở hoặc cá nhân trên GitHub.",
    prompt:
      "Bạn là developer có kinh nghiệm viết tài liệu kỹ thuật chuyên nghiệp. Hãy viết file README.md cho dự án GitHub sau:\n\nTên dự án: [TÊN]\nMô tả ngắn: [MÔ TẢ]\nCông nghệ sử dụng: [TECH STACK]\nTính năng chính: [TÍNH NĂNG]\nĐối tượng người dùng: [AI DÙNG]\n\nViết README theo cấu trúc chuẩn:\n- Badge (build status, license, version)\n- Mô tả và tính năng nổi bật\n- Screenshot hoặc GIF demo (ghi chú chỗ cần thêm)\n- Yêu cầu hệ thống (Prerequisites)\n- Hướng dẫn cài đặt từng bước\n- Hướng dẫn sử dụng với ví dụ code\n- Cấu trúc thư mục dự án\n- Hướng dẫn đóng góp (Contributing)\n- License\n- Liên hệ tác giả\n\nViết bằng tiếng Anh, dùng Markdown đúng cú pháp, rõ ràng và thân thiện với người mới.",
    category: "Lập trình",
    toolSlug: "claude",
    needSlug: "lap-trinh",
    featured: false,
  },
  {
    id: "prompt-017",
    slug: "len-chien-luoc-marketing-san-pham-moi",
    title: "Lên chiến lược marketing cho sản phẩm mới",
    description: "Xây dựng chiến lược marketing toàn diện từ đầu cho sản phẩm hoặc dịch vụ mới ra mắt.",
    prompt:
      "Bạn là CMO (Giám đốc Marketing) với kinh nghiệm ra mắt sản phẩm thành công tại thị trường Việt Nam. Hãy xây dựng chiến lược marketing cho:\n\nSản phẩm/dịch vụ: [MÔ TẢ]\nGiá bán: [GIÁ]\nThị trường mục tiêu: [ĐỊA LÝ / PHÂN KHÚC]\nNgân sách marketing: [NGÂN SÁCH]\nThời gian ra mắt: [THỜI GIAN]\nĐiểm khác biệt so với đối thủ: [USP]\n\nXây dựng chiến lược bao gồm:\n1. Phân tích thị trường và đối thủ (tóm tắt)\n2. Xác định khách hàng mục tiêu (buyer persona)\n3. Thông điệp marketing chủ đạo\n4. Kênh marketing ưu tiên và lý do\n5. Kế hoạch 3 giai đoạn: pre-launch, launch, post-launch\n6. Phân bổ ngân sách cho từng kênh\n7. KPIs cần đo lường\n8. Rủi ro và kế hoạch dự phòng\n\nƯu tiên các chiến thuật có chi phí thấp nhưng hiệu quả cao phù hợp với SME Việt Nam.",
    category: "Marketing",
    toolSlug: "chatgpt",
    needSlug: "marketing",
    featured: true,
  },
  {
    id: "prompt-018",
    slug: "viet-bai-blog-seo-chu-de-ai",
    title: "Viết bài blog SEO về chủ đề AI",
    description: "Tạo bài viết blog chuyên sâu, tối ưu SEO và thực sự hữu ích cho người đọc về AI.",
    prompt:
      "Bạn là chuyên gia SEO content với kinh nghiệm viết bài blog đạt top Google tại Việt Nam. Hãy viết bài blog SEO về chủ đề:\n\nChủ đề: [CHỦ ĐỀ AI]\nTừ khóa chính: [TỪ KHÓA]\nTừ khóa phụ: [TỪ KHÓA PHỤ]\nĐộ dài mục tiêu: [1500 / 2000 / 3000 từ]\nĐối tượng đọc: [MÔ TẢ NGƯỜI ĐỌC]\n\nBài viết cần:\n- Tiêu đề H1 chứa từ khóa chính, hấp dẫn và dưới 60 ký tự\n- Meta description 150-160 ký tự\n- Mở đầu: đặt vấn đề, nêu những gì bài viết sẽ trả lời\n- Cấu trúc H2/H3 rõ ràng, mỗi heading chứa từ khóa hoặc biến thể\n- Nội dung thực sự hữu ích, có ví dụ cụ thể, không lý thuyết suông\n- Bảng so sánh hoặc bullet points để dễ đọc\n- Internal link placeholder: [LINK: CHỦ ĐỀ LIÊN QUAN]\n- Kết luận tóm tắt và CTA rõ ràng\n- Tối ưu đọc trên mobile: đoạn văn ngắn 2-3 câu",
    category: "Viết nội dung",
    toolSlug: "claude",
    needSlug: "viet-noi-dung",
    featured: false,
  },
  {
    id: "prompt-019",
    slug: "tao-outline-khoa-hoc-online",
    title: "Tạo outline khóa học online",
    description: "Thiết kế cấu trúc khóa học online chuyên nghiệp với mục tiêu học tập rõ ràng.",
    prompt:
      "Bạn là instructional designer (chuyên gia thiết kế đào tạo) có kinh nghiệm xây dựng các khóa học online thành công. Hãy tạo outline chi tiết cho:\n\nTên khóa học: [TÊN]\nChủ đề: [CHỦ ĐỀ]\nĐối tượng học viên: [MÔ TẢ]\nThời lượng: [SỐ GIỜ]\nĐịnh dạng: [VIDEO / LIVE / HYBRID]\nMức độ: [NGƯỜI MỚI / TRUNG CẤP / NÂNG CAO]\n\nOutline cần bao gồm:\n- Mục tiêu khóa học (3-5 learning outcomes cụ thể, đo được)\n- Ai nên học và ai không nên học\n- Cấu trúc module (chia thành 4-8 module)\n- Mỗi module: tên, mục tiêu, danh sách bài học, bài tập thực hành\n- Thứ tự học lý tưởng (từ đơn giản đến phức tạp)\n- Tài liệu bổ sung cho từng module\n- Bài kiểm tra hoặc dự án cuối khóa\n- Thời lượng ước tính cho từng bài\n\nÁp dụng nguyên tắc adult learning: học bằng thực hành, liên kết với công việc thực tế.",
    category: "Nghiên cứu",
    toolSlug: "chatgpt",
    needSlug: "nghien-cuu",
    featured: false,
  },
  {
    id: "prompt-020",
    slug: "viet-email-nurturing-chuoi-5-buoc",
    title: "Viết email nurturing chuỗi 5 bước",
    description: "Tạo chuỗi email tự động nuôi dưỡng lead từ lúc đăng ký đến khi sẵn sàng mua hàng.",
    prompt:
      "Bạn là chuyên gia email marketing với tỷ lệ chuyển đổi lead-to-customer trên 15%. Hãy viết chuỗi 5 email nurturing cho:\n\nSản phẩm/dịch vụ: [MÔ TẢ]\nGiá trị cốt lõi: [LỢI ÍCH CHÍNH]\nVấn đề khách hàng: [PAIN POINT]\nThời gian gửi: Email 1 (ngay), 2 (ngày 2), 3 (ngày 4), 4 (ngày 7), 5 (ngày 14)\n\nChuỗi email theo cấu trúc:\n- Email 1: Chào mừng + giao ngay giá trị (không bán hàng)\n- Email 2: Giáo dục về vấn đề họ đang gặp\n- Email 3: Chia sẻ case study / testimonial thực tế\n- Email 4: Xử lý objection phổ biến nhất\n- Email 5: Offer có giới hạn thời gian + CTA mua hàng\n\nMỗi email cần: tiêu đề email (A/B test 2 phiên bản), preview text, nội dung (150-300 từ) và CTA rõ ràng. Giọng văn thân thiện, không spam.",
    category: "Marketing",
    toolSlug: "chatgpt",
    needSlug: "marketing",
    featured: false,
  },
  {
    id: "prompt-021",
    slug: "phan-tich-feedback-khach-hang",
    title: "Phân tích feedback khách hàng",
    description: "Phân tích tổng hợp phản hồi từ khách hàng để tìm ra insight và cải thiện sản phẩm.",
    prompt:
      "Bạn là chuyên gia phân tích trải nghiệm khách hàng (CX analyst). Tôi có tập hợp feedback từ khách hàng và cần bạn phân tích:\n\n[DÁN DANH SÁCH FEEDBACK/REVIEW VÀO ĐÂY]\n\nPhân tích và tổng hợp:\n1. Chủ đề phổ biến: nhóm các feedback theo chủ đề (sản phẩm, giao hàng, dịch vụ...)\n2. Điểm mạnh được khen nhiều nhất: top 3 điều khách hàng hài lòng\n3. Vấn đề được phàn nàn nhiều nhất: top 3 vấn đề cần cải thiện\n4. Feedback bất ngờ: điều gì khách hàng đề cập mà bạn không mong đợi\n5. Cảm xúc tổng thể: tỷ lệ ước tính positive / neutral / negative\n6. Trích dẫn nổi bật: 5 review đáng dùng làm testimonial\n7. Hành động cụ thể: 5 việc cần làm ngay để cải thiện điểm yếu\n\nTrình bày dưới dạng báo cáo ngắn gọn, có thể chia sẻ cho team.",
    category: "Phân tích dữ liệu",
    toolSlug: "chatgpt",
    needSlug: "phan-tich-du-lieu",
    featured: false,
  },
  {
    id: "prompt-022",
    slug: "tao-faq-cho-trang-ban-hang",
    title: "Tạo FAQ cho trang bán hàng",
    description: "Xây dựng phần Câu hỏi thường gặp thuyết phục, xử lý objection và tăng tỷ lệ mua hàng.",
    prompt:
      "Bạn là chuyên gia conversion rate optimization (CRO) và copywriting bán hàng. Hãy tạo phần FAQ cho trang bán hàng:\n\nSản phẩm/dịch vụ: [MÔ TẢ]\nGiá: [GIÁ]\nCác objection phổ biến từ khách: [LIỆT KÊ NHỮNG GÌ KHÁCH HÀNG HAY THẮC MẮC]\nChính sách hoàn tiền/bảo hành: [CHÍNH SÁCH]\n\nTạo 12-15 câu hỏi FAQ bao gồm:\n- 3-4 câu hỏi về sản phẩm/dịch vụ (tính năng, cách hoạt động)\n- 2-3 câu hỏi về giá và thanh toán\n- 2-3 câu hỏi về quá trình mua/đăng ký\n- 2-3 câu hỏi về kết quả kỳ vọng và thời gian\n- 2-3 câu hỏi xử lý objection (đắt quá, chưa cần, sợ không phù hợp)\n\nMỗi câu trả lời: ngắn gọn (2-4 câu), trực tiếp và tự tin. Không dùng từ ngữ mơ hồ. Kết thúc một số câu trả lời bằng CTA nhẹ nhàng.",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: false,
  },
  {
    id: "prompt-023",
    slug: "viet-testimonial-tu-goc-nhin-khach-hang",
    title: "Viết testimonial từ góc nhìn khách hàng",
    description: "Tạo testimonial chân thực và thuyết phục dựa trên thông tin thực tế từ khách hàng.",
    prompt:
      "Bạn là copywriter chuyên viết social proof và testimonial cho các thương hiệu Việt Nam. Hãy viết testimonial từ góc nhìn khách hàng dựa trên thông tin:\n\nTên khách hàng: [TÊN]\nNghề nghiệp/vai trò: [NGHỀ]\nSản phẩm/dịch vụ đã dùng: [SẢN PHẨM]\nVấn đề trước khi dùng: [VẤN ĐỀ]\nKết quả cụ thể sau khi dùng: [KẾT QUẢ CỤ THỂ]\nThời gian đạt kết quả: [THỜI GIAN]\n\nViết 3 phiên bản testimonial:\n1. Ngắn (50-80 từ): dùng cho quote trên landing page\n2. Trung bình (100-150 từ): dùng cho mạng xã hội\n3. Dài (200-300 từ): dùng cho case study hoặc email marketing\n\nGiọng văn phải tự nhiên như người thật nói chuyện — không quá formal, không sử dụng từ ngữ marketing lộ liễu. Nhấn mạnh kết quả cụ thể và cảm xúc thực sự.",
    category: "Marketing",
    toolSlug: "chatgpt",
    needSlug: "marketing",
    featured: false,
  },
  {
    id: "prompt-024",
    slug: "nghien-cuu-va-so-sanh-3-cong-cu-ai",
    title: "Nghiên cứu và so sánh 3 công cụ AI",
    description: "So sánh toàn diện 3 công cụ AI cụ thể để đưa ra quyết định lựa chọn đúng đắn.",
    prompt:
      "Hãy nghiên cứu và so sánh 3 công cụ AI sau đây dựa trên thông tin mới nhất:\n\nCông cụ cần so sánh:\n1. [CÔNG CỤ 1]\n2. [CÔNG CỤ 2]\n3. [CÔNG CỤ 3]\n\nMục đích sử dụng của tôi: [MÔ TẢ CÁCH BẠN MUỐN DÙNG]\nNgân sách: [MIỄN PHÍ / DƯỚI $20/THÁNG / LINH HOẠT]\n\nSo sánh theo tiêu chí:\n1. Tính năng chính và điểm nổi bật\n2. Giá cả (bản free và bản trả phí)\n3. Ưu điểm so với hai công cụ kia\n4. Hạn chế và nhược điểm\n5. Phù hợp nhất cho ai\n6. Đánh giá của cộng đồng người dùng (nguồn dẫn chứng)\n\nKết luận: với mục đích sử dụng của tôi, bạn khuyên dùng công cụ nào và vì sao? Kèm lý do cụ thể.",
    category: "Nghiên cứu",
    toolSlug: "perplexity",
    needSlug: "nghien-cuu",
    featured: false,
  },
  {
    id: "prompt-025",
    slug: "viet-thong-bao-noi-bo-chuyen-nghiep",
    title: "Viết thông báo nội bộ chuyên nghiệp",
    description: "Soạn thông báo nội bộ rõ ràng, lịch sự và truyền đạt đúng thông điệp đến toàn đội ngũ.",
    prompt:
      "Bạn là chuyên gia truyền thông nội bộ doanh nghiệp. Hãy soạn thông báo nội bộ cho:\n\nChủ đề thông báo: [CHỦ ĐỀ]\nNội dung cần truyền đạt: [NỘI DUNG CHÍNH]\nĐối tượng nhận: [TOÀN CÔNG TY / PHÒNG BAN / NHÓM CỤ THỂ]\nMức độ khẩn cấp: [THÔNG THƯỜNG / QUAN TRỌNG / KHẨN]\nHành động yêu cầu từ người nhận: [NẾU CÓ]\nDeadline (nếu có): [THỜI HẠN]\n\nViết thông báo theo cấu trúc:\n- Tiêu đề rõ ràng, ngắn gọn\n- Mở đầu: mục đích của thông báo\n- Nội dung chính: thông tin cần biết, rõ ràng và đủ\n- Hành động cần thực hiện (nếu có): bullet points từng bước\n- Thời hạn và liên hệ nếu có câu hỏi\n- Chữ ký và chức vụ người gửi\n\nGiọng văn: lịch sự, chuyên nghiệp nhưng không cứng nhắc. Đủ thông tin nhưng không lan man.",
    category: "Viết nội dung",
    toolSlug: "chatgpt",
    needSlug: "viet-noi-dung",
    featured: false,
  },
  {
    id: "prompt-026",
    slug: "tao-prompt-generate-hinh-anh-san-pham",
    title: "Tạo prompt để generate hình ảnh sản phẩm",
    description: "Tạo prompt AI image chi tiết để tạo ra ảnh sản phẩm chuyên nghiệp không cần studio.",
    prompt:
      "Bạn là chuyên gia product photography và AI image generation. Hãy tạo prompt để generate hình ảnh sản phẩm đẹp bằng AI:\n\nSản phẩm: [MÔ TẢ SẢN PHẨM]\nPhong cách ảnh mong muốn: [STUDIO TRẮNG / LIFESTYLE / OUTDOOR / FLAT LAY]\nMàu nền: [MÀU]\nÁnh sáng: [TỰ NHIÊN / ÁNH ĐÈN STUDIO / CHIAROSCURO]\nĐối tượng mua: [KHÁCH HÀNG]\nNền tảng dùng ảnh: [SHOPEE / WEBSITE / INSTAGRAM]\n\nTạo 3 prompt cho 3 góc chụp khác nhau:\n1. Góc chính diện (hero shot)\n2. Góc đặc tả (detail/close-up)\n3. Góc lifestyle (sản phẩm trong ngữ cảnh sử dụng)\n\nMỗi prompt viết bằng tiếng Anh, bao gồm: mô tả sản phẩm + bố cục ảnh + ánh sáng + phong cách + tham số kỹ thuật. Kèm giải thích tiếng Việt cho từng prompt. Phù hợp với DALL-E 3 hoặc Midjourney.",
    category: "Thiết kế hình ảnh",
    toolSlug: "chatgpt",
    needSlug: "thiet-ke-hinh-anh",
    featured: false,
  },
  {
    id: "prompt-027",
    slug: "viet-script-reels-tiktok-60-giay",
    title: "Viết script cho Reels/TikTok 60 giây",
    description: "Tạo kịch bản video ngắn 60 giây hấp dẫn cho Instagram Reels hoặc TikTok.",
    prompt:
      "Bạn là người sáng tạo nội dung TikTok/Reels với kinh nghiệm tạo ra các video viral và đạt triệu view. Hãy viết script video 60 giây cho:\n\nChủ đề: [CHỦ ĐỀ]\nMục tiêu video: [GIÁO DỤC / GIẢI TRÍ / BÁN HÀNG / XÂY DỰNG THƯƠNG HIỆU]\nNgành nghề/lĩnh vực: [LĨNH VỰC]\nPhong cách: [MẶT-CAM / VOICEOVER / TEXT-ON-SCREEN / HỖN HỢP]\n\nScript theo cấu trúc thời gian:\n- 0-3 giây HOOK: câu mở đầu gây tò mò tức thì (quan trọng nhất!)\n- 3-15 giây: nêu vấn đề hoặc hứa hẹn\n- 15-45 giây: nội dung chính (tip, demo, câu chuyện)\n- 45-55 giây: kết luận hoặc twist bất ngờ\n- 55-60 giây: CTA (follow, comment, lưu video)\n\nCho mỗi đoạn: lời thoại (nói gì) + mô tả hình ảnh/hành động (làm gì trên màn hình) + text overlay (chữ hiện trên màn hình). Viết lời thoại như người nói chuyện thật, không phải đọc bài.",
    category: "Làm video",
    toolSlug: "chatgpt",
    needSlug: "lam-video",
    featured: true,
  },
  {
    id: "prompt-028",
    slug: "phan-tich-chien-luoc-affiliate-thanh-cong",
    title: "Phân tích chiến lược Affiliate thành công",
    description: "Nghiên cứu và học hỏi từ các affiliate marketer thành công trong cùng niche.",
    prompt:
      "Hãy nghiên cứu và phân tích các chiến lược affiliate marketing thành công trong lĩnh vực:\n\nNiche/lĩnh vực: [NICHE CỦA BẠN]\nSản phẩm affiliate: [LOẠI SẢN PHẨM]\nThị trường: [VIỆT NAM / TIẾNG ANH]\nKênh của tôi hiện tại: [BLOG / YOUTUBE / TIKTOK / FACEBOOK]\n\nNghiên cứu và trả lời:\n1. Top affiliate marketer thành công nhất trong niche này hiện đang làm gì?\n2. Kênh nào đang hoạt động tốt nhất cho affiliate trong lĩnh vực này?\n3. Loại nội dung nào có tỷ lệ chuyển đổi cao nhất (review, comparison, tutorial, listicle)?\n4. Chiến lược SEO/organic đang được dùng phổ biến nhất\n5. Cách họ xây dựng lòng tin với audience trước khi bán\n6. Mức commission trung bình trong niche này là bao nhiêu?\n7. 3 bài học quan trọng nhất tôi có thể áp dụng ngay\n\nKèm ví dụ cụ thể và nguồn dẫn chứng cho mỗi điểm.",
    category: "Marketing",
    toolSlug: "perplexity",
    needSlug: "marketing",
    featured: false,
  },
  {
    id: "prompt-029",
    slug: "tu-dong-hoa-quy-trinh-dang-bai-len-nhieu-nen-tang",
    title: "Tự động hóa quy trình đăng bài lên nhiều nền tảng",
    description: "Thiết kế workflow tự động để đăng nội dung đồng thời lên nhiều mạng xã hội.",
    prompt:
      "Bạn là chuyên gia tự động hóa marketing với kinh nghiệm xây dựng hệ thống đăng bài tự động cho doanh nghiệp. Hãy giúp tôi thiết kế quy trình tự động hóa:\n\nNền tảng muốn đăng: [FACEBOOK / INSTAGRAM / TIKTOK / LINKEDIN / ...]\nTần suất đăng bài: [MỖI NGÀY / 3 LẦN/TUẦN / ...]\nLoại nội dung: [TEXT / ẢNH / VIDEO]\nCông cụ đang dùng hoặc sẵn sàng dùng: [N8N / MAKE / BUFFER / ...]\nNgân sách cho tool: [MIỄN PHÍ / DƯỚI $50/THÁNG]\n\nThiết kế workflow bao gồm:\n1. Quy trình tạo nội dung: từ ý tưởng đến bài viết sẵn sàng đăng\n2. Nơi lưu trữ nội dung chờ đăng (content queue)\n3. Cách lên lịch và tự động đăng lên từng nền tảng\n4. Cách tùy chỉnh nội dung cho từng nền tảng (Facebook khác TikTok)\n5. Theo dõi hiệu suất và báo cáo tự động\n6. Tool và ứng dụng cụ thể cần dùng kèm hướng dẫn kết nối\n\nĐề xuất workflow đơn giản nhất có thể bắt đầu trong 1 ngày, sau đó cải tiến dần.",
    category: "Tự động hóa",
    toolSlug: "chatgpt",
    needSlug: "tu-dong-hoa",
    featured: false,
  },
  {
    id: "prompt-030",
    slug: "tao-chatbot-faq-don-gian-bang-prompt",
    title: "Tạo chatbot FAQ đơn giản bằng prompt",
    description: "Xây dựng prompt system để AI trả lời tự động các câu hỏi thường gặp như một chatbot.",
    prompt:
      "Bạn là chuyên gia thiết kế chatbot và prompt engineering. Hãy giúp tôi tạo một system prompt để biến ChatGPT/Claude thành chatbot FAQ cho:\n\nTên doanh nghiệp/thương hiệu: [TÊN]\nLĩnh vực: [LĨNH VỰC]\nSản phẩm/dịch vụ: [MÔ TẢ]\nCác câu hỏi thường gặp: [LIỆT KÊ 10-15 CÂU HỎI PHỔ BIẾN NHẤT]\nTông giọng muốn chatbot dùng: [THÂN THIỆN / CHUYÊN NGHIỆP / TRẺ TRUNG]\nNhững gì chatbot KHÔNG được làm: [GIỚI HẠN]\n\nTạo:\n1. System prompt hoàn chỉnh (đặt vào phần Instructions hoặc System của AI)\n2. Hướng dẫn cập nhật FAQ khi có thay đổi\n3. Cách xử lý câu hỏi ngoài phạm vi (chuyển cho người thật)\n4. Ví dụ test 5 câu hỏi và câu trả lời mẫu\n5. Cách deploy chatbot này lên website hoặc Messenger đơn giản nhất\n\nSystem prompt phải cụ thể, không mơ hồ, để AI luôn trả lời đúng tông giọng và không bịa thông tin.",
    category: "Tự động hóa",
    toolSlug: "chatgpt",
    needSlug: "tu-dong-hoa",
    featured: false,
  },
];
