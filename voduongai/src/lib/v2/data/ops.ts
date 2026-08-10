import { mockFetch } from "./client";
import type { MediaAsset, SupportTicket } from "./types";

/* ------------------------------------------------------------- Hỗ trợ Ticket */

const TICKETS: SupportTicket[] = [
  { id: "tk_01", subject: "Không truy cập được khoá học đã mua", requesterName: "Phạm Thu Hà", requesterEmail: "thuha@email.com", status: "open", priority: "high", category: "Khoá học", createdAt: "2026-08-10T08:20:00+07:00", updatedAt: "2026-08-10T09:40:00+07:00", messageCount: 3 },
  { id: "tk_02", subject: "Yêu cầu xuất hoá đơn VAT", requesterName: "Vũ Đình Trung", requesterEmail: "dinhtrung@email.com", status: "in-progress", priority: "normal", category: "Thanh toán", createdAt: "2026-08-09T14:05:00+07:00", updatedAt: "2026-08-10T08:10:00+07:00", messageCount: 5 },
  { id: "tk_03", subject: "Companion trả lời sai ngữ cảnh mục tiêu", requesterName: "Trần Thị Mai", requesterEmail: "tranmai@email.com", status: "in-progress", priority: "urgent", category: "Companion", createdAt: "2026-08-09T10:30:00+07:00", updatedAt: "2026-08-10T07:15:00+07:00", messageCount: 8 },
  { id: "tk_04", subject: "Đổi email đăng nhập", requesterName: "Bùi Tiến Đạt", requesterEmail: "tiendat@email.com", status: "resolved", priority: "low", category: "Tài khoản", createdAt: "2026-08-07T16:40:00+07:00", updatedAt: "2026-08-08T09:00:00+07:00", messageCount: 4 },
  { id: "tk_05", subject: "Hoa hồng affiliate chưa được cộng", requesterName: "Hoàng Nam", requesterEmail: "hoangnam@email.com", status: "open", priority: "high", category: "Affiliate", createdAt: "2026-08-07T11:25:00+07:00", updatedAt: "2026-08-09T15:30:00+07:00", messageCount: 6 },
  { id: "tk_06", subject: "Đề xuất thêm khoá học về AI cho kế toán", requesterName: "Đỗ Khánh Linh", requesterEmail: "khanhlinh@email.com", status: "closed", priority: "low", category: "Góp ý", createdAt: "2026-08-05T09:10:00+07:00", updatedAt: "2026-08-06T10:00:00+07:00", messageCount: 2 },
  { id: "tk_07", subject: "Thanh toán bị trừ tiền hai lần", requesterName: "Trần Văn Sơn", requesterEmail: "vanson@email.com", status: "open", priority: "urgent", category: "Thanh toán", createdAt: "2026-08-10T06:50:00+07:00", updatedAt: "2026-08-10T07:05:00+07:00", messageCount: 1 },
  { id: "tk_08", subject: "Video bài học bị giật ở chất lượng cao", requesterName: "Ngô Bảo Châu", requesterEmail: "baochau@email.com", status: "resolved", priority: "normal", category: "Kỹ thuật", createdAt: "2026-08-04T20:00:00+07:00", updatedAt: "2026-08-05T11:20:00+07:00", messageCount: 7 },
];

export const TICKET_STATUS_LABEL: Record<SupportTicket["status"], string> = {
  open: "Đang mở",
  "in-progress": "Đang xử lý",
  resolved: "Đã giải quyết",
  closed: "Đã đóng",
};

export const TICKET_STATUS_STYLE: Record<
  SupportTicket["status"],
  { background: string; color: string }
> = {
  open: { background: "#fdeef0", color: "var(--v2-red)" },
  "in-progress": { background: "#fdf1e0", color: "#a9822c" },
  resolved: { background: "#e6f7ed", color: "#189a52" },
  closed: { background: "var(--v2-bg)", color: "var(--v2-muted)" },
};

export const PRIORITY_LABEL: Record<SupportTicket["priority"], string> = {
  low: "Thấp",
  normal: "Bình thường",
  high: "Cao",
  urgent: "Khẩn cấp",
};

export const PRIORITY_COLOR: Record<SupportTicket["priority"], string> = {
  low: "var(--v2-muted)",
  normal: "#1d5fd8",
  high: "#a9822c",
  urgent: "var(--v2-red)",
};

export async function listTickets(): Promise<SupportTicket[]> {
  return mockFetch(TICKETS);
}

/* ---------------------------------------------------------- Thư viện Media */

