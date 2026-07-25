import type { LucideIcon } from "lucide-react";
import { Layers, Building2, Bitcoin, Link2, LineChart } from "lucide-react";
import type { DigitalAssetCategoryKey } from "@/data/digitalAssets";

/**
 * Portal 4.0 — Project Ecosystem Architecture (docs/PROJECT_ECOSYSTEM_ARCHITECTURE.md),
 * RESTRUCTURED per direct Product Owner instruction (supersedes doc's original
 * 7-section template for this rebuild — see task instructions). `Ecosystem`
 * is the CMS-shaped content model for a mini-site rendered at
 * `/portal/duan-cohoi/[ecosystemSlug]`. Still a STATIC data file standing in
 * for the future CMS collection described in docs/PROJECT_CMS_ARCHITECTURE.md
 * (no admin/CRUD is built in this phase).
 *
 * Five ecosystems now split into 3 structurally different template shapes,
 * driven by `structureType`:
 * - "sub-projects" (DigiU, SolarGroup): intro → marketing link box → sub-projects
 *   grid → potential analysis → articles.
 * - "two-field" (Blockchain & Crypto): intro → 2 field boxes (Blockchain /
 *   Crypto), each with its own marketing link box → potential analysis → articles.
 * - "affiliate-list" (Làm tiếp thị liên kết (Affiliate), formerly "Blockchain
 *   Projects"): intro → affiliate offers list → potential analysis → articles.
 * - "exchange-list" (Các sàn giao dịch Crypto, formerly "Trading"): intro →
 *   exchange links list → potential analysis → articles.
 *
 * NO FAKE DATA: `marketingLinks`/`subProjects[].marketingLinks`/`affiliateOffers`/
 * `exchanges` are honestly empty or honestly URL-less where no real link
 * exists today — never a fabricated tracking/referral URL. `potentialAnalysis`
 * is honestly "not-assessed" everywhere — no fabricated verdicts.
 */

export type EcosystemStatusBadge =
  | "Đang theo dõi"
  | "Đang nghiên cứu"
  | "Chia sẻ trải nghiệm"
  | "Đang tham gia"
  | "Chia sẻ kiến thức";

export type StructureType = "sub-projects" | "two-field" | "affiliate-list" | "exchange-list";

/** Admin-addable link (label + url), honestly empty when no real link exists. */
export type MarketingLink = {
  id: string;
  label: string;
  url: string;
  order: number;
  visible: boolean;
  /** Chỉ dùng khi hiển thị như danh sách chương trình tiếp thị liên kết
   * (`AffiliateOffer` cũ, giờ dùng chung shape `MarketingLink` để tái dùng
   * `MarketingLinksFieldEditor`) — bỏ trống ở mọi nơi khác. */
  category?: string;
};

/**
 * Dự án & Cơ hội — Đánh giá (mở rộng riêng, sau khi Nhóm 3 đã đóng).
 * Founder chốt đúng 3 trạng thái (bỏ "partial" cũ, không dòng dữ liệu thật
 * nào từng dùng "partial" nên xoá an toàn): "Đạt" (kèm mức sao 1-5), "Chưa
 * đạt" (kèm lý do: thiếu thông tin/đang thẩm định), "Chưa đánh giá" (mặc
 * định trung thực). Danh sách 6 tiêu chí GIỮ NGUYÊN cố định trong code
 * (Founder chọn "chỉ đổi trạng thái, không tự thêm/sửa/xoá tiêu chí qua
 * Admin") — chỉ trạng thái/sao/lý do/ghi chú mỗi tiêu chí sửa được qua
 * Live-edit (bảng `ecosystem_ratings`, khoá theo `${entityId}__${criterionId}`).
 */
export type PotentialAnalysisStatus = "not-assessed" | "met" | "not-met";
export type NotMetReason = "thieu-thong-tin" | "dang-tham-dinh";

export type PotentialAnalysisItem = {
  /** Id CỐ ĐỊNH, dùng làm criterionId khoá vào bảng ecosystem_ratings —
   * KHÔNG đổi giá trị các id này (đổi id sẽ làm mất liên kết dữ liệu đã
   * lưu qua Admin cho mọi hệ sinh thái/dự án con). */
  id: string;
  criterion: string;
  status: PotentialAnalysisStatus;
  /** CHỈ có ý nghĩa khi status === "met", 1-5. */
  stars?: number;
  /** CHỈ có ý nghĩa khi status === "not-met". */
  notMetReason?: NotMetReason;
  note?: string;
};

