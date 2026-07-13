import type { DigitalAssetCategoryKey } from "@/data/digitalAssets";
import type { EcosystemIconKey, EcosystemColorKey } from "@/components/portal/opportunities/ecosystemVisuals";

/**
 * PROJECTS-SPR-602 (Founder Directive: Projects & Opportunities Canonical
 * Product) — `Ecosystem` là model CHUẨN cho `/portal/duan-cohoi` (Canonical
 * Product), giờ được quản trị qua Admin thật (collection Supabase
 * "ecosystems", xem supabase-projects-opportunities-migration.sql), không
 * còn là file tĩnh đứng thay CMS. Thay thế hoàn toàn model
 * `DigitalAssetProject`/`DigitalAssetLink` cũ (Consumer = 0 trên Portal
 * thật, chỉ phục vụ route /portal/digital-assets/** đã khai tử).
 *
 * So với bản cũ: `icon`(LucideIcon)+màu(2 bảng tra cứu trùng lặp trong 2
 * page.tsx) → `icon`/`colorKey` dạng string chọn từ palette cố định
 * (ecosystemVisuals.ts, không bịa gradient mới). `MarketingLink`/
 * `AffiliateOffer`/`ExchangeLink` → gộp một `EcosystemLink` duy nhất (đúng
 * yêu cầu Founder: 1 field "Link" thay vì 3 object riêng). Thêm mới `faq`
 * (Founder yêu cầu quản lý FAQ theo từng hệ sinh thái — trước đây chỉ có
 * 1 FAQ tĩnh cấp trang, không theo hệ sinh thái) và `relatedArticleIds`
 * (chọn bài viết thật qua Admin thay vì khớp tự động theo category string).
 *
 * NO FAKE DATA: `links`/`subProjects[].links` honestly rỗng hoặc thiếu url
 * khi chưa có link thật. `potentialAnalysis` mặc định "not-assessed". `faq`
 * mặc định rỗng cho tới khi Founder tự nhập qua Admin — không tự bịa câu hỏi.
 */

export type EcosystemStatusBadge =
  | "Đang theo dõi"
  | "Đang nghiên cứu"
  | "Chia sẻ trải nghiệm"
  | "Đang tham gia"
  | "Chia sẻ kiến thức";

export type StructureType = "sub-projects" | "two-field" | "affiliate-list" | "exchange-list";

export const STRUCTURE_TYPE_OPTIONS: { key: StructureType; label: string }[] = [
  { key: "sub-projects", label: "Có dự án con (DigiU, SolarGroup...)" },
  { key: "two-field", label: "Hai mảng song song (Blockchain & Crypto)" },
  { key: "affiliate-list", label: "Danh sách tiếp thị liên kết" },
  { key: "exchange-list", label: "Danh sách sàn giao dịch" },
];

/** CTA / Link ra ngoài — object DUY NHẤT dùng chung cho mọi loại link trên
 * trang (nút CTA đăng ký, link affiliate, link sàn giao dịch...). `category`
 * chỉ có ý nghĩa khi ecosystem thuộc structureType "affiliate-list". */
export type EcosystemLink = {
  id: string;
  label: string;
  url: string;
  category?: string;
  order: number;
  visible: boolean;
};

export type PotentialAnalysisStatus = "not-assessed" | "met" | "not-met" | "partial";

export type PotentialAnalysisItem = {
  criterion: string;
  status: PotentialAnalysisStatus;
  note?: string;
};

export const POTENTIAL_ANALYSIS_STATUS_OPTIONS: { key: PotentialAnalysisStatus; label: string }[] = [
  { key: "not-assessed", label: "Chưa đánh giá" },
  { key: "met", label: "Đạt" },
  { key: "not-met", label: "Không đạt" },
  { key: "partial", label: "Đạt một phần" },
];

/** Checklist due-diligence chung — mọi dòng "not-assessed" tới khi có đánh
 * giá thật cho một ecosystem/sub-project cụ thể. */
