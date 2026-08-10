import { mockFetch } from "./client";
import type { AppNotification } from "./types";

const NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf_01",
    kind: "course",
    title: "Bài học mới trong lộ trình của bạn",
    body: "«Prompt Engineering nâng cao — Chuỗi suy luận» vừa được thêm vào Học viện AI.",
    createdAt: "2026-08-10T08:12:00+07:00",
    read: false,
  },
  {
    id: "ntf_02",
    kind: "affiliate",
    title: "Hoa hồng mới được duyệt",
    body: "Giao dịch từ Nguyễn Minh Anh đã được duyệt — 450.000 ₫ vào ví của bạn.",
    createdAt: "2026-08-09T19:40:00+07:00",
    read: false,
  },
  {
    id: "ntf_03",
    kind: "community",
    title: "Bài viết của bạn được ghim",
    body: "«Cách mình dùng AI để rút ngắn quy trình viết nội dung» đã được ghim ở Cộng đồng AI.",
    createdAt: "2026-08-09T10:05:00+07:00",
    read: false,
  },
  {
    id: "ntf_04",
    kind: "system",
    title: "Companion đã cập nhật bộ nhớ",
    body: "Companion ghi nhận mục tiêu quý mới của bạn và điều chỉnh gợi ý lộ trình.",
    createdAt: "2026-08-08T21:15:00+07:00",
    read: true,
  },
  {
    id: "ntf_05",
    kind: "course",
    title: "Bạn đã hoàn thành 60% khóa AI Workspace",
    body: "Còn 4 bài nữa là bạn hoàn tất chứng chỉ AI Workspace Foundation.",
    createdAt: "2026-08-07T14:30:00+07:00",
    read: true,
  },
];

export async function listNotifications(): Promise<AppNotification[]> {
  return mockFetch(NOTIFICATIONS);
}

export async function countUnreadNotifications(): Promise<number> {
  return mockFetch(NOTIFICATIONS.filter((n) => !n.read).length);
}
