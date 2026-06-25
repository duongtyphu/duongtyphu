export type DigitalAssetCategoryKey = "digiu" | "blockchain" | "crypto" | "trading" | "equity";

export type DigitalAssetCategory = {
  id: string;
  key: DigitalAssetCategoryKey;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  status: "Active" | "Inactive";
};

export const digitalAssetCategories: DigitalAssetCategory[] = [
  {
    id: "cat_digiu",
    key: "digiu",
    slug: "digiu",
    name: "DigiU",
    description: "Các sản phẩm, cập nhật và cơ hội trong hệ sinh thái DigiU mà tôi đang theo dõi và chia sẻ.",
    icon: "💠",
    color: "#2563EB",
    order: 1,
    status: "Active",
  },
  {
    id: "cat_blockchain",
    key: "blockchain",
    slug: "blockchain",
    name: "Blockchain",
    description: "Nền tảng, công nghệ, dự án Web3 và các sàn/công cụ Blockchain liên quan.",
    icon: "⛓️",
    color: "#7C3AED",
    order: 2,
    status: "Active",
  },
  {
    id: "cat_crypto",
    key: "crypto",
    slug: "crypto",
    name: "Crypto",
    description: "Các tài sản số, nền tảng giao dịch, công cụ theo dõi thị trường và bài viết phân tích cơ bản.",
    icon: "🪙",
    color: "#EAB308",
    order: 3,
    status: "Active",
  },
  {
    id: "cat_trading",
    key: "trading",
    slug: "trading",
    name: "Trading",
    description: "Tư duy giao dịch, quản trị vốn, công cụ phân tích và các nền tảng hỗ trợ trading.",
    icon: "📈",
    color: "#F97316",
    order: 4,
    status: "Active",
  },
  {
    id: "cat_equity",
    key: "equity",
    slug: "equity",
    name: "Cổ phần doanh nghiệp",
    description: "Các dự án đầu tư cổ phần doanh nghiệp, cơ hội sở hữu tài sản doanh nghiệp và thông tin liên quan.",
    icon: "🏢",
    color: "#22C55E",
    order: 5,
    status: "Active",
  },
];

export type DigitalAssetBadge = "Đang theo dõi" | "Đang tham gia" | "Đề xuất" | "Mới";

export type DigitalAssetProject = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  image?: string;
  category: DigitalAssetCategoryKey;
  shortDescription: string;
  content?: string;
  whatIsIt: string;
  problemSolved: string;
  whyInterested: string;
  whoForIt: string;
  notes: string;
  badge: DigitalAssetBadge;
  featured: boolean;
  priority: number;
  order: number;
  status: "Draft" | "Published" | "Hidden";
  createdAt: string;
  updatedAt: string;
  relatedResources?: string[];
  disclaimer?: string;
};

