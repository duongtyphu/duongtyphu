"use client";

import { useEffect } from "react";
import type { GardenState } from "@/lib/portal/living-garden/garden-model";
import { gardenStateToSignal } from "@/lib/portal/intelligence/signals/garden-signal";
import { writeStoredGardenStage } from "@/lib/portal/intelligence/portal-signals";

/**
 * Sprint 12.1 — Nhiệm vụ 04. Cầu nối tín hiệu: Garden được tính ở
 * server component (Gem Home, My Story), Companion sống ở client
 * component toàn cục. Component này không hiển thị gì — chỉ ghi lại
 * GardenStage hiện có thành một tín hiệu Companion có thể đọc.
 */
export function GardenSignalSync({ garden }: { garden: GardenState }) {
  useEffect(() => {
    const signal = gardenStateToSignal(garden);
    if (signal.gardenStage) {
      writeStoredGardenStage(signal.gardenStage);
    }
  }, [garden]);

  return null;
}
