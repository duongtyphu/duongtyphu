"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ListX, ListChecks, Dumbbell, Clock } from "lucide-react";
import { LearningHero } from "../components/LearningHero";
import { LearningOutcome } from "../components/LearningOutcome";
import { WhyThisMatters } from "../components/WhyThisMatters";
import { ContentSection } from "../components/ContentSection";
import { StepByStepGuide } from "../components/StepByStepGuide";
import { PromptExperience } from "../components/PromptExperience";
import { PromptPack } from "../components/PromptPack";
import { DownloadPrepCard } from "../components/DownloadPrepCard";
import { RealExample } from "../components/RealExample";
import { ActionChecklist } from "../components/ActionChecklist";
import { JourneyProgress } from "../components/JourneyProgress";
import { SeedStepList } from "../components/SeedStepList";
import { CompanionSuggestion } from "../components/CompanionSuggestion";
import { CompanionNoteBlock } from "../components/CompanionNoteBlock";
import { NextActionCard } from "../components/NextActionCard";
import { CompletionExperience } from "../components/CompletionExperience";
import { OneNextStepCard } from "../components/OneNextStepCard";
import { SeedNavigation } from "../components/SeedNavigation";
import { RelatedKnowledge } from "../components/RelatedKnowledge";
import { KnowledgeGraphPanel, KnowledgeDependency } from "../components/KnowledgeGraphPanel";
import { BookmarkButton } from "../components/BookmarkButton";
import { ReflectionBox } from "../components/ReflectionBox";
import { KnowledgeMap } from "../components/KnowledgeMap";
import { TableOfContents } from "../components/TableOfContents";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { SectionNav } from "../components/SectionNav";
import { useSeedProgress, getSeedCompletedStepIds } from "../utils/use-seed-progress";
import { recordSeedVisit } from "../utils/use-continue-learning";
import { splitBeforeAfter } from "../utils/split-before-after";
import {
  computeSeedProgress,
  getCompanionSuggestion,
  getOneNextStep,
  getAdjacentSeeds,
  getRelatedSeedObjects,
  getPrerequisiteGuidance,
  getAllKnowledgeSeeds,
} from "../services/knowledge-seed.service";
import { getKnowledgeCollectionBySlug, computeCollectionProgress } from "../services/knowledge-collection.service";
import { getKnowledgeGraphView, getPrerequisiteSeeds, getDependentSeeds } from "../services/knowledge-graph.service";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import { pushCompanionIntent } from "@/lib/portal/companion/orchestrator-intent";

function estimateReadingMinutes(seed: KnowledgeSeed): number {
  const text = [
    seed.problem,
    seed.coreIdea,
    seed.guide,
    seed.example,
    seed.exercise,
    ...seed.whatYouWillGain,
    ...seed.commonMistakes,
    ...seed.checklist,
  ].join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 180));
}