export const digitalAssetProjects: DigitalAssetProject[] = [
  {
    id: "da_digiu_ecosystem",
    slug: "digiu-ecosystem",
    name: "DigiU Ecosystem",
    logo: "🌐",
    image: "🌐",
    category: "digiu",
    shortDescription: "Hệ sinh thái sản phẩm số DigiU mà tôi đang theo dõi và trải nghiệm trực tiếp.",
    whatIsIt: "DigiU Ecosystem là tập hợp các sản phẩm và dịch vụ số xoay quanh thanh toán, định danh và tài sản số.",
    problemSolved: "Hướng tới việc kết nối các dịch vụ số rời rạc thành một hệ sinh thái liền mạch cho người dùng.",
    whyInterested: "Tôi quan tâm vì đây là một mô hình hệ sinh thái số đáng để quan sát và học hỏi cách vận hành.",
    whoForIt: "Phù hợp với người muốn tìm hiểu về xu hướng hệ sinh thái số và thanh toán hiện đại.",
    notes: "Cần tự tìm hiểu kỹ về cơ chế hoạt động, điều khoản sử dụng trước khi tham gia bất kỳ phần nào.",
    badge: "Đang theo dõi",
    featured: true,
    priority: 1,
    order: 1,
    status: "Published",
    createdAt: "2025-01-15",
    updatedAt: "2025-03-02",
    relatedResources: ["Ebook: Tổng quan hệ sinh thái DigiU", "Video hướng dẫn bắt đầu"],
  },
  {
    id: "da_webwisepay",
    slug: "webwisepay",
    name: "WebWisePay",
    logo: "💳",
    image: "💳",
    category: "digiu",
    shortDescription: "Giải pháp thanh toán số trong hệ sinh thái DigiU mà tôi đang tìm hiểu.",
    whatIsIt: "WebWisePay là một giải pháp thanh toán/ví số được giới thiệu trong hệ sinh thái DigiU.",
    problemSolved: "Hướng tới đơn giản hoá việc thanh toán và quản lý dòng tiền số cho người dùng.",
    whyInterested: "Tôi theo dõi để hiểu cách các giải pháp thanh toán số mới được xây dựng và vận hành.",
    whoForIt: "Phù hợp với người quan tâm đến công nghệ thanh toán và ví số.",
    notes: "Đây là thông tin chia sẻ ở giai đoạn tìm hiểu, chưa phải khuyến nghị sử dụng chính thức.",
    badge: "Đang theo dõi",
    featured: false,
    priority: 2,
    order: 2,
    status: "Published",
    createdAt: "2025-01-20",
    updatedAt: "2025-02-18",
    relatedResources: ["Hướng dẫn đăng ký WebWisePay"],
  },
  {
    id: "da_ai_hub",
    slug: "ai-hub",
    name: "AI Hub",
    logo: "🤖",
    image: "🤖",
    category: "digiu",
    shortDescription: "Trung tâm công cụ AI trong hệ sinh thái DigiU, kết nối với các sản phẩm số khác.",
    whatIsIt: "AI Hub là một module/sản phẩm tích hợp AI nằm trong hệ sinh thái DigiU.",
    problemSolved: "Giúp người dùng tiếp cận các công cụ AI ngay trong hệ sinh thái sản phẩm số họ đang dùng.",
    whyInterested: "Tôi quan tâm vì đây là điểm giao giữa AI và hệ sinh thái sản phẩm số — đúng hướng tôi theo đuổi.",
    whoForIt: "Phù hợp với người dùng đã quen với DigiU và muốn khai thác thêm tính năng AI.",
    notes: "Tính năng và phạm vi có thể thay đổi theo thời gian, bạn nên kiểm tra thông tin mới nhất.",
    badge: "Mới",
    featured: false,
    priority: 3,
    order: 3,
    status: "Published",
    createdAt: "2025-04-05",
    updatedAt: "2025-04-05",
    relatedResources: ["Video giới thiệu AI Hub"],
  },
  {
    id: "da_blockchain_exchange",
    slug: "san-giao-dich-blockchain-mau",
    name: "Sàn giao dịch Blockchain mẫu",
    logo: "🏦",
    image: "🏦",
    category: "blockchain",
    shortDescription: "Một sàn giao dịch tài sản số tiêu biểu mà tôi dùng để minh hoạ cách hoạt động của thị trường blockchain.",
    whatIsIt: "Đây là nền tảng cho phép giao dịch, lưu trữ và chuyển tài sản số trên nhiều blockchain khác nhau.",
    problemSolved: "Kết nối người dùng với thị trường tài sản số một cách thuận tiện hơn.",
    whyInterested: "Tôi dùng nền tảng này để theo dõi thị trường và thực hành các kiến thức về blockchain.",
    whoForIt: "Phù hợp với người đã có kiến thức cơ bản về blockchain và muốn quan sát/thực hành thực tế.",
    notes: "Giao dịch tài sản số có rủi ro cao, hãy tự nghiên cứu kỹ trước khi sử dụng bất kỳ nền tảng nào.",
    badge: "Đang tham gia",
    featured: true,
    priority: 4,
    order: 1,
    status: "Published",
    createdAt: "2025-01-28",
    updatedAt: "2025-05-10",
    relatedResources: ["Ebook: Cách chọn sàn giao dịch an toàn", "Video hướng dẫn", "Checklist bảo mật tài khoản"],
    disclaimer:
      "Tôi đang trực tiếp sử dụng nền tảng này để theo dõi và thực hành, không đảm bảo hiệu quả cho bất kỳ ai khác.",
  },
  {
    id: "da_web3_wallet",
    slug: "vi-web3-mau",
    name: "Ví Web3 mẫu",
    logo: "👛",
    image: "👛",
    category: "blockchain",
    shortDescription: "Ví Web3 tiêu biểu giúp quản lý tài sản số và tương tác với các ứng dụng phi tập trung.",
    whatIsIt: "Một ví phi tập trung (non-custodial) cho phép người dùng tự quản lý khoá riêng và tài sản số.",
    problemSolved: "Giúp người dùng tương tác trực tiếp với các ứng dụng Web3 mà không cần trung gian.",
    whyInterested: "Tôi tìm hiểu ví Web3 vì đây là công cụ nền tảng để tiếp cận hầu hết các ứng dụng blockchain.",
    whoForIt: "Phù hợp với người mới bắt đầu tìm hiểu Web3 và muốn có công cụ quản lý tài sản số cơ bản.",
    notes: "Tự quản lý khoá riêng đồng nghĩa với việc bạn hoàn toàn chịu trách nhiệm bảo mật tài sản của mình.",
    badge: "Đang theo dõi",
    featured: false,
    priority: 5,
    order: 2,
    status: "Published",
    createdAt: "2025-02-02",
    updatedAt: "2025-02-14",
    relatedResources: ["Hướng dẫn cài đặt ví Web3"],
  },
  {
    id: "da_crypto_tracker",
    slug: "cong-cu-theo-doi-thi-truong-crypto",
    name: "Công cụ theo dõi thị trường Crypto",
    logo: "📊",
    image: "📊",
    category: "crypto",
    shortDescription: "Công cụ theo dõi giá, vốn hoá và biến động của các tài sản crypto theo thời gian thực.",
    whatIsIt: "Một nền tảng/app tổng hợp dữ liệu giá, khối lượng giao dịch và thông tin thị trường crypto.",
    problemSolved: "Giúp người theo dõi thị trường có dữ liệu tập trung, cập nhật để tự nghiên cứu.",
    whyInterested: "Tôi dùng công cụ này hằng ngày để cập nhật tình hình thị trường trước khi đọc thêm phân tích.",
    whoForIt: "Phù hợp với bất kỳ ai muốn quan sát thị trường crypto một cách có hệ thống.",
    notes: "Dữ liệu thị trường chỉ mang tính tham khảo, không phải tín hiệu mua/bán.",
    badge: "Đang tham gia",
    featured: true,
    priority: 6,
    order: 1,
    status: "Published",
    createdAt: "2025-02-10",
    updatedAt: "2025-05-22",
    relatedResources: ["App theo dõi giá crypto", "Video hướng dẫn dùng công cụ tracker"],
  },
  {
    id: "da_crypto_analytics",
    slug: "nen-tang-phan-tich-crypto",
    name: "Nền tảng phân tích Crypto",
    logo: "🔍",
    image: "🔍",
    category: "crypto",
    shortDescription: "Nền tảng hỗ trợ phân tích on-chain và cơ bản cho các dự án crypto.",
    whatIsIt: "Một nền tảng cung cấp công cụ phân tích on-chain, dữ liệu dự án và báo cáo cơ bản.",
    problemSolved: "Giúp người dùng đánh giá dự án dựa trên dữ liệu thay vì chỉ tin theo lời quảng cáo.",
    whyInterested: "Tôi quan tâm đến việc phân tích dựa trên dữ liệu thay vì cảm tính khi tìm hiểu một dự án.",
    whoForIt: "Phù hợp với người đã có kiến thức nền về crypto và muốn nghiên cứu sâu hơn.",
    notes: "Phân tích chỉ là một góc nhìn tham khảo, không đảm bảo kết quả trong tương lai.",
    badge: "Đang theo dõi",
    featured: false,
    priority: 7,
    order: 2,
    status: "Published",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-15",
    relatedResources: ["Tài liệu hướng dẫn phân tích on-chain"],
  },
  {
    id: "da_trading_platform",
    slug: "nen-tang-trading-mau",
    name: "Nền tảng Trading mẫu",
    logo: "💹",
    image: "💹",
    category: "trading",
    shortDescription: "Nền tảng giao dịch tiêu biểu hỗ trợ biểu đồ, lệnh và quản lý vị thế.",
    whatIsIt: "Một nền tảng cho phép đặt lệnh giao dịch, theo dõi biểu đồ kỹ thuật và quản lý vị thế.",
    problemSolved: "Cung cấp công cụ để thực hành phân tích kỹ thuật và quản trị vị thế giao dịch.",
    whyInterested: "Tôi dùng nền tảng này để thực hành tư duy giao dịch có kỷ luật và ghi lại bài học cá nhân.",
    whoForIt: "Phù hợp với người đã tìm hiểu kiến thức trading cơ bản và muốn thực hành có kiểm soát.",
    notes: "Trading có rủi ro mất vốn, chỉ nên thực hành với phần vốn bạn chấp nhận được rủi ro.",
    badge: "Đang tham gia",
    featured: true,
    priority: 8,
    order: 1,
    status: "Published",
    createdAt: "2025-02-20",
    updatedAt: "2025-06-01",
    relatedResources: ["Ebook: Tư duy quản trị vốn", "Video hướng dẫn dùng nền tảng trading"],
    disclaimer:
      "Tôi chia sẻ kinh nghiệm thực hành cá nhân trên nền tảng này, không khuyến nghị bạn sao chép giao dịch.",
  },
  {
    id: "da_risk_management_tool",
    slug: "cong-cu-quan-tri-von",
    name: "Công cụ quản trị vốn",
    logo: "🧮",
    image: "🧮",
    category: "trading",
    shortDescription: "Công cụ tính toán quản trị vốn và kiểm soát rủi ro khi giao dịch.",
    whatIsIt: "Một công cụ/bảng tính giúp tính kích thước lệnh, tỷ lệ rủi ro và theo dõi hiệu suất giao dịch.",
    problemSolved: "Giúp người giao dịch kiểm soát rủi ro theo từng lệnh thay vì giao dịch theo cảm tính.",
    whyInterested: "Tôi xem quản trị vốn là yếu tố quan trọng hơn cả việc 'đoán đúng hướng giá'.",
    whoForIt: "Phù hợp với người đang xây dựng kỷ luật giao dịch và muốn kiểm soát rủi ro bài bản.",
    notes: "Công cụ chỉ hỗ trợ tính toán, không thay thế cho việc tự nghiên cứu và ra quyết định.",
    badge: "Đề xuất",
    featured: false,
    priority: 9,
    order: 2,
    status: "Published",
    createdAt: "2025-03-08",
    updatedAt: "2025-03-20",
    relatedResources: ["Checklist quản trị vốn trước khi vào lệnh"],
  },
  {
    id: "da_equity_project",
    slug: "du-an-co-phan-doanh-nghiep-mau",
    name: "Dự án cổ phần doanh nghiệp mẫu",
    logo: "🏢",
    image: "🏢",
    category: "equity",
    shortDescription: "Một dự án/doanh nghiệp tiêu biểu mà tôi đang tìm hiểu về cơ hội sở hữu cổ phần.",
    whatIsIt: "Đây là một doanh nghiệp đang hoạt động có mở cơ hội cho nhà đầu tư cá nhân tham gia sở hữu cổ phần.",
    problemSolved: "Mở ra góc nhìn dài hạn về việc sở hữu một phần doanh nghiệp thay vì chỉ giao dịch tài sản ngắn hạn.",
    whyInterested: "Tôi quan tâm đến việc xây dựng tài sản dài hạn qua sở hữu doanh nghiệp thực, không chỉ tài sản số.",
    whoForIt: "Phù hợp với người có tư duy đầu tư dài hạn và muốn đa dạng hoá ngoài tài sản số/crypto.",
    notes: "Đầu tư cổ phần doanh nghiệp đòi hỏi nghiên cứu kỹ về pháp lý, tài chính doanh nghiệp và rủi ro mất vốn.",
    badge: "Đang theo dõi",
    featured: true,
    priority: 10,
    order: 1,
    status: "Published",
    createdAt: "2025-04-12",
    updatedAt: "2025-05-30",
    relatedResources: ["Tài liệu giới thiệu doanh nghiệp", "Ebook: Đầu tư cổ phần doanh nghiệp cho người mới"],
  },
  {
    id: "da_equity_funding_platform",
    slug: "nen-tang-goi-von-co-phan-mau",
    name: "Nền tảng gọi vốn/cổ phần mẫu",
    logo: "🤝",
    image: "🤝",
    category: "equity",
    shortDescription: "Nền tảng kết nối nhà đầu tư cá nhân với các doanh nghiệp đang gọi vốn cổ phần.",
    whatIsIt: "Một nền tảng trung gian giúp doanh nghiệp gọi vốn và nhà đầu tư cá nhân tiếp cận cơ hội sở hữu cổ phần.",
    problemSolved: "Giảm rào cản tiếp cận giữa nhà đầu tư cá nhân nhỏ lẻ và các cơ hội đầu tư cổ phần doanh nghiệp.",
    whyInterested: "Tôi tìm hiểu nền tảng này như một cách tiếp cận cơ hội đầu tư cổ phần một cách có cấu trúc hơn.",
    whoForIt: "Phù hợp với người muốn tìm hiểu các kênh đầu tư cổ phần doanh nghiệp ngoài thị trường chứng khoán niêm yết.",
    notes: "Luôn đọc kỹ hồ sơ pháp lý, điều khoản và tự đánh giá rủi ro trước khi tham gia bất kỳ nền tảng gọi vốn nào.",
    badge: "Đề xuất",
    featured: false,
    priority: 11,
    order: 2,
    status: "Published",
    createdAt: "2025-04-18",
    updatedAt: "2025-04-25",
    relatedResources: ["Hướng dẫn đọc hồ sơ gọi vốn cổ phần"],
  },
];

