"use client";

/**
 * Origin Line Whisper (Sprint 18.10 — Origin Line Ritual Wiring). Bọc
 * Frequency Guard (NHIỆM VỤ 6) cho một câu Origin Line đã được gate ở
 * server qua `getOriginLineFromCoreMemory()` (Sprint 18.9) — component này
 * KHÔNG tự quyết định ĐƯỢC nói gì, chỉ quyết định CÓ NÊN nói lại lần này
 * hay không, dựa trên `shouldShow` của `origin-line-context.ts`.
 *
 * Lý do cần một client wrapper riêng: trang gọi nó (`/portal/origin`) là
 * server component — localStorage/sessionStorage chỉ đọc được ở client,
 * giống mọi ceremony khác trong codebase (`ReturnAfterSilenceCeremony`,
 * `FirstFootprintCeremony`) đều dùng đúng pattern hydration-safe này.
 */

import { useEffect, useState } from "react";
import {
  getOriginLineContextDefinition,
  type OriginLineRitualContext,
} from "@/lib/portal/companion/origin-line-context";

const DAY_KEY_PREFIX = "vdai_origin_line_day_";
const SESSION_KEY_PREFIX = "vdai_origin_line_session_";
const EVER_KEY_PREFIX = "vdai_origin_line_ever_";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function shownToday(context: OriginLineRitualContext): boolean {
  try {
    return localStorage.getItem(`${DAY_KEY_PREFIX}${context}`) === todayKey();
  } catch {
    return true;
  }
}

function shownThisSession(context: OriginLineRitualContext): boolean {
  try {
    return sessionStorage.getItem(`${SESSION_KEY_PREFIX}${context}`) === "1";
  } catch {
    return true;
  }
}

function shownEver(context: OriginLineRitualContext): boolean {
  try {
    return localStorage.getItem(`${EVER_KEY_PREFIX}${context}`) === "1";
  } catch {
    return true;
  }
}

function markShown(context: OriginLineRitualContext) {
  try {
    localStorage.setItem(`${DAY_KEY_PREFIX}${context}`, todayKey());
    localStorage.setItem(`${EVER_KEY_PREFIX}${context}`, "1");
    sessionStorage.setItem(`${SESSION_KEY_PREFIX}${context}`, "1");
  } catch {
    // localStorage/sessionStorage không khả dụng — chấp nhận hiển thị lại lần sau, không chặn UI.
  }
}

export function OriginLineWhisper({
  context,
  line,
  isFounderPresent,
}: {
  context: OriginLineRitualContext;
  line: string | null;
  isFounderPresent?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!line) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }
    const definition = getOriginLineContextDefinition(context);
    const eligible = definition.shouldShow({
      shownThisSession: shownThisSession(context),
      shownToday: shownToday(context),
      shownEver: shownEver(context),
      isFounderPresent,
    });
    if (eligible) markShown(context);
    setVisible(eligible);
  }, [context, line, isFounderPresent]);

  if (!visible || !line) return null;

  return <p className="mt-8 text-base italic leading-relaxed text-gray-700">&ldquo;{line}&rdquo;</p>;
}
