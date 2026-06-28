"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { isMissingTableError, warnMissingTableOnce } from "@/lib/portal/storyTableStatus";

export type MemoryCapsuleKind =
  | "milestone"
  | "lesson"
  | "decision"
  | "breakthrough"
  | "achievement"
  // Sprint 13.4 — Story Becomes Memory: capsule được lưu từ một Living Story.
  | "living_story"
  | "companion_story"
  | "wisdom_story"
  | "garden_story"
  // Sprint 16.0 — The First Footprint Ceremony: món quà lưu niệm của lần ghé đầu tiên.
  | "first_footprint"
  // Sprint 18.1 — Life Moments Engine: capsule lưu tự nguyện từ một Life Moment.
  | "birthday"
  | "annual_mirror"
  | "first_portal_day"
  | "return_after_silence";

export type MemoryCapsule = {
  id: string;
  kind: MemoryCapsuleKind;
  title: string;
  description?: string;
  occurredAt: string;
  /** Sprint 13.4 — null cho capsule người dùng tự thêm; "companion_living_story" khi lưu từ Companion. */
  source?: string;
  storyId?: string;
  meaningTags?: string[];
};

export function useMemoryCapsules() {
  const [capsules, setCapsules] = useState<MemoryCapsule[]>([]);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [tableReady, setTableReady] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setReady(true);
        return;
      }
      const { data: rows, error } = await supabase
        .from("memory_capsules")
        .select("id, kind, title, description, occurred_at, source, story_id, meaning_tags")
        .eq("member_id", uid)
        .order("occurred_at", { ascending: false });
      if (error) {
        if (isMissingTableError(error)) {
          setTableReady(false);
          warnMissingTableOnce("memory_capsules");
        }
        setReady(true);
        return;
      }
      setCapsules(
        (rows ?? []).map((r) => ({
          id: r.id,
          kind: r.kind,
          title: r.title,
          description: r.description ?? undefined,
          occurredAt: r.occurred_at,
          source: r.source ?? undefined,
          storyId: r.story_id ?? undefined,
          meaningTags: r.meaning_tags ?? undefined,
        }))
      );
      setReady(true);
    });
  }, []);

  const addCapsule = useCallback(
    async (capsule: { kind: MemoryCapsuleKind; title: string; description?: string }) => {
      if (!userId || !capsule.title.trim()) return;
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase
        .from("memory_capsules")
        .insert({ member_id: userId, kind: capsule.kind, title: capsule.title.trim(), description: capsule.description ?? null })
        .select("id, kind, title, description, occurred_at, source, story_id, meaning_tags")
        .single();
      if (error) {
        if (isMissingTableError(error)) {
          setTableReady(false);
          warnMissingTableOnce("memory_capsules");
        }
        return;
      }
      if (data) {
        setCapsules((prev) => [
          {
            id: data.id,
            kind: data.kind,
            title: data.title,
            description: data.description ?? undefined,
            occurredAt: data.occurred_at,
            source: data.source ?? undefined,
            storyId: data.story_id ?? undefined,
            meaningTags: data.meaning_tags ?? undefined,
          },
          ...prev,
        ]);
      }
    },
    [userId]
  );

  const removeCapsule = useCallback(async (id: string) => {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
    const ok = await deleteMemoryCapsule(id);
    return ok;
  }, []);

  return { capsules, ready, addCapsule, removeCapsule, signedIn: !!userId, tableReady };
}

/**
 * Sprint 13.5 — Memory Ownership: xoá một Memory Capsule (bao gồm capsule
 * được lưu từ một Living Story, không có logic riêng cho loại đó). RLS
 * (`member_id = auth.uid()`) đã chặn xoá capsule của người khác; lọc thêm
 * `member_id` ở đây chỉ để tường minh, không phải lớp bảo vệ duy nhất.
 */
export async function deleteMemoryCapsule(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowser();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return false;
  const { error } = await supabase.from("memory_capsules").delete().eq("id", id).eq("member_id", uid);
  return !error;
}
