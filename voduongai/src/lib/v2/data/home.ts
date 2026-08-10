import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BookOpen,
  Briefcase,
  Crown,
  FileText,
  GraduationCap,
  Heart,
  LayoutGrid,
  MessageSquare,
  NotebookPen,
  Route,
  Sparkles,
  Wrench,
  Workflow,
} from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { mockFetch } from "./client";

/* ------------------------------------------------------------ Khám phá nhanh */

export type ExploreCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Gradient nền khối icon — thay cho 6 file PNG chưa có trong gói handoff. */
  gradient: string;
};

const EXPLORE: ExploreCard[] = [
  {
    id: "companion",
    title: "Companion AI",
    description: "AI Mentor cá nhân hóa, hiểu bạn, nhớ bạn và đồng hành cùng bạn 24/7",
    href: `${V2_PORTAL_BASE}/companion`,
    icon: Bot,
    gradient: "linear-gradient(145deg,#8b6bff,#5a37e6)",
  },
  {
    id: "ckos",
    title: "Hệ tri thức AI",
    description:
      "Thư viện tri thức và công cụ AI chuẩn hoá được chọn lọc, cập nhật liên tục, sẵn sàng cho mọi nhu cầu.",
    href: `${V2_PORTAL_BASE}/he-tri-thuc`,
    icon: BookOpen,
    gradient: "linear-gradient(145deg,#4bc4e0,#0e7490)",
  },
  {
    id: "hoc-vien",
    title: "Học viện AI",
    description: "Lộ trình bài bản từ cơ bản đến nâng cao, học đi đôi với thực hành.",
    href: `${V2_PORTAL_BASE}/hoc-vien-ai`,
    icon: GraduationCap,
    gradient: "linear-gradient(145deg,#3ecf7e,#189a52)",
  },
  {
    id: "workspace",
    title: "AI Workspace",
    description: "Nơi bạn thực hành, lưu trữ và triển khai ý tưởng thành sản phẩm thực tế.",
    href: `${V2_PORTAL_BASE}/ai-workspace`,
    icon: LayoutGrid,
    gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  },
  {
    id: "premium",
    title: "Premium",
    description:
      "Tài nguyên độc quyền dành cho thành viên. Nội dung chuyên sâu, công cụ cao cấp và tư vấn 1:1 cùng chuyên gia.",
    href: `${V2_PORTAL_BASE}/premium`,
    icon: Crown,
    gradient: "linear-gradient(145deg,#ffc964,#e2b23c)",
  },
  {
    id: "du-an",
    title: "Dự án & Cơ hội",
    description: "Cơ hội hợp tác, đầu tư và đồng hành trong các dự án công nghệ AI.",
    href: `${V2_PORTAL_BASE}/du-an-co-hoi`,
    icon: Briefcase,
    gradient: "linear-gradient(145deg,#ff9d52,#b45309)",
  },
];

export async function listExploreCards(): Promise<ExploreCard[]> {
  return mockFetch(EXPLORE);
}

/* --------------------------------------------------------- Tiếp tục học tập */

export type LearnCard = {
  id: string;
  title: string;
  tag: string;
  progress: number;
  cta: string;
  href: string;
  icon: LucideIcon;
  cardBackground: string;
  tagBackground: string;
  tagColor: string;
  iconGradient: string;
  progressColor: string;
};

const LEARNING: LearnCard[] = [
  {
    id: "ai-co-ban",
    title: "AI Cơ bản cho người mới bắt đầu",
    tag: "ĐANG HỌC",
    progress: 65,
    cta: "Tiếp tục học",
    href: `${V2_PORTAL_BASE}/hoc-vien-ai`,
    icon: Sparkles,
    cardBackground: "linear-gradient(155deg,#f4efff 0%,#e4d9ff 100%)",
    tagBackground: "#ded0ff",
    tagColor: "#5a37e6",
    iconGradient: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    progressColor: "#7c5cfc",
  },
  {
    id: "chatgpt-mastery",
    title: "ChatGPT Mastery: Từ cơ bản đến nâng cao",
    tag: "ĐANG HỌC",
    progress: 38,
    cta: "Tiếp tục học",
    href: `${V2_PORTAL_BASE}/hoc-vien-ai`,
    icon: MessageSquare,
    cardBackground: "linear-gradient(155deg,#eafaf0 0%,#cdf0dc 100%)",
    tagBackground: "#c8ecd6",
    tagColor: "#16743a",
    iconGradient: "linear-gradient(145deg,#3ecf7e,#189a52)",
    progressColor: "#22b35d",
  },
  {
    id: "ai-marketing",
    title: "AI trong Marketing và Content Creation",
    tag: "ĐANG HỌC",
    progress: 30,
    cta: "Tiếp tục học",
    href: `${V2_PORTAL_BASE}/hoc-vien-ai`,
    icon: FileText,
    cardBackground: "linear-gradient(155deg,#eaf2ff 0%,#cfe1ff 100%)",
    tagBackground: "#ded0ff",
    tagColor: "#5a37e6",
    iconGradient: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    progressColor: "#7c5cfc",
  },
  {
    id: "ai-automation",
    title: "AI Automation với No-code",
    tag: "CHƯA BẮT ĐẦU",
    progress: 0,
    cta: "Bắt đầu học",
    href: `${V2_PORTAL_BASE}/hoc-vien-ai`,
    icon: Workflow,
    cardBackground: "linear-gradient(155deg,#f6f5fa 0%,#e6e4ef 100%)",
    tagBackground: "#e2e0ec",
    tagColor: "#57506f",
    iconGradient: "linear-gradient(145deg,#9791b8,#5f5980)",
    progressColor: "#9791b8",
  },
];

