# Unlock Rule Standard

EPIC 02 — Sprint 04.5, Nhiệm vụ 02. Thiết kế Rule Engine cho điều kiện mở khóa —
**không hardcode**, không viết code ở Sprint này. Tài liệu này là bản thiết kế (contract) mà
Sprint code sau phải tuân theo khi hiện thực `unlock-engine.ts`.

## Vì sao không được hardcode

Nếu mỗi điều kiện mở khóa được viết thành một khối `if/else` riêng trong component, thêm một
module Portal mới (hoặc thay đổi ngưỡng) sẽ đòi hỏi sửa code ở nhiều nơi — đúng vết xe đổ của
LMS cũ (Course/Lesson hardcode). Rule Engine phải là **dữ liệu khai báo** (giống
`orchestration-rules.ts` đã làm cho Companion Orchestration System™), engine chỉ đọc dữ liệu và
đánh giá — không biết trước "Seed nào, Mission nào".

## Kiến trúc đề xuất (thiết kế, chưa code)

### 1. Trigger Spec — mô tả điều kiện, không gắn cứng vào 1 asset

```
TriggerSpec =
  | { type: "seed-completed"; collectionSlug?: string }
  | { type: "mission-completed"; journeySlug?: string }
  | { type: "reflection-written"; minCount?: number; scope?: "seed" | "mission" | "any" }
  | { type: "evidence-logged" }               // Work Session READY → CELEBRATING
  | { type: "real-world-applied"; minCount?: number }  // Evidence lặp lại nhiều lần
  | { type: "collection-completed"; collectionSlug?: string }
  | { type: "journey-completed"; journeySlug?: string }
  | { type: "portal-returned"; minDaysAway: number }
  | { type: "companion-confirmed" }          // Companion tự quyết định thời điểm, không phải dữ liệu đo được
```

Mỗi `TriggerSpec` là MỘT loại điều kiện tổng quát, tham số hoá bằng field tuỳ chọn — không phải
"Seed X mở Prompt Y" viết cứng.

### 2. Unlock Rule — ánh xạ Trigger → Asset

```
UnlockRule = {
  id: string
  module: PortalModule          // tái dùng type đã có ở agent.types.ts
  trigger: TriggerSpec
  assetType: UnlockableAssetType  // "prompt-pack" | "checklist" | "template" | "case-study" |
                                   // "mission" | "learning-path" | "companion-secret" |
                                   // "ai-specialist" | "premium-challenge" | "project-challenge" |
                                   // "knowledge-collection" | "reflection-insight" | "companion-story"
  assetRef: string               // id/slug của asset thật (Seed id, Journey slug, Prompt Pack id...)
  priority: number               // khi nhiều rule cùng khớp 1 lúc, ưu tiên rule nào báo trước
  onceOnly: true                 // luôn true — một Unlock chỉ xảy ra 1 lần/user/asset (không có option khác)
}
```

Đây là bản ghi **dữ liệu** — nên lưu dưới dạng config (JSON/DB table), giống cách
`ORCHESTRATION_RULES` là một mảng dữ liệu, không phải logic phân tán trong nhiều file.

### 3. Engine — chỉ đọc dữ liệu, không biết nội dung cụ thể

```
evaluateUnlocks(input: {
  userId: string
  event: TriggerEvent            // sự kiện vừa xảy ra (VD: "seed X vừa completed")
  unlockHistory: UnlockRecord[]  // đã mở gì rồi — để lọc onceOnly
}) → UnlockRule[]                // danh sách rule vừa đủ điều kiện, engine KHÔNG tự quyết định
                                  // có nói ra ngay hay không (đó là việc của Companion — xem
                                  // "Companion là người quyết định nhịp độ" bên dưới)
```

Engine chỉ trả về "rule nào đã khớp điều kiện" — **không** tự động hiển thị Unlock ngay lập
tức. Việc CHỌN THỜI ĐIỂM nói ra vẫn thuộc về Companion (Presence Coordinator đã có từ Sprint
18.8: "đúng một moment được hiện tại một thời điểm").

## Companion là người quyết định nhịp độ, Engine chỉ là điều kiện cần

```
điều kiện đủ (Rule Engine) + thời điểm phù hợp (Companion) = Unlock thật sự xảy ra
```

Ví dụ: một Rule "hoàn thành Collection X → mở Case Study Y" có thể khớp điều kiện lúc 2h sáng
khi người dùng vừa tắt tab — Companion không nói ngay lúc đó, mà đợi lần truy cập tiếp theo, ở
thời điểm tự nhiên (đã có pattern `getSilenceTimingForStage` để tham khảo).

## Bảng ví dụ Rule (minh hoạ format, không phải danh sách đầy đủ)

| module | trigger | assetType | assetRef (ví dụ) |
|---|---|---|---|
| ckos | `seed-completed` | prompt-pack | Prompt mở rộng của Seed vừa xong |
| ckos | `collection-completed` | case-study | Case Study cùng chủ đề Collection |
| academy | `mission-completed` | companion-story | Story liên quan chủ đề Mission |
| academy | `journey-completed` | learning-path | Collection kế tiếp chưa gợi ý |
| academy | `real-world-applied` (minCount: 2) | case-study | Real Story (freelancer/founder thật) |
| opportunities | `evidence-logged` | ai-specialist | Strategy Agent "được giới thiệu" thêm |
| premium | `portal-returned` (minDaysAway: 1), điều kiện thêm: đã có ≥1 mission-completed ở Academy | premium-challenge | Premium Challenge đầu tiên |
| * (mọi module) | `portal-returned` (minDaysAway: 3) | (Discovery, không phải Unlock) | — |
| * (mọi module) | `reflection-written` (minCount: 5) | reflection-insight | Tổng hợp pattern trưởng thành |

## Mở rộng Rule Engine trong tương lai

- Thêm module mới (VD: một module Portal mới ra đời) chỉ cần thêm dữ liệu `UnlockRule`, không
  sửa engine.
- Thêm loại `TriggerSpec` mới (nếu có hành vi mới chưa liệt kê) phải đi qua review Constitution
  — không tự ý thêm loại trigger dựa trên số liệu/điểm số (vi phạm `REWARD_STANDARD.md`).

## Ranh giới

- Rule Engine không quyết định NỘI DUNG câu nói khi báo Unlock — xem
  `COMPANION_UNLOCK_LANGUAGE.md`.
- Rule Engine không quyết định KHI NÀO Discovery xuất hiện (khác cơ chế, xem
  `DISCOVERY_STANDARD.md`) — Discovery không cần `UnlockRule`, không có điều kiện.
- Trạng thái `UnlockRecord` (đã mở gì) là một phần của `JOURNEY_MEMORY_RULE.md` — Rule Engine
  đọc/ghi vào đó, không tự quản lý bộ nhớ riêng.
