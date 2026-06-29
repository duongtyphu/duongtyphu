"use client";

import { useState } from "react";
import { Feather } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import { useReflections } from "@/lib/portal/reflections";
import { detectReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";
import { writeStoredReflectionMeaning } from "@/lib/portal/intelligence/portal-signals";
import { recordReflectionForCharacterMemory } from "@/lib/portal/companion/character-memory";

/**
 * Answers: "Portal có thực sự hỏi và lắng nghe tôi, không chỉ dạy tôi?"
 */
export function ReflectionJournalCard() {
  const { question, answeredToday, submitAnswer, signedIn, ready, tableReady } = useReflections();
  const [draft, setDraft] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  if (!ready || !signedIn) {
    return (
      <GemCard className="h-full">
        <div className="flex items-center gap-2">
          <Feather className="h-4 w-4 text-[#A78BFA]" />
          <h2 className="text-sm font-bold text-white">Một câu hỏi nhỏ hôm nay</h2>
        </div>
        <p className="mt-2 text-sm text-white/55 italic">{question}</p>
      </GemCard>
    );
  }

  if (!tableReady) {
    return (
      <GemCard className="h-full">
        <div className="flex items-center gap-2">
          <Feather className="h-4 w-4 text-[#A78BFA]" />
          <h2 className="text-sm font-bold text-white">Một câu hỏi nhỏ hôm nay</h2>
        </div>
        <p className="mt-3 text-sm text-white/65">
          Khu vực lưu ký ức đang được chuẩn bị. Bạn vẫn có thể xem hành trình của mình.
        </p>
      </GemCard>
    );
  }

  if (answeredToday || justSaved) {
    return (
      <GemCard className="h-full">
        <div className="flex items-center gap-2">
          <Feather className="h-4 w-4 text-[#A78BFA]" />
          <h2 className="text-sm font-bold text-white">Một câu hỏi nhỏ hôm nay</h2>
        </div>
        <p className="mt-3 text-sm text-white/65">
          Cảm ơn bạn đã dành chút thời gian để suy ngẫm hôm nay. Câu trả lời đã được lưu vào My Story.
        </p>
      </GemCard>
    );
  }

  return (
    <GemCard className="h-full">
      <div className="flex items-center gap-2">
        <Feather className="h-4 w-4 text-[#A78BFA]" />
        <h2 className="text-sm font-bold text-white">Một câu hỏi nhỏ hôm nay</h2>
      </div>
      <p className="mt-2 text-sm text-white/70">{question}</p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Không cần dài, chỉ cần thật..."
        rows={2}
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-[#22D3EE]/50"
      />
      <Button
        variant="secondary"
        className="mt-3"
        onClick={async () => {
          const meaning = detectReflectionMeaning(draft);
          if (meaning) {
            writeStoredReflectionMeaning(meaning);
            recordReflectionForCharacterMemory(meaning);
          }
          await submitAnswer(draft);
          setJustSaved(true);
        }}
        disabled={!draft.trim()}
      >
        Lưu lại một dấu chân hôm nay
      </Button>
    </GemCard>
  );
}