const MEDIA: MediaAsset[] = [
  { id: "md_01", name: "hero-companion-robot.png", kind: "image", sizeKb: 392, uploadedAt: "2026-08-04", folder: "Portal / Trang chủ", usedIn: 3 },
  { id: "md_02", name: "landing-hero-bg.jpg", kind: "image", sizeKb: 640, uploadedAt: "2026-07-28", folder: "Landing Page", usedIn: 1 },
  { id: "md_03", name: "gioi-thieu-hoc-vien.mp4", kind: "video", sizeKb: 48200, uploadedAt: "2026-07-20", folder: "Học viện AI", usedIn: 2 },
  { id: "md_04", name: "cam-nang-ai-cho-nguoi-moi.pdf", kind: "document", sizeKb: 2840, uploadedAt: "2026-07-15", folder: "CKOS / Tài liệu", usedIn: 5 },
  { id: "md_05", name: "icon-workspace.png", kind: "image", sizeKb: 84, uploadedAt: "2026-07-10", folder: "Portal / Icon", usedIn: 4 },
  { id: "md_06", name: "webinar-ai-doanh-nghiep.mp4", kind: "video", sizeKb: 76400, uploadedAt: "2026-07-02", folder: "Cộng đồng / Sự kiện", usedIn: 1 },
  { id: "md_07", name: "bo-prompt-seo-2026.pdf", kind: "document", sizeKb: 1620, uploadedAt: "2026-06-28", folder: "CKOS / Prompt", usedIn: 8 },
  { id: "md_08", name: "banner-premium.png", kind: "image", sizeKb: 312, uploadedAt: "2026-06-20", folder: "Portal / Premium", usedIn: 2 },
  { id: "md_09", name: "logo-doi-tac-digiu.svg", kind: "image", sizeKb: 18, uploadedAt: "2026-06-12", folder: "Hệ sinh thái", usedIn: 3 },
];

export const MEDIA_KIND_LABEL: Record<MediaAsset["kind"], string> = {
  image: "Ảnh",
  video: "Video",
  document: "Tài liệu",
};

export async function listMedia(): Promise<MediaAsset[]> {
  return mockFetch(MEDIA);
}

/* --------------------------------------------------------- Tích hợp & API */

export type ApiKey = {
  id: string;
  name: string;
  service: string;
  maskedKey: string;
  scope: string;
  lastUsedAt: string;
  active: boolean;
};

export async function listApiKeys(): Promise<ApiKey[]> {
  return mockFetch([
    { id: "ak1", name: "Companion — Gemini", service: "Google Gemini", maskedKey: "AIza••••••••••4f2c", scope: "Sinh nội dung", lastUsedAt: "2 phút trước", active: true },
    { id: "ak2", name: "Companion — Groq", service: "Groq", maskedKey: "gsk_••••••••••9a71", scope: "Sinh nội dung (dự phòng)", lastUsedAt: "18 phút trước", active: true },
    { id: "ak3", name: "Companion — OpenRouter", service: "OpenRouter", maskedKey: "sk-or••••••••2d40", scope: "Sinh nội dung (dự phòng)", lastUsedAt: "3 giờ trước", active: true },
    { id: "ak4", name: "Embedding CKOS", service: "Google Gemini", maskedKey: "AIza••••••••••7b19", scope: "Embedding tài liệu", lastUsedAt: "26 phút trước", active: true },
    { id: "ak5", name: "Cổng thanh toán VNPay", service: "VNPay", maskedKey: "vnp_••••••••3c88", scope: "Thanh toán", lastUsedAt: "9 phút trước", active: true },
    { id: "ak6", name: "Gửi email giao dịch", service: "Resend", maskedKey: "re_•••••••••5e02", scope: "Email", lastUsedAt: "1 giờ trước", active: true },
    { id: "ak7", name: "Lưu trữ media", service: "Supabase Storage", maskedKey: "sb_••••••••••1a44", scope: "Lưu trữ tệp", lastUsedAt: "12 phút trước", active: true },
    { id: "ak8", name: "Analytics", service: "Google Analytics", maskedKey: "G-••••••••XZ", scope: "Đo lường", lastUsedAt: "Vừa xong", active: false },
  ]);
}

export type Webhook = {
  id: string;
  endpoint: string;
  event: string;
  lastSentAt: string;
  ok: boolean;
  enabled: boolean;
};

export async function listWebhooks(): Promise<Webhook[]> {
  return mockFetch([
    { id: "wh1", endpoint: "/api/webhooks/payment", event: "payment.succeeded", lastSentAt: "9 phút trước", ok: true, enabled: true },
    { id: "wh2", endpoint: "/api/webhooks/affiliate", event: "referral.converted", lastSentAt: "42 phút trước", ok: true, enabled: true },
    { id: "wh3", endpoint: "/api/webhooks/enrollment", event: "course.enrolled", lastSentAt: "2 giờ trước", ok: true, enabled: true },
    { id: "wh4", endpoint: "/api/webhooks/newsletter", event: "member.subscribed", lastSentAt: "6 giờ trước", ok: false, enabled: false },
  ]);
}

/* ------------------------------------------------------- Mẫu thông báo gửi */

export type NotificationTemplate = {
  id: string;
  title: string;
  channel: string;
  audience: string;
  sentCount: number;
  openRate: string;
};

export async function listNotificationTemplates(): Promise<NotificationTemplate[]> {
  return mockFetch([
    { id: "nt1", title: "Chào mừng thành viên mới", channel: "Email + In-app", audience: "Người dùng mới", sentCount: 486, openRate: "72,4%" },
    { id: "nt2", title: "Nhắc tiếp tục khoá học đang dở", channel: "In-app + Push", audience: "Đang học", sentCount: 3240, openRate: "58,1%" },
    { id: "nt3", title: "Ưu đãi nâng cấp Premium", channel: "Email", audience: "Người dùng miễn phí", sentCount: 8120, openRate: "34,6%" },
    { id: "nt4", title: "Thông báo khoá học mới", channel: "In-app", audience: "Toàn bộ", sentCount: 18420, openRate: "61,2%" },
    { id: "nt5", title: "Nhắc gia hạn gói sắp hết hạn", channel: "Email + Push", audience: "Premium sắp hết hạn", sentCount: 214, openRate: "81,7%" },
  ]);
}
