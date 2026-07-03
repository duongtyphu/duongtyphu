"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";
import { useGrowthCheckpoint } from "../utils/use-growth-checkpoint";
import { useJourneyReady } from "../utils/use-journey-ready";

/**
 * Feature 05 — Growth Checkpoint. Không dùng điểm số — chỉ 2 câu hỏi tự
 * nhận thức, hiển thị sau khi Journey đạt giai đoạn GROWTH.
 */
export function GrowthCheckpoint({ journeySlug }: { journeySlug: string }) {
  const { answers, save } = useGrowthCheckpoint(journeySlug);
  const { ready, markReady } = useJourneyReady(journeySlug);
  const [noticedToday, setNoticedToday] = useState(answers.noticedToday);
  const [improvedSince, setImprovedSince] = useState(answers.improvedSince);

  function handleSave() {
    save({ noticedToday, improvedSince });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600">
        <Sprout className="h-3.5 w-3.5" />
        Growth Checkpoint
      </p>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">Hôm nay bạn nhận ra điều gì?</label>
        <textarea
          value={noticedToday}
          onChange={(e) => setNoticedToday(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-300"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">Điều gì bạn làm tốt hơn trước?</label>
        <textarea
          value={improvedSince}
          onChange={(e) => setImprovedSince(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-300"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={markReady}
          disabled={ready}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            ready
              ? "border-emerald-300 bg-emerald-100 text-emerald-700"
              : "border-gray-200 text-gray-600 hover:border-emerald-300"
          }`}
        >
          {ready ? "Đã sẵn sàng ✓" : "Tôi đã sẵn sàng"}
        </button>
      </div>
    </div>
  );
}
