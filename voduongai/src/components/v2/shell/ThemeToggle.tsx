"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vdai-v2-theme";

/**
 * Công tắc sáng/tối ở đáy sidebar.
 *
 * LƯU Ý: gói handoff chỉ có bản sáng cho cả 46 màn — không có token cho chế độ
 * tối. Bảng màu tối trong `v2-tokens.css` được suy ra từ chính thang ink của
 * handoff (`--ink`, `--ink-2`, `--sidebar`), không bịa hue mới, nhưng CHƯA
 * được duyệt thiết kế. Cần Founder/designer xác nhận trước khi coi là chính thức.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  // Trước khi đọc xong localStorage thì chưa biết trạng thái thật; render nhãn
  // theo mặc định sáng để markup server và client khớp nhau (tránh hydration
  // mismatch), rồi mới đồng bộ ở effect.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const isDark = stored === "dark";
    setDark(isDark);
    setReady(true);
    document.documentElement.setAttribute("data-v2-theme", isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    document.documentElement.setAttribute("data-v2-theme", next ? "dark" : "light");
  }

  const label = ready && dark ? "Chế độ tối" : "Chế độ sáng";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={ready ? dark : false}
      className="flex items-center gap-2 px-[6px] pt-[14px] pb-1 text-[12.5px] text-[#9791b8] transition-colors hover:text-white"
    >
      <span
        className={[
          "relative h-[18px] w-8 shrink-0 rounded-[20px] transition-colors",
          ready && dark ? "bg-[var(--v2-violet)]" : "bg-[#3a3364]",
          "after:absolute after:top-[2px] after:h-[14px] after:w-[14px] after:rounded-full after:bg-white after:transition-[left] after:duration-150",
          ready && dark ? "after:left-4" : "after:left-[2px]",
        ].join(" ")}
      />
      {label}
    </button>
  );
}
