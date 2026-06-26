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
  }, [endpoint, table]);

  useEffect(() => {
    // Fetch-on-mount from Supabase via the generic collections API; no pure
    // render-time equivalent exists for this remote data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const set = useCallback(
    async (next: T[]) => {
      setItems(next);
      await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      load();
    },
    [endpoint, load]
  );

  return { items, ready, add, update, remove, reorder: set, set };
}

function useLocalCollection<T extends { id: string }>(key: string, seed: T[]) {
  const storageKey = `vdai_admin_${key}`;
  const [items, setItems] = useState<T[]>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydration-safe: render starts with the seed (matches SSR), then this
    // mount effect syncs in the real value from localStorage, which has no
    // server-side equivalent and can't be read during render.
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