export type DigitalAssetLinkType =
  | "Website"
  | "Affiliate"
  | "Exchange"
  | "Telegram"
  | "App"
  | "Document"
  | "Video"
  | "Guide"
  | "Community"
  | "Other";

export type DigitalAssetLink = {
  id: string;
  projectId: string;
  title: string;
  type: DigitalAssetLinkType;
  url: string;
  ctaText: string;
  description: string;
  isAffiliate: boolean;
  trackingCode?: string;
  clickCount: number;
  status: "Active" | "Inactive";
  order: number;
};

export const digitalAssetLinks: DigitalAssetLink[] = [
  { id: "dal_1", projectId: "da_digiu_ecosystem", title: "Website chính", type: "Website", url: "https://example.com/digiu", ctaText: "Truy cập dự án", description: "Trang thông tin chính thức của DigiU Ecosystem.", isAffiliate: false, clickCount: 340, status: "Inactive", order: 1 },
  { id: "dal_2", projectId: "da_digiu_ecosystem", title: "Link đăng ký", type: "Affiliate", url: "https://example.com/digiu/ref", ctaText: "Tìm hiểu thêm", description: "Link giới thiệu cá nhân nếu bạn muốn đăng ký.", isAffiliate: true, trackingCode: "ref_digiu_01", clickCount: 812, status: "Inactive", order: 2 },
  { id: "dal_3", projectId: "da_digiu_ecosystem", title: "Cộng đồng Telegram", type: "Telegram", url: "https://t.me/digiu_example", ctaText: "Tham gia cộng đồng", description: "Nơi cập nhật tin tức và thảo luận về DigiU.", isAffiliate: false, clickCount: 215, status: "Inactive", order: 3 },

  { id: "dal_4", projectId: "da_webwisepay", title: "Website chính", type: "Website", url: "https://example.com/webwisepay", ctaText: "Truy cập dự án", description: "Trang giới thiệu giải pháp thanh toán WebWisePay.", isAffiliate: false, clickCount: 128, status: "Inactive", order: 1 },
  { id: "dal_5", projectId: "da_webwisepay", title: "Hướng dẫn sử dụng", type: "Guide", url: "https://example.com/webwisepay/guide", ctaText: "Xem hướng dẫn", description: "Hướng dẫn bắt đầu sử dụng WebWisePay.", isAffiliate: false, clickCount: 96, status: "Inactive", order: 2 },

  { id: "dal_6", projectId: "da_ai_hub", title: "Website chính", type: "Website", url: "https://example.com/ai-hub", ctaText: "Truy cập dự án", description: "Trang giới thiệu AI Hub trong hệ sinh thái DigiU.", isAffiliate: false, clickCount: 174, status: "Inactive", order: 1 },
  { id: "dal_7", projectId: "da_ai_hub", title: "Video giới thiệu", type: "Video", url: "https://example.com/ai-hub/video", ctaText: "Xem video", description: "Video giới thiệu nhanh về tính năng AI Hub.", isAffiliate: false, clickCount: 203, status: "Inactive", order: 2 },

  { id: "dal_8", projectId: "da_blockchain_exchange", title: "Sàn giao dịch", type: "Exchange", url: "https://example.com/exchange", ctaText: "Truy cập dự án", description: "Trang sàn giao dịch tài sản số mẫu.", isAffiliate: false, clickCount: 450, status: "Inactive", order: 1 },
  { id: "dal_9", projectId: "da_blockchain_exchange", title: "Link đăng ký Affiliate", type: "Affiliate", url: "https://example.com/exchange/ref", ctaText: "Tìm hiểu thêm", description: "Link giới thiệu cá nhân tới sàn giao dịch.", isAffiliate: true, trackingCode: "ref_exchange_01", clickCount: 1280, status: "Inactive", order: 2 },
  { id: "dal_10", projectId: "da_blockchain_exchange", title: "Tài liệu hướng dẫn", type: "Document", url: "https://example.com/exchange/docs", ctaText: "Xem tài liệu", description: "Tài liệu hướng dẫn sử dụng sàn giao dịch.", isAffiliate: false, clickCount: 87, status: "Inactive", order: 3 },
  { id: "dal_11", projectId: "da_blockchain_exchange", title: "Cộng đồng Telegram", type: "Telegram", url: "https://t.me/exchange_example", ctaText: "Tham gia cộng đồng", description: "Cộng đồng trao đổi về sàn giao dịch.", isAffiliate: false, clickCount: 312, status: "Inactive", order: 4 },

  { id: "dal_12", projectId: "da_web3_wallet", title: "Website chính", type: "Website", url: "https://example.com/web3-wallet", ctaText: "Truy cập dự án", description: "Trang giới thiệu ví Web3 mẫu.", isAffiliate: false, clickCount: 102, status: "Inactive", order: 1 },
  { id: "dal_13", projectId: "da_web3_wallet", title: "Hướng dẫn cài đặt", type: "Guide", url: "https://example.com/web3-wallet/guide", ctaText: "Xem hướng dẫn", description: "Hướng dẫn cài đặt và bảo mật ví Web3.", isAffiliate: false, clickCount: 145, status: "Inactive", order: 2 },

  { id: "dal_14", projectId: "da_crypto_tracker", title: "App theo dõi giá", type: "App", url: "https://example.com/crypto-tracker", ctaText: "Truy cập dự án", description: "Ứng dụng theo dõi giá và vốn hoá crypto.", isAffiliate: false, clickCount: 530, status: "Inactive", order: 1 },
  { id: "dal_15", projectId: "da_crypto_tracker", title: "Link Affiliate", type: "Affiliate", url: "https://example.com/crypto-tracker/ref", ctaText: "Tìm hiểu thêm", description: "Link giới thiệu cá nhân tới app theo dõi giá.", isAffiliate: true, trackingCode: "ref_tracker_01", clickCount: 967, status: "Inactive", order: 2 },

  { id: "dal_16", projectId: "da_crypto_analytics", title: "Website chính", type: "Website", url: "https://example.com/crypto-analytics", ctaText: "Truy cập dự án", description: "Nền tảng phân tích on-chain và dữ liệu dự án.", isAffiliate: false, clickCount: 118, status: "Inactive", order: 1 },
  { id: "dal_17", projectId: "da_crypto_analytics", title: "Tài liệu hướng dẫn", type: "Document", url: "https://example.com/crypto-analytics/docs", ctaText: "Xem tài liệu", description: "Tài liệu hướng dẫn sử dụng công cụ phân tích.", isAffiliate: false, clickCount: 74, status: "Inactive", order: 2 },

  { id: "dal_18", projectId: "da_trading_platform", title: "Nền tảng giao dịch", type: "Website", url: "https://example.com/trading-platform", ctaText: "Truy cập dự án", description: "Nền tảng giao dịch hỗ trợ biểu đồ và quản lý vị thế.", isAffiliate: false, clickCount: 289, status: "Inactive", order: 1 },
  { id: "dal_19", projectId: "da_trading_platform", title: "Link đăng ký Affiliate", type: "Affiliate", url: "https://example.com/trading-platform/ref", ctaText: "Tìm hiểu thêm", description: "Link giới thiệu cá nhân tới nền tảng trading.", isAffiliate: true, trackingCode: "ref_trading_01", clickCount: 1450, status: "Inactive", order: 2 },
  { id: "dal_20", projectId: "da_trading_platform", title: "Video hướng dẫn", type: "Video", url: "https://example.com/trading-platform/video", ctaText: "Xem video", description: "Video hướng dẫn sử dụng nền tảng trading.", isAffiliate: false, clickCount: 256, status: "Inactive", order: 3 },

  { id: "dal_21", projectId: "da_risk_management_tool", title: "Công cụ quản trị vốn", type: "App", url: "https://example.com/risk-tool", ctaText: "Truy cập dự án", description: "Công cụ tính toán quản trị vốn và rủi ro.", isAffiliate: false, clickCount: 163, status: "Inactive", order: 1 },
  { id: "dal_22", projectId: "da_risk_management_tool", title: "Hướng dẫn sử dụng", type: "Guide", url: "https://example.com/risk-tool/guide", ctaText: "Xem hướng dẫn", description: "Hướng dẫn dùng công cụ quản trị vốn hiệu quả.", isAffiliate: false, clickCount: 91, status: "Inactive", order: 2 },

  { id: "dal_23", projectId: "da_equity_project", title: "Trang dự án", type: "Website", url: "https://example.com/equity-project", ctaText: "Truy cập dự án", description: "Trang thông tin về doanh nghiệp và cơ hội cổ phần.", isAffiliate: false, clickCount: 205, status: "Inactive", order: 1 },
  { id: "dal_24", projectId: "da_equity_project", title: "Tài liệu giới thiệu", type: "Document", url: "https://example.com/equity-project/docs", ctaText: "Xem tài liệu", description: "Tài liệu giới thiệu chi tiết về doanh nghiệp.", isAffiliate: false, clickCount: 132, status: "Inactive", order: 2 },

  { id: "dal_25", projectId: "da_equity_funding_platform", title: "Nền tảng gọi vốn", type: "Website", url: "https://example.com/equity-funding", ctaText: "Truy cập dự án", description: "Nền tảng kết nối nhà đầu tư với doanh nghiệp gọi vốn.", isAffiliate: false, clickCount: 158, status: "Inactive", order: 1 },
  { id: "dal_26", projectId: "da_equity_funding_platform", title: "Link Affiliate", type: "Affiliate", url: "https://example.com/equity-funding/ref", ctaText: "Tìm hiểu thêm", description: "Link giới thiệu cá nhân tới nền tảng gọi vốn.", isAffiliate: true, trackingCode: "ref_equity_01", clickCount: 689, status: "Inactive", order: 2 },
];

