# PHASE 3 EPIC 06 — AI Recruitment System

> **Trạng thái**: Kiến trúc (design-only). Đây là tài liệu **tổng hợp
> pipeline** — nối toàn bộ 6 bước trước đó (`AI_DISCOVERY_ENGINE.md` →
> `AI_CAPABILITY_GAP_ANALYSIS.md` → `AI_SANDBOX.md` (Evaluation +
> Sandbox) → `AI_TRAINING_ENGINE.md` → `AI_CERTIFICATION_SYSTEM.md`)
> thành 1 quy trình đầu-cuối, và định nghĩa **Recruitment Proposal** +
> **Approval** (mục VII, VIII của brief).

## 1. Pipeline đầy đủ (một lần nữa, nhìn toàn cảnh)

```
Discovery Engine → AI Candidate Registry (status: discovered)
        │
        ▼ (chỉ khi có Capability Gap thật, không theo tên)
Capability Gap Analysis → gap-matched
        │
        ▼
AI Evaluation Engine → evaluating (lọc sơ bộ theo 10 tiêu chí)
        │
        ▼ (đạt ngưỡng)
AI Sandbox → sandbox (5 loại Test, đạt cả 5)
        │
        ▼
AI Training Engine → training (10 nội dung, Comprehension Check)
        │
        ▼
AI Certification System → certifying → certified (đạt 6/6 tiêu chí)
        │
        ▼
Recruitment Proposal (tài liệu này, mục 2) → proposed
        │
        ▼
Owner Approval (mục 3) → approved / rejected / sandbox-retry-requested
        │
   (chỉ khi approved)
        ▼
AI Companion Registry + AI Workforce Registry (Companion mới chính thức)
```

Không có bước nào được bỏ qua — `AI_CANDIDATE_REGISTRY.md` §4 đã quy
định mỗi bước chuyển trạng thái bắt buộc có bằng chứng tương ứng.

## 2. Recruitment Proposal

### 2.1 Schema

```ts
type RecruitmentProposal = {
  proposalId: string;
  candidateId: string;
  gapId: string;
  aiName: string;                  // tên nội bộ Candidate, không phải tên vendor
  department: DepartmentId;
  capability: string;               // = missingCapability của Gap đã đóng
  certificationRecordId: string;    // bắt buộc, decision: "certified"
  benchmarkSummary: {
    overallScore: string;           // vd "95/100" — tổng hợp từ BenchmarkRun + Certification criteriaScores
    costDelta: string;               // vd "-31%" so với Companion cùng Department hiện có
    speedDelta: string;               // vd "+22%"
  };
  recommendation: "recruit";          // Recruitment Proposal chỉ được tạo khi recommendation là "recruit" — nếu Companion không đề xuất tuyển, dừng ở Certification, không tạo Proposal
  createdAt: string;
};
```

### 2.2 Ví dụ minh hoạ (đúng ví dụ brief)

```
Companion Recommendation

AI: Research-X
Department: Research
Capability: Academic Research
Benchmark: 95/100
Cost: -31%
Speed: +22%
Recommendation: Recruit
```

Đây là **ví dụ minh hoạ định dạng**, không phải Candidate thật — không
có Candidate nào tên "Research-X" tồn tại trong hệ thống ở sprint này.

### 2.3 Nguyên tắc bắt buộc

- Proposal **chỉ được tạo sau khi Certification đạt 6/6** — không có
  Proposal nào được tạo từ Candidate chưa Certified.
- Proposal phải trỏ được ngược về đúng 1 `CapabilityGapEntry` — không
  có Proposal nào không giải quyết 1 Gap thật (đúng Product Principle).
- Companion **không tự thực thi** Proposal — Proposal chỉ là văn bản đề
  xuất, không có quyền tự động Deploy.

## 3. Approval

### 3.1 Ba lựa chọn của Owner (mặc định — không phải Autonomous Mode)

| Lựa chọn | Kết quả |
|---|---|
| **Approve** | Candidate chuyển `status: "approved"`; thêm 1 dòng vào `AI_COMPANION_REGISTRY.md` (Profile đầy đủ 10/15 mục theo `AI_TEAM_PROFILE_STANDARD.md`/`PROFILE.md` chuẩn) + 1 dòng vào `AI_WORKFORCE_REGISTRY.md` (`status: "agent-ready"`, chưa `"agent-live"` cho tới khi Deployment Framework thật chạy — `OPEN_AI_WORKFORCE_PLATFORM.md` §7) |
| **Reject** | Candidate chuyển `status: "rejected"`; Gap quay lại `status: "open"`; lịch sử giữ nguyên trong Candidate Registry để tránh đánh giá lại từ đầu nếu Candidate tương tự xuất hiện |
| **Retry Sandbox** | Candidate chuyển `status: "sandbox-retry-requested"` → quay lại `AI_SANDBOX.md`, chạy lại 5 loại Test — dùng khi Owner nghi ngờ kết quả Sandbox trước đó chưa đủ thuyết phục dù Certification đã đạt |

### 3.2 Nguyên tắc

- **Mặc định, Approval luôn thuộc Owner** — đây là hành vi chuẩn của
  toàn bộ EPIC 06 trừ khi Owner tự bật Autonomous Recruitment Mode
  (`AI_AUTONOMOUS_RECRUITMENT.md`), và ngay cả khi bật, quyết định
  Recruit vẫn nằm trong phạm vi Owner đã uỷ quyền trước, không phải
  Owner bị loại khỏi vòng quyết định.
- Companion **không được** tự chuyển Candidate sang `"approved"` trong
  chế độ mặc định — chỉ Owner thao tác này.
