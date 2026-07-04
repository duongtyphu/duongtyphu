/**
 * Companion World™ — lời mời ngắn hiển thị trong bubble góc Hero. Khác
 * với THOUGHT_SEEDS (suy ngẫm, đứng một mình) — đây luôn là câu hỏi
 * hướng về người dùng, mời họ bắt đầu một điều gì đó hôm nay.
 */

export const COMPANION_GREETINGS: string[] = [
  "Hôm nay bạn muốn khám phá điều gì?",
  "Có điều gì bạn đang nghĩ tới không?",
  "Mình đang ở đây, bạn muốn bắt đầu từ đâu?",
  "Hôm nay là một ngày để học điều gì mới?",
];

export function getRandomCompanionGreeting(): string {
  const index = Math.floor(Math.random() * COMPANION_GREETINGS.length);
  return COMPANION_GREETINGS[index];
}