export type DigitalAssetArticle = {
  id: string;
  projectId: string;
  category: DigitalAssetCategoryKey;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  featured: boolean;
  publishedAt: string;
  status: "Draft" | "Published" | "Hidden";
};

export const digitalAssetArticles: DigitalAssetArticle[] = [
  {
    id: "daa_1",
    projectId: "da_digiu_ecosystem",
    category: "digiu",
    title: "Giới thiệu DigiU Ecosystem — góc nhìn cá nhân",
    slug: "gioi-thieu-digiu-ecosystem",
    excerpt: "Những gì tôi quan sát được khi tìm hiểu hệ sinh thái DigiU trong thời gian gần đây.",
    content: "DigiU Ecosystem là một hệ sinh thái sản phẩm số đang phát triển...\n\n> Đây là chia sẻ góc nhìn cá nhân, không phải lời khuyên đầu tư.\n\n- Quan sát 1: Hệ sinh thái có nhiều sản phẩm liên kết với nhau.\n- Quan sát 2: Cần thời gian để đánh giá đầy đủ giá trị thực tế.",
    image: "🌐",
    author: "Võ Đương",
    tags: ["DigiU", "Hệ sinh thái số", "Góc nhìn cá nhân"],
    metaTitle: "Giới thiệu DigiU Ecosystem — góc nhìn cá nhân",
    metaDescription: "Những gì tôi quan sát được khi tìm hiểu hệ sinh thái DigiU trong thời gian gần đây.",
    featured: true,
    publishedAt: "2026-06-18",
    status: "Published",
  },
  {
    id: "daa_2",
    projectId: "da_webwisepay",
    category: "digiu",
    title: "WebWisePay — tìm hiểu giải pháp thanh toán số",
    slug: "tim-hieu-webwisepay",
    excerpt: "Tổng hợp những điều cần biết về WebWisePay trước khi quyết định tìm hiểu sâu hơn.",
    content: "WebWisePay là một giải pháp thanh toán/ví số...\n\nBạn nên tự kiểm tra các điều khoản sử dụng và chính sách bảo mật trước khi đăng ký.",
    image: "💳",
    author: "Võ Đương",
    tags: ["WebWisePay", "Thanh toán số"],
    metaTitle: "WebWisePay — tìm hiểu giải pháp thanh toán số",
    metaDescription: "Tổng hợp những điều cần biết về WebWisePay trước khi quyết định tìm hiểu sâu hơn.",
    featured: false,
    publishedAt: "2026-06-12",
    status: "Published",
  },
  {
    id: "daa_3",
    projectId: "da_blockchain_exchange",
    category: "blockchain",
    title: "Cách tôi tiếp cận một sàn giao dịch blockchain mới",
    slug: "cach-tiep-can-san-giao-dich-blockchain",
    excerpt: "Quy trình tôi thường áp dụng để tìm hiểu một sàn giao dịch tài sản số trước khi sử dụng.",
    content: "Trước khi sử dụng bất kỳ sàn giao dịch nào, tôi thường kiểm tra:\n\n- Uy tín và lịch sử hoạt động\n- Chính sách bảo mật tài sản người dùng\n- Phí giao dịch và thanh khoản\n\nĐây là kinh nghiệm cá nhân, bạn cần tự nghiên cứu thêm trước khi quyết định.",
    image: "🏦",
    author: "Võ Đương",
    tags: ["Blockchain", "Sàn giao dịch", "Bảo mật"],
    metaTitle: "Cách tôi tiếp cận một sàn giao dịch blockchain mới",
    metaDescription: "Quy trình tôi thường áp dụng để tìm hiểu một sàn giao dịch tài sản số trước khi sử dụng.",
    featured: true,
    publishedAt: "2026-06-08",
    status: "Published",
  },
  {
    id: "daa_4",
    projectId: "da_crypto_tracker",
    category: "crypto",
    title: "Theo dõi thị trường Crypto như thế nào cho có hệ thống",
    slug: "theo-doi-thi-truong-crypto-co-he-thong",
    excerpt: "Cách tôi tổ chức việc theo dõi thị trường crypto hằng ngày bằng các công cụ miễn phí.",
    content: "Tôi thường dành 15-20 phút mỗi ngày để xem qua các chỉ số thị trường...\n\nLưu ý: dữ liệu thị trường chỉ mang tính tham khảo, không phải tín hiệu giao dịch.",
    image: "📊",
    author: "Võ Đương",
    tags: ["Crypto", "Theo dõi thị trường"],
    metaTitle: "Theo dõi thị trường Crypto như thế nào cho có hệ thống",
    metaDescription: "Cách tôi tổ chức việc theo dõi thị trường crypto hằng ngày bằng các công cụ miễn phí.",
    featured: false,
    publishedAt: "2026-06-05",
    status: "Published",
  },
  {
    id: "daa_5",
    projectId: "da_trading_platform",
    category: "trading",
    title: "Tư duy quản trị vốn khi mới bắt đầu Trading",
    slug: "tu-duy-quan-tri-von-khi-moi-bat-dau-trading",
    excerpt: "Những nguyên tắc quản trị vốn cơ bản tôi áp dụng khi thực hành giao dịch.",
    content: "Quản trị vốn quan trọng hơn việc cố gắng đoán đúng hướng giá...\n\n- Chỉ rủi ro một phần nhỏ vốn cho mỗi lệnh\n- Luôn đặt điểm dừng lỗ rõ ràng\n- Ghi lại nhật ký giao dịch để rút kinh nghiệm",
    image: "💹",
    author: "Võ Đương",
    tags: ["Trading", "Quản trị vốn", "Kỷ luật giao dịch"],
    metaTitle: "Tư duy quản trị vốn khi mới bắt đầu Trading",
    metaDescription: "Những nguyên tắc quản trị vốn cơ bản tôi áp dụng khi thực hành giao dịch.",
    featured: false,
    publishedAt: "2026-06-01",
    status: "Published",
  },
  {
    id: "daa_6",
    projectId: "da_equity_project",
    category: "equity",
    title: "Vì sao tôi quan tâm đến đầu tư cổ phần doanh nghiệp",
    slug: "vi-sao-quan-tam-dau-tu-co-phan-doanh-nghiep",
    excerpt: "Góc nhìn dài hạn về việc sở hữu một phần doanh nghiệp thực, bên cạnh tài sản số.",
    content: "Bên cạnh tài sản số, tôi cũng tìm hiểu các cơ hội sở hữu cổ phần doanh nghiệp...\n\nĐây là một kênh đầu tư dài hạn cần nghiên cứu kỹ về tài chính và pháp lý doanh nghiệp trước khi tham gia.",
    image: "🏢",
    author: "Võ Đương",
    tags: ["Cổ phần doanh nghiệp", "Đầu tư dài hạn"],
    metaTitle: "Vì sao tôi quan tâm đến đầu tư cổ phần doanh nghiệp",
    metaDescription: "Góc nhìn dài hạn về việc sở hữu một phần doanh nghiệp thực, bên cạnh tài sản số.",
    featured: false,
    publishedAt: "2026-05-28",
    status: "Published",
  },
];