export const DEFAULT_POTENTIAL_ANALYSIS: PotentialAnalysisItem[] = [
  { criterion: "Có tài liệu/website chính thức công khai", status: "not-assessed" },
  { criterion: "Đội ngũ/nguồn gốc dự án minh bạch", status: "not-assessed" },
  { criterion: "Có cộng đồng đang hoạt động thực tế", status: "not-assessed" },
  { criterion: "Rủi ro được nêu rõ, không chỉ nói về lợi ích", status: "not-assessed" },
  { criterion: "Có kết quả/case study thực tế được công khai", status: "not-assessed" },
  { criterion: "Mô hình vận hành dễ hiểu, không mập mờ", status: "not-assessed" },
];

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
};

/** Sub-project (structureType "sub-projects" only). `colorIndex` giữ nguyên
 * cơ chế cũ (cycling SUB_PROJECT_PALETTE, subProjectPalette.ts) — không đổi
 * vì đang hoạt động đúng, rủi ro thấp. */
export type SubProject = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  colorIndex: number;
  links: EcosystemLink[];
  potentialAnalysis?: PotentialAnalysisItem[];
};

/** Field box (structureType "two-field" only — Blockchain & Crypto). */
export type EcosystemFieldBox = {
  id: string;
  name: "Blockchain" | "Crypto";
  description: string;
  links: EcosystemLink[];
};

export type Ecosystem = {
  id: string;
  slug: string;
  /** Khớp DigitalAssetCategoryKey — dùng làm fallback lọc bài viết khi
   * `relatedArticleIds` chưa được Founder chọn qua Admin. */
  articleCategory: DigitalAssetCategoryKey;
  extraArticleCategories?: DigitalAssetCategoryKey[];
  name: string;
  icon: EcosystemIconKey;
  colorKey: EcosystemColorKey;
  shortDescription: string;
  fullIntro: string;
  highlights: string[];
  statusBadge: EcosystemStatusBadge;
  whoFor: string;
  whoNotReady: string;
  expectedOutcome: string;
  structureType: StructureType;
  /** CTA/Link cấp Ecosystem — dùng trực tiếp bởi "sub-projects" (link box
   * đăng ký chính); honestly rỗng ở loại khác (dùng links riêng theo field/
   * sub-project). */
  links: EcosystemLink[];
  subProjects?: SubProject[];
  fields?: EcosystemFieldBox[];
  potentialAnalysis?: PotentialAnalysisItem[];
  faq: FaqItem[];
  /** Bài viết liên quan Founder tự chọn qua Admin (ID của digital-asset-articles).
   * Rỗng thì Portal fallback lọc theo articleCategory như cơ chế cũ. */
  relatedArticleIds: string[];
  seoTitle?: string;
  seoDescription?: string;
  order: number;
  status: "Draft" | "Published" | "Hidden";
};

export const ECOSYSTEMS_COLLECTION_KEY = "ecosystems";

export function emptyEcosystem(order: number): Ecosystem {
  return {
    id: "",
    slug: "",
    articleCategory: "digiu",
    name: "",
    icon: "layers",
    colorKey: "blue",
    shortDescription: "",
    fullIntro: "",
    highlights: [],
    statusBadge: "Đang theo dõi",
    whoFor: "",
    whoNotReady: "",
    expectedOutcome: "",
    structureType: "affiliate-list",
    links: [],
    subProjects: [],
    fields: [],
    potentialAnalysis: [],
    faq: [],
    relatedArticleIds: [],
    seoTitle: "",
    seoDescription: "",
    order,
    status: "Draft",
  };
}

