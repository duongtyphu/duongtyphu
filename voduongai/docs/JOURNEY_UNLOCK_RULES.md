# Journey Unlock Rules

Quy tắc rule-based (không AI) cho việc: điều kiện nào → mở khóa loại tài sản nào. Đây là đặc
tả cho Sprint code sau này (`unlock-engine.ts` dự kiến) — tài liệu này KHÔNG code, chỉ định
nghĩa rule.

## Nguyên tắc thiết kế rule

1. **Một điều kiện có thể mở nhiều loại tài sản khác nhau tuỳ module** — rule nên khai báo theo
   cặp `(module, trigger) → asset`, giống cách `orchestration-rules.ts` khai báo theo
   `(module, keyword) → agentIds`.
2. **Một Unlock chỉ xảy ra một lần** cho mỗi cặp (user, asset) — không lặp lại thông báo cho
   cùng một Unlock đã nhận.
3. **Ngưỡng phải cụ thể, không mơ hồ** — "quay lại sau vài ngày" nghĩa là một khoảng cách ngày
   cụ thể (ví dụ 3 ngày), không phải "một lúc nào đó".
4. **Rule không phụ thuộc AI** — mọi điều kiện đều là dữ liệu đã có sẵn trong hệ thống (số Seed
   hoàn thành, số Reflection đã viết, có Work Session nào đã CELEBRATING chưa, khoảng cách ngày
   kể từ lần ghé thăm trước).
5. **Rule là ngưỡng tối thiểu** — hoàn thành trigger là điều kiện CẦN, Companion vẫn quyết định
   THỜI ĐIỂM nói ra Unlock (không unlock ngay lập tức khi điều kiện vừa đạt — xem
   `DISCOVERY_RULES.md` mục nhịp độ).

## Bảng rule theo module

### CKOS

| Trigger | Unlock |
|---|---|
| Hoàn thành 1 Seed (tất cả step trong `KnowledgeSeedStep[]` done) | Prompt Pack mở rộng của Seed đó (nếu có prompt "ẩn" ngoài `samplePrompt`) |
| Reflection đã viết cho Seed đó | 1 Companion Note/insight liên quan (tái dùng `companionNote`, không tạo field mới) |
| Hoàn thành toàn bộ Seed trong 1 Collection | Case Study liên quan tới chủ đề Collection đó |
| Practice đã đánh dấu (Work Session CKOS → READY) | Checklist áp dụng thực tế cho kỹ năng đó |

### Academy

| Trigger | Unlock |
|---|---|
| Hoàn thành 1 Mission (Work Session của Mission đó → CELEBRATING) | Mission tiếp theo trong cùng Journey trở nên nổi bật hơn (không phải "mở khóa từ ẩn", Mission Academy vốn không ẩn hoàn toàn — Unlock ở đây là NHẤN MẠNH, không phải hiện/ẩn cứng) |
| Hoàn thành Journey (JourneyStage = READY) | Learning Path mới (Collection kế tiếp chưa gợi ý trước đó) |
| Reflection sau Mission | Companion Story liên quan tới đúng chủ đề Mission |
| Áp dụng vào công việc thật (Evidence ghi nhận) | Real Story (xem Blueprint mục "Real Story") — chỉ mở sau N Mission áp dụng thật, N ≥ 2 |

### Dự án & Cơ hội

| Trigger | Unlock |
|---|---|
| Hoàn thành phân tích 1 dự án (Work Session Opportunities → CELEBRATING) | AI Specialist mới xuất hiện trong đội Companion mời cho lần sau (ví dụ: lần đầu chỉ mời Project/Risk Analyst, sau khi hoàn thành 1 lần, Strategy Agent "được giới thiệu" như một lựa chọn Companion cân nhắc) |
| Đánh giá rủi ro đã làm | Project Challenge (một dự án/case thực hành sâu hơn) |

### Premium

| Trigger | Unlock |
|---|---|
| Quay lại Premium sau khi đã hoàn thành ≥1 Mission ở Academy | Premium Challenge đầu tiên |
| Hoàn thành Premium Challenge | Companion Secret (nội dung Companion chia sẻ riêng — xem Blueprint) |

### Toàn Portal (không riêng module)

| Trigger | Unlock |
|---|---|
| Quay lại Portal sau 3+ ngày vắng mặt | 1 Discovery bất kỳ được Companion "giữ dành" — tái dùng `getRelationshipStage`/`getSilenceTimingForStage` đã có ở `first-meeting.ts` làm nguồn tín hiệu "đã vắng bao lâu" |
| Viết đủ N Reflection (N ≥ 5, con số cụ thể do Sprint sau quyết định dựa trên dữ liệu thật) | Reflection Insight — Companion tổng hợp một nhận định về pattern trưởng thành của người dùng |

## Trạng thái Unlock (data shape dự kiến — chỉ đặc tả, không code)

Khi Sprint sau implement, trạng thái nên lưu tối thiểu:

```
UnlockRecord {
  userId
  assetType   // "prompt-pack" | "case-study" | "mission" | ... (theo danh sách ở Blueprint)
  assetId
  unlockedAt
  seenByUser  // người dùng đã thấy câu Companion nói về Unlock này chưa
}
```

Không cần bảng "tất cả asset còn ẩn" hiển thị cho người dùng — chỉ cần bảng "đã mở" để tránh lặp
lại thông báo (đúng nguyên tắc Surprise: không lộ danh sách còn lại).

## Ranh giới

- Rule này **không quyết định nội dung câu nói** — xem `COMPANION_UNLOCK_LANGUAGE.md`.
- Rule này **không quyết định tần suất Discovery** (khám phá chủ động, khác với Unlock có điều
  kiện) — xem `DISCOVERY_RULES.md`.
