# Recommendation Rules

Companion Guide không đề xuất Seed ngẫu nhiên. 3 rule dưới đây là toàn bộ logic — thuần
if/else, **không AI**. Code: `src/features/knowledge/services/recommendation-rules.service.ts`.
Test: `recommendation-rules.test.ts` (6 test, chạy qua `npm test`).

## Rule 1 — Prerequisite chưa hoàn thành → không đề xuất Seed nâng cao

```
Nếu Seed có prerequisites[]
  VÀ ít nhất 1 prerequisite chưa đạt 100%
→ KHÔNG đề xuất Seed này cho người học.
```

Hàm: `canRecommendSeed(seed, getSeedCompletedStepIds): boolean`

Đây là rule an toàn nhất — ngăn người học nhảy cóc vào Seed nâng cao khi chưa có nền tảng
(VD: không đề xuất "Phân Tích Excel bằng AI" nếu chưa xong "Viết Prompt Hiệu Quả").

## Rule 2 — Collection gần hoàn thành → ưu tiên Seed cuối

```
Nếu Collection.percent >= 70% VÀ < 100%
→ Ưu tiên đề xuất Seed CUỐI CÙNG còn dang dở trong Collection đó
  (thay vì Seed bất kỳ hoặc chuyển sang Collection khác).
```

Hàm: `getPriorityFinishingSeed(collection, getSeedCompletedStepIds): KnowledgeSeed | null`

Lý do: người học gần xong một Collection có động lực cao để "chốt" nó — Companion nên tận
dụng đà đó thay vì kéo họ sang chủ đề mới giữa chừng.

## Rule 3 — Skill còn thiếu → ưu tiên Skill đó

```
Nếu người học chưa hoàn thành Seed nào dạy Skill X
→ Ưu tiên đề xuất Seed đầu tiên (theo thứ tự) dạy Skill X
  (miễn Seed đó không bị chặn bởi Rule 1).
```

Hàm: `getPrioritySeedForMissingSkill(allSeeds, getSeedCompletedStepIds): KnowledgeSeed | null`

Lý do: đảm bảo người học phát triển đều các Skill nền tảng (Communication, AI Office,
Research...) thay vì học sâu 1 chủ đề mà bỏ trống các Skill khác.

## Thứ tự ưu tiên khi áp dụng đồng thời

Khi cả 3 rule đều có thể áp dụng, thứ tự ưu tiên đề xuất là:

1. Rule 1 luôn là **điều kiện lọc trước** (loại Seed không đủ điều kiện) — không phải rule
   chọn, mà là rule chặn.
2. Rule 2 ưu tiên hơn Rule 3 khi Collection đang gần hoàn thành — "chốt" Collection quan
   trọng hơn học thêm Skill mới.
3. Rule 3 áp dụng khi không có Collection nào gần hoàn thành.

## Trạng thái tích hợp UI (Sprint 06)

- Rule 1 đã được tích hợp vào Companion Guide thật qua `getPrerequisiteGuidance()` (đã sửa
  trong Sprint 06 để đọc `prerequisites[]` thay vì chỉ xét Seed liền kề Collection — đóng gap
  đã ghi nhận từ `CKOS_Quality_Report.md` Sprint 05 điểm #6).
- Rule 2 và Rule 3 hiện là **hàm service thuần đã test**, chưa được gọi từ UI Collection
  Dashboard (`KnowledgeCollectionView.tsx`) — vì tích hợp UI mới sẽ là "thêm tính năng", ngoài
  phạm vi Sprint 06 ("Chỉ xây Rule. Không AI." không có nghĩa là "wire vào UI mới"). Đây là
  việc cần làm khi EPIC 02 (Học viện) hoặc Companion Studio dùng đến các rule này.
