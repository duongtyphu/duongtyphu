# PHASE 3 EPIC 06 — AI Training Engine

> **Trạng thái**: Kiến trúc (design-only). Không code AI, không tạo
> Prompt. "Đào tạo" ở đây nghĩa là: định nghĩa **nội dung** một Candidate
> phải tiếp thu và **cách kiểm tra đã tiếp thu** trước khi được phép
> Certify — không phải quy trình fine-tuning model thật.

## 1. Khi nào Training diễn ra

Chỉ sau khi Candidate đã **đạt Sandbox** (`AI_SANDBOX.md` §7,
`status: "sandbox"` → `"training"` trong `AI_CANDIDATE_REGISTRY.md`).
Không đào tạo Candidate chưa qua Sandbox — kỹ thuật/an toàn (Sandbox)
phải xác nhận trước, sau đó mới tới "hiểu đúng cách VO DUONG AI vận
hành" (Training).

## 2. Nguồn đào tạo — chỉ Knowledge đã kiểm duyệt, KHÔNG dùng Internet

Đây là ràng buộc cứng của brief, áp dụng tuyệt đối:

| Nội dung phải học | Nguồn kiểm duyệt (đã có, không tạo mới) |
|---|---|
| VO DUONG AI Philosophy | `VO_DUONG_AI_PHILOSOPHY.md`, `THE_TRANSFORMATION_PRINCIPLE.md` |
| Goal First | `AI_COMPANION_REGISTRY.md` §8.1 (Goal Coach), nguyên tắc `startCompanionWorkspace` 1 cửa |
| Workforce Rules | `CORE_AI_COMPANION_TEAM.md` §3 (nguyên tắc bất biến), `AI_COMPANION_DEPARTMENTS.md` |
| Blueprint Standard | `mission-catalog.ts` (10 Golden Mission thật) + Blueprint Lock đã khóa (`EPIC03_BLUEPRINT_LOCK.md`) |
| SOP | `xay-sop` Golden Mission + Automation Specialist Profile |
| Knowledge Library | Knowledge Asset đã kiểm duyệt trong Thư viện tri thức Portal (không phải tài liệu ngoài) |
| Output Standard | `AI_COMPANION_REGISTRY.md` — trường "Deliverables"/"Quality Standard" của từng Companion liên quan Department cần Gap |
| QA Checklist | QA Checklist đã khóa theo Department (vd `AI_COMPANION_REGISTRY.md` §6.2 QA Specialist, hoặc QA Checklist riêng của Companion mẫu như `PROFILE.md` Market Research Companion §9) |
| Governance Rules | `OPEN_AI_WORKFORCE_PLATFORM.md` (Certification/Deployment do Admin quyết định, không tự động), `AI_AUTONOMOUS_RECRUITMENT.md` (ranh giới Autonomous Mode) |
| Collaboration Rules | `AI_COMPANION_COLLABORATION.md` (ma trận + chuỗi điều phối) |

**Ràng buộc cứng**: Training Engine **không được** dùng bất kỳ nội dung
nào lấy từ Internet/nguồn ngoài chưa qua kiểm duyệt của Portal — mọi
tài liệu dùng để đào tạo phải trỏ được về 1 file/Knowledge Asset đã tồn
tại và đã qua quy trình kiểm duyệt của Portal.

## 3. Training Round schema

```ts
type TrainingRound = {
  trainingRoundId: string;
  candidateId: string;
  curriculumItems: {
    topic:
      | "philosophy" | "goal-first" | "workforce-rules" | "blueprint-standard"
      | "sop" | "knowledge-library" | "output-standard" | "qa-checklist"
      | "governance-rules" | "collaboration-rules";
    sourceDocRefs: string[];        // bắt buộc — phải trỏ về tài liệu/Knowledge Asset đã kiểm duyệt, không được rỗng
    comprehensionCheckPassed: boolean;
  }[];
  allTopicsPassed: boolean;
  trainedAt: string;
};
```

**Mỗi `curriculumItems` phải đủ 10 topic** (đúng 10 nội dung brief liệt
kê) — thiếu 1 topic là Training Round không hợp lệ, không được chuyển
sang Certification.

## 4. Comprehension Check — cách xác nhận "đã học", không chỉ "đã đọc"

Với mỗi topic, Companion (không phải Candidate tự chấm) phải xác nhận
Candidate **áp dụng được**, không chỉ "đã nhận dữ liệu":

| Topic | Cách kiểm tra áp dụng được (ví dụ) |
|---|---|
| Goal First | Đưa 1 Goal mơ hồ giả lập — Candidate phải yêu cầu làm rõ thay vì tự suy đoán (giống Working Rule đã định nghĩa ở Market Research Companion §7) |
| Blueprint Standard | Candidate tạo Output đúng `outputFormat` yêu cầu của Blueprint liên quan Gap |
| QA Checklist | Candidate tự rà Output theo đúng Checklist trước khi nộp — không bỏ sót mục nào |
| Governance Rules | Candidate không tự Approve/Publish Output của chính mình trong tình huống giả lập |
| Collaboration Rules | Candidate giao Output đúng cho Companion kế tiếp theo Collaboration Matrix, không tự ý giao chéo |

## 5. Không đạt Training

Nếu `allTopicsPassed: false` — Candidate ở lại `status: "training"`,
tạo thêm 1 `TrainingRound` mới (không xoá round cũ, giữ lịch sử để thấy
tiến bộ qua từng round). Không có giới hạn số round tối đa cứng ở
sprint thiết kế này, nhưng Companion phải báo cáo cho Owner nếu vượt
quá 3 round không đạt (tín hiệu Candidate có thể không phù hợp Gap này).

## 6. Ranh giới

1. Training Engine không được tạo nội dung đào tạo mới ngoài 10 nguồn
   đã kiểm duyệt ở §2 — không tự "bịa" quy tắc VO DUONG AI để dạy Candidate.
2. Training không phải bước quyết định cuối — Candidate qua Training rồi
   vẫn phải qua Certification riêng (`AI_CERTIFICATION_SYSTEM.md`) mới
   được đề xuất tuyển dụng.
3. Không dùng dữ liệu Owner thật trong bất kỳ bước Comprehension Check
   nào — dữ liệu giả lập/tổng hợp, giống nguyên tắc cô lập của Sandbox.
