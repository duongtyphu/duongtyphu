import { mockFetch } from "./client";
import type { PortalUser } from "./types";

const USERS: PortalUser[] = [
  {
    id: "usr_01",
    fullName: "Võ Dương",
    email: "vo.duong@email.com",
    initials: "VD",
    plan: "vip",
    status: "active",
    joinedAt: "2026-01-12",
    lastActiveAt: "2026-08-10T10:28:00+07:00",
    coursesEnrolled: 18,
    totalSpent: 24800000,
    referralCode: "VODUONG",
    isAdmin: true,
  },
  {
    id: "usr_02",
    fullName: "Minh Anh",
    email: "minhanh@email.com",
    initials: "MA",
    plan: "free",
    status: "active",
    joinedAt: "2026-03-03",
    lastActiveAt: "2026-08-10T10:15:00+07:00",
    coursesEnrolled: 3,
    totalSpent: 0,
    referralCode: "MINHANH1",
    isAdmin: false,
  },
  {
    id: "usr_03",
    fullName: "Trần Thị Mai",
    email: "tranmai@email.com",
    initials: "TM",
    plan: "premium",
    status: "active",
    joinedAt: "2025-11-28",
    lastActiveAt: "2026-08-10T09:30:00+07:00",
    coursesEnrolled: 11,
    totalSpent: 8900000,
    referralCode: "TRANMAI",
    isAdmin: false,
  },
  {
    id: "usr_04",
    fullName: "Hoàng Nam",
    email: "hoangnam@email.com",
    initials: "HN",
    plan: "premium",
    status: "active",
    joinedAt: "2025-09-15",
    lastActiveAt: "2026-08-10T07:30:00+07:00",
    coursesEnrolled: 9,
    totalSpent: 12400000,
    referralCode: "HOANGNAM",
    isAdmin: false,
  },
  {
    id: "usr_05",
    fullName: "Thảo Vy",
    email: "thaovy@email.com",
    initials: "TV",
    plan: "free",
    status: "pending",
    joinedAt: "2025-06-20",
    lastActiveAt: "2026-07-29T18:00:00+07:00",
    coursesEnrolled: 1,
    totalSpent: 0,
    referralCode: "THAOVY",
    isAdmin: false,
  },
  {
    id: "usr_06",
    fullName: "Quang Huy",
    email: "quanghuy@email.com",
    initials: "QH",
    plan: "premium",
    status: "suspended",
    joinedAt: "2025-02-02",
    lastActiveAt: "2026-06-26T11:00:00+07:00",
    coursesEnrolled: 6,
    totalSpent: 3200000,
    referralCode: "QUANGHUY",
    isAdmin: false,
  },
  {
    id: "usr_07",
    fullName: "Lê Hoàng Nam",
    email: "lehnam@email.com",
    initials: "LN",
    plan: "premium",
    status: "active",
    joinedAt: "2025-08-08",
    lastActiveAt: "2026-08-10T10:00:00+07:00",
    coursesEnrolled: 14,
    totalSpent: 15600000,
    referralCode: "LEHNAM",
    isAdmin: false,
  },
  {
    id: "usr_08",
    fullName: "Phạm Thu Hà",
    email: "thuha@email.com",
    initials: "PH",
    plan: "free",
    status: "active",
    joinedAt: "2026-05-19",
    lastActiveAt: "2026-08-09T21:40:00+07:00",
    coursesEnrolled: 4,
    totalSpent: 0,
    referralCode: "THUHA",
    isAdmin: false,
  },
  {
    id: "usr_09",
    fullName: "Đỗ Khánh Linh",
    email: "khanhlinh@email.com",
    initials: "ĐL",
    plan: "premium",
    status: "active",
    joinedAt: "2025-12-01",
    lastActiveAt: "2026-08-09T16:05:00+07:00",
    coursesEnrolled: 8,
    totalSpent: 6700000,
    referralCode: "KHANHLINH",
    isAdmin: false,
  },
  {
    id: "usr_10",
    fullName: "Bùi Tiến Đạt",
    email: "tiendat@email.com",
    initials: "BĐ",
    plan: "free",
    status: "active",
    joinedAt: "2026-07-02",
    lastActiveAt: "2026-08-08T08:20:00+07:00",
    coursesEnrolled: 2,
    totalSpent: 0,
    referralCode: "TIENDAT",
    isAdmin: false,
  },
];

/** Nhãn gói hiển thị trong bảng. */
export const PLAN_LABEL: Record<PortalUser["plan"], string> = {
  free: "Miễn phí",
  premium: "Premium",
  vip: "Premium 12T",
};

export const PLAN_STYLE: Record<PortalUser["plan"], { background: string; color: string }> = {
  free: { background: "var(--v2-violet-light)", color: "var(--v2-violet)" },
  premium: { background: "#fdf1e0", color: "#a9822c" },
  vip: { background: "#e6f0ff", color: "#1d5fd8" },
};

export const STATUS_LABEL: Record<PortalUser["status"], string> = {
  active: "Đang hoạt động",
  pending: "Không hoạt động",
  suspended: "Bị khoá",
};

export const STATUS_COLOR: Record<PortalUser["status"], string> = {
  active: "var(--v2-green)",
  pending: "var(--v2-gold)",
  suspended: "var(--v2-red)",
};

export async function listUsers(): Promise<PortalUser[]> {
  return mockFetch(USERS);
}

export async function getUser(id: string): Promise<PortalUser | null> {
  return mockFetch(USERS.find((user) => user.id === id) ?? null);
}

/** Tổng số người dùng trên hệ thống — bảng chỉ tải một trang, con số này là toàn cục. */
export async function countUsers(): Promise<number> {
  return mockFetch(18420);
}
