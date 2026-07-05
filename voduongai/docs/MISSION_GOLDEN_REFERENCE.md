# MISSION 01 — Golden Reference Mission

> Program: PRODUCTION BETA · Track: E — Production Goals · Goal: Landing
> Page Production · Mission: Research & Planning
>
> Mission 01 không chỉ tạo Deliverable. Mission 01 tạo Template. Sau
> Mission này, mọi Goal tương lai chỉ cần thay nội dung — Pipeline vẫn
> chạy nguyên vẹn. Engine sinh ra tài liệu này:
> `src/lib/portal/foundation/mission-runtime.ts`, verify bằng
> `mission-runtime.test.ts` (generic, dùng Mission "Podcast" không liên
> quan Landing Page) và `mission-01-golden-reference.test.ts` (thực thi
> thật trên Mission 01).

---

## 1. Mission Runtime Flow

Pipeline chung, generic — không có nhánh nào biết "Landing Page":

```
Goal → Analysis → Research → Planning → Review → QA → Owner Approval
     → Mission Package → Mission Template
```

Map vào state machine `MissionStatus` đã có ở `goal-runtime.ts`:

| Bước Pipeline | Hàm | MissionStatus |
|---|---|---|
| Owner bắt đầu (Goal → Analysis) | `linkMissionToSession()` | `not_started → in_progress` |
| Analysis / Research / Planning | `recordMissionAnalysis/Research`, `addMissionDecision` | vẫn `in_progress` |
| Review + QA pass | `recordMissionReview`, `recordMissionQA` (tự gọi `submitMissionForReview` khi QA pass + Review approved) | `in_progress → waiting_review` |
| Owner Approval | `recordMissionOwnerApproval({approved:true})` (tự gọi `completeGoalMission`) | `waiting_review → completed` |
| Mission Package | `buildMissionPackage(missionId)` | — |
| Mission Template | `extractMissionTemplate(missionId)` | — |

## 2. Mission Template (cấu trúc tái sử dụng)

```ts
type MissionTemplate = {
  templateId: string;
  sourceMissionId: string;
  pipeline: string[];          // 8 bước cố định ở trên
  missionChecklist: string[];  // Owner, Department, Companion, Input, Output, Deliverables, Definition of Done
  acceptanceChecklist: string[];
  qaChecklist: string[];
  reviewChecklist: string[];
  outputContract: string[];    // tên field của Mission Package
  createdAt: string;
};
```

Mọi field trong Template là **tên/cấu trúc chung**, không copy nguyên văn
nội dung Mission nguồn (Research finding/QA check/Review note cụ thể
KHÔNG được đưa vào Template — verify bằng test: serialize Template
không chứa "Landing Page"/"Podcast").

## 3. Mission Checklist (mọi Mission phải có)

- [ ] Owner
- [ ] Department
- [ ] Companion điều phối
- [ ] Input
- [ ] Output
- [ ] Deliverables
- [ ] Definition of Done

## 4. Mission Acceptance Checklist

Tính tự động qua `buildMissionPackage()` (không cảm tính):

- [ ] Có Owner / Department / Companion điều phối
- [ ] Có Input / Output / Deliverables / Definition of Done
- [ ] Research Report có Finding + Nguồn + Khuyến nghị
- [ ] Decision Log có ít nhất 1 quyết định kèm lý do
- [ ] QA Report không còn issue nghiêm trọng
- [ ] Owner đã Review (approved)

`accepted = true` chỉ khi TẤT CẢ mục trên đạt.

## 5. Mission QA Checklist (cấu trúc chung — nội dung check cụ thể do Mission tự định nghĩa)

- [ ] QA Report liệt kê từng check cụ thể theo Definition of Done của Mission
- [ ] Không còn issue mở trước khi submit review

## 6. Mission Review Checklist (cấu trúc chung)

- [ ] Reviewer được chỉ định rõ
- [ ] Reviewer ghi Note đánh giá
- [ ] Review phải Approved trước khi chuyển QA

## 7. Mission Output Contract

