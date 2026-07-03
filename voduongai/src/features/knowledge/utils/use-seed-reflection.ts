"use client";

/**
 * CKOS — Reflection
 * Kiến trúc lưu câu trả lời Reflection của người học theo từng Seed —
 * chuẩn bị dữ liệu cho "Nhật ký học tập" dùng sau này. Hiện tại chỉ lưu
 * client-side (localStorage); schema đủ để migrate thẳng sang bảng
 * `reflections` (member_id, seed_id, question, answer, created_at) khi có
 * backend, không cần đổi shape.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vdai_knowledge_seed_reflections";

export type SeedReflectionEntry = {
  seedId: string;
  question: string;
  answer: string;
  updatedAt: string;
};

type ReflectionMap = Record<string, SeedReflectionEntry>;

function entryKey(seedId: string, question: string) {
  return `${seedId}::${question}`;
}

function readAll(): ReflectionMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReflectionMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ReflectionMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable
  }
}

export function useSeedReflection(seedId: string, question: string) {
  const key = entryKey(seedId, question);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswer(readAll()[key]?.answer ?? "");
  }, [key]);

  const save = useCallback(
    (value: string) => {
      setAnswer(value);
      const all = readAll();
      all[key] = { seedId, question, answer: value, updatedAt: new Date().toISOString() };
      writeAll(all);
    },
    [key, seedId, question]
  );

  return { answer, save };
}
