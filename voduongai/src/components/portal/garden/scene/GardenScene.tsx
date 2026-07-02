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
 *   Tree Layer      — Official Tree Asset, cố định (Tree = Constant) —
 *                     giờ là ảnh nền chung của cả hero (xem page.tsx),
 *                     không còn nằm riêng trong component này.
 *   Sunlight Layer  — ánh nắng thở nhẹ (Light = Companion)
 *   Bokeh Layer     — bụi sáng trôi rất chậm
 *   Sparkle Layer   — sparkle thoáng qua + lá rơi thưa thớt
 *   Leaf Chip Layer — lá hành động, component riêng, dữ liệu động
 *                     (Leaves = User Growth)
 *
 * GardenScene giờ chỉ là lớp hiệu ứng TRONG SUỐT nổi trên ảnh rừng
 * chung của hero — không có nền/khung riêng — để cây và các layer
 * cùng nằm trên một tấm ảnh liền mạch thay vì "ảnh dán trong hộp".
 */
export function GardenScene() {
  return (
    <div className="relative h-80 w-full sm:h-96 lg:h-[30rem]">
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