`MissionPackage` — mọi Mission chạy qua Mission Runtime đều sinh ra đúng
7 field này, không hơn không kém:

```ts
type MissionPackage = {
  missionId: string;
  researchReport: { findings: string[]; sources: string[]; recommendations: string[] };
  decisionLog: { decision: string; rationale: string; decidedAt: string }[];
  acceptanceReport: { checklist: { label: string; passed: boolean }[]; accepted: boolean };
  runtimeEvents: GrowthEvent[]; // lọc theo missionId từ Growth Event Bus thật
  qaReport: { checks: { label: string; passed: boolean }[]; issues: string[] };
  ownerReview: { approved: boolean; notes: string[]; approvedAt?: string };
  lessonsLearned: { lessons: string[] };
};
```

## 8. Mission Lessons Learned (từ Mission 01 thật)

1. Sandbox này không có Internet thật — Research Report cho Mission dạng
   "thị trường" phải ghi rõ nguồn là dữ liệu sản phẩm nội bộ (Workforce
   Registry, Goal Runtime, Product Principle đã công bố), không giả lập
   số liệu bên ngoài, để giữ tính trung thực.
2. Chạy Mission qua Mission Runtime (8 bước) tốn thêm công sức hơn ghi
   Output thô, nhưng đổi lại có Mission Template tái dùng ngay cho
   Mission 02-06 và mọi Goal sau — chi phí một lần, lợi ích nhân bản vô
   hạn.

---

## Mission Package — Mission 01 (Research & Planning, Landing Page Production)

Toàn bộ nội dung thật (Research Report/Decision Log/Review/QA Report/
Owner Review/Lessons Learned) được ghi thật qua Mission Runtime trong
`mission-01-golden-reference.test.ts` — test này CHÍNH LÀ Runtime Demo
tái hiện được (`npx vitest run
src/lib/portal/foundation/__tests__/mission-01-golden-reference.test.ts`).

Tóm tắt Research Report:

- **Finding chính**: VO DUONG AI có Workforce Registry (30 Companion/7
  Department) + Goal Runtime chạy thật — khác biệt cốt lõi so với AI
  Chatbot đơn lẻ.
- **Khuyến nghị**: Headline "Giao Goal cho một tổ chức AI"; CTA dẫn Owner
  bắt đầu Goal đầu tiên; dùng chính Mission 01 làm case study (kiểm chứng
  được qua Runtime Events/QA Report, không phải marketing claim suông).
- **Quyết định đã khoá** (Decision Log): (1) Headline theo hướng "Giao
  Goal cho một tổ chức AI"; (2) Dùng Mission 01 làm case study thay vì số
  liệu thị trường bên ngoài không kiểm chứng được.

**Owner Approval — căn cứ**: Founder đã chỉ đạo "APPROVED → LOCK →
IMPLEMENTATION" cho Mission 01 (Acceleration Mode) — áp dụng làm căn cứ
Owner Approval cho Mission Package Golden Reference này. Ghi nhận minh
bạch trong `ownerReview.notes`.

**Kết quả**: Mission 01 `status: completed`, `acceptanceReport.accepted:
true`, Mission Template đã sinh (`sourceMissionId` = Mission 01) — sẵn
sàng cho Mission 02 (Content Blueprint) nhân bản đúng Pipeline này.

## Acceptance (Cuối vòng phát triển — Program Board §5)

1. **Technical Acceptance** — `tsc --noEmit` / `npm run build` / `npm run
   lint` / `npx vitest run` đều pass (xem báo cáo Sprint đính kèm).
2. **Product Acceptance** — Mission 01 không chỉ hoàn thành Landing Page
   Production một mình: nó tạo ra Mission Runtime dùng lại được cho MỌI
   Mission tương lai.
3. **Runtime Demo** — `npx vitest run
   src/lib/portal/foundation/__tests__/mission-01-golden-reference.test.ts`.
4. **Owner Approval** — như ghi ở trên, căn cứ chỉ đạo Founder đã duyệt
   chuyển Mission 01 sang Implementation.
