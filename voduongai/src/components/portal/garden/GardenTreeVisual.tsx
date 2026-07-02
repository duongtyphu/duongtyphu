import {
  BookOpen,
  GraduationCap,
  PenTool,
  Bookmark,
  MessageCircleQuestion,
  Share2,
  Trophy,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { GROWTH_STAGES, type LeafActionKey } from "@/data/portal/knowledge-garden";

const LEAF_ICON: Record<LeafActionKey, LucideIcon> = {
  read: BookOpen,
  learn: GraduationCap,
  practice: PenTool,
  save: Bookmark,
  ask: MessageCircleQuestion,
  share: Share2,
  challenge: Trophy,
  explore: Compass,
};

const LEAF_LABEL: Record<LeafActionKey, string> = {
  read: "Đọc bài viết",
  learn: "Học bài học",
  practice: "Thực hành",
  save: "Lưu tài liệu",
  ask: "Đặt câu hỏi",
  share: "Chia sẻ",
  challenge: "Hoàn thành thử thách",
  explore: "Khám phá",
};

const LEAF_POSITION: Record<LeafActionKey, { top: string; left: string }> = {
  read: { top: "14%", left: "42%" },
  learn: { top: "10%", left: "66%" },
  practice: { top: "28%", left: "20%" },
  save: { top: "24%", left: "80%" },
  ask: { top: "46%", left: "50%" },
  share: { top: "42%", left: "72%" },
  challenge: { top: "58%", left: "30%" },
  explore: { top: "36%", left: "36%" },
};

const SPARKLES = [
  { top: "8%", left: "20%", size: 4, delay: "0s" },
  { top: "22%", left: "88%", size: 3, delay: "0.8s" },
  { top: "40%", left: "8%", size: 3, delay: "1.6s" },
  { top: "62%", left: "84%", size: 4, delay: "2.4s" },
  { top: "16%", left: "52%", size: 3, delay: "1.1s" },
  { top: "50%", left: "60%", size: 3, delay: "2.9s" },
];

const FALLING_LEAVES = [
  { left: "18%", delay: "0s", size: 10 },
  { left: "52%", delay: "3.2s", size: 8 },
  { left: "78%", delay: "6.4s", size: 9 },
];

const FLOWER_SPOTS = [
  { top: "20%", left: "44%" },
  { top: "32%", left: "60%" },
  { top: "26%", left: "34%" },
];

const FRUIT_SPOTS = [
  { top: "24%", left: "50%" },
  { top: "34%", left: "38%" },
];

/**
 * `stageIndex` (0-6) tương ứng GROWTH_STAGES — điều khiển kích thước
 * tán cây, màu ánh sáng và có hoa/quả hay không. Giai đoạn "Hạt giống"
 * (0) chỉ hiển thị một hạt nhỏ dưới đất, chưa có cây.
 */
export function GardenTreeVisual({ compact = false, stageIndex = 3 }: { compact?: boolean; stageIndex?: number }) {
  const stage = GROWTH_STAGES[Math.max(0, Math.min(GROWTH_STAGES.length - 1, stageIndex))];
  const isSeedOnly = stageIndex === 0;
  const canopyScale = 0.55 + Math.min(stageIndex, 4) * 0.11; // 0.55 -> ~1.0 khi trưởng thành
  const hasFlowers = stageIndex >= 4;
  const hasFruits = stageIndex >= 5;
  const isSpreading = stageIndex >= 6;

  return (
    <div
      className={`garden-scene relative w-full rounded-3xl border border-amber-100 ${
        compact ? "h-40" : "h-80 sm:h-[28rem]"
      }`}
      aria-hidden="true"
    >
      <div className="garden-sunray" style={{ background: `radial-gradient(circle, ${stage.glowColor}, transparent 65%)` }} />

      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="garden-sparkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}

      {!compact &&
        FALLING_LEAVES.map((l, i) => (
          <span key={i} className="garden-leaf-fall" style={{ left: l.left, animationDelay: l.delay, top: 0 }}>
            <svg width={l.size} height={l.size * 1.3} viewBox="0 0 10 13" fill="none">
              <path d="M5 0C8 3 10 6 5 13C0 6 2 3 5 0Z" fill="#86EFAC" opacity={0.8} />
            </svg>
          </span>
        ))}

      {isSeedOnly ? (
        /* Hạt giống — chưa có cây, chỉ một hạt nhỏ nằm trên đất */
        <div className="absolute bottom-4 left-1/2 h-3 w-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-700 to-amber-900" />
      ) : (
        <>
          {/* Trunk */}
          <div
            className="garden-tree-trunk absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-md bg-gradient-to-t from-amber-800 to-amber-700"
            style={{
              width: (compact ? 10 : 18) * Math.min(1, 0.6 + canopyScale * 0.4),
              height: compact ? "32%" : `${38 * canopyScale}%`,
            }}
          />

          {/* Canopy — layered soft blobs, cảm giác cây thật thở nhẹ, to dần theo giai đoạn */}
          <div
            className="garden-tree-canopy absolute left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-green-300 via-green-500 to-green-600"
            style={{
              bottom: compact ? "26%" : "30%",
              width: `${(compact ? 70 : 62) * canopyScale}%`,
              height: `${(compact ? 70 : 62) * canopyScale}%`,
              boxShadow: `0 20px 50px -15px rgba(21,128,61,0.4), 0 0 60px -10px ${stage.glowColor}`,
            }}
          />
          <div
            className="garden-tree-canopy absolute left-[30%] rounded-full bg-gradient-to-br from-green-200 via-green-400 to-green-500 opacity-90"
            style={{
              bottom: compact ? "38%" : "44%",
              width: `${(compact ? 40 : 34) * canopyScale}%`,
              height: `${(compact ? 40 : 34) * canopyScale}%`,
              animationDelay: "1.5s",
            }}
          />
          <div
            className="garden-tree-canopy absolute right-[16%] rounded-full bg-gradient-to-br from-green-300 via-green-500 to-green-600 opacity-90"
            style={{
              bottom: compact ? "34%" : "40%",
              width: `${(compact ? 36 : 30) * canopyScale}%`,
              height: `${(compact ? 36 : 30) * canopyScale}%`,
              animationDelay: "3s",
            }}
          />

          {/* Hoa — chỉ xuất hiện từ giai đoạn Cây nở hoa trở đi */}
          {!compact && hasFlowers && (
            <>
              {FLOWER_SPOTS.map((f, i) => (
                <span
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.6)]"
                  style={{ top: f.top, left: f.left }}
                />
              ))}
            </>
          )}

          {/* Quả — chỉ xuất hiện từ giai đoạn Cây kết trái trở đi */}
          {!compact && hasFruits && (
            <>
              {FRUIT_SPOTS.map((f, i) => (
                <span
                  key={i}
                  className="absolute h-3.5 w-3.5 rounded-full bg-gradient-to-br from-red-400 to-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                  style={{ top: f.top, left: f.left }}
                />
              ))}
            </>
          )}

          {/* Vòng sáng lan tỏa — chỉ ở giai đoạn cuối "Khu vườn lan tỏa" */}
          {!compact && isSpreading && (
            <div
              className="absolute left-1/2 top-[30%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: `radial-gradient(circle, ${stage.glowColor}, transparent 70%)`, filter: "blur(10px)" }}
            />
          )}
        </>
      )}

      {/* Cỏ + hoa trắng nhỏ dưới gốc cây */}
      {!compact && (
        <div className="absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-green-200/70 to-transparent" />
      )}

      {/* Leaf action chips */}
      {!compact && !isSeedOnly && (
        <>
          {(Object.keys(LEAF_POSITION) as LeafActionKey[]).map((key) => {
            const Icon = LEAF_ICON[key];
            const pos = LEAF_POSITION[key];
            return (
              <div
                key={key}
                className="garden-leaf-chip group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-green-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm backdrop-blur-sm"
                style={pos}
              >
                <Icon className="h-3.5 w-3.5 text-green-600" />
                <span className="hidden sm:inline">{LEAF_LABEL[key]}</span>
              </div>
            );
          })}
        </>
      )}

      {/* Bảng gỗ nhỏ dưới cây */}
      {!compact && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-amber-800/20 bg-gradient-to-b from-amber-100 to-amber-50 px-4 py-2 text-center shadow-sm">
          <p className="text-[11px] font-bold text-amber-900">Khu vườn này thuộc về bạn.</p>
          <p className="mt-0.5 text-[10px] text-amber-700/80">
            Companion chỉ là người bạn giúp bạn chăm sóc nó.
          </p>
        </div>
      )}
    </div>
  );
}
