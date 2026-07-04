# AI Operation Modes

Tài liệu kiến trúc — không code, không gọi AI API. 3 chế độ vận hành xác
định **mức độ Companion tự điều phối** so với **mức độ hỏi User trước
từng bước** — không chế độ nào thay đổi Governance Rules
(`AUTONOMOUS_AI_WORKFORCE.md` mục 3), chỉ thay đổi tần suất Companion hỏi
User.

---

## 1. Mode 1 — Manual

```
Goal → Companion hỏi User → Blueprint bước 1 → User xác nhận → Task 1
   → User xác nhận Output 1 → Blueprint bước 2 → User xác nhận → Task 2 → ...
```

- Companion hỏi User **trước từng bước** trong Blueprint, kể cả bước nhỏ.
- Phù hợp: Goal lần đầu, Goal có rủi ro cao, User muốn kiểm soát chi tiết.
- Ưu điểm: User luôn nắm rõ từng quyết định. Nhược điểm: chậm, nhiều lần
  hỏi.

## 2. Mode 2 — Assisted

```
Goal → Companion tự điều phối các bước thường
   → chỉ hỏi User ở điểm quan trọng (đổi phạm vi, chọn hướng, phê duyệt Output)
   → Portfolio
```

- Companion tự điều phối Task thường quy (không cần hỏi từng bước nhỏ),
  nhưng vẫn dừng lại hỏi User ở:
  - Điểm rẽ nhánh quan trọng (vd chọn 1 trong nhiều hướng tiếp cận khác
    nhau).
  - Trước khi Output được coi là hoàn tất (User Approval vẫn bắt buộc).
- Phù hợp: phần lớn công việc thường ngày, Goal đã quen thuộc với Companion.
- Đây là chế độ **mặc định khuyến nghị** cho hầu hết Goal.

## 3. Mode 3 — Autonomous

```
Goal → Companion tự vận hành toàn bộ Blueprint (Autonomous Runtime, AUTONOMOUS_AI_WORKFORCE.md)
   → chỉ dừng khi có 1 trong 5 điều kiện dừng bắt buộc
   → Portfolio
```

- Companion tự vận hành toàn bộ Blueprint không hỏi User ở các bước
  trung gian.
- **Chỉ dừng khi** (đúng 5 điều kiện đã khóa ở
  `AUTONOMOUS_AI_WORKFORCE.md` mục 5):
  1. Cần quyết định của User.
  2. Có rủi ro.
  3. Vượt quyền.
  4. Thiếu dữ liệu.
  5. Cần phê duyệt Output.
- Phù hợp: Goal lặp lại nhiều lần, Blueprint đã được User tin tưởng qua
  nhiều lần chạy trước, rủi ro thấp.

---

## 4. So sánh 3 Mode

| | Mode 1 — Manual | Mode 2 — Assisted | Mode 3 — Autonomous |
|---|---|---|---|
| Tần suất hỏi User | Mọi bước | Điểm quan trọng | Chỉ 5 điều kiện dừng bắt buộc |
| Tốc độ | Chậm nhất | Trung bình | Nhanh nhất |
| Phù hợp | Goal mới/rủi ro cao | Công việc thường ngày | Goal lặp lại, đã tin tưởng |
| User Approval cuối | Luôn có | Luôn có | Luôn có (không đổi ở bất kỳ Mode nào) |
| Governance Rules | Không đổi | Không đổi | Không đổi |

**User Approval cuối và Governance Rules không thay đổi ở bất kỳ Mode
nào** — 3 Mode chỉ khác nhau ở **tần suất tương tác**, không khác nhau ở
**quyền hạn**.

---

## 5. Chuyển đổi giữa các Mode

- User luôn có thể chuyển Mode bất kỳ lúc nào (kể cả giữa Runtime đang
  chạy) — Companion không tự chuyển Mode thay User.
- Mode mới chỉ áp dụng từ bước tiếp theo — không hồi tố lại các bước đã
  hoàn thành ở Mode trước.
- Khuyến nghị: Goal mới luôn bắt đầu ở Mode 1 hoặc Mode 2; chỉ chuyển
  Mode 3 sau khi User đã thấy Blueprint tương tự chạy đúng nhiều lần ở
  Mode 2 (điều kiện tin tưởng, không phải mặc định).
