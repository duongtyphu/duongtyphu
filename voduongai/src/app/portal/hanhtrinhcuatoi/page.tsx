import Link from "next/link";
import { BookOpen, Sparkles, Notebook, Compass, Gem, ArrowRight } from "lucide-react";
import { GrowthActivityPanel } from "@/components/portal/growth/GrowthActivityPanel";
import { CompanionMemoryLine } from "@/components/portal/companion/CompanionMemoryLine";
import { CurrentChapterCard } from "@/components/portal/journey/CurrentChapterCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";

export const metadata = {
  title: "Hành trình của tôi",
  description: "Nơi tiến bộ thật của bạn trở thành một câu chuyện có ý nghĩa — không phải một dashboard.",
};

/**
 * JOURNEY PLATFORM — Phase P1: Journey Hub.
 * Theo JOURNEY_PLATFORM_ARCHITECTURE.md (đã được Product Owner duyệt):
 * Hub là CỔNG VÀO CANONICAL duy nhất của 5 cánh cửa Journey. Cấu trúc
 * đúng 6 khối: (1) lời chào Companion (một sự hiện diện duy nhất —
 * CompanionMemoryLine đọc GrowthEvent thật), (2) chương hiện tại (chỉ
 * khi có dữ liệu thật — CurrentChapterCard), (3) 5 thẻ cánh cửa mỗi thẻ
 * một nhận diện riêng, (4) hoạt động có ý nghĩa gần đây (growth-view
 * thật), (5) MỘT câu hỏi suy ngẫm, (6) MỘT hành động tiếp tục.
 *
 * KHÔNG dashboard. KHÔNG % giả. KHÔNG level giả. KHÔNG milestone giả.
 * Các khối cũ đã gỡ khỏi Hub: JourneyHero (CTA trỏ ra ngoài Journey),
 * HubModuleGrid (module cũ chứa mục không có href thật), RelatedActions,
 * KnowledgeJourneyStrip, panel Garden trùng lặp — component nguồn vẫn
 * được giữ trong repo theo kế hoạch bảo tồn nội dung (mục 13).
 */

type JourneyDoor = {
  key: string;
  icon: typeof BookOpen;
  title: string;
  essence: string;
  meaning: string;
  realData: string;
  cta: { label: string; href: string } | { label: string; comingSoon: true };
  surface: { card: string; chip: string; strip: string };
};

