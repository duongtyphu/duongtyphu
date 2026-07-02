import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  PenTool,
  Bookmark,
  MessageCircleQuestion,
  Heart,
  Leaf,
  Sun,
  Droplet,
  Star,
  Sprout,
  Quote,
  type LucideIcon,
} from "lucide-react";
import {
  gardenStats,
  RECENT_ACTIVITIES,
  GARDEN_QUOTE_SMALL,
  GARDEN_CARE_TIP,
  CARE_SUGGESTIONS,
  GARDEN_FOOTER_QUOTE,
  LEAF_ACTIONS,
  type LeafActionKey,
} from "@/data/portal/knowledge-garden";

/**
 * Khu vườn của bạn — được xây theo Official Design Reference
 * VDAI-GARDEN-001 (xem design-system/visual-dna/references/). Đây là
 * bản tái hiện (RECREATE MODE), không redesign — bố cục, màu sắc, vị
 * trí visual chính giữ đúng theo ảnh Founder đã duyệt.
 *
 * Nền là MỘT ảnh cây liên tục phủ toàn bộ trang (không chia thành các
 * khối/box riêng biệt) — mọi nội dung (title, card, stats, quote) nổi
 * lên trên nền ảnh đó, đúng như Reference.
 */

export const metadata = {
  title: "Khu vườn của bạn",
  description: "Mỗi hành động nhỏ, đều đang vun đắp cho sự trưởng thành.",
};

const LEAF_ICON: Record<LeafActionKey, LucideIcon> = {
  read: BookOpen,
  learn: GraduationCap,
  practice: PenTool,
  save: Bookmark,
  ask: MessageCircleQuestion,
  share: Heart,
  challenge: Star,
  explore: Sprout,
};

// Vị trí leaf chip trên nền ảnh toàn trang — tính theo % khớp với
// garden-full-bg.jpg (crop x:580-1347, y:0-1168 từ VDAI-GARDEN-001.png).
const LEAF_POSITION: Record<LeafActionKey, { top: string; left: string }> = {
  read: { top: "13%", left: "36%" },
  learn: { top: "16%", left: "77%" },
  practice: { top: "26%", left: "26%" },
  save: { top: "27%", left: "47%" },
  ask: { top: "30%", left: "77%" },
  share: { top: "41%", left: "41%" },
  challenge: { top: "0%", left: "0%" },
  explore: { top: "0%", left: "0%" },
};

const LEAF_CHIPS_SHOWN: LeafActionKey[] = ["read", "learn", "practice", "save", "ask", "share"];

const STATS = [
  { icon: Leaf, value: String(gardenStats.totalLeaves), label: "Chiếc lá", tone: "text-green-600" },
  { icon: Sun, value: String(gardenStats.streakDays), label: "Ngày hoạt động", tone: "text-amber-500" },
  { icon: Droplet, value: `${gardenStats.totalHours}h`, label: "Thời gian học", tone: "text-blue-500" },
  { icon: Star, value: String(gardenStats.topicsCompleted), label: "Chủ đề khám phá", tone: "text-yellow-500" },
];

const RECENT_TONE: Record<LeafActionKey, string> = {
  read: "text-green-600 bg-green-50",
  learn: "text-green-600 bg-green-50",
  practice: "text-blue-500 bg-blue-50",
  save: "text-amber-500 bg-amber-50",
  ask: "text-green-600 bg-green-50",
  share: "text-rose-500 bg-rose-50",
  challenge: "text-yellow-500 bg-yellow-50",
  explore: "text-green-600 bg-green-50",
};

