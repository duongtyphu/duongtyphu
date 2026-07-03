"use client";

/**
 * Academy — lưu trạng thái "người học tự xác nhận đã sẵn sàng" cho 1
 * Journey sau khi hoàn thành Reflection/Growth. Đây KHÔNG phải điểm số —
 * chỉ là 1 xác nhận nhị phân do chính người học đặt ra (Growth Framework).
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vdai_academy_journey_ready";

function readAll(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable
  }
}

export function isJourneyMarkedReady(journeySlug: string): boolean {
  return readAll()[journeySlug] ?? false;
}

export function useJourneyReady(journeySlug: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(readAll()[journeySlug] ?? false);
  }, [journeySlug]);

  const markReady = useCallback(() => {
    const all = readAll();
    all[journeySlug] = true;
    writeAll(all);
    setReady(true);
  }, [journeySlug]);

  return { ready, markReady };
}
