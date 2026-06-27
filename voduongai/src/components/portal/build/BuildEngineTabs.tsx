"use client";

import { useState } from "react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { BuildModuleGrid } from "@/components/portal/build/BuildModuleGrid";
import type { BuildModule } from "@/data/portal/build-os";

type EngineTab = {
  key: string;
  label: string;
  subtitle: string;
  modules: BuildModule[];
};

/**
 * Answers: "Trong nhóm kiến tạo cụ thể nào (thu nhập/thương hiệu/hệ thống/premium), tôi nên bắt đầu từ module nào?"
 */
export function BuildEngineTabs({ tabs }: { tabs: EngineTab[] }) {
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
        <BuildModuleGrid subtitle={current.subtitle} modules={current.modules} />
      </div>
    </GemCard>
  );
}
