"use client";

/**
 * Life Moment Bubble (Sprint 18.1 — Nhiệm vụ 05). Xem
 * `docs/LIFE_MOMENTS_ENGINE.md`.
 *
 * Khác với `ReturnAfterSilenceCeremony`/`FirstFootprintCeremony` (toàn
 * màn hình, nhiều bước), Life Moment KHÔNG được chiếm toàn bộ Portal
 * trừ khi thật cần thiết — đây chỉ là một thẻ nhỏ, có thể đóng, tối đa
 * một lần mỗi ngày, có cooldown theo từng Life Moment cụ thể (không lặp
 * lại cùng một khoảnh khắc).
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CompanionAvatar } from "@/components/portal/companion/CompanionAvatar";
import type { LifeMoment, LifeMomentType } from "@/lib/portal/life-moments/life-moments";
import { getLifeMomentLines } from "@/lib/portal/life-moments/life-moment-lines";
import { useMemoryCapsules, type MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

/** Chỉ những Life Moment có `MemoryCapsuleKind` riêng mới cho lưu lại (Sprint 18.1 — Nhiệm vụ 07). */
const SAVABLE_LIFE_MOMENT_KINDS: Partial<Record<LifeMomentType, MemoryCapsuleKind>> = {
  birthday: "birthday",
  annual_mirror: "annual_mirror",
  first_portal_day: "first_portal_day",
  return_after_silence: "return_after_silence",
};

const SEEN_KEY_PREFIX = "vdai_portal_life_moment_seen_";
const LAST_SHOWN_DAY_KEY = "vdai_portal_life_moment_last_shown_day";
const SHOW_DELAY_MS = 1200;

function momentKey(moment: LifeMoment): string {
  return `${moment.type}_${moment.trigger.occurredAt}`;
}

function hasSeen(key: string): boolean {
  try {
    return localStorage.getItem(`${SEEN_KEY_PREFIX}${key}`) === "1";
  } catch {
    return true;
  }
}

function markSeen(key: string) {
  try {
    localStorage.setItem(`${SEEN_KEY_PREFIX}${key}`, "1");
  } catch {
    // localStorage không khả dụng — chấp nhận hiển thị lại lần sau, không chặn nghi thức.
  }
}

function shownAlreadyToday(): boolean {
  try {
    const today = new Date().toISOString().slice(0, 10);
    return localStorage.getItem(LAST_SHOWN_DAY_KEY) === today;
  } catch {
    return false;
  }
}

function markShownToday() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(LAST_SHOWN_DAY_KEY, today);
  } catch {
    // bỏ qua nếu localStorage không khả dụng
  }
}

export function LifeMomentBubble({ moment }: { moment: LifeMoment | null }) {
  const [visible, setVisible] = useState(false);
  const [line, setLine] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { addCapsule, signedIn } = useMemoryCapsules();

  useEffect(() => {
    if (!moment) return;
    const key = momentKey(moment);
    if (hasSeen(key) || shownAlreadyToday()) return;

    const lines = getLifeMomentLines(moment.type);
    const chosen = lines[Math.floor(Math.random() * lines.length)];

    const showTimer = setTimeout(() => {
      setLine(chosen);
      setVisible(true);
      markSeen(key);
      markShownToday();
    }, SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, [moment]);

  if (!visible || !line || !moment) return null;

  const capsuleKind = SAVABLE_LIFE_MOMENT_KINDS[moment.type];

  async function handleSave() {
    if (!capsuleKind || !line) return;
    await addCapsule({ kind: capsuleKind, title: line });
    setSaved(true);
  }

  return (
    <div
      role="status"
      className="fixed bottom-6 left-6 z-[70] w-[min(86vw,300px)] rounded-2xl border border-white/15 bg-[#0B1F4D]/95 px-4 py-3.5 text-left shadow-xl backdrop-blur"
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Đóng"
        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-white/40 transition hover:text-white/80 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="flex items-start gap-3 pr-4">
        <CompanionAvatar state="idle" size={32} />
        <div>
          <p className="text-sm leading-relaxed text-white/90">{line}</p>
          {capsuleKind && signedIn && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saved}
              className="mt-2 text-xs font-semibold text-brand-cyan transition hover:text-brand-cyan/80 disabled:text-white/40"
            >
              {saved ? "Đã giữ lại" : "Giữ lại khoảnh khắc này"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
