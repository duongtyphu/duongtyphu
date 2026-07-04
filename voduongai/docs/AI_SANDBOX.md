# PHASE 3 EPIC 06 — AI Evaluation Engine & AI Sandbox

> **Trạng thái**: Kiến trúc (design-only). Gộp 2 bước liền kề của
> pipeline (mục III "AI Evaluation Engine" và mục IV "AI Sandbox" của
> brief EPIC 06) vào 1 tài liệu vì chúng dùng chung 1 hạ tầng: **AI
> Benchmark Framework** đã thiết kế ở `OPEN_AI_WORKFORCE_PLATFORM.md`
> §5 — không định nghĩa lại Benchmark Framework, chỉ áp dụng cụ thể cho
> ứng viên tuyển dụng mới (khác với Benchmark cho Companion đã có sẵn).

## Phần I — AI Evaluation Engine

### 1. Mục đích

Trước khi 1 Candidate (đã `gap-matched`, xem
`AI_CAPABILITY_GAP_ANALYSIS.md`) được đưa vào Sandbox, phải được đánh
giá dữ liệu công khai/tự khai báo trước — lọc bớt Candidate rõ ràng
không phù hợp trước khi tốn công chạy Sandbox thật.

### 2. 10 tiêu chí đánh giá

| Tiêu chí | Cách đánh giá |
|---|---|
| Capability Match | Đối chiếu `capabilities` của Candidate với đúng `missingCapability` của Gap — không khớp = loại ngay |
| Output Quality | Dựa trên `BenchmarkRun.score` sơ bộ (chạy 1-2 `BenchmarkCase` đại diện, chưa phải bộ đầy đủ ở Sandbox) |
| Cost | So với chi phí trung bình các Companion cùng Department hiện có |
| Speed | So với tốc độ trung bình các Companion cùng Department hiện có |
| Reliability | Từ `DiscoveredCandidate.reliability` — nếu `"unknown"`, phải hạ điểm đánh giá, không giả định "chắc là ổn" |
| Context Window | Đủ để xử lý input dài nhất của Blueprint liên quan tới Gap hay không |
| Tool Support | Có hỗ trợ gọi Tool/MCP Server cần thiết cho Capability đó không |
| Multi-language | Hỗ trợ tiếng Việt (bắt buộc — Portal vận hành tiếng Việt là chính) |
| Long Task | Có xử lý ổn định cho Task nhiều bước (Blueprint nhiều Task) hay chỉ hợp với câu hỏi ngắn |
| Blueprint Compliance | Có khả năng tuân theo `outputFormat`/cấu trúc Output chuẩn của Blueprint hay không (sơ bộ, kiểm tra đầy đủ hơn ở Certification) |

### 3. Evaluation Report

```ts
type EvaluationReport = {
  reportId: string;
  candidateId: string;
  gapId: string;
  scores: Record<
    "capabilityMatch" | "outputQuality" | "cost" | "speed" | "reliability" |
    "contextWindow" | "toolSupport" | "multiLanguage" | "longTask" | "blueprintCompliance",
    number   // 0-5
  >;
  overallRecommendation: "proceed-to-sandbox" | "reject";
  reasonIfRejected?: string;
  evaluatedAt: string;
};
```

Ngưỡng tối thiểu để `proceed-to-sandbox` (đề xuất, quyết định cụ thể để
lại cho Sprint cài đặt): không tiêu chí nào ≤1/5, và điểm trung bình
≥3/5. Không đạt → Candidate quay lại `status: "gap-matched"` (không tiến
tiếp), Gap vẫn `"open"`, Companion có thể tìm Candidate khác.

---

## Phần II — AI Sandbox

### 4. Nguyên tắc cốt lõi

**AI mới KHÔNG được vào Production khi chưa qua Sandbox.** Sandbox là
môi trường cô lập hoàn toàn khỏi dữ liệu/Workspace thật của Owner —
không Candidate nào được chạy trên Goal/Output thật của Owner trong giai
đoạn này.

### 5. 5 loại Test bắt buộc

| Test | Nội dung | Dữ liệu dùng |
|---|---|---|
| Test Blueprint | Chạy thử đúng 1 Blueprint Type thuộc Gap đang cần lấp (vd nếu Gap là "Security Review" thuộc Technology Department, dùng 1 Blueprint kỹ thuật có sẵn) | `BenchmarkCase` tổng hợp/giả lập, KHÔNG phải Goal thật của Owner |
| Test Workflow | Chạy đúng chuỗi các bước `EXECUTION_TIMELINE` đã khóa (`execution-orchestrator.ts`) để xác nhận Candidate tương thích với quy trình 7 bước, không phá luồng | Timeline giả lập trong môi trường cô lập |
| Test Collaboration | Đặt Candidate vào 1 chuỗi Collaboration giả lập với 1-2 Companion khác liền kề (theo `AI_COMPANION_COLLABORATION.md`) để kiểm tra khả năng nhận/giao Output đúng định dạng | Dữ liệu giả lập, không chạm Workspace thật |
| Test QA | Cho QA Specialist (Companion đã có, không phải Candidate) rà soát Output của Candidate theo đúng QA Checklist Department liên quan | QA Checklist đã khóa (`AI_COMPANION_REGISTRY.md`) |
| Test Runtime | Kiểm tra ổn định kỹ thuật: thời gian phản hồi, tỷ lệ lỗi, khả năng phục hồi khi input bất thường | Test case biên (input rỗng, input quá dài, input sai định dạng) |

### 6. Companion tự chạy Benchmark trong Sandbox

Companion (không phải Owner, không phải Candidate tự đánh giá chính
mình) là bên chủ trì chạy 5 loại Test ở §5, dùng lại đúng cơ chế
`BenchmarkRun` đã thiết kế ở `OPEN_AI_WORKFORCE_PLATFORM.md` §5 — mỗi
Test tương ứng 1 hoặc nhiều `BenchmarkRun` gắn `capabilityId` của Gap
đang xét.

```ts
type SandboxRun = {
  sandboxRunId: string;
  candidateId: string;
  testsRun: ("blueprint" | "workflow" | "collaboration" | "qa" | "runtime")[];
  benchmarkRunIds: string[];       // trỏ về BenchmarkRun thật (OPEN_AI_WORKFORCE_PLATFORM.md §5)
  passedAllTests: boolean;
  failureNotes?: string[];
  runAt: string;
};
```

### 7. Tiêu chí đạt Sandbox

Phải đạt **cả 5 loại Test**, không được "trung bình cộng" (vd đạt 4/5
Test nhưng Test Runtime thất bại nặng vẫn KHÔNG được coi là đạt — an
toàn kỹ thuật không được đánh đổi bằng điểm trung bình cao ở phần khác).

### 8. Không đạt Sandbox

Candidate quay lại `status: "evaluating"` hoặc bị đóng hẳn (Reject) tuỳ
mức độ — không tự động thử lại vô hạn; số lần retry tối đa để lại cho
Owner/Admin cấu hình khi Sprint cài đặt tới.

## 9. Việc KHÔNG làm ở Sprint này

- Không chạy Sandbox thật, không có `SandboxRun`/`EvaluationReport` thật
  nào được tạo.
- Không kết nối Candidate với dữ liệu Workspace thật của bất kỳ Owner
  nào — kể cả trong thiết kế, nguyên tắc cô lập phải được nêu rõ để
  Sprint cài đặt không vô tình vi phạm.
