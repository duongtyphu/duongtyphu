# Growth Prompt Template

Câu nói Companion Guidance theo từng giai đoạn Journey (Feature 06). Xem quy tắc giọng nói ở
`../JourneyRules.md` (mục "Nguyên tắc giọng nói Companion").

```ts
const GROWTH_PROMPTS: Record<JourneyStage, (context) => string> = {
  PREPARATION: (journeyTitle) =>
    `Mình nghĩ hôm nay bạn nên bắt đầu với "${journeyTitle}" — chỉ cần 10-15 phút đầu tiên để làm quen.`,
  LEARNING: () =>
    "Mình thấy bạn đang tìm hiểu dần. Đừng vội — hiểu chắc từng phần rồi hẵng thực hành.",
  PRACTICE: (nextSeedTitle) =>
    nextSeedTitle
      ? `Mình nghĩ bạn đã sẵn sàng để thử "${nextSeedTitle}" — làm luôn với công việc thật của bạn.`
      : "Mình nghĩ bạn đã sẵn sàng để thực hành phần tiếp theo.",
  APPLICATION: () =>
    "Bạn đang áp dụng khá tốt rồi. Hôm nay thử dùng lại kỹ năng này cho một việc thật khác xem sao.",
  REFLECTION: () =>
    "Bạn đã đi được một chặng dài. Dành 2 phút nhìn lại — bạn thấy mình khác gì so với lúc bắt đầu?",
  GROWTH: () =>
    "Bạn đã hoàn thành hành trình này. Mình nghĩ đã đến lúc bạn tự xác nhận mình đã sẵn sàng.",
  READY: () =>
    "Bạn đã sẵn sàng. Hành trình tiếp theo đang chờ khi bạn muốn.",
};
```

## Quy tắc viết Growth Prompt mới

1. Không bao giờ chứa số liệu (%, số bài, số bước còn lại).
2. Luôn ở ngôi thứ nhất số ít của Companion ("mình"), nói với người học ở ngôi thứ hai ("bạn").
3. Câu PRACTICE luôn cố gắng nêu tên cụ thể (Seed/hành động) nếu có sẵn dữ liệu — tránh câu
   chung chung khi thông tin cụ thể có thể lấy được.
4. Không dùng cụm bị cấm đã liệt kê ở `docs/CKOS/CompanionNote_Standard.md` ("hành trình",
   "chinh phục", "phiên bản tốt nhất", "cùng nhau", "đỉnh cao") — Growth Prompt kế thừa cùng
   chuẩn giọng văn Companion với CKOS.
