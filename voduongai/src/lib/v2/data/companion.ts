import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  Calendar,
  FileText,
  Lightbulb,
  Rocket,
  Sparkles,
  Wrench,
} from "lucide-react";

import { mockFetch } from "./client";
import type { CompanionConversation, CompanionMessage, MemoryCapsule } from "./types";

const MESSAGES: CompanionMessage[] = [
  {
    id: "msg_01",
    role: "companion",
    content:
      "Xin chào! 👋 Mình là Companion, AI Mentor của bạn.\nHôm nay bạn muốn học gì, làm gì, hay khám phá điều gì mới? Mình luôn ở đây để hỗ trợ bạn. 💜",
    createdAt: "2026-08-10T09:30:00+07:00",
  },
  {
    id: "msg_02",
    role: "user",
    content: "Mình muốn học về AI Agent để áp dụng vào công việc.",
    createdAt: "2026-08-10T09:32:00+07:00",
  },
  {
    id: "msg_03",
    role: "companion",
    content:
      "Tuyệt vời! AI Agent là xu hướng rất quan trọng hiện nay.\nMình gợi ý lộ trình học phù hợp với mục tiêu của bạn nhé:",
    createdAt: "2026-08-10T09:32:00+07:00",
  },
];

export async function listCompanionMessages(): Promise<CompanionMessage[]> {
  return mockFetch(MESSAGES);
}

/* ------------------------------------------------- Gợi ý mở đầu cuộc trò chuyện */

export type CompanionSuggestion = {
  id: string;
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
  gradient: string;
};

const SUGGESTIONS: CompanionSuggestion[] = [
  {
    id: "goal",
    title: "Tiếp tục mục tiêu",
    description: "Hoàn thành bài học Prompt Engineering nâng cao",
    cta: "Tiếp tục →",
    icon: Rocket,
    gradient: "linear-gradient(145deg,#ff9d52,#c2660a)",
  },
  {
    id: "review",
    title: "Ôn tập kiến thức",
    description: "Xem lại 5 bài học gần đây để củng cố kiến thức",
    cta: "Ôn tập ngay →",
    icon: BookOpen,
    gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  },
  {
    id: "explore",
    title: "Khám phá tài nguyên",
    description: "Tài liệu mới: AI Agent — Xây dựng & ứng dụng",
    cta: "Khám phá →",
    icon: Sparkles,
    gradient: "linear-gradient(145deg,#8b6bff,#5a37e6)",
  },
];

export async function listCompanionSuggestions(): Promise<CompanionSuggestion[]> {
  return mockFetch(SUGGESTIONS);
}

/* -------------------------------------------------------------- Hồ sơ & mục tiêu */

export type CompanionProfile = {
  level: number;
  levelName: string;
  xp: number;
  streakDays: number;
  badges: number;
};

export async function getCompanionProfile(): Promise<CompanionProfile> {
  return mockFetch({
    level: 7,
    levelName: "Nhà kiến tạo",
    xp: 2450,
    streakDays: 12,
    badges: 28,
  });
}

export type CompanionGoal = {
  title: string;
  progress: number;
  steps: { label: string; done: boolean }[];
};

export async function getCurrentGoal(): Promise<CompanionGoal> {
  return mockFetch({
    title: "Xây dựng hệ thống kiến thức AI cho công việc & kinh doanh",
    progress: 75,
    steps: [
      { label: "Hoàn thành khóa AI cơ bản", done: true },
      { label: "Học Prompt Engineering nâng cao", done: true },
      { label: "Tìm hiểu & xây dựng AI Agent", done: false },
      { label: "Ứng dụng vào dự án thực tế", done: false },
    ],
  });
}

/* ------------------------------------------------------------------- Gợi ý bên phải */

export type CompanionReco = { id: string; label: string; tag: string; icon: LucideIcon };

const RECOS: CompanionReco[] = [
  { id: "r1", label: "Tài liệu mới: Hướng dẫn xây dựng AI Agent", tag: "Mới", icon: FileText },
  { id: "r2", label: "Webinar: AI Agent trong doanh nghiệp", tag: "Thứ 6", icon: Calendar },
  { id: "r3", label: "Công cụ AI mới: Make.com AI", tag: "Mới", icon: Wrench },
];

export async function listCompanionRecos(): Promise<CompanionReco[]> {
  return mockFetch(RECOS);
}

/* ------------------------------------------------------------ Nhật ký hội thoại */