const DOORS: JourneyDoor[] = [
  {
    key: "story",
    icon: BookOpen,
    title: "My Story",
    essence: "Cuốn sách cá nhân đang được viết theo thời gian.",
    meaning: "Chương, khoảnh khắc và bước ngoặt — để bạn nhìn lại mình đã đi xa đến đâu.",
    realData: "Suy ngẫm, ký ức bạn tự lưu, thư tháng và lịch sử thật của bạn.",
    cta: { label: "Mở cuốn sách", href: "/portal/story" },
    surface: {
      card: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white hover:border-amber-400",
      chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
      strip: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
  },
  {
    key: "mirror",
    icon: Sparkles,
    title: "Mirror",
    essence: "Không gian soi chiếu — bình thản và không phán xét.",
    meaning: "Companion nhẹ nhàng phản chiếu bạn đang trở thành ai — chỉ khi có bằng chứng thật.",
    realData: "Tín hiệu trưởng thành, cột mốc và suy ngẫm thật của bạn.",
    cta: { label: "Soi chiếu", href: "/portal/mirror" },
    surface: {
      card: "border-violet-200 bg-gradient-to-br from-violet-50 via-indigo-50/40 to-white hover:border-violet-400",
      chip: "bg-gradient-to-br from-violet-600 to-indigo-600 text-white",
      strip: "bg-gradient-to-r from-violet-600 to-indigo-600",
    },
  },
  {
    key: "journal",
    icon: Notebook,
    title: "Nhật ký học tập",
    essence: "Bản ghi học tập cá nhân — không phải trang bài viết.",
    meaning: "Chuyện gì đã xảy ra, bạn học được gì, tạo ra gì, và nên tiếp tục gì.",
    realData: "Hoạt động học và làm việc thật của bạn trong Portal.",
    cta: { label: "Mở nhật ký", href: "/portal/nhatkyhoctap" },
    surface: {
      card: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50/40 to-white hover:border-emerald-400",
      chip: "bg-gradient-to-br from-emerald-600 to-green-600 text-white",
      strip: "bg-gradient-to-r from-emerald-600 to-green-600",
    },
  },
  {
    key: "map",
    icon: Compass,
    title: "Hành trình của tôi",
    essence: "Bản đồ các Chương cuộc đời của bạn.",
    meaning: "Chương, cột mốc, output và hướng đang đi — không có thanh phần trăm nào.",
    realData: "Bằng chứng thật từ hoạt động của bạn (xem Chương hiện tại phía trên).",
    // P2 sẽ mở trang bản đồ đầy đủ tại /portal/hanhtrinhcuatoi/ban-do —
    // nói thật là đang xây thay vì đặt một link chết.
    cta: { label: "Bản đồ đang được vẽ — mở ở giai đoạn tiếp theo", comingSoon: true },
    surface: {
      card: "border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50/40 to-white hover:border-blue-400",
      chip: "bg-gradient-to-br from-blue-600 to-sky-600 text-white",
      strip: "bg-gradient-to-r from-blue-600 to-sky-600",
    },
  },
];

/** Một câu hỏi suy ngẫm duy nhất — xoay theo ngày, tĩnh và trung thực
 * (không gắn với số liệu bịa nào). */
const REFLECTION_PROMPTS = [
  "Việc gì tuần này bạn làm khác đi so với một tháng trước?",
  "Có Output nào bạn tạo ra mà chính bạn cũng bất ngờ vì nó tốt hơn mong đợi?",
  "Có việc nào bạn từng né tránh, giờ đã dám bắt đầu thử?",
  "Nếu dừng lại hôm nay, điều gì bạn tự hào nhất về quãng đường đã đi?",
];

function todaysPrompt(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return REFLECTION_PROMPTS[dayOfYear % REFLECTION_PROMPTS.length];
}

export default function JourneyHubPage() {
  return (
    <div className="space-y-10">
      {/* ── Cổng vào Hub ─────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-7 shadow-token-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">📖 Hành trình của tôi</p>
        <h1 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
          Qua quá trình này, bạn đã trở thành ai?
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
          Đây không phải trang tiến độ. Đây là nơi những gì bạn thực sự đã học, đã làm và đã
          suy ngẫm trở thành một câu chuyện của riêng bạn — được kể bằng năm cách khác nhau.
        </p>
      </section>

      {/* ── 1. Companion chào — MỘT sự hiện diện duy nhất trên Hub ────── */}
      <CompanionMemoryLine
        emptyMessage="Companion chưa có gì để nhớ về hành trình của bạn — nó sẽ bắt đầu ghi nhớ từ hoạt động thật đầu tiên. Sự im lặng lúc này cũng là một phần của câu chuyện."
        contextTemplate="Tôi vẫn nhớ — lần gần nhất ở đây, bạn đã {activity}. Điều đó đã thay đổi gì trong bạn?"
        action={{ label: "Tiếp tục trong Workspace", href: "/portal/workspace" }}
      />

      {/* ── 2. Chương hiện tại (chỉ khi có dữ liệu thật) ───────────────── */}
      <CurrentChapterCard />

      {/* ── 3. Năm cánh cửa ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          eyebrow="Năm cánh cửa"
          title="Một hành trình — năm cách nhìn lại"
          description="Mỗi cánh cửa đọc cùng một lớp dữ liệu thật của bạn và kể nó theo một cách riêng."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {DOORS.map((door) => (
            <article
              key={door.key}
              className={`overflow-hidden rounded-2xl border p-5 shadow-token-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-token-lg sm:p-6 ${door.surface.card}`}
            >
              <div className={`-mx-5 -mt-5 mb-4 h-1.5 sm:-mx-6 sm:-mt-6 ${door.surface.strip}`} aria-hidden />
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${door.surface.chip}`}>
                  <door.icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{door.title}</h3>
              <p className="mt-1 text-xs font-semibold text-gray-700">{door.essence}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{door.meaning}</p>
              <p className="mt-2 text-[11px] text-gray-400">
                <span className="font-semibold text-gray-500">Dữ liệu thật:</span> {door.realData}
              </p>
              <div className="mt-4">
                {"comingSoon" in door.cta ? (
                  <span className="inline-flex rounded-full border border-dashed border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-400">
                    {door.cta.label}
                  </span>
                ) : (
                  <Link
                    href={door.cta.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
                  >
                    {door.cta.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </article>
          ))}

          {/* Cánh cửa 5 — Khu vườn: nền riêng biệt theo GARDEN_VISUAL_DIRECTION.md
           * (midnight + emerald + ánh ngọc), không nền grid/ca-rô. Cấu trúc
           * và dữ liệu Garden thật hiện có được giữ nguyên. */}
          <article className="relative overflow-hidden rounded-2xl border border-emerald-900/40 p-5 shadow-token-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-token-lg sm:col-span-2 sm:p-6"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 70% at 75% 20%, rgba(52,211,153,0.16), transparent), radial-gradient(ellipse 40% 50% at 20% 85%, rgba(251,191,36,0.14), transparent), linear-gradient(150deg, #0A1128 0%, #0E1F3A 55%, #0B2A26 100%)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_-2px_rgba(52,211,153,0.5)]">
                <Gem className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white">Khu vườn của bạn</h3>
                <p className="mt-1 text-xs font-semibold text-emerald-200/90">
                  Khu vườn sống — nơi trưởng thành của bạn hiện thân thành Cây và Viên ngọc.
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                  Mỗi phần tử trong vườn mọc từ việc học thật — không thể tưới bằng dữ liệu giả.
                </p>
                <p className="mt-2 text-[11px] text-white/40">
                  <span className="font-semibold text-white/60">Dữ liệu thật:</span> Hoạt động, output và cột mốc thật nuôi khu vườn.
                </p>
                <Link
                  href="/portal/khuvuoncuaban"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
                >
                  Bước vào vườn <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── 4. Hoạt động có ý nghĩa gần đây (dữ liệu thật) ─────────────── */}
      <section>
        <SectionHeader
          eyebrow="Gần đây"
          title="Hoạt động có ý nghĩa của bạn"
          description="Chỉ những gì bạn thực sự đã làm — không phải phần trăm ước lượng."
        />
        <GrowthActivityPanel variant="journey" />
      </section>

      {/* ── 5. MỘT câu hỏi suy ngẫm ────────────────────────────────────── */}
      <GemCard>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Câu hỏi hôm nay</p>
        <p className="mt-2 text-base font-semibold leading-relaxed text-gray-800">{todaysPrompt()}</p>
        <Button href="/portal/mirror" variant="secondary" className="mt-4">
          Ngẫm cùng Mirror →
        </Button>
      </GemCard>

      {/* ── 6. MỘT hành động tiếp tục ──────────────────────────────────── */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center sm:p-7">
        <p className="text-sm text-gray-600">
          Câu chuyện chỉ dài thêm bằng những việc thật.
        </p>
        <Button href="/portal/workspace" variant="primary" className="mt-3">
          Tiếp tục hành trình →
        </Button>
      </section>
    </div>
  );
}
