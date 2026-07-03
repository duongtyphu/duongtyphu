"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  Users,
  AlertTriangle,
  Lightbulb,
  BookOpenText,
  Sparkles,
  ImageIcon,
  ListX,
  ListChecks,
  Dumbbell,
  Clock,
} from "lucide-react";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { JourneyProgress } from "../components/JourneyProgress";
import { SeedStepList } from "../components/SeedStepList";
import { CompanionSuggestion } from "../components/CompanionSuggestion";
import { OneNextStepCard } from "../components/OneNextStepCard";
import { ContentSection } from "../components/ContentSection";
import { SeedNavigation } from "../components/SeedNavigation";
import { RelatedKnowledge } from "../components/RelatedKnowledge";
import { BookmarkButton } from "../components/BookmarkButton";
import { ReflectionBox } from "../components/ReflectionBox";
import { KnowledgeMap } from "../components/KnowledgeMap";
import { TableOfContents } from "../components/TableOfContents";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { SectionNav } from "../components/SectionNav";
import { useSeedProgress, getSeedCompletedStepIds } from "../utils/use-seed-progress";
import { recordSeedVisit } from "../utils/use-continue-learning";
import {
  computeSeedProgress,
  getCompanionSuggestion,
  getOneNextStep,
  getAdjacentSeeds,
  getRelatedSeedObjects,
  getPrerequisiteGuidance,
} from "../services/knowledge-seed.service";
import { getKnowledgeCollectionBySlug } from "../services/knowledge-collection.service";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

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
  const readingMinutes = estimateReadingMinutes(seed);

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

      {/* Feature 04 — Knowledge Map */}
      <KnowledgeMap collection={collection} seed={seed} next={next} isLastSeed={!next} />

      <ReadingProgressBar />

      <div className="flex gap-6">
        <div className="min-w-0 flex-1 space-y-6">
          {/* 1. Hero */}
          <WorkspaceHeader seed={seed} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BookmarkButton seedId={seed.id} />
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              Thời gian đọc ước tính: {readingMinutes} phút
            </span>
          </div>

          <JourneyProgress progress={progress} />

          {/* Feature 07 — Companion Guide: chỉ dẫn đường, không chat */}
          <CompanionSuggestion message={prerequisiteGuidance ?? stepSuggestion} />

          {oneNextStep && (
            <OneNextStepCard step={oneNextStep.step} asset={oneNextStep.asset} onComplete={toggleStep} />
          )}

          {/* 2. Bạn sẽ đạt được gì */}
          <ContentSection id="gain" icon={Target} title="Bạn sẽ đạt được gì">
            <ul className="list-disc space-y-1 pl-5">
              {seed.whatYouWillGain.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ContentSection>

          {/* 3. Phù hợp với ai */}
          <ContentSection id="persona" icon={Users} title="Phù hợp với ai">
            <p>{seed.persona.join(", ")}</p>
          </ContentSection>

          {/* 4. Vấn đề */}
          <ContentSection id="problem" icon={AlertTriangle} title="Vấn đề">
            <p>{seed.problem}</p>
          </ContentSection>

          {/* 5. Ý tưởng cốt lõi */}
          <ContentSection id="core-idea" icon={Lightbulb} title="Ý tưởng cốt lõi">
            <p>{seed.coreIdea}</p>
          </ContentSection>

          {/* 6. Hướng dẫn */}
          <ContentSection id="guide" icon={BookOpenText} title="Hướng dẫn">
            <p>{seed.guide}</p>
          </ContentSection>

          {/* 7. Prompt */}
          <ContentSection id="prompt" icon={Sparkles} title="Prompt">
            <p className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-600">{seed.samplePrompt}</p>
          </ContentSection>

          {/* 8. Ví dụ */}
          <ContentSection id="example" icon={ImageIcon} title="Ví dụ">
            <p>{seed.example}</p>
          </ContentSection>

          {/* 9. Sai lầm thường gặp */}
          <ContentSection id="mistakes" icon={ListX} title="Sai lầm thường gặp">
            <ul className="list-disc space-y-1 pl-5">
              {seed.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ContentSection>

          {/* 10. Checklist */}
          <ContentSection id="checklist" icon={ListChecks} title="Checklist">
            <ul className="list-disc space-y-1 pl-5">
              {seed.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ContentSection>

          {/* 11. Exercise */}
          <ContentSection id="exercise" icon={Dumbbell} title="Exercise">
            <p>{seed.exercise}</p>
          </ContentSection>

          {/* 12. Reflection */}
          <div id="reflection" className="scroll-mt-20 space-y-4">
            {seed.reflectionQuestions.map((question) => (
              <ReflectionBox key={question} seedId={seed.id} question={question} />
            ))}
          </div>

          {/* 13 & 14. Companion Note + Next Step đã hiển thị qua CompanionSuggestion/OneNextStepCard ở trên */}

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Hành trình từng bước</p>
            <SeedStepList steps={seed.steps} completedStepIds={completedStepIds} onToggle={toggleStep} />
          </div>

          <SeedNavigation previous={previous} next={next} />

          <RelatedKnowledge seeds={related} />
        </div>

        <TableOfContents />
      </div>

      <SectionNav />
    </div>
  );
}
