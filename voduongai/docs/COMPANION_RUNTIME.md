# PHASE 4 EPIC 02 — Companion Runtime (Task Assignment, code thật)

> `src/lib/portal/foundation/companion-manager.ts` — `assignTask()`.
> Đây là bản triển khai thật của "Workforce Runtime" trong brief:
> Companion → Department → Companion → Provider Manager → Provider →
> Output → (Review → Portfolio, dùng lại luồng Workspace đã khóa khi
> Companion được nối vào 1 Blueprint cụ thể — xem §5 Known Limitations).

## 1. Luồng thật (đã chạy được, verify bằng curl + test)

```
UI/Owner chọn Department → chọn Companion (đọc Workforce Registry)
        │
        ▼
companion-manager.assignTask(employeeId, { prompt, context })
        │  kiểm tra Companion đang active/idle — không thì từ chối
        │  chuyển workingStatus -> "busy", emit COMPANION_TASK_ASSIGNED
        ▼
ai-provider.createWorkforceApiProvider().execute("companion-task", {
  capabilityId: companion.capability[0],
  prompt, context,
  preferredProvider: companion.providerPreference,
  fallbackProvider: companion.fallbackProvider,
})
        │  fetch("/api/ai/workforce")  — HTTP, client → server
        ▼
route.ts (agentRole === "companion-task")
        │
        ▼
providerManager.execute({ capability, taskType, input: { prompt }, preferredProvider, fallbackProvider })
        │  PHASE 4 EPIC 01 — ModelRouter chọn Adapter (preferredProvider → fallbackProvider →
        │  bảng ưu tiên nhóm capability → Mock)
        ▼
ProviderAdapter.execute(...)  — Mock trong sandbox này (không có API key thật)
        │
        ▼
ProviderExecuteResult { raw, model, providerId, isMock }
        │  quay lại qua route.ts -> fetch response -> ai-provider.ts
        ▼
companion-manager: chuyển workingStatus -> "active", emit COMPANION_TASK_COMPLETED
        │
        ▼
CompanionTaskResult { employeeId, position, department, output, model, providerId, isMock }
```

## 2. Companion KHÔNG chọn Provider — bằng chứng trong code

`companion-manager.ts` chỉ **truyền** `providerPreference`/
`fallbackProvider` (khai báo sẵn trong Workforce Registry) làm tham số
— không có `if/switch` nào trong `companion-manager.ts` quyết định
"dùng Anthropic hay OpenAI". Quyết định thật nằm 100% trong
`ModelRouter.selectAdapter()` (`src/ai/providers/model-router.ts`,
PHASE 4 EPIC 01) — verify bằng test
`workforce-activation.test.ts`: *"Companion Manager truyền đúng
providerPreference/fallbackProvider của từng Companion, không tự chọn
Provider"*.

## 3. `CompanionTaskResult` — Output trả về Runtime

```ts
type CompanionTaskResult = {
  employeeId: string;
  position: string;
  department: string;
  output: string;    // = ProviderExecuteResult.raw
  model: string;
  providerId: string;
  isMock: boolean;
};
```

Đây là **Output thô** trả về Runtime — chưa phải `OutputRecord` của
Workspace Session (Sprint B2, đã khóa). Kết nối `CompanionTaskResult`
vào `saveOutputVersion()`/Review/Portfolio thật cho cả 10 Companion là
việc của Sprint sau (Blueprint Production, PHASE 4 EPIC 03) — EPIC 02
chỉ chứng minh **Companion nhận được Task và Output quay về Runtime
đúng qua Provider Manager**, đúng Definition of Done, không mở rộng
thêm phạm vi.

## 4. Test đã verify (Mock Provider, không cần AI thật)

5 Companion nêu trong brief đều nhận Task thành công qua
`workforce-activation.test.ts`:

| Companion | employeeId | Kết quả |
|---|---|---|
| Market Research Companion | EMP-R001 | ✅ nhận Task, `isMock: true`, `providerId: "mock"` |
| Writer Companion | EMP-C001 | ✅ |
| Coding Companion | EMP-T001 | ✅ |
| Excel Companion | EMP-O001 | ✅ |
| Goal Coach Companion | EMP-G001 | ✅ |

Đồng thời verify bằng `curl` thật vào dev server đang chạy —
`/api/ai/workforce` với `agentRole: "companion-task"` trả về đúng
`ProviderExecuteResult` từ `MockProviderAdapter`.

## 5. Known Limitations

1. Chưa nối `assignTask()` vào UI Workspace (`WorkspaceMvp.tsx`) hay vào
   Output/Review/Portfolio Store thật — phạm vi EPIC 02 chỉ là Runtime
   nền (Registry + Task Assignment + Provider Manager), chưa phải trải
   nghiệm Owner hoàn chỉnh cho 10 Companion mới.
2. 8/10 Companion (trừ Writer/Reviewer đã có từ MVP) chưa có Agent
   server-side chuyên biệt (không tự dựng Prompt riêng theo đúng
   `buildPrompt()` pattern của Writer/Reviewer) — dùng chung đường
   `"companion-task"` generic, trả `raw` text thô. Viết Agent chuyên
   biệt cho từng Companion (dựng Prompt đúng vai trò, parse JSON đúng
   Output Contract) là việc của Sprint sau khi có nhu cầu dùng AI thật.
3. `performanceScore` chưa được cập nhật sau mỗi Task (vẫn giữ 50 trung
   tính) — nối vào Performance Monitoring thật (`AI_PERFORMANCE_MONITORING.md`)
   ngoài phạm vi EPIC 02.
