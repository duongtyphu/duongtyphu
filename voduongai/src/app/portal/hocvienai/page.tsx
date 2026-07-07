import Link from "next/link";
import { ChevronRight, GraduationCap, BookOpen, Dumbbell, Sparkles, TrendingUp } from "lucide-react";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { ExperienceFlow } from "@/components/portal/ui/ExperienceFlow";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { JourneyCard } from "@/features/academy/components/JourneyCard";
import { LandingPageMissionPilot } from "@/features/academy/components/LandingPageMissionPilot";
import { getAllLearningJourneys } from "@/features/academy/services/journey.service";
import { WorkNeedSection, LearningPathSection } from "@/components/portal/ai-space/AiSpaceSections";
import { AI_TOOLS } from "@/data/khong-gian-ai";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";
import { JourneyStatusCard } from "@/components/portal/ui/JourneyStatusCard";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { getHumanFlowState } from "@/lib/portal/human-flow";

/**
 * Content Audit sprint: "Theo nhu cầu công việc" và "Lộ trình học AI" đã
 * chuyển từ AI Workspace sang đây (đúng vai trò HỌC) — xem
 * docs/AI_WORKSPACE_ACADEMY_CONTENT_AUDIT.md. "Học AI theo công cụ" là
 * section mới, tái dùng dữ liệu AI_TOOLS ở dạng khám phá/tìm hiểu (không có
 * CTA "Dùng cùng Companion" — nút đó vẫn thuộc AI Toolbox bên Workspace).
 */

export const metadata = {
  title: "Học viện AI",
  description: "Học AI có hệ thống. Hiểu đúng, luyện đúng và thực hành cùng Companion.",
};

const FAQ = [
  {
    q: "Học viện có phải là khoá học không?",
    a: "Không. Học viện không bán khoá học — Học viện dẫn bạn qua một hành trình thực hành thật, dựa trên tri thức đã có trong Hệ tri thức AI.",
  },
  {
    q: "Tôi cần hoàn thành bao nhiêu bài để 'xong'?",
    a: "Học viện không đếm số bài đã hoàn thành. Học viện quan tâm bạn có đang làm việc khác đi so với trước không — đó mới là dấu hiệu trưởng thành thật.",
  },
  {
    q: "Companion có chấm điểm tôi không?",
    a: "Không. Companion đồng hành và gợi ý bước tiếp theo, không chấm điểm, không xếp hạng.",
  },
];

