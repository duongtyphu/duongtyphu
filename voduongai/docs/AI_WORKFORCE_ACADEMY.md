# AI Workforce Academy

PHASE 3, EPIC 03. Tài liệu kiến trúc — không code, không gọi AI API,
không thêm AI Agent thật, không sửa UI/route, không đổi kiến trúc đã khóa
ở EPIC 01/EPIC 02/EPIC 03 (AI Companion Team). Đây là vòng đời **tuyển
dụng và đào tạo AI** trước khi 1 AI được phép gia nhập AI Companion Team
(`AI_COMPANION_TEAM.md`) với vai trò 1 Specialist.

**Product Principle**: Companion không chọn AI mạnh nhất. Companion xây
dựng đội ngũ AI phù hợp nhất. Companion không được tự ý tuyển AI vào đội
ngũ — Companion chỉ đề xuất, User (Owner) phê duyệt.

---

## 1. Vòng đời AI Workforce Academy

```
Discover              // Companion tìm hiểu AI Agent/Tool/Model mới xuất hiện
   ↓
Evaluate              // Đánh giá điểm mạnh/yếu theo AI Capability Profile Standard
   ↓
Recruit               // Companion ĐỀ XUẤT tuyển — User phê duyệt mới được tiếp tục
   ↓
Onboarding            // Giới thiệu AI với Product Definition, Blueprint, SOP của VO DUONG AI
   ↓
Training              // Đào tạo theo nguồn đã kiểm duyệt (AI Training System)
   ↓
Certification         // Kiểm tra đạt chuẩn (AI Certification System) — chưa đạt = Sandbox
   ↓
Assign Capability      // Gán đúng Department/Specialist role trong Capability Matrix
   ↓
Join Workforce          // Chính thức là 1 Specialist trong AI Companion Team
   ↓
Performance Review        // Theo dõi hiệu suất liên tục (AI Workforce Performance Review)
   ↓
Continuous Improvement      // Đào tạo lại, nâng cấp Capability, hoặc đề xuất Retirement
```

---

## 2. Vai trò từng bước

### Discover
Companion quan sát AI Agent/Tool/Model mới xuất hiện (qua thông tin đã có
sẵn trong hệ thống — không tự động crawl/gọi API bên ngoài trong Sprint
này). Kết quả của Discover là 1 bản ghi "AI ứng viên" chưa có Capability
Profile đầy đủ.

### Evaluate
Companion điền đầy đủ `AI_CAPABILITY_PROFILE_STANDARD.md` cho AI ứng viên
— đánh giá khách quan điểm mạnh/yếu, không thiên vị theo "AI nổi tiếng
nhất." Evaluate là bước **nội bộ của Companion**, chưa cần User tham gia.

### Recruit
Companion trình bày đề xuất tuyển dụng cho User — gồm Capability Profile
đầy đủ + lý do đề xuất (Department/Specialist role nào sẽ nhận AI này).
**User là người duy nhất phê duyệt** — Companion không được tự chuyển
sang Onboarding nếu chưa có phê duyệt.

### Onboarding
AI ứng viên đã được duyệt được giới thiệu: Product Definition ("VO DUONG
AI là Hệ điều hành giúp con người đạt được mục tiêu bằng AI"), Goal-first
Principle, Workforce Loop, Blueprint mẫu, SOP, Governance Rules
(`AI_TRAINING_SYSTEM.md` mục 1).

### Training
AI học theo đúng nguồn đã kiểm duyệt (không học dữ liệu ngẫu nhiên) — chi
tiết ở `AI_TRAINING_SYSTEM.md`.

### Certification
AI phải đạt đủ tiêu chí ở `AI_CERTIFICATION_SYSTEM.md` mới được coi là
"Certified." Chưa đạt → giữ nguyên trạng thái **Sandbox** (không được nhận
Task thật, không tiếp xúc dữ liệu/Output thật của User).

### Assign Capability
AI Certified được gán vào đúng 1 hoặc nhiều Specialist role (theo
`AI_CAPABILITY_MATRIX.md` đã khóa ở AI Companion Team) — không tự nhận
role ngoài phạm vi đã Certified.

### Join Workforce
AI chính thức hoạt động như 1 Specialist — tuân theo toàn bộ Governance
Rules (`AI_TRAINING_SYSTEM.md` mục 1, `AUTONOMOUS_AI_WORKFORCE.md` mục
Governance).

### Performance Review
Theo dõi liên tục — chi tiết `AI_WORKFORCE_PERFORMANCE_REVIEW.md`.

### Continuous Improvement
AI hoạt động kém → quay lại Training hoặc đề xuất Retirement (không tự
động xóa/loại bỏ — luôn cần User xác nhận, đúng nguyên tắc User là người
phê duyệt cuối).

---

## 3. Ranh giới không được vượt qua

- Companion không được tự ý tuyển AI — mọi bước Recruit đều dừng chờ User
  phê duyệt.
- AI chưa Certified không được nhận Task thật (chỉ Sandbox).
- Không AI nào được bỏ qua Onboarding/Training để vào thẳng Workforce.
- Không tạo Marketplace AI (không có khái niệm "chọn AI từ danh sách công
  khai để mua/dùng thử") — đây là quy trình tuyển dụng nội bộ có kiểm
  soát, không phải cửa hàng AI.
- Không gọi AI API thật, không tuyển AI thật trong Sprint này — toàn bộ
  vòng đời trên là kiến trúc, chưa implement.

---

Chi tiết: `AI_CAPABILITY_PROFILE_STANDARD.md` (hồ sơ năng lực AI),
`AI_TRAINING_SYSTEM.md` (nguồn đào tạo), `AI_CERTIFICATION_SYSTEM.md`
(tiêu chuẩn chứng nhận), `AUTONOMOUS_AI_WORKFORCE.md` (vận hành sau khi
gia nhập), `AI_OPERATION_MODES.md` (3 chế độ giám sát),
`AI_WORKFORCE_PERFORMANCE_REVIEW.md` (theo dõi hiệu suất).
