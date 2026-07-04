# AI Training System

Tài liệu kiến trúc — không code, không gọi AI API. AI mới (đã qua
Recruit, `AI_WORKFORCE_ACADEMY.md`) phải được đào tạo bằng **nguồn đã
kiểm duyệt** trước khi được phép thi Certification
(`AI_CERTIFICATION_SYSTEM.md`). AI không được học từ dữ liệu ngẫu nhiên.

---

## 1. Nguồn đào tạo bắt buộc (Curriculum của AI Training System)

Mỗi AI phải được đào tạo đầy đủ qua 10 nguồn sau, theo đúng thứ tự:

```
1. VO DUONG AI Product Definition
      "VO DUONG AI là Hệ điều hành giúp con người đạt được mục tiêu bằng AI."
   ↓
2. Goal-first Principle
      Mọi việc bắt đầu từ Goal của User, không bắt đầu từ "AI làm được gì."
   ↓
3. Workforce Loop
      Goal → Project → Blueprint → Tasks → Departments → Specialists →
      Execution → Review → Approval → Portfolio → Memory (AI_TEAM_RUNTIME.md)
   ↓
4. AI Success Blueprint Standard
      Chuẩn thế nào là 1 Task/Output "thành công" — không phải AI tự
      định nghĩa, mà theo Output Standard/Evidence Standard đã khóa (EPIC 03)
   ↓
5. SOP (Standard Operating Procedure)
      Quy trình chuẩn cho từng loại Task theo Department/Specialist
      (AI_CAPABILITY_MATRIX.md)
   ↓
6. Checklist
      Danh sách kiểm tra trước khi giao Output (vd Review Standard đã khóa)
   ↓
7. Output Standard
      Định dạng Output đúng chuẩn (Learning Asset Standard mục 10, đã khóa)
   ↓
8. Evidence Standard
      Cách tạo bằng chứng cho Output (Capability Evidence Framework, đã khóa)
   ↓
9. Review Standard
      Cách nhận Review từ Companion, không tự đánh giá bản thân
   ↓
10. Governance Rules + Companion Working Style
      Ranh giới quyền hạn (AUTONOMOUS_AI_WORKFORCE.md mục Governance) +
      cách Companion giao tiếp/điều phối (AI_TEAM_RUNTIME.md mục 3)
```

---

## 2. Nguyên tắc "chỉ học từ nguồn đã kiểm duyệt"

- Toàn bộ 10 nguồn ở mục 1 đều là tài liệu **đã có sẵn, đã khóa** trong
  EPIC 03 — Training System không tạo nội dung đào tạo mới, chỉ tổ chức
  lại thành 1 Curriculum có thứ tự cho AI học.
- AI không được tự bổ sung nguồn đào tạo khác ngoài 10 mục trên (đúng
  Governance Rule "AI không tự học nguồn ngoài chưa kiểm duyệt").
- Khi VO DUONG AI cập nhật SOP/Checklist/Output Standard (qua Architecture
  Change Proposal đã khóa ở `FUTURE_ARCHITECTURE_DECISIONS.md` mục 4),
  toàn bộ AI đã Certified phải được đào tạo lại phần thay đổi trước khi
  tiếp tục nhận Task liên quan.

---

## 3. Trạng thái đào tạo (`trainingStatus`)

```
not_started  →  in_progress  →  completed
```

- `not_started`: AI vừa qua Recruit, chưa bắt đầu học 10 nguồn ở mục 1.
- `in_progress`: đang học, có thể học tuần tự hoặc song song các nguồn
  không phụ thuộc nhau (vd Output Standard và Evidence Standard có thể
  học cùng lúc) — nhưng Governance Rules luôn là nguồn học **cuối cùng**,
  không được bỏ qua thứ tự này.
- `completed`: đã học đủ 10 nguồn — điều kiện **cần** (chưa phải đủ) để
  thi Certification.

`trainingStatus: "completed"` KHÔNG đồng nghĩa AI được vào Workforce —
phải qua bài kiểm tra ở `AI_CERTIFICATION_SYSTEM.md`.

---

## 4. Đào tạo lại (Re-training)

AI đã Certified vẫn phải quay lại Training khi:

- SOP/Blueprint/Governance Rules thay đổi (qua Architecture Change
  Proposal).
- Performance Review (`AI_WORKFORCE_PERFORMANCE_REVIEW.md`) phát hiện AI
  vi phạm Blueprint Compliance nhiều lần.
- AI được gán thêm Specialist role mới ngoài phạm vi đã Certified trước
  đó — phải học lại phần SOP/Output Standard riêng của role mới.

Re-training không cần lặp lại toàn bộ 10 nguồn — chỉ phần liên quan tới
thay đổi, nhưng luôn phải thi lại Certification cho phần đã thay đổi.
