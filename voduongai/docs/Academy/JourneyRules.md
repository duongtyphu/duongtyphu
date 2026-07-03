# Journey Rules

Quy tắc rule-based (không AI) điều khiển Journey Engine. Code:
`src/features/academy/services/journey.service.ts`.

## Khi nào mở bước tiếp?

Journey Engine không "mở khoá" bước tiếp theo theo nghĩa chặn truy cập — người học luôn có
thể truy cập bất kỳ Seed nào trong Collection (CKOS không khoá nội dung). Journey Rules chỉ
quyết định **giai đoạn nào được hiển thị** và **Companion gợi ý gì**, dựa trên % tiến độ
Collection (`computeCollectionProgress`, đã có từ CKOS):

| Điều kiện | Giai đoạn (JourneyStage) |
|---|---|
| `percent === 0` | `PREPARATION` |
| `0 < percent < 15` | `LEARNING` |
| `15 <= percent < 45` | `PRACTICE` |
| `45 <= percent < 70` | `APPLICATION` |
| `70 <= percent < 100` | `REFLECTION` |
| `percent === 100` và chưa xác nhận sẵn sàng | `GROWTH` |
| `percent === 100` và đã xác nhận sẵn sàng (`markReady()`) | `READY` |

Các ngưỡng % (15/45/70) là ước lượng ban đầu dựa trên số Seed trung bình mỗi Collection (5-8
Seed) — chia đều 5 giai đoạn giữa 0-100%. Có thể tinh chỉnh khi có dữ liệu sử dụng thật.

## Khi nào gợi ý Practice?

Companion gợi ý Practice khi Journey đang ở giai đoạn `PRACTICE` — tại thời điểm đó, Companion
Guidance luôn nêu tên Seed cụ thể tiếp theo (qua `getCurrentSeedForJourney`), không nói chung
chung "hãy thực hành thêm".

## Khi nào gợi ý Reflection?

Companion gợi ý Reflection khi Journey đạt giai đoạn `REFLECTION` (>=70% Collection) — đây là
thời điểm người học đã tích luỹ đủ trải nghiệm để nhìn lại có ý nghĩa, không gợi ý Reflection
quá sớm (khi mới bắt đầu, chưa có gì để phản tư).

## Nguyên tắc giọng nói Companion (Feature 06)

| Không được nói | Phải nói |
|---|---|
| "Bạn còn 3 bài." | "Mình nghĩ bạn đã sẵn sàng để thử [Seed cụ thể]..." |
| "Hoàn thành 60%." | "Bạn đang áp dụng khá tốt rồi." |
| "Bạn đã xong 5/8 bài học." | "Bạn đã đi được một chặng dài." |

Companion Guidance **không bao giờ hiển thị số liệu** (%, số bài, số bước còn lại) trực tiếp
cho người dùng — số liệu chỉ dùng nội bộ (trong `JourneyStatus.percent`) để chọn câu nói phù
hợp, không hiển thị ra UI.

## Growth Checkpoint mở khi nào?

Chỉ mở khi giai đoạn là `GROWTH` hoặc `READY` (percent = 100%) — không mở sớm hơn, tránh hỏi
"bạn trưởng thành thế nào" khi người học còn chưa thực hành đủ để có gì để trả lời.
