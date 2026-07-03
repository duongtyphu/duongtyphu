"use client";

/**
 * Academy — Growth Checkpoint (Feature 05). Câu trả lời tự nhận thức của
 * người học, không chấm điểm, không đúng/sai — kế thừa đúng pattern
 * use-seed-reflection.ts của CKOS.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vdai_academy_growth_checkpoint";

export type GrowthCheckpointAnswers = {
  noticedToday: string;
  improvedSince: string;
  updatedAt: string;
};

function readAll(): Record<string, GrowthCheckpointAnswers> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, GrowthCheckpointAnswers>) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, GrowthCheckpointAnswers>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable
  }
}

export function useGrowthCheckpoint(journeySlug: string) {
  const [answers, setAnswers] = useState<GrowthCheckpointAnswers>({
    noticedToday: "",
    improvedSince: "",
    updatedAt: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(readAll()[journeySlug] ?? { noticedToday: "", improvedSince: "", updatedAt: "" });
  }, [journeySlug]);

  const save = useCallback(
    (next: { noticedToday: string; improvedSince: string }) => {
      const entry = { ...next, updatedAt: new Date().toISOString() };
      setAnswers(entry);
      const all = readAll();
      all[journeySlug] = entry;
      writeAll(all);
    },
    [journeySlug]
  );

  return { answers, save };
}
