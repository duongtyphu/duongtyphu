import Image from "next/image";

/**
 * Tree Layer — Official Tree Asset (Design Reference VDAI-GARDEN-001).
 *
 * Product Principle: Tree = Constant. Cây không đại diện cho tiến
 * trình, không đổi kích thước/hình dạng/màu/vị trí theo sự trưởng
 * thành của người dùng — giống như Companion luôn hiện diện, không
 * đổi. KHÔNG được thay ảnh, recolor, crop khác, hay AI-generate lại.
 *
 * Layer này CHỈ chứa ảnh cây. Mọi chuyển động (rung nhẹ theo gió) nằm
 * ở WindLayer bọc bên ngoài — Tree Layer không tự animate.
 */
export function TreeLayer() {
  return (
    <Image
      src="/images/garden/garden-tree-scene.jpg"
      alt="Cây tri thức trong khu vườn của bạn, ánh nắng buổi sáng chiếu qua tán lá"
      fill
      sizes="(min-width: 1024px) 55vw, 100vw"
      className="object-cover"
      priority
    />
  );
}
