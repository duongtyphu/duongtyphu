"use client";

/**
 * CKOS — Bookmark
 * Lưu Seed / Đọc sau / Yêu thích — client-side (localStorage), theo cùng
 * pattern với use-seed-progress.ts. Sẵn sàng migrate sang Supabase sau.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vdai_knowledge_seed_bookmarks";

export type BookmarkKind = "saved" | "read_later" | "favorite";

type BookmarkMap = Record<string, BookmarkKind[]>;

function readAll(): BookmarkMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookmarkMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: BookmarkMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable
  }
}

export function getSeedBookmarks(seedId: string): BookmarkKind[] {
  return readAll()[seedId] ?? [];
}

export function useSeedBookmark(seedId: string) {
  const [kinds, setKinds] = useState<BookmarkKind[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKinds(readAll()[seedId] ?? []);
  }, [seedId]);

  const toggle = useCallback(
    (kind: BookmarkKind) => {
      setKinds((prev) => {
        const next = prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind];
        const all = readAll();
        all[seedId] = next;
        writeAll(all);
        return next;
      });
    },
    [seedId]
  );

  return { kinds, toggle };
}
