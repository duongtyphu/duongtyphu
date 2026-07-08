import type { LucideIcon } from "lucide-react";
import { Layers, Building2, Bitcoin, Link2, LineChart } from "lucide-react";
import type { DigitalAssetCategoryKey } from "@/data/digitalAssets";

/**
 * Portal 4.0 — Project Ecosystem Architecture (docs/PROJECT_ECOSYSTEM_ARCHITECTURE.md).
 *
 * `Ecosystem` is the CMS-shaped content model for a mini-site rendered at
 * `/portal/duan-cohoi/[ecosystemSlug]`. This is a STATIC data file standing
 * in for the future CMS collection described in docs/PROJECT_CMS_ARCHITECTURE.md
 * (no admin/CRUD is built in this phase — see that doc's §10 "What this
 * document does not authorize"). Field shapes intentionally mirror that
 * doc's §4 CMS field model so a future admin module can adopt this exact
 * shape without a migration.
 *
 * NO FAKE DATA: `video`/`products`/`resources` are honestly empty for all 5
 * ecosystems today — there is no real video, no real per-ecosystem product
 * breakdown, and no real resource files in this codebase. Do not add
 * illustrative/fictional entries here (see architecture doc §3.3's DigiU/
 * WebWisePay/AlphaMind example — that was illustrative only, never real).
 */

export type EcosystemStatusBadge =
  | "Đang theo dõi"
  | "Đang nghiên cứu"
  | "Chia sẻ trải nghiệm"
  | "Đang tham gia"
  | "Chia sẻ kiến thức";

export type EcosystemProduct = {
  id: string;
  name: string;
  shortDescription: string;
  link?: string;
  badge?: EcosystemStatusBadge;
  order: number;
  visible: boolean;
};

export type EcosystemResource = {
  id: string;
  title: string;
  type: "PDF" | "Presentation" | "Website" | "Document";
  url: string;
  order: number;
};

export type EcosystemCtaIconKind =
  | "Official Website"
  | "Register"
  | "Affiliate"
  | "Telegram"
  | "Facebook"
  | "YouTube"
  | "Whitepaper"
  | "Download App";

export type EcosystemCta = {
  id: string;
  label: string;
  url: string;
  role: "primary" | "secondary";
  iconKind: EcosystemCtaIconKind;
  order: number;
  visible: boolean;
};

export type EcosystemFaqItem = { question: string; answer: string };

