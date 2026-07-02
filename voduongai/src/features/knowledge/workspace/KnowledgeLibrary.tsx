"use client";

/**
 * CKOS — Sprint 02: The Knowledge Journey™
 * Thư viện tri thức bắt đầu bằng Companion Discovery, không phải Search.
 * Chọn mục tiêu -> thấy Knowledge Seed phù hợp. Search/filter Asset rời
 * rạc (Sprint 01) vẫn còn, nhưng đưa xuống dưới, là công cụ phụ.
 */

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CompanionDiscovery } from "../components/CompanionDiscovery";
import { KnowledgeSeedCard } from "../components/KnowledgeSeedCard";
import { getPublishedKnowledgeAssets } from "../services/knowledge.service";
import { getAllKnowledgeSeeds, getKnowledgeSeedsByGoal } from "../services/knowledge-seed.service";
import { DISCOVERY_GOAL_TO_SEED_GOAL } from "../data/discovery-goals";
import { KNOWLEDGE_TYPE_LABELS, KNOWLEDGE_PERSONAS, KNOWLEDGE_GOALS } from "../utils/knowledge-labels";
import type { KnowledgeAsset, KnowledgeType } from "../types/knowledge.types";

const ALL = "Tất cả";

export function KnowledgeLibrary() {
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const allSeeds = useMemo(() => getAllKnowledgeSeeds(), []);

  const seedGoal = activeGoalId ? DISCOVERY_GOAL_TO_SEED_GOAL[activeGoalId] : null;
  const relevantSeeds = seedGoal ? getKnowledgeSeedsByGoal(seedGoal) : allSeeds;

  return (
    <div className="space-y-8">
      <CompanionDiscovery activeGoalId={activeGoalId} onSelectGoal={setActiveGoalId} />

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {activeGoalId ? "Hành trình phù hợp với bạn" : "Tất cả hành trình tri thức"}
        </p>
        {relevantSeeds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            Chưa có hành trình phù hợp — mình sẽ chuẩn bị thêm sớm. Xem tất cả hành trình bên dưới nhé.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relevantSeeds.map((seed) => (
              <KnowledgeSeedCard key={seed.id} seed={seed} />
            ))}
          </div>
        )}
      </div>

      <AssetExplorer />
    </div>
  );
}

function AssetExplorer() {
  const assets = useMemo(() => getPublishedKnowledgeAssets(), []);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<KnowledgeType | typeof ALL>(ALL);
  const [persona, setPersona] = useState<string>(ALL);
  const [goal, setGoal] = useState<string>(ALL);

  const typeOptions = useMemo(() => Array.from(new Set(assets.map((a) => a.type))), [assets]);

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
    <div className="space-y-4 border-t border-gray-100 pt-8">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Tìm tri thức lẻ theo bộ lọc</p>

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hôm nay Companion có thể giúp bạn điều gì?"
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

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{filtered.length} tri thức</p>
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
