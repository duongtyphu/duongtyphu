export type Tool = {
  id: string;
  name: string;
  category: "AI" | "Design" | "Video" | "Productivity" | "Automation" | "Hosting";
  description: string;
  useCase: string;
  link: string;
  affiliateUrl?: string;
  pricing: "Free" | "Freemium" | "Paid";
  iUseThis?: boolean;
};

export const tools: Tool[] = [
  { id: "chatgpt", name: "ChatGPT", category: "AI", description: "Trợ lý AI đa năng cho viết, nghiên cứu, lập kế hoạch.", useCase: "Viết nội dung, brainstorm, code", link: "https://chatgpt.com", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "claude", name: "Claude", category: "AI", description: "AI mạnh về suy luận dài, viết tự nhiên, phân tích tài liệu.", useCase: "Viết bài dài, phân tích dữ liệu", link: "https://claude.ai", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "gemini", name: "Gemini", category: "AI", description: "AI của Google, tích hợp sâu với Workspace.", useCase: "Tìm kiếm, tổng hợp thông tin", link: "https://gemini.google.com", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "canva", name: "Canva", category: "Design", description: "Thiết kế hình ảnh, video ngắn không cần kỹ năng thiết kế.", useCase: "Thiết kế ảnh bìa, social post", link: "https://canva.com", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "capcut", name: "CapCut", category: "Video", description: "Dựng video ngắn cho TikTok, YouTube Shorts.", useCase: "Edit video ngắn, phụ đề tự động", link: "https://capcut.com", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "heygen", name: "HeyGen", category: "Video", description: "Tạo video AI avatar nói theo script không cần quay.", useCase: "Video giới thiệu, video bán hàng", link: "https://heygen.com", affiliateUrl: "#", pricing: "Paid", iUseThis: true },
  { id: "hostinger", name: "Hostinger", category: "Hosting", description: "Hosting & domain chi phí thấp cho website/landing page.", useCase: "Host website cá nhân, landing page", link: "https://hostinger.com", affiliateUrl: "#", pricing: "Paid", iUseThis: true },
  { id: "notion", name: "Notion", category: "Productivity", description: "Quản lý tài liệu, dashboard, hệ thống vận hành cá nhân.", useCase: "Quản lý nội dung, theo dõi tiến độ", link: "https://notion.so", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "google-workspace", name: "Google Workspace", category: "Productivity", description: "Bộ công cụ email, drive, sheet chuyên nghiệp.", useCase: "Email thương hiệu, lưu trữ dữ liệu", link: "https://workspace.google.com", affiliateUrl: "#", pricing: "Paid", iUseThis: true },
  { id: "n8n", name: "n8n", category: "Automation", description: "Tự động hoá quy trình, kết nối nhiều công cụ với nhau.", useCase: "Tự động hoá content, lead nuôi dưỡng", link: "https://n8n.io", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "make", name: "Make", category: "Automation", description: "Nền tảng automation kéo-thả, dễ dùng cho người không code.", useCase: "Tự động đồng bộ dữ liệu giữa các app", link: "https://make.com", affiliateUrl: "#", pricing: "Freemium", iUseThis: true },
  { id: "figma", name: "Figma", category: "Design", description: "Thiết kế UI/UX, wireframe sản phẩm số chuyên nghiệp.", useCase: "Thiết kế landing page, mockup Portal", link: "https://figma.com", affiliateUrl: "#", pricing: "Freemium" },
];
