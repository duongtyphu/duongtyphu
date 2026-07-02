"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { JourneyProgress } from "../components/JourneyProgress";
import { SeedStepList } from "../components/SeedStepList";
import { CompanionSuggestion } from "../components/CompanionSuggestion";
import { OneNextStepCard } from "../components/OneNextStepCard";
import { useSeedProgress } from "../utils/use-seed-progress";
import {
  computeSeedProgress,
  getCompanionSuggestion,
  getOneNextStep,
} from "../services/knowledge-seed.service";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

export function KnowledgeWorkspace({ seed }: { seed: KnowledgeSeed }) {
  const { completedStepIds, toggleStep } = useSeedProgress(seed.id);
  const progress = computeSeedProgress(seed, completedStepIds);
  const suggestion = getCompanionSuggestion(seed, completedStepIds);
  const oneNextStep = getOneNextStep(seed, completedStepIds);

  return (
    <div className="space-y-6">
      <Link
        href="/portal/library"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại Thư viện tri thức
      </Link>

      <WorkspaceHeader seed={seed} />
      <JourneyProgress progress={progress} />
      <CompanionSuggestion message={suggestion} />

      {oneNextStep && (
        <OneNextStepCard step={oneNextStep.step} asset={oneNextStep.asset} onComplete={toggleStep} />
      )}

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Hành trình</p>
        <SeedStepList steps={seed.steps} completedStepIds={completedStepIds} onToggle={toggleStep} />
      </div>
    </div>
  );
}
