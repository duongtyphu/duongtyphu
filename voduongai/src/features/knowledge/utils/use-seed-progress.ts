"use client";

/**
 * CKOS — Sprint 02: The Knowledge Journey™
 * Theo dõi tiến độ Seed phía client (localStorage) — chưa có backend cho
 * Journey, thiết kế để sau này migrate sang Supabase chỉ cần đổi phần
 * đọc/ghi bên trong hook này.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vdai_knowledge_seed_progress";

type ProgressMap = Record<string, string[]>;

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable
  }
}

export function useSeedProgress(seedId: string) {
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedStepIds(readAll()[seedId] ?? []);
  }, [seedId]);

  const toggleStep = useCallback(
    (stepId: string) => {
      setCompletedStepIds((prev) => {
        const next = prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId];
        const all = readAll();
        all[seedId] = next;
        writeAll(all);
        return next;
      });
    },
    [seedId]
  );

  return { completedStepIds, toggleStep };
}
