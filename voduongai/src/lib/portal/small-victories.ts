/**
 * Small Victory Engine (Sprint 7.5 — Nhiệm vụ 02). Portal cần nhìn thấy
 * những chiến thắng rất nhỏ — không bằng pháo hoa hay huy hiệu, mà bằng
 * một câu chân thành, đúng lúc. Mỗi dòng phải đứng được một mình.
 */

export type SmallVictoryTrigger =
  | "comebackAfterWeeks"
  | "firstReflection"
  | "firstPromptSaved"
  | "helpedSomeoneElse"
  | "didNotGiveUp";

export const smallVictoryLines: Record<SmallVictoryTrigger, string[]> = {
  comebackAfterWeeks: [
    "Bạn đã quay lại sau một thời gian dài. Mình nhận thấy điều đó, và nó có ý nghĩa hơn bạn nghĩ.",
    "Có những hành trình bị gián đoạn rồi không bao giờ tiếp tục. Hành trình của bạn không phải một trong số đó.",
  ],
  firstReflection: [
    "Đây là lần đầu bạn viết một Reflection. Dám chia sẻ điều thật với chính mình không phải ai cũng làm được.",
    "Mình nhận thấy bạn vừa mở lòng viết ra điều mình nghĩ, lần đầu tiên. Cảm ơn bạn vì đã tin tưởng.",
  ],
  firstPromptSaved: [
    "Bạn vừa lưu lại Prompt đầu tiên của mình. Một bước nhỏ, nhưng là bước đầu tiên trong việc chủ động dùng AI cho riêng mình.",
    "Đây là Prompt đầu tiên bạn giữ lại. Mình nghĩ điều này đáng được ghi nhận, dù chỉ là một dòng nhỏ.",
  ],
  helpedSomeoneElse: [
    "Hôm nay bạn đã giúp một người khác trong cộng đồng. Điều đó không hề nhỏ.",
    "Bạn vừa dành một phần thời gian của mình cho người khác. Mình nhận thấy điều đó.",
  ],
  didNotGiveUp: [
    "Hôm nay bạn không bỏ cuộc. Đôi khi, chỉ vậy thôi cũng đã là một chiến thắng thật sự.",
    "Có những ngày chiến thắng lớn nhất chỉ đơn giản là không dừng lại. Hôm nay là một ngày như thế của bạn.",
  ],
};

function pick<T>(items: T[], seed?: number): T {
  const index = seed === undefined ? Math.floor(Math.random() * items.length) : seed % items.length;
  return items[index];
}

export function getSmallVictoryLine(trigger: SmallVictoryTrigger, seed?: number): string {
  return pick(smallVictoryLines[trigger], seed);
}
