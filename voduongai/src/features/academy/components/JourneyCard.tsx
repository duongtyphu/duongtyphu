"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { JourneyTimeline } from "./JourneyTimeline";
import { CompanionGuidance } from "./CompanionGuidance";
import { GrowthCheckpoint } from "./GrowthCheckpoint";
import {
  computeJourneyStatus,
  getCompanionJourneyGuidance,
  getJourneyLearnerProfile,
  getSuggestedNextJourney,
} from "../services/journey.service";
import { JOURNEY_STAGE_LABELS, JourneyStage } from "../types/journey.types";
import type { LearningJourney } from "../types/journey.types";
import { getSeedCompletedStepIds, type KnowledgeCollection, type KnowledgeSeed } from "@/features/knowledge";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";
import { CompanionTaskEntry } from "@/components/portal/companion/CompanionTaskEntry";

/**
 * Feature 03 — Journey Card. KHÔNG hiển thị Progress Bar kiểu LMS — chỉ
 * hiển thị: Tên Journey, Mục tiêu, đang ở bước nào, nên làm gì tiếp theo.
 *
 * `collections`/`seeds` — dữ liệu CKOS LIVE (Supabase, lấy 1 lần ở
 * AcademyHubPage qua getLiveKnowledgeCollections()/getLiveKnowledgeSeeds()
 * rồi truyền xuống props, tránh mỗi JourneyCard tự fetch riêng) — thay cho
 * việc journey.service.ts tự đọc mảng tĩnh @deprecated như trước (VIỆC 3).
 */
export function JourneyCard({
  journey,
  collections,
  seeds,
}: {
  journey: LearningJourney;
  collections: KnowledgeCollection[];
  seeds: KnowledgeSeed[];
}) {
  const status = computeJourneyStatus(journey, collections, seeds, getSeedCompletedStepIds);
  const guidance = getCompanionJourneyGuidance(journey, status, collections, seeds, getSeedCompletedStepIds);
  const profile = getJourneyLearnerProfile(journey, collections, seeds, getSeedCompletedStepIds);
  const nextJourney = getSuggestedNextJourney(journey, collections, seeds, getSeedCompletedStepIds);
  const isDone = status.stage === JourneyStage.GROWTH || status.stage === JourneyStage.READY;
  const router = useRouter();

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {JOURNEY_STAGE_LABELS[status.stage]}
        </p>
        <h3 className="mt-1 text-lg font-extrabold text-gray-900">{journey.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{journey.goal}</p>
        {profile.persona.length > 0 && (
          <p className="mt-2 text-xs text-gray-400">
            Dành cho: <span className="font-semibold text-gray-600">{profile.persona.join(", ")}</span>
          </p>
        )}
      </div>

      {profile.prerequisiteGuidance && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {profile.prerequisiteGuidance}
        </p>
      )}

      {profile.whatYouWillGain.length > 0 && (
        <div className="rounded-lg bg-gray-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Bạn sẽ làm được gì</p>
          <ul className="mt-1.5 space-y-1 text-sm text-gray-600">
            {profile.whatYouWillGain.map((g) => (
              <li key={g}>• {g}</li>
            ))}
          </ul>
        </div>
      )}

      <JourneyTimeline currentStage={status.stage} />

      <CompanionGuidance message={guidance} />

      {profile.expectedOutput && !isDone && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Kết quả mong đợi</p>
          <p className="mt-1 text-sm text-blue-900">{profile.expectedOutput}</p>
        </div>
      )}

      {isDone && <GrowthCheckpoint journeySlug={journey.slug} />}

      {isDone && nextJourney && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Hành trình tiếp theo</p>
          <Link
            href={`/portal/hetrithucai/collection/${nextJourney.collectionSlug}`}
            className="mt-1 inline-block text-sm font-semibold text-emerald-800 hover:underline"
          >
            {nextJourney.title} →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/portal/hetrithucai/collection/${journey.collectionSlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
        >
          Xem tri thức CKOS liên quan
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Sprint 02 — Bắt đầu Nhiệm vụ: Companion nhận Context, Workspace mở. */}
        <button
          type="button"
          onClick={() =>
            router.push(
              startCompanionWorkspace({
                module: "academy",
                source: "academy-journey",
                itemId: journey.id,
                itemType: "learning_path",
                title: journey.title,
                userGoal: journey.title,
                expectedOutput: `${journey.goal} — có minh chứng thật khi hoàn thành.`,
              })
            )
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Bắt đầu Nhiệm vụ
        </button>
      </div>

      <CompanionTaskEntry
        module="academy"
        heading="Thực hành cùng Companion"
        placeholder={`VD: Mình muốn thực hành "${journey.title}" theo cách riêng của mình...`}
      />
    </div>
  );
}
