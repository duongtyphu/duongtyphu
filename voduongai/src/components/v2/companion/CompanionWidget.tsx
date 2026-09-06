"use client";

/**
 * Companion nổi (Widget) — Portal 2.0, Giai đoạn 9.
 *
 * Founder chỉ đạo: "Tận dụng và cải tiến Companion 2.0. Sử dụng lại tất cả
 * các tính năng mà companion đã có" — audit trước khi build xác nhận
 * `CompanionFloatingChat`/`CompanionChatShell(variant="compact")` (mini
 * chat nổi đã xây cho Portal 1.0, Sprint EPIC-CS-001) HOÀN TOÀN
 * route-agnostic — tái dùng NGUYÊN VẸN, không viết lại 1 dòng logic chat
 * nào. `LivingCore` (Design Lock v1.2) cũng tái dùng nguyên, không đổi
 * hình học/màu sắc.
 *
 * KHÔNG port nguyên `CompanionPresence.tsx` (841 dòng, 1.0) — hệ thống đó
 * gắn rất sâu vào tín hiệu chỉ 1.0 mới có (garden-stage/reflection-meaning
 * đọc từ `portal-signals.ts`, life-moment/return-after-silence ceremony
 * cần props server-side riêng của `PortalShell`). Bản 2.0 này là 1 THIẾT
 * KẾ MỚI, gọn hơn — giữ 3 lớp giá trị cốt lõi Founder yêu cầu: (1) mini
 * chat AI thật; (2) gợi ý theo đúng khu vực đang xem ("Contextual Nudge",
 * tái dùng nguyên `route-context.ts`/`nudge-session.ts`); (3) kéo-thả tự
 * do khắp màn hình + ẩn/hiện + đổi màu theo nền từng khu vực (đợt sau, xem
 * dưới) — mood/life-moment/proactive-thought đầy đủ như 1.0 vẫn là việc
 * RIÊNG, lớn hơn, chưa làm ở đợt này.
 *
 * ĐỢT 2 (Founder yêu cầu thêm): kéo-thả tự do khắp màn hình (vị trí nhớ
 * lại qua `localStorage`, luôn giữ trong vùng nhìn thấy — cùng nguyên lý
 * `POSITION_STORAGE_KEY`/`SAFE_MARGIN`/`DRAG_THRESHOLD` đã dùng ở
 * `CompanionPresence.tsx` 1.0, nhưng KHÔNG dùng CHUNG key
 * `localStorage` — 2 bản có layout khác nhau (topbar/sidebar 2.0 khác
 * 1.0), chia sẻ toạ độ dễ lệch); ẩn/hiện (thu nhỏ về 1 tab nhỏ góc dưới,
 * bấm lại để mở full, nhớ trạng thái qua `localStorage`); đổi màu theo
 * cấu trúc nền — `getWidgetZone(pathname)` (bên dưới) map route sang 1
 * trong 2 "tông nền" THẬT đã audit trực tiếp CSS: đa số trang `/v2/*`
 * nền sáng (`--bg:#f7f6fc`), riêng 2 khu vực nền THẬT SỰ tối
 * (`/v2/moi-ngay-mot-y-tuong`'s `.mnyt{--bg:#0a0b12}`,
 * `/v2/hanh-trinh-cua-toi`'s `.htct{--bg:#0a0a0f}`) — nút đổi sang mặt
 * kính tối + viền/glow theo đúng màu nhấn (`--violet`) của CHÍNH khu vực
 * đó (không bịa màu mới, lấy từ CSS thật của trang).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LivingCore } from "@/components/LivingCore";
import { CompanionFloatingChat } from "@/components/portal/companion/CompanionFloatingChat";
import { getRouteContext, hasContextualNudge } from "@/lib/portal/companion/route-context";
import { hasNudgeBeenShown, isNudgeDisabled, markNudgeShown, setNudgeDisabled } from "@/lib/portal/companion/nudge-session";

const NUDGE_DELAY_MS = 2600;
const BUTTON_SIZE = 64;
const SAFE_MARGIN = 16;
const DRAG_THRESHOLD = 6;
const POSITION_STORAGE_KEY = "companion-widget-position-v2";
const HIDDEN_STORAGE_KEY = "companion-widget-hidden-v2";

type WidgetZone = { tone: "light" | "dark"; accent: string };

/** Đúng 2 khu vực nền tối THẬT trong `/v2/*` (đã audit trực tiếp CSS gốc
    của từng trang — không suy đoán), còn lại mặc định nền sáng. */
const DARK_ZONES: { prefix: string; accent: string }[] = [
  { prefix: "/v2/moi-ngay-mot-y-tuong", accent: "#a78bfa" }, // .mnyt{--violet:#a78bfa}
  { prefix: "/v2/hanh-trinh-cua-toi", accent: "#8b7bde" }, // .htct — họ jewel-tone, tím trung tính làm mặc định
];

function getWidgetZone(pathname: string): WidgetZone {
  const match = DARK_ZONES.find((z) => pathname.startsWith(z.prefix));
  return match ? { tone: "dark", accent: match.accent } : { tone: "light", accent: "#6d4aff" };
}

