export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
  tier: "Free" | "Premium";
  status: "Active" | "Blocked";
  registeredAt: string;
  roadmapProgress: number;
  promptsCopied: number;
  toolsClicked: number;
  resourcesDownloaded: number;
};

export const usersSeed: AdminUserRow[] = [
  {
    id: "user_1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    role: "Member",
    tier: "Premium",
    status: "Active",
    registeredAt: "2026-03-10",
    roadmapProgress: 45,
    promptsCopied: 12,
    toolsClicked: 8,
    resourcesDownloaded: 4,
  },
  {
    id: "user_2",
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    role: "Member",
    tier: "Free",
    status: "Active",
    registeredAt: "2026-05-22",
    roadmapProgress: 15,
    promptsCopied: 3,
    toolsClicked: 2,
    resourcesDownloaded: 1,
  },
];

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  leadMagnet: string;
  registeredAt: string;
  status: "New" | "Contacted" | "Converted";
  note?: string;
  tags: string[];
};

export const leadsSeed: AdminLead[] = [
  {
    id: "lead_1",
    name: "Lê Văn C",
    email: "levanc@gmail.com",
    phone: "0901234567",
    source: "Facebook Ads",
    leadMagnet: "AI Toolkit miễn phí",
    registeredAt: "2026-06-10",
    status: "New",
    tags: ["ai-toolkit"],
  },
  {
    id: "lead_2",
    name: "Phạm Thị D",
    email: "phamthid@gmail.com",
    source: "Blog AI",
    leadMagnet: "Ebook Affiliate",
    registeredAt: "2026-06-05",
    status: "Contacted",
    tags: ["affiliate"],
  },
];
