"use client";

import { useEffect, useState } from "react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";
import { getHumanFlowState } from "@/lib/portal/human-flow";
import { getGardenSummary, getJourneyProgress } from "@/lib/portal/foundation/growth-view";

// Portal 3.0 P.3 — Companion Experience.
//
// Correction vs. the original brief: `companion-manager.ts` (Workforce Task
// Assignment, Phase 4 Epic 02) and `mission-runtime.ts` (single-mission
// pipeline recorder) are NOT the engines behind "today's suggestion" for a
// learner — they belong to a separate Owner/Workforce business system. The
// actual read-only engines already powering Gem Home's Daily
// Focus/Next-Best-Action today are `human-flow.ts` (sync, pure) and
// `foundation/growth-view.ts` (client-side, reads real GrowthEvent/
// WorkspaceSession data, zero fabricated numbers). Reused as-is here — no
// new state/runtime created, per requirement 4.
type Pillar = {
  key: string;
  label: string;
  tone: "free" | "premium" | "locked";
  suggestion: string;
  href: string;
  cta: string;
};

const PILLAR_SUGGESTIONS: Pillar[] = [
  {
    key: "ckos",
    label: "CKOS",
    tone: "free",
    suggestion: "Xem một Công cụ hoặc Prompt canonical vừa được cập nhật trong CKOS.",
    href: "/portal/hetrithucai",
    cta: "Khám phá CKOS",
  },
  {
    key: "academy",
    label: "Academy",
    tone: "free",
    suggestion: "Tiếp tục hành trình học ở Học viện AI — đúng bài học tiếp theo của bạn.",
    href: "/portal/hocvienai",
    cta: "Vào Học viện",
  },
  {
    key: "projects",
    label: "Dự án & Cơ hội",
    tone: "free",
    suggestion: "Xem các dự án/cơ hội đang mở mà bạn có thể tham gia ngay.",
    href: "/portal/duan-cohoi",
    cta: "Xem cơ hội",
  },
  {
    key: "premium",
    label: "Premium",
    tone: "premium",
    suggestion: "Khám phá lộ trình V-Solo/V-Scale nếu bạn muốn đi xa hơn.",
    href: "/portal/premium",
    cta: "Xem Premium",
  },
  {
    key: "journey",
    label: "Journey",
    tone: "free",
    suggestion: "Xem lại chặng đường đã đi và bước tiếp theo trong hành trình của bạn.",
    href: "/portal/hanhtrinhcuatoi",
    cta: "Xem hành trình",
  },
  {
    key: "workspace",
    label: "Workspace",
    tone: "free",
    suggestion: "Mở một phiên làm việc mới với Companion để tạo ra kết quả cụ thể.",
    href: "/portal/workspace",
    cta: "Vào Workspace",
  },
];

type CkosPreviewItem = { id: string; name?: string; title?: string };

async function fetchCkosPreview(): Promise<{ tools: CkosPreviewItem[]; prompts: CkosPreviewItem[] }> {
  try {
    const [toolsRes, promptsRes] = await Promise.all([
      fetch("/api/v1/ckos/tools?pageSize=2"),
      fetch("/api/v1/ckos/prompts?pageSize=2"),
    ]);
    const toolsJson = toolsRes.ok ? await toolsRes.json() : { items: [] };
    const promptsJson = promptsRes.ok ? await promptsRes.json() : { items: [] };
    return { tools: toolsJson.items ?? [], prompts: promptsJson.items ?? [] };
  } catch {
    return { tools: [], prompts: [] };
  }
}

