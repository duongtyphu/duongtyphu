"use client";

/**
 * Toast dùng chung "Mỗi ngày một ý tưởng" — 1:1 với mockup dòng 1195-1197
 * (`toastVisible`/`toastMsg`, tự ẩn sau ~2.2s — khớp `_toastTimer` gốc,
 * mockup dòng ~3186). Mount 1 lần ở `MnytShellClient.tsx` (Provider bọc
 * toàn bộ shell) — mọi Client Component con gọi `useMnytToast()` để hiện
 * thông báo, không cần thread state qua props xuyên nhiều tầng.
 */

import { createContext, useCallback, useContext, useRef, useState } from "react";

const TOAST_DURATION_MS = 2200;

type ToastContextValue = { showToast: (message: string) => void };

const MnytToastContext = createContext<ToastContextValue | null>(null);

export function MnytToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }, []);

  return (
    <MnytToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="mnyt-toast" role="status" aria-live="polite">
          {message}
        </div>
      )}
    </MnytToastContext.Provider>
  );
}

/** Ném lỗi nếu gọi ngoài `MnytToastProvider` — luôn có sẵn (mount ở shell dùng chung mọi route con). */
export function useMnytToast(): (message: string) => void {
  const ctx = useContext(MnytToastContext);
  if (!ctx) throw new Error("useMnytToast() phải gọi bên trong <MnytToastProvider>.");
  return ctx.showToast;
}
