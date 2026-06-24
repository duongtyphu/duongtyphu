"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vdai_portal_saved";

export type SavedKind = "prompt" | "tool" | "resource" | "ebook" | "checklist" | "lesson" | "affiliate";

export type SavedItem = {
  id: string;
  kind: SavedKind;
  title: string;
  href: string;
  meta?: string;
};

function read(): SavedItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSavedItems() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
  }, []);

  const persist = useCallback((next: SavedItem[]) => {
    setItems(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const isSaved = useCallback((id: string) => items.some((it) => it.id === id), [items]);

  const toggle = useCallback(
    (item: SavedItem) => {
      const exists = items.some((it) => it.id === item.id);
      persist(exists ? items.filter((it) => it.id !== item.id) : [item, ...items]);
    },
    [items, persist]
  );

  return { items, ready, isSaved, toggle };
}
