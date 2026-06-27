"use client";

import { useState } from "react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { ConnectModuleGrid } from "@/components/portal/connect/ConnectModuleGrid";
import type { ConnectModule } from "@/data/portal/connect-os";

type ConnectTab = {
  key: string;
  label: string;
  subtitle: string;
  modules: ConnectModule[];
};

/**
 * Answers: "Trong nhóm kết nối cụ thể nào (cộng đồng/sự kiện/thành tựu/cơ hội/đóng góp), tôi nên bắt đầu từ đâu?"
 */
export function ConnectEngineTabs({ tabs }: { tabs: ConnectTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <GemCard>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              t.key === current.key
                ? "gemos-btn-primary text-white"
                : "gemos-btn-secondary text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-sm text-white/55">{current.subtitle}</p>
        <div className="mt-4">
          <ConnectModuleGrid modules={current.modules} />
        </div>
      </div>
    </GemCard>
  );
}