export type DigitalAssetStats = {
  clicksByCategory: { category: DigitalAssetCategoryKey; categoryName: string; clicks: number }[];
  topProjectsViewed: { projectId: string; projectName: string; views: number }[];
  topAffiliateLinksClicked: { linkId: string; linkTitle: string; projectName: string; clicks: number }[];
  topArticleViews: { articleId: string; articleTitle: string; views: number }[];
  mostActiveCategory: { category: DigitalAssetCategoryKey; categoryName: string; engagementScore: number };
  mostLinkedProject: { projectId: string; projectName: string; linkCount: number };
};

export const digitalAssetStats: DigitalAssetStats = {
  clicksByCategory: [
    { category: "blockchain", categoryName: "Blockchain", clicks: 2774 },
    { category: "trading", categoryName: "Trading", clicks: 2159 },
    { category: "crypto", categoryName: "Crypto", clicks: 1689 },
    { category: "digiu", categoryName: "DigiU", clicks: 1367 },
    { category: "equity", categoryName: "Cổ phần doanh nghiệp", clicks: 1184 },
  ],
  topProjectsViewed: [
    { projectId: "da_blockchain_exchange", projectName: "Sàn giao dịch Blockchain mẫu", views: 3420 },
    { projectId: "da_trading_platform", projectName: "Nền tảng Trading mẫu", views: 2890 },
    { projectId: "da_crypto_tracker", projectName: "Công cụ theo dõi thị trường Crypto", views: 2410 },
    { projectId: "da_digiu_ecosystem", projectName: "DigiU Ecosystem", views: 1980 },
    { projectId: "da_equity_project", projectName: "Dự án cổ phần doanh nghiệp mẫu", views: 1320 },
  ],
  topAffiliateLinksClicked: [
    { linkId: "dal_19", linkTitle: "Link đăng ký Affiliate", projectName: "Nền tảng Trading mẫu", clicks: 1450 },
    { linkId: "dal_9", linkTitle: "Link đăng ký Affiliate", projectName: "Sàn giao dịch Blockchain mẫu", clicks: 1280 },
    { linkId: "dal_15", linkTitle: "Link Affiliate", projectName: "Công cụ theo dõi thị trường Crypto", clicks: 967 },
    { linkId: "dal_26", linkTitle: "Link Affiliate", projectName: "Nền tảng gọi vốn/cổ phần mẫu", clicks: 689 },
    { linkId: "dal_2", linkTitle: "Link đăng ký", projectName: "DigiU Ecosystem", clicks: 812 },
  ],
  topArticleViews: [
    { articleId: "daa_3", articleTitle: "Cách tôi tiếp cận một sàn giao dịch blockchain mới", views: 1840 },
    { articleId: "daa_5", articleTitle: "Tư duy quản trị vốn khi mới bắt đầu Trading", views: 1520 },
    { articleId: "daa_4", articleTitle: "Theo dõi thị trường Crypto như thế nào cho có hệ thống", views: 1210 },
    { articleId: "daa_1", articleTitle: "Giới thiệu DigiU Ecosystem — góc nhìn cá nhân", views: 980 },
    { articleId: "daa_6", articleTitle: "Vì sao tôi quan tâm đến đầu tư cổ phần doanh nghiệp", views: 640 },
  ],
  mostActiveCategory: { category: "blockchain", categoryName: "Blockchain", engagementScore: 92 },
  mostLinkedProject: { projectId: "da_blockchain_exchange", projectName: "Sàn giao dịch Blockchain mẫu", linkCount: 4 },
};

export const defaultDigitalAssetDisclaimer =
  "Nội dung chỉ nhằm mục đích chia sẻ thông tin và trải nghiệm cá nhân, không phải lời khuyên đầu tư. Bạn cần tự nghiên cứu và tự chịu trách nhiệm với quyết định của mình.";

export type DigitalAssetSettings = { id: string; disclaimer: string };

export const digitalAssetSettingsSeed: DigitalAssetSettings[] = [
  { id: "settings_digital_assets", disclaimer: defaultDigitalAssetDisclaimer },
];