export default function KnowledgeGardenPage() {
  return (
    <div className="garden-page relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      {/* Nền toàn trang: MỘT ảnh cây liên tục, không chia khối */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/garden/garden-full-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[75%_0%]"
          priority
        />
        {/* Gradient trắng ngọc phủ dần từ trái sang để chữ luôn đọc được,
            tiếp nối tự nhiên với vùng ảnh có sẵn (không phải một khối cứng) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(255,253,247,0.97) 0%, rgba(255,253,247,0.93) 24%, rgba(255,253,247,0.55) 40%, rgba(255,253,247,0.1) 56%, transparent 68%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,253,247,0.4) 0%, transparent 18%, transparent 78%, rgba(255,253,247,0.65) 100%)",
          }}
        />
        <div className="garden-sunray" aria-hidden="true" />
        <span className="garden-sparkle" style={{ top: "9%", left: "58%", width: 4, height: 4, animationDelay: "0s" }} />
        <span className="garden-sparkle" style={{ top: "22%", left: "85%", width: 3, height: 3, animationDelay: "1s" }} />
        <span className="garden-sparkle" style={{ top: "35%", left: "70%", width: 3, height: 3, animationDelay: "2s" }} />
      </div>

      {/* Leaf chip nổi trực tiếp trên nền ảnh toàn trang */}
      {LEAF_CHIPS_SHOWN.map((key) => {
        const Icon = LEAF_ICON[key];
        const action = LEAF_ACTIONS.find((a) => a.key === key)!;
        return (
          <div
            key={key}
            className="garden-leaf-chip-photo absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 px-3 py-2 text-center lg:flex"
            style={LEAF_POSITION[key]}
          >
            <Icon className="h-4 w-4 text-white" />
            <span className="text-xs font-bold text-white">{action.label}</span>
            <span className="text-[10px] text-white/75">{action.time}</span>
          </div>
        );
      })}

      <div className="relative z-10 space-y-8 px-4 py-6 md:px-8 md:py-8">
        {/* Header + hero content — bên trái, nổi trên nền ảnh chung */}
        <div className="max-w-md">
          <span className="text-2xl">🌿</span>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Khu vườn của bạn</h1>
          <p
            className="mt-2 bg-clip-text text-lg font-medium italic leading-snug text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #2563EB, #7C3AED, #F97316)" }}
          >
            Mỗi hành động nhỏ,
            <br />
            đều đang vun đắp cho sự trưởng thành.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
            Đây là nơi Companion ghi nhận hành trình học tập, khám phá và trưởng thành của bạn mỗi
            ngày.
          </p>

          {/* Card "Cây tri thức của bạn" */}
          <div className="gemos-gem-card mt-6 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="gemos-card-title text-sm font-bold text-gray-900">
                Cây tri thức của bạn
              </h3>
              <span className="text-sm font-extrabold text-gray-900">Lv. {gardenStats.level}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">Đang lớn lên mỗi ngày 🌱</span>
              <span className="font-semibold text-amber-500">{gardenStats.tierName}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                  style={{ width: `${gardenStats.percentToNextLevel}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {gardenStats.percentToNextLevel}%
              </span>
            </div>
          </div>

          {/* Stats 2x2 */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="gemos-gem-card rounded-2xl p-3 text-center">
                <s.icon className={`mx-auto h-4 w-4 ${s.tone}`} />
                <p className="mt-1 text-base font-extrabold text-gray-900">{s.value}</p>
                <p className="text-[10px] leading-snug text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quote nhỏ */}
          <div className="mt-4 rounded-xl border border-green-100 bg-green-50/70 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs leading-relaxed text-green-800">
              <span className="mr-1">🌱</span>
              {GARDEN_QUOTE_SMALL}
            </p>
          </div>
        </div>

        {/* Gợi ý chăm sóc khu vườn — nổi bên phải, trên nền ảnh cây */}
        <div className="gemos-glass-card max-w-xs rounded-2xl p-4 lg:absolute lg:right-8 lg:top-[38%] lg:max-w-sm xl:right-16">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-700">
            <span className="mt-0.5 shrink-0">🪴</span>
            <span>
              <span className="font-semibold text-gray-900">Gợi ý chăm sóc khu vườn. </span>
              {GARDEN_CARE_TIP}
            </span>
          </p>
        </div>

        {/* Section dưới: 2 card */}
        <div className="grid gap-6 pt-4 lg:grid-cols-2 lg:pt-24">
          {/* Những chiếc lá gần đây */}
          <div className="gemos-gem-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="gemos-card-title text-base font-bold text-gray-900">
                Những chiếc lá gần đây
              </h2>
              <Link href="#" className="text-xs font-semibold text-blue-600 hover:underline">
                Xem tất cả →
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {RECENT_ACTIVITIES.map((a) => {
                const Icon = LEAF_ICON[a.actionKey];
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${RECENT_TONE[a.actionKey]}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="min-w-0 flex-1 text-xs text-gray-700 sm:text-sm">
                      <span className="font-semibold text-gray-900">{a.label}:</span> {a.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chăm sóc khu vườn */}
          <div className="gemos-gem-card relative overflow-hidden rounded-2xl p-5">
            <h2 className="gemos-card-title text-base font-bold text-gray-900">Chăm sóc khu vườn</h2>
            <p className="text-xs text-gray-400">Gợi ý cho hôm nay</p>
            <div className="relative mt-4 space-y-3 pr-20 sm:pr-28">
              {CARE_SUGGESTIONS.map((c, i) => (
                <div key={c.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                    {i === 0 && <Sun className="h-4 w-4" />}
                    {i === 1 && <Sprout className="h-4 w-4" />}
                    {i === 2 && <Heart className="h-4 w-4 text-rose-500" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 h-24 w-20 overflow-hidden rounded-xl opacity-90 sm:h-28 sm:w-24">
              <Image
                src="/images/garden/garden-care-visual.jpg"
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Footer riêng — không dùng Footer Portal */}
        <footer className="gemos-glass-card mt-8 rounded-3xl p-8 text-center">
          <Quote className="mx-auto h-6 w-6 text-blue-200" />
          <p className="mx-auto mt-3 max-w-lg whitespace-pre-line text-sm leading-relaxed text-gray-700 sm:text-base">
            {GARDEN_FOOTER_QUOTE}
          </p>
        </footer>
      </div>
    </div>
  );
}
