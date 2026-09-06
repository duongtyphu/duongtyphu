/**
 * Companion Presence — Contextual Nudge & Quick Actions (Sprint "Companion
 * Presence Fix"). Rule-based, không AI thật: mỗi khu vực Portal có đúng một
 * câu nudge ngắn + tối đa 3 gợi ý hành động, dùng để Companion "nói đúng lúc"
 * thay vì đứng yên hoặc nói liên tục.
 */

export type QuickAction = { label: string; href: string };

export type RouteContext = {
  /** Khoá ổn định dùng để nhớ "đã hiện nudge" theo từng khu vực trong session. */
  key: string;
  /** Câu nudge ngắn, chủ động, đúng ngữ cảnh khu vực. */
  nudge: string;
  /** Tối đa 3 gợi ý hành động cho panel khi người dùng bấm vào Companion. */
  quickActions: QuickAction[];
};

const KHONG_GIAN_AI: QuickAction = { label: "Mở AI Workspace", href: "/portal/aiworkspace" };

/**
 * Portal 2.0, Giai đoạn 9 — Companion nổi (Widget). Thêm entry cho các route
 * `/v2/*` tương ứng, KHÔNG sửa/xoá entry `/portal/*` nào ở trên (giữ đúng
 * hành vi 1.0 nguyên vẹn — file này dùng chung cho cả `CompanionPresence`
 * 1.0 lẫn `CompanionWidget` 2.0). Route `/v2/*` không bao giờ trùng prefix
 * với `/portal/*` nên không có rủi ro thứ tự khớp nhầm giữa 2 nhóm.
 */
const KHONG_GIAN_AI_V2: QuickAction = { label: "Mở AI Workspace", href: "/v2/hoc-vien-ai" };

const ROUTE_CONTEXTS_V2: { prefix: string; context: RouteContext }[] = [
  {
    prefix: "/v2/he-tri-thuc",
    context: {
      key: "v2-ckos-library",
      nudge: "Mình có thể giúp bạn biến tri thức này thành một hành động nhỏ.",
      quickActions: [
        { label: "Tiếp tục học", href: "/v2/he-tri-thuc" },
        { label: "Học viện AI", href: "/v2/hoc-vien-ai" },
        KHONG_GIAN_AI_V2,
      ],
    },
  },
  {
    prefix: "/v2/hoc-vien-ai",
    context: {
      key: "v2-academy",
      nudge: "Mình sẽ đi cùng bạn trong từng bài học và công cụ AI.",
      quickActions: [
        { label: "Học theo lộ trình", href: "/v2/hoc-vien-ai" },
        { label: "Hệ tri thức AI (CKOS)", href: "/v2/he-tri-thuc" },
        { label: "Mục tiêu của tôi", href: "/v2/muc-tieu" },
      ],
    },
  },
  {
    prefix: "/v2/moi-ngay-mot-y-tuong",
    context: {
      key: "v2-daily-idea",
      nudge: "Mỗi ngày một ý tưởng AI mới — mình luôn ở đây nếu bạn cần đào sâu thêm.",
      quickActions: [
        { label: "Xem ý tưởng hôm nay", href: "/v2/moi-ngay-mot-y-tuong" },
        { label: "Kho ý tưởng", href: "/v2/moi-ngay-mot-y-tuong/kho-y-tuong" },
        KHONG_GIAN_AI_V2,
      ],
    },
  },
  {
    prefix: "/v2/du-an-co-hoi",
    context: {
      key: "v2-opportunities",
      nudge: "Mình sẽ giúp bạn nhìn cơ hội từ nhiều góc độ trước khi hành động.",
      quickActions: [
        { label: "Khám phá cơ hội", href: "/v2/du-an-co-hoi" },
        { label: "Chương trình Affiliate", href: "/v2/affiliate" },
        KHONG_GIAN_AI_V2,
      ],
    },
  },
  {
    prefix: "/v2/premium",
    context: {
      key: "v2-premium",
      nudge: "Khi bạn muốn đi sâu hơn, mình sẽ đồng hành kỹ hơn.",
      quickActions: [
        { label: "Xem quyền lợi Premium", href: "/v2/premium" },
        { label: "Chương trình Affiliate", href: "/v2/affiliate" },
      ],
    },
  },
  {
    prefix: "/v2/affiliate",
    context: {
      key: "v2-affiliate",
      nudge: "Mình có thể giúp bạn hiểu rõ 3 tầng hoa hồng và cách bắt đầu giới thiệu.",
      quickActions: [
        { label: "Xem link giới thiệu của bạn", href: "/v2/affiliate" },
        { label: "Bộ tài nguyên Marketing", href: "/v2/affiliate#tai-nguyen" },
      ],
    },
  },
  {
    prefix: "/v2/hanh-trinh-cua-toi",
    context: {
      key: "v2-my-journey",
      nudge: "Mình sẽ giúp bạn nhìn lại mình đã thay đổi như thế nào.",
      quickActions: [
        { label: "Xem tiến trình", href: "/v2/hanh-trinh-cua-toi" },
        { label: "Mục tiêu của tôi", href: "/v2/muc-tieu" },
      ],
    },
  },
  {
    prefix: "/v2/muc-tieu",
    context: {
      key: "v2-goals",
      nudge: "Đặt đúng mục tiêu là bước đầu tiên — mình có thể giúp bạn làm rõ nó.",
      quickActions: [
        { label: "Xem mục tiêu của tôi", href: "/v2/muc-tieu" },
        { label: "Hành trình của tôi", href: "/v2/hanh-trinh-cua-toi" },
      ],
    },
  },
  {
    prefix: "/v2/su-menh-companion",
    context: {
      key: "v2-companion-mission",
      nudge: "Đây là nơi bạn có thể hiểu rõ hơn về hành trình cùng nhau.",
      quickActions: [
        { label: "Trò chuyện cùng Companion", href: "/v2/companion" },
        { label: "Hành trình của tôi", href: "/v2/hanh-trinh-cua-toi" },
      ],
    },
  },
];

