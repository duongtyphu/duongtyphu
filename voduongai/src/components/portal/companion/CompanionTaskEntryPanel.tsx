"use client";

/**
 * Companion Task Entry (Sprint 04 patch) — nội dung mặc định của Quick Panel
 * khi CHƯA có Work Session nào đang chạy. Đây là nơi người dùng thật sự
 * "giao việc" cho Companion khi bấm vào Companion orb — không phải chỉ xem
 * gợi ý nudge như trước.
 *
 * Quick Mission chỉ điền sẵn vào ô nhập — không phải danh sách Agent, người
 * dùng vẫn có thể sửa lại trước khi giao việc.
 */

import { useId, useState } from "react";
import type { PortalModule } from "@/companion/agents/agent.types";
import { getQuickMissions } from "@/companion/agents/quick-missions";
import { pushCompanionIntent } from "@/lib/portal/companion/orchestrator-intent";

export function CompanionTaskEntryPanel({ module }: { module: PortalModule | null }) {
  const [value, setValue] = useState("");
  const inputId = useId();
  const quickMissions = getQuickMissions(module);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const goal = value.trim();
    if (!goal) return;
    pushCompanionIntent({ module: module ?? "khong-gian-ai", userGoal: goal });
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-xs leading-snug text-gray-600">
        Hôm nay mình có thể đồng hành cùng bạn ở việc gì?
      </p>

      <label htmlFor={inputId} className="sr-only">
        Mục tiêu bạn muốn giao cho Companion
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="VD: tạo landing page, viết bài blog, phân tích dự án, tạo banner..."
        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-2 flex flex-wrap gap-1.5">
        {quickMissions.map((mission) => (
          <button
            key={mission}
            type="button"
            onClick={() => setValue(mission)}
            className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
          >
            {mission}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={!value.trim()}
        className="mt-3 w-full rounded-lg gradient-surface px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Giao việc cho Companion
      </button>
    </form>
  );
}
