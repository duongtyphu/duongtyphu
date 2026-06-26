"use client";

import { useEffect, useState } from "react";
import { useSavedItems } from "@/lib/portal/saved";

const GOAL_KEY = "vdai_portal_goal";

export function ProgressOverview({ purchasedCount }: { purchasedCount: number }) {
  const { items, ready: savedReady } = useSavedItems();
  const [hasGoal, setHasGoal] = useState(false);
  const [goalReady, setGoalReady] = useState(false);

  useEffect(() => {
    setHasGoal(Boolean(window.localStorage.getItem(GOAL_KEY)));
    setGoalReady(true);
  }, []);

  const stats = [
    { label: "Sản phẩm / khoá học đã mua", value: purchasedCount },
    { label: "Nội dung đã lưu", value: savedReady ? items.length : null },
    { label: "Mục tiêu đã chọn", value: goalReady ? (hasGoal ? 1 : 0) : null },
  ];

  return (
    <section>
      <h2 className="text-lg font-bold text-white">Tiến độ của tôi</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-2xl font-extrabold text-white">{s.value === null ? "–" : s.value}</p>
            <p className="mt-1 text-xs text-white/60">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-white/40">
        Theo dõi tiến độ học theo bài/chương đang được phát triển — số liệu trên dựa trên dữ liệu thật hiện có
        (đơn hàng đã xác nhận và nội dung bạn đã lưu).
      </p>
    </section>
  );
}
