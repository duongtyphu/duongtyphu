"use client";

/**
 * Companion Presence (Sprint 8.2 — Nhiệm vụ 03; nâng cấp Sprint 8.3,
 * Sprint 8.3.1: nền trong suốt thật + tăng size 20% + kéo-thả tự do).
 * Một sự hiện diện ấm áp, không phải nút chat nổi kiểu support widget.
 * Luôn ở đó, rất tinh tế, không tự popup, không badge thông báo. Bấm vào
 * để mở `CompanionSpace`.
 *
 * Sprint 8.3 bổ sung: asset thật (CompanionAvatar), kích thước lớn hơn và
 * responsive theo breakpoint, safe zone theo thiết bị, floating/anchored
 * motion, thu nhỏ khi scroll nhanh, tránh che bàn phím mobile, nút
 * minimize rõ ràng. Xem `docs/design/companion/Companion_Guidelines.md`.
 *
 * Sprint 8.3.1: người dùng có thể kéo Companion tới bất kỳ vị trí nào
 * trên màn hình (không còn cố định góc dưới phải) — vị trí được nhớ lại
 * giữa các lần xem (localStorage), luôn được giữ trong vùng nhìn thấy.
 *
 * NHIỆM VỤ KHẨN — thay icon nổi bằng Living Core™: biểu tượng bên trong
 * nút nổi đã đổi từ `CompanionAvatar` (viên ngọc 2 chữ V, Master Design
 * V1.0) sang `LivingCore` (SVG + CSS, xem
 * design-system/visual-dna/companion/LIVING-CORE-001.md — Design Lock
 * v1.2). Chỉ đổi icon bên trong — vị trí/kéo-thả/container/hành vi
 * click/mở CompanionSpace/z-index/route giữ nguyên 100%.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LivingCore, type LivingCoreSize } from "@/components/LivingCore";
import { displayName, states } from "@/lib/portal/companion/companion-identity";
import { toLivingCoreState } from "@/lib/portal/companion/living-core-state";
import { CompanionSpace } from "@/components/portal/companion/CompanionSpace";
import { CompanionNest } from "@/components/portal/companion/CompanionNest";
import { CompanionGreetingBubble } from "@/components/portal/companion/CompanionGreetingBubble";
import { CompanionThoughtBubble } from "@/components/portal/companion/CompanionThoughtBubble";
import { CompanionStoryMoment } from "@/components/portal/companion/CompanionStoryMoment";
import { LifeMomentBubble, isLifeMomentEligibleToShow } from "@/components/portal/companion/LifeMomentBubble";
import {
  ReturnAfterSilenceCeremony,
  isReturnAfterSilenceEligibleToShow,
} from "@/components/portal/ReturnAfterSilenceCeremony";
import type { LifeMoment } from "@/lib/portal/life-moments/life-moments";
import { choosePresenceMoment } from "@/lib/portal/companion/presence-coordinator";
import { getCompanionDecision } from "@/lib/portal/intelligence/portal-brain";
import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";
import {
  readStoredGardenStage,
  readStoredReflectionMeaning,
  subscribeToGardenStage,
  subscribeToReflectionMeaning,
} from "@/lib/portal/intelligence/portal-signals";
import type { GardenStage } from "@/lib/portal/living-garden/garden-model";
import {
  pickProactiveThought,
  markThoughtShown,
  pauseProactiveThoughtsForSession,
} from "@/lib/portal/companion/proactive-thought-engine";
import type { CompanionThought } from "@/lib/portal/companion/proactive-thoughts";
import { pickLivingStory, markStoryShown } from "@/lib/portal/companion/story-matching-engine";
import type { LivingStory } from "@/lib/portal/companion/living-stories";
import { resolveCompanionMood, type CompanionMoodKey } from "@/lib/portal/companion/companion-mood";
import { CompanionMicroReactionBubble } from "@/components/portal/companion/CompanionMicroReactionBubble";
import type { ThoughtContext } from "@/lib/portal/companion/daily-thought-source";
import { chooseCompanionMoment, recordMajorMomentShown } from "@/lib/portal/companion/thought-governance";
import type { CompanionAddressProfile } from "@/lib/portal/companion/companion-address";
import { CompanionContextualNudge } from "@/components/portal/companion/CompanionContextualNudge";
import { CompanionQuickPanel } from "@/components/portal/companion/CompanionQuickPanel";
import { getRouteContext, hasContextualNudge } from "@/lib/portal/companion/route-context";
import { hasNudgeBeenShown, isNudgeDisabled, markNudgeShown } from "@/lib/portal/companion/nudge-session";
import {
  subscribeToCompanionIntent,
  type CompanionIntent,
} from "@/lib/portal/companion/orchestrator-intent";
import { useCompanionWorkSession } from "@/companion/work-session/use-companion-work-session";

const MINIMIZED_STORAGE_KEY = "companion-presence-minimized";
const THOUGHT_CHECK_INTERVAL_MS = 5000;
const STORY_CHECK_INTERVAL_MS = 7000;
const MOOD_TICK_INTERVAL_MS = 3000;
/** NV03 — khoảng thời gian một click thứ hai vẫn được tính là double-click để mở Space. */
const SECOND_CLICK_OPEN_WINDOW_MS = 2500;
/** NV07 — sau một cú chạm, mood/visual coi như "vừa được chạm" trong khoảng này. */
const JUST_TOUCHED_WINDOW_MS = 4000;
/** NV04 — góc nghiêng tối đa theo hướng con trỏ/chạm (độ). */
const MAX_TILT_DEG = 4;

