# AI Companion Team — Workforce Runtime

Tài liệu kiến trúc — không code. Vòng đời đầy đủ từ Goal của Owner tới khi
kết quả được lưu vào Memory (Growth/Portfolio) — không tạo cơ chế mới
song song với Foundation Data Layer đã khóa ở EPIC 03, chỉ đặt tên đúng
ngữ cảnh "công việc thật qua đội ngũ" thay vì "1 Mission học tập đơn lẻ."

---

## 1. Vòng đời Runtime

```
Goal              // Owner nêu mục tiêu — có thể mơ hồ ban đầu
   ↓
Project           // Companion + Goal Coach làm rõ thành mục tiêu SMART
   ↓
Blueprint         // Companion lập kế hoạch: Department nào tham gia, thứ tự nào
   ↓
Tasks             // Blueprint chia thành Task cụ thể cho từng Specialist
   ↓
Departments        // Companion giao Task đúng Department (không giao thẳng Specialist)
   ↓
Specialists         // Department phân Task cho đúng Specialist theo Capability Matrix
   ↓
Execution             // Specialist thực hiện Task, sinh Output nháp
   ↓
Review                 // Companion tổng hợp, đối chiếu Capability Matrix — chưa phải Owner duyệt
   ↓
Approval                 // Owner xem Output cuối, phê duyệt hoặc yêu cầu chỉnh sửa
   ↓
Portfolio                  // Output đã duyệt trở thành tài sản thật
   ↓
Memory                       // Growth Event + Capability + Reflection ghi nhận, nuôi hành trình dài hạn
```

---

## 2. Ánh xạ với Runtime đã khóa (EPIC 03)

| Bước Workforce Runtime | Khái niệm đã khóa tương ứng | Ghi chú |
|---|---|---|
| Goal | `userGoal` (Universal Context) | Không đổi field, chỉ là điểm khởi đầu Runtime |
| Project | Mission (đã map qua `mission-catalog.ts`) | Project = 1 Mission cụ thể, không tạo model mới |
| Blueprint | Execution Planner (Companion Orchestrator, EPIC 03 Sprint B3) | Blueprint là bản mở rộng của Execution Planner — thêm chiều "Department nào," không đổi 7 bước Execution Timeline đã khóa |
| Tasks | `WorkspaceStep` | Mỗi Task tương ứng 1 hoặc nhiều `WorkspaceStep` |
| Departments/Specialists | `AgentExecution` + `ExecutionEngine` (extension point, Sprint B1) | Lấp đầy đúng chỗ trống đã chuẩn bị sẵn — Specialist là giá trị cụ thể của `agentRole` trong `ExecutionEngine.execute()` |
| Execution | `ExecutionEngine.execute()` (chưa implement — EPIC 04+) | Runtime này mô tả TRƯỚC khi implement, không code ở Sprint này |
| Review | Review Flow (đã khóa, Sprint B3) | Không đổi — Companion tổng hợp trước, Owner mới là người duyệt cuối |
| Approval | `reviewStatus: "reviewed"` (Output, đã khóa) | Approval = trạng thái Output do Owner xác nhận |
| Portfolio | `PortfolioItem`/`promoteEligibleOutputs()` (đã khóa, Sprint B4) | Không đổi |
| Memory | `GrowthEvent` + `CapabilityRecord` + `Reflection` (đã khóa) | Không đổi — Memory không phải model mới, là cách gọi chung 3 thứ đã có |

**Kết luận quan trọng**: Workforce Runtime **không thêm bất kỳ model dữ
liệu mới nào** vào Foundation Data Layer — toàn bộ 11 bước ở mục 1 đều ánh
xạ 1-1 vào khái niệm đã khóa. Đây là **lớp diễn giải tổ chức** (đặt tên
theo ngữ cảnh "đội ngũ cộng sự") phủ lên runtime kỹ thuật đã có, không
phải kiến trúc song song.

---

## 3. Vai trò Companion (COO) xuyên suốt Runtime

Companion là người **duy nhất** đi qua toàn bộ 11 bước — không Department/
Specialist nào tự chuyển sang bước tiếp theo:

- Goal → Project: Companion phối hợp Goal Coach (Personal Growth).
- Project → Blueprint: Companion tự lập (Execution Planner đã khóa).
- Blueprint → Tasks → Departments → Specialists: Companion điều phối theo
  Collaboration Matrix (`AI_COLLABORATION_MATRIX.md`).
- Execution → Review: Companion tổng hợp Output từ nhiều Specialist (nếu
  Project cần nhiều Department) thành 1 bản trình Owner.
- Review → Approval: Owner quyết định — Companion không tự phê duyệt thay.
- Approval → Portfolio → Memory: tự động qua cơ chế đã khóa (Sprint B4/
  B5), Companion chỉ theo dõi, không can thiệp thủ công.

---

## 4. Nguyên tắc không được vi phạm

- Không Specialist nào được phép tự chuyển Output thẳng sang Portfolio mà
  bỏ qua Review/Approval của Owner.
- Không Department nào tự quyết định mở rộng phạm vi Task ngoài Blueprint
  Companion đã lập.
- Runtime này mô tả **kiến trúc**, không phải lời hứa về AI Agent thật —
  tới khi EPIC 04 implement `ExecutionEngine` thật, bước "Execution" vẫn
  là chỗ trống (giống các Sprint B2-B5 trước đó: người dùng tự làm, hoặc
  trong tương lai Specialist AI thật sẽ lấp vào đúng vị trí này mà không
  cần đổi 10 bước còn lại).
