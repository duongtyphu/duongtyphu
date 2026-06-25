export type AdminResource = {
  id: string;
  name: string;
  slug: string;
  type: "Template" | "Ebook" | "Checklist" | "SOP" | "Tài nguyên";
  thumbnail?: string;
  description: string;
  fileUrl?: string;
  downloadLink?: string;
  category: string;
  tags: string[];
  tier: "Free" | "Premium";
  requiresSignup: boolean;
  featured: boolean;
  status: "Draft" | "Published" | "Hidden";
};

function seedFor(type: AdminResource["type"], prefix: string): AdminResource[] {
  return [
    {
      id: `${prefix}_1`,
      name: `${type} mẫu cho người mới`,
      slug: `${prefix}-mau`,
      type,
      description: `${type} hướng dẫn bắt đầu nhanh với AI.`,
      category: "Nhập môn",
      tags: ["ai", "starter"],
      tier: "Free",
      requiresSignup: false,
      featured: true,
      status: "Published",
    },
  ];
}

export const templatesSeed = seedFor("Template", "tpl");
export const ebooksSeed = seedFor("Ebook", "ebook");
export const checklistsSeed = seedFor("Checklist", "checklist");
export const sopSeed = seedFor("SOP", "sop");
export const resourcesSeed = seedFor("Tài nguyên", "res");
