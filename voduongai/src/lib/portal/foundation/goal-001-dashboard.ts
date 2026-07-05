/**
 * GOAL 001 — Production Beta Dashboard.
 *
 * Đọc-chỉ (read-only), tính % tiến độ từ dữ liệu/registry THẬT đã có
 * trong repo (Workforce Registry, Provider Registry, Golden Mission
 * Catalog, Portfolio/Memory Store) — không bịa số liệu, không tạo
 * Kernel/Registry mới. Mỗi hạng mục là 1 checklist cụ thể (đếm được),
 * % = số mục đạt / tổng số mục, để tránh phần trăm cảm tính.
 *
 * Cập nhật checklist này khi có Sprint mới thay đổi sự thật (thêm
 * Companion/Provider/Blueprint, nối backend thật, v.v.) — không tự
 * "làm tròn lên" khi chưa có bằng chứng.
 */

import { listCompanions } from "./workforce-registry";
import { GOLDEN_MISSIONS } from "./mission-catalog";

export type GoalChecklistItem = {
  label: string;
  done: boolean;
};

export type GoalCategoryProgress = {
  category: string;
  items: GoalChecklistItem[];
  percent: number; // round(doneCount / totalCount * 100)
};

export type Goal001Progress = {
  overallPercent: number;
  categories: GoalCategoryProgress[];
};

function toCategory(category: string, items: GoalChecklistItem[]): GoalCategoryProgress {
  const doneCount = items.filter((i) => i.done).length;
  return { category, items, percent: Math.round((doneCount / items.length) * 100) };
}

export function computeGoal001Progress(): Goal001Progress {
  const companions = listCompanions();
  const departments = new Set(companions.map((c) => c.department));

  const workforce = toCategory("Workforce Progress", [
    { label: "30/30 Companion đã định nghĩa trong Workforce Registry", done: companions.length === 30 },
    { label: "7/7 Department có Companion", done: departments.size === 7 },
    { label: "Companion Lifecycle (Activate/Task Assignment) chạy thật", done: true },
    { label: "Companion Manager điều phối qua AI Service Manager (không tự chọn Provider)", done: true },
    { label: "Ít nhất 1 Provider thật (không phải Mock) đã verify chạy trong môi trường này", done: false },
    { label: "Performance thật cập nhật từ Task hoàn thành (performanceScore hiện vẫn tĩnh 50)", done: false },
  ]);

  const blueprint = toCategory("Blueprint Progress", [
    { label: "10/10 Golden Mission trong catalog", done: GOLDEN_MISSIONS.length === 10 },
    { label: "Blueprint Lock được tôn trọng (không sửa Blueprint đã khóa)", done: true },
    { label: "Execution Timeline 7 bước nối vào Output/Review/Approval thật", done: true },
    { label: "Cả 10 Blueprint có ít nhất 1 lần chạy E2E thật được verify (hiện chỉ 1/10 — Facebook Content)", done: false },
    { label: "Chuỗi Collaboration Matrix (nhiều Companion nối tiếp) chạy thật, không chỉ tài liệu hoá", done: false },
  ]);

  const workspace = toCategory("Workspace Progress", [
    { label: "Workspace Session Kernel (Pause/Resume/Complete) hoạt động", done: true },
    { label: "Output/Review/Approval/Portfolio Kernel hoạt động", done: true },
    { label: "Companion (bất kỳ 1/30) → Output Kernel đã nối (Sprint 003)", done: true },
    { label: "Memory Sync đã nối, idempotent", done: true },
    { label: "Event Timeline phủ đủ Runtime Flow (Goal → Memory)", done: true },
    { label: "Lưu trữ bền vững (Supabase) thay vì localStorage", done: false },
    { label: "UI Output Center hiển thị đúng định dạng cho cả 30 Companion (hiện đa số là raw text)", done: false },
  ]);

  const aiProvider = toCategory("AI Provider Progress", [
    { label: "AI Service Registry/Manager chạy thật", done: true },
    { label: "10/10 Provider Adapter implement đúng contract", done: true },
    { label: "Routing/Fallback/Cost Optimization chạy thật", done: true },
    { label: "Ít nhất 1 Provider thật verify với API key thật (sandbox này chưa có)", done: false },
    { label: "ProviderScore dựa trên dữ liệu đo thật (hiện toàn bộ vẫn là prior tự khai báo)", done: false },
  ]);

  const portfolio = toCategory("Portfolio Progress", [
    { label: "Portfolio Engine tự động promote (Review + Reflection)", done: true },
    { label: "Portfolio Item tham chiếu Output, không copy dữ liệu (Single Source of Truth)", done: true },
    { label: "Verify qua E2E test thật", done: true },
    { label: "Lưu trữ bền vững (Supabase) thay vì localStorage", done: false },
    { label: "UI Portfolio hiển thị rõ Companion/Provider đã tạo Output (hiện phải suy ra qua Agent Run Log)", done: false },
  ]);

  const memory = toCategory("Memory Progress", [
    { label: "Memory Contract định nghĩa + implement thật", done: true },
    { label: "Memory Sync nối vào dữ liệu Reflection/Portfolio thật, không suy diễn", done: true },
    { label: "Idempotent, verify qua test", done: true },
    { label: "Có UI Memory Panel cho Owner xem lại", done: false },
    { label: "Memory phản hồi ngược vào Learning Coach/Capability Improvement tính toán được", done: false },
  ]);

  const categories = [workforce, blueprint, workspace, aiProvider, portfolio, memory];
  const overallPercent = Math.round(categories.reduce((sum, c) => sum + c.percent, 0) / categories.length);

  return { overallPercent, categories };
}
