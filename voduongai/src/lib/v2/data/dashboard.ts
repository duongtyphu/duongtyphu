import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  Crown,
  FileText,
  RefreshCw,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { mockFetch } from "./client";

/* ------------------------------------------------------------------ KPI */

export type Kpi = {
  id: string;
  value: string;
  label: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient: string;
};

const KPIS: Kpi[] = [
  {
    id: "users",
    value: "18.420",
    label: "Tổng người dùng",
    delta: "12,4%",
    trend: "up",
    icon: Users,
    gradient: "linear-gradient(145deg,#a08bff,#6d4aff)",
  },
  {
    id: "premium",
    value: "2.384",
    label: "Thành viên Premium",
    delta: "8,1%",
    trend: "up",
    icon: Crown,
    gradient: "linear-gradient(145deg,#e2b23c,#a9660f)",
  },
  {
    id: "revenue",
    value: "486,2 Tr₫",
    label: "Doanh thu (30 ngày)",
    delta: "15,7%",
    trend: "up",
    icon: Wallet,
    gradient: "linear-gradient(145deg,#3ecf7e,#189a52)",
  },
  {
    id: "content",
    value: "312",
    label: "Khoá học & tài nguyên",
    delta: "4,3%",
    trend: "up",
    icon: BookOpen,
    gradient: "linear-gradient(145deg,#4bc4e0,#0e7490)",
  },
  {
    id: "moderation",
    value: "96",
    label: "Bài viết cần kiểm duyệt",
    delta: "2,6%",
    trend: "down",
    icon: FileText,
    gradient: "linear-gradient(145deg,#ff9d52,#c2660a)",
  },
];

export async function listKpis(): Promise<Kpi[]> {
  return mockFetch(KPIS);
}

/* ------------------------------------------------------- Trạng thái hệ thống */

export type SystemStatus = {
  id: string;
  name: string;
  state: "ok" | "syncing" | "down";
  label: string;
};

const STATUSES: SystemStatus[] = [
  { id: "portal", name: "Portal chính", state: "ok", label: "Hoạt động" },
  { id: "companion", name: "Companion AI", state: "ok", label: "Hoạt động" },
  { id: "payment", name: "Cổng thanh toán", state: "ok", label: "Hoạt động" },
  { id: "ckos", name: "Hệ tri thức (CKOS)", state: "syncing", label: "Đang đồng bộ" },
  { id: "community", name: "Cộng đồng AI", state: "ok", label: "Hoạt động" },
];

export async function listSystemStatus(): Promise<SystemStatus[]> {
  return mockFetch(STATUSES);
}

/* --------------------------------------------------- Phân bổ theo mục & chart */

export type SectionUsage = { id: string; label: string; value: number; percent: number; color: string };

const USAGE: SectionUsage[] = [
  { id: "hoc-vien", label: "Học viện AI", value: 6120, percent: 82, color: "var(--v2-violet)" },
  { id: "ckos", label: "Hệ tri thức (CKOS)", value: 4780, percent: 64, color: "#5f8fff" },
  { id: "workspace", label: "AI Workspace", value: 3940, percent: 55, color: "#4bc4e0" },
  { id: "du-an", label: "Dự án & Cơ hội", value: 2610, percent: 40, color: "var(--v2-gold)" },
  { id: "cong-dong", label: "Cộng đồng AI", value: 1850, percent: 31, color: "#3ecf7e" },
];

export async function listSectionUsage(): Promise<SectionUsage[]> {
  return mockFetch(USAGE);
}

/** 12 điểm dữ liệu cho biểu đồ tăng trưởng — người dùng mới và doanh thu (triệu ₫). */
export type GrowthPoint = { label: string; users: number; revenue: number };

const GROWTH: GrowthPoint[] = [
  { label: "T9", users: 640, revenue: 250 },
  { label: "T10", users: 720, revenue: 268 },
  { label: "T11", users: 690, revenue: 291 },
  { label: "T12", users: 880, revenue: 340 },
  { label: "T1", users: 950, revenue: 358 },
  { label: "T2", users: 870, revenue: 332 },
  { label: "T3", users: 1040, revenue: 392 },
  { label: "T4", users: 1120, revenue: 415 },
  { label: "T5", users: 1080, revenue: 402 },
  { label: "T6", users: 1240, revenue: 448 },
  { label: "T7", users: 1310, revenue: 470 },
  { label: "T8", users: 1420, revenue: 486 },
];

export async function listGrowthSeries(): Promise<GrowthPoint[]> {
  return mockFetch(GROWTH);
}

/* -------------------------------------------------------- Hoạt động gần đây */

export type ActivityItem = {
  id: string;
  text: string;
  emphasis?: string;
  time: string;
  icon: LucideIcon;
  background: string;
  color: string;
};

const ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    emphasis: "Trần Thị Mai",
    text: "đã nâng cấp lên Premium 12 tháng",
    time: "5 phút",
    icon: Crown,
    background: "#e6f7ed",
    color: "#189a52",
  },
  {
    id: "a2",
    emphasis: "«Tự động hoá với AI & n8n»",
    text: "— khoá học mới đã xuất bản",
    time: "32 phút",
    icon: BookOpen,
    background: "var(--v2-violet-light)",
    color: "var(--v2-violet)",
  },
  {
    id: "a3",
    text: "1 bài viết trong Cộng đồng bị báo cáo vi phạm",
    time: "1 giờ",
    icon: AlertTriangle,
    background: "#fdeef0",
    color: "var(--v2-red)",
  },
  {
    id: "a4",
    text: "48 người dùng mới đăng ký hôm nay",
    time: "2 giờ",
    icon: UserPlus,
    background: "#e6f0ff",
    color: "#1d5fd8",
  },
  {
    id: "a5",
    emphasis: "SolarGroup",
    text: "— cập nhật số liệu dự án",
    time: "3 giờ",
    icon: RefreshCw,
    background: "#fdf1e0",
    color: "#a9822c",
  },
];

export async function listRecentActivity(): Promise<ActivityItem[]> {
  return mockFetch(ACTIVITY);
}
