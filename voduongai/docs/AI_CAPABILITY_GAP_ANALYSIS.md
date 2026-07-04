# PHASE 3 EPIC 06 — AI Capability Gap Analysis

> **Trạng thái**: Kiến trúc (design-only). Đây là **cổng kiểm soát quan
> trọng nhất** của toàn bộ EPIC 06 — hiện thực hoá đúng Product
> Principle: *"Companion không tuyển AI vì AI mới hơn. Companion tuyển
> AI vì đội ngũ đang thiếu năng lực để giúp người dùng đạt Goal tốt
> hơn."* Không có Gap → không có Evaluation/Sandbox/Training/
> Certification/Proposal nào được phép bắt đầu.

## 1. Companion KHÔNG tuyển theo tên

Companion **không được phép** khởi động pipeline tuyển dụng
(`AI_CANDIDATE_REGISTRY.md` §3, từ `gap-matched` trở đi) chỉ vì:
- Một Candidate mới xuất hiện trong Discovery Engine.
- Một Candidate có tên/thương hiệu nổi tiếng.
- Owner "nghe nói" về 1 AI mới và hỏi Companion về nó.

Câu hỏi duy nhất hợp lệ để khởi động pipeline: **"Workforce hiện tại có
đang thiếu năng lực nào khiến Owner không đạt được Goal tốt hơn
không?"** — nếu câu trả lời là "không thiếu", Candidate vẫn nằm nguyên
ở `status: "discovered"` trong Candidate Registry, không tiến thêm.

## 2. Quy trình phân tích Gap (3 bước bắt buộc, đúng thứ tự)

### Bước 1 — Đọc Capability Matrix

Nguồn đọc: `AI_COMPANION_CAPABILITY_MAP.md` (coverage theo 10 Golden
Mission + 30 Department Responsibility) kết hợp `AI_CAPABILITY_MATRIX.md`
(chuẩn Capability Profile của Specialist đã có). Đây là "bức tranh
năng lực Owner cần", không phải danh sách Companion đang có.

### Bước 2 — Phân tích Workforce hiện tại

Nguồn đọc: `AI_WORKFORCE_REGISTRY.md` §3 (roster 30 Companion,
`status`). Đối chiếu từng Department: Companion nào đã `agent-live`,
Companion nào mới `designed` (chưa có Agent thật — vẫn tính là "có năng
lực trên giấy", không phải Gap, khác với "hoàn toàn không có Companion
nào phụ trách").

### Bước 3 — Xác định Capability Gap

`Gap` = một năng lực **cần thiết theo Capability Matrix** nhưng
**không có Companion nào trong Workforce Registry đảm nhiệm**, hoặc
Companion đảm nhiệm đã liên tục thất bại Performance Monitoring
(`AI_PERFORMANCE_MONITORING.md`) tới mức cần bổ sung thêm năng lực dự
phòng cho cùng 1 vai trò.

## 3. Schema Capability Gap

```ts
type CapabilityGapEntry = {
  gapId: string;
  department: DepartmentId;          // 1 trong 7 Department đã khóa
  missingCapability: string;         // tên năng lực còn thiếu, vd "Security Review", "System Architecture"
  reason: "no-companion-assigned" | "existing-companion-underperforming" | "new-blueprint-requires-it";
  evidenceRefs: string[];            // trỏ tới Capability Matrix entry / Performance Monitoring record chứng minh Gap là thật, KHÔNG được để trống
  identifiedAt: string;
  status: "open" | "matched-to-candidate" | "closed-by-recruitment" | "closed-no-longer-needed";
};
```

`evidenceRefs` bắt buộc — một Gap không có bằng chứng cụ thể (không
trỏ về được 1 dòng thật trong Capability Matrix hay Performance
Monitoring) **không được coi là Gap hợp lệ**, không được dùng để khởi
động tuyển dụng.

## 4. Ví dụ minh hoạ (đúng ví dụ trong brief)

**Department: Technology & Automation**

| Capability cần theo Blueprint hiện có | Companion đảm nhiệm | Trạng thái |
|---|---|---|
| Coding | Developer | ✅ Có Companion |
| QA | QA Specialist | ✅ Có Companion |
| Security Review | *(không có)* | ❌ **Gap** |
| System Architecture | *(không có)* | ❌ **Gap** |

→ 2 `CapabilityGapEntry` được tạo: `department: "technology-automation"`,
`missingCapability: "Security Review"` và `"System Architecture"`,
`reason: "no-companion-assigned"`.

Đây là **ví dụ minh hoạ cách phân tích**, không phải quyết định tuyển
dụng thật — 2 Gap này chỉ hợp lệ để **mở khoá** bước tiếp theo (đối
chiếu với AI Candidate Registry xem có Candidate nào khớp
`missingCapability`), không tự động tuyển ai.

## 5. Đối chiếu Gap ↔ Candidate

Sau khi có `CapabilityGapEntry` hợp lệ (`status: "open"`), Companion
mới được phép quét `AI Candidate Registry` tìm Candidate có
`capabilities` khớp `missingCapability`. Nếu tìm thấy:
- Candidate chuyển `status: "gap-matched"`, gắn `matchedGapId`.
- Gap chuyển `status: "matched-to-candidate"`.

Nếu **không** có Candidate nào khớp trong Registry hiện tại: Gap vẫn ở
`status: "open"` — Companion **có thể** kích hoạt thêm 1 vòng Discovery
Engine tập trung vào đúng năng lực còn thiếu (Discovery có mục tiêu, thay
vì Discovery ngẫu nhiên định kỳ ở §4 `AI_DISCOVERY_ENGINE.md`), nhưng
vẫn không được tự chọn đại 1 Candidate không thật sự khớp Gap.

## 6. Ranh giới (không được vi phạm)

1. **1 Gap chỉ được "đóng" bởi đúng 1 Recruitment thành công** (Candidate
   qua hết pipeline, Owner Approve) — không được đóng Gap bằng cách hạ
   thấp tiêu chuẩn Capability Matrix.
2. **Không tự tạo Gap giả để hợp thức hoá 1 Candidate Companion "muốn"
   tuyển** — mọi Gap phải bắt nguồn từ Bước 1-2 thật (đọc Capability
   Matrix + Workforce Registry), không phải suy diễn ngược từ Candidate.
3. Gap Analysis **không có quyền tự đóng Gap** khi thấy "không cần nữa"
   mà không có lý do (`status: "closed-no-longer-needed"` phải kèm lý do
   cụ thể, vd Blueprint liên quan đã bị loại bỏ — hiếm, cần xác nhận
   Admin/Owner).
