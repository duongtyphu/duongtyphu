import { mockFetch } from "./client";
import type {
  Course,
  CommunityPost,
  GardenPlant,
  JournalEntry,
  JourneyMilestone,
  KnowledgeEntry,
  Opportunity,
} from "./types";

/* ------------------------------------------------------------- Học viện AI */

const COURSES: Course[] = [
  {
    id: "crs_01",
    title: "AI Cơ bản cho người mới bắt đầu",
    summary: "Nền tảng vững để hiểu AI làm được gì và không làm được gì.",
    level: "co-ban",
    status: "published",
    lessonCount: 24,
    durationMinutes: 380,
    enrolledCount: 4820,
    price: 0,
    isPremium: false,
    progress: 65,
    accentFrom: "#8b6bff",
    accentTo: "#5a37e6",
    tag: "Nền tảng",
  },
  {
    id: "crs_02",
    title: "ChatGPT Mastery: Từ cơ bản đến nâng cao",
    summary: "Khai thác ChatGPT như một cộng sự thật sự, không phải máy trả lời.",
    level: "nang-cao",
    status: "published",
    lessonCount: 32,
    durationMinutes: 520,
    enrolledCount: 3610,
    price: 1990000,
    isPremium: true,
    progress: 38,
    accentFrom: "#3ecf7e",
    accentTo: "#189a52",
    tag: "Công cụ",
  },
  {
    id: "crs_03",
    title: "AI trong Marketing và Content Creation",
    summary: "Quy trình sản xuất nội dung có AI mà vẫn giữ giọng thương hiệu.",
    level: "nang-cao",
    status: "published",
    lessonCount: 28,
    durationMinutes: 460,
    enrolledCount: 2940,
    price: 2490000,
    isPremium: true,
    progress: 30,
    accentFrom: "#5f8fff",
    accentTo: "#1d5fd8",
    tag: "Marketing",
  },
  {
    id: "crs_04",
    title: "AI Automation với No-code",
    summary: "Nối AI vào quy trình vận hành mà không cần viết code.",
    level: "chuyen-sau",
    status: "published",
    lessonCount: 20,
    durationMinutes: 340,
    enrolledCount: 1780,
    price: 2990000,
    isPremium: true,
    progress: 0,
    accentFrom: "#9791b8",
    accentTo: "#5f5980",
    tag: "Tự động hoá",
  },
  {
    id: "crs_05",
    title: "Prompt Engineering nâng cao",
    summary: "Thiết kế prompt có cấu trúc, kiểm chứng được và dùng lại được.",
    level: "chuyen-sau",
    status: "published",
    lessonCount: 18,
    durationMinutes: 300,
    enrolledCount: 2210,
    price: 2490000,
    isPremium: true,
    accentFrom: "#ff9d52",
    accentTo: "#b45309",
    tag: "Kỹ năng lõi",
  },
  {
    id: "crs_06",
    title: "Xây dựng AI Agent cho doanh nghiệp",
    summary: "Từ ý tưởng tới một agent chạy thật trong quy trình nghiệp vụ.",
    level: "chuyen-sau",
    status: "draft",
    lessonCount: 22,
    durationMinutes: 420,
    enrolledCount: 0,
    price: 3990000,
    isPremium: true,
    accentFrom: "#4bc4e0",
    accentTo: "#0e7490",
    tag: "AI Agent",
  },
  {
    id: "crs_07",
    title: "Tự động hoá với AI & n8n",
    summary: "Dựng pipeline tự động nối nhiều dịch vụ bằng n8n.",
    level: "nang-cao",
    status: "published",
    lessonCount: 16,
    durationMinutes: 260,
    enrolledCount: 940,
    price: 1990000,
    isPremium: true,
    accentFrom: "#a08bff",
    accentTo: "#6d4aff",
    tag: "Tự động hoá",
  },
  {
    id: "crs_08",
    title: "AI cho người làm kinh doanh",
    summary: "Ứng dụng AI vào bán hàng, chăm sóc khách và ra quyết định.",
    level: "co-ban",
    status: "archived",
    lessonCount: 12,
    durationMinutes: 190,
    enrolledCount: 620,
    price: 990000,
    isPremium: false,
    accentFrom: "#e2b23c",
    accentTo: "#a9660f",
    tag: "Kinh doanh",
  },
];

