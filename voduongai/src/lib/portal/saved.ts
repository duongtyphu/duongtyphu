"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export type SavedKind = "prompt" | "tool" | "resource" | "ebook" | "checklist" | "lesson" | "affiliate";

export type SavedItem = {
  id: string;
  kind: SavedKind;
  title: string;
  href: string;
  meta?: string;
};

export function useSavedItems() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setReady(true);
        return;
      }
      const { data: rows } = await supabase
        .from("saved_items")
        .select("item_id, kind, title, href, meta")
        .eq("member_id", uid)
        .order("created_at", { ascending: false });
      setItems(
        (rows ?? []).map((r) => ({ id: r.item_id, kind: r.kind, title: r.title, href: r.href, meta: r.meta ?? undefined }))
      );
      setReady(true);
    });
  }, []);

  const isSaved = useCallback((id: string) => items.some((it) => it.id === id), [items]);

  const toggle = useCallback(
    async (item: SavedItem) => {
      if (!userId) return;
      const supabase = getSupabaseBrowser();
      const exists = items.some((it) => it.id === item.id);
      if (exists) {
        setItems(items.filter((it) => it.id !== item.id));
        await supabase.from("saved_items").delete().eq("member_id", userId).eq("item_id", item.id);
      } else {
        setItems([item, ...items]);
        await supabase.from("saved_items").insert({
          member_id: userId,
          item_id: item.id,
          kind: item.kind,
          title: item.title,
          href: item.href,
          meta: item.meta ?? null,
        });
      }
    },
    [items, userId]
  );

  return { items, ready, isSaved, toggle };
}
