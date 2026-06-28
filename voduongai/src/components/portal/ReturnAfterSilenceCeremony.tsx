"use client";

/**
 * Return After Silence Ceremony (Sprint 18.0). Xem
 * `docs/RETURN_AFTER_SILENCE.md`, `docs/CEREMONY_FRAMEWORK.md`.
 *
 * Không phải reminder, không phải retention. Chỉ xuất hiện SAU KHI
 * milestone `return-after-silence` đã thật sự xảy ra (người dùng đã tự
 * quay lại) — không bao giờ nhắc số ngày vắng mặt, không hỏi vì sao đã
 * vắng mặt, không dùng ngôn ngữ "khôi phục streak". Phản ứng Garden ở
 * đây thuần trang trí, không chạm vào `garden-model.ts`.
 */

import { useEffect, useState } from "react";
import { CompanionAvatar } from "@/components/portal/companion/CompanionAvatar";

const SEEN_KEY_PREFIX = "vdai_portal_return_after_silence_seen_";

function hasSeenForMilestone(occurredAt: string): boolean {
  try {
    return localStorage.getItem(`${SEEN_KEY_PREFIX}${occurredAt}`) === "1";
  } catch {
    return true;
  }
}

function markSeenForMilestone(occurredAt: string) {
  try {
    localStorage.setItem(`${SEEN_KEY_PREFIX}${occurredAt}`, "1");
  } catch {
    // localStorage không khả dụng — chấp nhận hiển thị lại lần sau, không chặn nghi thức.
  }
}

type CeremonyStep = "opening" | "garden" | "closing";

export function ReturnAfterSilenceCeremony({
  milestoneOccurredAt,
}: {
  milestoneOccurredAt: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<CeremonyStep>("opening");

  useEffect(() => {
    // Hydration-safe: chỉ quyết định hiển thị sau khi mount, vì phụ thuộc localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(!!milestoneOccurredAt && !hasSeenForMilestone(milestoneOccurredAt));
  }, [milestoneOccurredAt]);

  if (!open || !milestoneOccurredAt) return null;

  function finish() {
    markSeenForMilestone(milestoneOccurredAt as string);
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020817] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.16),transparent_60%)]" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <CompanionAvatar state="idle" size={88} />

        {step === "opening" && (
          <>
            <p className="mt-8 text-lg leading-relaxed text-white/90">
              Chào bạn.
              <br />
              Mình rất vui vì bạn đã quay lại.
            </p>
            <button
              type="button"
              onClick={() => setStep("garden")}
              className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Tiếp tục
            </button>
          </>
        )}

        {step === "garden" && (
          <>
            <div className="mt-8 h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400 shadow-[0_0_24px_rgba(110,231,183,0.7)]" />
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Có một chồi non vừa nhú lên trong khu vườn của bạn.
            </p>
            <button
              type="button"
              onClick={() => setStep("closing")}
              className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Tiếp tục
            </button>
          </>
        )}

        {step === "closing" && (
          <>
            <p className="mt-8 text-lg leading-relaxed text-white/90">
              Mình vẫn ở đây.
              <br />
              Và mình rất vui vì bạn cũng vậy.
            </p>
            <button
              type="button"
              onClick={finish}
              className="mt-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-purple/30 transition"
            >
              Cùng tiếp tục
            </button>
          </>
        )}
      </div>
    </div>
  );
}