export const LEVEL_LABEL: Record<Course["level"], string> = {
  "co-ban": "Cơ bản",
  "nang-cao": "Nâng cao",
  "chuyen-sau": "Chuyên sâu",
};

export const COURSE_STATUS_LABEL: Record<Course["status"], string> = {
  published: "Đang mở",
  draft: "Bản nháp",
  archived: "Đã lưu trữ",
};

export async function listCourses(): Promise<Course[]> {
  return mockFetch(COURSES);
}

export async function listContinuingCourses(): Promise<Course[]> {
  return mockFetch(COURSES.filter((course) => typeof course.progress === "number"));
}

/* ------------------------------------------------------------ Hệ tri thức */

const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "kb_01",
    title: "Bộ Prompt SEO 2026",
    summary: "38 prompt theo từng giai đoạn: nghiên cứu từ khoá, dàn ý, viết, tối ưu.",
    category: "Prompt",
    readMinutes: 12,
    updatedAt: "2026-08-09",
    isPremium: false,
  },
  {
    id: "kb_02",
    title: "Hướng dẫn xây dựng AI Agent",
    summary: "Kiến trúc agent, vòng lặp công cụ, và cách kiểm soát chi phí.",
    category: "Kiến trúc",
    readMinutes: 22,
    updatedAt: "2026-08-08",
    isPremium: true,
  },
  {
    id: "kb_03",
    title: "Checklist đánh giá công cụ AI",
    summary: "14 tiêu chí để không mua nhầm công cụ chỉ vì demo đẹp.",
    category: "Công cụ",
    readMinutes: 8,
    updatedAt: "2026-08-05",
    isPremium: false,
  },
  {
    id: "kb_04",
    title: "Quy trình nghiên cứu thị trường với AI",
    summary: "Từ câu hỏi nghiên cứu tới báo cáo có nguồn kiểm chứng.",
    category: "Quy trình",
    readMinutes: 18,
    updatedAt: "2026-08-02",
    isPremium: true,
  },
  {
    id: "kb_05",
    title: "Bảo mật dữ liệu khi dùng AI",
    summary: "Ranh giới dữ liệu nào được đưa vào mô hình, dữ liệu nào tuyệt đối không.",
    category: "Bảo mật",
    readMinutes: 15,
    updatedAt: "2026-07-28",
    isPremium: true,
  },
  {
    id: "kb_06",
    title: "Mẫu kế hoạch Marketing AI",
    summary: "Khung kế hoạch 90 ngày kèm chỉ số đo lường theo tuần.",
    category: "Mẫu",
    readMinutes: 10,
    updatedAt: "2026-07-24",
    isPremium: false,
  },
];

export async function listKnowledge(): Promise<KnowledgeEntry[]> {
  return mockFetch(KNOWLEDGE);
}

/* ------------------------------------------------------- AI Workspace tools */

export type WorkspaceTool = {
  id: string;
  name: string;
  kind: string;
  group: string;
  visible: boolean;
  status: "active" | "beta" | "off";
  usageCount: number;
};

const TOOLS: WorkspaceTool[] = [
  { id: "tl_01", name: "Trình soạn nội dung AI", kind: "Nội dung", group: "Sáng tạo", visible: true, status: "active", usageCount: 8420 },
  { id: "tl_02", name: "Phân tích dữ liệu bảng", kind: "Phân tích", group: "Dữ liệu", visible: true, status: "active", usageCount: 5210 },
  { id: "tl_03", name: "Tóm tắt tài liệu dài", kind: "Nội dung", group: "Sáng tạo", visible: true, status: "active", usageCount: 6940 },
  { id: "tl_04", name: "Sinh ảnh minh hoạ", kind: "Hình ảnh", group: "Sáng tạo", visible: true, status: "beta", usageCount: 3180 },
  { id: "tl_05", name: "Trợ lý viết email", kind: "Nội dung", group: "Kinh doanh", visible: true, status: "active", usageCount: 4720 },
  { id: "tl_06", name: "Chuyển giọng nói thành văn bản", kind: "Âm thanh", group: "Năng suất", visible: false, status: "off", usageCount: 890 },
  { id: "tl_07", name: "Dịch thuật giữ ngữ cảnh", kind: "Ngôn ngữ", group: "Năng suất", visible: true, status: "active", usageCount: 2640 },
  { id: "tl_08", name: "Tạo workflow tự động", kind: "Tự động hoá", group: "Vận hành", visible: true, status: "beta", usageCount: 1470 },
];

