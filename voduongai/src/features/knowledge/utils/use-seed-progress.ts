"use client";

/**
 * CKOS — Sprint 02: The Knowledge Journey™
 * Schema v2, Bước 9 — theo dõi tiến độ Seed giờ đọc/ghi bảng Supabase
 * `user_ckos_progress` (thay cho localStorage `vdai_knowledge_seed_progress`
 * dùng từ trước). Toàn bộ 13 file tiêu thụ 2 hàm export dưới đây (hook +
 * hàm đọc trực tiếp) đều đọc đồng bộ, không đổi chữ ký — cache trong bộ
 * nhớ tiến trình (module-level) đóng vai trò lớp đồng bộ hoá phía trên
 * 1 lần fetch Supabase bất đồng bộ, giữ nguyên hợp đồng "đọc tức thì" mà
 * knowledge-seed.service.ts/knowledge-collection.service.ts/
 * recommendation-rules.service.ts/journey.service.ts đều giả định (nhận
 * `getSeedCompletedStepIds` làm tham số tiêm vào, gọi trong `.filter()`/
 * `.find()`/`.map()` đồng bộ — không đổi được sang Promise).
 *
 * Migrate 1 lần khi đăng nhập: lần đầu cache tải xong (mỗi tab/phiên),
 * nếu localStorage cũ còn dữ liệu cho seed nào CHƯA có dòng trên Supabase,
 * đẩy dòng đó lên (không ghi đè tiến độ server đã có — ưu tiên dữ liệu đã
 * đồng bộ từ thiết bị khác), rồi xoá hẳn key localStorage — từ đó ngừng
 * đọc localStorage, Supabase là nguồn thật duy nhất.
 */

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const LEGACY_STORAGE_KEY = "vdai_knowledge_seed_progress";

type ProgressMap = Record<string, string[]>;

let cache: ProgressMap = {};
let cacheReady = false;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function readLegacyLocalStorage(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function clearLegacyLocalStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

function ensureLoaded(): Promise<void> {
  if (cacheReady) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const supabase = getSupabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      cacheReady = true;
      notify();
      return;
    }

    const { data: rows } = await supabase
      .from("user_ckos_progress")
      .select("seed_id, completed_step_ids")
      .eq("user_id", userId);

    const serverMap: ProgressMap = {};
    (rows ?? []).forEach((row) => {
      serverMap[row.seed_id] = row.completed_step_ids ?? [];
    });

    const legacy = readLegacyLocalStorage();
    const toMigrate = Object.entries(legacy).filter(
      ([seedId, stepIds]) => !(seedId in serverMap) && stepIds.length > 0
    );
    if (toMigrate.length > 0) {
      const { error } = await supabase.from("user_ckos_progress").insert(
        toMigrate.map(([seedId, stepIds]) => ({
          user_id: userId,
          seed_id: seedId,
          completed_step_ids: stepIds,
        }))
      );
      if (!error) {
        toMigrate.forEach(([seedId, stepIds]) => {
          serverMap[seedId] = stepIds;
        });
      }
      // Lỗi (vd. dòng vừa được tạo từ thiết bị khác giữa lúc đọc và lúc
      // insert) không chặn migrate — coi như seed đó đã có trên server,
      // bỏ qua, không thử lại (tránh vòng lặp insert lỗi liên tục).
    }

    // Dừng đọc localStorage từ đây — kể cả khi migrate không có gì để đẩy
    // hoặc `toMigrate` rỗng, coi như đã hoàn tất chuyển đổi cho phiên này.
    clearLegacyLocalStorage();

    cache = serverMap;
    cacheReady = true;
    notify();
  })();

  return loadPromise;
}

/** Đọc trực tiếp (không phải hook) — dùng cho tính progress tổng hợp Collection/Journey.
 * Trả về [] nếu cache chưa tải xong; tự kích hoạt tải nền, các lần gọi lại
 * (component subscribe qua useSeedProgress/useCkosProgressReady) sẽ thấy
 * dữ liệu thật sau khi tải xong. */
export function getSeedCompletedStepIds(seedId: string): string[] {
  if (!cacheReady) void ensureLoaded();
  return cache[seedId] ?? [];
}

/** Subscribe-only — dùng cho component chỉ gọi getSeedCompletedStepIds()
 * trực tiếp (không dùng hook useSeedProgress) nhưng vẫn cần re-render khi
 * cache tải xong từ Supabase (vd. CollectionCard, JourneyCard). */
export function useCkosProgressReady(): boolean {
  const [ready, setReady] = useState(cacheReady);

  useEffect(() => {
    const listener = () => setReady(cacheReady);
    listeners.add(listener);
    void ensureLoaded();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return ready;
}

export function useSeedProgress(seedId: string) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1);
    listeners.add(listener);
    void ensureLoaded();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const completedStepIds = cache[seedId] ?? [];

  const toggleStep = useCallback(
    (stepId: string) => {
      const current = cache[seedId] ?? [];
      const next = current.includes(stepId) ? current.filter((id) => id !== stepId) : [...current, stepId];
      cache = { ...cache, [seedId]: next };
      notify();

      void (async () => {
        const supabase = getSupabaseBrowser();
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) return;
        await supabase
          .from("user_ckos_progress")
          .upsert(
            { user_id: userId, seed_id: seedId, completed_step_ids: next, updated_at: new Date().toISOString() },
            { onConflict: "user_id,seed_id" }
          );
      })();
    },
    [seedId]
  );

  return { completedStepIds, toggleStep };
}
