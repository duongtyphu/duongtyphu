/**
 * PROGRAM: PRODUCTION BETA — Program Board.
 *
 * Dự án chuyển từ Sprint Mode sang Program Mode. 1 Program duy nhất
 * ("PRODUCTION BETA") chia thành 5 Track độc lập-nhưng-có-phụ-thuộc:
 *
 *   Track A — Core Runtime          (Workspace Session Kernel + Event Bus)
 *   Track B — AI Workforce          (Workforce Registry / Companion Manager)
 *   Track C — AI Operating Center   (AI Service Registry / Provider / Router)
 *   Track D — Workspace Runtime     (Output/Review/Approval/Portfolio/Memory)
 *   Track E — Production Goals      (Goal Runtime — Landing Page Production...)
 *
 * Đọc-chỉ (read-only), % Progress tính từ CÙNG checklist thật đã dùng ở
 * `goal-001-dashboard.ts` (không tạo 2 nguồn sự thật khác nhau) — Program
 * Board chỉ NHÓM lại các category đã có theo đúng Track, cộng thêm phần
 * Track E lấy trực tiếp từ Goal Runtime thật (`goal-runtime.ts`).
 *
 * Risks/Blockers/ETA là đánh giá quản lý (curated) của Program hiện tại —
 * không tính được từ code, phải cập nhật thủ công mỗi vòng Program khi sự
 * thật thay đổi (giống cách `docs/GOAL_001_PRODUCTION_BETA.md` được cập
 * nhật theo snapshot).
 */

import { computeGoal001Progress, type GoalChecklistItem } from "./goal-001-dashboard";
import { listGoals, listEpics, listGoalMissions } from "./goal-runtime";

export type TrackId = "A" | "B" | "C" | "D" | "E";
export type TrackStatus = "blocked" | "waiting_dependency" | "in_progress" | "done";

export type ProgramTrack = {
  trackId: TrackId;
  name: string;
  description: string;
  dependsOn: TrackId[];
  items: GoalChecklistItem[];
  progress: number; // round(doneCount / totalCount * 100)
  risks: string[];
  blockers: string[];
  eta: string;
  status: TrackStatus;
};

export type ProgramBoard = {
  program: string;
  overallPercent: number;
  tracks: ProgramTrack[];
};

function findCategory(categories: ReturnType<typeof computeGoal001Progress>["categories"], category: string) {
  const found = categories.find((c) => c.category === category);
  if (!found) throw new Error(`Program Board: thiếu category "${category}" từ goal-001-dashboard — sự thật đã trôi.`);
  return found.items;
}

function toTrack(
  trackId: TrackId,
  name: string,
  description: string,
  dependsOn: TrackId[],
  items: GoalChecklistItem[],
  risks: string[],
  blockers: string[],
  eta: string
): ProgramTrack {
  const doneCount = items.filter((i) => i.done).length;
  const progress = Math.round((doneCount / items.length) * 100);
  const status: TrackStatus =
    blockers.length > 0 ? "blocked" : progress === 100 ? "done" : dependsOn.length > 0 ? "in_progress" : "in_progress";
  return { trackId, name, description, dependsOn, items, progress, risks, blockers, eta, status };
}

