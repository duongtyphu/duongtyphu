# Journey Memory Rule

EPIC 02 — Sprint 04.5, Nhiệm vụ 08. Quy tắc lưu trạng thái để Companion biết người học đang ở
đâu trong hành trình — không lưu thông tin cá nhân.

## Nguyên tắc cốt lõi

> Không lưu thông tin cá nhân. Lưu: Journey State, Unlock State, Milestone, Discovery.

Journey Memory chỉ lưu **trạng thái hành trình**, không lưu nội dung nhạy cảm (không lưu văn
bản Reflection đầy đủ làm "memory" cho Unlock — Reflection đã có bảng riêng `reflections` với
mục đích khác; Journey Memory chỉ lưu SỰ KIỆN "đã Reflection cho Seed X chưa", không lưu lại
nội dung).

## 4 loại trạng thái được lưu

### 1. Journey State
Đang ở giai đoạn nào trong Journey (tái dùng `JourneyStage` enum đã có ở
`journey.service.ts` — không tạo state mới, Journey Memory chỉ THAM CHIẾU tới state đã có).

### 2. Unlock State
Danh sách `UnlockRecord` — asset nào đã mở, khi nào, người dùng đã thấy câu Companion nói về nó
chưa (`seenByUser`). Shape đã đặc tả ở `UNLOCK_RULE_STANDARD.md`/`JOURNEY_UNLOCK_RULES.md`.

### 3. Milestone
Các cột mốc đã đạt — hoàn thành Mission/Collection/Journey, lần đầu áp dụng vào việc thật, lần
đầu quay lại sau khi vắng mặt dài. Milestone là DỮ LIỆU SỰ KIỆN (đã xảy ra + khi nào), không
phải điểm số.

### 4. Discovery (đã thấy)
Danh sách Discovery item nào đã được đề xuất cho người dùng này rồi — để không lặp lại (đúng
nguyên tắc "không lặp lại cùng một Discovery" ở `DISCOVERY_RULES.md`).

## KHÔNG được lưu trong Journey Memory

- Nội dung Reflection đầy đủ (thuộc bảng `reflections`, mục đích khác — Journey Memory chỉ lưu
  "đã viết chưa", không lưu "viết gì").
- Thông tin định danh cá nhân ngoài những gì hệ thống Auth/Portal đã lưu sẵn (email, tên) — Journey
  Memory không thêm trường cá nhân mới.
- Bất kỳ chỉ số đo lường kiểu điểm/XP nào (vi phạm `REWARD_STANDARD.md`).

## Data shape dự kiến (đặc tả, không code ở Sprint này)

```
JourneyMemory {
  userId
  journeyState: { journeySlug, stage }[]        // tham chiếu JourneyStage đã có
  unlockState: UnlockRecord[]                    // xem UNLOCK_RULE_STANDARD.md
  milestones: {
    type: "mission-completed" | "collection-completed" | "journey-completed" |
          "real-world-applied" | "returned-after-absence"
    ref: string       // journeySlug/collectionSlug/... liên quan
    occurredAt: timestamp
  }[]
  discoverySeen: { discoveryId, seenAt }[]
}
```

## Vì sao cần một nơi lưu riêng, không gộp vào bảng khác

`reflections`, `orders`, `profiles`... đã có mục đích riêng. Journey Memory là lớp ĐỌC TỔNG HỢP
để Companion trả lời nhanh câu hỏi "người này đang ở đâu, đã mở gì, đã thấy Discovery nào" mà
không phải join nhiều bảng mỗi lần Companion cần quyết định — tương tự cách `portal-signals.ts`
đã làm cho Garden Stage/Reflection Meaning (đọc nhanh từ localStorage/signal, không query lại
toàn bộ dữ liệu nguồn mỗi lần).

## Client vs Server (gợi ý cho Sprint code sau, không quyết định ở đây)

- Trạng thái không nhạy cảm, dùng để hiển thị UI ngay (VD: đã thấy Discovery nào trong session
  này) → có thể tiếp tục dùng pattern localStorage/sessionStorage đã có (`nudge-session.ts`).
- Trạng thái cần bền vững qua nhiều thiết bị/phiên (Unlock State, Milestone) → nên lưu server
  (Supabase), vì đây là "sự thật" về hành trình người dùng, không nên mất khi xóa cache trình
  duyệt.

## Ranh giới

- Journey Memory không thay thế `journey.service.ts` (tính stage từ % tiến độ CKOS) — nó lưu
  KẾT QUẢ của tính toán đó theo thời gian (lịch sử), không tính lại logic stage.
- Journey Memory không lưu dữ liệu Companion "nhớ" theo nghĩa cá nhân hoá hội thoại (đó là phạm
  vi của `character-memory.ts`/`core-memory.ts` đã có) — hai hệ thống phục vụ mục đích khác
  nhau, không gộp.