export type Ecosystem = {
  id: string;
  slug: string;
  /** Matches DigitalAssetCategoryKey — used to scope real digitalAssetArticles by category. */
  articleCategory: DigitalAssetCategoryKey;
  name: string;
  icon: LucideIcon;
  shortDescription: string;
  fullIntro: string;
  highlights: string[];
  statusBadge: EcosystemStatusBadge;
  whoFor: string;
  whoNotReady: string;
  learnFirst: { label: string; href: string };
  expectedOutcome: string;
  /** No real video exists for any ecosystem today — honest null, template omits the section. */
  video: null;
  /** No real per-ecosystem product breakdown exists today — honest empty, template renders the required empty-state line. */
  products: EcosystemProduct[];
  /** No real resource files exist today — honest empty, section omitted entirely. */
  resources: EcosystemResource[];
  faq: EcosystemFaqItem[];
  ctas: EcosystemCta[];
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
    learnFirst: { label: "Học viện AI — nền tảng AI cơ bản", href: "/portal/hocvienai" },
    expectedOutcome: "Kỹ năng vận hành một kênh nội dung số bằng AI — không phải cam kết thu nhập cụ thể.",
    video: null,
    products: [],
    resources: [],
    faq: [
      {
        question: "Đây có phải lời khuyên đầu tư hay kiếm tiền không?",
        answer:
          "Không. Đây là chia sẻ trải nghiệm cá nhân của mình về DigiU — bạn tự nghiên cứu thêm và tự chịu trách nhiệm với quyết định của mình.",
      },
      {
        question: "Vì sao chưa có bài viết/sản phẩm nào liệt kê ở đây?",
        answer:
          "Vì tới hiện tại mình chưa có nội dung thật đủ chi tiết để đăng riêng cho từng sản phẩm con trong DigiU — mình sẽ cập nhật khi có, không dựng nội dung tạm để lấp chỗ trống.",
      },
    ],
    ctas: [
      {
        id: "cta_digiu_1",
        label: "Xem các dự án DigiU đang theo dõi",
        url: "/portal/digital-assets/category/digiu",
        role: "primary",
        iconKind: "Official Website",
        order: 1,
        visible: true,
      },
      {
        id: "cta_digiu_2",
        label: "Học viện AI — nền tảng AI cơ bản",
        url: "/portal/hocvienai",
        role: "secondary",
        iconKind: "Register",
        order: 2,
        visible: true,
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
    learnFirst: { label: "Đọc Tiêu chí chia sẻ trước khi xem", href: "/portal/duan-cohoi#tieu-chi" },
    expectedOutcome: "Hiểu rõ hơn cách một mô hình cổ phần dài hạn vận hành — không phải cam kết lợi nhuận.",
    video: null,
    products: [],
    resources: [],
    faq: [
      {
        question: "SolarGroup có phải một khuyến nghị đầu tư từ VO DUONG AI không?",
        answer:
          "Không. Đây là góc nhìn cá nhân trong quá trình mình nghiên cứu — bạn cần tự đọc tài liệu gốc và tự quyết định, không dựa vào trang này để đầu tư.",
      },
      {
        question: "Vì sao trạng thái vẫn là 'Đang nghiên cứu' chứ chưa 'Đang tham gia'?",
        answer:
          "Vì mình chưa đủ trải nghiệm thực tế để nâng mức độ chia sẻ lên — trạng thái này sẽ cập nhật trung thực khi có thay đổi thật, không nâng cấp trước để trông hấp dẫn hơn.",
      },
    ],
    ctas: [
      {
        id: "cta_solargroup_1",
        label: "Xem các dự án cổ phần đang theo dõi",
        url: "/portal/digital-assets/category/equity",
        role: "primary",
        iconKind: "Official Website",
        order: 1,
        visible: true,
      },
      {
        id: "cta_solargroup_2",
        label: "Đọc Tiêu chí chia sẻ trước khi xem",
        url: "/portal/duan-cohoi#tieu-chi",
        role: "secondary",
        iconKind: "Whitepaper",
        order: 2,
        visible: true,
      },
    ],
    order: 2,
    status: "Published",
  },
  {
    id: "eco_crypto",
    slug: "crypto",
    articleCategory: "crypto",
    name: "Blockchain & Crypto",
    icon: Bitcoin,
    shortDescription:
      "Kiến thức nền tảng và các sàn giao dịch mình đã thử — bao gồm cả bài học từ sai lầm.",
    fullIntro:
      "Đây là nơi mình gom lại kiến thức nền về blockchain/crypto và trải nghiệm thật khi tự dùng ví, sàn giao dịch — kể cả những lần mình đã sai. Mục tiêu là giúp bạn hiểu đúng trước khi tự mình thử, không phải để bạn làm theo một chiến lược cụ thể nào.",
    highlights: [
      "Bao gồm cả bài học từ những lần mình từng mất tiền hoặc thao tác sai.",
      "Biến động giá và rủi ro công nghệ ở đây cao hơn nhiều so với các hệ sinh thái khác trên trang.",
    ],
    statusBadge: "Chia sẻ trải nghiệm",
    whoFor: "Người tò mò về công nghệ mới, chấp nhận rủi ro cao và biến động giá lớn.",
    whoNotReady: "Người chưa từng tự quản lý một ví số, hoặc coi đây là cách làm giàu nhanh.",
    learnFirst: { label: "Nhật ký học tập — bài học từ sai lầm thật", href: "/portal/nhatkyhoctap" },
    expectedOutcome: "Kiến thức nền về blockchain và cách tự bảo vệ tài sản số — không phải lợi nhuận giao dịch.",
    video: null,
    products: [],
    resources: [],
    faq: [
      {
        question: "Mình có nên tham gia Crypto chỉ vì thấy hấp dẫn không?",
        answer:
          "Không nên. Nếu bạn coi đây là cách làm giàu nhanh hoặc chưa từng tự quản lý một ví số, hãy đọc phần 'Chưa nên tham gia nếu' ở trên trước khi đi tiếp.",
      },
    ],
    ctas: [
      {
        id: "cta_crypto_1",
        label: "Xem các dự án Crypto đang theo dõi",
        url: "/portal/digital-assets/category/crypto",
        role: "primary",
        iconKind: "Official Website",
        order: 1,
        visible: true,
      },
      {
        id: "cta_crypto_2",
        label: "Nhật ký học tập — bài học từ sai lầm thật",
        url: "/portal/nhatkyhoctap",
        role: "secondary",
        iconKind: "Register",
        order: 2,
        visible: true,
      },
    ],
    order: 3,
    status: "Published",
  },
  {
    id: "eco_blockchain",
    slug: "blockchain",
    articleCategory: "blockchain",
    name: "Blockchain Projects",
    icon: Link2,
    shortDescription:
      "Các dự án Blockchain mình đang theo dõi — tài liệu, whitepaper và đánh giá cá nhân.",
    fullIntro:
      "Sau khi đã hiểu nền tảng blockchain ở mục Blockchain & Crypto, đây là nơi mình theo dõi các dự án cụ thể — đọc whitepaper, ghi lại đánh giá cá nhân. Đây không phải danh sách khuyến nghị mua/bán, chỉ là nhật ký theo dõi của mình.",
    highlights: [
      "Yêu cầu đã hiểu kiến thức nền ở Blockchain & Crypto trước khi đọc mục này.",
      "Đánh giá ở đây là góc nhìn cá nhân tại thời điểm viết, có thể thay đổi khi dự án phát triển thêm.",
    ],
    statusBadge: "Đang theo dõi",
    whoFor: "Người đã hiểu blockchain cơ bản, muốn theo dõi các dự án cụ thể.",
    whoNotReady: "Người chưa đọc qua mục Blockchain & Crypto — nền tảng cần đi trước dự án cụ thể.",
    learnFirst: { label: "Xem Blockchain & Crypto trước", href: "/portal/duan-cohoi/crypto" },
    expectedOutcome: "Khả năng tự đọc và đánh giá whitepaper của một dự án — không phải khuyến nghị mua/bán.",
    video: null,
    products: [],
    resources: [],
    faq: [
      {
        question: "Cần đọc gì trước khi xem các dự án ở đây?",
        answer:
          "Nên đọc qua Blockchain & Crypto trước — mục đó giải thích kiến thức nền, còn mục này chỉ theo dõi các dự án cụ thể dựa trên nền tảng đó.",
      },
    ],
    ctas: [
      {
        id: "cta_blockchain_1",
        label: "Xem các dự án Blockchain đang theo dõi",
        url: "/portal/digital-assets/category/blockchain",
        role: "primary",
        iconKind: "Official Website",
        order: 1,
        visible: true,
      },
      {
        id: "cta_blockchain_2",
        label: "Xem Blockchain & Crypto trước",
        url: "/portal/duan-cohoi/crypto",
        role: "secondary",
        iconKind: "Whitepaper",
        order: 2,
        visible: true,
      },
    ],
    order: 4,
    status: "Published",
  },
  {
    id: "eco_trading",
    slug: "trading",
    articleCategory: "trading",
    name: "Trading",
    icon: LineChart,
    shortDescription:
      "Kiến thức và tài nguyên Trading — từ nền tảng đến chiến lược mình đã thử và rút ra bài học.",
    fullIntro:
      "Trading ở đây là hành trình học có kỷ luật, không phải công thức thắng chắc chắn. Mình chia sẻ những gì mình đã thử, kể cả những lần thua lỗ, để bạn có cái nhìn thật trước khi tự mình bắt đầu.",
    highlights: [
      "Thua lỗ là một phần bình thường trong nội dung chia sẻ ở đây, không bị lược bỏ.",
      "Trọng tâm là kỷ luật quản lý vốn, không phải một chiến lược 'thắng chắc'.",
    ],
    statusBadge: "Chia sẻ kiến thức",
    whoFor: "Người muốn học giao dịch có kỷ luật, chấp nhận thua lỗ là một phần bình thường của quá trình học.",
    whoNotReady: "Người muốn làm giàu nhanh, hoặc không chấp nhận được khả năng mất vốn.",
    learnFirst: { label: "Nhật ký học tập — bài học quản lý vốn thật", href: "/portal/nhatkyhoctap" },
    expectedOutcome: "Kỷ luật quản lý vốn và đọc thị trường cơ bản — không phải công thức thắng chắc chắn.",
    video: null,
    products: [],
    resources: [],
    faq: [
      {
        question: "Trading ở đây có đảm bảo lợi nhuận không?",
        answer:
          "Không có gì được đảm bảo. Trang này chia sẻ kỷ luật và bài học thật, kể cả thua lỗ — không phải một công thức thắng chắc chắn.",
      },
    ],
    ctas: [
      {
        id: "cta_trading_1",
        label: "Xem các dự án Trading đang theo dõi",
        url: "/portal/digital-assets/category/trading",
        role: "primary",
        iconKind: "Official Website",
        order: 1,
        visible: true,
      },
      {
        id: "cta_trading_2",
        label: "Nhật ký học tập — bài học quản lý vốn thật",
        url: "/portal/nhatkyhoctap",
        role: "secondary",
        iconKind: "Register",
        order: 2,
        visible: true,
      },
    ],
    order: 5,
    status: "Published",
  },
];

export function getEcosystemBySlug(slug: string): Ecosystem | undefined {
  return ecosystems.find((e) => e.slug === slug && e.status === "Published");
}

/**
 * Defensive render-time safeguard (Ecosystem Architecture §10 / task
 * instruction #10): exactly one CTA renders as primary even if the data
 * mistakenly carries more than one `role: "primary"` — pick the first one
 * marked primary, demote the rest to secondary for rendering purposes only.
 */
export function resolveCtas(ecosystem: Ecosystem): { primary: EcosystemCta | undefined; secondary: EcosystemCta[] } {
  const visible = ecosystem.ctas.filter((c) => c.visible).sort((a, b) => a.order - b.order);
  const firstPrimaryIndex = visible.findIndex((c) => c.role === "primary");
  const primary = firstPrimaryIndex >= 0 ? visible[firstPrimaryIndex] : undefined;
  const secondary = visible.filter((_, i) => i !== firstPrimaryIndex);
  return { primary, secondary };
}
