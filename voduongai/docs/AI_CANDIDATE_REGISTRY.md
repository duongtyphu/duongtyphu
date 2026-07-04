# PHASE 3 EPIC 06 — AI Candidate Registry

> **Trạng thái**: Kiến trúc (design-only). Registry trung tâm theo dõi
> vòng đời của **ứng viên** AI — khác `AI Workforce Registry`
> (`AI_WORKFORCE_REGISTRY.md`, chỉ chứa AI **đã là Companion chính
> thức**). Một Candidate chỉ chuyển thành 1 dòng trong Workforce
> Registry sau khi được Owner Approve ở bước Recruitment (mục VIII).

## 1. Quan hệ với các Registry đã có

```
AI Discovery Engine ──ghi──► AI Candidate Registry (tài liệu này)
                                     │  candidate đi qua toàn bộ pipeline
                                     │  Gap Analysis → Evaluation → Sandbox → Training → Certification
                                     ▼
                          Recruitment Proposal → Owner Approval
                                     │  chỉ khi Approve
                                     ▼
                          AI Companion Registry + AI Workforce Registry
                          (AI_COMPANION_REGISTRY.md / AI_WORKFORCE_REGISTRY.md)
```

Không trộn 2 Registry — Candidate Registry chứa cả những ứng viên **bị
Reject** (giữ lại làm lịch sử, không xoá), Workforce Registry chỉ chứa
AI đã thật sự gia nhập.

## 2. Schema

```ts
type CandidateStatus =
  | "discovered"        // vừa qua Discovery Engine
  | "gap-matched"        // đã đối chiếu với Capability Gap, có Gap phù hợp
  | "evaluating"          // đang qua AI Evaluation Engine
  | "sandbox"              // đang chạy Sandbox
  | "training"              // đang qua Training Engine
  | "certifying"             // đang qua Certification
  | "certification-failed"   // trượt Certification — quay lại "training"
  | "proposed"                 // đã có Recruitment Proposal, chờ Owner
  | "approved"                   // Owner Approve — chuyển sang Workforce Registry
  | "rejected"                     // Owner Reject — dừng, giữ lại lịch sử
  | "sandbox-retry-requested";      // Owner chọn "Retry Sandbox" ở bước Approval

type CandidateRegistryEntry = {
  candidateId: string;             // trỏ về DiscoveredCandidate ban đầu
  status: CandidateStatus;
  matchedGapId?: string;            // trỏ về CapabilityGapEntry (AI_CAPABILITY_GAP_ANALYSIS.md) — bắt buộc có trước khi status rời "discovered"
  evaluationReportId?: string;      // trỏ về Evaluation Report (AI_EVALUATION_ENGINE, mô tả trong AI_CANDIDATE_REGISTRY §4)
  sandboxRunIds: string[];
  trainingRoundIds: string[];        // có thể >1 nếu phải Retrain trước khi Certify được
  certificationRecordId?: string;
  proposalId?: string;
  decidedBy?: "owner";               // luôn là Owner, không bao giờ "system"/"companion" — kể cả ở Autonomous Recruitment Mode (xem AI_AUTONOMOUS_RECRUITMENT.md — quyết định cuối cùng vẫn cần Owner đã bật chế độ, không phải Owner bị bỏ qua)
  decidedAt?: string;
  history: { status: CandidateStatus; at: string; note?: string }[]; // audit trail đầy đủ — không được xoá bất kỳ bước nào
};
```

**Nguyên tắc bất biến**: `history` không bao giờ bị ghi đè hay xoá — 1
Candidate bị Reject vẫn giữ nguyên toàn bộ lịch sử để nếu tương lai
Companion phát hiện Gap tương tự, không phải đánh giá lại từ đầu một
ứng viên đã từng bị từ chối mà không biết lý do trước đó.

## 3. Vòng đời (state machine) — khớp AI Lifecycle đã khóa

```
discovered → gap-matched → evaluating → sandbox → training → certifying
                                                        │            │
                                                        │      certification-failed
                                                        │            │
                                                        └──────◄─────┘ (quay lại training)
                                                        │
                                                  (certifying đạt)
                                                        ▼
                                                    proposed
                                                        │
                                          Owner: Approve / Reject / Retry Sandbox
                                              │            │            │
                                          approved      rejected   sandbox-retry-requested
                                              │                          │
                                     (vào Workforce Registry)      (quay lại sandbox)
```

Đây là cụ thể hoá của `AI Lifecycle` (`OPEN_AI_WORKFORCE_PLATFORM.md`
§8) ở mức **ứng viên trước khi certify**, phần `deployed → active →
retired` sau khi Approve tiếp tục dùng đúng Lifecycle đã định nghĩa ở
đó — không định nghĩa lại.

## 4. Không tự chuyển trạng thái mà không có bằng chứng

Mỗi mũi tên chuyển trạng thái ở §3 **bắt buộc phải có 1 record dẫn
chứng** tương ứng, không được nhảy cóc:

| Chuyển từ → sang | Bắt buộc có |
|---|---|
| `discovered` → `gap-matched` | `matchedGapId` trỏ tới 1 Gap có thật (`AI_CAPABILITY_GAP_ANALYSIS.md`) |
| `gap-matched` → `evaluating` | Bắt đầu chạy Evaluation (chưa cần report) |
| `evaluating` → `sandbox` | `evaluationReportId` đã có, đạt ngưỡng tối thiểu vào Sandbox |
| `sandbox` → `training` | ≥1 `sandboxRunIds` hoàn thành, đạt tiêu chí Sandbox (`AI_SANDBOX.md` §4) |
| `training` → `certifying` | ≥1 `trainingRoundIds` hoàn thành đủ 10 nội dung đào tạo (`AI_TRAINING_ENGINE.md` §2) |
| `certifying` → `proposed` | `certificationRecordId` với `decision: "certified"` |
| `proposed` → `approved`/`rejected` | Owner quyết định thật, ghi `decidedBy: "owner"` |

## 5. Việc KHÔNG làm ở Sprint này

- Không tạo bảng dữ liệu/localStorage nào — Registry ở đây là thiết kế.
- Không có Candidate thật nào được thêm vào Registry (không gọi
  Discovery Engine thật).
- Không tự động chuyển bất kỳ Candidate nào qua trạng thái `approved`.