/**
 * Route dùng nhiều input/form (gõ nhiều) → anchored, đứng yên hẳn để
 * không gây phân tâm. Các route khác → floating, trôi nhẹ quanh vị trí
 * hiện tại (người dùng có thể kéo Companion tới bất kỳ đâu).
 */
const ANCHORED_ROUTE_PREFIXES = ["/portal/ai-assistant"];

const POSITION_STORAGE_KEY = "companion-presence-position";
const SAFE_MARGIN = 12;
const DRAG_THRESHOLD = 6;

function getAvatarBoxSize() {
  if (typeof window === "undefined") return 58;
  const width = window.innerWidth;
  if (width >= 1024) return 58;
  if (width >= 640) return 52;
  // Mobile — tăng kích thước Companion (trước đây 43px, hơi nhỏ để
  // nhận diện đúng Living Core™ trên màn hình nhỏ).
  return 56;
}

/** Living Core™ — size hợp lệ gần nhất với box nổi hiện tại theo breakpoint. */
function getLivingCoreSize(): LivingCoreSize {
  if (typeof window === "undefined") return 52;
  const width = window.innerWidth;
  if (width >= 1024) return 64;
  return 52;
}

function clampPosition(x: number, y: number, box: number) {
  if (typeof window === "undefined") return { x, y };
  const maxX = Math.max(window.innerWidth - box - SAFE_MARGIN, SAFE_MARGIN);
  const maxY = Math.max(window.innerHeight - box - SAFE_MARGIN, SAFE_MARGIN);
  return {
    x: Math.min(Math.max(x, SAFE_MARGIN), maxX),
    y: Math.min(Math.max(y, SAFE_MARGIN), maxY),
  };
}

function getInitialPosition(): { x: number; y: number } | null {
  if (typeof window === "undefined") return null;
  const box = getAvatarBoxSize();
  try {
    const saved = window.localStorage.getItem(POSITION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { x: number; y: number };
      if (typeof parsed.x === "number" && typeof parsed.y === "number") {
        return clampPosition(parsed.x, parsed.y, box);
      }
    }
  } catch {
    // bỏ qua nếu localStorage không khả dụng hoặc dữ liệu hỏng
  }
  return clampPosition(window.innerWidth - box - 16, window.innerHeight - box - 16, box);
}

