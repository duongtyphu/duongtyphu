import Link from "next/link";
import { ChevronRight, GraduationCap, BookOpen, Dumbbell, Sparkles, TrendingUp } from "lucide-react";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { ExperienceFlow } from "@/components/portal/ui/ExperienceFlow";
import { CompanionMemoryLine } from "@/components/portal/companion/CompanionMemoryLine";
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

      {/* Companion Guide */}
      <CompanionMemoryLine
        emptyMessage="Bạn chưa bắt đầu hành trình học nào trong Workspace — chọn một lộ trình bên dưới, Companion sẽ bắt đầu đồng hành từ đó."
        contextTemplate="Lần gần nhất, bạn đã {activity}. Đừng cố học hết mọi thứ trong một ngày — làm tiếp đúng một bước từ đó rồi dừng lại."
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

      {/* Portal 4.0 Content Creation — trước đây Academy chưa nói rõ một
       * Journey cần điều kiện gì trước khi bắt đầu, hay "xong" nghĩa là gì.
       * Nội dung giáo dục thật, áp dụng cho mọi hành trình. */}
      <section>
        <SectionHeader eyebrow="Trước khi chọn một hành trình" title="Cần gì trước, và 'xong' nghĩa là gì" />
        <div className="grid gap-4 sm:grid-cols-2">
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">Điều kiện tiên quyết</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-gray-600">
              <li>• Bạn không cần biết code hay có nền tảng kỹ thuật.</li>
              <li>• Bạn cần một công việc/mục tiêu cụ thể đang muốn làm tốt hơn — Academy dạy qua việc thật, không dạy lý thuyết suông.</li>
              <li>• Bạn cần khoảng 20-30 phút liên tục mỗi lần thực hành, thay vì đọc lướt qua nhiều bài cùng lúc.</li>
            </ul>
          </GemCard>
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">Tiêu chí hoàn thành</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Một hành trình không &ldquo;xong&rdquo; vì bạn đã đọc hết bài viết. Nó xong khi bạn tạo ra được
              một Output thật ở Workspace — một bản nháp, một quy trình, một kết quả — mà bạn có thể dùng
              lại cho công việc thật của mình. Nếu chưa có Output nào, hành trình vẫn đang dang dở, dù bạn
              đã đọc bao nhiêu bài.
            </p>
          </GemCard>
        </div>
      </section>

      {/* Learning Journey — Academy Operating System */}
      <div className="space-y-4">
        <SectionHeader eyebrow="Journey" title="Hành trình của bạn" />
        {journeys.length > 1 && (
          <p className="-mt-2 text-sm text-gray-500">
            Mỗi thẻ dưới đây hiển thị đúng giai đoạn thật của hành trình đó (Chuẩn bị/Luyện tập/Áp dụng...).
            Nếu nhiều hành trình đều đang ở giai đoạn <span className="font-semibold text-gray-900">Chuẩn bị</span>,
            chỉ chọn một để bắt đầu — mở nhiều hành trình cùng lúc là dấu hiệu bạn chưa sẵn sàng cho hành trình
            đó, không phải dấu hiệu đang tiến bộ nhanh.
          </p>
        )}
        {journeys.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-8 text-center text-sm text-gray-600">
            <p className="font-semibold text-gray-900">Chưa có hành trình nào ở đây.</p>
            <p className="mx-auto mt-2 max-w-md">
              Mỗi hành trình Academy chiếu trực tiếp từ một Bộ sưu tập trong Hệ tri thức AI (CKOS) — khi
              CKOS chưa có Bộ sưu tập nào, Academy không tự tạo hành trình giả để lấp chỗ trống.
            </p>
            <Link href="/portal/hetrithucai" className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:underline">
              Xem Hệ tri thức AI →
            </Link>
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
