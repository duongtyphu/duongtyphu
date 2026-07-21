"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import { computeSeedProgress } from "../services/knowledge-seed.service";
import { learningStatusFromPercent } from "../services/knowledge-collection.service";
import { getSeedCompletedStepIds } from "../utils/use-seed-progress";
import { getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";

/**
 * Số đếm/progress được tính trực tiếp trên `knowledge_seeds` (Supabase, qua
 * getLiveKnowledgeSeeds()) — không còn dùng getSeedsInCollection/
 * computeCollectionProgress (knowledge-collection.service.ts), 2 hàm này vẫn
 * đọc thẳng mảng tĩnh knowledgeSeedJourneys nên không phản ánh đúng nếu
 * Founder sửa/thêm Lesson qua Admin. learningStatusFromPercent và
 * computeSeedProgress là hàm thuần (nhận seed làm tham số, không tự đọc mảng
 * tĩnh) nên tái dùng an toàn.
 */
export function CollectionCard({ collection }: { collection: KnowledgeCollection }) {
  const [liveSeeds, setLiveSeeds] = useState<KnowledgeSeed[]>([]);

  useEffect(() => {
    let cancelled = false;
    getLiveKnowledgeSeeds().then((seeds) => {
      if (!cancelled) setLiveSeeds(seeds);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const seeds = collection.seedSlugs
    .map((slug) => liveSeeds.find((s) => s.slug === slug))
    .filter((s): s is KnowledgeSeed => Boolean(s));

  const totalSeeds = seeds.length;
  const completedSeeds = seeds.filter((seed) => {
    const percent = computeSeedProgress(seed, getSeedCompletedStepIds(seed.id)).percent;
    return learningStatusFromPercent(percent) === "completed";
  }).length;
  const percent = totalSeeds === 0 ? 0 : Math.round((completedSeeds / totalSeeds) * 100);

  return (
    <Link
      href={`/portal/hetrithucai/collection/${collection.slug}`}
      className="block rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <Layers className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {totalSeeds} Knowledge Seed
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-bold text-gray-900">{collection.title}</h3>
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">{collection.description}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1.5 text-xs font-medium text-gray-400">
        {completedSeeds}/{totalSeeds} đã trưởng thành
      </p>
    </Link>
  );
}