export function CompanionExperience() {
  const [ckos, setCkos] = useState<{ tools: CkosPreviewItem[]; prompts: CkosPreviewItem[] } | null>(null);

  useEffect(() => {
    fetchCkosPreview().then(setCkos);
  }, []);

  const flow = getHumanFlowState("knowledge");
  const journeyEntries = getJourneyProgress();
  const garden = getGardenSummary();
  const activeJourney = journeyEntries.find((j) => !j.isCompleted);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 sm:px-10">
      {/* Daily Focus + Next Best Action */}
      <section>
        <SectionHeader eyebrow="Hôm nay" title="Companion gợi ý gì cho bạn" />
        <div className="grid gap-4 md:grid-cols-2">
          <GemCard variant="featured">
            <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-brand-blue">
              Daily Focus
            </p>
            <p className="mt-2 text-base font-bold text-gray-900">{flow.currentStage}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{flow.progressNarrative}</p>
            {flow.hardTimeLine ? (
              <p className="mt-3 text-sm italic leading-relaxed text-brand-violet">{flow.hardTimeLine}</p>
            ) : null}
          </GemCard>
          <GemCard variant="action">
            <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-brand-blue">
              Next Best Action
            </p>
            <p className="mt-2 text-base font-bold text-gray-900">{flow.nextBestAction}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{flow.reason}</p>
            <div className="mt-4">
              <Button href={flow.recommendedRoute} variant="primary">
                {flow.recommendedCTA}
              </Button>
            </div>
          </GemCard>
        </div>
      </section>

      {/* Continue Learning */}
      <section>
        <SectionHeader eyebrow="Academy" title="Tiếp tục học" />
        <GemCard>
          {activeJourney ? (
            <>
              <p className="font-semibold text-gray-900">{activeJourney.missionGoal}</p>
              <p className="mt-1 text-sm text-gray-500">
                Bạn đã tạo {activeJourney.outputCount} kết quả trong hành trình này — tiếp tục nhé.
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Bạn chưa bắt đầu hành trình học nào gần đây — Học viện AI là điểm bắt đầu tốt.
            </p>
          )}
          <div className="mt-4">
            <Button href="/portal/hocvienai" variant="secondary">
              Vào Học viện AI
            </Button>
          </div>
        </GemCard>
      </section>

      {/* CKOS Suggestions */}
      <section>
        <SectionHeader eyebrow="CKOS" title="Gợi ý từ tri thức chuẩn hoá" />
        {ckos && (ckos.tools.length > 0 || ckos.prompts.length > 0) ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {ckos.tools.slice(0, 1).map((t) => (
              <GemCard key={`tool-${t.id}`}>
                <GemBadge tone="free">Công cụ AI</GemBadge>
                <p className="gemos-card-title mt-3 font-bold text-gray-900">{t.name ?? t.title}</p>
                <div className="mt-3">
                  <Button href="/portal/tools" variant="secondary">
                    Xem công cụ
                  </Button>
                </div>
              </GemCard>
            ))}
            {ckos.prompts.slice(0, 1).map((p) => (
              <GemCard key={`prompt-${p.id}`}>
                <GemBadge tone="free">Prompt</GemBadge>
                <p className="gemos-card-title mt-3 font-bold text-gray-900">{p.title ?? p.name}</p>
                <div className="mt-3">
                  <Button href="/portal/prompts" variant="secondary">
                    Xem prompt
                  </Button>
                </div>
              </GemCard>
            ))}
          </div>
        ) : (
          <GemCard>
            <p className="text-sm text-gray-500">
              Chưa có gợi ý CKOS nào sẵn sàng lúc này — ghé Thư viện AI để khám phá Công cụ và Prompt.
            </p>
            <div className="mt-4">
              <Button href="/portal/hetrithucai" variant="secondary">
                Xem Thư viện AI
              </Button>
            </div>
          </GemCard>
        )}
      </section>

      {/* Journey / Reflection prompt */}
      <section>
        <SectionHeader eyebrow="Journey" title="Chiêm nghiệm hành trình" />
        <GemCard>
          <p className="text-sm leading-relaxed text-gray-600">{flow.momentumMessage}</p>
          <p className="mt-3 text-sm text-gray-500">
            Bạn đã hoàn thành {garden.missionsCompleted} nhiệm vụ, chạm tới {garden.journeysTouched} hành
            trình, và tạo ra {garden.totalOutputs} kết quả cho tới nay.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/portal/hanhtrinhcuatoi" variant="secondary">
              {flow.recommendedCTA}
            </Button>
            <Button href="/portal/nhatkyhoctap" variant="secondary">
              Viết nhật ký học tập
            </Button>
          </div>
        </GemCard>
      </section>

      {/* Workspace Suggestions */}
      <section>
        <SectionHeader eyebrow="Workspace" title="Bắt đầu một phiên làm việc" />
        <GemCard>
          <p className="text-sm leading-relaxed text-gray-600">
            Workspace là nơi Companion cùng bạn biến một ý tưởng thành kết quả cụ thể — bài viết, kế
            hoạch, hoặc sản phẩm đầu tiên.
          </p>
          <div className="mt-4">
            <Button href="/portal/workspace" variant="primary">
              Mở Workspace
            </Button>
          </div>
        </GemCard>
      </section>

      {/* Every pillar — at least one next action */}
      <section>
        <SectionHeader title="Mỗi trụ cột, một gợi ý" description="Companion đồng hành ở mọi nơi trong Portal, không chỉ ở đây." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLAR_SUGGESTIONS.map((p) => (
            <GemCard key={p.key}>
              <div className="flex items-center justify-between gap-2">
                <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
                  {p.label}
                </p>
                {p.tone === "premium" ? <GemBadge tone="premium" /> : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.suggestion}</p>
              <div className="mt-4">
                <Button href={p.href} variant="secondary">
                  {p.cta}
                </Button>
              </div>
            </GemCard>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <SectionHeader title="Hành động nhanh" />
        <div className="flex flex-wrap gap-3">
          <Button href="/portal/prompts" variant="secondary">Thư viện Prompt</Button>
          <Button href="/portal/tools" variant="secondary">Công cụ AI</Button>
          <Button href="/portal/checklists" variant="secondary">Checklist</Button>
          <Button href="/portal/sop" variant="secondary">SOP</Button>
          <Button href="/portal/case-studies" variant="secondary">Case Study</Button>
        </div>
      </section>
    </div>
  );
}
