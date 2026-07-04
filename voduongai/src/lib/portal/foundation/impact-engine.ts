/**
 * EPIC 03 — Sprint B5: Capability & AI Impact Engine.
 *
 * AI Impact / Business Impact / Human Impact — đo GIÁ TRỊ, không chấm
 * điểm (khác Capability Engine đo NĂNG LỰC — `capability-engine.ts`).
 * Chỉ tính từ dữ liệu thật đã có (`WorkspaceSession`/`Output`/
 * `PortfolioItem`) — KHÔNG bịa số liệu Before/After khi chưa có UI thu
 * thập (chưa xây trong sprint này, đúng brief "không cần UI").
 */

import { listAllSessions } from "./workspace-session-store";
import { listPortfolioItems } from "./portfolio-store";

export type AiImpactSummary = {
  reuseCount: number; // số Output có >1 version — bằng chứng đã tái sử dụng/cải tiến
  outputsCreated: number;
  timeSaved?: string; // chỉ có giá trị nếu tương lai có UI Before/After thật — hiện để trống, không bịa số
};

/** AI Impact Engine — chỉ tính những gì đo được THẬT từ dữ liệu đã có.
    `timeSaved`/`qualityImproved`/`automation` cần input Before/After
    chưa có UI thu thập ở Sprint B5 — để `undefined`, không suy diễn. */
export function computeAiImpactSummary(): AiImpactSummary {
  const sessions = listAllSessions();
  let reuseCount = 0;
  let outputsCreated = 0;
  for (const s of sessions) {
    for (const o of s.outputs) {
      outputsCreated += 1;
      if (o.versions.length > 1) reuseCount += 1;
    }
  }
  return { reuseCount, outputsCreated };
}

export type BusinessImpactSummary = {
  outputsReadyToUse: number; // Output đã Review — đủ chuẩn "dùng được trong công việc thật"
  businessValueNotes: string[]; // tự-báo-cáo qua Reflection (nếu người dùng có nhắc business value) — hiện chỉ khung, chưa phân tích nội dung
};

/** Business Impact Engine — Framework only, đúng brief ("không cần tính
    tiền, chỉ thiết kế Framework"). Không có UI nhập "khách hàng chấp
    nhận"/doanh thu ở sprint này — chỉ đếm Output đã sẵn sàng dùng thật. */
export function computeBusinessImpactSummary(): BusinessImpactSummary {
  const sessions = listAllSessions();
  let outputsReadyToUse = 0;
  for (const s of sessions) {
    outputsReadyToUse += s.outputs.filter((o) => o.reviewStatus === "reviewed").length;
  }
  return { outputsReadyToUse, businessValueNotes: [] };
}

export type HumanImpactSummary = {
  reflectionsSubmitted: number; // bằng chứng thật duy nhất đo được ở sprint này — người học đã tự nhận biết điều gì đó
  missionsCompletedIndependently: number; // Session hoàn thành không cần Companion Coaching lặp lại nhiều lần (xấp xỉ qua ít history hơn ngưỡng)
};

/**
 * Human Impact Engine — tầng quan trọng nhất theo Product Principle,
 * nhưng cũng khó đo nhất bằng dữ liệu thô. Sprint B5 CHƯA có AI phân
 * tích nội dung Reflection (không AI Agent trong sprint này) — chỉ đếm
 * số Reflection thật đã gửi làm bằng chứng "người học tự nhận biết,"
 * không suy diễn "tự tin hơn bao nhiêu %" khi không đo được thật.
 */
export function computeHumanImpactSummary(): HumanImpactSummary {
  const sessions = listAllSessions();
  let reflectionsSubmitted = 0;
  let missionsCompletedIndependently = 0;
  for (const s of sessions) {
    for (const o of s.outputs) reflectionsSubmitted += o.reflections.length;
    if (s.status === "completed" && s.history.length <= 6) missionsCompletedIndependently += 1;
  }
  return { reflectionsSubmitted, missionsCompletedIndependently };
}

export type ImpactDashboardData = {
  missionsCompleted: number;
  workspaceHours: number; // tính thật từ startedAt→finishedAt (hoặc tới hiện tại nếu chưa xong)
  outputsCreated: number;
  portfolioSize: number;
  timeSaved?: string; // chưa đo được thật ở sprint này — để trống
  businessValue?: string; // chưa đo được thật ở sprint này — để trống
  capabilityGrowth: number; // số Capability đã đạt Level ≥ 1
  humanGrowth: number; // số Reflection đã gửi
};

/** Impact Dashboard Data — chuẩn bị dữ liệu, KHÔNG xây UI (đúng brief).
    Sprint sau (nếu cần Dashboard UI thật) chỉ cần gọi hàm này. */
export function getImpactDashboardData(capabilityGrowth: number): ImpactDashboardData {
  const sessions = listAllSessions();
  const ai = computeAiImpactSummary();
  const human = computeHumanImpactSummary();

  let workspaceHours = 0;
  let missionsCompleted = 0;
  for (const s of sessions) {
    if (s.status === "completed") missionsCompleted += 1;
    const end = s.finishedAt ? new Date(s.finishedAt).getTime() : Date.now();
    const start = new Date(s.startedAt).getTime();
    workspaceHours += Math.max(0, (end - start) / 3_600_000);
  }

  return {
    missionsCompleted,
    workspaceHours: Math.round(workspaceHours * 10) / 10,
    outputsCreated: ai.outputsCreated,
    portfolioSize: listPortfolioItems().length,
    capabilityGrowth,
    humanGrowth: human.reflectionsSubmitted,
  };
}
