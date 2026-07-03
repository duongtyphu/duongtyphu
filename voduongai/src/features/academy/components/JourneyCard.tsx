"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JourneyTimeline } from "./JourneyTimeline";
import { CompanionGuidance } from "./CompanionGuidance";
import { GrowthCheckpoint } from "./GrowthCheckpoint";
import { computeJourneyStatus, getCompanionJourneyGuidance } from "../services/journey.service";
import { JOURNEY_STAGE_LABELS, JourneyStage } from "../types/journey.types";
import type { LearningJourney } from "../types/journey.types";

/**
 * Feature 03 — Journey Card. KHÔNG hiển thị Progress Bar kiểu LMS — chỉ
 * hiển thị: Tên Journey, Mục tiêu, đang ở bước nào, nên làm gì tiếp theo.
 */
export function JourneyCard({ journey }: { journey: LearningJourney }) {
  const status = computeJourneyStatus(journey);
  const guidance = getCompanionJourneyGuidance(journey, status);

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {JOURNEY_STAGE_LABELS[status.stage]}
        </p>
        <h3 className="mt-1 text-lg font-extrabold text-gray-900">{journey.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{journey.goal}</p>
      </div>

      <JourneyTimeline currentStage={status.stage} />

      <CompanionGuidance message={guidance} />

      {(status.stage === JourneyStage.GROWTH || status.stage === JourneyStage.READY) && (
        <GrowthCheckpoint journeySlug={journey.slug} />
      )}

      <Link
        href={`/portal/library/collection/${journey.collectionSlug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
      >
        Tiếp tục hành trình
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
