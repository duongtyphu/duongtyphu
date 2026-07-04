# PHASE 3 EPIC 06 — AI Retraining & Retirement System

> **Trạng thái**: Kiến trúc (design-only). Cụ thể hoá 2 bước cuối của
> vòng đời AI trong brief (mục XI "Retraining", mục XII "Retirement") —
> dùng đúng cơ chế đã khóa ở `AI_WORKFORCE_PERFORMANCE_REVIEW.md` §3-4
> (Ngưỡng hành động + Continuous Improvement) và `AI Lifecycle`
> (`OPEN_AI_WORKFORCE_PLATFORM.md` §8, stage `active → retired`) —
> không tạo state machine song song.

## 1. Retraining — khi nào

Theo đúng ngưỡng đã khóa ở `AI_WORKFORCE_PERFORMANCE_REVIEW.md` §3:
**"Performance dưới ngưỡng ở 1-2 chỉ số"** → Companion đưa AI trở lại
Training. Với AI đến từ pipeline EPIC 06, "trở lại Training" nghĩa cụ
thể là:

```
active (Production, AI_WORKFORCE_REGISTRY.md status: "agent-live")
   │  Performance Monitoring phát hiện dưới ngưỡng (AI_PERFORMANCE_MONITORING.md)
   ▼
Retraining ──► AI_TRAINING_ENGINE.md — tạo TrainingRound mới, CHỈ tập
               trung đúng topic liên quan chỉ số dưới ngưỡng (không đào
               tạo lại toàn bộ 10 topic nếu chỉ 1-2 chỉ số có vấn đề —
               tiết kiệm, và giữ nguyên phần đang hoạt động tốt)
   │
   ▼ (allTopicsPassed cho topic liên quan)
Certification (rút gọn) ──► AI_CERTIFICATION_SYSTEM.md §6 — chỉ chấm
                             lại đúng nhóm tiêu chí liên quan tới chỉ số
                             đã Retrain, không chấm lại toàn bộ 10 tiêu
                             chí nếu phần còn lại chưa có dấu hiệu suy giảm
   │
   ▼ (đạt)
Production (quay lại "active", tiếp tục Performance Monitoring)
```

Đây chính xác là chuỗi brief mô tả: **Retraining → Certification →
Production.**

## 2. Retirement — khi nào

Theo đúng ngưỡng đã khóa ở `AI_WORKFORCE_PERFORMANCE_REVIEW.md` §3:
**"Performance dưới ngưỡng liên tục, nhiều chỉ số, hoặc vi phạm
Governance Rule"** → sau khi đã thử Retraining (§1) mà vẫn không đạt:

```
Retraining (đã thử, vẫn dưới ngưỡng sau khi Certification lại)
   │
   ▼
Companion đề xuất Retirement (không tự quyết định)
   │
   ▼
Owner quyết định: giữ lại (thử thêm 1 vòng Retraining có giới hạn) / Retire
   │
   ▼ (Owner chọn Retire)
AI_WORKFORCE_REGISTRY.md roster entry → status: "retired"
AI Lifecycle (OPEN_AI_WORKFORCE_PLATFORM.md §8) → stage "retired" (terminal)
```

## 3. Retirement Proposal schema

```ts
type RetirementProposal = {
  proposalId: string;
  companionId: string;               // Companion đang Production, không phải Candidate
  performanceRecordRefs: string[];    // trỏ về PerformanceRecord chứng minh dưới ngưỡng liên tục — bắt buộc, không được đề xuất Retirement không có bằng chứng
  retrainingAttempts: number;          // số lần đã Retrain trước khi tới bước này — phải ≥1, không được đề xuất Retirement ngay lần đầu tiên dưới ngưỡng
  reason: string;
  proposedAt: string;
  ownerDecision?: "retire" | "keep-and-retry";
  decidedAt?: string;
};
```

**Điều kiện bắt buộc**: `retrainingAttempts >= 1` — Companion không
được đề xuất Retirement cho 1 AI mới lần đầu dưới ngưỡng; phải qua ít
nhất 1 vòng Retraining thất bại trước, đúng brief mục XI → XII (Retraining
trước, Retirement sau, không đảo ngược).

## 4. Retirement KHÔNG phải Delete

Quan trọng, nối với ranh giới đã khóa ở `AI_AUTONOMOUS_RECRUITMENT.md`
§4 ("Delete AI" là điều cấm tuyệt đối kể cả ở Autonomous Mode):

- `status: "retired"` là 1 trạng thái trong `AI Lifecycle`, **không xoá**
  Companion khỏi `AI_COMPANION_REGISTRY.md`/`AI_WORKFORCE_REGISTRY.md`.
- Companion đã Retired vẫn giữ nguyên toàn bộ lịch sử (Output đã tạo,
  Portfolio đã đóng góp, `PerformanceRecord` cũ) — chỉ ngừng nhận Task
  mới.
- Nếu Owner muốn "gỡ bỏ hoàn toàn" 1 Companion khỏi Registry (không chỉ
  Retire) — đó là hành động quản trị dữ liệu riêng, ngoài phạm vi Retirement
  Workflow, và **luôn** cần xác nhận tường minh riêng của Owner (không
  nằm trong quyền của bất kỳ chế độ tự động nào).

## 5. Ranh giới

1. Companion **không bao giờ tự Retire** một AI — chỉ đề xuất
   (`RetirementProposal`), giống hệt nguyên tắc "Companion chỉ đề xuất,
   Owner phê duyệt" xuyên suốt toàn bộ EPIC 03/05/06.
2. Autonomous Recruitment Mode (dù đang bật) **không có quyền Retire**
   — đúng danh sách cấm đã khóa (`AI_AUTONOMOUS_RECRUITMENT.md` §4:
   không Delete/Replace AI).
3. Không Retire một Companion chỉ vì có Candidate mới benchmark cao hơn
   — Retirement chỉ dựa trên **hiệu suất thực tế dưới ngưỡng của chính
   Companion đó**, không phải so sánh cạnh tranh với Candidate khác
   (tránh vi phạm Product Principle: không tuyển/thay AI "vì mới hơn").
