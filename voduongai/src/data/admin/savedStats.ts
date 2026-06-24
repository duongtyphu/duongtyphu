export type SavedItemSchema = {
  id: string;
  userEmail: string;
  kind: "prompt" | "tool" | "resource" | "ebook" | "checklist" | "lesson" | "affiliate";
  refId: string;
  title: string;
  savedAt: string;
};

export const topSavedMock = {
  topPrompts: [
    { title: "Viết content viral cho Facebook", count: 184 },
    { title: "Phân tích đối thủ Affiliate", count: 96 },
  ],
  topTools: [
    { title: "ChatGPT", count: 312 },
    { title: "Canva", count: 201 },
  ],
  topEbooks: [
    { title: "Ebook: Bắt đầu Affiliate Marketing", count: 145 },
  ],
  topLessons: [
    { title: "Prompt Engineering cơ bản", count: 88 },
  ],
  topAffiliateProducts: [
    { title: "Hostinger", count: 67 },
  ],
};