export default function AcademyHubPage() {
  const journeys = getAllLearningJourneys();
  const flow = getHumanFlowState("knowledge");

  return (
    <div className="space-y-12">
      {/* Hero */}
      <PillarHero
        icon={GraduationCap}
        tone="learning"
        eyebrow="Academy — Nơi năng lực được rèn"
        title="Bạn không học AI. Bạn học cách làm việc khác đi"
        subtitle="Một bài học tốt không kết thúc bằng việc bạn đọc xong — nó kết thúc bằng việc bạn làm ra một kết quả mà tuần trước bạn chưa làm được. Academy chọn cho bạn đúng một bước tiếp theo, không phải một danh sách khoá học để tự bơi."
        quickActions={[
          { label: "Vào AI Workspace", href: "/portal/aiworkspace" },
          { label: "Xem Hệ tri thức AI", href: "/portal/hetrithucai" },
        ]}
      />

      <ExperienceFlow
        stages={[
          { icon: BookOpen, label: "Hiểu", description: "Nắm đúng khái niệm trước khi luyện." },
          { icon: Dumbbell, label: "Luyện", description: "Thực hành theo hành trình phù hợp với bạn." },
          { icon: Sparkles, label: "Thực hành", description: "Áp dụng vào Workspace với Companion." },
          { icon: TrendingUp, label: "Trưởng thành", description: "Cảm nhận sự khác biệt, không chỉ điểm số." },
        ]}
      />

      {/* Next Best Action */}
      <GemCard variant="action" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-brand-blue">
            Bước tiếp theo
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-900">{flow.nextBestAction}</p>
          <p className="mt-1 text-sm text-gray-600">{flow.reason}</p>
        </div>
        <Button href={flow.recommendedRoute} variant="primary" className="shrink-0">
          {flow.recommendedCTA}
        </Button>
      </GemCard>

      {/* Companion Guide */}
      <CompanionGuide
        message="Đừng cố học hết mọi thứ trong một ngày. Chọn một hành trình, làm đúng một bước Companion vừa gợi ý, rồi dừng lại — hôm sau quay lại làm bước kế tiếp."
        action={{ label: "Xem Hệ tri thức AI", href: "/portal/hetrithucai" }}
      />

      {/* Learning / Progress */}
      <JourneyStatusCard
        eyebrow="Tiến độ học"
        emptyMessage="Bạn chưa có hành trình học nào đang dang dở — chọn một lộ trình bên dưới để bắt đầu."
        ctaLabel="Xem lộ trình"
        ctaHref="/portal/roadmap"
      />

      {/* Lộ trình học AI */}
      <LearningPathSection />

      {/* Học AI theo nhu cầu */}
      <WorkNeedSection label="Học theo nhu cầu" title="Học AI theo nhu cầu" ctaLabel="Học và thực hành" />

      {/* Học AI theo công cụ — khám phá, không phải Toolbox thực thi (Toolbox ở AI Workspace) */}
      <div className="space-y-4">
        <SectionHeader
          eyebrow="Một cách khác để bắt đầu"
          title="Chưa biết học gì? Chọn theo công cụ bạn đã có sẵn"
          action={
            <Link href="/portal/aiworkspace/cong-cu" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
              Xem tất cả công cụ <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {AI_TOOLS.filter((tool) => tool.featured).map((tool) => (
            <Link
              key={tool.slug}
              href={`/portal/aiworkspace/${tool.slug}`}
              className="gemos-gem-card group flex flex-col gap-2 p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-bold text-blue-700">
                {tool.name.charAt(0)}
              </div>
              <p className="gemos-card-title font-semibold text-gray-900">{tool.name}</p>
              <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">{tool.tagline}</p>
              <span className="mt-auto text-xs font-semibold text-blue-600">Tìm hiểu công cụ →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Learning Journey — Academy Operating System */}
      <div className="space-y-4">
        <SectionHeader eyebrow="Journey" title="Hành trình của bạn" />
        {journeys.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-8 text-center text-sm text-gray-400">
            Chưa có hành trình nào sẵn sàng — quay lại sau nhé.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {journeys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
        )}
      </div>

      {/* Sprint 05 — Unlockable Assets pilot Mission */}
      <LandingPageMissionPilot />

      {/* Mentoring CTA */}
      <GemCard>
        <h3 className="gemos-card-title mb-2 text-base font-bold text-gray-900">Cần đồng hành riêng?</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          Muốn trao đổi trực tiếp về hành trình của mình? Kết nối cộng đồng — không cần chờ đúng
          &ldquo;bài học&rdquo; nào đó.
        </p>
        <Button href="/portal/congdongai" variant="secondary">
          Kết nối cộng đồng →
        </Button>
      </GemCard>

      {/* FAQ */}
      <div className="space-y-4">
        <SectionHeader title="Câu hỏi thường gặp" />
        <div className="space-y-3">
          {FAQ.map((item) => (
            <GemCard key={item.q}>
              <p className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.q}</p>
              <p className="text-sm leading-relaxed text-gray-500">{item.a}</p>
            </GemCard>
          ))}
        </div>
      </div>

      <KnowledgeJourneyStrip
        title="Học xong, đừng dừng lại"
        steps={[
          { label: "Xem CKOS", description: "Tra cứu Công cụ, Prompt, Quy trình liên quan đến bài học.", href: "/portal/ckos" },
          { label: "Thực hành ở Workspace", description: "Mang kiến thức vừa học vào một phiên làm việc thật.", href: "/portal/aiworkspace" },
          { label: "Xem Case Study", description: "Xem người khác đã áp dụng kiến thức này ra sao.", href: "/portal/case-studies" },
        ]}
      />
    </div>
  );
}
