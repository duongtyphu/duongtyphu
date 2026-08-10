/**
 * Kiểu dữ liệu dùng chung cho Portal & Admin 2.0.
 *
 * Đây là hợp đồng giữa UI và lớp dữ liệu. Khi thay mock bằng Supabase, các kiểu
 * này là thứ phải giữ nguyên (hoặc mở rộng có kiểm soát) để không phải sửa
 * component.
 */

/* ------------------------------------------------------------------ Người dùng */

export type UserStatus = "active" | "suspended" | "pending";
export type UserPlan = "free" | "premium" | "vip";

export type PortalUser = {
  id: string;
  fullName: string;
  email: string;
  initials: string;
  plan: UserPlan;
  status: UserStatus;
  joinedAt: string;
  lastActiveAt: string;
  coursesEnrolled: number;
  totalSpent: number;
  referralCode: string;
  isAdmin: boolean;
};

/* ---------------------------------------------------------------- Khóa học */

export type CourseLevel = "co-ban" | "nang-cao" | "chuyen-sau";
export type CourseStatus = "published" | "draft" | "archived";

export type Course = {
  id: string;
  title: string;
  summary: string;
  level: CourseLevel;
  status: CourseStatus;
  lessonCount: number;
  durationMinutes: number;
  enrolledCount: number;
  price: number;
  isPremium: boolean;
  /** Tiến độ của người dùng hiện tại, 0–100. Chỉ có ở ngữ cảnh Portal. */
  progress?: number;
  accentFrom: string;
  accentTo: string;
  tag: string;
};

/* --------------------------------------------------------------- Affiliate */

export type AffiliateTxStatus = "pending" | "approved" | "paid" | "rejected";

export type AffiliateTransaction = {
  id: string;
  referrerName: string;
  referrerEmail: string;
  buyerName: string;
  productName: string;
  amount: number;
  commission: number;
  status: AffiliateTxStatus;
  createdAt: string;
};

export type AffiliateTier = {
  id: string;
  name: string;
  commissionPercent: number;
  minReferrals: number;
  benefits: string[];
};

/* ------------------------------------------------------------------ Ticket */

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type SupportTicket = {
  id: string;
  subject: string;
  requesterName: string;
  requesterEmail: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
};

/* --------------------------------------------------------------- Thông báo */

export type NotificationKind = "system" | "course" | "affiliate" | "community";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

/* ---------------------------------------------------------------- Premium */

export type PremiumPlan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  highlight: boolean;
  features: string[];
  badge?: string;
};

/* ------------------------------------------------------------ Giao dịch */

export type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";

export type Transaction = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  createdAt: string;
  reference: string;
};

/* -------------------------------------------------------------------- Media */

export type MediaKind = "image" | "video" | "document";

export type MediaAsset = {
  id: string;
  name: string;
  kind: MediaKind;
  sizeKb: number;
  uploadedAt: string;
  folder: string;
  usedIn: number;
};

/* ---------------------------------------------------------------- Cộng đồng */

export type CommunityPost = {
  id: string;
  authorName: string;
  authorInitials: string;
  title: string;
  excerpt: string;
  topic: string;
  likes: number;
  comments: number;
  createdAt: string;
  pinned: boolean;
};

/* ------------------------------------------------------------ Dự án & Cơ hội */

export type OpportunityStatus = "open" | "reviewing" | "closed";

export type Opportunity = {
  id: string;
  title: string;
  partner: string;
  summary: string;
  status: OpportunityStatus;
  budget: string;
  deadline: string;
  tags: string[];
};

/* ------------------------------------------------------------------- CKOS */

export type KnowledgeEntry = {
  id: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
  updatedAt: string;
  isPremium: boolean;
};

/* -------------------------------------------------------------- Companion */

export type CompanionMessageRole = "user" | "companion";

export type CompanionMessage = {
  id: string;
  role: CompanionMessageRole;
  content: string;
  createdAt: string;
};

export type CompanionConversation = {
  id: string;
  title: string;
  lastMessageAt: string;
  messageCount: number;
  summary: string;
};

export type MemoryCapsule = {
  id: string;
  label: string;
  content: string;
  category: string;
  updatedAt: string;
  pinned: boolean;
};

/* ---------------------------------------------------------------- Khu vườn */

export type GardenPlant = {
  id: string;
  name: string;
  stage: "hat-giong" | "nay-mam" | "phat-trien" | "ra-hoa" | "ket-trai";
  progress: number;
  linkedCourse: string;
  plantedAt: string;
};

/* ------------------------------------------------------------ Nhật ký & Hành trình */

export type JournalEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  minutesLearned: number;
  tags: string[];
};

export type JourneyMilestone = {
  id: string;
  title: string;
  description: string;
  achievedAt: string | null;
  xp: number;
  icon: string;
};

/* -------------------------------------------------------- Thống kê Dashboard */

export type StatTile = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
};
