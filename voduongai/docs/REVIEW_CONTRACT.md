# Review Contract (Sprint 003 — code thật, đã có từ MVP)

> Brief yêu cầu Reviewer trả: `status, strengths, weaknesses,
> revisionSuggestions, qaScore, approvalRecommendation`. Contract này
> **đã tồn tại thật** từ AI Agent Integration MVP (`reviewer-agent.ts`) —
> Sprint 003 không đổi, chỉ xác nhận vẫn đúng khi chạy qua Runtime Flow
> đầy đủ (E2E test).

## Ánh xạ vào code thật

| Trường Contract (brief) | Field thật (`ReviewerAgentResult`, `reviewer-agent.ts`) |
|---|---|
| `status` | Suy ra từ `OutputRecord.approvalStatus` sau khi review (`"reviewed"` hoặc `"needs_revision"`) |
| `strengths` | `strengths: string[]` |
| `weaknesses` | `issues: string[]` |
| `revisionSuggestions` | `suggestedImprovements: string[]` |
| `qaScore` | Chưa có điểm số 0-100 — hiện tại là định tính qua `approvalRecommendation` |
| `approvalRecommendation` | `approvalRecommendation: "approve" \| "revise"` |

## Runtime thật

```
runReviewerAgentForOutput(sessionId, outputId, { qaChecklist, goal, expectedOutput? })
  → gọi aiServiceManager qua "reviewer" agentRole (route.ts)
  → OutputRecord.agentReview = ReviewerAgentResult
  → approvalStatus: "reviewed" nếu approve, "needs_revision" nếu revise
  → "reviewed" → emit USER_APPROVAL_REQUIRED (chờ Owner)
```

Reviewer **KHÔNG** tự approve — `approvalRecommendation` chỉ là gợi ý,
quyết định cuối luôn qua `approveOutput()` (Owner Approval Contract).

## Known Limitations

- `qaScore` số chưa tồn tại — cùng giới hạn như `OUTPUT_CONTRACT.md`.
- Reviewer hiện chỉ chạy cho Output do Writer Companion tạo (đã kiểm
  chứng qua route `"reviewer"`) — chưa có Agent Reviewer chuyên biệt cho
  từng loại Output khác (Excel/Slide/Code...), review generic qua cùng 1
  checklist.
