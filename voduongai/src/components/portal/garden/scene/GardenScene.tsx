import { TreeLayer } from "@/components/portal/garden/scene/TreeLayer";
import { WindLayer } from "@/components/portal/garden/scene/WindLayer";
import { SunlightLayer } from "@/components/portal/garden/scene/SunlightLayer";
import { BokehLayer } from "@/components/portal/garden/scene/BokehLayer";
import { SparkleLayer } from "@/components/portal/garden/scene/SparkleLayer";
import { LeafChipLayer } from "@/components/portal/garden/scene/LeafChipLayer";
import { GARDEN_TREE_CAPTION } from "@/data/portal/knowledge-garden";

/**
 * Garden Scene — hệ sinh thái sống của "Khu vườn của bạn", lắp ráp từ
 * các layer độc lập để Companion có thể mở rộng qua nhiều năm mà
 * KHÔNG cần đổi thiết kế gốc:
 *
 *   Tree Layer      — Official Tree Asset, cố định (Tree = Constant)
 *   Wind Layer      — chuyển động "thở" rất nhẹ bọc quanh Tree Layer
 *   Sunlight Layer  — ánh nắng thở nhẹ (Light = Companion)
 *   Bokeh Layer     — bụi sáng trôi rất chậm
 *   Sparkle Layer   — sparkle thoáng qua + lá rơi thưa thớt
 *   Leaf Chip Layer — lá hành động, component riêng, dữ liệu động
 *                     (Leaves = User Growth)
 *
 * Mọi layer đè lên nhau trong cùng một khung "cửa sổ" (`.garden-scene`
 * + vignette blend ở `::after`) để cảm giác là một khu vườn thật đang
 * tồn tại phía sau giao diện, không phải một tấm ảnh dán trong khung.
 */
export function GardenScene() {
  return (
    <div
      className="garden-scene relative h-80 w-full overflow-hidden rounded-3xl sm:h-96 lg:h-[30rem]"
      style={{ aspectRatio: "727 / 750" }}
    >
      <WindLayer>
        <TreeLayer />
      </WindLayer>

      <SunlightLayer />
      <BokehLayer />
      <SparkleLayer />
      <LeafChipLayer />

      {/* Bảng gỗ nhỏ gần gốc cây — chi tiết cảm xúc, không nổi bật quá */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md border border-amber-800/20 bg-gradient-to-b from-amber-100/90 to-amber-50/90 px-3 py-1.5 text-center shadow-sm backdrop-blur-sm">
        <p className="text-[10px] font-semibold text-amber-900">{GARDEN_TREE_CAPTION}</p>
      </div>
    </div>
  );
}
