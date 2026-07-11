import type { LucideIcon } from "lucide-react";
import { GraduationCap, Zap, Bot, User, Network } from "lucide-react";

/**
 * PORTAL 4.0 — PREMIUM EXPERIENCE RECONSTRUCTION.
 *
 * Nội dung 5 chương trình Premium — copy chính thức do Product Owner cung
 * cấp (xem brief "PREMIUM EXPERIENCE RECONSTRUCTION"), KHÔNG phải dữ liệu
 * bịa. `listPrice` chỉ là giá niêm yết dự phòng khi bảng `courses` chưa có
 * dòng khớp; giá THẬT và trạng thái mở bán luôn đọc từ bảng `courses`
 * (Supabase) lúc render: `status='open'` → CTA thanh toán, ngược lại →
 * "Sắp mở đăng ký". Admin bật/tắt mở bán và chỉnh giá tại
 * /admin/course-pricing — không cần sửa code. Chạy
 * `supabase-premium-courses.sql` một lần để tạo đủ 5 dòng khoá học.
 */

export type PremiumTopic = {
  /** Tiêu đề chủ đề (OpenClaw có 3 chủ đề riêng); các lớp khác dùng 1 nhóm không tên. */
  title?: string;
  items: string[];
};

export type PremiumAccent = {
  /** Dải gradient đầu card + nút CTA chính. */
  gradient: string;
  /** Quầng glow phía sau card (blur). */
  glow: string;
  /** Màu chữ nhấn (giá, icon, bullet). */
  text: string;
  /** Badge cấp độ. */
  badge: string;
  /** Viền card khi hover. */
  hoverBorder: string;
};

export type PremiumProgram = {
  key: "ai-coban" | "ai-nangcao" | "openclaw" | "v-solo" | "v-scale";
  /** Chuỗi con (lowercase, không dấu cũng thử) để khớp `courses.name` thật trong Supabase. */
  matchPatterns: string[];
  icon: LucideIcon;
  level: string;
  name: string;
  headline?: string;
  description: string;
  audience: string[];
  problems?: string[];
  topics: PremiumTopic[];
  outcome: string;
  lessonCount: number;
  listPrice: number;
  ctaLabel: string;
  accent: PremiumAccent;
};

