// Tách khỏi `actions.ts` — file đó có `"use server"`, chỉ được export hàm
// async (Next.js chặn export const/array khác — lỗi build "A 'use server'
// file can only export async functions, found object"). Hằng số dùng chung
// (Server Action lẫn Client Component) phải nằm ở module RIÊNG không có
// directive này.

// Khớp đúng 9 khoá GLOSSARY_CATS trong mockup gốc (label/icon/màu vẫn giữ
// tĩnh trong code Portal — xem docblock GlossaryClient.tsx).
export const GLOSSARY_CATEGORY_OPTIONS = [
  "foundation",
  "technique",
  "data",
  "model_training",
  "agent_automation",
  "safety_ethics",
  "generation",
  "infra",
  "business",
] as const;