export const ecosystemsSeed: Ecosystem[] = [
  {
    id: "eco_digiu",
    slug: "digiu",
    articleCategory: "digiu",
    name: "Hệ sinh thái DigiU",
    icon: "layers",
    colorKey: "blue",
    shortDescription:
      "Nền tảng học và kiếm thu nhập số — mình đang đồng hành và chia sẻ trải nghiệm thực tế.",
    fullIntro:
      "DigiU là hệ sinh thái sản phẩm số mình đang trực tiếp đồng hành và quan sát, không phải một khoá học đã hoàn thiện. Trang này gom lại đúng những gì mình biết chắc tới hiện tại — không tô vẽ thêm để trông hấp dẫn hơn thực tế.",
    highlights: [
      "Đang trong giai đoạn mình trực tiếp theo dõi và sử dụng, chưa phải đánh giá dài hạn.",
      "Nội dung chia sẻ tại đây là trải nghiệm cá nhân, không phải tài liệu chính thức của DigiU.",
    ],
    statusBadge: "Đang theo dõi",
    whoFor: "Người mới muốn bắt đầu kiếm thu nhập số, chấp nhận vài tháng đầu chưa có kết quả rõ ràng.",
    whoNotReady: "Người cần thu nhập ngay lập tức, hoặc chưa từng dùng công cụ AI cơ bản nào.",
    expectedOutcome: "Kỹ năng vận hành một kênh nội dung số bằng AI — không phải cam kết thu nhập cụ thể.",
    structureType: "sub-projects",
    links: [
      { id: "link_digiu_main", label: "Đăng ký / đăng nhập DigiU", url: "https://lk.digiu.ai/auth/registration/6845205668", order: 1, visible: true },
    ],
    subProjects: [
      {
        id: "sub_digiu_alphamind",
        slug: "alphamind",
        name: "Khoá học Alphamind",
        shortDescription: "Một sản phẩm học trong hệ sinh thái DigiU — đăng ký qua cùng cổng tài khoản DigiU.",
        colorIndex: 0,
        links: [
          { id: "link_alphamind", label: "Đăng ký Khoá học Alphamind", url: "https://lk.digiu.ai/auth/registration/6845205668", order: 1, visible: true },
        ],
      },
      {
        id: "sub_digiu_webwisepay",
        slug: "webwisepay",
        name: "Mở thẻ WebWisePay",
        shortDescription: "Sản phẩm thẻ trong hệ sinh thái DigiU — đăng ký qua Telegram bot riêng.",
        colorIndex: 1,
        links: [
          { id: "link_webwisepay", label: "Mở thẻ WebWisePay (Telegram)", url: "https://t.me/WebWisePay_bot?start=ref_49419218-1eac-4683-ab3e-74a7ca266da0", order: 1, visible: true },
        ],
      },
      {
        id: "sub_digiu_deposits",
        slug: "deposits",
        name: "Mở khoản tiền gửi (Deposits)",
        shortDescription: "Sản phẩm tiền gửi trong hệ sinh thái DigiU — đăng ký qua cùng cổng tài khoản DigiU.",
        colorIndex: 2,
        links: [
          { id: "link_deposits", label: "Mở khoản tiền gửi (Deposits)", url: "https://lk.digiu.ai/auth/registration/6845205668", order: 1, visible: true },
        ],
      },
    ],
    faq: [],
    relatedArticleIds: ["daa_1", "daa_2"],
    order: 1,
    status: "Published",
  },
  {
    id: "eco_solargroup",
    slug: "solargroup",
    articleCategory: "equity",
    name: "SolarGroup",
    icon: "building",
    colorKey: "amber",
    shortDescription: "Cơ hội đầu tư cổ phần dài hạn — mình đang nghiên cứu và chia sẻ góc nhìn cá nhân.",
    fullIntro:
      "SolarGroup là một mô hình cổ phần dài hạn mình đang tìm hiểu, chưa phải thứ mình đã tham gia đủ lâu để khẳng định chắc chắn điều gì. Trang này trình bày đúng những gì mình đã đọc/quan sát được, cùng phần mình chưa chắc chắn.",
    highlights: [
      "Đang ở giai đoạn nghiên cứu — mình chưa coi đây là khuyến nghị tham gia.",
      "Mô hình đòi hỏi vốn để lâu dài, không phù hợp cho nhu cầu thanh khoản ngắn hạn.",
    ],
    statusBadge: "Đang nghiên cứu",
    whoFor: "Người có vốn nhàn rỗi thật sự sẵn sàng để lâu dài, chấp nhận không rút được ngay khi cần.",
    whoNotReady: "Người cần thanh khoản ngắn hạn, hoặc chưa từng đọc một bản cáo bạch/whitepaper đầu tư nào.",
    expectedOutcome: "Hiểu rõ hơn cách một mô hình cổ phần dài hạn vận hành — không phải cam kết lợi nhuận.",
    structureType: "sub-projects",
    links: [
      { id: "link_solargroup_main", label: "Đăng ký / xem trạng thái SolarGroup", url: "https://reg.solargroup.pro/vi/user/ref/plan/my-status?ref_code=frp116", order: 1, visible: true },
    ],
    subProjects: [
      {
        id: "sub_solargroup_sovelmash",
        slug: "sovelmash",
        name: "Nhà máy Sovelmash",
        shortDescription: "Một dự án con trong hệ sinh thái SolarGroup — đăng ký qua link riêng của dự án.",
        colorIndex: 0,
        links: [
          { id: "link_sovelmash", label: "Xem dự án Nhà máy Sovelmash", url: "https://reg.solargroup.pro/frp116/solargroup", order: 1, visible: true },
        ],
      },
      {
        id: "sub_solargroup_aeronova",
        slug: "aeronova",
        name: "Dự án Khí cầu thế hệ mới AERONOVA",
        shortDescription: "Một dự án con trong hệ sinh thái SolarGroup — đăng ký qua link riêng của dự án.",
        colorIndex: 1,
        links: [
          { id: "link_aeronova", label: "Xem dự án Khí cầu AERONOVA", url: "https://reg.solargroup.pro/frp116/airships", order: 1, visible: true },
        ],
      },
    ],
    faq: [],
    relatedArticleIds: ["daa_6"],
    order: 2,
    status: "Published",
  },
  {
    id: "eco_crypto",
    slug: "blockchain-crypto",
    articleCategory: "crypto",
    extraArticleCategories: ["blockchain"],
    name: "Blockchain & Crypto",
    icon: "bitcoin",
    colorKey: "slate-emerald",
    shortDescription: "Kiến thức nền tảng về hai mảng Blockchain và Crypto — bao gồm cả bài học từ sai lầm.",
    fullIntro:
      "Đây là nơi mình gom lại kiến thức nền về blockchain và crypto — hai mảng khác nhau nhưng liên quan chặt chẽ. Mục tiêu là giúp bạn hiểu đúng phạm vi từng mảng trước khi tự mình tìm hiểu sâu hơn, không phải để bạn làm theo một chiến lược cụ thể nào.",
    highlights: [
      "Bao gồm cả bài học từ những lần mình từng mất tiền hoặc thao tác sai.",
      "Biến động giá và rủi ro công nghệ ở đây cao hơn nhiều so với các hệ sinh thái khác trên trang.",
    ],
    statusBadge: "Chia sẻ trải nghiệm",
    whoFor: "Người tò mò về công nghệ mới, chấp nhận rủi ro cao và biến động giá lớn.",
    whoNotReady: "Người chưa từng tự quản lý một ví số, hoặc coi đây là cách làm giàu nhanh.",
    expectedOutcome: "Kiến thức nền về blockchain/crypto và cách tự bảo vệ tài sản số — không phải lợi nhuận giao dịch.",
    structureType: "two-field",
    links: [],
    fields: [
      {
        id: "field_blockchain",
        name: "Blockchain",
        description:
          "Mảng công nghệ nền: cách một sổ cái phân tán vận hành, các loại nền tảng blockchain, ví và hợp đồng thông minh. Đây là kiến thức nền, không phải danh sách dự án cụ thể để tham gia.",
        links: [],
      },
      {
        id: "field_crypto",
        name: "Crypto",
        description:
          "Mảng tài sản số xây dựng trên nền blockchain: cách thị trường vận hành, cách tự quản lý và bảo vệ tài sản, cùng rủi ro biến động giá. Đây là kiến thức nền, không phải tín hiệu mua/bán.",
        links: [],
      },
    ],
    faq: [],
    relatedArticleIds: [],
    order: 3,
    status: "Published",
  },
  {
    id: "eco_blockchain",
    slug: "lam-affilate",
    articleCategory: "blockchain",
    name: "Làm tiếp thị liên kết (Affiliate)",
    icon: "link",
    colorKey: "violet-blue",
    shortDescription: "Nơi mình liệt kê các chương trình/khoá học tiếp thị liên kết đang tìm hiểu hoặc quảng bá.",
    fullIntro:
      "Đây là nơi mình liệt kê các chương trình tiếp thị liên kết (affiliate) thật — sàn thương mại điện tử, khoá học — mà mình đang tìm hiểu hoặc quảng bá. Danh sách này có thể thêm/bớt theo thời gian; mục nào chưa có link tiếp thị thật sẽ ghi rõ thay vì dùng link giả.",
    highlights: [
      "Danh sách có thể thêm/bớt theo thời gian, không phải danh sách cố định.",
      "Mục nào chưa có link tiếp thị thật sẽ ghi rõ 'chưa có link' thay vì dùng link giả.",
    ],
    statusBadge: "Đang theo dõi",
    whoFor: "Người muốn tìm hiểu các chương trình tiếp thị liên kết cụ thể mình đang theo dõi.",
    whoNotReady: "Người tìm kiếm một danh sách link tiếp thị đã có sẵn và hoạt động ngay hôm nay.",
    expectedOutcome: "Biết rõ những chương trình affiliate mình đang tìm hiểu — không phải cam kết thu nhập.",
    structureType: "affiliate-list",
    links: [
      { id: "aff_lazada", label: "Lazada", url: "", category: "Sàn TMĐT", order: 1, visible: true },
      { id: "aff_shopee", label: "Shopee", url: "", category: "Sàn TMĐT", order: 2, visible: true },
      { id: "aff_unica", label: "Unica (khoá học)", url: "", category: "Khoá học", order: 3, visible: true },
      { id: "aff_khoi_nguyen_mmo", label: "Khởi Nguyên MMO (khoá học)", url: "", category: "Khoá học", order: 4, visible: true },
    ],
    faq: [],
    relatedArticleIds: [],
    order: 4,
    status: "Published",
  },
  {
    id: "eco_trading",
    slug: "sangiaodich",
    articleCategory: "trading",
    name: "Các sàn giao dịch Crypto",
    icon: "chart",
    colorKey: "emerald-green",
    shortDescription: "Danh sách các sàn giao dịch crypto mình đang theo dõi hoặc đã dùng thử.",
    fullIntro:
      "Đây là danh sách các sàn giao dịch crypto thật, có thể thêm/bớt theo thời gian. Sàn nào chưa có link tiếp thị thật của mình sẽ ghi rõ thay vì dùng link giả — tự bạn vẫn nên vào trang chính thức của từng sàn để tìm hiểu kỹ trước khi dùng.",
    highlights: [
      "Danh sách có thể thêm/bớt theo thời gian, không phải một bảng xếp hạng 'tốt nhất'.",
      "Sàn nào chưa có link tiếp thị thật sẽ ghi rõ 'chưa có link' thay vì dùng link giả.",
    ],
    statusBadge: "Chia sẻ kiến thức",
    whoFor: "Người đã hiểu kiến thức nền về crypto, muốn biết các sàn giao dịch cụ thể mình đang theo dõi.",
    whoNotReady: "Người chưa hiểu kiến thức nền về crypto/ví số — nên đọc Blockchain & Crypto trước.",
    expectedOutcome: "Biết rõ các sàn giao dịch mình đang theo dõi/đã dùng — không phải khuyến nghị nên chọn sàn nào.",
    structureType: "exchange-list",
    links: [
      { id: "exc_binance", label: "Binance", url: "", order: 1, visible: true },
      { id: "exc_okx", label: "OKX", url: "", order: 2, visible: true },
      { id: "exc_mexc", label: "MEXC", url: "", order: 3, visible: true },
      { id: "exc_bybit", label: "Bybit", url: "", order: 4, visible: true },
      { id: "exc_kucoin", label: "Kucoin", url: "", order: 5, visible: true },
      { id: "exc_gate", label: "Gate", url: "", order: 6, visible: true },
      { id: "exc_bitget", label: "Bitget", url: "", order: 7, visible: true },
    ],
    faq: [],
    relatedArticleIds: [],
    order: 5,
    status: "Published",
  },
];

export function getEcosystemBySlug(list: Ecosystem[], slug: string): Ecosystem | undefined {
  return list.find((e) => e.slug === slug && e.status === "Published");
}

export function getSubProjectBySlug(ecosystem: Ecosystem, subProjectSlug: string): SubProject | undefined {
  return ecosystem.subProjects?.find((p) => p.slug === subProjectSlug);
}
