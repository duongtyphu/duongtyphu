"use client";

import { useCallback, useEffect, useState } from "react";
import { tableForCollection } from "@/lib/admin/supabaseCollections";

/**
 * Generic collection hook used by every admin module (prompts, tools,
 * resources, affiliate, blog, roadmap, missions, leads, users, settings...).
 *
 * Collections listed in `supabaseCollections.ts` are backed by real Supabase
 * tables via the generic `/api/admin/collections/[table]` route. Everything
 * else still falls back to localStorage — this is the same hook either way,
 * so no consumer (CrudPage, portal sections, reports...) needs to change.
 */
export function useCollection<T extends { id: string }>(key: string, seed: T[]) {
  const table = tableForCollection(key);
  const localStore = useLocalCollection<T>(key, seed);
  const supabaseStore = useSupabaseCollection<T>(key);
  return table ? supabaseStore : localStore;
}

function useSupabaseCollection<T extends { id: string }>(key: string) {
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);
  const table = tableForCollection(key);
  const endpoint = `/api/admin/collections/${key}`;

  const load = useCallback(async () => {
    if (!table) return;
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, table]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (item: T) => {
      setItems((prev) => [item, ...prev]);
      await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      load();
    },
    [endpoint, load]
  );

  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
      await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      load();
    },
    [endpoint, load]
  );

  const remove = useCallback(
    async (id: string) => {
      setItems((prev) => prev.filter((it) => it.id !== id));
      await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      load();
    },
    [endpoint, load]
  );

  const reorder = useCallback((next: T[]) => setItems(next), []);

  return { items, ready, add, update, remove, reorder, set: reorder };
}

function useLocalCollection<T extends { id: string }>(key: string, seed: T[]) {
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