export async function listWorkspaceTools(): Promise<WorkspaceTool[]> {
  return mockFetch(TOOLS);
}

/* -------------------------------------------------------- Dự án & Cơ hội */

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp_01",
    title: "Hợp tác phân phối khoá học doanh nghiệp",
    partner: "DigiU",
    summary: "Đưa lộ trình AI vào chương trình đào tạo nội bộ cho khối doanh nghiệp vừa.",
    status: "open",
    budget: "300 – 800 triệu ₫",
    deadline: "2026-09-15",
    tags: ["Đào tạo", "B2B"],
  },
  {
    id: "opp_02",
    title: "Đồng đầu tư dự án năng lượng mặt trời",
    partner: "SolarGroup",
    summary: "Gọi vốn cộng đồng cho cụm điện mặt trời áp mái tại khu công nghiệp phía Nam.",
    status: "reviewing",
    budget: "2 – 5 tỷ ₫",
    deadline: "2026-10-01",
    tags: ["Đầu tư", "Năng lượng"],
  },
  {
    id: "opp_03",
    title: "Xây cộng đồng học tập địa phương",
    partner: "Ohana",
    summary: "Mở 12 điểm sinh hoạt học AI theo mô hình chi hội tại các tỉnh.",
    status: "open",
    budget: "150 – 400 triệu ₫",
    deadline: "2026-09-30",
    tags: ["Cộng đồng"],
  },
  {
    id: "opp_04",
    title: "Phát triển AI Agent cho ngành bán lẻ",
    partner: "VO DUONG AI Labs",
    summary: "Xây agent chăm sóc khách hàng tích hợp POS cho chuỗi bán lẻ.",
    status: "open",
    budget: "500 triệu – 1,2 tỷ ₫",
    deadline: "2026-11-20",
    tags: ["Sản phẩm", "AI Agent"],
  },
  {
    id: "opp_05",
    title: "Chương trình học bổng AI cho sinh viên",
    partner: "DigiU",
    summary: "Cấp 200 suất học bổng toàn phần cho sinh viên năm cuối.",
    status: "closed",
    budget: "600 triệu ₫",
    deadline: "2026-06-30",
    tags: ["Học bổng"],
  },
];

export const OPP_STATUS_LABEL: Record<Opportunity["status"], string> = {
  open: "Đang mở",
  reviewing: "Đang xét duyệt",
  closed: "Đã đóng",
};

export async function listOpportunities(): Promise<Opportunity[]> {
  return mockFetch(OPPORTUNITIES);
}

/* ----------------------------------------------------------- Cộng đồng AI */

