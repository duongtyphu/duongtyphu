"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useContinueLearning } from "../utils/use-continue-learning";
import { useSeedProgress } from "../utils/use-seed-progress";
import { computeSeedProgress, getNextIncompleteStep } from "../services/knowledge-seed.service";
import { getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

/** Feature 03 — Continue Learning: hiển thị ngay đầu trang nếu đang học dở, không bắt người dùng tìm lại.
 * Seed tra theo slug từ `knowledge_seeds` (Supabase) qua getLiveKnowledgeSeeds()
 * — không còn đọc knowledgeSeedJourneys tĩnh qua getKnowledgeSeedBySlug(). */
export function ContinueLearningBanner() {
  const entry = useContinueLearning();
  const [seed, setSeed] = useState<KnowledgeSeed | null>(null);

  useEffect(() => {
    // Không cần setSeed(null) khi !entry — render guard bên dưới
    // (`!entry || !seed`) đã tự ẩn banner ngay khi entry rỗng, kể cả khi
    // seed state cũ chưa kịp clear.
    if (!entry) return;
    let cancelled = false;
    getLiveKnowledgeSeeds().then((seeds) => {
      if (cancelled) return;
      setSeed(seeds.find((s) => s.slug === entry.seedSlug) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (!entry || !seed) return null;

  return <ContinueLearningBannerBody seed={seed} />;
}

function ContinueLearningBannerBody({ seed }: { seed: KnowledgeSeed }) {
  const { completedStepIds } = useSeedProgress(seed.id);

  const progress = computeSeedProgress(seed, completedStepIds);
  if (progress.percent >= 100 || progress.percent === 0) return null;

  const nextStep = getNextIncompleteStep(seed, completedStepIds);
  const remainingSteps = seed.steps.filter((s) => s.required && !completedStepIds.includes(s.id)).length;
  const estimatedMinutesLeft = remainingSteps * 4;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm backdrop-blur-sm">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-500">Tiếp tục hành trình</p>
        <p className="text-sm text-gray-600">
          Bạn đang học: <span className="font-bold text-gray-900">{seed.title}</span>
          {nextStep && <span> — {nextStep.title}</span>}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">Còn khoảng {estimatedMinutesLeft} phút</p>
      </div>
      <Link
        href={`/portal/hetrithucai/${seed.slug}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
      >
        <PlayCircle className="h-4 w-4" />
        Tiếp tục
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
