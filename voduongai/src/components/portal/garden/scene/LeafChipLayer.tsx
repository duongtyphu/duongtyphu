import {
  BookOpen,
  GraduationCap,
  PenTool,
  Bookmark,
  MessageCircleQuestion,
  Heart,
  Star,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import {
  GARDEN_LEAVES,
  GARDEN_LEAF_BRANCH_POSITION,
  type LeafActionKey,
} from "@/data/portal/knowledge-garden";

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

/**
 * Leaf Chip Layer — Dynamic Leaf Layer. Mỗi chiếc lá là một component
 * độc lập (KHÔNG vẽ vào ảnh cây), dữ liệu đến từ `GARDEN_LEAVES` —
 * Companion thêm phần tử mới vào mảng đó khi người dùng có hành động
 * mới, không cần đổi component này hay Tree Layer.
 *
 * Mỗi lá: hình lá bo tròn (glassmorphism xanh lá nhẹ), icon + label
 * trắng, tooltip khi hover, animation sway nhẹ (+ "just-bloomed" khi
 * mới xuất hiện — dùng class `garden-leaf-just-bloomed`).
 */
export function LeafChipLayer() {
  return (
    <>
      {GARDEN_LEAVES.filter((leaf) => leaf.unlocked).map((leaf) => {
        const Icon = LEAF_ICON[leaf.type];
        const pos = GARDEN_LEAF_BRANCH_POSITION[leaf.position];
        return (
          <div
            key={leaf.id}
            className="garden-leaf-chip-photo group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 px-3 py-2 text-center"
            style={pos}
            title={leaf.tooltip}
          >
            <Icon className="h-4 w-4 text-white drop-shadow-[0_1px_3px_rgba(21,62,33,0.65)]" strokeWidth={1.9} />
            <span className="text-xs font-bold text-white drop-shadow-[0_1px_3px_rgba(21,62,33,0.65)]">
              {leaf.label}
            </span>
            <span className="text-[9px] font-medium text-white/80 drop-shadow-[0_1px_2px_rgba(21,62,33,0.6)]">
              {leaf.time}
            </span>
          </div>
        );
      })}
    </>
  );
}