const CONVERSATIONS: CompanionConversation[] = [
  {
    id: "conv_01",
    title: "Lộ trình học AI Agent",
    lastMessageAt: "2026-08-10T09:32:00+07:00",
    messageCount: 14,
    summary: "Companion dựng lộ trình 6 tuần từ nền tảng Agent tới triển khai thực tế.",
  },
  {
    id: "conv_02",
    title: "Rà soát chiến lược nội dung quý III",
    lastMessageAt: "2026-08-08T15:10:00+07:00",
    messageCount: 27,
    summary: "Phân tích 3 kênh chính, đề xuất giảm tần suất đăng và tăng chiều sâu bài viết.",
  },
  {
    id: "conv_03",
    title: "Tối ưu prompt cho email bán hàng",
    lastMessageAt: "2026-08-05T20:45:00+07:00",
    messageCount: 9,
    summary: "Xây bộ 12 prompt theo phễu, kèm tiêu chí đánh giá đầu ra.",
  },
  {
    id: "conv_04",
    title: "Chuẩn hoá quy trình onboarding học viên",
    lastMessageAt: "2026-08-01T11:20:00+07:00",
    messageCount: 18,
    summary: "Rút gọn từ 9 bước xuống 5 bước, tự động hoá 3 điểm chạm đầu tiên.",
  },
];

export async function listConversations(): Promise<CompanionConversation[]> {
  return mockFetch(CONVERSATIONS);
}

/* ------------------------------------------------------- Bộ nhớ & cá nhân hoá */

const MEMORY: MemoryCapsule[] = [
  {
    id: "mem_01",
    label: "Mục tiêu năm 2026",
    content: "Xây hệ sinh thái học AI cho người Việt, ưu tiên chiều sâu hơn số lượng.",
    category: "Mục tiêu",
    updatedAt: "2026-08-09T08:00:00+07:00",
    pinned: true,
  },
  {
    id: "mem_02",
    label: "Phong cách làm việc",
    content: "Thích hệ thống hoá, ghét việc lặp lại thủ công, ưu tiên tài liệu hoá quy trình.",
    category: "Cá nhân",
    updatedAt: "2026-08-06T14:30:00+07:00",
    pinned: true,
  },
  {
    id: "mem_03",
    label: "Lĩnh vực đang tập trung",
    content: "AI Agent, tự động hoá quy trình vận hành, xây dựng tài sản số.",
    category: "Chuyên môn",
    updatedAt: "2026-08-04T09:15:00+07:00",
    pinned: false,
  },
  {
    id: "mem_04",
    label: "Ràng buộc thời gian",
    content: "Học sâu vào buổi sáng sớm; buổi chiều dành cho vận hành và họp.",
    category: "Thói quen",
    updatedAt: "2026-07-30T19:00:00+07:00",
    pinned: false,
  },
];

export async function listMemoryCapsules(): Promise<MemoryCapsule[]> {
  return mockFetch(MEMORY);
}

/* ------------------------------------------------------------- Chiến lược cá nhân */

export type StrategyPillar = {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: LucideIcon;
  actions: string[];
};

const STRATEGY: StrategyPillar[] = [
  {
    id: "sp1",
    title: "Nền tảng tri thức",
    description: "Hệ thống hoá kiến thức AI thành tài sản dùng lại được, không học rời rạc.",
    progress: 72,
    icon: BookOpen,
    actions: [
      "Hoàn tất lộ trình AI Agent",
      "Chuyển 20 ghi chú rời thành 5 tài liệu chuẩn",
      "Xây bộ prompt lõi cho công việc hằng ngày",
    ],
  },
  {
    id: "sp2",
    title: "Năng lực triển khai",
    description: "Biến kiến thức thành quy trình chạy được, đo được, bàn giao được.",
    progress: 48,
    icon: Rocket,
    actions: [
      "Tự động hoá 3 quy trình vận hành lặp lại",
      "Xây 1 AI Agent phục vụ nghiệp vụ thật",
      "Viết SOP cho quy trình đã tự động hoá",
    ],
  },
  {
    id: "sp3",
    title: "Ảnh hưởng & cộng đồng",
    description: "Chia sẻ những gì đã kiểm chứng, xây uy tín từ kết quả thật.",
    progress: 35,
    icon: Lightbulb,
    actions: [
      "Đăng 2 case study có số liệu",
      "Mở 1 buổi chia sẻ nội bộ mỗi tháng",
      "Xây thư viện mẫu mở cho cộng đồng",
    ],
  },
  {
    id: "sp4",
    title: "Đồng hành cùng Companion",
    description: "Để Companion nhớ đúng bối cảnh, gợi ý mới bám sát mục tiêu thật.",
    progress: 88,
    icon: Bot,
    actions: [
      "Cập nhật bộ nhớ mỗi khi mục tiêu đổi",
      "Đánh giá gợi ý hằng tuần",
      "Ghi lại quyết định quan trọng vào nhật ký",
    ],
  },
];

export async function listStrategyPillars(): Promise<StrategyPillar[]> {
  return mockFetch(STRATEGY);
}
