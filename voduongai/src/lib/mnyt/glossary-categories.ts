/**
 * "Mỗi ngày một ý tưởng" — bảng màu/nhãn/icon 9 danh mục thuật ngữ Từ điển
 * (`mnyt_glossary.category`, khớp đúng `GLOSSARY_CATEGORY_OPTIONS` ở
 * `src/app/admin/(dashboard)/moi-ngay-mot-y-tuong/tu-dien/constants.ts`).
 * Dùng CHUNG cho gợi ý Từ điển ở Trang chủ và view Từ điển đầy đủ (Giai
 * đoạn 6) — Single Source of Truth, tránh mỗi nơi tự định nghĩa 1 bảng màu
 * khác nhau cho cùng 9 danh mục.
 */
export type MnytGlossaryCategoryMeta = { key: string; labelVi: string; labelEn: string; color: string; iconPath: string };

export const MNYT_GLOSSARY_CATEGORIES: readonly MnytGlossaryCategoryMeta[] = [
  { key: "foundation", labelVi: "Nền tảng", labelEn: "Foundation", color: "#a78bfa", iconPath: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" },
  { key: "technique", labelVi: "Kỹ thuật", labelEn: "Technique", color: "#67e8f9", iconPath: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" },
  { key: "data", labelVi: "Dữ liệu", labelEn: "Data", color: "#6ee7b7", iconPath: "M12 4c-4.4 0-8 1.1-8 2.5S7.6 9 12 9s8-1.1 8-2.5S16.4 4 12 4ZM4 6.5V17c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V6.5M4 11.75c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5" },
  { key: "model_training", labelVi: "Huấn luyện mô hình", labelEn: "Model training", color: "#fbbf24", iconPath: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" },
  { key: "agent_automation", labelVi: "Agent & Tự động hoá", labelEn: "Agent & automation", color: "#f0abfc", iconPath: "M12 8V4H8M4 12H2M22 12h-2M7 20.7 5 19M17 20.7 19 19M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" },
  { key: "safety_ethics", labelVi: "An toàn & Đạo đức", labelEn: "Safety & ethics", color: "#fca5a5", iconPath: "M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" },
  { key: "generation", labelVi: "Sinh nội dung", labelEn: "Generation", color: "#c4b5fd", iconPath: "M9.5 2 12 6l4.5 1.5L12 9l-2.5 4-2.5-4L2.5 7.5 7 6 9.5 2ZM18 13l1.2 2.4L21.5 16.5l-2.3 1.1L18 20l-1.2-2.4-2.3-1.1 2.3-1.1Z" },
  { key: "infra", labelVi: "Hạ tầng", labelEn: "Infrastructure", color: "#93c5fd", iconPath: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01" },
  { key: "business", labelVi: "Ứng dụng doanh nghiệp", labelEn: "Business", color: "#fdba74", iconPath: "M3 21h18M6 21V9l6-4 6 4v12M10 21v-6h4v6" },
] as const;

export function getMnytGlossaryCategoryMeta(key: string): MnytGlossaryCategoryMeta {
  return MNYT_GLOSSARY_CATEGORIES.find((c) => c.key === key) ?? { key, labelVi: key, labelEn: key, color: "#a78bfa", iconPath: "M12 2 2 7l10 5 10-5-10-5Z" };
}

/**
 * Chọn N thuật ngữ gợi ý cho khối "Từ điển" ở Trang chủ — xoay theo NGÀY
 * (epoch-day), cùng logic "ý tưởng hôm nay". Tách khỏi `page.tsx` (Server
 * Component) vì eslint's `react-hooks/purity` coi mọi hàm export viết hoa
 * đầu là "component" và cấm gọi `Date.now()` trực tiếp trong thân hàm đó —
 * hàm thuần (không phải component) trong module `lib/` không bị áp quy tắc
 * này.
 */
export function pickMnytGlossaryTeaser<T>(glossary: readonly T[], count = 4): T[] {
  if (glossary.length === 0) return [];
  const n = Math.min(count, glossary.length);
  const dayIdx = Math.floor(Date.now() / 86400000);
  const start = (dayIdx * n) % glossary.length;
  return Array.from({ length: n }, (_, i) => glossary[(start + i) % glossary.length]);
}