const POSTS: CommunityPost[] = [
  {
    id: "post_01",
    authorName: "Trần Thị Mai",
    authorInitials: "TM",
    title: "Cách mình dùng AI để rút ngắn quy trình viết nội dung",
    excerpt: "Từ 6 giờ xuống còn 90 phút cho một bài dài, mà chất lượng không giảm.",
    topic: "Chia sẻ kinh nghiệm",
    likes: 248,
    comments: 42,
    createdAt: "2026-08-09T10:05:00+07:00",
    pinned: true,
  },
  {
    id: "post_02",
    authorName: "Hoàng Nam",
    authorInitials: "HN",
    title: "Bộ prompt mình dùng để rà soát hợp đồng",
    excerpt: "Không thay luật sư, nhưng bắt được 80% lỗi hình thức trước khi gửi.",
    topic: "Prompt",
    likes: 187,
    comments: 31,
    createdAt: "2026-08-08T16:20:00+07:00",
    pinned: false,
  },
  {
    id: "post_03",
    authorName: "Minh Anh",
    authorInitials: "MA",
    title: "Học AI 3 tháng — điều mình ước biết sớm hơn",
    excerpt: "Đừng học công cụ trước. Học cách đặt vấn đề trước.",
    topic: "Hành trình",
    likes: 412,
    comments: 88,
    createdAt: "2026-08-07T09:00:00+07:00",
    pinned: true,
  },
  {
    id: "post_04",
    authorName: "Lê Hoàng Nam",
    authorInitials: "LN",
    title: "So sánh 5 công cụ sinh ảnh cho thiết kế thương hiệu",
    excerpt: "Bảng so sánh theo 9 tiêu chí, kèm chi phí thực tế mỗi tháng.",
    topic: "Công cụ",
    likes: 156,
    comments: 24,
    createdAt: "2026-08-06T14:40:00+07:00",
    pinned: false,
  },
  {
    id: "post_05",
    authorName: "Đỗ Khánh Linh",
    authorInitials: "ĐL",
    title: "Xin góp ý: lộ trình học AI cho người làm kế toán",
    excerpt: "Mình phác thảo 12 tuần, mong mọi người chỉ chỗ chưa hợp lý.",
    topic: "Hỏi đáp",
    likes: 94,
    comments: 57,
    createdAt: "2026-08-05T20:10:00+07:00",
    pinned: false,
  },
  {
    id: "post_06",
    authorName: "Quang Huy",
    authorInitials: "QH",
    title: "Bài viết vi phạm nguyên tắc cộng đồng",
    excerpt: "Nội dung quảng cáo dịch vụ bên ngoài, đang chờ kiểm duyệt.",
    topic: "Khác",
    likes: 3,
    comments: 1,
    createdAt: "2026-08-04T11:30:00+07:00",
    pinned: false,
  },
];

export async function listCommunityPosts(): Promise<CommunityPost[]> {
  return mockFetch(POSTS);
}

/* -------------------------------------------------------- Khu vườn của bạn */

const PLANTS: GardenPlant[] = [
  { id: "pl_01", name: "Cây Nền tảng AI", stage: "ket-trai", progress: 100, linkedCourse: "AI Cơ bản cho người mới bắt đầu", plantedAt: "2026-02-10" },
  { id: "pl_02", name: "Cây Prompt", stage: "ra-hoa", progress: 82, linkedCourse: "Prompt Engineering nâng cao", plantedAt: "2026-04-02" },
  { id: "pl_03", name: "Cây Tự động hoá", stage: "phat-trien", progress: 45, linkedCourse: "AI Automation với No-code", plantedAt: "2026-06-18" },
  { id: "pl_04", name: "Cây Nội dung", stage: "nay-mam", progress: 22, linkedCourse: "AI trong Marketing và Content Creation", plantedAt: "2026-07-20" },
  { id: "pl_05", name: "Cây AI Agent", stage: "hat-giong", progress: 5, linkedCourse: "Xây dựng AI Agent cho doanh nghiệp", plantedAt: "2026-08-05" },
];

export const STAGE_LABEL: Record<GardenPlant["stage"], string> = {
  "hat-giong": "Hạt giống",
  "nay-mam": "Nảy mầm",
  "phat-trien": "Phát triển",
  "ra-hoa": "Ra hoa",
  "ket-trai": "Kết trái",
};

export async function listGardenPlants(): Promise<GardenPlant[]> {
  return mockFetch(PLANTS);
}

export type DailyQuest = { id: string; title: string; reward: string; done: boolean };

export async function listDailyQuests(): Promise<DailyQuest[]> {
  return mockFetch([
    { id: "q1", title: "Học ít nhất 20 phút", reward: "+50 XP", done: true },
    { id: "q2", title: "Hoàn thành 1 bài học", reward: "+80 XP", done: true },
    { id: "q3", title: "Trò chuyện cùng Companion", reward: "+30 XP", done: true },
    { id: "q4", title: "Ghi 1 mục nhật ký học tập", reward: "+40 XP", done: false },
    { id: "q5", title: "Chia sẻ 1 bài viết ở Cộng đồng", reward: "+60 XP", done: false },
  ]);
}

/* ------------------------------------------------------- Nhật ký học tập */

