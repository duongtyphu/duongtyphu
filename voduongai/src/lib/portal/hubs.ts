export type HubModule = {
  label: string;
  description: string;
  href?: string;
};

export type PortalHub = {
  key: string;
  label: string;
  href: string;
  heroTitle: string;
  heroSubtitle: string;
  modules: HubModule[];
};

export const portalHubs: PortalHub[] = [
  {
    key: "home",
    label: "Gem Home",
    href: "/portal",
    heroTitle: "Gem Home",
    heroSubtitle: "Mỗi ngày bắt đầu bằng một bước nhỏ để viên ngọc của bạn sáng hơn.",
    modules: [],
  },
  {
    key: "journey",
    label: "Hành trình",
    href: "/portal/journey",
    heroTitle: "Hành trình của bạn",
    heroSubtitle: "Mỗi viên ngọc quý cần thời gian để mài giũa — đây là lộ trình của riêng bạn.",
    modules: [
      { label: "Bắt đầu", description: "Lộ trình nhập môn dành cho người mới.", href: "/portal/start-here" },
      { label: "Lộ trình cá nhân", description: "7 bước từ làm quen AI đến mở rộng hệ sinh thái.", href: "/portal/roadmap" },
      { label: "Human Growth", description: "Theo dõi 5 chỉ số trưởng thành của bạn — xem ngay phía trên." },
      { label: "Nhiệm vụ 30 ngày", description: "Chuỗi nhiệm vụ giúp bạn duy trì động lực mỗi ngày." },
      { label: "Cấp độ phát triển", description: "Xem cấp độ hiện tại và mục tiêu kế tiếp." },
      { label: "Chứng chỉ", description: "Chứng chỉ ghi nhận hành trình bạn đã đi qua." },
    ],
  },
  {
    key: "knowledge",
    label: "Tri thức",
    href: "/portal/knowledge",
    heroTitle: "Tri thức",
    heroSubtitle: "Toàn bộ tri thức AI thực chiến — học đúng thứ bạn cần, áp dụng ngay.",
    modules: [
      { label: "Học viện", description: "Các khóa học AI, Affiliate, thương hiệu cá nhân.", href: "/portal/academy" },
      { label: "Thư viện AI", description: "Prompt, công cụ, template, ebook, checklist, SOP.", href: "/portal/library" },
      { label: "Prompt", description: "Thư viện prompt thực chiến, copy và dùng ngay.", href: "/portal/prompts" },
      { label: "Công cụ AI", description: "Các công cụ AI & phần mềm được tuyển chọn.", href: "/portal/tools" },
      { label: "Template", description: "Mẫu nội dung, kế hoạch dùng lại nhanh.", href: "/portal/templates" },
      { label: "Workflow", description: "Quy trình làm việc AI từng bước, dễ tái sử dụng." },
      { label: "Checklist", description: "Danh sách việc cần làm cho từng mục tiêu.", href: "/portal/checklists" },
      { label: "SOP", description: "Quy trình chuẩn để vận hành nhất quán.", href: "/portal/sop" },
      { label: "Ebook", description: "Tài nguyên miễn phí giúp bạn học sâu hơn.", href: "/portal/resources" },
      { label: "Thực chiến", description: "Bài tập và tình huống thực tế để áp dụng ngay.", href: "/portal/practice" },
      { label: "Case Study", description: "Những câu chuyện thực chiến và kết quả cụ thể.", href: "/portal/case-studies" },
    ],
  },
  {
    key: "growth",
    label: "Hệ Kiến Tạo",
    href: "/portal/growth",
    heroTitle: "Hệ Kiến Tạo",
    heroSubtitle: "Biến tri thức thành giá trị — thu nhập, thương hiệu, hệ thống, dự án, doanh nghiệp và tài sản.",
    modules: [
      { label: "Kiếm thu nhập", description: "Các cách tạo thu nhập cùng AI.", href: "/portal/earn" },
      { label: "Affiliate Hub", description: "Chọn ngách, chọn sản phẩm, xây hệ thống Affiliate.", href: "/portal/affiliate-hub" },
      { label: "Affiliate Việt Nam", description: "Sản phẩm & nền tảng Affiliate trong nước." },
      { label: "Affiliate Quốc tế", description: "Sản phẩm & nền tảng Affiliate toàn cầu." },
      { label: "Affiliate VO DUONG AI", description: "Giới thiệu sản phẩm VO DUONG AI, nhận hoa hồng.", href: "/portal/referral" },
      { label: "Xây hệ thống", description: "Xây hệ thống Affiliate/Automation của riêng bạn." },
      { label: "Landing Page", description: "Mẫu trang đích chuyển đổi cao." },
      { label: "Email Marketing", description: "Chuỗi email tự động chăm sóc khách hàng." },
      { label: "Automation", description: "Tự động hoá quy trình bán hàng và chăm sóc." },
      { label: "Dự án & Cơ hội", description: "Toàn cảnh các dự án và cơ hội đang đồng hành.", href: "/portal/opportunities" },
      { label: "DigiU", description: "Hệ sinh thái DigiU.", href: "/portal/digital-assets/category/digiu" },
      { label: "SolarGroup", description: "Cơ hội đầu tư cổ phần dài hạn.", href: "/portal/digital-assets/category/equity" },
      { label: "Crypto", description: "Các sàn giao dịch Crypto được đề xuất.", href: "/portal/digital-assets/category/crypto" },
      { label: "Blockchain", description: "Dự án và kiến thức Blockchain.", href: "/portal/digital-assets/category/blockchain" },
      { label: "Trading", description: "Tài nguyên và cơ hội Trading.", href: "/portal/digital-assets/category/trading" },
      { label: "Premium", description: "Sản phẩm và dịch vụ chuyên sâu dành cho người muốn đi nhanh hơn.", href: "/portal/premium" },
    ],
  },
  {
    key: "ecosystem",
    label: "Hệ sinh thái",
    href: "/portal/ecosystem",
    heroTitle: "Hệ sinh thái",
    heroSubtitle: "Không ai tỏa sáng một mình — đây là cộng đồng đồng hành cùng bạn.",
    modules: [
      { label: "AI Assistant", description: "Một người đồng hành AI riêng cho hành trình của bạn.", href: "/portal/ai-assistant" },
      { label: "Cộng đồng", description: "Kết nối với những người cùng hành trình.", href: "/portal/community" },
      { label: "Tin tức", description: "Cập nhật mới nhất từ VO DUONG AI.", href: "/portal/updates" },
      { label: "Thành tựu", description: "Case Study và thành công học viên.", href: "/portal/achievements" },
      { label: "Webinar", description: "Buổi chia sẻ trực tiếp cùng chuyên gia." },
      { label: "Sự kiện", description: "Các sự kiện offline/online của hệ sinh thái." },
      { label: "Leaderboard", description: "Bảng xếp hạng những viên ngọc sáng nhất." },
      { label: "Success Stories", description: "Hành trình tỏa sáng của các học viên.", href: "/portal/student-success" },
    ],
  },
  {
    key: "legacy",
    label: "My Legacy",
    href: "/portal/legacy",
    heroTitle: "My Legacy",
    heroSubtitle: "Di sản số của riêng bạn — những gì bạn xây hôm nay sẽ còn mãi.",
    modules: [
      { label: "Hồ sơ cá nhân", description: "Thông tin tài khoản và đơn hàng của bạn.", href: "/portal/account" },
      { label: "Đã lưu", description: "Nội dung bạn đã lưu lại để xem sau.", href: "/portal/saved" },
      { label: "Ghi chú", description: "Ghi chú cá nhân trong quá trình học." },
      { label: "Prompt của tôi", description: "Prompt bạn tự tạo và lưu lại." },
      { label: "Workflow của tôi", description: "Quy trình làm việc bạn tự xây." },
      { label: "Nhật ký học tập", description: "Theo dõi những gì bạn đã học qua từng ngày." },
      { label: "Thành tựu của tôi", description: "Những cột mốc bạn đã đạt được.", href: "/portal/achievements" },
      { label: "Chứng chỉ", description: "Chứng chỉ bạn đã nhận được." },
      { label: "Kho di sản", description: "Toàn bộ tài sản số bạn đã tích lũy." },
      { label: "Cài đặt mục tiêu", description: "Điều chỉnh mục tiêu hành trình của bạn." },
      { label: "Hỗ trợ", description: "Cần giúp đỡ? Liên hệ với chúng tôi.", href: "/portal/support" },
    ],
  },
];

export function getHub(key: string) {
  return portalHubs.find((h) => h.key === key);
}
