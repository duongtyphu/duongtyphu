export type WelcomeState = "first" | "recent" | "comeback" | "returning";

export type WarmthCategory =
  | "goodMorning"
  | "goodEvening"
  | "completed"
  | "paused"
  | "comeBack"
  | "reflection"
  | "encouragement"
  | "journey"
  | "nextStep"
  | "celebration"
  | "legacy";

/**
 * Warmth Engine copy library — every line speaks like a calm, mature
 * companion, not a notification system. Sourced from the Portal Experience
 * Guidelines (docs/PORTAL_EXPERIENCE_GUIDELINES.md). Add lines here, not
 * inline in components, so tone stays consistent and easy to vary.
 */
export const welcomeCopy: Record<WelcomeState, string[]> = {
  first: [
    "Chào mừng bạn đến với VO DUONG AI.\nMỗi hành trình đều bắt đầu từ một bước đầu tiên.",
    "Rất vui được gặp bạn ở đây.\nHãy bắt đầu từ một bước nhỏ, mọi thứ khác sẽ đến đúng lúc của nó.",
  ],
  recent: [
    "Rất vui vì bạn đã quay lại.\nHôm nay chúng ta tiếp tục nhé.",
    "Bạn đang giữ một nhịp độ tốt.\nHãy tiếp tục cùng nhau nhé.",
  ],
  comeback: [
    "Chào mừng bạn trở về.\nKhông sao nếu bạn phải nghỉ một thời gian.\nHành trình vẫn luôn ở đây.",
    "Dù bao lâu bạn vắng mặt, nơi này vẫn chờ bạn.\nChúng ta tiếp tục từ nơi bạn dừng lại nhé.",
  ],
  returning: [
    "Rất vui được gặp lại bạn.\nChúng ta tiếp tục từ nơi đã dừng lại nhé.",
    "Hôm nay là một ngày nữa để viên ngọc của bạn sáng hơn.",
  ],
};

export const warmthLibrary: Record<WarmthCategory, string[]> = {
  goodMorning: [
    "Buổi sáng tốt lành.\nMột ngày mới, một cơ hội mới để tiến thêm một bước.",
    "Chào buổi sáng.\nHãy bắt đầu nhẹ nhàng, không cần vội.",
  ],
  goodEvening: [
    "Chào buổi tối.\nDù hôm nay thế nào, bạn vẫn đang đi đúng hướng.",
    "Một ngày sắp qua.\nCảm ơn bạn vì đã dành thời gian cho hành trình của mình.",
  ],
  completed: [
    "Hôm nay bạn đã tiến thêm một bước.",
    "Một phần nữa đã hoàn thành.\nGiá trị bạn tạo ra đang lớn dần.",
  ],
  paused: [
    "Không sao nếu hôm nay bạn cần dừng lại.\nKhi sẵn sàng, mình vẫn ở đây.",
    "Nghỉ ngơi cũng là một phần của hành trình.",
  ],
  comeBack: [
    "Khi bạn sẵn sàng,\nmình sẽ luôn đồng hành.",
    "Hành trình của bạn vẫn đang chờ, không có gì vội cả.",
  ],
  reflection: [
    "Hôm nay bạn học được điều gì?",
    "Bạn đã áp dụng được điều gì?",
    "Điều gì khiến bạn tự hào nhất trong tuần này?",
    "Bạn muốn trở thành người như thế nào sau 1 năm?",
  ],
  encouragement: [
    "Bạn đã đi được một đoạn đường.\nChúng ta cùng hoàn thành phần còn lại nhé.",
    "Có lẽ chúng ta có thể thử một cách khác.",
    "Mỗi bước nhỏ hôm nay đang âm thầm định hình con đường của bạn.",
  ],
  journey: [
    "Hành trình không cần phải nhanh, chỉ cần liên tục.",
    "Bạn không cần đi một mình — chúng ta đi cùng nhau.",
  ],
  nextStep: [
    "Khi bạn sẵn sàng, đây là một bước nhỏ tiếp theo.",
    "Không cần làm tất cả ngay hôm nay, chỉ cần một điều nhỏ thôi.",
  ],
  celebration: [
    "Chúc mừng bạn.\nKhông phải vì bạn đã hoàn thành.\nMà vì bạn đã giữ lời hứa với chính mình.",
    "Đây là một cột mốc đáng được ghi nhận, một cách chân thành.",
  ],
  legacy: [
    "Một ý tưởng hôm nay có thể trở thành giá trị ngày mai.",
    "Mỗi quy trình bạn xây hôm nay đều giúp tương lai của bạn nhẹ nhàng hơn.",
    "Bước nhỏ hôm nay là nền móng cho phiên bản tốt hơn của bạn ngày mai.",
  ],
};

function pick<T>(items: T[], seed?: number): T {
  const index = seed === undefined ? Math.floor(Math.random() * items.length) : seed % items.length;
  return items[index];
}

export function getWelcomeState({
  createdAt,
  lastSignInAt,
}: {
  createdAt?: Date;
  lastSignInAt?: Date;
}): WelcomeState {
  if (!createdAt) return "returning";

  const daysSinceCreated = (Date.now() - createdAt.getTime()) / 86_400_000;
  if (daysSinceCreated < 1) return "first";

  if (lastSignInAt) {
    const daysSinceVisit = (Date.now() - lastSignInAt.getTime()) / 86_400_000;
    if (daysSinceVisit > 5) return "comeback";
  }

  if (daysSinceCreated < 3) return "recent";
  return "returning";
}

export function getWelcomeMessage(state: WelcomeState): string {
  return pick(welcomeCopy[state]);
}

export function getWarmthLine(category: WarmthCategory, seed?: number): string {
  return pick(warmthLibrary[category], seed);
}