export function computeProgramBoard(): ProgramBoard {
  const goal001 = computeGoal001Progress();
  const workforceItems = findCategory(goal001.categories, "Workforce Progress");
  const blueprintItems = findCategory(goal001.categories, "Blueprint Progress");
  const workspaceItems = findCategory(goal001.categories, "Workspace Progress");
  const aiProviderItems = findCategory(goal001.categories, "AI Provider Progress");
  const portfolioItems = findCategory(goal001.categories, "Portfolio Progress");
  const memoryItems = findCategory(goal001.categories, "Memory Progress");

  // Track A — Core Runtime: phần Kernel/Event Bus lõi trong Workspace Progress
  // (Session Kernel, Output/Review/Approval Kernel, Event Timeline).
  const coreRuntimeItems = workspaceItems.filter((i) =>
    /Session Kernel|Output\/Review\/Approval\/Portfolio Kernel|Event Timeline/.test(i.label)
  );

  // Track D — Workspace Runtime: phần còn lại của Workspace Progress (Companion
  // nối Output, Memory Sync, UI Output Center, lưu trữ bền vững) + toàn bộ
  // Portfolio Progress + Memory Progress.
  const workspaceRuntimeItems = [
    ...workspaceItems.filter((i) => !coreRuntimeItems.includes(i)),
    ...portfolioItems,
    ...memoryItems,
  ];

  const goals = listGoals();
  const productionGoalsItems: GoalChecklistItem[] = [
    ...blueprintItems,
    { label: "Goal Runtime (Goal → Epic → Mission) hoạt động, tái sử dụng cho mọi Goal", done: true },
    { label: "Landing Page Production đã gieo là Goal đầu tiên của hệ thống", done: goals.some((g) => g.title === "Landing Page Production") },
    {
      label: "Ít nhất 1 Mission của Landing Page Production đã hoàn thành (completed)",
      done: goals
        .filter((g) => g.title === "Landing Page Production")
        .flatMap((g) => listEpics(g.goalId))
        .flatMap((e) => listGoalMissions(e.epicId))
        .some((m) => m.status === "completed"),
    },
  ];

  const tracks: ProgramTrack[] = [
    toTrack(
      "A",
      "Core Runtime",
      "Workspace Session Kernel (Pause/Resume/Complete) + Growth Event Bus — nền tảng khóa, mọi Track khác build trên đây.",
      [],
      coreRuntimeItems,
      ["Kernel hiện lưu localStorage — chưa chịu tải nhiều User/thiết bị thật."],
      [],
      "Đã sẵn sàng cho Production Beta ở quy mô single-owner/browser."
    ),
    toTrack(
      "B",
      "AI Workforce",
      "Workforce Registry (30 Companion/7 Department) + Companion Manager điều phối Task qua AI Service Manager.",
      ["A"],
      workforceItems,
      ["performanceScore Companion vẫn tĩnh, chưa cập nhật từ Task hoàn thành thật."],
      ["Chưa verify được Provider thật (không phải Mock) trong sandbox này."],
      "Sẵn sàng chức năng; cần môi trường có API key thật để verify Provider trước Production Beta."
    ),
    toTrack(
      "C",
      "AI Operating Center",
      "AI Service Registry/Manager, 10 Provider Adapter, Model Router (routing/fallback/cost optimization).",
      ["A"],
      aiProviderItems,
      ["ProviderScore hiện là prior tự khai báo, chưa dựa trên dữ liệu đo thật."],
      ["Chưa có Provider thật verify với API key thật trong sandbox này."],
      "Cần 1 vòng verify với ít nhất 1 Provider thật trước khi tuyên bố Production Beta."
    ),
    toTrack(
      "D",
      "Workspace Runtime",
      "Output/Review/Approval Center, Portfolio Sync, Memory Sync — nơi AI Workforce thực sự làm việc trên mọi Goal.",
      ["A", "B", "C"],
      workspaceRuntimeItems,
      ["UI Output Center còn hiển thị raw text cho đa số loại Output.", "Chưa có UI Memory Panel cho Owner xem lại."],
      [],
      "Chức năng lõi đã chạy E2E thật (Facebook Content); còn thiếu polish UI, không chặn Production Beta chức năng."
    ),
    toTrack(
      "E",
      "Production Goals",
      "Goal Runtime chung + Landing Page Production là Goal đầu tiên chạy qua toàn bộ Runtime Flow.",
      ["D"],
      productionGoalsItems,
      ["Mới 1/10 Golden Mission Blueprint có E2E verify thật.", "Chuỗi Collaboration Matrix nhiều Companion nối tiếp chưa chạy thật."],
      [],
      "Mission 01 (Research & Planning) sẵn sàng bắt đầu — đang chờ xác nhận Owner theo đúng trình tự Goal Runtime → Mission."
    ),
  ];

  const overallPercent = Math.round(tracks.reduce((sum, t) => sum + t.progress, 0) / tracks.length);
  return { program: "PRODUCTION BETA", overallPercent, tracks };
}
