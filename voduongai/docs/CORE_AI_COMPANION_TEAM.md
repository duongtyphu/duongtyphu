# EPIC 05 — Core AI Companion Team (Workforce Level 1)

> **Trạng thái**: Kiến trúc + định nghĩa Companion (design-only). Không
> gọi AI API thật, không tích hợp hàng loạt, không xây Marketplace,
> không đổi kiến trúc đã khóa (Workspace Session/Output/Event Bus/
> Portfolio/Capability Engine — nguyên vẹn). Tiếp nối trực tiếp
> `OPEN_AI_WORKFORCE_PLATFORM.md` (Registry/Lifecycle framework) và
> `AI_AGENT_INTEGRATION_MVP.md` (2 Agent thật đầu tiên: Writer, Reviewer).

## 0. Mục tiêu

Thiết kế **Workforce Level 1**: 30 AI Companion cốt lõi, phủ 7
Department đã khóa (`AI_COMPANION_DEPARTMENTS.md`), đủ để Companion
(vai trò điều phối — COO, theo `AI_COMPANION_TEAM.md`) đảm nhận thay
Owner phần lớn công việc trí óc lặp lại trong Portal, mà không cần thêm
Department mới, không cần Marketplace, không cần gọi AI thật ngay.

## 1. Quan hệ với các tài liệu đã có (không định nghĩa lại)

| Đã có (giữ nguyên) | Vai trò | Sprint này bổ sung gì |
|---|---|---|
| `AI_COMPANION_TEAM.md` | Companion là COO điều phối, Owner luôn phê duyệt cuối | Không đổi — 30 Companion vẫn báo cáo qua Companion, không thay thế vai trò COO |
| `AI_COMPANION_DEPARTMENTS.md` | 7 Department, Mission/Responsibilities/KPI cấp phòng ban | Không đổi tên/Mission Department — chỉ chi tiết hoá xuống từng Companion |
| `AI_COMPANION_SPECIALISTS.md` | 24 Specialist khởi điểm, tóm tắt 1 dòng/vai trò | **Mở rộng lên 30** (thêm 6 Companion mới) + viết Profile đầy đủ 10 mục/Companion — file này (`AI_COMPANION_SPECIALISTS.md`) không bị xoá, được xem là "danh sách tóm tắt", còn Profile đầy đủ chuyển sang `AI_COMPANION_REGISTRY.md` |
| `OPEN_AI_WORKFORCE_PLATFORM.md` | AI Provider/Capability/Compatibility/Benchmark/Certification/Deployment Registry, AI Lifecycle | Registry ở đó là cho **Provider/Model** (hạ tầng gọi AI). Sprint này thêm **AI Companion Registry** — 1 tầng trên, mô tả **vai trò nghiệp vụ** (Companion), không mô tả model. 1 Companion trong tương lai có thể được "deploy" bằng bất kỳ Provider/Capability nào đã certify ở tầng dưới — 2 registry độc lập nhưng nối được qua `capabilityId` |
| `mission-catalog.ts` (10 Golden Mission) | Blueprint Type thật đã chạy trong Workspace | Dùng làm **Supported Blueprint Types** tham chiếu cho từng Companion — không tạo Blueprint Type song song |
| `capability-engine.ts` (Competency) | Năng lực NGƯỜI dùng | Companion Capability (AI) tham chiếu cùng `relatedCompetencyId` — không tạo taxonomy năng lực thứ hai |

## 2. 6 Deliverable của Sprint này

| File | Nội dung | Trả lời yêu cầu # |
|---|---|---|
| `CORE_AI_COMPANION_TEAM.md` (file này) | Tổng quan, phạm vi, exit criteria | — |
| `AI_COMPANION_REGISTRY.md` | AI Companion Registry schema + Profile đầy đủ 30 Companion (10 mục/Companion) | #1, #2, #3 |
| `AI_COMPANION_CAPABILITY_MAP.md` | Capability Coverage Map — 30 Companion phủ bao nhiêu % nhu cầu Portal | #5 |
| `AI_COMPANION_COLLABORATION.md` | Collaboration Matrix giữa 30 Companion | #4 |
| `AI_WORKFORCE_REGISTRY.md` | Workforce Registry (roster tổng hợp) + quy trình tuyển AI mới không sửa hệ thống | #7, #8 |
| `AI_DEPARTMENT_DASHBOARD.md` | Department Dashboard — thiết kế màn hình tổng hợp theo 7 Department | #6 |

## 3. Nguyên tắc bất biến (nhắc lại, áp dụng cho toàn bộ 30 Companion)

1. **Không Companion nào tự Approve/Publish thay Owner** — mọi Output đi
   qua đúng luồng Approval đã khóa (`workspace-session-store.ts`).
2. **Không Companion nào tự mở rộng Workforce** — thêm Companion #31 trở
   đi phải qua quy trình đăng ký ở `AI_WORKFORCE_REGISTRY.md` §Onboarding,
   không phải do 1 Companion tự quyết.
3. **Companion (COO) là điểm điều phối duy nhất** người dùng thấy —
   Owner không "chọn Companion cụ thể" từ danh sách 30, Owner nói Goal,
   Companion (COO) tự chọn Blueprint → Blueprint tự biết cần Companion
   nào (giữ đúng nguyên tắc `startCompanionWorkspace` 1 cửa đã khóa).
4. **1 Blueprint có thể cần nhiều Companion phối hợp** (vd Blueprint
   "Lập kế hoạch Marketing" cần Strategy Specialist → Writer → Designer)
   — Collaboration Matrix (#4) mô tả chính xác chuỗi này.
5. **Không có Companion nào là "để trống" cho có** — mỗi Companion phải
   ánh xạ được tới ít nhất 1 Blueprint Type thật hoặc nhu cầu Portal thật
   đã ghi nhận (không tạo Companion lý thuyết).

## 4. Exit Criteria — cách sprint này đáp ứng

| Exit Criteria | Đáp ứng ở đâu |
|---|---|
| 30 AI Companion được định nghĩa đầy đủ | `AI_COMPANION_REGISTRY.md` — đủ 30, mỗi Companion đủ 10 mục |
| Bao phủ 90% nhu cầu người dùng Portal | `AI_COMPANION_CAPABILITY_MAP.md` §3 — bảng đối chiếu nhu cầu thật (10 Golden Mission + nhu cầu Portal phổ biến khác) vs Companion phụ trách, tính % |
| Companion điều phối được toàn bộ Workforce | `AI_COMPANION_COLLABORATION.md` (chuỗi phối hợp theo Blueprint) + `AI_WORKFORCE_REGISTRY.md` (roster COO tra cứu) |
| Kiến trúc mở để bổ sung AI mới trong tương lai | `AI_WORKFORCE_REGISTRY.md` §Onboarding + tái dùng `OPEN_AI_WORKFORCE_PLATFORM.md` Registry — Companion #31 chỉ cần đăng ký, không sửa Companion COO/Workspace |

## 5. Việc KHÔNG làm ở Sprint này

- Không gọi AI thật cho bất kỳ Companion nào trong số 30 (kể cả 2
  Companion đã có Agent thật — Writer/Reviewer — vẫn giữ nguyên hành vi
  hiện tại, không đổi).
- Không tạo bảng dữ liệu/localStorage mới — `AI Companion Registry` ở
  đây là tài liệu thiết kế (danh mục tĩnh), chưa phải store runtime.
- Không tạo UI Marketplace cho Owner "thuê" Companion.
- Không đổi 7 Department, không đổi `AgentRole` union hiện có trong
  `agent-run-store.ts`.
