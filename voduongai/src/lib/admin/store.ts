"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Generic localStorage-backed collection. Every admin module (prompts, tools,
 * resources, affiliate, blog, roadmap, missions, leads, users, settings...)
 * is just `useCollection<T>("vdai_admin_<entity>", seedData)`.
 *
 * This is intentionally the entire persistence layer for now. To move to
 * Supabase/Postgres later, replace the body of this hook with fetch calls —
 * every CrudPage/consumer only depends on { items, add, update, remove, set }.
 */
export function useCollection<T extends { id: string }>(key: string, seed: T[]) {
  const storageKey = `vdai_admin_${key}`;
  const [items, setItems] = useState<T[]>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        setItems(seed);
      }
    } else {
      setItems(seed);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const persist = useCallback(
    (next: T[]) => {
      setItems(next);
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    },
    [storageKey]
  );

  const add = useCallback(
    (item: T) => persist([item, ...items]),
    [items, persist]
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) =>
      persist(items.map((it) => (it.id === id ? { ...it, ...patch } : it))),
    [items, persist]
  );

  const remove = useCallback(
    (id: string) => persist(items.filter((it) => it.id !== id)),
    [items, persist]
  );

  const reorder = useCallback((next: T[]) => persist(next), [persist]);

  return { items, ready, add, update, remove, reorder, set: persist };
}

export function genId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