type Position = { left: number; top: number };

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: 0, top: 0 };
  return {
    left: window.innerWidth - BUTTON_SIZE - SAFE_MARGIN - 8,
    top: window.innerHeight - BUTTON_SIZE - SAFE_MARGIN - 8,
  };
}

function clampPosition(pos: Position): Position {
  if (typeof window === "undefined") return pos;
  const maxLeft = window.innerWidth - BUTTON_SIZE - SAFE_MARGIN;
  const maxTop = window.innerHeight - BUTTON_SIZE - SAFE_MARGIN;
  return {
    left: Math.min(Math.max(pos.left, SAFE_MARGIN), Math.max(maxLeft, SAFE_MARGIN)),
    top: Math.min(Math.max(pos.top, SAFE_MARGIN), Math.max(maxTop, SAFE_MARGIN)),
  };
}

function readStoredPosition(): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(POSITION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Position;
    if (typeof parsed.left !== "number" || typeof parsed.top !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function readStoredHidden(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(HIDDEN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function CompanionWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  // BUG THẬT đã tự phát hiện + sửa trước khi ship (chưa từng xuất bản):
  // bản nháp đầu dùng lazy initializer (`useState(() => readStoredPosition())`)
  // với kỳ vọng "chạy ngay ở lượt render đầu, tránh 1 khung hình nhảy vị
  // trí" — SAI, vì lazy initializer chạy NGAY TRONG LƯỢT RENDER ĐẦU TIÊN
  // Ở CLIENT (chính là lượt hydrate), trong khi SERVER render `position`
  // luôn `null` (không có `window`) → HTML server và lượt render đầu của
  // client khác nhau ngay → lỗi hydration React #418 (đã đo được qua
  // Playwright: `pageerror` xuất hiện thật khi test). Đây CHÍNH XÁC là bài
  // học "chỉ set trong `useEffect`" đã áp dụng cho lời chào theo giờ
  // (`CompanionThoughtLine`) — giá trị khởi tạo PHẢI giống hệt server
  // (`false`/`null`), chỉ đọc `localStorage`/tính vị trí THẬT trong
  // `useEffect` (chạy SAU KHI hydrate đã commit xong, không còn so khớp
  // với HTML server nữa).
  const [hidden, setHidden] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStateRef = useRef<{ startX: number; startY: number; originLeft: number; originTop: number; moved: boolean } | null>(null);

  const currentPath = pathname ?? "/v2";
  const routeContext = getRouteContext(currentPath);
  const zone = getWidgetZone(currentPath);

  // Đọc vị trí/trạng thái ẩn thật từ `localStorage` — chỉ chạy client-side,
  // sau khi hydrate đã commit (không còn rủi ro mismatch #418 ở trên). Cố ý
  // vi phạm rule `react-hooks/set-state-in-effect`: giá trị ban đầu
  // (null/false) PHẢI khớp server để hydrate an toàn, giá trị thật chỉ tồn
  // tại ở client (`localStorage`) nên bắt buộc phải set SAU KHI mount,
  // không có cách nào "adjust state during render" áp dụng được ở đây.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(readStoredHidden());
    setPosition(clampPosition(readStoredPosition() ?? defaultPosition()));
  }, []);

  // Giữ trong vùng nhìn thấy khi đổi kích thước cửa sổ (xoay màn hình di
  // động, thay đổi zoom).
  useEffect(() => {
    function onResize() {
      setPosition((prev) => (prev ? clampPosition(prev) : prev));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Ẩn nudge của route trước đó NGAY khi route đổi — cập nhật state trong
  // lúc render (không phải trong effect, tránh cascading render — đúng
  // pattern "adjust state on prop change" đã dùng cho `MnytShellClient.tsx`).
  const [prevPath, setPrevPath] = useState(currentPath);
  if (currentPath !== prevPath) {
    setPrevPath(currentPath);
    setNudgeVisible(false);
  }

  // Hiện nudge chủ động đúng 1 lần/khu vực/phiên, sau 1 khoảng trễ ngắn.
  useEffect(() => {
    if (open || hidden) return;
    if (!hasContextualNudge(currentPath)) return;
    if (isNudgeDisabled() || hasNudgeBeenShown(routeContext.key)) return;

    timerRef.current = setTimeout(() => {
      setNudgeVisible(true);
      markNudgeShown(routeContext.key);
    }, NUDGE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ cần đổi theo currentPath/hidden, routeContext suy trực tiếp từ currentPath
  }, [currentPath, open, hidden]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNudgeVisible(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const persistPosition = useCallback((pos: Position) => {
    try {
      window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(pos));
    } catch {
      // Bỏ qua nếu localStorage không khả dụng.
    }
  }, []);

  const persistHidden = useCallback((value: boolean) => {
    try {
      window.localStorage.setItem(HIDDEN_STORAGE_KEY, value ? "1" : "0");
    } catch {
      // Bỏ qua.
    }
  }, []);

  // Kéo-thả bằng Pointer Events (gộp chuột+chạm, 1 API duy nhất) — phân
  // biệt "bấm mở chat" với "kéo đổi vị trí" bằng `DRAG_THRESHOLD` (di
  // chuyển dưới ngưỡng này khi thả tay vẫn tính là click).
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!position) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragStateRef.current = { startX: e.clientX, startY: e.clientY, originLeft: position.left, originTop: position.top, moved: false };
      setDragging(true);
    },
    [position]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) drag.moved = true;
    if (!drag.moved) return;
    setPosition(clampPosition({ left: drag.originLeft + dx, top: drag.originTop + dy }));
  }, []);

  const onPointerUp = useCallback(
    () => {
      const drag = dragStateRef.current;
      dragStateRef.current = null;
      setDragging(false);
      if (drag?.moved) {
        setPosition((prev) => {
          if (prev) persistPosition(prev);
          return prev;
        });
        return;
      }
      // Không kéo (di chuyển dưới ngưỡng) — coi là click, mở chat.
      setNudgeVisible(false);
      setOpen(true);
    },
    [persistPosition]
  );

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => {
          setHidden(false);
          persistHidden(false);
        }}
        aria-label="Hiện lại Companion"
        title="Hiện lại Companion"
        className="fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-[0_6px_18px_rgba(15,10,40,0.18)] ring-1 ring-black/5 transition hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <LivingCore size={16} state="sleeping" intensity="low" />
      </button>
    );
  }

  // Container neo bằng `right`/`bottom` (KHÔNG phải `left`/`top`) — dù
  // `position` lưu/tính toán bằng `left/top` (thuận tiện cho phép trừ khi
  // kéo), khi RENDER phải quy đổi sang `right/bottom` để cạnh phải của nút
  // (căn theo `items-end`) đứng yên khi bong bóng gợi ý (rộng 288px) xuất
  // hiện/biến mất — nếu neo bằng `left`, cả cụm sẽ "nhảy" sang phải/xuống
  // dưới mỗi khi bong bóng đổi kích thước (bug đã tự phát hiện khi viết,
  // sửa trước khi ship, chưa từng xuất bản).
  const style = position
    ? { right: window.innerWidth - position.left - BUTTON_SIZE, bottom: window.innerHeight - position.top - BUTTON_SIZE }
    : { right: 20, bottom: 20 };

  return (
    <>
      {!open && position && (
        <div
          className="fixed z-40 flex flex-col items-end gap-3"
          style={style}
        >
          {nudgeVisible && (
            <NudgeBubble
              text={routeContext.nudge}
              actions={routeContext.quickActions}
              onOpenChat={() => {
                setNudgeVisible(false);
                setOpen(true);
              }}
              onDismiss={() => setNudgeVisible(false)}
              onDisableAll={() => {
                setNudgeDisabled(true);
                setNudgeVisible(false);
              }}
            />
          )}

          <div className="group relative">
            <button
              type="button"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              aria-label="Mở Companion"
              title="Kéo để di chuyển · Bấm để mở chat"
              style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, touchAction: "none" }}
              className={`flex items-center justify-center rounded-full shadow-[0_10px_30px_rgba(15,10,40,0.22)] transition hover:shadow-[0_14px_36px_rgba(15,10,40,0.28)] ${
                dragging ? "cursor-grabbing scale-105" : "cursor-grab hover:scale-105"
              } ${zone.tone === "dark" ? "bg-[#150f2e]/95" : "bg-white"}`}
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: `0 0 0 1px ${zone.tone === "dark" ? `${zone.accent}55` : "rgba(0,0,0,0.05)"}` }}
              />
              <LivingCore size={52} state="idle" intensity="medium" />
            </button>

            {/* Nút ẩn — chỉ hiện khi hover/focus vùng nút, tránh chiếm chỗ
                thường trực trên 1 nút vốn đã nhỏ. */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHidden(true);
                persistHidden(true);
              }}
              aria-label="Ẩn Companion"
              title="Ẩn Companion"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-400 opacity-0 shadow ring-1 ring-black/10 transition hover:text-gray-600 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {open && <CompanionFloatingChat onClose={() => setOpen(false)} fullPageHref="/v2/companion" />}
    </>
  );
}

function NudgeBubble({
  text,
  actions,
  onOpenChat,
  onDismiss,
  onDisableAll,
}: {
  text: string;
  actions: { label: string; href: string }[];
  onOpenChat: () => void;
  onDismiss: () => void;
  onDisableAll: () => void;
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      role="status"
      className={`w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_20px_50px_rgba(15,10,40,0.2)] transition-all duration-200 ease-out ${
        entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-snug text-gray-700">{text}</p>
        <button type="button" aria-label="Đóng gợi ý" onClick={onDismiss} className="shrink-0 text-gray-400 transition hover:text-gray-600">
          ✕
        </button>
      </div>
      {actions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {actions.slice(0, 3).map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
            >
              {action.label}
            </a>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
        <button type="button" onClick={onOpenChat} className="text-xs font-semibold text-violet-600 hover:text-violet-700">
          Trò chuyện với Companion →
        </button>
        <button type="button" onClick={onDisableAll} className="text-[11px] text-gray-400 hover:text-gray-500">
          Tắt gợi ý
        </button>
      </div>
    </div>
  );
}
