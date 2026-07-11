"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

/**
 * Shell-level placeholder for a future notification system — establishes
 * the header slot and empty-state UI only. No notification data/logic
 * exists yet (business-module work, out of this sprint's scope).
 */
export function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Thông báo"
        title="Thông báo"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-brand-blue/40 hover:text-white"
      >
        <Bell className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-white/10 bg-brand-navy-soft p-4 shadow-xl"
        >
          <p className="text-sm font-bold text-white">Thông báo</p>
          <p className="mt-2 text-xs text-white/50">Chưa có thông báo nào.</p>
        </div>
      )}
    </div>
  );
}
