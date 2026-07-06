import Link from "next/link";
import { ChevronRight, GraduationCap, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { JourneyCard } from "@/features/academy/components/JourneyCard";
import { LandingPageMissionPilot } from "@/features/academy/components/LandingPageMissionPilot";
import { getAllLearningJourneys } from "@/features/academy/services/journey.service";
import { WorkNeedSection, LearningPathSection } from "@/components/portal/ai-space/AiSpaceSections";
import { AI_TOOLS } from "@/data/khong-gian-ai";
import { GemCard } from "@/components/portal/ui/GemCard";

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

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-3">
        <PageHeader
          icon={GraduationCap}
          tone="blue"
          title="Học viện AI"
          titleGradient
          subtitle="Học AI theo lộ trình, theo kỹ năng và theo mục tiêu thực tế của bạn."
        />
        <p className="max-w-2xl text-gray-500">
          Học viện không phải nơi chứa khoá học. Đây là nơi tri thức bạn đã học được chuyển hoá
          thành thực hành thật, năng lực thật và cảm nhận trưởng thành thật. Học xong, hãy sang{" "}
          <Link href="/portal/aiworkspace" className="font-semibold text-blue-600 hover:underline">
            AI Workspace
          </Link>{" "}
          để thực hành cùng Companion.
        </p>
      </div>

      {/* Companion Guide */}
      <CompanionGuide
        message="Chọn một hành trình bên dưới và bắt đầu từ bước Companion gợi ý — không cần làm hết mọi thứ cùng lúc."
        action={{ label: "Xem Hệ tri thức AI", href: "/portal/hetrithucai" }}
      />

      {/* Lộ trình học AI */}
      <LearningPathSection />

      {/* Học AI theo nhu cầu */}
      <WorkNeedSection label="Học theo nhu cầu" title="Học AI theo nhu cầu" ctaLabel="Học và thực hành" />

      {/* Học AI theo công cụ — khám phá, không phải Toolbox thực thi (Toolbox ở AI Workspace) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Công cụ AI</p>
            <h2 className="text-xl font-bold text-gray-900">Học AI theo công cụ</h2>
          </div>
          <Link href="/portal/aiworkspace/cong-cu" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            Xem tất cả công cụ <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
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
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Hành trình của bạn</p>
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
      <div className="rounded-xl border border-brand-violet/20 bg-brand-violet/5 p-6">
        <h3 className="mb-2 text-base font-bold text-gray-900">Cần đồng hành riêng?</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          Nếu bạn muốn trao đổi trực tiếp về hành trình của mình, hãy kết nối với cộng đồng —
          không cần chờ đến đúng &ldquo;bài học&rdquo; nào đó.
        </p>
        <Link
          href="/portal/congdongai"
          className="inline-block rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
        >
          Kết nối cộng đồng →
        </Link>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-gray-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Câu hỏi thường gặp</p>
        </div>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <GemCard key={item.q}>
              <p className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.q}</p>
              <p className="text-sm leading-relaxed text-gray-500">{item.a}</p>
            </GemCard>
          ))}
        </div>
      </div>
    </div>
  );
}
