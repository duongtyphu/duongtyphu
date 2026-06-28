"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { deleteMemoryCapsule } from "@/lib/portal/memoryCapsules";

export type StoryMoment = {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  date: Date;
  /** Sprint 13.4 — ví dụ "Companion · Living Story" khi moment đến từ một Living Story đã lưu. */
  source?: string;
  /** Sprint 13.5 — Memory Ownership: chỉ moment đến từ memory_capsules mới xoá được. */
  deletable?: boolean;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Answers: "Portal có đang kể lại hành trình của tôi, không chỉ liệt kê dữ liệu?"
 */
export function MyStoryTimeline({ moments }: { moments: StoryMoment[] }) {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; text: string; tone: "ok" | "error" } | null>(null);

  const visibleMoments = moments.filter((m) => !hiddenIds.has(m.id));

  async function handleConfirmDelete(id: string) {
    setConfirmId(null);
    setDeletingId(id);
    const ok = await deleteMemoryCapsule(id);
    setDeletingId(null);
    if (ok) {
      setHiddenIds((prev) => new Set(prev).add(id));
      setFeedback({ id, text: "Đã gỡ ký ức này khỏi My Story của bạn.", tone: "ok" });
    } else {
      setFeedback({ id, text: "Hiện tại mình chưa thể xoá ký ức này. Bạn thử lại sau nhé.", tone: "error" });
    }
  }

  if (visibleMoments.length === 0) {
    return (
      <GemCard>
        <p className="text-sm text-white/65">
          Câu chuyện của bạn đang chờ những dòng đầu tiên. Một khoảnh khắc nhỏ hôm nay có thể trở thành viên ngọc đáng
          nhớ ngày mai.
        </p>
      </GemCard>
    );
  }

  return (
    <div className="space-y-3">
      {visibleMoments.map((m) => (
        <GemCard key={m.id} className="relative flex items-start gap-3">
          <span className="text-lg leading-none">{m.emoji}</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-sm font-bold text-white">{m.title}</h3>
              <span className="text-xs text-white/40">{formatDate(m.date)}</span>
              {m.source && (
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/35">
                  {m.source}
                </span>
              )}
            </div>
            {m.description && <p className="mt-1 text-sm text-white/65">{m.description}</p>}
            {feedback?.id === m.id && (
              <p className={`mt-2 text-xs ${feedback.tone === "ok" ? "text-white/50" : "text-red-300/80"}`}>
                {feedback.text}
              </p>
            )}
          </div>

          {m.deletable && (
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label="Tuỳ chọn cho ký ức này"
                onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                disabled={deletingId === m.id}
                className="rounded-full p-1.5 text-white/35 transition hover:bg-white/10 hover:text-white/70 disabled:opacity-50"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {openMenuId === m.id && (
                <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-xl border border-white/10 bg-[#0B1220] p-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      setConfirmId(m.id);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    Xoá khỏi My Story
                  </button>
                </div>
              )}
            </div>
          )}
        </GemCard>
      ))}

      {confirmId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
          <div className="glass-dark w-full max-w-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-base font-bold text-white">Bạn muốn xoá ký ức này?</h3>
            <p className="mt-2 text-sm text-white/65">
              Ký ức này sẽ được gỡ khỏi My Story của bạn. Bạn không cần giữ lại điều gì nếu nó không còn phù hợp với
              hành trình hiện tại.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/5"
              >
                Giữ lại
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(confirmId)}
                className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Xoá ký ức này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