export function CompanionPresence({
  dailyThoughtContext,
  lifeMoment = null,
  returnAfterSilenceMilestone = null,
  addressProfile = null,
}: {
  /** Sprint 18.5 — ngữ cảnh Daily Thought, dựng sẵn ở layout.tsx (server). */
  dailyThoughtContext?: ThoughtContext;
  /** Sprint 18.8 — Presence Coordinator: tín hiệu server, dựng sẵn ở layout.tsx. */
  lifeMoment?: LifeMoment | null;
  returnAfterSilenceMilestone?: string | null;
  /** Sprint Personal Addressing — hồ sơ tối thiểu để gọi đúng tên người dùng, không bao giờ suy luận. */
  addressProfile?: CompanionAddressProfile | null;
} = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(MINIMIZED_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [scrollShrink, setScrollShrink] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(getInitialPosition);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [comeback, setComeback] = useState(false);
  const [gardenStage, setGardenStage] = useState<GardenStage | undefined>(() =>
    readStoredGardenStage()
  );
  const [reflectionMeaning, setReflectionMeaning] = useState<string | undefined>(() =>
    readStoredReflectionMeaning()
  );
  const [thought, setThought] = useState<CompanionThought | null>(null);
  const [story, setStory] = useState<LivingStory | null>(null);
  const [typingInput, setTypingInput] = useState(false);
  const [mood, setMood] = useState<CompanionMoodKey>("quiet");
  const [microLine, setMicroLine] = useState<string | null>(null);
  const [tiltDeg, setTiltDeg] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [livingCoreSize, setLivingCoreSize] = useState<LivingCoreSize>(52);
  // Sprint 18.8 — Presence Coordinator: điều kiện hiển thị thật của Life
  // Moment/Return After Silence, đọc từ chính helper mà component gốc của
  // chúng dùng — không đoán lại logic cooldown/seen ở đây.
  const [lifeMomentEligible, setLifeMomentEligible] = useState(false);
  const [returnAfterSilenceEligible, setReturnAfterSilenceEligible] = useState(false);
  const [presenceNow, setPresenceNow] = useState<number | null>(null);
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [intent, setIntent] = useState<CompanionIntent | null>(null);
  const lastScrollY = useRef(0);
  const shrinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragState = useRef({ startX: 0, startY: 0, originX: 0, originY: 0, moved: false });
  const pageEnteredAt = useRef(0);
  const lastTouchAt = useRef(0);
  const secondClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const avatarWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribeToGardenStage(setGardenStage);
  }, []);

  useEffect(() => {
    return subscribeToReflectionMeaning(setReflectionMeaning);
  }, []);

  // NV04 — tôn trọng prefers-reduced-motion: không nghiêng theo con trỏ/chạm.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initialTimer = setTimeout(() => setReducedMotion(query.matches), 0);
    function handleChange(e: MediaQueryListEvent) {
      setReducedMotion(e.matches);
    }
    query.addEventListener("change", handleChange);
    return () => {
      clearTimeout(initialTimer);
      query.removeEventListener("change", handleChange);
    };
  }, []);

  // Sprint 18.8 — Presence Coordinator: hydration-safe, chỉ đọc
  // localStorage sau mount, giống mọi điều kiện hiển thị khác trong file này.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLifeMomentEligible(isLifeMomentEligibleToShow(lifeMoment));
  }, [lifeMoment]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReturnAfterSilenceEligible(isReturnAfterSilenceEligibleToShow(returnAfterSilenceMilestone));
  }, [returnAfterSilenceMilestone]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPresenceNow(Date.now());
    const interval = setInterval(() => setPresenceNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // NV05 — Mood-Based Motion: cập nhật Mood/Presence State định kỳ từ ngữ cảnh Portal.
  useEffect(() => {
    function computeMood() {
      const now = Date.now();
      setMood(
        resolveCompanionMood({
          isOpen: open,
          isComeback: comeback,
          hasThought: !!thought,
          hasStory: !!story,
          gardenStage,
          justTouched: now - lastTouchAt.current < JUST_TOUCHED_WINDOW_MS,
          timeOnPageMs: now - pageEnteredAt.current,
        })
      );
    }
    computeMood();
    const interval = setInterval(computeMood, MOOD_TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [open, comeback, thought, story, gardenStage]);

  // Nhiệm vụ 05 — Natural Timing: mốc "trang đã ổn định" reset mỗi khi route đổi.
  useEffect(() => {
    pageEnteredAt.current = Date.now();
    const clearTimer = setTimeout(() => {
      setThought(null);
      setStory(null);
      setMicroLine(null);
      setQuickPanelOpen(false);
      setIntent(null);
    }, 0);
    return () => clearTimeout(clearTimer);
  }, [pathname]);

  // Sprint A.2 — Connect Orchestrator to Real User Actions: khi người dùng
  // bấm một hành động thật ("Bắt đầu Mission", "Thực hành", "Phân tích dự
  // án"...), Companion nhận userGoal/currentContext thật và tự mở Quick
  // Panel để cho thấy mình đang lập kế hoạch/mời Agent ngay lúc đó.
  useEffect(() => {
    return subscribeToCompanionIntent((nextIntent) => {
      setIntent(nextIntent);
      setNudgeVisible(false);
      setQuickPanelOpen(true);
    });
  }, []);

  // Contextual Nudge — mỗi khu vực Portal chủ động nói 1 câu ngắn, tối đa
  // 1 lần/session/khu vực, im lặng nếu người dùng đã tắt nudge, và không
  // hiện khi Space/Quick Panel đang mở.
  useEffect(() => {
    const hideTimer = setTimeout(() => setNudgeVisible(false), 0);
    const routeKey = getRouteContext(pathname ?? "/portal").key;
    if (!hasContextualNudge(pathname ?? "/portal") || isNudgeDisabled() || hasNudgeBeenShown(routeKey) || open || minimized || quickPanelOpen) {
      return () => clearTimeout(hideTimer);
    }
    const showTimer = setTimeout(() => {
      markNudgeShown(routeKey);
      setNudgeVisible(true);
    }, 900);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Nhiệm vụ 03 — không hiện proactive thought khi người dùng đang nhập input/textarea.
  useEffect(() => {
    function isFormField(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      );
    }
    function handleFocusIn(e: FocusEvent) {
      if (isFormField(e.target)) setTypingInput(true);
    }
    function handleFocusOut(e: FocusEvent) {
      if (isFormField(e.target)) setTypingInput(false);
    }
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Nhiệm vụ 03/06 — Proactive Thought Engine: kiểm tra định kỳ, không bao giờ ép buộc.
  useEffect(() => {
    if (open || minimized) return;
    const interval = setInterval(() => {
      if (thought) return;
      const now = Date.now();
      const picked = pickProactiveThought(
        { pathname: pathname ?? "/portal", gardenStage, reflectionMeaning, dailyThoughtContext },
        {
          isSpaceOpen: open,
          isMinimized: minimized,
          isTypingInput: typingInput,
          timeOnPageMs: now - pageEnteredAt.current,
          isComeback: comeback,
        },
        now
      );
      if (picked) {
        // Sprint 18.6 — Thought Governance: trước khi thực sự nói, kiểm
        // tra Speech Budget của ngày/session (NV04).
        const momentDecision = chooseCompanionMoment(
          [
            {
              type: picked.trigger === "daily-thought" ? "daily-thought" : "proactive-thought",
              isEligible: true,
              isMajor: true,
            },
          ],
          now
        );
        if (momentDecision.chosen !== "soulful-silence") {
          markThoughtShown(picked, now);
          recordMajorMomentShown(now);
          setThought(picked);
        }
      }
    }, THOUGHT_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [open, minimized, typingInput, pathname, gardenStage, reflectionMeaning, comeback, thought, dailyThoughtContext]);

  // Nhiệm vụ 04/05 (Sprint 13.2) — Story Matching Engine: kiểm tra định kỳ, không
  // hiện cùng lúc với một Proactive Thought đang hiện.
  useEffect(() => {
    if (open || minimized) return;
    const interval = setInterval(() => {
      if (thought || story) return;
      const now = Date.now();
      const picked = pickLivingStory(
        { pathname: pathname ?? "/portal", gardenStage, reflectionMeaning },
        {
          isSpaceOpen: open,
          isMinimized: minimized,
          isTypingInput: typingInput,
          timeOnPageMs: now - pageEnteredAt.current,
          isComeback: comeback,
        },
        now
      );
      if (picked) {
        // Sprint 18.6 — Thought Governance: Story Moment cũng là một
        // moment "lớn", cùng chia Speech Budget với Proactive/Daily Thought.
        const momentDecision = chooseCompanionMoment(
          [{ type: "story-moment", isEligible: true, isMajor: true }],
          now
        );
        if (momentDecision.chosen !== "soulful-silence") {
          markStoryShown(picked, now);
          recordMajorMomentShown(now);
          setStory(picked);
        }
      }
    }, STORY_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [open, minimized, typingInput, pathname, gardenStage, reflectionMeaning, comeback, thought, story]);

  const decision = getCompanionDecision({
    pathname: pathname ?? "/portal",
    gardenStage,
    reflectionMeaning: reflectionMeaning as ReflectionMeaning | undefined,
  });
  const routeContext = getRouteContext(pathname ?? "/portal");
  // EPIC 02 — Sprint 04: Work Session chỉ tồn tại khi có một hành động
  // thật (intent) — không có Work Session, Companion quay về Silent
  // Presence bình thường (mood/greeting/thought engine cũ, không đổi).
  const { session: workSession, celebrate: celebrateWork } = useCompanionWorkSession(
    intent
      ? {
          currentRoute: pathname ?? "/portal",
          currentModule: intent.module,
          userGoal: intent.userGoal,
          currentContext: intent.currentContext,
        }
      : null
  );
  const workSessionMoodKey =
    workSession?.currentStatus === "CELEBRATING"
      ? "celebrating"
      : workSession?.currentStatus === "READY"
        ? "encouraging"
        : workSession && workSession.currentStatus !== "OBSERVING"
          ? "thinking"
          : null;
  const state = open
    ? states.listening
    : comeback
      ? states.comeback
      : workSessionMoodKey
        ? states[workSessionMoodKey]
        : decision.companionState;

  // Sprint 18.8 — Presence Coordinator: một dòng quyết định hiện diện duy
  // nhất cho Life Moment, Return After Silence, Thought, Story, Greeting,
  // Micro Reaction — thay cho việc mỗi nguồn tự hiện độc lập như trước.
  const presenceChosen =
    presenceNow === null
      ? "soulful-silence"
      : choosePresenceMoment({
          now: presenceNow,
          server: {
            lifeMoment,
            lifeMomentEligible,
            returnAfterSilenceMilestone,
            returnAfterSilenceEligible,
          },
          client: {
            isSpaceOpen: open,
            isMinimized: minimized,
            thought,
            story,
            microLine,
            hasGreeting: true,
          },
        }).decision.chosen;
  const motionMode = ANCHORED_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix))
    ? "anchored"
    : "floating";

  // Kẹp lại vị trí mỗi khi resize cửa sổ (vị trí khởi điểm đã có ngay từ
  // lazy initializer của useState, không cần set lại ở đây).
  useEffect(() => {
    function handleResize() {
      setPosition((prev) => (prev ? clampPosition(prev.x, prev.y, getAvatarBoxSize()) : prev));
      setLivingCoreSize(getLivingCoreSize());
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Nhiệm vụ 04 — thu nhỏ nhẹ khi scroll xuống nhanh, hiện lại khi đứng yên.
  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      if (delta > 18) {
        setScrollShrink(true);
        if (shrinkTimeout.current) clearTimeout(shrinkTimeout.current);
        shrinkTimeout.current = setTimeout(() => setScrollShrink(false), 650);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (shrinkTimeout.current) clearTimeout(shrinkTimeout.current);
    };
  }, []);

  // Nhiệm vụ 04 — tránh che input khi bàn phím mobile mở (visualViewport co lại đáng kể).
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const baseHeight = viewport.height;
    function handleResize() {
      const shrunk = baseHeight - (window.visualViewport?.height ?? baseHeight) > 140;
      setKeyboardOpen(shrunk);
    }
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    if (!position) return;
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) {
      // NV04 — Eye/Attention Illusion: nghiêng rất nhẹ theo hướng con trỏ (desktop hover).
      if (reducedMotion) return;
      const el = avatarWrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relativeX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      setTiltDeg(Math.max(-1, Math.min(1, relativeX)) * MAX_TILT_DEG);
      return;
    }
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragState.current.moved = true;
    }
    const box = getAvatarBoxSize();
    setPosition(clampPosition(dragState.current.originX + dx, dragState.current.originY + dy, box));
  }

  function handlePointerLeave() {
    setTiltDeg(0);
  }

  function handleAvatarTouchStart(e: React.TouchEvent) {
    if (reducedMotion) return;
    const el = avatarWrapperRef.current;
    const touch = e.touches[0];
    if (!el || !touch) return;
    const rect = el.getBoundingClientRect();
    const relativeX = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    setTiltDeg(Math.max(-1, Math.min(1, relativeX)) * MAX_TILT_DEG);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    setSettling(true);
    setTimeout(() => setSettling(false), 450);
    setPosition((prev) => {
      if (prev) {
        try {
          window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(prev));
        } catch {
          // bỏ qua nếu localStorage không khả dụng
        }
      }
      return prev;
    });
  }

  function openSpace() {
    if (secondClickTimer.current) {
      clearTimeout(secondClickTimer.current);
      secondClickTimer.current = null;
    }
    setMicroLine(null);
    setQuickPanelOpen(false);
    setComeback(false);
    setThought(null);
    setStory(null);
    setOpen(true);
  }

  function toggleQuickPanel() {
    setNudgeVisible(false);
    setQuickPanelOpen((prev) => !prev);
  }

  // User-Initiated Interaction — một click mở Quick Panel (chào ngắn + gợi ý
  // hành động theo trang). Click/nhấn lần hai trong cửa sổ ngắn (hoặc double
  // click) vẫn mở CompanionSpace đầy đủ như trước, để không mất lối vào cũ.
  function handleAvatarClick() {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }

    // Phản ứng hình ảnh (sáng nhẹ/scale/pulse) luôn xảy ra, không phụ thuộc cooldown lời nói.
    setPulsing(true);
    setTimeout(() => setPulsing(false), 500);

    if (secondClickTimer.current) {
      openSpace();
      return;
    }

    const now = Date.now();
    lastTouchAt.current = now;
    toggleQuickPanel();

    secondClickTimer.current = setTimeout(() => {
      secondClickTimer.current = null;
    }, SECOND_CLICK_OPEN_WINDOW_MS);
  }

  function handleAvatarDoubleClick() {
    openSpace();
  }

  // Bàn phím kích hoạt giống như click — mở Quick Panel.
  function handleAvatarKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleQuickPanel();
    }
  }

  function handleCloseSpace() {
    setOpen(false);
    setComeback(true);
    setTimeout(() => setComeback(false), 5000);
  }

  function handleMinimize(value: boolean) {
    setMinimized(value);
    try {
      window.localStorage.setItem(MINIMIZED_STORAGE_KEY, value ? "1" : "0");
    } catch {
      // bỏ qua nếu localStorage không khả dụng
    }
  }

  if (keyboardOpen && !open) return null;
  if (!position) return null;

  if (minimized && !open) {
    return (
      <div
        className="fixed z-40 select-none"
        style={{ left: position.x, top: position.y }}
      >
        <div className="relative flex h-9 w-9 items-center justify-center">
          <CompanionNest minimized />
          <button
            type="button"
            onClick={() => handleMinimize(false)}
            aria-label={`Hiện lại ${displayName}`}
            className="companion-avatar-button relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/90 text-gray-500 shadow-lg backdrop-blur transition hover:text-gray-900"
          >
            <ChevronDown className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed z-40 select-none touch-none ${
          motionMode === "floating" && !dragging ? "companion-presence--floating" : ""
        } ${scrollShrink ? "companion-presence--scrolling" : ""} ${
          settling ? "companion-presence--drag-settle" : ""
        }`}
        style={{
          left: position.x,
          top: position.y,
          transition: dragging ? "none" : "opacity 0.3s ease-out",
        }}
      >
        <div className="group relative flex items-end gap-1">
          {/* Sprint 18.8 — Presence Coordinator: đúng một moment được hiện
              tại một thời điểm, chọn bởi `choosePresenceMoment()` thay vì
              mỗi nguồn tự gác cổng riêng (NV04/NV05). */}
          {presenceChosen === "greeting" && (
            <CompanionGreetingBubble
              pathname={pathname ?? "/portal"}
              brainGreeting={decision.companionGreeting}
              addressProfile={addressProfile}
            />
          )}

          {(presenceChosen === "daily-thought" || presenceChosen === "proactive-thought") && thought && (
            <CompanionThoughtBubble
              thought={thought}
              onDismiss={() => setThought(null)}
              onPauseSession={() => {
                pauseProactiveThoughtsForSession();
                setThought(null);
              }}
            />
          )}

          {presenceChosen === "story-moment" && story && (
            <CompanionStoryMoment story={story} onDismiss={() => setStory(null)} />
          )}

          {presenceChosen === "micro-reaction" && microLine && (
            <CompanionMicroReactionBubble line={microLine} onDismiss={() => setMicroLine(null)} />
          )}

          {quickPanelOpen && (
            <CompanionQuickPanel
              state={state}
              routeContext={routeContext}
              workSession={workSession}
              onCelebrate={celebrateWork}
              onClose={() => setQuickPanelOpen(false)}
            />
          )}

          {!quickPanelOpen && !open && nudgeVisible && (
            <CompanionContextualNudge routeContext={routeContext} onDismiss={() => setNudgeVisible(false)} />
          )}

          <div
            ref={avatarWrapperRef}
            className={`relative flex items-center justify-center companion-mood-${mood}`}
            style={
              reducedMotion || tiltDeg === 0
                ? undefined
                : { transform: `rotate(${tiltDeg}deg)`, transition: "transform 0.15s ease-out" }
            }
          >
            <CompanionNest dragging={dragging} />
            <button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onTouchStart={handleAvatarTouchStart}
              onClick={handleAvatarClick}
              onDoubleClick={handleAvatarDoubleClick}
              onKeyDown={handleAvatarKeyDown}
              aria-label={`${displayName} — ${state.label}. ${state.line}. Nhấn hoặc Enter để mở gợi ý nhanh. Có thể kéo tới vị trí khác.`}
              aria-haspopup="dialog"
              aria-expanded={open}
              className={`companion-avatar-button relative flex cursor-grab items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 active:cursor-grabbing ${
                pulsing ? "companion-avatar-button--pulse" : ""
              }`}
            >
              <LivingCore size={livingCoreSize} state={toLivingCoreState(state.key)} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleMinimize(true)}
            aria-label={`Thu nhỏ ${displayName}`}
            className="mb-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-400 opacity-0 transition hover:text-gray-700 focus:opacity-100 focus:outline-none group-hover:opacity-100"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {open && (
        <CompanionSpace
          state={state}
          onClose={handleCloseSpace}
          insight={decision.companionInsight}
        />
      )}

      {/* Sprint 18.8 — Presence Coordinator: Life Moment/Return After
          Silence giờ đi qua đúng một dòng quyết định hiện diện, không còn
          render độc lập ở `layout.tsx` ngoài governance. */}
      {presenceChosen === "life-moment" && (
        <LifeMomentBubble moment={lifeMoment} addressProfile={addressProfile} />
      )}
      {presenceChosen === "return-after-silence" && (
        <ReturnAfterSilenceCeremony
          milestoneOccurredAt={returnAfterSilenceMilestone}
          addressProfile={addressProfile}
        />
      )}
    </>
  );
}
