"use client";

/**
 * Companion nổi (Widget) — Portal 2.0, Giai đoạn 9.
 *
 * Founder chỉ đạo: "Tận dụng và cải tiến Companion 2.0. Sử dụng lại tất cả
 * các tính năng mà companion đã có" — audit trước khi build xác nhận
 * `CompanionFloatingChat`/`CompanionChatShell(variant="compact")` (mini
 * chat nổi đã xây cho Portal 1.0, Sprint EPIC-CS-001) HOÀN TOÀN
 * route-agnostic (2 lời gọi `router.push("/portal/companion")` bên trong
 * đều nằm sau `if (!compact)`, không bao giờ chạy ở chế độ nổi) — tái dùng
 * NGUYÊN VẸN, không viết lại 1 dòng logic chat nào. `LivingCore` (Design
 * Lock v1.2) cũng tái dùng nguyên, không đổi hình học/màu sắc.
 *
 * KHÔNG port nguyên `CompanionPresence.tsx` (841 dòng, 1.0) — hệ thống đó
 * gắn rất sâu vào tín hiệu chỉ 1.0 mới có (garden-stage/reflection-meaning
 * đọc từ `portal-signals.ts`, life-moment/return-after-silence ceremony
 * cần props server-side riêng của `PortalShell`). Bản 2.0 này là 1 THIẾT
 * KẾ MỚI, gọn hơn — giữ lại đúng 2 lớp giá trị cốt lõi Founder yêu cầu:
 * (1) mini chat AI thật, tái dùng nguyên; (2) gợi ý theo đúng khu vực đang
 * xem ("Contextual Nudge", tái dùng nguyên `route-context.ts`/
 * `nudge-session.ts` — cả 2 đã generic từ trước, chỉ thêm entry `/v2/*`,
 * xem `route-context.ts`). Nâng cấp mood/life-moment/proactive-thought
 * đầy đủ như 1.0 là việc RIÊNG, lớn hơn — chưa làm ở đợt này.
 *
 * Vị trí cố định góc dưới-phải (không kéo-thả như 1.0 — giữ đơn giản cho
 * v1, có thể nâng cấp sau nếu Founder muốn). Không hiện trên các route đã
 * có trải nghiệm Companion riêng hoặc không có shell chuẩn — xem
 * `EXCLUDED_PREFIXES` + nơi gọi `CompanionWidgetGate`.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LivingCore } from "@/components/LivingCore";
import { CompanionFloatingChat } from "@/components/portal/companion/CompanionFloatingChat";
import { getRouteContext, hasContextualNudge } from "@/lib/portal/companion/route-context";
import { hasNudgeBeenShown, isNudgeDisabled, markNudgeShown, setNudgeDisabled } from "@/lib/portal/companion/nudge-session";

const NUDGE_DELAY_MS = 2600;

export function CompanionWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPath = pathname ?? "/v2";
  const routeContext = getRouteContext(currentPath);

  // Ẩn nudge của route trước đó NGAY khi route đổi — cập nhật state trong
  // lúc render (không phải trong effect, tránh cascading render — đúng
  // pattern "adjust state on prop change" đã dùng cho `MnytShellClient.tsx`),
  // không phải khi mở/đóng chat (khi `open=true`, JSX bên dưới đã tự ẩn
  // nudge qua điều kiện `!open`, không cần đụng state này).
  const [prevPath, setPrevPath] = useState(currentPath);
  if (currentPath !== prevPath) {
    setPrevPath(currentPath);
    setNudgeVisible(false);
  }

  // Hiện nudge chủ động đúng 1 lần/khu vực/phiên, sau 1 khoảng trễ ngắn để
  // không tranh chấp với nội dung trang đang tải — effect chỉ lo phần hẹn
  // giờ, tự huỷ hẹn giờ cũ khi route/trạng thái mở đổi (cleanup mặc định).
  useEffect(() => {
    if (open) return;
    if (!hasContextualNudge(currentPath)) return;
    if (isNudgeDisabled() || hasNudgeBeenShown(routeContext.key)) return;

    timerRef.current = setTimeout(() => {
      setNudgeVisible(true);
      markNudgeShown(routeContext.key);
    }, NUDGE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ cần đổi theo currentPath, routeContext suy trực tiếp từ nó
  }, [currentPath, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNudgeVisible(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {!open && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
          {nudgeVisible && (
            <div
              role="status"
              className="w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-snug text-gray-700">{routeContext.nudge}</p>
                <button
                  type="button"
                  aria-label="Đóng gợi ý"
                  onClick={() => setNudgeVisible(false)}
                  className="shrink-0 text-gray-400 transition hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              {routeContext.quickActions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {routeContext.quickActions.slice(0, 3).map((action) => (
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
                <button
                  type="button"
                  onClick={() => {
                    setNudgeVisible(false);
                    setOpen(true);
                  }}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  Trò chuyện với Companion →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNudgeDisabled(true);
                    setNudgeVisible(false);
                  }}
                  className="text-[11px] text-gray-400 hover:text-gray-500"
                >
                  Tắt gợi ý
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Mở Companion"
            title="Companion"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(15,10,40,0.22)] ring-1 ring-black/5 transition hover:scale-105 hover:shadow-[0_14px_36px_rgba(15,10,40,0.28)]"
          >
            <LivingCore size={52} state="idle" intensity="medium" />
          </button>
        </div>
      )}

      {open && <CompanionFloatingChat onClose={() => setOpen(false)} />}
    </>
  );
}
