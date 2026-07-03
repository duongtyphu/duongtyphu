# EPIC 02 — Sprint 04 Review Report
## Companion Orchestration Experience™

Đánh giá dựa trên trạng thái thật: `tsc --noEmit` sạch, `npm run lint` 0 lỗi (chỉ 5 warning
`<img>` tồn tại từ trước, ngoài phạm vi Sprint), `npx vitest run` 45/45 pass (15 test mới:
9 orchestrator + 6 work-session-engine), `npm run build` thành công.

## 1. Component đã tạo/refactor

**Mới:**
- `src/companion/work-session/work-session.types.ts` — `CompanionStatus` (9 trạng thái),
  `CompanionWorkStep`, `CompanionMessage`, `CompanionWorkSession`.
- `src/companion/work-session/companion-work-language.ts` — thư viện câu nói theo trạng thái.
- `src/companion/work-session/work-session-engine.ts` — `createWorkSession()`,
  `advanceWorkSession()` (pure, 1 tick/lần gọi), `celebrateWorkSession()`.
- `src/companion/work-session/use-companion-work-session.ts` — hook client, tick ~1.3s/bước.
- `src/companion/work-session/__tests__/work-session-engine.test.ts` — 6 test.
- `src/components/portal/companion/CompanionWorkSessionPanel.tsx` — Work Session UI (Nhiệm vụ 02).

**Refactor có kiểm soát (không viết lại từ đầu):**
- `CompanionPresence.tsx` — thay lời gọi `orchestrate()` tĩnh bằng `useCompanionWorkSession(intent)`;
  thêm `workSessionMoodKey` ánh xạ 9 trạng thái Work Session vào 6 mood key **đã có sẵn**
  (`idle`/`thinking`/`encouraging`/`celebrating`) — không đổi hệ visual Living Core/mood cũ.
- `CompanionQuickPanel.tsx` — thay khối orchestration tĩnh cũ bằng `<CompanionWorkSessionPanel>`,
  nhận `workSession`/`onCelebrate` thay vì `orchestrationPlan`.
- `src/lib/portal/companion/route-context.ts` — cập nhật đúng 8 câu nudge theo Nhiệm vụ 08 (giữ
  nguyên cơ chế 1 lần/session/route đã có từ Sprint trước).

**Không đổi** (đúng yêu cầu "không phá nền tảng đã có"): `companion-orchestrator.ts`,
`orchestration-rules.ts`, `agent-registry.ts`, `module-agent-map.ts`, toàn bộ hệ Living
Core/mood/proactive-thought/story-matching có từ trước.

## 2. Route đã tích hợp (trigger thật, không đổi từ Sprint A.2)

| Module | Trigger | File |
|---|---|---|
| Academy | "Bắt đầu Mission" | `JourneyCard.tsx` |
| CKOS | "Thực hành cùng Companion", "Nhờ Companion gợi ý bước tiếp theo" | `KnowledgeWorkspace.tsx` |
| Dự án & Cơ hội | "Phân tích dự án", "Lập kế hoạch áp dụng" | `OpportunityAgentActions.tsx` |

Cả 3 module dùng chung `pushCompanionIntent()` → `CompanionPresence` tự mở Quick Panel và bắt
đầu Work Session — không cần sửa lại các nút bấm đã build ở Sprint A.2.

## 3. Mission pilot (Academy — "Tạo Landing Page") hoạt động thế nào

Bấm "Bắt đầu Mission" trên một Journey Card có tiêu đề chứa "Landing Page" →
`orchestration-rules.ts` khớp rule `academy-mission-landing-page` → 4 Specialist được chọn
(Mission Planner, Writer, Summary, Reviewer — xem ghi chú ở mục 6) → Work Session chạy qua
đúng trình tự: `OBSERVING → THINKING → PLANNING → (INVITING_AGENT → WAITING_AGENT) × 4 →
SYNTHESIZING → READY`. Mỗi bước có câu nói riêng, nhắc tên Specialist thật, không nhảy thẳng
tới kết quả. Test `work-session-engine.test.ts` xác nhận thứ tự này bằng chính ví dụ "Tạo
Landing Page" trong Amendment.

## 4. CKOS flow hoạt động thế nào

Nhẹ hơn Academy: rule `ckos-practice`/`ckos-next-action` chỉ chọn 2 Specialist
(Prompt Agent + Reviewer, hoặc Summary + Research) — Work Session chạy qua đúng cùng state
machine nhưng ngắn hơn (ít bước mời hơn). Companion Message trích dẫn đúng tên Seed thật.

## 5. Opportunities flow hoạt động thế nào

