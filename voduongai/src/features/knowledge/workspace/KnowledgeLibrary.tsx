"use client";

/**
 * CKOS — EC-001: Knowledge Foundation
 * UI tạm thời cho Thư viện tri thức: danh sách Knowledge Asset + filter
 * theo type/persona/goal. Không animation, không redesign toàn bộ —
 * chỉ đủ để đọc/lọc dữ liệu CKOS.
 */

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { getPublishedKnowledgeAssets } from "../services/knowledge.service";
import { KNOWLEDGE_TYPE_LABELS, KNOWLEDGE_PERSONAS, KNOWLEDGE_GOALS } from "../utils/knowledge-labels";
import type { KnowledgeAsset, KnowledgeType } from "../types/knowledge.types";

const ALL = "Tất cả";

export function KnowledgeLibrary() {
  const assets = useMemo(() => getPublishedKnowledgeAssets(), []);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<KnowledgeType | typeof ALL>(ALL);
  const [persona, setPersona] = useState<string>(ALL);
  const [goal, setGoal] = useState<string>(ALL);

  const typeOptions = useMemo(
    () => Array.from(new Set(assets.map((a) => a.type))),
    [assets]
  );

  const filtered = assets.filter((asset) => {
    if (type !== ALL && asset.type !== type) return false;
    if (persona !== ALL && !asset.dna.persona.includes(persona)) return false;
    if (goal !== ALL && !asset.dna.goal.includes(goal)) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      if (!asset.title.toLowerCase().includes(q) && !asset.summary.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Thư viện tri thức</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Hạt giống tri thức</h1>
        <p className="max-w-2xl text-gray-500">
          Mỗi tri thức ở đây đều có mục tiêu, đối tượng phù hợp, giá trị học tập và một bước
          hành động cụ thể — không chỉ để đọc, mà để bạn áp dụng ngay vào công việc.
        </p>
      </div>

      <CompanionGuide
        message="Nếu chưa biết bắt đầu từ đâu, hãy lọc theo mục tiêu bạn đang cần nhất ngay bây giờ."
        action={{ label: "Xem lộ trình học", href: "/portal/journey" }}
      />

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề hoặc mô tả..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-300"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <FilterSelect
            label="Loại tri thức"
            value={type}
            onChange={(v) => setType(v as KnowledgeType | typeof ALL)}
            options={[ALL, ...typeOptions]}
            renderLabel={(v) => (v === ALL ? ALL : KNOWLEDGE_TYPE_LABELS[v as KnowledgeType])}
          />
          <FilterSelect
            label="Phù hợp với"
            value={persona}
            onChange={setPersona}
            options={[ALL, ...KNOWLEDGE_PERSONAS]}
          />
          <FilterSelect label="Mục tiêu" value={goal} onChange={setGoal} options={[ALL, ...KNOWLEDGE_GOALS]} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {filtered.length} tri thức
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
            Không tìm thấy tri thức phù hợp với bộ lọc này.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((asset) => (
              <KnowledgeAssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  renderLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  renderLabel?: (v: string) => string;
}) {
  return (
    <label className="block text-xs font-semibold text-gray-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-300"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {renderLabel ? renderLabel(opt) : opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function KnowledgeAssetCard({ asset }: { asset: KnowledgeAsset }) {
  return (
    <div className="gemos-gem-card block rounded-2xl p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
          {KNOWLEDGE_TYPE_LABELS[asset.type]}
        </span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
          {asset.dna.difficulty}
        </span>
        <span className="text-[10px] text-gray-400">{asset.dna.estimatedTime}</span>
      </div>
      <h3 className="gemos-card-title mb-2 text-sm font-bold leading-snug text-gray-900">{asset.title}</h3>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">{asset.summary}</p>
      <p className="text-xs font-semibold text-emerald-600">Bước tiếp theo: {asset.growth.nextStep}</p>
    </div>
  );
}
