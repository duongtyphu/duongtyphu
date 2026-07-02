import {
  BookOpen,
  GraduationCap,
  PenTool,
  Bookmark,
  MessageCircleQuestion,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { LeafAction, LeafActionKey } from "@/data/portal/knowledge-garden";

const LEAF_ICON: Record<LeafActionKey, LucideIcon> = {
  read: BookOpen,
  learn: GraduationCap,
  practice: PenTool,
  save: Bookmark,
  ask: MessageCircleQuestion,
  inspire: Sparkles,
};

const LEAF_POSITION: Record<LeafActionKey, { top: string; left: string }> = {
  read: { top: "18%", left: "38%" },
  learn: { top: "12%", left: "62%" },
  practice: { top: "34%", left: "22%" },
  save: { top: "30%", left: "76%" },
  ask: { top: "52%", left: "48%" },
  inspire: { top: "48%", left: "68%" },
};

const SPARKLES = [
  { top: "8%", left: "20%", size: 4, delay: "0s" },
  { top: "22%", left: "82%", size: 3, delay: "0.8s" },
  { top: "40%", left: "10%", size: 3, delay: "1.6s" },
  { top: "60%", left: "88%", size: 4, delay: "2.4s" },
  { top: "15%", left: "50%", size: 3, delay: "1.1s" },
];

const FALLING_LEAVES = [
  { left: "20%", delay: "0s", size: 10 },
  { left: "55%", delay: "3s", size: 8 },
  { left: "75%", delay: "6s", size: 9 },
];

export function GardenTreeVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`garden-scene relative w-full rounded-3xl border border-amber-100 ${
        compact ? "h-40" : "h-80 sm:h-[26rem]"
      }`}
      aria-hidden="true"
    >
      <div className="garden-sunray" />

      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="garden-sparkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}

      {!compact &&
        FALLING_LEAVES.map((l, i) => (
          <span
            key={i}
            className="garden-leaf-fall"
            style={{ left: l.left, animationDelay: l.delay, top: 0 }}
          >
            <svg width={l.size} height={l.size * 1.3} viewBox="0 0 10 13" fill="none">
              <path
                d="M5 0C8 3 10 6 5 13C0 6 2 3 5 0Z"
                fill="#86EFAC"
                opacity={0.8}
              />
            </svg>
          </span>
        ))}

      {/* Trunk */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-md bg-gradient-to-t from-amber-800 to-amber-700"
        style={{ width: compact ? 10 : 18, height: compact ? "35%" : "40%" }}
      />

      {/* Canopy — layered soft blobs, không phải flat circle đơn điệu */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-green-300 via-green-500 to-green-600 shadow-[0_20px_50px_-15px_rgba(21,128,61,0.4)]"
        style={{
          bottom: compact ? "28%" : "32%",
          width: compact ? "70%" : "62%",
          height: compact ? "70%" : "62%",
        }}
      />
      <div
        className="absolute left-[30%] rounded-full bg-gradient-to-br from-green-200 via-green-400 to-green-500 opacity-90"
        style={{
          bottom: compact ? "40%" : "46%",
          width: compact ? "40%" : "34%",
          height: compact ? "40%" : "34%",
        }}
      />
      <div
        className="absolute right-[18%] rounded-full bg-gradient-to-br from-green-300 via-green-500 to-green-600 opacity-90"
        style={{
          bottom: compact ? "36%" : "42%",
          width: compact ? "36%" : "30%",
          height: compact ? "36%" : "30%",
        }}
      />

      {/* Leaf action chips */}
      {!compact && (
        <>
          {(Object.keys(LEAF_POSITION) as LeafActionKey[]).map((key) => {
            const Icon = LEAF_ICON[key];
            const pos = LEAF_POSITION[key];
            return (
              <div
                key={key}
                className="garden-leaf-chip group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-green-100 bg-white/90 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm backdrop-blur-sm"
                style={pos}
              >
                <Icon className="h-3.5 w-3.5 text-green-600" />
                <span className="hidden sm:inline">
                  {{
                    read: "Đọc bài viết",
                    learn: "Học bài học",
                    practice: "Thực hành",
                    save: "Lưu tài liệu",
                    ask: "Đặt câu hỏi",
                    inspire: "Cảm hứng",
                  }[key]}
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export type { LeafAction };
