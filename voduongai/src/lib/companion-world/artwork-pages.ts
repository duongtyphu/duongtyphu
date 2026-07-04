/**
 * Companion World™ — "Companion qua hình ảnh". Companion Home giờ là nội
 * dung Sanctuary gốc (trước đây ở /portal/companion/y-nghia-companion) —
 * 7 artwork đã duyệt không còn là các trang riêng, mà gộp thành MỘT trang
 * duy nhất (`/portal/companion/companion-qua-hinh-anh`), hiển thị lần
 * lượt theo đúng thứ tự dưới đây.
 *
 * Quy chuẩn asset (chính thức, áp dụng cho mọi artwork Companion về sau):
 * - PNG chỉ dùng làm master lưu trữ/chỉnh sửa (không commit vào repo).
 * - WebP dùng để render trên website — convert bằng sharp (quality ~92),
 *   tối ưu tốc độ tải mà không giảm chất lượng nhìn thấy được. Mọi file
 *   trong `public/assets/companion-pages/` đều theo chuẩn này.
 */

export type CompanionArtwork = {
  id: string;
  title: string;
  src: string;
  /** Kích thước gốc — dùng cho next/image width/height (không dùng `fill`)
      để giữ đúng tỉ lệ, không bị crop/méo ở bất kỳ breakpoint nào. */
  width: number;
  height: number;
};

export const COMPANION_ARTWORK_SEQUENCE: CompanionArtwork[] = [
  {
    id: "companion-home",
    title: "Xin chào, mình là Companion",
    src: "/assets/companion-pages/companion-home.webp",
    width: 1536,
    height: 1024,
  },
  {
    id: "nhung-dieu-minh-tin",
    title: "Những điều mình tin",
    src: "/assets/companion-pages/nhung-dieu-minh-tin.webp",
    width: 2200,
    height: 3300,
  },
  {
    id: "cuoc-doi-companion",
    title: "Cuộc đời Companion",
    src: "/assets/companion-pages/cuoc-doi-companion.webp",
    width: 1536,
    height: 1024,
  },
  {
    id: "book-notes",
    title: "Book Notes",
    src: "/assets/companion-pages/book-notes.webp",
    width: 1536,
    height: 1024,
  },
  {
    id: "tam-su",
    title: "Tâm sự cùng bạn",
    src: "/assets/companion-pages/tam-su-cung-ban.webp",
    width: 1536,
    height: 1024,
  },
  {
    id: "nhung-buc-thu",
    title: "Những bức thư Companion",
    src: "/assets/companion-pages/nhung-buc-thu-companion.webp",
    width: 1536,
    height: 1024,
  },
  {
    id: "di-san",
    title: "Di sản Companion",
    src: "/assets/companion-pages/di-san-companion.webp",
    width: 1536,
    height: 1024,
  },
];
