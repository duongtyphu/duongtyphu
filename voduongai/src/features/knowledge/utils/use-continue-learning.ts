"use client";

/**
 * Feature 03 — Continue Learning
 * Ghi lại Seed người học đang học dở gần nhất, để hiển thị banner "Tiếp
 * tục hành trình" ngay đầu Thư viện tri thức thay vì bắt họ tìm lại.
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "vdai_knowledge_continue_learning";

type ContinueLearningEntry = {
  seedId: string;
  seedSlug: string;
  seedTitle: string;
  visitedAt: string;
};

function readEntry(): ContinueLearningEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ContinueLearningEntry) : null;
  } catch {
    return null;
  }
}

function writeEntry(entry: ContinueLearningEntry) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage unavailable
  }
}

/** Gọi trong KnowledgeWorkspace để ghi nhận "đang học dở" Seed này. */
export function recordSeedVisit(seedId: string, seedSlug: string, seedTitle: string) {
  writeEntry({ seedId, seedSlug, seedTitle, visitedAt: new Date().toISOString() });
}

/** Đọc lại Seed đang học dở gần nhất — dùng ở trang Thư viện tri thức. */
export function useContinueLearning() {
  const [entry, setEntry] = useState<ContinueLearningEntry | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntry(readEntry());
  }, []);

  return entry;
}
