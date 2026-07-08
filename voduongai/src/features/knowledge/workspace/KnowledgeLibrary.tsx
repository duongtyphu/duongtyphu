"use client";

/**
 * CKOS — Knowledge Workspace Foundation
 * Thư viện tri thức bắt đầu bằng Companion Discovery, không phải Search.
 * Chọn mục tiêu -> thấy Knowledge Seed phù hợp. Bên dưới là Collection
 * System (duyệt theo chủ đề lớn) và Asset Explorer (lọc tri thức lẻ) —
 * cả hai đều là công cụ phụ, không phải trải nghiệm chính.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, BookOpen, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { CompanionDiscovery } from "../components/CompanionDiscovery";
import { KnowledgeSeedCard } from "../components/KnowledgeSeedCard";
import { CollectionCard } from "../components/CollectionCard";
import { ContinueLearningBanner } from "../components/ContinueLearningBanner";
import { getPublishedKnowledgeAssets } from "../services/knowledge.service";
import { getAllKnowledgeSeeds, getKnowledgeSeedsByGoal, searchKnowledgeSeeds } from "../services/knowledge-seed.service";
import { getAllKnowledgeCollections } from "../services/knowledge-collection.service";
import { DISCOVERY_GOAL_TO_SEED_GOAL } from "../data/discovery-goals";
import { KNOWLEDGE_TYPE_LABELS, KNOWLEDGE_PERSONAS, KNOWLEDGE_GOALS } from "../utils/knowledge-labels";
import type { KnowledgeAsset, KnowledgeType } from "../types/knowledge.types";

const ALL = "Tất cả";

export function KnowledgeLibrary() {
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [unifiedQuery, setUnifiedQuery] = useState("");
  const allSeeds = useMemo(() => getAllKnowledgeSeeds(), []);
  const allCollections = useMemo(() => getAllKnowledgeCollections(), []);
  const allAssets = useMemo(() => getPublishedKnowledgeAssets(), []);

  const seedGoal = activeGoalId ? DISCOVERY_GOAL_TO_SEED_GOAL[activeGoalId] : null;
  const relevantSeeds = seedGoal ? getKnowledgeSeedsByGoal(seedGoal) : allSeeds;

  const q = unifiedQuery.trim().toLowerCase();
  const searching = q.length > 0;
  const matchedCollections = searching ? allCollections.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : [];
  const matchedSeeds = searching ? searchKnowledgeSeeds(q) : [];
  const matchedAssets = searching
    ? allAssets.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.dna.aiTools.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  return (
    <div className="space-y-8">
      {/* Gộp trang — Thư viện AI giờ là mục con của Hệ tri thức AI (CKOS),
       * không phải một trang ngang hàng riêng biệt nữa. Luôn có đường về
       * trang mẹ ngay đầu trang để mối liên kết mẹ-con luôn rõ ràng. */}
      <Link
        href="/portal/ckos"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Hệ tri thức AI (CKOS)
      </Link>

      <PageHeader
        icon={BookOpen}
        tone="violet"
        title="Thư viện AI"
        titleGradient
        subtitle="Một mục con của Hệ tri thức AI (CKOS) — nơi tri thức được xếp lên kệ theo từng chủ đề, có thứ tự đọc rõ ràng như một cuốn sách thật."
      />

      <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Companion trong thư viện</p>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
          Chưa biết nên đọc cuốn nào? Chọn một mục tiêu bên dưới — Companion sẽ chỉ đúng &ldquo;cuốn
          sách&rdquo; (Lesson) phù hợp nhất với việc bạn đang làm, thay vì để bạn tự lục qua cả kệ.
        </p>
      </div>

      <ContinueLearningBanner />

      <CompanionDiscovery activeGoalId={activeGoalId} onSelectGoal={setActiveGoalId} />

      {/* Search — theo Collection, Seed, Keyword, Prompt, AI Tool */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={unifiedQuery}
          onChange={(e) => setUnifiedQuery(e.target.value)}
          placeholder="Tìm theo Collection, Seed, từ khoá, Prompt hoặc công cụ AI..."
          className="w-full rounded-xl border border-gray-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm text-gray-700 shadow-sm outline-none backdrop-blur-sm focus:border-blue-300"
        />
      </div>

      {searching ? (
        <SearchResults collections={matchedCollections} seeds={matchedSeeds} assets={matchedAssets} />
      ) : (
        <>
          <div className="space-y-3">
            <SectionHeader
              eyebrow="CKOS · Knowledge"
              title={activeGoalId ? "Hành trình phù hợp với bạn" : "Tất cả hành trình tri thức"}
            />
            {relevantSeeds.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-8 text-center text-sm text-gray-400 backdrop-blur-sm">
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

          <div className="space-y-3">
            <SectionHeader eyebrow="📚 Kệ sách" title="Bộ sưu tập theo chủ đề" />
            <div className="rounded-2xl border-t-4 border-amber-200 bg-gradient-to-b from-amber-50/60 to-transparent p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          </div>

          <AssetExplorer />
        </>
      )}
    </div>
  );
}

function SearchResults({
  collections,
  seeds,
  assets,
}: {
  collections: ReturnType<typeof getAllKnowledgeCollections>;
  seeds: ReturnType<typeof getAllKnowledgeSeeds>;
  assets: KnowledgeAsset[];
}) {
  const nothingFound = collections.length === 0 && seeds.length === 0 && assets.length === 0;

  if (nothingFound) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-12 text-center text-sm text-gray-400 backdrop-blur-sm">
        Không tìm thấy kết quả phù hợp.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {collections.length > 0 && (
        <div className="space-y-3">
          <SectionHeader title="Collection" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        </div>
      )}
      {seeds.length > 0 && (
        <div className="space-y-3">
          <SectionHeader title="Knowledge Seed" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seeds.map((seed) => (
              <KnowledgeSeedCard key={seed.id} seed={seed} />
            ))}
          </div>
        </div>
      )}
      {assets.length > 0 && (
        <div className="space-y-3">
          <SectionHeader title="Tri thức lẻ" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <KnowledgeAssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      )}
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
      <SectionHeader title="Tìm tri thức lẻ theo bộ lọc" />

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Lọc theo tiêu đề/mô tả tri thức lẻ..."
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
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-12 text-center text-sm text-gray-400 backdrop-blur-sm">
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
    <GemCard>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <GemBadge tone="free">{KNOWLEDGE_TYPE_LABELS[asset.type]}</GemBadge>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
          {asset.dna.difficulty}
        </span>
        <span className="text-[10px] text-gray-400">{asset.dna.estimatedTime}</span>
      </div>
      <h3 className="gemos-card-title mb-2 text-sm font-bold leading-snug text-gray-900">{asset.title}</h3>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">{asset.summary}</p>
      <p className="text-xs font-semibold text-emerald-600">Bước tiếp theo: {asset.growth.nextStep}</p>
    </GemCard>
  );
}
