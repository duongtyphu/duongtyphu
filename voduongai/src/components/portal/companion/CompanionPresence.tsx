"use client";

/**
 * Companion Presence (Sprint 8.2 — Nhiệm vụ 03). Một sự hiện diện ấm áp,
 * không phải nút chat nổi kiểu support widget. Luôn ở đó, rất tinh tế,
 * không tự popup, không badge thông báo. Bấm vào để mở `CompanionSpace`.
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CompanionCrystal } from "@/assets/companion/placeholder/CompanionCrystal";
import { getStateForPath, displayName } from "@/lib/portal/companion/companion-identity";
import { CompanionSpace } from "@/components/portal/companion/CompanionSpace";

export function CompanionPresence() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const state = getStateForPath(pathname ?? "/portal");

  return (
    <>
      <div className="fixed bottom-5 right-4 z-40 md:bottom-6 md:right-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${displayName} — ${state.label}. ${state.line}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group flex items-center justify-center rounded-full p-1 transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
        >
          <CompanionCrystal state={state.key} size={52} />
        </button>
      </div>

      {open && <CompanionSpace state={state} onClose={() => setOpen(false)} />}
    </>
  );
}
