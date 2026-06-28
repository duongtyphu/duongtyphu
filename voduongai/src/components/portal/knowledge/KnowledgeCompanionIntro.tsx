"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { AiKnowledgeTip, RecommendedKnowledgeItem } from "@/data/portal/knowledge-hub";
import {
  readStoredReflectionMeaning,
  subscribeToReflectionMeaning,
} from "@/lib/portal/intelligence/portal-signals";
import {
  companionKnowledgeIntro,
  emphasizeByTags,
  evolveKnowledgeFocus,
} from "@/lib/portal/intelligence/knowledge-evolution";
import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";

/**
 * Sprint 13.0 — Knowledge Evolution + Companion giới thiệu bằng lời
 * (Nhiệm vụ 02/04/05). Thay cho `AIKnowledgeCoach` tĩnh: khi đã có một
 * Reflection gần đây, Companion giới thiệu Knowledge bằng câu nói riêng
 * (không phải link trần), và phần được nhấn mạnh là phần thật sự khớp
 * với ý nghĩa Reflection đó — không phải gợi ý thương mại.
 *
 * Khi chưa có Reflection nào, hiển thị lại đúng trải nghiệm tĩnh cũ
 * (`tip`) — không bịa một lời giới thiệu không có cơ sở.
 *
 * Luôn kết thúc bằng một lời mời Phản chiếu (No Dead End — Nhiệm vụ
 * 09), không phải trạng thái "Đã hoàn thành".
 */
export function KnowledgeCompanionIntro({
  tip,
  items,
}: {
  tip: AiKnowledgeTip;
  items: RecommendedKnowledgeItem[];
}) {
  const [meaning, setMeaning] = useState<ReflectionMeaning | undefined>(() =>
    readStoredReflectionMeaning()
  );

  useEffect(() => subscribeToReflectionMeaning(setMeaning), []);

  const evolution = evolveKnowledgeFocus(meaning);
  const companionLine = companionKnowledgeIntro(meaning);
  const emphasized = emphasizeByTags(items, evolution).slice(0, 2);

  return (
    <GemCard variant="featured">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#A78BFA]" />
        <h2 className="text-sm font-bold text-white">
          {companionLine ? "Companion" : "AI Knowledge Coach"}
        </h2>
      </div>
      <p className="mt-3 text-sm text-white/70">{companionLine ?? tip.message}</p>

      {evolution && emphasized.length > 0 && (
        <ul className="mt-3 space-y-1">
          {emphasized.map((item) => (
            <li key={item.id} className="text-xs text-white/55">
              <a href={item.href} className="underline decoration-white/20 hover:text-white">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!companionLine && (
          <Button href={tip.href} variant="primary">
            {tip.cta} →
          </Button>
        )}
        <Button href="/portal/story" variant="secondary">
          Phản chiếu một chút về điều này →
        </Button>
      </div>
    </GemCard>
  );
}
