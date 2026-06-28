/**
 * Growth Reflection Engine (Sprint 15.0 — The Mirror of Growth, Nhiệm vụ
 * 02). Nhận vào `GrowthSignal[]` (đã gộp Reflection/Story/Memory/Garden/
 * Knowledge/Journey/Companion qua `growth-signals.ts`) và tạo ra
 * "Reflection Moments" — những khoảnh khắc đối chiếu có ý nghĩa con
 * người (ví dụ: lúc mới bắt đầu so với hiện tại). Engine KHÔNG tạo
 * score, KHÔNG xếp hạng. Xem `docs/THE_MIRROR_OF_GROWTH.md`.
 */

import type { GrowthSignal } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";

export type ReflectionMoment = {
  id: string;
  /** Câu đối chiếu bằng ngôn ngữ con người — KHÔNG bao giờ kèm số/điểm. */
  line: string;
  /** Thời điểm "neo" của khoảnh khắc — thường là vế gần đây hơn của đối chiếu. */
  occurredAt: string;
};

const MONTH_MS = 1000 * 60 * 60 * 24 * 30;

function monthsBetween(earlier: string, later: string): number {
  return Math.floor((new Date(later).getTime() - new Date(earlier).getTime()) / MONTH_MS);
}

/**
 * Trả về các khoảnh khắc đối chiếu — sắp theo thời gian, không quá 4
 * khoảnh khắc trong một lần nhìn lại (tránh dội thông tin). Trả về
 * mảng rỗng nếu chưa đủ dữ liệu để đối chiếu — im lặng là hợp lệ.
 */
export function buildReflectionMoments(signals: GrowthSignal[]): ReflectionMoment[] {
  if (signals.length === 0) return [];

  const sorted = [...signals].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  const earliest = sorted[0];
  const latest = sorted[sorted.length - 1];
  const moments: ReflectionMoment[] = [];

  const reflectionSignals = sorted.filter((s) => s.type === "reflection-written");
  if (reflectionSignals.length >= 2) {
    moments.push({
      id: "reflection-contrast",
      line: "Reflection đầu tiên của bạn là một khởi đầu. Từ đó đến nay, bạn đã quay lại nhìn vào chính mình nhiều lần hơn.",
      occurredAt: reflectionSignals[reflectionSignals.length - 1].occurredAt,
    });
  }

  const milestones = detectGrowthMilestones(signals);

  const contribution = milestones.find((m) => m.id === "first-contribution");
  if (contribution) {
    moments.push({
      id: "contribution-contrast",
      line: "Có một giai đoạn bạn mới chỉ tìm hiểu. Rồi một ngày, bạn đã đủ tự tin để chia sẻ điều mình học cho người khác.",
      occurredAt: contribution.occurredAt,
    });
  }

  const gardenGrowth = milestones.find((m) => m.id === "garden-begins-to-grow");
  if (gardenGrowth) {
    moments.push({
      id: "garden-contrast",
      line: "Khu vườn của bạn từng tĩnh lặng. Rồi nó bắt đầu có dấu hiệu sống.",
      occurredAt: gardenGrowth.occurredAt,
    });
  }

  const comeback = milestones.find((m) => m.id === "first-comeback");
  if (comeback) {
    moments.push({
      id: "comeback-contrast",
      line: "Có một khoảng lặng trong hành trình của bạn. Và bạn đã chọn quay lại.",
      occurredAt: comeback.occurredAt,
    });
  }

  if (moments.length === 0) {
    const span = monthsBetween(earliest.occurredAt, latest.occurredAt);
    if (span >= 1) {
      moments.push({
        id: "time-span-contrast",
        line: "Nhìn lại, khoảng thời gian từ ngày đầu đến hôm nay dài hơn bạn nghĩ — và bạn vẫn đang ở đây.",
        occurredAt: latest.occurredAt,
      });
    }
  }

  return moments
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())
    .slice(0, 4);
}
