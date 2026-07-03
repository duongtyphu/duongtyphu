"use client";

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
} from "lucide-react";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { JourneyProgress } from "../components/JourneyProgress";
import { SeedStepList } from "../components/SeedStepList";
import { CompanionSuggestion } from "../components/CompanionSuggestion";
import { OneNextStepCard } from "../components/OneNextStepCard";
import { ContentSection } from "../components/ContentSection";
import { SeedNavigation } from "../components/SeedNavigation";
import { BookmarkButton } from "../components/BookmarkButton";
import { ReflectionBox } from "../components/ReflectionBox";
import { useSeedProgress } from "../utils/use-seed-progress";
import {
  computeSeedProgress,
  getCompanionSuggestion,
  getOneNextStep,
  getAdjacentSeeds,
  getRelatedSeedObjects,
} from "../services/knowledge-seed.service";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

export function KnowledgeWorkspace({ seed }: { seed: KnowledgeSeed }) {
  const { completedStepIds, toggleStep } = useSeedProgress(seed.id);
  const progress = computeSeedProgress(seed, completedStepIds);
  const suggestion = getCompanionSuggestion(seed, completedStepIds);
  const oneNextStep = getOneNextStep(seed, completedStepIds);
  const { previous, next } = getAdjacentSeeds(seed);
  const related = getRelatedSeedObjects(seed);

  return (
    <div className="space-y-6">
      <Link
        href="/portal/library"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại Thư viện tri thức
      </Link>

      {/* 1. Hero */}
      <WorkspaceHeader seed={seed} />
      <BookmarkButton seedId={seed.id} />

      <JourneyProgress progress={progress} />
      <CompanionSuggestion message={suggestion} />

      {oneNextStep && (
        <OneNextStepCard step={oneNextStep.step} asset={oneNextStep.asset} onComplete={toggleStep} />
      )}

      {/* 2. Bạn sẽ đạt được gì */}
      <ContentSection icon={Target} title="Bạn sẽ đạt được gì">
        <ul className="list-disc space-y-1 pl-5">
          {seed.whatYouWillGain.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentSection>

      {/* 3. Phù hợp với ai */}
      <ContentSection icon={Users} title="Phù hợp với ai">
        <p>{seed.persona.join(", ")}</p>
      </ContentSection>

      {/* 4. Vấn đề */}
      <ContentSection icon={AlertTriangle} title="Vấn đề">
        <p>{seed.problem}</p>
      </ContentSection>

      {/* 5. Ý tưởng cốt lõi */}
      <ContentSection icon={Lightbulb} title="Ý tưởng cốt lõi">
        <p>{seed.coreIdea}</p>
      </ContentSection>

      {/* 6. Hướng dẫn */}
      <ContentSection icon={BookOpenText} title="Hướng dẫn">
        <p>{seed.guide}</p>
      </ContentSection>

      {/* 7. Prompt */}
      <ContentSection icon={Sparkles} title="Prompt">
        <p className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-600">{seed.samplePrompt}</p>
      </ContentSection>

      {/* 8. Ví dụ */}
      <ContentSection icon={ImageIcon} title="Ví dụ">
        <p>{seed.example}</p>
      </ContentSection>

      {/* 9. Sai lầm thường gặp */}
      <ContentSection icon={ListX} title="Sai lầm thường gặp">
        <ul className="list-disc space-y-1 pl-5">
          {seed.commonMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentSection>

      {/* 10. Checklist */}
      <ContentSection icon={ListChecks} title="Checklist">
        <ul className="list-disc space-y-1 pl-5">
          {seed.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentSection>

      {/* 11. Exercise */}
      <ContentSection icon={Dumbbell} title="Exercise">
        <p>{seed.exercise}</p>
      </ContentSection>

      {/* 12. Reflection */}
      {seed.reflectionQuestions.map((question) => (
        <ReflectionBox key={question} seedId={seed.id} question={question} />
      ))}

      {/* 13 & 14. Companion Note + Next Step đã hiển thị qua CompanionSuggestion/OneNextStepCard ở trên */}

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Hành trình từng bước</p>
        <SeedStepList steps={seed.steps} completedStepIds={completedStepIds} onToggle={toggleStep} />
      </div>

      <SeedNavigation previous={previous} next={next} related={related} />
    </div>
  );
}
