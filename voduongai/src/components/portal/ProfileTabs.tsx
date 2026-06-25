"use client";

import { useState, type ReactNode } from "react";

type Tab = { key: string; label: string; icon: string; content: ReactNode };

export function ProfileTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`shrink-0 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              active === t.key
                ? "border-b-2 border-brand-blue text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="mt-5">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}
