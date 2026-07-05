"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CollectionHeader } from "../components/CollectionHeader";
import { LearningPath } from "../components/LearningPath";
import { CompanionSuggestion } from "../components/CompanionSuggestion";
import { CollectionCompleteBanner } from "../components/CollectionCompleteBanner";
import { CollectionRelationship } from "../components/CollectionRelationship";
import {
  computeCollectionProgress,
  getSeedsWithStatus,
  getNextSeedToLearn,
  getCollectionCompanionGuidance,
  getSuggestedNextCollection,
} from "../services/knowledge-collection.service";
import { getRelatedCollectionObjects } from "../services/knowledge-graph.service";
import { getSeedCompletedStepIds } from "../utils/use-seed-progress";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

export function KnowledgeCollectionView({ collection }: { collection: KnowledgeCollection }) {
  const progress = computeCollectionProgress(collection, getSeedCompletedStepIds);
  const seedsWithStatus = getSeedsWithStatus(collection, getSeedCompletedStepIds);
  const nextSeed = getNextSeedToLearn(collection, getSeedCompletedStepIds);
  const guidance = getCollectionCompanionGuidance(collection, getSeedCompletedStepIds);
  const suggestedNext = getSuggestedNextCollection(collection, getSeedCompletedStepIds);
  const relatedCollections = getRelatedCollectionObjects(collection);

  return (
    <div className="space-y-6">
      <Link
        href="/portal/hetrithucai"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại Thư viện tri thức
      </Link>

      <CollectionHeader collection={collection} progress={progress} nextSeed={nextSeed} />

      {progress.percent >= 100 ? (
        <CollectionCompleteBanner collection={collection} suggestedNext={suggestedNext} />
      ) : (
        guidance && <CompanionSuggestion message={guidance} />
      )}

      <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Learning Path</p>
        <LearningPath seedsWithStatus={seedsWithStatus} />
      </div>

      <CollectionRelationship related={relatedCollections} />
    </div>
  );
}
