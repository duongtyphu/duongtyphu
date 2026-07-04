/**
 * Companion World™ — asset registry cho các background chính thức của
 * Companion. Ảnh là sân khấu, Companion SVG là nhân vật — file này chỉ mô
 * tả sân khấu (đường dẫn + ý nghĩa), không chứa logic render.
 */

export type CompanionWorldAsset = {
  id: string;
  name: string;
  purpose: string;
  src: string;
  meaning: Record<string, string>;
};

export const CW_001_VALLEY_OF_LIGHT: CompanionWorldAsset = {
  id: "CW-001",
  name: "Valley of Light",
  purpose: "Hero background for Companion Home",
  src: "/assets/companion-world/cw-001-hero-master.webp",
  meaning: {
    sky: "những khả năng chưa được khám phá",
    aurora: "hy vọng luôn chuyển động",
    lake: "sự phản chiếu",
    mountains: "thử thách trưởng thành",
    flowers: "điều nhỏ bé cũng có thể soi sáng",
    stonePlatform: "nơi Companion đứng chờ",
    light: "Companion chỉ soi bước tiếp theo",
  },
};