const JOURNAL: JournalEntry[] = [
  {
    id: "jr_01",
    date: "2026-08-10",
    title: "Hiểu ra vòng lặp công cụ của AI Agent",
    content:
      "Hôm nay mới thực sự hiểu agent không phải là một prompt dài, mà là vòng lặp: quan sát → quyết định → gọi công cụ → đọc kết quả. Cái khó không nằm ở mô hình mà ở việc định nghĩa công cụ cho gọn.",
    mood: "Hào hứng",
    minutesLearned: 65,
    tags: ["AI Agent", "Kiến trúc"],
  },
  {
    id: "jr_02",
    date: "2026-08-09",
    title: "Rút gọn bộ prompt viết bài từ 12 xuống 4",
    content:
      "Nhận ra 8 prompt cũ chỉ là biến thể của nhau. Gom lại còn 4 prompt có tham số. Dễ nhớ hơn hẳn và kết quả ổn định hơn.",
    mood: "Hài lòng",
    minutesLearned: 40,
    tags: ["Prompt", "Quy trình"],
  },
  {
    id: "jr_03",
    date: "2026-08-08",
    title: "Thử n8n lần đầu — vướng ở xác thực",
    content:
      "Dựng được luồng đầu tiên nhưng mất gần một tiếng chỉ để cấu hình OAuth. Ghi lại các bước để lần sau không mò lại.",
    mood: "Kiên nhẫn",
    minutesLearned: 85,
    tags: ["Tự động hoá", "n8n"],
  },
  {
    id: "jr_04",
    date: "2026-08-06",
    title: "Đọc lại ghi chú tuần trước",
    content:
      "Ôn lại phần embedding. Lần này hiểu rõ hơn vì sao chia nhỏ tài liệu lại ảnh hưởng mạnh tới chất lượng truy hồi.",
    mood: "Bình tĩnh",
    minutesLearned: 30,
    tags: ["Ôn tập", "CKOS"],
  },
];

export async function listJournalEntries(): Promise<JournalEntry[]> {
  return mockFetch(JOURNAL);
}

/* ------------------------------------------------------ Hành trình của tôi */

const MILESTONES: JourneyMilestone[] = [
  { id: "ms_01", title: "Bước đầu tiên", description: "Hoàn thành bài học đầu tiên trên Học viện AI.", achievedAt: "2026-02-12", xp: 100, icon: "seed" },
  { id: "ms_02", title: "Người kiên trì", description: "Duy trì chuỗi học 7 ngày liên tục.", achievedAt: "2026-03-01", xp: 200, icon: "flame" },
  { id: "ms_03", title: "Thợ prompt", description: "Hoàn thành khoá Prompt Engineering nâng cao.", achievedAt: "2026-05-18", xp: 400, icon: "sparkles" },
  { id: "ms_04", title: "Người xây dựng", description: "Tạo workflow tự động đầu tiên trong AI Workspace.", achievedAt: "2026-07-02", xp: 500, icon: "wrench" },
  { id: "ms_05", title: "Kiến trúc sư Agent", description: "Triển khai một AI Agent vào công việc thật.", achievedAt: null, xp: 800, icon: "bot" },
  { id: "ms_06", title: "Người dẫn đường", description: "Chia sẻ 5 bài viết được cộng đồng ghi nhận.", achievedAt: null, xp: 600, icon: "users" },
];

export async function listMilestones(): Promise<JourneyMilestone[]> {
  return mockFetch(MILESTONES);
}

export type JourneyStage = {
  id: string;
  name: string;
  description: string;
  courseCount: number;
  progress: number;
};

export async function listJourneyStages(): Promise<JourneyStage[]> {
  return mockFetch([
    { id: "st1", name: "Khởi đầu", description: "Hiểu AI là gì và dùng được công cụ cơ bản.", courseCount: 4, progress: 100 },
    { id: "st2", name: "Thành thạo công cụ", description: "Dùng thuần thục 5–7 công cụ AI cho công việc.", courseCount: 6, progress: 82 },
    { id: "st3", name: "Hệ thống hoá", description: "Biến cách làm rời rạc thành quy trình lặp lại được.", courseCount: 5, progress: 45 },
    { id: "st4", name: "Tự động hoá", description: "Nối AI vào vận hành, giảm việc thủ công.", courseCount: 5, progress: 18 },
    { id: "st5", name: "Kiến tạo", description: "Xây sản phẩm, agent và tài sản số của riêng mình.", courseCount: 4, progress: 0 },
  ]);
}
