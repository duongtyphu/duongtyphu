# PHASE 3 EPIC 06 — Autonomous Recruitment Mode

> **Trạng thái**: Kiến trúc (design-only). Chế độ này **tách biệt** khỏi
> `AUTONOMOUS_AI_WORKFORCE.md` (đã có từ trước — chế độ Companion điều
> phối AI **đã có sẵn** trong Workforce làm Task hàng ngày). Autonomous
> Recruitment Mode chỉ nói về việc **tuyển AI mới** — phạm vi hẹp hơn
> nhiều, và mặc định **tắt**.

## 1. Mặc định: TẮT

`AI_RECRUITMENT_SYSTEM.md` §3 là hành vi mặc định — Owner luôn quyết
định Approve/Reject/Retry Sandbox cho từng Candidate. Autonomous
Recruitment Mode là 1 **tuỳ chọn nâng cao**, Owner phải tự bật, không
bao giờ bật sẵn.

## 2. Khi Owner bật — Companion ĐƯỢC PHÉP làm gì

| Quyền được cấp | Ý nghĩa |
|---|---|
| **Recruit** | Tự động chuyển Candidate đã Certified (`certifying` → đạt 6/6) sang `status: "approved"` mà không cần Owner bấm Approve cho từng trường hợp |
| **Assign Department** | Tự gắn Companion mới vào đúng 1 trong 7 Department đã khóa (không tạo Department mới) |
| **Assign Capability** | Tự gắn `relatedCapabilityId`/`missingCapability` đã match cho Companion mới |
| **Deploy** | Tự chuyển `AI_WORKFORCE_REGISTRY.md` roster entry từ `"agent-ready"` sang trạng thái sẵn sàng phục vụ Blueprint (không tự động nghĩa là gọi AI thật ngay — vẫn cần Sprint cài đặt Deployment Framework thật riêng, `OPEN_AI_WORKFORCE_PLATFORM.md` §7) |

Cả 4 quyền trên **chỉ áp dụng cho Candidate đã đi hết pipeline** ở
`AI_RECRUITMENT_SYSTEM.md` §1 (Discovery → Gap → Evaluation → Sandbox →
Training → Certification đạt 6/6) — Autonomous Mode **không rút gọn**
bất kỳ bước nào của pipeline, chỉ bỏ qua bước Owner tự tay bấm Approve
ở cuối.

## 3. Owner bật Autonomous Recruitment Mode — điều kiện

- Bật theo phạm vi có giới hạn (đề xuất): theo **Department cụ thể**
  (vd chỉ bật cho Technology & Automation), không nhất thiết bật toàn
  Workforce cùng lúc.
- Owner có thể tắt bất kỳ lúc nào — khi tắt, mọi Candidate đang ở
  `"proposed"` quay lại chờ Owner Approve thủ công.
- Mọi hành động tự động dưới Autonomous Mode đều ghi Growth Event (loại
  event mới, đề xuất: `AI_AUTONOMOUS_RECRUITMENT_ACTION`) để Owner luôn
  xem lại được lịch sử — tự động không có nghĩa là không minh bạch.

## 4. Companion TUYỆT ĐỐI KHÔNG được làm (kể cả khi Autonomous Mode bật)

| Cấm | Vì sao |
|---|---|
| **Delete AI** | Xoá 1 Companion khỏi Workforce là hành động không thể hoàn tác dễ dàng — luôn cần Owner quyết định tường minh, kể cả ở Retirement (`AI_RETIREMENT_SYSTEM.md`) |
| **Replace AI** | Thay thế 1 Companion đang hoạt động bằng 1 Companion khác thay đổi trực tiếp trải nghiệm Owner đang quen thuộc — không được tự động hoá |
| **Change Blueprint** | Blueprint đã khóa (`EPIC03_BLUEPRINT_LOCK.md`) — Autonomous Recruitment không có quyền đụng vào kiến trúc Blueprint dù đang tuyển AI phục vụ Blueprint đó |
| **Change Governance** | Governance Rules (Certification/Approval/ranh giới Companion) là luật chơi cố định — không AI/chế độ tự động nào được sửa luật chơi của chính nó |
| **Change Goal** | Goal luôn là của Owner (`Goal First` — `AI_TRAINING_ENGINE.md` §2) — Autonomous Recruitment không được diễn giải lại hay thay đổi Goal Owner đã đặt để "tiện" cho việc tuyển dụng |

Đây là ranh giới cứng, không có ngoại lệ theo cấu hình — khác với "tắt/
bật" ở §2-3 (những quyền được phép), 5 điều cấm ở đây **không thể được
Owner bật thêm bằng bất kỳ cấu hình nào**.

## 5. Quan hệ với `AUTONOMOUS_AI_WORKFORCE.md` đã có

| | `AUTONOMOUS_AI_WORKFORCE.md` (đã có) | `AI_AUTONOMOUS_RECRUITMENT.md` (tài liệu này) |
|---|---|---|
| Phạm vi | Vận hành Task hàng ngày của AI **đã có sẵn** trong Workforce | Tuyển AI **mới** vào Workforce |
| Companion vẫn là COO | ✅ | ✅ |
| Owner vẫn là người quyết định cuối (mặc định) | ✅ | ✅ |
| Có thể tự động hoá khi Owner bật | Task execution, Review routing | Recruit/Assign/Deploy (không bao giờ Delete/Replace/Change Blueprint/Governance/Goal) |

2 tài liệu không mâu thuẫn — 1 Companion có thể vừa vận hành theo
`AUTONOMOUS_AI_WORKFORCE.md`, vừa (nếu Owner bật riêng) tuyển dụng theo
tài liệu này; tắt/bật độc lập nhau.

## 6. Khi nào Autonomous Recruitment phải dừng ngay

- Owner tắt chế độ (thủ công, bất kỳ lúc nào).
- Bất kỳ Candidate nào fail Certification 2 lần liên tiếp trong chế độ
  tự động — dừng tự động cho Gap đó, chuyển về chờ Owner xem xét thủ
  công (tránh vòng lặp Training/Certification chạy vô hạn không giám sát).
- Growth Event Bus phát hiện bất thường số lượng Recruit trong thời gian
  ngắn (dấu hiệu lỗi logic hoặc Gap Analysis bị lỗi) — dừng và báo Owner.
