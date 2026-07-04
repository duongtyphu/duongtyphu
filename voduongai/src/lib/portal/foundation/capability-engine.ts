/**
 * EPIC 03 — Sprint B5: Capability & AI Impact Engine.
 *
 * Capability Engine — KHÔNG dùng Quiz/Điểm/Chứng chỉ. Capability chỉ
 * được cập nhật khi có Evidence thật (Output + Reflection đã submit —
 * cùng điều kiện dùng để promote Portfolio ở Sprint B4, đúng nguyên tắc
 * "một điều kiện, nhiều hệ quả" thay vì định nghĩa lại Evidence riêng).
 *
 * Data Ownership (Role & Responsibility Matrix mục 7): Capability Engine
 * chỉ ĐỌC `WorkspaceSession`/`PortfolioItem`/`GrowthEvent` đã có — không
 * module nào khác được ghi trực tiếp vào `CapabilityProfile`.
 */

import { listAllSessions, type WorkspaceSessionRecord, type OutputRecord } from "./workspace-session-store";
import { listPortfolioItems } from "./portfolio-store";
import { emitGrowthEvent } from "./growth-event-bus";

/**
 * 6 mức Capability (Level 0-5) — thang triển khai chính thức của
 * EPIC 03 từ Sprint B5 trở đi. Đây là bản CHI TIẾT HÓA áp dụng thực tế
 * của 2 thang đã mô tả ở tài liệu thiết kế trước đó
 * (Introduced/Practiced/Applied/Mastered — Mission Library Standard mục
 * 9; 7 mức Biết→...→Hướng dẫn người khác — Assessment & Capability
 * Standard mục 9) — cùng một khái niệm, không phải 3 hệ song song. Ánh
 * xạ: Level 0 ~ (chưa có), Level 1 = Introduced, Level 2-3 = Practiced,
 * Level 3-4 = Applied, Level 5 = Mastered.
 */
export const CAPABILITY_LEVEL_LABELS = [
  "Chưa thực hành",
  "Hiểu",
  "Làm được",
  "Làm độc lập",
  "Làm hiệu quả",
  "Có thể hướng dẫn người khác",
] as const;

export type CapabilityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type CapabilityProfileRecord = {
  capabilityId: string;
  name: string;
  description: string;
  evidenceCount: number;
  missionsCompleted: number;
  portfolioLinked: number;
  currentLevel: CapabilityLevel;
  updatedAt: string;
};

export type CapabilityTimelineEntry = {
  capabilityId: string;
  level: CapabilityLevel;
  evidenceCountAtChange: number;
  changedAt: string;
};

const TIMELINE_KEY = "vdai_capability_timeline";

/**
 * Capability hiện tại được xấp xỉ theo `context.module` — vì Portal CHƯA
 * có catalog Mission/Competency thật (Technical Debt đã ghi ở Sprint B1
 * Foundation Report #1, chưa xử lý). Khi Mission Engine thật tồn tại
 * (Sprint B7+), thay `deriveCapabilityId` bằng đọc `mission.competencyIds`
 * thật — không đổi phần còn lại của Engine.
 */
const MODULE_CAPABILITY_LABEL: Record<string, { name: string; description: string }> = {
  academy: { name: "Học tập chủ động cùng AI", description: "Năng lực tự học và thực hành có hệ thống trong Học viện AI." },
  "khong-gian-ai": { name: "Thực hành tạo kết quả bằng AI", description: "Năng lực dùng AI để tạo ra Output thật trong công việc." },
  ckos: { name: "Ứng dụng tri thức thực chiến", description: "Năng lực áp dụng kiến thức từ Thư viện tri thức vào việc thật." },
  opportunities: { name: "Ra quyết định dự án bằng AI", description: "Năng lực dùng AI hỗ trợ đánh giá dự án/cơ hội." },
};

function deriveCapabilityId(module: string): string {
  return `capability_${module}`;
}

