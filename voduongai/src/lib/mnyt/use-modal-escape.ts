"use client";

import { useEffect } from "react";

/**
 * Đóng modal bằng phím Escape — mockup gốc (`_onKeyDown`, dòng ~1926-1966)
 * xử lý `Escape`/`Esc` cho MỌI modal đang mở (Tour/Onboarding/Submit/
 * PathMap/ShareCard/Cert) trước khi xử lý phím điều hướng khác. Dùng
 * chung cho cả 6 modal của tính năng "Mỗi ngày một ý tưởng" — tránh lặp
 * lại `useEffect` giống hệt nhau ở từng file.
 */
export function useMnytModalEscape(onClose: () => void): void {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
}
