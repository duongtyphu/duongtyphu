import {
  BookOpen,
  GraduationCap,
  PenTool,
  Bookmark,
  MessageCircleQuestion,
  Share2,
  Trophy,
  Compass,
  Leaf,
  Clock,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { GardenTreeVisual } from "@/components/portal/garden/GardenTreeVisual";
import { GardenProgressRing } from "@/components/portal/garden/GardenProgressRing";
import {
  gardenStats,
  gardenToday,
  RECENT_ACTIVITIES,
  GARDEN_CARE_TIP,
  GROWTH_STAGES,
  GROWTH_HISTORY,
  COMPANION_GROWTH_MESSAGES,
  getGrowthStage,
  type LeafActionKey,
} from "@/data/portal/knowledge-garden";

export const metadata = {
  title: "Khu vườn của bạn",
  description: "Mỗi hành động đều là một chiếc lá — mỗi chiếc lá là một bước bạn trưởng thành.",
};

const ACTIVITY_ICON: Record<LeafActionKey, LucideIcon> = {
  read: BookOpen,
  learn: GraduationCap,
  practice: PenTool,
  save: Bookmark,
  ask: MessageCircleQuestion,
  share: Share2,
  challenge: Trophy,
  explore: Compass,
};

const GARDEN_RESULTS = [
  { emoji: "🌿", value: String(gardenStats.totalLeaves), label: "Tổng lá" },
  { emoji: "🌱", value: `${gardenStats.totalHours} giờ`, label: "Nuôi dưỡng" },
  { emoji: "📅", value: String(gardenStats.streakDays), label: "Ngày liên tục" },
  { emoji: "🌳", value: gardenStats.gardenLevel, label: "Cấp độ vườn" },
  { emoji: "🍃", value: `${gardenStats.percentToNextLevel}%`, label: "đến mùa tiếp theo" },
];

export default function KnowledgeGardenPage() {
  const { stage, index } = getGrowthStage(gardenStats.totalLeaves);
  const nextStage = GROWTH_STAGES[index + 1];
  const companionMessage = COMPANION_GROWTH_MESSAGES[0];

  return (
    <div className="space-y-14">
      {/* Hero — 35/65 */}
      <div className="grid gap-8 lg:grid-cols-[35%_65%] lg:items-center">
        {/* LEFT — 35% */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Khu vườn của bạn 🌿</h1>
          <p
            className="mt-3 max-w-md bg-clip-text text-base font-medium italic leading-relaxed text-transparent [letter-spacing:0.01em]"
            style={{ backgroundImage: "linear-gradient(90deg, #2563EB, #7C3AED, #F97316)" }}
          >
            Mỗi hành động đều là một chiếc lá,
            <br />
            mỗi chiếc lá là một bước bạn trưởng thành.
          </p>

          <h2 className="mt-8 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Vườn đang lớn lên mỗi ngày
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
            Bạn đã gieo những hạt giống tri thức.
            <br />
            Mỗi lần học.
            <br />
            Mỗi lần thực hành.
            <br />
            Mỗi lần chia sẻ.
            <br />
            Khu vườn của bạn lại xanh hơn một chút.
          </p>

          {/* Card Hành trình hôm nay */}
          <div className="gemos-gem-card mt-6 rounded-2xl p-5">
            <h3 className="gemos-card-title text-sm font-bold text-gray-900">Hành trình hôm nay</h3>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <Leaf className="h-4 w-4 text-green-600" />
                <p className="text-lg font-extrabold text-gray-900">{gardenToday.newLeaves}</p>
                <p className="text-[11px] text-gray-500">Lá mới</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <p className="text-lg font-extrabold text-gray-900">{gardenToday.minutesLearned} phút</p>
                <p className="text-[11px] text-gray-500">Thời gian học</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Sprout className="h-4 w-4 text-orange-500" />
                <p className="text-lg font-extrabold text-gray-900">{gardenToday.seedsPlanted}</p>
                <p className="text-[11px] text-gray-500">Hạt giống gieo</p>
              </div>
            </div>
          </div>

          {/* Gợi ý — nhỏ, không nổi bật quá */}
          <div className="mt-4 rounded-xl border border-green-100 bg-green-50/50 px-4 py-3">
            <p className="text-xs leading-relaxed text-green-800">
              <span className="mr-1">🌱</span>
              {GARDEN_CARE_TIP}
            </p>
          </div>

          {/* Hoạt động gần đây */}
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
              Hoạt động gần đây
            </h2>
            <div className="space-y-2">
              {RECENT_ACTIVITIES.map((a) => {
                const Icon = ACTIVITY_ICON[a.actionKey];
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-xs text-gray-700 sm:text-sm">
                      <span className="font-semibold text-gray-900">{a.label}:</span> {a.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — 65%, linh hồn của trang */}
        <div className="relative">
          <GardenTreeVisual stageIndex={index} />
        </div>
      </div>

      {/* Cây của bạn đang ở giai đoạn nào? */}
      <section className="gemos-glass-card rounded-2xl p-6">
        <h2 className="text-base font-bold text-gray-900">Cây của bạn đang ở giai đoạn nào?</h2>
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <GardenProgressRing percent={gardenStats.percentToNextLevel} emoji={stage.emoji} />
          <div className="text-center sm:text-left">
            <p className="text-lg font-extrabold text-gray-900">
              {stage.emoji} {stage.label}
            </p>
            {nextStage && (
              <p className="mt-1 text-sm text-gray-500">
                {gardenStats.percentToNextLevel}% đến {nextStage.label.toLowerCase()}
              </p>
            )}
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">{stage.message}</p>
          </div>
        </div>
      </section>

      {/* Hành trình lớn lên */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Hành trình lớn lên</h2>
        <div className="relative space-y-6 border-l border-green-100 pl-6">
          {GROWTH_HISTORY.map((h) => (
            <div key={h.label} className="relative">
              <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
              <p className="text-sm font-bold text-gray-900">{h.label}</p>
              <p className="mt-0.5 text-sm text-gray-600">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companion message */}
      <section className="rounded-2xl border border-violet-100 bg-violet-50/60 p-6 text-center">
        <p className="mx-auto max-w-lg whitespace-pre-line text-sm leading-relaxed text-violet-800">
          {companionMessage}
        </p>
        <p className="mt-3 text-xs font-semibold text-violet-500">— Companion</p>
      </section>

      {/* Thành quả khu vườn */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Thành quả khu vườn</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {GARDEN_RESULTS.map((item) => (
            <div key={item.label} className="gemos-gem-card rounded-2xl p-4 text-center">
              <div className="text-xl">{item.emoji}</div>
              <p className="mt-1 text-lg font-extrabold text-gray-900">{item.value}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer riêng — nối tiếp nền, không dùng Footer Portal */}
      <footer className="border-t border-gray-100 pt-14 text-center">
        <p className="mx-auto max-w-md text-sm italic leading-relaxed text-gray-500">
          &ldquo;Cây không lớn trong một ngày.
          <br />
          Con người cũng vậy.
          <br />
          Companion sẽ tiếp tục đồng hành cùng bạn.&rdquo;
        </p>
      </footer>
    </div>
  );
}
