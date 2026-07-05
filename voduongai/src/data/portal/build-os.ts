export type BuildPillar = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: "wallet" | "badge-check" | "settings" | "layers" | "building" | "gem";
};

export const buildPillars: BuildPillar[] = [
  {
    id: "p1",
    title: "Thu nhập",
    description: "Kiến tạo nhiều nguồn thu nhập bằng AI, Affiliate, sản phẩm số và dịch vụ.",
    href: "/portal/earn",
    icon: "wallet",
  },
  {
    id: "p2",
    title: "Thương hiệu",
    description: "Xây dựng thương hiệu cá nhân có giá trị lâu dài.",
    href: "/portal/personal-brand",
    icon: "badge-check",
  },
  {
    id: "p3",
    title: "Hệ thống",
    description: "Thiết kế quy trình, landing page, email, CRM, automation và AI Agent.",
    href: "/portal/affiliate-hub",
    icon: "settings",
  },
  {
    id: "p4",
    title: "Dự án",
    description: "Khám phá các dự án, hệ sinh thái và cơ hội phát triển tài sản.",
    href: "/portal/duan-cohoi",
    icon: "layers",
  },
  {
    id: "p5",
    title: "Doanh nghiệp",
    description: "Biến kỹ năng và tri thức thành mô hình kinh doanh có thể mở rộng.",
    href: "/portal/premium",
    icon: "building",
  },
  {
    id: "p6",
    title: "Tài sản",
    description: "Kiến tạo tài sản số, tri thức, cộng đồng và nền tảng cho di sản.",
    href: "/portal/digital-assets",
    icon: "gem",
  },
];

export type BuildModule = {
  id: string;
  label: string;
  description: string;
  href?: string;
};

export const incomeEngineModules: BuildModule[] = [
  { id: "ie1", label: "Affiliate Hub", description: "Chọn ngách, chọn sản phẩm, xây hệ thống Affiliate.", href: "/portal/affiliate-hub" },
  { id: "ie2", label: "Affiliate Việt Nam", description: "Sản phẩm & nền tảng Affiliate trong nước." },
  { id: "ie3", label: "Affiliate Quốc tế", description: "Sản phẩm & nền tảng Affiliate toàn cầu." },
  { id: "ie4", label: "Affiliate VO DUONG AI", description: "Giới thiệu sản phẩm VO DUONG AI, nhận hoa hồng.", href: "/portal/referral" },
  { id: "ie5", label: "AI Tool Affiliate", description: "Hoa hồng từ các công cụ AI bạn đang dùng mỗi ngày.", href: "/portal/tools" },
  { id: "ie6", label: "Digital Product", description: "Đóng gói tri thức thành sản phẩm số có thể bán lại.", href: "/portal/digital-assets" },
  { id: "ie7", label: "Dịch vụ / Consulting", description: "Cung cấp dịch vụ chuyên môn dựa trên năng lực thật.", href: "/portal/premium" },
];

export const brandBuilderModules: BuildModule[] = [
  { id: "bb1", label: "Personal Brand", description: "Định vị và phát triển thương hiệu cá nhân.", href: "/portal/personal-brand" },
  { id: "bb2", label: "Content System", description: "Hệ thống sản xuất nội dung đều đặn, có chiến lược." },
  { id: "bb3", label: "Website cá nhân", description: "Ngôi nhà số riêng để xây uy tín lâu dài." },
  { id: "bb4", label: "Social Content", description: "Nội dung mạng xã hội nhất quán, đúng định vị." },
  { id: "bb5", label: "Blog / SEO", description: "Nội dung bền vững, tìm thấy được theo thời gian." },
  { id: "bb6", label: "Email List", description: "Danh sách người theo dõi bạn sở hữu trọn đời." },
  { id: "bb7", label: "Community Building", description: "Xây cộng đồng riêng quanh giá trị bạn tạo ra.", href: "/portal/congdongai" },
];

