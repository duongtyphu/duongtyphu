# Implementation Sprint 001 — AI Service Registry Runtime

> Báo cáo triển khai ngắn. Toàn bộ hạng mục dưới đây đã là **code thật
> đang chạy** (không phải thiết kế) — được xây trong 3 sprint trước đó
> ("PHASE 4 EPIC 01", "Provider Wave 1", "AI Service Registry generalize")
> và đã verify lại đầy đủ trong Sprint này. Không có kiến trúc mới nào
> được mở rộng ở đây — Sprint này chỉ xác nhận runtime đã sống, đúng
> tinh thần "không báo hoàn thành bằng tài liệu".

## Đã triển khai gì

Tất cả nằm trong `src/ai/providers/`, `server-only`, không lộ ra client:

| Hạng mục brief yêu cầu | File | Trạng thái |
|---|---|---|
| `AIServiceAdapter` interface | `types.ts` | ✅ code thật, 9 field + 6 method bắt buộc |
| `AIServiceRegistry` | `registry.ts` (`aiServiceRegistry`, alias `providerRegistry`) | ✅ code thật, đăng ký đủ 10 service |
| `AIServiceManager` | `provider-manager.ts` (`aiServiceManager`, alias `providerManager`) | ✅ code thật — cổng gọi duy nhất |
| `MockServiceAdapter` | `mock-provider-adapter.ts` (`MockProviderAdapter`) | ✅ chạy thật, không cần key |
| Provider type system | `types.ts` (`AIServiceType`: llm/search/image/video/voice/automation/local_runtime/embedding/rag/code/browser/data/other) | ✅ |
| Capability mapping | mỗi Adapter khai báo `supportedCapabilities` + `getCapabilities()` | ✅ |
| Fallback logic | `model-router.ts` (`preferredProvider → fallbackProvider → bảng ưu tiên → Mock`) | ✅ |
| Execution log | `provider-execution-log.ts` | ✅ ghi mọi lần `execute()`, không log key/raw content |

**10 Provider Wave 1 đã register** (`registry.ts`): OpenAI, Claude
(Anthropic), Gemini, DeepSeek, Grok, Mistral, Ollama, Perplexity,
Cohere, Mock — verify bằng `providerRegistry.list()` trong test.

**Chỉ Mock chạy thật** trong sandbox này (đúng yêu cầu) — 9 Provider
còn lại đã có đủ:
- Adapter skeleton implement đúng `AIServiceAdapter` (`*-provider-adapter.ts`).
- `healthCheck()` — không gọi mạng, chỉ xác nhận ENV.
- `isAvailable()` — kiểm tra ENV var tương ứng.
- Trạng thái `unavailable` rõ ràng khi thiếu key — không throw, không crash.

## Runtime Flow (đã hoạt động thật, verify bằng curl)

```
AIServiceManager.execute({ capability, taskType, input, context, preferredProvider, fallbackProvider, fallbackAllowed, optimizeFor })
   → ModelRouter chọn Adapter
   → Adapter.execute() (Mock trong sandbox này)
   → ProviderExecutionLog.recordExecution()
   → trả ProviderExecuteResult { raw, model, providerId, isMock, latencyMs }
```

Đã curl thật vào `/api/ai/workforce` (dev server đang chạy) với cả
`agentRole: "companion-task"` (capability bất kỳ) và `agentRole: "writer"`
— cả hai đều trả kết quả Mock đúng cấu trúc, không lỗi, không crash.

Không module nào gọi thẳng OpenAI/Claude/Gemini/... — 9 Adapter thật là
nơi DUY NHẤT gọi vendor của chính nó, và bản thân chúng chỉ được gọi
qua `AIServiceManager.execute()`.

## Cách chạy test

```bash
npx vitest run src/ai/providers/__tests__/provider-layer.test.ts
```

17 test case, phủ đủ 8 yêu cầu bắt buộc của Sprint:

| # | Yêu cầu | Test |
|---|---|---|
| 1 | Registry có đủ 10 service | "ProviderRegistry đăng ký đúng 10 Provider Wave 1, đúng 4 Tier" |
| 2 | Mock service available | "MockProvider trả output đúng cấu trúc ProviderExecuteResult" |
| 3 | Provider thật unavailable khi thiếu key | "Tất cả 9 Adapter thật (Wave 1) không crash khi thiếu key" |
| 4 | AIServiceManager fallback sang Mock | "ProviderManager fallback sang Mock khi không có API key nào được cấu hình" |
| 5 | Routing theo capability | "ModelRouter chọn đúng Provider theo capability + thứ tự ưu tiên" (+3 biến thể) |
| 6 | execute trả output đúng format | "MockProvider trả output đúng cấu trúc ProviderExecuteResult" |
| 7 | execution log được ghi | "ProviderExecutionLog ghi đúng sự kiện sau khi ProviderManager.execute chạy" |
| 8 | Existing tests không bị phá | toàn bộ `npx vitest run` — 96/96 pass |

```bash
npx tsc --noEmit      # sạch
rm -rf .next && npm run build   # thành công
npm run lint          # sạch (5 warning <img> đã biết từ trước, không liên quan)
npx vitest run        # 96/96 pass
```

## Cách thêm API key thật

Thêm vào `.env.local` (không commit) đúng 1 trong 9 biến — Provider
tương ứng tự chuyển `isAvailable() → true`, `AIServiceManager` tự dùng
Provider đó thay vì Mock, không cần sửa code:

```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
DEEPSEEK_API_KEY=
GROK_API_KEY=
MISTRAL_API_KEY=
PERPLEXITY_API_KEY=
COHERE_API_KEY=
OLLAMA_BASE_URL=   # địa chỉ Ollama server local, KHÔNG phải API key
```

Không key nào hard-code trong code, không key nào bị log
(`ProviderExecutionLog` chỉ ghi `providerId`/`capability`/`taskType`/
`success`/`latencyMs`/`error`, không bao giờ ghi `raw`/prompt/key).

## Known Limitations

1. `ProviderExecutionLog` là bộ nhớ trong tiến trình (process-local) —
   mất khi server restart. Đủ cho dev/sandbox, chưa phù hợp production
   nhiều instance/serverless.
2. Sandbox hiện tại không có key thật cho 9/10 Provider — mọi request
   thật sự đi qua Mock, đã verify bằng test + curl, chưa verify với
   vendor thật.
3. `qualityProfile`/`speedProfile`/`reliabilityProfile` của 9 Provider
   thật là số tự khai báo (chưa đo thật) — chỉ dùng làm prior cho tới
   khi có đủ `ProviderExecutionLog` thật.

## Next Sprint recommendation

**Sprint 002 — nối Output của Companion (Wave 1 + Wave 2, 20 Companion)
vào Workspace Output/Review/Portfolio Store thật** (hiện `assignTask()`
chỉ trả `CompanionTaskResult` thô, chưa lưu vào Workspace Session) —
đây là mảnh runtime lớn nhất còn thiếu để 20 Companion đã Activate thật
sự tạo ra Output Owner dùng được, thay vì chỉ chứng minh được "đã nhận
Task".
