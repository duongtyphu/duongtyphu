"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { getGardenSummary, getRecentActivity } from "@/lib/portal/foundation/growth-view";

/**
 * Journey P1 — "Chương hiện tại" trên Journey Hub.
 *
 * Phiên bản P1 của Journey Map engine (engine đầy đủ là Phase P2 — xem
 * JOURNEY_PLATFORM_ARCHITECTURE.md mục 8): xác định chương ĐANG VIẾT từ
 * bằng chứng thật trong growth-view (localStorage — cùng nguồn với
 * Nhật ký/Khu vườn), theo đúng bảng bằng chứng của kiến trúc:
 *   Chương 1 — hoạt động thật đầu tiên tồn tại
 *   Chương 2 — có phiên làm việc/journey thật đã chạm tới
 *   Chương 3 — có output thật đầu tiên
 * (Chương 4-5 cần tín hiệu mà P1 chưa suy ra được một cách trung thực —
 * để engine P2 quyết định, không đoán.)
 *
 * KHÔNG %. KHÔNG level. Không có dữ liệu thật → nói thật là chưa có
 * chương nào được viết, không vẽ chương giả.
 */

const CHAPTERS = [
  "Bắt đầu làm quen với AI",
  "Biết sử dụng AI",
  "Tạo ra Output đầu tiên",
  "Xây hệ thống",
  "Giúp người khác",
] as const;

type ChapterState =
  | { kind: "chapter"; index: number; name: string; evidence: string }
  | { kind: "empty" };

export function CurrentChapterCard() {
  const [state, setState] = useState<ChapterState | null>(null);

  useEffect(() => {
    const summary = getGardenSummary();
    const hasAnyActivity = getRecentActivity(1).length > 0;
    let next: ChapterState;
    if (summary.totalOutputs >= 1) {
      next = {
        kind: "chapter",
        index: 3,
        name: CHAPTERS[2],
        evidence: `${summary.totalOutputs} output thật đã được tạo ra trong Workspace.`,
      };
    } else if (summary.missionsCompleted >= 1 || summary.journeysTouched >= 1) {
      next = {
        kind: "chapter",
        index: 2,
        name: CHAPTERS[1],
        evidence:
          summary.missionsCompleted >= 1
            ? `${summary.missionsCompleted} phiên làm việc thật đã hoàn thành.`
            : `${summary.journeysTouched} hành trình học đã được bạn chạm tới.`,
      };
    } else if (hasAnyActivity) {
      next = {
        kind: "chapter",
        index: 1,
        name: CHAPTERS[0],
        evidence: "Hoạt động thật đầu tiên của bạn đã được ghi nhận.",
      };
    } else {
      next = { kind: "empty" };
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setState(next);
  }, []);

  if (state === null) return null;

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
        {CHAPTERS.map((name, i) => {
          const chapterNo = i + 1;
          const current = state.kind === "chapter" && chapterNo === state.index;
          const passed = state.kind === "chapter" && chapterNo < state.index;
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

      {state.kind === "chapter" ? (
        <>
          <h2 className="mt-4 text-lg font-extrabold text-gray-900">
            Chương {state.index} — {state.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{state.evidence}</p>
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
