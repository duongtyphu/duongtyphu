"use client";

/**
 * Companion Greeting Bubble (Sprint 8.5 — Nhiệm vụ 05/07; nâng cấp
 * Sprint 22.1 — "The First Meeting"). Không lặp lại ở mỗi lần đổi route
 * trong cùng một session, tự ẩn sau một khoảng thời gian, không che nội
 * dung chính.
 *
 * Sprint 22.1: lần gặp đầu tiên không còn là một "welcome message" —
 * `first-meeting.ts` xác định đúng giai đoạn quan hệ (first_meeting /
 * welcome_back / return_after_silence / long_time_companion / old_friend)
 * và khoảng lặng phù hợp trước khi Companion chủ động chào, để cảm giác
 * như một cuộc gặp gỡ, không phải một chatbot bật popup ngay khi trang
 * vừa tải xong.
 */

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { getRouteGreeting } from "@/lib/portal/companion/companion-identity";
import {
  withPersonalAddress,
  type CompanionAddressProfile,
} from "@/lib/portal/companion/companion-address";
import {
  getRelationshipStage,
  getSilenceTimingForStage,
  type RelationshipStage,
} from "@/lib/portal/companion/first-meeting";

const SESSION_SHOWN_KEY = "companion-greeting-shown-session";
const LAST_VISIT_KEY = "companion-last-visit";
const VISIT_COUNT_KEY = "companion-visit-count";

/**
 * Sprint 22.1 — "The First Meeting". Mỗi giai đoạn quan hệ một lời giới
 * thiệu/lời chào riêng, không lặp lại nhau. CHỈ "first_meeting" là một
 * lời TỰ GIỚI THIỆU đầy đủ (mình là ai, mình ở đây vì điều gì, mình sẽ
 * đồng hành thế nào) — không nói "Tôi có thể...", không liệt kê Feature,
 * không nhắc AI/Model. Các giai đoạn sau đã quen nhau, không cần giới
 * thiệu lại từ đầu.
 */
const RELATIONSHIP_STAGE_LINES: Record<RelationshipStage, string> = {
  first_meeting:
    "Chào bạn, rất vui được gặp bạn.\n\nMình là Companion — mình sẽ đồng hành cùng bạn trong suốt hành trình ở VO DUONG AI, không phải để làm hộ hay trả lời thay bạn.\n\nNếu bạn cần học, mình học cùng bạn. Nếu bạn cần suy nghĩ, mình suy nghĩ cùng bạn. Và nếu hôm nay bạn chỉ cần một người để trò chuyện, mình vẫn luôn ở đây.\n\nMong đây sẽ là khởi đầu của một hành trình đẹp.",
  welcome_back: "Mình vẫn ở đây, cùng bạn tiếp tục.",
  return_after_silence: "Mình rất vui vì bạn đã quay lại.",
  long_time_companion: "Đã một thời gian dài mình được đồng hành cùng bạn.",
  old_friend: "Gặp bạn lúc nào cũng thấy thân quen.",
};

export function CompanionGreetingBubble({
  pathname,
  brainGreeting,
  addressProfile = null,
}: {
  pathname: string;
  brainGreeting?: string | null;
  /** Sprint Personal Addressing — chỉ dùng để gọi tên đúng lúc, không bao giờ suy luận. */
  addressProfile?: CompanionAddressProfile | null;
}) {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [isFirstMeeting, setIsFirstMeeting] = useState(false);
  const autoHideMsRef = useRef(5000);

  useEffect(() => {
    let shownAlready = false;
    try {
      shownAlready = window.sessionStorage.getItem(SESSION_SHOWN_KEY) === "1";
    } catch {
      // bỏ qua nếu sessionStorage không khả dụng
    }
    if (shownAlready) return;

    let hasVisitedBefore = false;
    let gapSinceLastVisitMs: number | null = null;
    let visitCount = 0;
    try {
      const lastVisit = window.localStorage.getItem(LAST_VISIT_KEY);
      if (lastVisit) {
        hasVisitedBefore = true;
        gapSinceLastVisitMs = Date.now() - Number(lastVisit);
      }
      window.localStorage.setItem(LAST_VISIT_KEY, String(Date.now()));

      visitCount = Number(window.localStorage.getItem(VISIT_COUNT_KEY) ?? "0") + 1;
      window.localStorage.setItem(VISIT_COUNT_KEY, String(visitCount));
    } catch {
      // bỏ qua nếu localStorage không khả dụng
    }

    const stage = getRelationshipStage({ hasVisitedBefore, visitCount, gapSinceLastVisitMs });
    const { showDelayMs, autoHideMs } = getSilenceTimingForStage(stage);

    // Sprint 22.1 — chỉ "first_meeting" là một cuộc gặp gỡ cần lời tự
    // giới thiệu cố định, không nhường cho brainGreeting/route greeting
    // (những lời đó giả định người dùng đã biết Companion là ai). Các
    // giai đoạn khác đã quen nhau — vẫn ưu tiên ngữ cảnh route/insight
    // thật khi có, lời theo giai đoạn quan hệ chỉ là phương án dự phòng.
    const rawText =
      stage === "first_meeting"
        ? RELATIONSHIP_STAGE_LINES.first_meeting
        : brainGreeting ?? getRouteGreeting(pathname) ?? RELATIONSHIP_STAGE_LINES[stage];
    const text = withPersonalAddress(rawText, addressProfile, "greeting");

    const showTimer = setTimeout(() => {
      setGreeting(text);
      setIsFirstMeeting(stage === "first_meeting");
      setVisible(true);
      try {
        window.sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
      } catch {
        // bỏ qua nếu sessionStorage không khả dụng
      }
    }, showDelayMs);

    autoHideMsRef.current = autoHideMs;
    return () => clearTimeout(showTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), autoHideMsRef.current);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  if (!greeting || !visible) return null;

  return (
    <div
      role="status"
      className={`companion-greeting-bubble pointer-events-auto absolute bottom-full right-0 mb-3 rounded-2xl border border-white/15 bg-[#0B1F4D]/95 px-4 py-3 text-left text-sm leading-relaxed text-white/90 shadow-xl backdrop-blur ${
        isFirstMeeting ? "w-[min(90vw,340px)]" : "w-[min(78vw,260px)]"
      }`}
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Đóng lời chào"
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white/40 transition hover:text-white/80 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>
      <p className="whitespace-pre-line pr-4">{greeting}</p>
    </div>
  );
}
