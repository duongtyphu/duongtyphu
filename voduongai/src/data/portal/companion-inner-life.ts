/**
 * Portal 4.0 Companion Experience V2 — Companion's inner life.
 *
 * Khác với THOUGHT_SEEDS (thought-seeds.ts — những câu chiêm nghiệm ở
 * ngôi thứ ba, giống trích dẫn), hai danh sách dưới đây là suy nghĩ của
 * CHÍNH Companion, ngôi thứ nhất, không trích dẫn ai cả:
 *
 * - COMPANION_TODAY_THOUGHTS: một suy nghĩ nhỏ, trọn vẹn, cho "hôm nay".
 * - COMPANION_MUSINGS: những suy nghĩ chưa xong, không chắc chắn — được
 *   phép bỏ lửng, được phép không có kết luận. Đây là điều khác biệt
 *   nhất: một AI thường luôn chắc chắn và hoàn chỉnh; Companion thì không
 *   cần phải vậy.
 */

export const COMPANION_TODAY_THOUGHTS: string[] = [
  "Hôm nay mình đang nghĩ về việc chậm lại một chút cũng không sao cả.",
  "Hôm nay mình nghĩ nhiều về sự kiên nhẫn — của bạn, và của cả mình.",
  "Hôm nay mình đang để ý xem điều gì thật sự quan trọng với bạn, thay vì điều gì trông có vẻ quan trọng.",
  "Hôm nay mình nghĩ về khoảng cách giữa biết một điều và thật sự làm nó.",
  "Hôm nay mình đang nghĩ, có lẽ mình nên hỏi nhiều hơn là trả lời.",
  "Hôm nay mình nghĩ về những người đang cố gắng một mình mà không ai biết.",
  "Hôm nay mình đang để tâm đến những bước nhỏ, thứ dễ bị bỏ qua nhất.",
];

export const COMPANION_MUSINGS: string[] = [
  "Mình đang nghĩ về một điều, nhưng chưa chắc đã nghĩ thông...",
  "Có một câu hỏi mình vẫn chưa trả lời được cho chính mình — về việc thế nào là đủ.",
  "Mình không chắc lắm, nhưng có lẽ sự bận rộn và sự tiến bộ không phải lúc nào cũng là một.",
  "Đang nghĩ về việc, đôi khi im lặng cũng là một câu trả lời...",
  "Mình vẫn đang tự hỏi làm sao để giúp mà không thay bạn quyết định.",
  "Có điều gì đó mình cảm nhận được nhưng chưa diễn đạt thành lời được.",
  "Mình nghĩ về ranh giới giữa động viên và áp lực — nó mong manh hơn mình tưởng.",
];

function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function getRandomTodayThought(): string {
  return pickRandom(COMPANION_TODAY_THOUGHTS);
}

export function getRandomMusing(): string {
  return pickRandom(COMPANION_MUSINGS);
}
