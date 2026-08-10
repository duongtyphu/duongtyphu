"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "vdai-v2-theme";

/**
 * Lựa chọn sáng/tối là trạng thái nằm NGOÀI React (localStorage + thuộc tính
 * trên thẻ `<html>`), nên đọc bằng `useSyncExternalStore` thay vì `useEffect`
 * + `setState`. Cách này cho luôn giá trị đúng ở lần render đầu phía client,
 * không tạo thêm một vòng render thừa, và có sẵn `getServerSnapshot` để markup
 * server khớp với client (tránh hydration mismatch).
 */
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // Đồng bộ giữa các tab đang mở cùng tài khoản.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): boolean {
  return window.localStorage.getItem(STORAGE_KEY) === "dark";
}

/** Server chưa biết lựa chọn của người dùng — luôn bắt đầu ở chế độ sáng. */
function getServerSnapshot(): boolean {
  return false;
}

function setTheme(dark: boolean) {
  window.localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  document.documentElement.setAttribute("data-v2-theme", dark ? "dark" : "light");
  listeners.forEach((listener) => listener());
}

/**
 * LƯU Ý: gói handoff chỉ có bản sáng cho cả 46 màn — không có token cho chế độ
 * tối. Bảng màu tối trong `v2-tokens.css` được suy ra từ chính thang ink của
 * handoff (`--ink`, `--ink-2`, `--sidebar`), không bịa hue mới, nhưng CHƯA
 * được duyệt thiết kế. Cần Founder/designer xác nhận trước khi coi là chính thức.
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setTheme(!dark)}
      role="switch"
      aria-checked={dark}
      className="flex items-center gap-2 px-[6px] pt-[14px] pb-1 text-[12.5px] text-[#9791b8] transition-colors hover:text-white"
    >
      <span
        className={[
          "relative h-[18px] w-8 shrink-0 rounded-[20px] transition-colors",
          dark ? "bg-[var(--v2-violet)]" : "bg-[#3a3364]",
          "after:absolute after:top-[2px] after:h-[14px] after:w-[14px] after:rounded-full after:bg-white after:transition-[left] after:duration-150",
          dark ? "after:left-4" : "after:left-[2px]",
        ].join(" ")}
      />
      {dark ? "Chế độ tối" : "Chế độ sáng"}
    </button>
  );
}
