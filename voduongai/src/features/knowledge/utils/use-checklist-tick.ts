"use client";

/**
 * Feature 09 — Action Checklist: checklist có thể tick, không chỉ để đọc.
 * Lưu client-side theo seedId + index item, tách biệt hoàn toàn với
 * completedStepIds của Learning Engine (use-seed-progress.ts) — không đụng.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vdai_knowledge_action_checklist";

type ChecklistMap = Record<string, number[]>;

function readAll(): ChecklistMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChecklistMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ChecklistMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable
  }
}

export function useChecklistTick(seedId: string) {
  const [tickedIndexes, setTickedIndexes] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTickedIndexes(readAll()[seedId] ?? []);
  }, [seedId]);

  const toggle = useCallback(
    (index: number) => {
      setTickedIndexes((prev) => {
        const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
        const all = readAll();
        all[seedId] = next;
        writeAll(all);
        return next;
      });
    },
    [seedId]
  );

  return { tickedIndexes, toggle };
}