export function KnowledgeWorkspace({ seed }: { seed: KnowledgeSeed }) {
  const { completedStepIds, toggleStep } = useSeedProgress(seed.id);
  const progress = computeSeedProgress(seed, completedStepIds);
  const stepSuggestion = getCompanionSuggestion(seed, completedStepIds);
  const prerequisiteGuidance = getPrerequisiteGuidance(seed, getSeedCompletedStepIds);
  const oneNextStep = getOneNextStep(seed, completedStepIds);
  const { previous, next } = getAdjacentSeeds(seed);
  const related = getRelatedSeedObjects(seed);
  const collection = getKnowledgeCollectionBySlug(seed.collectionSlug);
  const collectionProgress = collection ? computeCollectionProgress(collection, getSeedCompletedStepIds) : null;
  const readingMinutes = estimateReadingMinutes(seed);
  const beforeAfter = splitBeforeAfter(seed.example);
  const isComplete = progress.percent >= 100;
  const graphView = getKnowledgeGraphView(seed);
  const prerequisiteSeeds = getPrerequisiteSeeds(seed);
  const dependentSeeds = getDependentSeeds(seed, getAllKnowledgeSeeds());

  useEffect(() => {
    recordSeedVisit(seed.id, seed.slug, seed.title);
  }, [seed.id, seed.slug, seed.title]);

  return (
    <div className="space-y-6">
      <Link
        href="/portal/library"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại Thư viện tri thức
      </Link>

      {/* Feature 04 — Knowledge Map (Learning Engine, không sửa) */}
      <KnowledgeMap collection={collection} seed={seed} next={next} isLastSeed={!next} />

      <ReadingProgressBar />

      <div className="flex gap-6">
        <div className="min-w-0 flex-1 space-y-6">
          {/* Feature 01 — Learning Hero */}
          <LearningHero
            seed={seed}
            collection={collection}
            collectionProgressLabel={
              collectionProgress ? `${collectionProgress.completedSeeds}/${collectionProgress.totalSeeds} Seed trong Collection` : null
            }
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BookmarkButton seedId={seed.id} />
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              Thời gian đọc ước tính: {readingMinutes} phút
            </span>
          </div>

          {/* Learning Engine — giữ nguyên, không sửa */}
          <JourneyProgress progress={progress} />
          <CompanionSuggestion message={prerequisiteGuidance ?? stepSuggestion} />
          {oneNextStep && (
            <OneNextStepCard step={oneNextStep.step} asset={oneNextStep.asset} onComplete={toggleStep} />
          )}

          {/* Sprint 05 — Knowledge Graph: Collection → Skill → AI Tool → Scenario */}
          <KnowledgeGraphPanel collection={collection} graph={graphView} />

          {/* Feature 02 — Learning Outcome */}
          <LearningOutcome items={seed.whatYouWillGain} />

          {/* Feature 03 — Why This Matters */}
          <WhyThisMatters text={seed.whyMatters} />

          {/* Feature 04 — Core Knowledge (Vấn đề + Ý tưởng cốt lõi) */}
          <div id="problem" className="scroll-mt-20 rounded-2xl border-l-4 border-orange-300 bg-orange-50/40 p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-600">Vấn đề</p>
            <p className="text-sm italic leading-relaxed text-gray-700">&ldquo;{seed.problem}&rdquo;</p>
          </div>
          <div id="core-idea" className="scroll-mt-20 rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600">Ý tưởng cốt lõi</p>
            <p className="text-sm leading-relaxed text-gray-700">{seed.coreIdea}</p>
          </div>

          {/* Feature 05 — Step by Step Guide */}
          <div id="guide" className="scroll-mt-20 space-y-2 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Hướng dẫn</h2>
            <StepByStepGuide steps={seed.guideSteps} />
          </div>

          {/* Feature 06 — Prompt Experience */}
          <div id="prompt" className="scroll-mt-20 space-y-4">
            <PromptExperience
              prompt={seed.samplePrompt}
              tips={seed.promptTips}
              exampleInput={seed.promptExampleInput}
              exampleOutput={seed.promptExampleOutput}
            />
            <div className="rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <PromptPack prompts={seed.prompts} packLabel="Prompt Pack" />
            </div>
          </div>

          {/* Feature 07 — Real Example */}
          <div id="example" className="scroll-mt-20 space-y-2 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Ví dụ</h2>
            {beforeAfter ? (
              <RealExample
                before={beforeAfter.before}
                after={beforeAfter.after}
                beforeLabel={beforeAfter.beforeLabel}
                afterLabel={beforeAfter.afterLabel}
              />
            ) : (
              <p className="text-sm leading-relaxed text-gray-700">{seed.example}</p>
            )}
          </div>

          {/* Feature 08 — Common Mistakes */}
          <ContentSection id="mistakes" icon={ListX} title="Sai lầm thường gặp">
            <ul className="list-disc space-y-1 pl-5">
              {seed.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ContentSection>

          {/* Feature 09 — Action Checklist (có thể tick) */}
          <div id="checklist" className="scroll-mt-20 space-y-2 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
              <ListChecks className="h-4 w-4 text-blue-500" />
              Checklist
            </h2>
            <ActionChecklist seedId={seed.id} items={seed.checklist} />
          </div>

          <DownloadPrepCard
            promptPackLabel={seed.downloadPack.promptPackLabel}
            checklistLabel={seed.downloadPack.checklistLabel}
            templateLabel={seed.downloadPack.templateLabel}
          />

          {/* Feature 10 — Exercise */}
          <ContentSection id="exercise" icon={Dumbbell} title="Exercise · 5-15 phút">
            <p>{seed.exercise}</p>
            <button
              type="button"
              onClick={() =>
                pushCompanionIntent({
                  module: "ckos",
                  userGoal: `thực hành ${seed.title}`,
                  currentContext: `Kỹ năng: ${seed.skills.join(", ") || "—"}. Công cụ AI: ${seed.aiTools.join(", ") || "—"}.`,
                })
              }
              className="mt-3 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
            >
              Thực hành cùng Companion
            </button>
          </ContentSection>

          {/* Feature 11 — Reflection: chỉ 3 câu hỏi */}
          <div id="reflection" className="scroll-mt-20 space-y-4">
            <ReflectionBox seedId={seed.id} question={`Hôm nay bạn học được gì từ "${seed.title}"?`} />
            <ReflectionBox seedId={seed.id} question={seed.reflectionQuestions[0]} />
            <ReflectionBox seedId={seed.id} question="Điều gì còn chưa rõ với bạn?" />
          </div>

          {/* Learning Engine — giữ nguyên, không sửa */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Hành trình từng bước</p>
            <SeedStepList steps={seed.steps} completedStepIds={completedStepIds} onToggle={toggleStep} />
          </div>

          <SeedNavigation previous={previous} next={next} />
          <KnowledgeDependency prerequisites={prerequisiteSeeds} dependents={dependentSeeds} />
          <RelatedKnowledge seeds={related} />

          {/* Feature 12 — Companion Note */}
          <CompanionNoteBlock note={seed.companionNote} />

          {/* Feature 13 — Next Action */}
          <NextActionCard action={seed.nextStep} />
          <button
            type="button"
            onClick={() =>
              pushCompanionIntent({
                module: "ckos",
                userGoal: `bước tiếp theo sau ${seed.title}`,
                currentContext: seed.nextStep,
              })
            }
            className="-mt-3 inline-flex rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
          >
            Nhờ Companion gợi ý bước tiếp theo
          </button>

          {/* Feature 14 — Completion Experience */}
          {isComplete && <CompletionExperience seedTitle={seed.title} />}
        </div>

        <TableOfContents />
      </div>

      <SectionNav />
    </div>
  );
}
