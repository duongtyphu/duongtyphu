# Companion Orchestration Experience™

EPIC 02 — Sprint 04. Tài liệu nền cho toàn bộ trải nghiệm "Companion đang thật sự làm việc
cùng người dùng" trên Portal.

## Vấn đề Sprint này giải quyết

Trước Sprint 04, Companion Orchestrator (Product Amendment 02) đã chọn được đúng Agent cho
đúng ngữ cảnh, nhưng kết quả hiện ra **tức thì** — toàn bộ kế hoạch và đội ngũ xuất hiện cùng
lúc, không có cảm giác Companion đang "làm" gì cả. Người dùng thấy một bảng dữ liệu, không
thấy một người bạn đang làm việc.

Sprint 04 không thêm nội dung học, không gọi AI thật, không xây chatbot — chỉ thêm **nhịp thời
gian và ngôn ngữ** vào đúng dữ liệu đã có, để trải nghiệm cảm thấy thật.

## Kiến trúc

```
User bấm hành động thật (Bắt đầu Mission / Thực hành / Phân tích dự án...)
        │
        ▼
pushCompanionIntent()  ── src/lib/portal/companion/orchestrator-intent.ts
        │  (event bus cùng tab, không AI/API)
        ▼
CompanionPresence.tsx ── useCompanionWorkSession(intent)
        │
        ▼
createWorkSession(input)  ── orchestrate() (Product Amendment 02, không đổi)
        │                    + companion-work-language.ts (câu nói)
        ▼
CompanionWorkSession  (OBSERVING)
        │
        ▼  advanceWorkSession() mỗi ~1.3s (use-companion-work-session.ts)
        ▼
THINKING → PLANNING → [INVITING_AGENT → WAITING_AGENT] × N specialists
        │
        ▼
SYNTHESIZING → READY  (resultSummary + nextStep)
        │
        ▼ (người dùng bấm "Mình đã thử rồi")
        ▼
celebrateWorkSession() → CELEBRATING
```

`orchestrate()` (từ Product Amendment 02) **không đổi** — nó vẫn là nguồn sự thật duy nhất cho
"Agent nào được chọn, message nào, next step nào". Sprint 04 chỉ bọc thêm một lớp state machine
(`work-session-engine.ts`) tiến từng bước một, thay vì đọc toàn bộ kết quả cùng lúc.

## 9 trạng thái Companion

Xem chi tiết ở `CompanionPresenceStandard.md`. Tóm tắt: `SILENT`/`OBSERVING` là mặc định khi
không có Work Session; 7 trạng thái còn lại (`THINKING` → `CELEBRATING`) chỉ tồn tại trong
vòng đời một Work Session.

## Nơi áp dụng (pilot)

| Module | Trigger | File |
|---|---|---|
| Academy | Nút "Bắt đầu Mission" trên `JourneyCard` | `src/features/academy/components/JourneyCard.tsx` |
| CKOS | Nút "Thực hành cùng Companion" / "Nhờ Companion gợi ý bước tiếp theo" | `src/features/knowledge/workspace/KnowledgeWorkspace.tsx` |
| Dự án & Cơ hội | Nút "Phân tích dự án" / "Lập kế hoạch áp dụng" | `src/components/portal/opportunities/OpportunityAgentActions.tsx` |

## Ranh giới rule-based (chưa AI thật)

- `orchestrate()` chọn Agent bằng từ khoá/mặc định theo module — không có mô hình ngôn ngữ nào
  được gọi.
- `companion-work-language.ts` là thư viện câu cố định, chọn theo trạng thái/agent — không sinh
  văn bản động bằng AI.
- `resultSummary` là một câu tổng hợp dựng sẵn từ tên Specialist + userGoal, không phải kết quả
  thật của Writer/Designer/SEO.

Xem mục "Cần làm khi tích hợp AI thật" trong Sprint 04 Review Report
(`docs/Academy/EPIC_02_Sprint_04_Review_Report.md`) để biết chính xác những điểm cần thay khi
nối AI thật vào sau này.