/**
 * Khớp theo prefix, ưu tiên entry dài hơn trước để tránh nhầm route con.
 */
const ROUTE_CONTEXTS: { prefix: string; context: RouteContext }[] = [
  {
    prefix: "/portal/aiworkspace",
    context: {
      key: "khong-gian-ai",
      nudge: "Mình ở đây để cùng bạn thử ý tưởng với AI.",
      quickActions: [
        { label: "Thử một ý tưởng mới", href: "/portal/aiworkspace" },
        { label: "Xem công cụ AI", href: "/portal/aiworkspace#ai-toolbox" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/hetrithucai",
    context: {
      key: "ckos-library",
      nudge: "Mình có thể giúp bạn biến tri thức này thành một hành động nhỏ.",
      quickActions: [
        { label: "Tiếp tục học", href: "/portal/hetrithucai" },
        { label: "Chọn hạt giống tri thức", href: "/portal/hetrithucai" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/hocvienai",
    context: {
      key: "academy",
      nudge: "Mình sẽ đi cùng bạn trong từng Mission.",
      quickActions: [
        { label: "Bắt đầu trải nghiệm", href: "/portal/hocvienai" },
        { label: "Xem nhiệm vụ hôm nay", href: "/portal/roadmap" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/duan-cohoi",
    context: {
      key: "opportunities",
      nudge: "Mình sẽ giúp bạn nhìn cơ hội từ nhiều góc độ trước khi hành động.",
      quickActions: [
        { label: "Khám phá cơ hội", href: "/portal/duan-cohoi" },
        { label: "Xem cách áp dụng", href: "/portal/duan-cohoi" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/premium",
    context: {
      key: "premium",
      nudge: "Khi bạn muốn đi sâu hơn, mình sẽ đồng hành kỹ hơn.",
      quickActions: [
        { label: "Xem quyền lợi Premium", href: "/portal/premium" },
        { label: "Khám phá nội dung Premium", href: "/portal/premium" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/nhatkyhoctap",
    context: {
      key: "learning-journal",
      nudge: "Mình có thể giúp bạn rút ra bài học từ điều vừa trải nghiệm.",
      quickActions: [
        { label: "Viết Reflection", href: "/portal/story" },
        { label: "Xem điều đã học", href: "/portal/nhatkyhoctap" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/hanhtrinhcuatoi",
    context: {
      key: "my-journey",
      nudge: "Mình sẽ giúp bạn nhìn lại mình đã thay đổi như thế nào.",
      quickActions: [
        { label: "Xem tiến trình", href: "/portal/hanhtrinhcuatoi" },
        { label: "Nhìn lại tuần này", href: "/portal/hanhtrinhcuatoi" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/khuvuoncuaban",
    context: {
      key: "living-garden",
      nudge: "Mỗi bước bạn hoàn thành sẽ làm khu vườn này lớn lên.",
      quickActions: [
        { label: "Xem cây đang lớn", href: "/portal/khuvuoncuaban" },
        { label: "Xem bước tiếp theo", href: "/portal/roadmap" },
        KHONG_GIAN_AI,
      ],
    },
  },
  {
    prefix: "/portal/companion",
    context: {
      key: "companion",
      nudge: "Đây là nơi bạn có thể hiểu rõ hơn về hành trình cùng nhau.",
      quickActions: [
        { label: "Xem lại hành trình", href: "/portal/hanhtrinhcuatoi" },
        { label: "Khu vườn của bạn", href: "/portal/khuvuoncuaban" },
        KHONG_GIAN_AI,
      ],
    },
  },
];

/** Gợi ý mặc định cho các route Portal chưa có nudge riêng — panel vẫn hữu ích, chỉ không có nudge chủ động. */
const DEFAULT_CONTEXT: RouteContext = {
  key: "portal-default",
  nudge: "Mình luôn ở đây nếu bạn cần một người đồng hành.",
  quickActions: [
    { label: "Hệ tri thức AI (CKOS)", href: "/portal/hetrithucai" },
    { label: "Học viện AI", href: "/portal/hocvienai" },
    KHONG_GIAN_AI,
  ],
};

/** Cùng vai trò `DEFAULT_CONTEXT` nhưng cho route `/v2/*` không khớp entry
    riêng nào — mọi `href` trỏ đúng `/v2/*`, không rơi về 1.0. */
const DEFAULT_CONTEXT_V2: RouteContext = {
  key: "v2-portal-default",
  nudge: "Mình luôn ở đây nếu bạn cần một người đồng hành.",
  quickActions: [
    { label: "Hệ tri thức AI (CKOS)", href: "/v2/he-tri-thuc" },
    { label: "Học viện AI", href: "/v2/hoc-vien-ai" },
    KHONG_GIAN_AI_V2,
  ],
};

/** Route nào có nudge chủ động theo ngữ cảnh (8 khu vực theo Product Decision). */
export function getRouteContext(pathname: string): RouteContext {
  if (pathname.startsWith("/v2/")) {
    const matchV2 = ROUTE_CONTEXTS_V2.find((entry) => pathname.startsWith(entry.prefix));
    return matchV2?.context ?? DEFAULT_CONTEXT_V2;
  }
  const match = ROUTE_CONTEXTS.find((entry) => pathname.startsWith(entry.prefix));
  return match?.context ?? DEFAULT_CONTEXT;
}

/** Chỉ những route có nudge chủ động mới hiện Contextual Nudge (route mặc định thì im lặng, chỉ có panel khi bấm). */
export function hasContextualNudge(pathname: string): boolean {
  if (pathname.startsWith("/v2/")) {
    return ROUTE_CONTEXTS_V2.some((entry) => pathname.startsWith(entry.prefix));
  }
  return ROUTE_CONTEXTS.some((entry) => pathname.startsWith(entry.prefix));
}