/** Generic, honest due-diligence checklist — every row "not-assessed" until a
 * real analyst verdict is recorded for a specific ecosystem/sub-project. */
export const DEFAULT_POTENTIAL_ANALYSIS: PotentialAnalysisItem[] = [
  { id: "pa_public_docs", criterion: "Có tài liệu/website chính thức công khai", status: "not-assessed" },
  { id: "pa_team_transparent", criterion: "Đội ngũ/nguồn gốc dự án minh bạch", status: "not-assessed" },
  { id: "pa_active_community", criterion: "Có cộng đồng đang hoạt động thực tế", status: "not-assessed" },
  { id: "pa_risks_disclosed", criterion: "Rủi ro được nêu rõ, không chỉ nói về lợi ích", status: "not-assessed" },
  { id: "pa_case_studies", criterion: "Có kết quả/case study thực tế được công khai", status: "not-assessed" },
  { id: "pa_clear_model", criterion: "Mô hình vận hành dễ hiểu, không mập mờ", status: "not-assessed" },
];

/**
 * @deprecated Mở rộng riêng "Thêm được các dự án con" đã chuyển hẳn dữ
 * liệu dự án con sang bảng Supabase `ecosystem_subprojects` (xem
 * `src/lib/portal/live-subprojects.ts`) — không còn consumer nào đọc
 * `Ecosystem.subProjects`/`getSubProjectBySlug()` nữa. Giữ lại type + 2
 * ecosystem có `subProjects` thật bên dưới làm tham khảo/rollback (đúng
 * dữ liệu gốc đã migrate, không xoá để dễ đối chiếu).
 */
export type SubProject = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  colorIndex: number;
  marketingLinks: MarketingLink[];
  potentialAnalysis?: PotentialAnalysisItem[];
};

/** Field box (Type B only — Blockchain & Crypto). */
export type EcosystemFieldBox = {
  id: string;
  name: "Blockchain" | "Crypto";
  description: string;
  marketingLinks: MarketingLink[];
};

/** Affiliate offer entry (Type C only). URL is honestly absent when no real
 * tracking/referral link exists yet — never a fabricated href. */
export type AffiliateOffer = {
  id: string;
  name: string;
  category: "Sàn TMĐT" | "Khoá học" | "Khác";
  url?: string;
  order: number;
  visible: boolean;
};

/** Exchange entry (Type D only). Same honest-empty-URL rule as AffiliateOffer. */
export type ExchangeLink = {
  id: string;
  name: string;
  url?: string;
  order: number;
  visible: boolean;
};

export type Ecosystem = {
  id: string;
  slug: string;
  /** Matches DigitalAssetCategoryKey — used to scope real digitalAssetArticles by category. */
  articleCategory: DigitalAssetCategoryKey;
  /** Only used by "two-field" (crypto) ecosystem, which combines two real
   * DigitalAssetCategoryKey values ("blockchain" and "crypto"). */
  extraArticleCategories?: DigitalAssetCategoryKey[];
  name: string;
  icon: LucideIcon;
  shortDescription: string;
  fullIntro: string;
  highlights: string[];
  statusBadge: EcosystemStatusBadge;
  whoFor: string;
  whoNotReady: string;
  expectedOutcome: string;
  structureType: StructureType;
  /** Ecosystem-level marketing/affiliate link box — used directly by
   * "sub-projects" (parent-level box) and unused (honestly empty) by the
   * other structure types, which use their own scoped link lists instead. */
  marketingLinks: MarketingLink[];
  /** "sub-projects" only — honestly empty array if no real sub-project exists yet. */
  subProjects?: SubProject[];
  /** "two-field" only. */
  fields?: EcosystemFieldBox[];
  /** "affiliate-list" only. */
  affiliateOffers?: AffiliateOffer[];
  /** "exchange-list" only. */
  exchanges?: ExchangeLink[];
  /** Ecosystem-level potential analysis override; defaults to DEFAULT_POTENTIAL_ANALYSIS. */
  potentialAnalysis?: PotentialAnalysisItem[];
  order: number;
  status: "Draft" | "Published" | "Hidden";
};

