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
        { label: "Xem công cụ AI", href: "/portal/tools" },
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
    { label: "Hệ tri thức AI", href: "/portal/hetrithucai" },
    { label: "Học viện AI", href: "/portal/hocvienai" },
    KHONG_GIAN_AI,
  ],
};

/** Route nào có nudge chủ động theo ngữ cảnh (8 khu vực theo Product Decision). */
export function getRouteContext(pathname: string): RouteContext {
  const match = ROUTE_CONTEXTS.find((entry) => pathname.startsWith(entry.prefix));
  return match?.context ?? DEFAULT_CONTEXT;
}

/** Chỉ những route có nudge chủ động mới hiện Contextual Nudge (route mặc định thì im lặng, chỉ có panel khi bấm). */
export function hasContextualNudge(pathname: string): boolean {
  return ROUTE_CONTEXTS.some((entry) => pathname.startsWith(entry.prefix));
}
