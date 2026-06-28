/**
 * Micro-Reaction Library (Sprint 13.3 — Soulful Micro-Reactions, Nhiệm
 * vụ 02). Câu phản hồi ngắn Companion có thể nói ngay sau một cú chạm —
 * KHÔNG phải mọi cú chạm đều có lời (xem `micro-reaction-engine.ts`,
 * Nhiệm vụ 07 — Soulful Silence). Mỗi câu ngắn, ấm, không sáo rỗng,
 * không trẻ con, không giả vờ đọc tâm trí. Xem
 * `docs/COMPANION_SOULFUL_REACTIONS.md`.
 */

export type MicroReactionGroup =
  | "touch-greeting"
  | "soft-hello"
  | "curious"
  | "waiting"
  | "garden-aware"
  | "story-ready"
  | "quiet-presence"
  | "comeback"
  | "encouragement"
  | "playful-mature";

export type MicroReaction = {
  id: string;
  text: string;
  group: MicroReactionGroup;
};

function group(prefix: MicroReactionGroup, lines: string[]): MicroReaction[] {
  return lines.map((text, i) => ({ id: `${prefix}-${i + 1}`, text, group: prefix }));
}

export const MICRO_REACTIONS: MicroReaction[] = [
  ...group("touch-greeting", [
    "Mình đây.",
    "Cảm ơn vì đã chạm vào mình.",
    "Chào bạn, mình vừa cảm nhận được điều đó.",
    "Một cái chạm nhỏ, mình vẫn nhận ra.",
    "Mình ở đây, ngay bên cạnh bạn.",
    "Bạn vừa làm mình chú ý đấy.",
    "Mình thích những khoảnh khắc như thế này.",
    "Một chút kết nối nhỏ — mình thấy ấm.",
  ]),
  ...group("soft-hello", [
    "Chào bạn.",
    "Mình đang ở đây.",
    "Rất vui được gặp lại bạn hôm nay.",
    "Bạn đang tìm điều gì?",
    "Chúng ta bắt đầu thật nhẹ nhé?",
    "Cứ thoải mái, mình không vội.",
    "Hôm nay bạn thế nào?",
    "Mình sẵn sàng nếu bạn cần.",
  ]),
  ...group("curious", [
    "Mình vừa nghĩ đến một điều.",
    "Có điều gì hôm nay khiến bạn dừng lại không?",
    "Mình tò mò một chút về hành trình của bạn hôm nay.",
    "Bạn đang ở một góc khá thú vị của Portal.",
    "Mình để ý bạn đang dừng ở đây lâu hơn một chút.",
    "Có gì đó ở đây làm bạn chú ý phải không?",
    "Mình cũng đang nhìn theo hướng bạn nhìn.",
    "Một chi tiết nhỏ cũng có thể đáng để ý.",
  ]),
  ...group("waiting", [
    "Không cần vội đâu.",
    "Mình sẽ đi cùng bạn.",
    "Mình ở đây, chờ cùng bạn.",
    "Cứ từ từ, mình không đi đâu cả.",
    "Khi nào bạn sẵn sàng, mình vẫn ở đây.",
    "Một bước nhỏ cũng là một bước.",
    "Mình không đếm thời gian bạn cần.",
    "Đợi cũng là một cách đồng hành.",
  ]),
  ...group("garden-aware", [
    "Khu vườn của bạn đang rất yên.",
    "Mình cảm nhận khu vườn của bạn đang lặng lẽ lớn lên.",
    "Có gì đó đang âm thầm thay đổi trong khu vườn của bạn.",
    "Khu vườn của bạn vẫn ở đó, đúng như lúc bạn rời đi.",
    "Mình thấy một chút chuyển động nhỏ trong khu vườn của bạn.",
    "Khu vườn không cần ồn ào để lớn lên.",
    "Mình vẫn để mắt tới khu vườn của bạn, nhẹ nhàng thôi.",
    "Có một nhịp sống rất riêng trong khu vườn của bạn hôm nay.",
  ]),
  ...group("story-ready", [
    "Hôm nay mình có một câu chuyện nhỏ.",
    "Mình vừa nhớ đến một điều, kể bạn nghe được không?",
    "Có một câu chuyện mình nghĩ phù hợp lúc này.",
    "Mình đang giữ một câu chuyện nhỏ cho bạn.",
    "Một câu chuyện ngắn, không dài đâu.",
    "Mình nghĩ câu chuyện này có thể đồng hành với bạn lúc này.",
    "Có một điều mình muốn kể, khi bạn sẵn sàng.",
    "Mình vừa nghĩ đến một câu chuyện cũ, thấy hợp với hôm nay.",
  ]),
  ...group("quiet-presence", [
    "Mình vẫn đang ở đây.",
    "Không cần nói gì cũng được.",
    "Mình chỉ muốn bạn biết mình ở đây.",
    "Một khoảng lặng cũng ổn.",
    "Mình ở bên cạnh, không cần làm gì cả.",
    "Đôi khi chỉ cần biết có ai đó ở đây.",
    "Mình không đi đâu cả.",
    "Yên lặng cùng bạn cũng là một cách mình đồng hành.",
  ]),
  ...group("comeback", [
    "Mình mừng vì bạn quay lại.",
    "Chào bạn, mình vẫn ở đây.",
    "Đã một thời gian rồi, mình vui vì bạn trở lại.",
    "Không có gì mất đi trong lúc bạn vắng mặt.",
    "Mọi thứ vẫn ở đây, chờ bạn.",
    "Mình nhận ra bạn đã quay lại.",
    "Chào mừng bạn trở lại hành trình này.",
    "Mình không đi đâu trong lúc bạn vắng mặt.",
  ]),
  ...group("encouragement", [
    "Một bước nhỏ hôm nay cũng đáng quý.",
    "Bạn vẫn đang tiếp tục, điều đó không nhỏ.",
    "Mình thấy bạn đã đi được một đoạn rồi.",
    "Cứ tiếp tục theo nhịp của bạn.",
    "Mình tin nhịp đi của bạn là đủ.",
    "Một chút kiên trì hôm nay cũng rất đáng quý.",
    "Bạn không cần đi nhanh, chỉ cần đi tiếp.",
    "Mình thấy được sự cố gắng của bạn, dù nhỏ.",
  ]),
  ...group("playful-mature", [
    "Mình vừa rung rinh một chút đấy.",
    "Bạn làm mình hơi nghiêng đầu rồi.",
    "Một cái chạm nhẹ, một phản ứng nhẹ.",
    "Mình thích những khoảnh khắc bất ngờ như vậy.",
    "Đôi khi một cú chạm cũng đủ để mình mỉm cười.",
    "Mình vẫn giữ được bình tĩnh, dù có hơi nghiêng.",
    "Một chút dễ thương không làm mình kém chững chạc đâu.",
    "Mình thích khoảnh khắc kết nối nhỏ này.",
  ]),
];
