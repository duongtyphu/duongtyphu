/**
 * Human Insight Model (Sprint 7.2) — rule-based, no real AI yet.
 * Tags a Reflection answer with soft, hedged metadata so Portal can talk
 * about meaning instead of quoting text back verbatim. Keyword matching is
 * a placeholder — swapping in a real classifier later changes only the
 * body of `inferInsight`, not its callers.
 */

export type EmotionTag = "Tự tin" | "Lo lắng" | "Hào hứng" | "Biết ơn" | "Chán nản" | "Kiên trì";
export type ThemeTag =
  | "AI"
  | "Affiliate"
  | "Automation"
  | "Thương hiệu cá nhân"
  | "Kỷ luật"
  | "Học tập"
  | "Kinh doanh"
  | "Gia đình"
  | "Sức khỏe"
  | "Lãnh đạo";
export type GrowthStageTag = "Learn" | "Apply" | "Build" | "Share" | "Mentor";
export type ChallengeTag = "Thiếu thời gian" | "Thiếu tự tin" | "Thiếu kiến thức" | "Thiếu hệ thống" | "Thiếu động lực";
export type ValueTag = "Kiên trì" | "Trung thực" | "Chia sẻ" | "Học hỏi" | "Kiến tạo" | "Phụng sự";

export type ReflectionInsight = {
  emotion?: EmotionTag;
  theme?: ThemeTag;
  growthStage?: GrowthStageTag;
  challenge?: ChallengeTag;
  value?: ValueTag;
};

const EMOTION_KEYWORDS: Record<EmotionTag, string[]> = {
  "Tự tin": ["tự tin", "vững tin", "chắc chắn hơn"],
  "Lo lắng": ["lo lắng", "lo âu", "hoang mang", "sợ"],
  "Hào hứng": ["hào hứng", "phấn khích", "rất vui"],
  "Biết ơn": ["biết ơn", "cảm ơn", "trân trọng"],
  "Chán nản": ["chán nản", "mệt mỏi", "nản lòng", "muốn bỏ cuộc"],
  "Kiên trì": ["kiên trì", "không bỏ cuộc", "cố gắng mỗi ngày"],
};

const THEME_KEYWORDS: Record<ThemeTag, string[]> = {
  AI: ["ai", "trí tuệ nhân tạo", "chatgpt", "prompt"],
  Affiliate: ["affiliate", "hoa hồng", "tiếp thị liên kết"],
  Automation: ["automation", "tự động hóa", "workflow"],
  "Thương hiệu cá nhân": ["thương hiệu cá nhân", "personal brand", "xây dựng thương hiệu"],
  "Kỷ luật": ["kỷ luật", "duy trì thói quen", "thói quen"],
  "Học tập": ["học tập", "học hỏi", "khóa học"],
  "Kinh doanh": ["kinh doanh", "bán hàng", "khách hàng"],
  "Gia đình": ["gia đình", "con cái", "vợ", "chồng"],
  "Sức khỏe": ["sức khỏe", "tập thể dục", "giấc ngủ"],
  "Lãnh đạo": ["lãnh đạo", "quản lý team", "dẫn dắt"],
};

const GROWTH_STAGE_KEYWORDS: Record<GrowthStageTag, string[]> = {
  Learn: ["mới học", "đang tìm hiểu", "bắt đầu học", "chưa biết gì"],
  Apply: ["áp dụng", "thực hành", "thử nghiệm"],
  Build: ["xây dựng", "đang xây", "kiến tạo"],
  Share: ["chia sẻ", "đăng bài", "lan tỏa"],
  Mentor: ["hướng dẫn người khác", "mentor", "dẫn dắt người khác"],
};

const CHALLENGE_KEYWORDS: Record<ChallengeTag, string[]> = {
  "Thiếu thời gian": ["thiếu thời gian", "không có thời gian", "bận quá"],
  "Thiếu tự tin": ["chưa tự tin", "thiếu tự tin", "không tự tin", "sợ sai"],
  "Thiếu kiến thức": ["thiếu kiến thức", "chưa biết", "không biết bắt đầu từ đâu"],
  "Thiếu hệ thống": ["thiếu hệ thống", "chưa có quy trình", "lộn xộn"],
  "Thiếu động lực": ["thiếu động lực", "mất động lực", "không còn hứng"],
};

const VALUE_KEYWORDS: Record<ValueTag, string[]> = {
  "Kiên trì": ["kiên trì", "không bỏ cuộc", "cố gắng mỗi ngày"],
  "Trung thực": ["trung thực", "thành thật với bản thân"],
  "Chia sẻ": ["chia sẻ", "giúp đỡ người khác"],
  "Học hỏi": ["học hỏi", "tìm hiểu thêm"],
  "Kiến tạo": ["xây dựng", "tạo ra", "kiến tạo"],
  "Phụng sự": ["phụng sự", "đóng góp", "giúp đỡ cộng đồng"],
};

function firstMatch<T extends string>(text: string, keywords: Record<T, string[]>): T | undefined {
  for (const tag of Object.keys(keywords) as T[]) {
    if (keywords[tag].some((kw) => text.includes(kw))) return tag;
  }
  return undefined;
}

export function inferInsight(answer: string): ReflectionInsight {
  const text = answer.toLowerCase();
  return {
    emotion: firstMatch(text, EMOTION_KEYWORDS),
    theme: firstMatch(text, THEME_KEYWORDS),
    growthStage: firstMatch(text, GROWTH_STAGE_KEYWORDS),
    challenge: firstMatch(text, CHALLENGE_KEYWORDS),
    value: firstMatch(text, VALUE_KEYWORDS),
  };
}
