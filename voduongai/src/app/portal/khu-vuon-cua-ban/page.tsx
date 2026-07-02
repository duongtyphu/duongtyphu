import {
  BookOpen,
  GraduationCap,
  PenTool,
  Bookmark,
  MessageCircleQuestion,
  Sparkles,
  Leaf,
  Clock,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { GardenTreeVisual } from "@/components/portal/garden/GardenTreeVisual";
import {
  gardenStats,
  gardenToday,
  RECENT_ACTIVITIES,
  GARDEN_CARE_TIP,
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
  inspire: Sparkles,
};

const ACHIEVEMENTS = [
  { label: "Tổng lá đã gieo", value: String(gardenStats.totalLeaves) },
  { label: "Tổng thời gian học", value: `${gardenStats.totalHours} giờ` },
  { label: "Ngày liên tiếp", value: String(gardenStats.streakDays) },
  { label: "Chủ đề đã chinh phục", value: String(gardenStats.topicsCompleted) },
  { label: "Cấp độ vườn", value: gardenStats.gardenLevel },
  { label: "Đến cấp tiếp theo", value: `${gardenStats.percentToNextLevel}%` },
];

export default function KnowledgeGardenPage() {
  return (
    <div className="space-y-10">
      {/* A. Header nội dung */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900">Khu vườn của bạn 🌿</h1>
        <p
          className="max-w-2xl bg-clip-text text-base font-medium italic leading-relaxed text-transparent [letter-spacing:0.01em]"
          style={{ backgroundImage: "linear-gradient(90deg, #2563EB, #7C3AED, #F97316)" }}
        >
          Mỗi hành động đều là một chiếc lá – mỗi chiếc lá là một bước bạn trưởng thành.
        </p>
      </div>

      {/* B. Hero — 2 cột */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Vườn đang lớn lên mỗi ngày
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
            Bạn đã gieo những hạt giống tri thức. Hãy tiếp tục chăm sóc khu vườn của mình để nó
            ngày càng tươi tốt hơn.
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
        </div>

        {/* Cây lớn bên phải */}
        <div className="relative">
          <GardenTreeVisual />
          {/* E. Gợi ý chăm sóc khu vườn — nổi trên khu vực cây */}
          <div className="gemos-glass-card absolute -bottom-6 left-1/2 w-[92%] -translate-x-1/2 rounded-2xl p-4 sm:w-[85%]">
            <p className="text-xs leading-relaxed text-gray-600">
              <span className="font-semibold text-green-700">Gợi ý chăm sóc: </span>
              {GARDEN_CARE_TIP}
            </p>
          </div>
        </div>
      </div>

      {/* D. Hoạt động gần đây */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Hoạt động gần đây</h2>
        <div className="space-y-2">
          {RECENT_ACTIVITIES.map((a) => {
            const Icon = ACTIVITY_ICON[a.actionKey];
            return (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{a.label}:</span> {a.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* F. Thành tích của bạn */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Thành tích của bạn</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ACHIEVEMENTS.map((item) => (
            <div key={item.label} className="gemos-gem-card rounded-2xl p-4 text-center">
              <p className="text-lg font-extrabold text-gray-900">{item.value}</p>
              <p className="mt-1 text-[11px] leading-snug text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