"Phân tích dự án" và "Lập kế hoạch áp dụng" trên **cùng một dự án** chọn 2 đội Specialist khác
nhau (Project/Risk Analyst vs. Strategy/Action Planner) — xác nhận Companion Message đổi theo
đúng ý định (`userGoal`), không phải chỉ đổi theo route.

## 6. Những điểm còn mock/rule-based (minh bạch, không che giấu)

- `orchestrate()` chọn Agent bằng khớp từ khoá tĩnh hoặc mặc định 2 Agent đầu module — không có
  hiểu ngôn ngữ tự nhiên thật.
- Rule `academy-mission-landing-page` hiện chọn Specialist bằng ID có sẵn trong Registry
  (`mission-planner`, `ckos-writer`, `ckos-summary`, `ckos-reviewer`) làm đại diện tạm cho
  "Writer/Designer/SEO/Reviewer" nêu trong ví dụ Amendment — Registry Sprint 02 chưa có Agent
  tên "Designer"/"SEO" riêng cho Academy (chỉ có ở CKOS/Opportunities theo vai trò gần đúng).
  Câu Companion Message vẫn giữ đúng chữ "Writer, Designer và SEO" như ví dụ gốc để không phá
  vỡ trải nghiệm, nhưng nội bộ đang dùng Agent gần nghĩa nhất. Đây là điểm cần rà soát nếu
  Sprint sau cần Agent Registry chính xác 1-1 với tên hiển thị.
- `resultSummary`/`companionMessages` là câu dựng sẵn (template + nội suy tên thật), không phải
  kết quả suy luận thật từ LLM.
- `WAITING_AGENT` chỉ là một tick thời gian cố định (~1.3s), không phản ánh khối lượng công việc
  thật của Specialist.
- Nhịp tick (1.3s/bước) là hằng số cố định, chưa điều chỉnh theo độ dài Mission thật.

## 7. Cần làm khi tích hợp AI thật (checklist cho Sprint sau)

1. Thay các hàm trong `companion-work-language.ts` bằng lời gọi LLM có ràng buộc giọng văn theo
   `CompanionWorkLanguage.md` (system prompt nên trích dẫn tài liệu này trực tiếp).
2. Thay `WAITING_AGENT` cố định bằng trạng thái chờ thật (poll/stream kết quả từ agent thật),
   giữ nguyên UI (`CompanionWorkSessionPanel`) — chỉ đổi nguồn dữ liệu, không đổi state machine.
3. Rà soát lại Agent Registry Academy để có Agent "Writer/Designer/SEO" đúng tên riêng thay vì
   dùng Agent CKOS làm đại diện tạm (xem mục 6).
4. `resultSummary` cần thay bằng tổng hợp thật từ kết quả từng Agent, không phải câu template.
5. Cân nhắc lưu `CompanionWorkSession` vào localStorage/DB để phục hồi khi người dùng rời trang
   giữa chừng — hiện tại session mất khi đổi route (thiết kế có chủ đích ở Sprint 04, xem
   `CompanionPresence.tsx` — session bị clear trong effect reset theo `pathname`).

## Đối chiếu "Không được làm"

| Điều cấm | Vi phạm? |
|---|---|
| Gọi AI API | Không |
| Chatbot thật | Không |
| Companion Studio | Không |
| Trang Agent riêng | Không |
| User tự chọn Agent | Không — `orchestrate()` luôn là nguồn chọn duy nhất |
| Thêm quá nhiều Agent mới | Không — dùng lại Agent Registry Sprint 02 (Product Amendment 02) |
| Phá CKOS/Academy/Mission data/route/sidebar | Không — chỉ thêm nút/component, không đổi component/data hiện có |
| Course/Lesson cũ | Không |

## Companion First Rule — đối chiếu

Mọi Specialist chỉ xuất hiện bên trong `CompanionWorkSessionPanel`, luôn đi kèm câu giới thiệu
của Companion ("mình sẽ mời...") — không Agent nào render độc lập hay "trả lời trực tiếp".
`resultSummary`/`nextStep` luôn là lời của Companion, không phải lời của Agent.

## Kết luận

Sprint 04 đạt đủ Definition of Done: CompanionPresence 2.0 (ánh xạ 9 trạng thái vào hệ mood có
sẵn), Work Session UI, Team Experience đúng tinh thần "được mời", pilot Academy/CKOS/Opportunities
hoạt động qua cùng một engine dùng chung, không phá nền tảng Sprint trước. Giới hạn rule-based
được ghi nhận minh bạch ở mục 6-7 làm nền cho Sprint tích hợp AI thật sau này.
