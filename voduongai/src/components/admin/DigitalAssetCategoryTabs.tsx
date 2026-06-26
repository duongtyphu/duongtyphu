"use client";

import { useState } from "react";
import { digitalAssetCategories } from "@/data/digitalAssets";

export function DigitalAssetCategoryTabs({
  children,
}: {
  children: (categoryKey: string) => React.ReactNode;
}) {
  const sorted = [...digitalAssetCategories].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(sorted[0]?.key ?? "");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {sorted.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActive(c.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === c.key
                ? "bg-brand-blue text-white"
                : "border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>

      {children(active)}
    </div>
  );
}
