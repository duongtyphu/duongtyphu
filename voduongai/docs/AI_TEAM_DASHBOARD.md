# AI Companion Team — Team Dashboard

Tài liệu kiến trúc — không code, không UI. Thiết kế dữ liệu Dashboard để
Owner (và Companion) theo dõi trạng thái toàn bộ AI Companion Team — mỗi
Department có 1 khối Dashboard theo cùng 1 chuẩn, không tự chế cấu trúc
riêng cho từng Department.

---

## 1. Cấu trúc Dashboard chuẩn (áp dụng cho mọi Department)

```
DepartmentDashboard {
  departmentId
  departmentName          // vd "Research & Knowledge"
  status                   // "active" | "idle" | "blocked"
  currentTasks[]             // Task đang thực hiện, gắn Specialist đang xử lý
  completedTasks[]             // Task đã hoàn thành (đã Review + Approval)
  blockedTasks[]                  // Task đang chờ (thiếu input, chờ Owner phê duyệt bước trước...)
  capabilities[]                    // danh sách Specialist + Capability đang có
  qualityScore                       // KHÔNG phải điểm số theo nghĩa chấm điểm —
                                      // tính từ tỷ lệ Output đạt "reviewed" ngay lần đầu
                                      // / tổng Output đã tạo (Evidence-based, EPIC 03)
}
```

```
TaskSummary {
  taskId
  taskName
  specialistId            // Specialist đang/đã xử lý
  projectId                 // Project/Mission mà Task này thuộc về
  status                      // "in_progress" | "completed" | "blocked"
  blockedReason?                // chỉ có khi status = "blocked"
}
```

**Nguyên tắc `qualityScore`**: không phải điểm số chấm cho Specialist theo
nghĩa xếp hạng — là tỷ lệ đo được thật (Output đạt `reviewStatus:
"reviewed"` mà không cần Revision nhiều lần / tổng Output), nhất quán với
nguyên tắc "không chấm điểm" đã khóa xuyên suốt EPIC 03
(`ASSESSMENT_CAPABILITY_STANDARD.md` mục 1).

---

## 2. Dashboard theo từng Department (ví dụ cấu trúc dữ liệu)

### Research & Knowledge

```
DepartmentDashboard {
  departmentName: "Research & Knowledge"
  status: "active"
  currentTasks: [{ taskName: "Nghiên cứu đối thủ ngành F&B", specialistId: "market-research-specialist", status: "in_progress" }]
  completedTasks: [{ taskName: "Chân dung khách hàng mục tiêu", specialistId: "customer-research-specialist", status: "completed" }]
  blockedTasks: []
  capabilities: ["Market Research Specialist", "Customer Research Specialist", "Fact Checker", "Knowledge Analyst"]
  qualityScore: "3/4 Output đạt reviewed ngay lần đầu"
}
```

### Technology & Automation

```
DepartmentDashboard {
  departmentName: "Technology & Automation"
  status: "blocked"
  currentTasks: []
  completedTasks: [{ taskName: "Script tự động gửi báo cáo tuần", specialistId: "developer", status: "completed" }]
  blockedTasks: [{ taskName: "QA script tự động gửi báo cáo", specialistId: "qa-specialist", status: "blocked", blockedReason: "Chờ Owner cung cấp dữ liệu thật để kiểm thử" }]
  capabilities: ["Developer", "QA Specialist", "Automation Specialist"]
  qualityScore: "1/1 Output đạt reviewed (QA đang chờ)"
}
```

Cấu trúc tương tự áp dụng đúng khuôn cho 5 Department còn lại (Content &
Communication, Business & Strategy, Creative & Design, Office
Productivity, Personal Growth) — không lặp lại ví dụ, chỉ khác giá trị
thật của `currentTasks`/`completedTasks`/`blockedTasks`/`capabilities`.

---

## 3. Dashboard tổng (Team Overview)

```
TeamOverviewDashboard {
  totalDepartments: 7
  activeDepartments: number
  totalSpecialists: 24
  totalTasksInProgress: number
  totalTasksCompleted: number
  totalTasksBlocked: number
  overallQualityScore: string   // trung bình có trọng số từ 7 Department
}
```

`TeamOverviewDashboard` là nơi Companion (COO) nhìn tổng quan trước khi
quyết định điều phối Task mới — không thay thế Dashboard từng Department,
chỉ tổng hợp.

---

## 4. Nguồn dữ liệu (không tạo bảng mới)

`DepartmentDashboard`/`TaskSummary`/`TeamOverviewDashboard` là **view tính
toán**, không phải bảng lưu trữ mới — tính từ dữ liệu đã có trong
Foundation Data Layer đã khóa:

| Field Dashboard | Nguồn dữ liệu thật |
|---|---|
| `currentTasks`/`completedTasks`/`blockedTasks` | `WorkspaceStep`/`WorkspaceSession.status` |
| `capabilities` | Danh sách Specialist theo Department (`AI_COMPANION_SPECIALISTS.md`, tĩnh) |
| `qualityScore` | Tỷ lệ `Output.reviewStatus === "reviewed"` không qua nhiều `OutputVersion` / tổng Output (Capability Evidence Framework) |

Không cần Dashboard UI trong Sprint này (đúng brief — chỉ thiết kế dữ
liệu). Khi implement (EPIC 04+), Dashboard chỉ cần đọc đúng nguồn trên,
không cần model mới.
