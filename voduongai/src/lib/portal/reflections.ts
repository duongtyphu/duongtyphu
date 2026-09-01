"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { getWarmthLine } from "@/lib/portal/warmth-engine";
import { isMissingTableError, warnMissingTableOnce } from "@/lib/portal/storyTableStatus";

export type Reflection = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

function todaysQuestion() {
  // Same question all day for everyone — picked once per day, not per render,
  // so the prompt feels intentional instead of random noise.
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return getWarmthLine("reflection", dayIndex);
}

export function useReflections() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [tableReady, setTableReady] = useState(true);
  const question = todaysQuestion();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        const uid = data.user?.id ?? null;
        setUserId(uid);
        if (!uid) {
          setReady(true);
          return;
        }
        const { data: rows, error } = await supabase
          .from("reflections")
          .select("id, question, answer, created_at")
          .eq("member_id", uid)
          .order("created_at", { ascending: false });
        if (error) {
          if (isMissingTableError(error)) {
            setTableReady(false);
            warnMissingTableOnce("reflections");
          }
          setReady(true);
          return;
        }
        setReflections(
          (rows ?? []).map((r) => ({ id: r.id, question: r.question, answer: r.answer, createdAt: r.created_at }))
        );
        setReady(true);
      })
      // `auth.getUser()` có thể throw (refresh token hết hạn/mạng chập chờn — cùng
      // nguyên nhân đã gặp ở `getCachedAuthUser()`, server-side). Không try/catch ở
      // đây sẽ để promise rejection không ai xử lý — `ready` mãi mãi `false`, panel
      // viết mãi không hiện ra, trông như "bị lỗi" dù không crash trang.
      .catch(() => setReady(true));
  }, []);

  const answeredToday = reflections.some(
    (r) => r.question === question && new Date(r.createdAt).toDateString() === new Date().toDateString()
  );

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!userId || !answer.trim()) return;
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase
        .from("reflections")
        .insert({ member_id: userId, question, answer: answer.trim() })
        .select("id, question, answer, created_at")
        .single();
      if (error) {
        if (isMissingTableError(error)) {
          setTableReady(false);
          warnMissingTableOnce("reflections");
        }
        return;
      }
      if (data) {
        const newItem: Reflection = { id: data.id, question: data.question, answer: data.answer, createdAt: data.created_at };
        setReflections((prev) => [newItem, ...prev]);
        // Trả về dòng vừa tạo — cho phép nơi gọi (vd `MyStoryBook`) cập nhật
        // NGAY danh sách hiển thị của chính nó, không phải chờ tải lại
        // trang để thấy state nội bộ của hook này.
        return newItem;
      }
    },
    [userId, question]
  );

  return { reflections, ready, question, answeredToday, submitAnswer, signedIn: !!userId, tableReady };
}
