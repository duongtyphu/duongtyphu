import Link from "next/link";
import { GraduationCap, HelpCircle } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { JourneyCard } from "@/features/academy/components/JourneyCard";
import { LandingPageMissionPilot } from "@/features/academy/components/LandingPageMissionPilot";
import { getAllLearningJourneys } from "@/features/academy/services/journey.service";

export const metadata = {
  title: "Học viện",
  description: "Academy Operating System — nơi tri thức được chuyển hoá thành thực hành, năng lực và cảm nhận trưởng thành.",
};

const FAQ = [
  {
    q: "Học viện có phải là khoá học không?",
    a: "Không. Học viện không bán khoá học — Học viện dẫn bạn qua một hành trình thực hành thật, dựa trên tri thức đã có trong Thư viện tri thức.",
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
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <GraduationCap className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Học viện</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Hôm nay bạn tốt hơn hôm qua</h1>
        <p className="max-w-2xl text-gray-500">
          Học viện không phải nơi chứa khoá học. Đây là nơi tri thức bạn đã học được chuyển hoá
          thành thực hành thật, năng lực thật và cảm nhận trưởng thành thật.
        </p>
      </div>

      {/* Companion Guide */}
      <CompanionGuide
        message="Chọn một hành trình bên dưới và bắt đầu từ bước Companion gợi ý — không cần làm hết mọi thứ cùng lúc."
        action={{ label: "Xem Thư viện tri thức", href: "/portal/library" }}
      />

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
          href="/portal/community"
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
            <div key={item.q} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-bold text-gray-900">{item.q}</p>
              <p className="text-sm leading-relaxed text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