export const ecosystems: Ecosystem[] = [
  {
    id: "eco_digiu",
    slug: "digiu",
    articleCategory: "digiu",
    name: "Hệ sinh thái DigiU",
    icon: Layers,
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
    marketingLinks: [
      {
        id: "link_digiu_main",
        label: "Đăng ký / đăng nhập DigiU",
        url: "https://lk.digiu.ai/auth/registration/6845205668",
        order: 1,
        visible: true,
      },
    ],
    subProjects: [
      {
        id: "sub_digiu_alphamind",
        slug: "alphamind",
        name: "Khoá học Alphamind",
        shortDescription: "Một sản phẩm học trong hệ sinh thái DigiU — đăng ký qua cùng cổng tài khoản DigiU.",
        colorIndex: 0,
        marketingLinks: [
          {
            id: "link_alphamind",
            label: "Đăng ký Khoá học Alphamind",
            url: "https://lk.digiu.ai/auth/registration/6845205668",
            order: 1,
            visible: true,
          },
        ],
      },
      {
        id: "sub_digiu_webwisepay",
        slug: "webwisepay",
        name: "Mở thẻ WebWisePay",
        shortDescription: "Sản phẩm thẻ trong hệ sinh thái DigiU — đăng ký qua Telegram bot riêng.",
        colorIndex: 1,
        marketingLinks: [
          {
            id: "link_webwisepay",
            label: "Mở thẻ WebWisePay (Telegram)",
            url: "https://t.me/WebWisePay_bot?start=ref_49419218-1eac-4683-ab3e-74a7ca266da0",
            order: 1,
            visible: true,
          },
        ],
      },
      {
        id: "sub_digiu_deposits",
        slug: "deposits",
        name: "Mở khoản tiền gửi (Deposits)",
        shortDescription: "Sản phẩm tiền gửi trong hệ sinh thái DigiU — đăng ký qua cùng cổng tài khoản DigiU.",
        colorIndex: 2,
        marketingLinks: [
          {
            id: "link_deposits",
            label: "Mở khoản tiền gửi (Deposits)",
            url: "https://lk.digiu.ai/auth/registration/6845205668",
            order: 1,
            visible: true,
          },
        ],
      },
    ],
    order: 1,
    status: "Published",
  },
  {
    id: "eco_solargroup",
    slug: "solargroup",
    articleCategory: "equity",
    name: "SolarGroup",
    icon: Building2,
    shortDescription:
      "Cơ hội đầu tư cổ phần dài hạn — mình đang nghiên cứu và chia sẻ góc nhìn cá nhân.",
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
    marketingLinks: [
      {
        id: "link_solargroup_main",
        label: "Đăng ký / xem trạng thái SolarGroup",
        url: "https://reg.solargroup.pro/vi/user/ref/plan/my-status?ref_code=frp116",
        order: 1,
        visible: true,
      },
    ],
    subProjects: [
      {
        id: "sub_solargroup_sovelmash",
        slug: "sovelmash",
        name: "Nhà máy Sovelmash",
        shortDescription: "Một dự án con trong hệ sinh thái SolarGroup — đăng ký qua link riêng của dự án.",
        colorIndex: 0,
        marketingLinks: [
          {
            id: "link_sovelmash",
            label: "Xem dự án Nhà máy Sovelmash",
            url: "https://reg.solargroup.pro/frp116/solargroup",
            order: 1,
            visible: true,
          },
        ],
      },
      {
        id: "sub_solargroup_aeronova",
        slug: "aeronova",
        name: "Dự án Khí cầu thế hệ mới AERONOVA",
        shortDescription: "Một dự án con trong hệ sinh thái SolarGroup — đăng ký qua link riêng của dự án.",
        colorIndex: 1,
        marketingLinks: [
          {
            id: "link_aeronova",
            label: "Xem dự án Khí cầu AERONOVA",
            url: "https://reg.solargroup.pro/frp116/airships",
            order: 1,
            visible: true,
          },
        ],
      },
    ],
    order: 2,
    status: "Published",
  },
  {
    id: "eco_crypto",
    // Route Localization: URL đổi "crypto" -> "blockchain-crypto" cho đúng
    // tên hiển thị "Blockchain & Crypto" (redirect cũ->mới ở next.config.ts).
    slug: "blockchain-crypto",
    articleCategory: "crypto",
    extraArticleCategories: ["blockchain"],
    name: "Blockchain & Crypto",
    icon: Bitcoin,
    shortDescription:
      "Kiến thức nền tảng về hai mảng Blockchain và Crypto — bao gồm cả bài học từ sai lầm.",
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
    marketingLinks: [],
    fields: [
      {
        id: "field_blockchain",
        name: "Blockchain",
        description:
          "Mảng công nghệ nền: cách một sổ cái phân tán vận hành, các loại nền tảng blockchain, ví và hợp đồng thông minh. Đây là kiến thức nền, không phải danh sách dự án cụ thể để tham gia.",
        marketingLinks: [],
      },
      {
        id: "field_crypto",
        name: "Crypto",
        description:
          "Mảng tài sản số xây dựng trên nền blockchain: cách thị trường vận hành, cách tự quản lý và bảo vệ tài sản, cùng rủi ro biến động giá. Đây là kiến thức nền, không phải tín hiệu mua/bán.",
        marketingLinks: [],
      },
    ],
    order: 3,
    status: "Published",
  },
  {
    id: "eco_blockchain",
    // Route Localization: URL đổi "blockchain" -> "lam-affilate" cho đúng tên
    // hiển thị "Làm tiếp thị liên kết (Affiliate)" (redirect ở next.config.ts).
    // articleCategory "blockchain" là khoá dữ liệu, KHÔNG đổi theo URL.
    slug: "lam-affilate",
    articleCategory: "blockchain",
    name: "Làm tiếp thị liên kết (Affiliate)",
    icon: Link2,
    shortDescription:
      "Nơi mình liệt kê các chương trình/khoá học tiếp thị liên kết đang tìm hiểu hoặc quảng bá.",
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
    marketingLinks: [],
    affiliateOffers: [
      { id: "aff_lazada", name: "Lazada", category: "Sàn TMĐT", order: 1, visible: true },
      { id: "aff_shopee", name: "Shopee", category: "Sàn TMĐT", order: 2, visible: true },
      { id: "aff_unica", name: "Unica (khoá học)", category: "Khoá học", order: 3, visible: true },
      { id: "aff_khoi_nguyen_mmo", name: "Khởi Nguyên MMO (khoá học)", category: "Khoá học", order: 4, visible: true },
    ],
    order: 4,
    status: "Published",
  },
  {
    id: "eco_trading",
    // Route Localization: URL đổi "trading" -> "sangiaodich" cho đúng tên
    // hiển thị "Các sàn giao dịch Crypto" (redirect cũ->mới ở next.config.ts).
    slug: "sangiaodich",
    articleCategory: "trading",
    name: "Các sàn giao dịch Crypto",
    icon: LineChart,
    shortDescription:
      "Danh sách các sàn giao dịch crypto mình đang theo dõi hoặc đã dùng thử.",
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
    marketingLinks: [],
    exchanges: [
      { id: "exc_binance", name: "Binance", order: 1, visible: true },
      { id: "exc_okx", name: "OKX", order: 2, visible: true },
      { id: "exc_mexc", name: "MEXC", order: 3, visible: true },
      { id: "exc_bybit", name: "Bybit", order: 4, visible: true },
      { id: "exc_kucoin", name: "Kucoin", order: 5, visible: true },
      { id: "exc_gate", name: "Gate", order: 6, visible: true },
      { id: "exc_bitget", name: "Bitget", order: 7, visible: true },
    ],
    order: 5,
    status: "Published",
  },
];

export function getEcosystemBySlug(slug: string): Ecosystem | undefined {
  return ecosystems.find((e) => e.slug === slug && e.status === "Published");
}

export function getSubProjectBySlug(ecosystem: Ecosystem, subProjectSlug: string): SubProject | undefined {
  return ecosystem.subProjects?.find((p) => p.slug === subProjectSlug);
}
