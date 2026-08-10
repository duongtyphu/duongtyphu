"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

/**
 * `.tabs-row` + `.tab-panel` — chuyển tab trong cùng một trang quản lý.
 *
 * Mockup ẩn/hiện panel bằng `display:none`, tức mọi panel đều nằm sẵn trong
 * DOM. Ở đây chỉ render panel đang mở: cây DOM nhẹ hơn và form của tab ẩn
 * không lọt vào tab order của bàn phím.
 */
export function TabsRow({ tabs, initialTabId }: { tabs: Tab[]; initialTabId?: string }) {
  const [activeId, setActiveId] = useState(initialTabId ?? tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <>
      <div
        role="tablist"
        className="flex gap-[6px] self-start rounded-xl border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[6px]"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`v2tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`v2panel-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={[
                "rounded-[9px] px-4 py-[9px] text-[13px] font-bold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-[var(--v2-violet)] text-white"
                  : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {active ? (
        <div
          role="tabpanel"
          id={`v2panel-${active.id}`}
          aria-labelledby={`v2tab-${active.id}`}
          className="flex flex-col gap-[18px]"
        >
          {active.content}
        </div>
      ) : null}
    </>
  );
}