export async function listContinueLearning(): Promise<LearnCard[]> {
  return mockFetch(LEARNING);
}

/* ------------------------------------------------------------ Gợi ý cho bạn */

export type SuggestionCard = {
  id: string;
  kind: string;
  title: string;
  meta: string;
  icon: LucideIcon;
  kindBackground: string;
  kindColor: string;
  iconGradient: string;
};

const SUGGESTIONS: SuggestionCard[] = [
  {
    id: "prompt-content",
    kind: "PROMPT",
    title: "100+ Prompt viết Content Marketing",
    meta: "124 lượt tải",
    icon: Sparkles,
    kindBackground: "#f1ebff",
    kindColor: "#5a37e6",
    iconGradient: "linear-gradient(145deg,#8b6bff,#5a37e6)",
  },
  {
    id: "template-marketing",
    kind: "TEMPLATE",
    title: "Mẫu kế hoạch Marketing AI",
    meta: "89 lượt tải",
    icon: FileText,
    kindBackground: "#eaf1ff",
    kindColor: "#1d4ed8",
    iconGradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  },
  {
    id: "workflow-research",
    kind: "WORKFLOW",
    title: "Quy trình nghiên cứu thị trường với AI",
    meta: "156 lượt tải",
    icon: Workflow,
    kindBackground: "#e6f7ec",
    kindColor: "#16743a",
    iconGradient: "linear-gradient(145deg,#3ecf7e,#189a52)",
  },
  {
    id: "ebook-newbie",
    kind: "EBOOK",
    title: "Cẩm nang AI cho người mới",
    meta: "312 lượt tải",
    icon: BookOpen,
    kindBackground: "#fdeee6",
    kindColor: "#b45309",
    iconGradient: "linear-gradient(145deg,#ff9d52,#b45309)",
  },
  {
    id: "tool-top20",
    kind: "TOOL",
    title: "Top 20 AI Tools khuyên dùng",
    meta: "245 lượt xem",
    icon: Wrench,
    kindBackground: "#eaf6f9",
    kindColor: "#0e7490",
    iconGradient: "linear-gradient(145deg,#4bc4e0,#0e7490)",
  },
];

export async function listSuggestions(): Promise<SuggestionCard[]> {
  return mockFetch(SUGGESTIONS);
}

/* ------------------------------------------------------- Hành trình + nhanh */

export type JourneySummary = {
  levelName: string;
  xp: number;
  xpTarget: number;
  streakDays: number;
  totalLearnTime: string;
};

export async function getJourneySummary(): Promise<JourneySummary> {
  return mockFetch({
    levelName: "Người học AI",
    xp: 1200,
    xpTarget: 3000,
    streakDays: 7,
    totalLearnTime: "32:45",
  });
}

export type QuickLink = { id: string; label: string; href: string; icon: LucideIcon };

const QUICK_LINKS: QuickLink[] = [
  {
    id: "journal",
    label: "Nhật ký học tập",
    href: `${V2_PORTAL_BASE}/nhat-ky-hoc-tap`,
    icon: NotebookPen,
  },
  {
    id: "roadmap",
    label: "Lộ trình của tôi",
    href: `${V2_PORTAL_BASE}/hanh-trinh-cua-toi`,
    icon: Route,
  },
  {
    id: "saved",
    label: "Tài liệu đã lưu",
    href: `${V2_PORTAL_BASE}/he-tri-thuc`,
    icon: BookOpen,
  },
  {
    id: "favourite-tools",
    label: "Công cụ yêu thích",
    href: `${V2_PORTAL_BASE}/ai-workspace`,
    icon: Heart,
  },
  {
    id: "community",
    label: "Cộng đồng thảo luận",
    href: `${V2_PORTAL_BASE}/cong-dong-ai`,
    icon: MessageSquare,
  },
];

export async function listQuickLinks(): Promise<QuickLink[]> {
  return mockFetch(QUICK_LINKS);
}

/* --------------------------------------------------------- Gói Premium hiện tại */

export type MembershipSummary = {
  planLabel: string;
  planName: string;
  expiresAt: string;
};

export async function getMembershipSummary(): Promise<MembershipSummary> {
  return mockFetch({
    planLabel: "Premium Member",
    planName: "Premium Monthly",
    expiresAt: "01/06/2027",
  });
}