export const systemBuilderModules: BuildModule[] = [
  { id: "sb1", label: "Landing Page", description: "Mẫu trang đích chuyển đổi cao." },
  { id: "sb2", label: "Email Marketing", description: "Chuỗi email tự động chăm sóc khách hàng." },
  { id: "sb3", label: "CRM", description: "Quản lý khách hàng và cơ hội có hệ thống." },
  { id: "sb4", label: "Automation", description: "Tự động hoá quy trình bán hàng và chăm sóc." },
  { id: "sb5", label: "Workflow", description: "Quy trình làm việc lặp lại được, không phụ thuộc cảm hứng." },
  { id: "sb6", label: "AI Agent", description: "Trợ lý AI vận hành một phần công việc cho bạn." },
  { id: "sb7", label: "Sales Funnel", description: "Hành trình chuyển đổi khách hàng rõ từng bước." },
];

export const projectOpportunityModules: BuildModule[] = [
  { id: "po1", label: "DigiU", description: "Hệ sinh thái DigiU.", href: "/portal/digital-assets/category/digiu" },
  { id: "po2", label: "SolarGroup", description: "Cơ hội đầu tư cổ phần dài hạn.", href: "/portal/digital-assets/category/equity" },
  { id: "po3", label: "Crypto", description: "Các sàn giao dịch Crypto được đề xuất.", href: "/portal/digital-assets/category/crypto" },
  { id: "po4", label: "Blockchain", description: "Dự án và kiến thức Blockchain.", href: "/portal/digital-assets/category/blockchain" },
  { id: "po5", label: "Trading", description: "Tài nguyên và cơ hội Trading.", href: "/portal/digital-assets/category/trading" },
  { id: "po6", label: "Cơ hội mới", description: "Toàn cảnh các dự án và cơ hội đang đồng hành.", href: "/portal/duan-cohoi" },
];

export const premiumPathModules: BuildModule[] = [
  { id: "pp1", label: "Premium Learning", description: "Lộ trình học chuyên sâu, đi nhanh hơn.", href: "/portal/premium" },
  { id: "pp2", label: "Workshop", description: "Buổi thực hành trực tiếp cùng chuyên gia." },
  { id: "pp3", label: "Mentoring", description: "Đồng hành 1:1 trên hành trình kiến tạo." },
  { id: "pp4", label: "Công cụ thực chiến", description: "Bộ công cụ dùng ngay cho công việc thật.", href: "/portal/tools" },
  { id: "pp5", label: "Exclusive Prompt", description: "Prompt độc quyền cho thành viên Premium.", href: "/portal/prompts" },
  { id: "pp6", label: "Exclusive Workflow", description: "Workflow độc quyền đã được kiểm chứng." },
  { id: "pp7", label: "Tư vấn 1:1", description: "Một buổi tư vấn riêng cho tình huống của bạn." },
];

export type AiBuildTip = {
  message: string;
  href: string;
  cta: string;
};

export const aiBuildTip: AiBuildTip = {
  message:
    "Dựa trên hành trình hiện tại, bạn nên bắt đầu bằng việc chọn một nguồn thu nhập nhỏ, xây một landing page đơn giản và tạo 3 nội dung đầu tiên để kiểm chứng thị trường.",
  href: "/portal/ai-assistant",
  cta: "Hỏi AI Build Coach",
};

export type BuildProgressDimension = {
  id: string;
  label: string;
  percent: number;
};

export const buildProgress: BuildProgressDimension[] = [
  { id: "income", label: "Income", percent: 15 },
  { id: "brand", label: "Brand", percent: 25 },
  { id: "system", label: "System", percent: 5 },
  { id: "project", label: "Project", percent: 10 },
  { id: "asset", label: "Asset", percent: 8 },
];

export type FounderJourney = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const founderJourney: FounderJourney = {
  title: "Founder Journey",
  description:
    "VO DUONG AI được xây dựng từ chính hành trình thực chiến: học AI, xây website, làm Affiliate, xây cộng đồng, đồng hành cùng dự án và kiến tạo tài sản số.",
  href: "/portal/student-success",
  cta: "Khám phá hành trình",
};