export const PREMIUM_PROGRAMS: PremiumProgram[] = [
  {
    key: "ai-coban",
    matchPatterns: ["cơ bản", "co ban", "ai basic", "basic"],
    icon: GraduationCap,
    level: "Bước khởi đầu",
    name: "Lớp học AI Cơ bản",
    description:
      "Dành cho người mới bắt đầu muốn hiểu AI, xóa bỏ nỗi sợ cái mới và tự tin làm việc với các công cụ trí tuệ nhân tạo.",
    audience: [
      "Người mới, chưa từng dùng AI một cách nghiêm túc.",
      "Người muốn có nền tảng đúng trước khi đi sâu hơn.",
    ],
    topics: [
      {
        items: [
          "Hiểu về AI để xóa bỏ nỗi sợ cái mới và tự tin khi làm việc với mạng nơ-ron.",
          "ChatGPT: từ các tính năng cơ bản đến sử dụng nâng cao.",
          "Prompt: kỹ thuật CRO, CRAFT, 9 yếu tố và các case chuyên nghiệp.",
          "Lựa chọn và tạo trợ lý AI riêng trong ChatGPT.",
          "Tự động hóa không cần mã: kịch bản và công cụ no-code đơn giản.",
        ],
      },
    ],
    outcome:
      "Hiểu cách sử dụng AI trong công việc hằng ngày, viết prompt tốt hơn, chọn đúng công cụ và bắt đầu tạo trợ lý AI cá nhân.",
    lessonCount: 8,
    listPrice: 1_500_000,
    ctaLabel: "Đăng ký AI Cơ bản",
    accent: {
      gradient: "from-sky-400 to-blue-500",
      glow: "bg-sky-500/20",
      text: "text-sky-300",
      badge: "border-sky-400/30 bg-sky-400/10 text-sky-300",
      hoverBorder: "hover:border-sky-400/50",
    },
  },
  {
    key: "ai-nangcao",
    matchPatterns: ["nâng cao", "nang cao", "advanced"],
    icon: Zap,
    level: "Tăng năng lực",
    name: "Lớp học AI Nâng cao",
    description:
      "Dành cho người đã biết sử dụng AI cơ bản và muốn biến AI thành công cụ làm việc chuyên nghiệp.",
    audience: [
      "Người đã quen với các khả năng cơ bản của AI và muốn tiến xa hơn.",
      "Người muốn làm việc nhanh hơn, mạnh mẽ hơn và chính xác hơn.",
      "Người sẵn sàng biến AI thành công cụ làm việc thực sự, không chỉ thử nghiệm.",
    ],
    topics: [
      {
        items: [
          "Tài liệu tiếp thị: bài thuyết trình, kế hoạch nội dung, bài đăng mạng xã hội.",
          "Tạo nội dung: hình ảnh, hoạt hình, nhân vật, video, landing page.",
          "Nhiệm vụ quản lý: làm việc với đội nhóm và xử lý tình huống công việc phức tạp.",
          "Chuẩn bị và tiến hành đàm phán.",
          "Tài liệu phong phú: sách, kế hoạch kinh doanh, bài báo khoa học, kịch bản.",
          "Gợi ý theo ngữ cảnh và nghiên cứu sâu.",
        ],
      },
    ],
    outcome:
      "Ứng dụng AI vào tiếp thị, nội dung, quản lý, đàm phán, nghiên cứu và xây dựng tài liệu chuyên nghiệp.",
    lessonCount: 6,
    listPrice: 3_999_999,
    ctaLabel: "Đăng ký AI Nâng cao",
    accent: {
      gradient: "from-indigo-500 to-violet-600",
      glow: "bg-violet-500/20",
      text: "text-violet-300",
      badge: "border-violet-400/30 bg-violet-400/10 text-violet-300",
      hoverBorder: "hover:border-violet-400/50",
    },
  },
  {
    key: "openclaw",
    matchPatterns: ["openclaw", "open claw", "claw"],
    icon: Bot,
    level: "Công cụ thực chiến",
    name: "Lớp học OpenClaw",
    description:
      "Dành cho người muốn sử dụng OpenClaw như một hệ trợ lý AI thực chiến cho công việc, tiếp thị, khách hàng và đời sống cá nhân.",
    audience: [
      "Người muốn thực hành một hệ trợ lý AI cụ thể thay vì học lý thuyết.",
      "Người cần AI xử lý việc thật hằng ngày: lịch, thư, tài liệu, nội dung, khách hàng.",
    ],
    topics: [
      {
        title: "Chủ đề 1 — Trợ lý kinh doanh cá nhân",
        items: [
          "Tích hợp với hệ sinh thái Google và giải quyết các công việc hàng ngày.",
          "Quản lý lịch: lên lịch, dời lịch, chỉnh sửa và hủy bỏ các cuộc hẹn.",
          "Đọc và trả lời thư.",
          "Tạo, chỉnh sửa và gửi tài liệu, bảng tính, thuyết trình trong các dịch vụ của Google.",
          "Phân tích tài liệu: báo cáo, tóm tắt ngắn gọn và kiểm tra thay đổi.",
          "Tổng hợp bản tin hàng ngày/hàng tuần và phát hiện xu hướng theo chủ đề.",
        ],
      },
      {
        title: "Chủ đề 2 — Tiếp thị, nội dung và quản lý khách hàng",
        items: [
          "Phân tích đối thủ cạnh tranh, đối tượng mục tiêu, xu hướng.",
          "Tạo chiến lược tiếp thị để quảng bá.",
          "Tạo nội dung cho mọi định dạng.",
          "Đăng bài viết trên mạng xã hội.",
          "Tạo bot làm việc với khách hàng trong mọi lĩnh vực thay bạn: logic, nút bấm, cơ sở tri thức để quản lý bot.",
        ],
      },
      {
        title: "Chủ đề 3 — Trợ lý cá nhân 3 trong 1",
        items: [
          "Tư vấn sức khỏe và thể dục: theo dõi hoạt động, thực đơn, chương trình tập, calo, hồ sơ y tế.",
          "Hướng dẫn viên và đại lý du lịch: lộ trình, ngân sách, điều kiện nhập cảnh, khách sạn và vé.",
          "Tư vấn tài chính: phân tích thu chi, tiết kiệm, kiến thức tài chính và lời khuyên về đầu tư.",
        ],
      },
    ],
    outcome:
      "Ứng dụng OpenClaw vào công việc cá nhân, tiếp thị, chăm sóc khách hàng và các tình huống đời sống thực tế.",
    lessonCount: 6,
    listPrice: 599_999,
    ctaLabel: "Đăng ký OpenClaw",
    accent: {
      gradient: "from-cyan-400 to-emerald-500",
      glow: "bg-cyan-500/20",
      text: "text-cyan-300",
      badge: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
      hoverBorder: "hover:border-cyan-400/50",
    },
  },
  {
    key: "v-solo",
    matchPatterns: ["solo"],
    icon: User,
    level: "Hệ thống cá nhân",
    name: "V-Solo",
    headline: "Xây hệ thống Affiliate một người bằng AI",
    description:
      "Dành cho cá nhân muốn ứng dụng AI để vận hành toàn bộ hệ thống Affiliate — từ nghiên cứu đến chuyển đổi — một cách tinh gọn.",
    audience: [
      "Người mới bắt đầu hoặc đang làm một mình.",
      "Creator, KOC muốn xây thương hiệu cá nhân.",
    ],
    problems: [
      "Không biết bắt đầu từ đâu, làm rời rạc, thiếu hệ thống.",
      "Tốn quá nhiều thời gian cho công việc lặp lại.",
    ],
    topics: [
      {
        items: [
          "Hệ thống Affiliate cá nhân hoàn chỉnh, vận hành được hàng ngày.",
          "Bộ trợ lý AI cá nhân hỗ trợ từ nội dung đến chăm sóc khách hàng.",
        ],
      },
    ],
    outcome:
      "Hệ thống Affiliate cá nhân hoàn chỉnh có thể vận hành hàng ngày, cùng bộ trợ lý AI hỗ trợ từ nội dung đến chăm sóc khách hàng.",
    lessonCount: 6,
    listPrice: 7_800_000,
    ctaLabel: "Đăng ký V-Solo",
    accent: {
      gradient: "from-orange-500 to-amber-500",
      glow: "bg-orange-500/20",
      text: "text-amber-300",
      badge: "border-amber-400/30 bg-amber-400/10 text-amber-300",
      hoverBorder: "hover:border-amber-400/50",
    },
  },
  {
    key: "v-scale",
    matchPatterns: ["scale"],
    icon: Network,
    level: "Hệ thống đội nhóm",
    name: "V-Scale",
    headline: "Nhân bản hệ thống và phát triển đội nhóm Affiliate bằng AI",
    description:
      "Dành cho leader đã có hệ thống hoạt động, muốn chuẩn hóa và nhân bản cho đội nhóm cộng tác viên.",
    audience: [
      "Leader đang có cộng tác viên hoặc đội nhóm.",
      "Người đã có kết quả ổn định, muốn mở rộng quy mô.",
    ],
    problems: [
      "Phải hướng dẫn lặp lại, đội nhóm không đồng đều.",
      "Đội nhóm phụ thuộc hoàn toàn vào một người lãnh đạo.",
    ],
    topics: [
      {
        items: [
          "Học viện nội bộ, thư viện nội dung và prompt dùng chung.",
          "Hệ thống KPI, dashboard đội nhóm và lộ trình leader kế thừa.",
        ],
      },
    ],
    outcome:
      "Học viện nội bộ, thư viện nội dung và prompt dùng chung; hệ thống KPI, dashboard đội nhóm và lộ trình leader kế thừa.",
    lessonCount: 6,
    listPrice: 26_000_000,
    ctaLabel: "Đăng ký V-Scale",
    accent: {
      gradient: "from-violet-600 via-fuchsia-500 to-amber-400",
      glow: "bg-fuchsia-500/20",
      text: "text-fuchsia-300",
      badge: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300",
      hoverBorder: "hover:border-fuchsia-400/50",
    },
  },
];

export function formatVnd(price: number): string {
  return `${price.toLocaleString("vi-VN")}đ`;
}
