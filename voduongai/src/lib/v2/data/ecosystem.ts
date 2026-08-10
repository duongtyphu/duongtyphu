import { mockFetch } from "./client";

/**
 * Ba trang đối tác (DigiU, Ohana, SolarGroup) dùng chung một khuôn: hero →
 * giới thiệu → các trụ cột → lộ trình → CTA. Gom nội dung về một chỗ để
 * `PartnerPage` render, thay vì lặp layout ba lần.
 */
export type PartnerPillar = { id: string; title: string; description: string };
export type PartnerMilestone = { id: string; period: string; title: string; done: boolean };

export type PartnerProfile = {
  slug: string;
  name: string;
  tagline: string;
  heroTitle: string;
  heroBody: string;
  aboutTitle: string;
  aboutBody: string;
  pillarsTitle: string;
  pillars: PartnerPillar[];
  milestonesTitle: string;
  milestones: PartnerMilestone[];
  stats: { label: string; value: string }[];
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
  accentFrom: string;
  accentTo: string;
};

const PARTNERS: Record<string, PartnerProfile> = {
  digiu: {
    slug: "digiu",
    name: "DigiU",
    tagline:
      "Hệ sinh thái phát triển và gọi vốn (VC funding) cho các dự án công nghệ AI, Blockchain và Web3.",
    heroTitle: "DigiU — Hệ sinh thái phát triển & gọi vốn cho công nghệ tương lai",
    heroBody:
      "DigiU nghiên cứu AI, Blockchain, Web3, RWA và năng lượng, đồng thời vận hành quỹ đầu tư mạo hiểm tài trợ cho các startup công nghệ giai đoạn đầu.",
    aboutTitle: "Về DigiU",
    aboutBody:
      "DigiU là hệ sinh thái phát triển và gọi vốn cho các dự án công nghệ. Bộ phận DigiU Tech nghiên cứu và phát triển sản phẩm, trong khi quỹ đầu tư tài trợ cho startup Blockchain, AI và Web3 ở giai đoạn sớm — nơi vốn khó tiếp cận nhất nhưng tác động lớn nhất.",
    pillarsTitle: "Các trụ cột của DigiU",
    pillars: [
      { id: "d1", title: "DigiU Tech", description: "Nghiên cứu AI, Blockchain, RWA, VR và năng lượng cho công nghệ tương lai." },
      { id: "d2", title: "DigiU Capital", description: "Quỹ đầu tư mạo hiểm tài trợ startup Blockchain, AI và Web3 giai đoạn đầu." },
      { id: "d3", title: "DigiU Academy", description: "Dự án giáo dục AI thực chiến với 3 cấp độ: Cơ bản, Nâng cao, Chuyên sâu." },
      { id: "d4", title: "Danh mục dự án", description: "EYWA, CrossCurve, Antipad, WebWise Wallet, Apato, BinaryX, SpiritTime." },
    ],
    milestonesTitle: "Lộ trình phát triển",
    milestones: [
      { id: "dm1", period: "2023", title: "Thành lập DigiU Tech và nhóm nghiên cứu lõi", done: true },
      { id: "dm2", period: "2024", title: "Ra mắt quỹ đầu tư, giải ngân cho 7 dự án đầu tiên", done: true },
      { id: "dm3", period: "2025", title: "Mở rộng danh mục lên 12 dự án, ra mắt DigiU Academy", done: true },
      { id: "dm4", period: "2026", title: "Hợp tác đào tạo doanh nghiệp cùng VO DUONG AI", done: false },
    ],
    stats: [
      { label: "Dự án trong danh mục", value: "12" },
      { label: "Lĩnh vực nghiên cứu", value: "5" },
      { label: "Cấp độ đào tạo", value: "3" },
      { label: "Năm hoạt động", value: "3" },
    ],
    ctaTitle: "Sẵn sàng tham gia cùng DigiU?",
    ctaBody: "Trở thành đồng sở hữu và nhận ngay các quyền lợi độc quyền.",
    ctaLabel: "Tìm hiểu cơ hội",
    accentFrom: "#5f8fff",
    accentTo: "#1d5fd8",
  },

  ohana: {
    slug: "ohana",
    name: "Ohana",
    tagline:
      "Vũ trụ hợp nhất của giá trị và thịnh vượng số — mạng lưới siêu kết nối hợp nhất SaaS, AI và Web3.",
    heroTitle: "Ohana — Vũ trụ hợp nhất của Giá trị & Thịnh vượng số",
    heroBody:
      "Hệ sinh thái Ohana là mạng lưới siêu kết nối hợp nhất SaaS, AI và Web3, kiến tạo một không gian nơi giá trị được tạo ra, trao đổi và tích luỹ trong cùng một hạ tầng.",
    aboutTitle: "Về Ohana",
    aboutBody:
      "Ohana là hệ sinh thái của Astronixa, kết hợp SaaS, mạng xã hội — thương mại và hạ tầng Blockchain. Mục tiêu là xoá ranh giới giữa các nền tảng rời rạc: một tài khoản, một ví, một mạng lưới giá trị dùng chung.",
    pillarsTitle: "Các trụ cột chiến lược của Ohana",
    pillars: [
      { id: "o1", title: "Ohana Core & Wallet", description: "Nền tảng cốt lõi và ví thanh toán lai kết nối Fiat với Crypto trong toàn hệ sinh thái." },
      { id: "o2", title: "Ohana Social", description: "Mạng xã hội, giao tiếp nhóm và xây dựng cộng đồng gắn kết trên toàn cầu." },
      { id: "o3", title: "Ohana Commerce", description: "Hệ thống thương mại điện tử nhẹ, hỗ trợ người bán và mở rộng qua tiếp thị liên kết." },
      { id: "o4", title: "Ohana Rewards", description: "Cổng game hoá tích điểm và lớp Blockchain ánh xạ phần thưởng thành token Astron." },
    ],
    milestonesTitle: "Lộ trình chiến lược",
    milestones: [
      { id: "om1", period: "Giai đoạn 1", title: "Hoàn thiện Ohana Core và ví thanh toán lai", done: true },
      { id: "om2", period: "Giai đoạn 2", title: "Mở Ohana Social và cộng đồng người dùng đầu tiên", done: true },
      { id: "om3", period: "Giai đoạn 3", title: "Ra mắt Ohana Commerce và mạng lưới người bán", done: false },
      { id: "om4", period: "Giai đoạn 4", title: "Triển khai token Astron và lớp phần thưởng on-chain", done: false },
    ],
    stats: [
      { label: "Trụ cột chiến lược", value: "4" },
      { label: "Giai đoạn lộ trình", value: "4" },
      { label: "Đã hoàn thành", value: "2" },
      { label: "Hạ tầng chung", value: "1 ví" },
    ],
    ctaTitle: "Tham gia hệ sinh thái Ohana",
    ctaBody: "Kết nối một lần, dùng chung toàn bộ mạng lưới giá trị.",
    ctaLabel: "Khám phá Ohana",
    accentFrom: "#a08bff",
    accentTo: "#6d4aff",
  },

  solargroup: {
    slug: "solargroup",
    name: "SolarGroup",
    tagline:
      'Công ty đầu tư quốc tế tài trợ dự án "Động cơ của Duyunov" — công nghệ cuộn dây Slavyanka.',
    heroTitle: "Động cơ của Duyunov — Công nghệ Slavyanka",
    heroBody:
      "Hỗ trợ các sáng tạo công nghệ và thu lợi nhuận từ đó. Dự án thương mại hoá công nghệ cuộn dây Slavyanka cho động cơ điện hiệu suất cao.",
    aboutTitle: "Về SolarGroup",
    aboutBody:
      'SolarGroup là công ty đầu tư quốc tế tổ chức gọi vốn cộng đồng cho dự án "Động cơ của Duyunov". Nhà đầu tư trở thành đồng sở hữu phần vốn dự án và hưởng lợi nhuận theo tỷ lệ đóng góp khi công nghệ được thương mại hoá.',
    pillarsTitle: "2 dự án con của SolarGroup",
    pillars: [
      { id: "s1", title: "Sovelmash", description: 'Bộ phận thiết kế và công nghệ kỹ thuật (D&E) tại Technopolis Moscow "Alabushevo", nơi thực hiện nghiên cứu và thử nghiệm động cơ.' },
      { id: "s2", title: "Khí cầu Thế hệ mới", description: "Phát triển, sản xuất và vận hành khí cầu thế hệ mới — thực hiện bởi AERONOVA, hướng tới thị trường vận tải hàng hoá đường không chi phí thấp." },
    ],
    milestonesTitle: "Lộ trình dự án",
    milestones: [
      { id: "sm1", period: "Giai đoạn 1", title: "Hoàn tất nghiên cứu và đăng ký sáng chế công nghệ Slavyanka", done: true },
      { id: "sm2", period: "Giai đoạn 2", title: "Xây dựng trung tâm thiết kế Sovelmash tại Alabushevo", done: true },
      { id: "sm3", period: "Giai đoạn 3", title: "Sản xuất thử nghiệm và kiểm định động cơ theo tiêu chuẩn công nghiệp", done: false },
      { id: "sm4", period: "Giai đoạn 4", title: "Thương mại hoá và mở rộng sang thị trường quốc tế", done: false },
    ],
    stats: [
      { label: "Dự án con", value: "2" },
      { label: "Giai đoạn lộ trình", value: "4" },
      { label: "Đã hoàn thành", value: "2" },
      { label: "Mô hình", value: "Gọi vốn CĐ" },
    ],
    ctaTitle: "Trở thành đồng sở hữu dự án",
    ctaBody: "Tham gia gọi vốn cộng đồng và hưởng lợi nhuận theo tỷ lệ phần vốn.",
    ctaLabel: "Xem cơ hội đầu tư",
    accentFrom: "#ffc964",
    accentTo: "#e2b23c",
  },
};

export async function getPartner(slug: string): Promise<PartnerProfile | null> {
  return mockFetch(PARTNERS[slug] ?? null);
}

export function listPartnerSlugs(): string[] {
  return Object.keys(PARTNERS);
}