/** Evidence Engine — 1 Output là Evidence hợp lệ khi đã Review + đã
    Reflection (cùng điều kiện Portfolio, Capability Evidence Framework
    mục 1.1). Thiếu 1 trong 2, KHÔNG tính là Evidence. */
function isValidEvidence(output: OutputRecord): boolean {
  return output.reviewStatus === "reviewed" && output.reflectionStatus === "submitted";
}

function levelFromEvidenceCount(count: number): CapabilityLevel {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  if (count <= 7) return 4;
  return 5;
}

function readTimeline(): CapabilityTimelineEntry[] {
  try {
    const raw = window.localStorage.getItem(TIMELINE_KEY);
    return raw ? (JSON.parse(raw) as CapabilityTimelineEntry[]) : [];
  } catch {
    return [];
  }
}

function appendTimeline(entry: CapabilityTimelineEntry) {
  try {
    const all = readTimeline();
    all.push(entry);
    window.localStorage.setItem(TIMELINE_KEY, JSON.stringify(all.slice(-1000)));
  } catch {
    // localStorage đầy/không khả dụng — Timeline chỉ mất khả năng lưu lâu dài.
  }
}

/** Capability Timeline — lưu lịch sử, KHÔNG ghi đè (mỗi lần level đổi là
    1 entry mới, giữ toàn bộ Level 1→2→3... trước đó). */
export function getCapabilityTimeline(capabilityId: string): CapabilityTimelineEntry[] {
  return readTimeline().filter((e) => e.capabilityId === capabilityId);
}

/**
 * Validation Rule: Capability chỉ cập nhật khi CÓ Evidence thật (Output +
 * Reflection). Không có Output/Reflection/Evidence nào cho 1 capabilityId
 * → giữ nguyên Level đã lưu lần trước (đọc từ Timeline), không tự tăng
 * theo thời gian, không giảm ngẫu nhiên.
 */
export function computeCapabilityProfiles(sessions?: WorkspaceSessionRecord[]): CapabilityProfileRecord[] {
  const allSessions = sessions ?? listAllSessions();
  const portfolioItems = listPortfolioItems();
  const now = new Date().toISOString();

  const byCapability = new Map<string, { evidenceCount: number; missionsCompleted: number; portalModule: string }>();

  for (const session of allSessions) {
    const portalModule = session.context.module;
    const capabilityId = deriveCapabilityId(portalModule);
    const bucket = byCapability.get(capabilityId) ?? { evidenceCount: 0, missionsCompleted: 0, portalModule };
    bucket.evidenceCount += session.outputs.filter(isValidEvidence).length;
    if (session.status === "completed") bucket.missionsCompleted += 1;
    byCapability.set(capabilityId, bucket);
  }

  const profiles: CapabilityProfileRecord[] = [];

  for (const [capabilityId, bucket] of byCapability) {
    if (bucket.evidenceCount <= 0) continue; // Validation Rule: không có Evidence → không tạo/cập nhật hồ sơ

    const label = MODULE_CAPABILITY_LABEL[bucket.portalModule] ?? {
      name: `Năng lực thực hành (${bucket.portalModule})`,
      description: "Năng lực hình thành từ hoạt động thật trong module này.",
    };
    const portfolioLinked = portfolioItems.filter((p) => deriveCapabilityId(p.tags[0] ?? "") === capabilityId).length;
    const newLevel = levelFromEvidenceCount(bucket.evidenceCount);

    const timeline = getCapabilityTimeline(capabilityId);
    const lastEntry = timeline[timeline.length - 1];
    if (!lastEntry || lastEntry.level !== newLevel) {
      appendTimeline({ capabilityId, level: newLevel, evidenceCountAtChange: bucket.evidenceCount, changedAt: now });
      emitGrowthEvent({ eventType: "CAPABILITY_UPDATED" });
    }

    profiles.push({
      capabilityId,
      name: label.name,
      description: label.description,
      evidenceCount: bucket.evidenceCount,
      missionsCompleted: bucket.missionsCompleted,
      portfolioLinked,
      currentLevel: newLevel,
      updatedAt: now,
    });
  }

  return profiles;
}
