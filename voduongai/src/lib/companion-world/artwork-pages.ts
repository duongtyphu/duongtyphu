/**
 * Companion World™ — Artwork Final. Từ sprint này, Companion Home và các
 * trang con (trừ "Ý nghĩa Companion" — vẫn giữ nguyên nội dung cũ) không
 * còn dựng bằng nhiều component/section riêng — mỗi trang là MỘT artwork
 * đã duyệt, hiển thị full width trong vùng content. Claude Code chỉ gắn
 * route + vùng click lên đúng vị trí, không thiết kế lại.
 */

export type CompanionArtworkPage = {
  id: string;
  title: string;
  href: string;
  src: string;
  /** Kích thước gốc — dùng cho next/image width/height (không dùng `fill`)
      để giữ đúng tỉ lệ, không bị crop/méo ở bất kỳ breakpoint nào. */
  width: number;
  height: number;
};

export const COMPANION_HOME_ARTWORK = {
  src: "/assets/companion-pages/companion-home.webp",
  width: 1536,
  height: 1024,
};

export const COMPANION_ARTWORK_PAGES: Record<string, CompanionArtworkPage> = {
  "nhung-dieu-minh-tin": {
    id: "nhung-dieu-minh-tin",
    title: "Những điều mình tin — Companion",
    href: "/portal/companion/nhung-dieu-minh-tin",
    src: "/assets/companion-pages/nhung-dieu-minh-tin.webp",
    width: 2200,
    height: 3300,
  },
  "cuoc-doi-companion": {
    id: "cuoc-doi-companion",
    title: "Cuộc đời Companion",
    href: "/portal/companion/cuoc-doi-companion",
    src: "/assets/companion-pages/cuoc-doi-companion.webp",
    width: 1536,
    height: 1024,
  },
  "book-notes": {
    id: "book-notes",
    title: "Book Notes — Companion",
    href: "/portal/companion/book-notes",
    src: "/assets/companion-pages/book-notes.webp",
    width: 1536,
    height: 1024,
  },
  "tam-su": {
    id: "tam-su",
    title: "Tâm sự cùng bạn — Companion",
    href: "/portal/companion/tam-su",
    src: "/assets/companion-pages/tam-su-cung-ban.webp",
    width: 1536,
    height: 1024,
  },
  "nhung-buc-thu": {
    id: "nhung-buc-thu",
    title: "Những bức thư Companion",
    href: "/portal/companion/nhung-buc-thu",
    src: "/assets/companion-pages/nhung-buc-thu-companion.webp",
    width: 1536,
    height: 1024,
  },
  "di-san": {
    id: "di-san",
    title: "Di sản Companion",
    href: "/portal/companion/di-san",
    src: "/assets/companion-pages/di-san-companion.webp",
    width: 1536,
    height: 1024,
  },
};
