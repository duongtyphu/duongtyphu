"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export type MemoryCapsuleKind = "milestone" | "lesson" | "decision" | "breakthrough" | "achievement";

export type MemoryCapsule = {
  id: string;
  kind: MemoryCapsuleKind;
  title: string;
  description?: string;
  occurredAt: string;
};

export function useMemoryCapsules() {
  const [capsules, setCapsules] = useState<MemoryCapsule[]>([]);
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
        .from("memory_capsules")
        .select("id, kind, title, description, occurred_at")
        .eq("member_id", uid)
        .order("occurred_at", { ascending: false });
      setCapsules(
        (rows ?? []).map((r) => ({
          id: r.id,
          kind: r.kind,
          title: r.title,
          description: r.description ?? undefined,
          occurredAt: r.occurred_at,
        }))
      );
      setReady(true);
    });
  }, []);

  const addCapsule = useCallback(
    async (capsule: { kind: MemoryCapsuleKind; title: string; description?: string }) => {
      if (!userId || !capsule.title.trim()) return;
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("memory_capsules")
        .insert({ member_id: userId, kind: capsule.kind, title: capsule.title.trim(), description: capsule.description ?? null })
        .select("id, kind, title, description, occurred_at")
        .single();
      if (data) {
        setCapsules((prev) => [
          { id: data.id, kind: data.kind, title: data.title, description: data.description ?? undefined, occurredAt: data.occurred_at },
          ...prev,
        ]);
      }
    },
    [userId]
  );

  return { capsules, ready, addCapsule, signedIn: !!userId };
}
