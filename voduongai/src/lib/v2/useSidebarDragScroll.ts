"use client";

import { useEffect, useRef } from "react";

/**
 * Task #43 — "Sidebar trái: có chế độ kéo lên xuống khi di chuyển chuột".
 * Sidebar đã cuộn được bằng con lăn chuột từ trước (`overflow-y:auto`,
 * `v2-tokens.css`'s `[data-ui="v2"] .sidebar`) khi nội dung tràn quá
 * `100vh` (vd nhóm "Companion AI" mở rộng 3 mục con trên màn hình thấp) —
 * đã verify bằng Playwright, hoạt động đúng. Hook này CỘNG THÊM khả năng
 * CLICK-VÀ-KÉO (drag) để cuộn — đúng nghĩa đen "kéo" trong yêu cầu, không
 * thay thế cuộn bằng con lăn chuột.
 *
 * Chỉ coi là "kéo" khi con trỏ di chuyển quá `DRAG_THRESHOLD_PX` sau khi
 * nhấn chuột — dưới ngưỡng đó vẫn là 1 cú click bình thường (nav-item/nút
 * thu gọn sidebar vẫn bấm được đúng, không bị chặn nhầm). Khi ĐÃ kéo,
 * chặn sự kiện `click` phát sinh ngay sau đó (capture phase trên chính
 * phần tử sidebar) để không vô tình điều hướng khi người dùng chỉ định kéo
 * cuộn chứ không định bấm.
 */
export function useSidebarDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const DRAG_THRESHOLD_PX = 6;
    let dragging = false;
    let moved = false;
    let startY = 0;
    let startScrollTop = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return;
      dragging = true;
      moved = false;
      startY = e.clientY;
      startScrollTop = el.scrollTop;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dy = e.clientY - startY;
      if (!moved && Math.abs(dy) > DRAG_THRESHOLD_PX) {
        moved = true;
        el.classList.add("dragging-scroll");
      }
      if (moved) el.scrollTop = startScrollTop - dy;
    };

    const endDrag = () => {
      dragging = false;
      el.classList.remove("dragging-scroll");
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return ref;
}
