export type CommunityChannel = {
  id: string;
  platform: "Facebook" | "YouTube" | "TikTok" | "Zalo" | "Telegram" | "Email" | "Newsletter";
  label: string;
  url: string;
  status: "Active" | "Inactive";
};

export const communityChannelsSeed: CommunityChannel[] = [
  { id: "ch_1", platform: "Facebook", label: "Facebook Group", url: "https://www.facebook.com/groups/24279131375123067", status: "Active" },
  { id: "ch_2", platform: "YouTube", label: "YouTube Channel", url: "https://www.youtube.com/@voduongofficial", status: "Active" },
  { id: "ch_3", platform: "TikTok", label: "TikTok", url: "https://www.tiktok.com/@vdai_academy", status: "Active" },
  { id: "ch_4", platform: "Zalo", label: "Zalo Group", url: "https://zalo.me/g/fcudmw102", status: "Active" },
  { id: "ch_5", platform: "Telegram", label: "Telegram", url: "", status: "Inactive" },
];
