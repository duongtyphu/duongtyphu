"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CollectionHeader } from "../components/CollectionHeader";
import { SeedListItem } from "../components/SeedListItem";
import { getSeedsInCollection, computeCollectionProgress } from "../services/knowledge-collection.service";
import { getSeedCompletedStepIds } from "../utils/use-seed-progress";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

export function KnowledgeCollectionView({ collection }: { collection: KnowledgeCollection }) {
  const seeds = getSeedsInCollection(collection);
  const progress = computeCollectionProgress(collection, getSeedCompletedStepIds);

  return (
    <div className="space-y-6">
      <Link
        href="/portal/library"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại Thư viện tri thức
      </Link>

      <CollectionHeader collection={collection} progress={progress} />

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Knowledge Seed trong Collection</p>
        <div className="space-y-2">
          {seeds.map((seed, i) => (
            <SeedListItem key={seed.id} seed={seed} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
