"use client";

import { useState } from "react";

const defaultPrefs = [
  { id: "new_courses", icon: "🎓", title: "Khoá học mới", desc: "Nhận thông báo khi có khoá học hoặc sản phẩm mới ra mắt", on: true },
  { id: "weekly_tips", icon: "💡", title: "Tip & Thủ thuật hàng tuần", desc: "Email tổng hợp tips AI Affiliate mỗi thứ Hai", on: true },
  { id: "order_confirm", icon: "🔔", title: "Xác nhận đơn hàng", desc: "Thông báo khi admin xác nhận thanh toán của bạn", on: true },
  { id: "community", icon: "📢", title: "Cộng đồng & Sự kiện", desc: "Thông báo về webinar, live session và sự kiện cộng đồng", on: false },
  { id: "milestones", icon: "🏆", title: "Thành tích & Milestone", desc: "Chúc mừng khi bạn đạt các mốc học tập quan trọng", on: true },
];

export function NotificationSettingsPanel() {
  const [prefs, setPrefs] = useState(defaultPrefs);

  function toggle(id: string) {
    setPrefs((p) => p.map((item) => (item.id === id ? { ...item, on: !item.on } : item)));
  }

  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-sm font-bold text-white">Cài đặt thông báo</h3>
      <p className="mt-1 text-xs text-white/60">Chọn những thông báo bạn muốn nhận</p>
      <div className="mt-4 space-y-2">
        {prefs.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-sm font-semibold text-white">{p.icon} {p.title}</p>
              <p className="mt-0.5 text-xs text-white/60">{p.desc}</p>
            </div>
            <button
              onClick={() => toggle(p.id)}
              aria-pressed={p.on}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${p.on ? "bg-brand-blue" : "bg-white/15"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${p.on ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
