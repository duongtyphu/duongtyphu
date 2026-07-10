"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import {
  JOURNEY_CHAPTER_NAMES,
  getCurrentChapterFromClient,
  type JourneyChapter,
} from "@/lib/portal/foundation/journey-chapter";

/**
 * Journey P1 — "Chương hiện tại" trên Journey Hub.
 *
 * Logic xác định chương (P1/P3 subset của Journey Map engine đầy đủ —
 * Phase P6, xem JOURNEY_PLATFORM_ARCHITECTURE.md mục 8) SỐNG Ở
 * `lib/portal/foundation/journey-chapter.ts` — dùng chung với Opening
 * Page của My Story (P3) để hai cửa không bao giờ nói lệch nhau về
 * chương người dùng đang ở. KHÔNG %. KHÔNG level. Không có dữ liệu thật
 * → nói thật là chưa có chương nào được viết, không vẽ chương giả.
 */

export function CurrentChapterCard({ premiumCount = 0 }: { premiumCount?: number }) {
  const [chapter, setChapter] = useState<JourneyChapter | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setChapter(getCurrentChapterFromClient(premiumCount));
  }, [premiumCount]);

  if (chapter === undefined) return null;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-token-sm md:p-7">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
        Chương hiện tại
      </div>

      {/* Dải 5 chương — chỉ 3 trạng thái (chưa viết / đang viết / đã đi
       * qua), không thanh %: chương trước chương hiện tại coi là đã đi
       * qua, chương sau còn mờ "chưa viết". */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {JOURNEY_CHAPTER_NAMES.map((name, i) => {
          const chapterNo = i + 1;
          const current = chapter !== null && chapterNo === chapter.index;
          const passed = chapter !== null && chapterNo < chapter.index;
          return (
            <span
              key={name}
              title={`Chương ${chapterNo} — ${name}`}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                current
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : passed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-50 text-gray-400"
              }`}
            >
              {current ? `Chương ${chapterNo} · đang viết` : passed ? `Chương ${chapterNo} · đã đi qua` : `Chương ${chapterNo}`}
            </span>
          );
        })}
      </div>

      {chapter !== null ? (
        <>
          <h2 className="mt-4 text-lg font-extrabold text-gray-900">
            Chương {chapter.index} — {chapter.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{chapter.evidence}</p>
        </>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          Chương đầu tiên của bạn chưa được viết — nó bắt đầu từ hoạt động thật đầu tiên,
          không phải từ một con số. Khi bạn học hoặc làm việc thật trong Portal, chương sẽ tự mở.
        </p>
      )}
    </section>
  );
}
