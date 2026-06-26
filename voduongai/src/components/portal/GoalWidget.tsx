"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const GOAL_STORAGE_KEY = "vdai_portal_goal";
const STORAGE_KEY = GOAL_STORAGE_KEY;

export const GOALS = [
  { id: "ai", label: "Học AI", href: "/portal/ai-academy", hint: "Bắt đầu với Học viện AI và Prompt thực chiến." },
  { id: "affiliate", label: "Làm Affiliate", href: "/portal/affiliate-hub", hint: "Vào Affiliate Hub để chọn ngách và sản phẩm phù hợp." },
  { id: "brand", label: "Xây thương hiệu cá nhân", href: "/portal/personal-brand", hint: "Lên kế hoạch nội dung và xây hình ảnh cá nhân." },
  { id: "product", label: "Tạo sản phẩm số", href: "/portal/premium", hint: "Khám phá Sản phẩm số để đóng gói kiến thức của bạn." },
  { id: "assets", label: "Đầu tư tài sản số", href: "/portal/digital-assets", hint: "Tìm hiểu DigiU, Blockchain, Crypto, Trading." },
] as const;

export function GoalWidget() {
  const [goalId, setGoalId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setGoalId(window.localStorage.getItem(STORAGE_KEY));
    setReady(true);
  }, []);

  function selectGoal(id: string) {
    window.localStorage.setItem(STORAGE_KEY, id);
    setGoalId(id);
  }

  if (!ready) return null;
  const active = GOALS.find((g) => g.id === goalId);

  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-sm font-bold text-white">Mục tiêu của tôi</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => selectGoal(g.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              g.id === goalId
                ? "bg-brand-blue text-white"
                : "border border-white/10 text-white/70 hover:border-brand-blue/50 hover:text-white"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-3 text-sm text-white/80">
          Dựa trên mục tiêu của bạn, hãy bắt đầu với{" "}
          <Link href={active.href} className="font-semibold text-brand-blue hover:underline">
            {active.label}
          </Link>
          . {active.hint}
        </div>
      )}
    </div>
  );
}
