# PHASE 4 EPIC 01 — AI Provider Layer

> **Trạng thái**: Code thật, đã chạy được (Mock Provider trong sandbox
> này). Đây là tài liệu vận hành cho `src/ai/providers/` — lớp hạ tầng
> để VO DUONG AI dùng nhiều AI Provider mà **không phải sửa Companion,
> Workforce, hay Blueprint Runtime**.

**Product Principle**: AI Provider chỉ là động cơ. Provider Manager là
lớp điều phối động cơ. Companion không phụ thuộc vào bất kỳ hãng AI
nào. VO DUONG AI phải luôn có thể thay đổi hoặc bổ sung Provider mà
không phải viết lại hệ thống.

---

## 1. Provider Architecture

```
Companion (Writer Agent / Reviewer Agent)
        │  gọi đúng 1 hàm, không biết Provider nào sẽ chạy
        ▼
providerManager.execute({ capability, taskType, input, context, preferredProvider, fallbackAllowed })
        │
        ▼
ModelRouter.selectAdapter(...)  ── chọn 1 ProviderAdapter
        │
        ▼
ProviderAdapter.execute(...)  ── nơi DUY NHẤT gọi vendor thật (hoặc Mock)
        │
        ▼
ProviderExecutionLog.recordExecution(...)  ── ghi lại mọi lần chạy
        │
        ▼
ProviderScore (view tính toán từ Log)  ── ModelRouter dùng để xếp hạng lần sau
```

Companion **không bao giờ** import trực tiếp `AnthropicProviderAdapter`/
`OpenAIProviderAdapter`/`GeminiProviderAdapter` — chỉ import
`providerManager` (`src/ai/providers/provider-manager.ts`). Đây là ranh
giới kiến trúc bắt buộc của EPIC 01.

## 2. Adapter Pattern — Provider Adapter Contract

Mọi Adapter (`src/ai/providers/*-provider-adapter.ts`) implement đúng 1
interface (`types.ts`):

```ts
interface ProviderAdapter {
  readonly providerId: string;
  readonly name: string;
  readonly supportedModels: string[];
  readonly supportedCapabilities: string[];
  isAvailable(): boolean;                              // kiểm tra ENV, không gọi mạng
  execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult>; // gọi thật (hoặc mock)
  healthCheck(): Promise<ProviderHealth>;                // không gọi mạng thật, chỉ xác nhận cấu hình
  estimateCost(request): ProviderCostEstimate;           // tính toán thuần, không gọi mạng
  benchmark(request): Promise<ProviderBenchmarkResult>;  // chạy execute() thật + tính điểm
}
```

4 Adapter đã có:

| Adapter | providerId | Vendor gọi thẳng | ENV var |
|---|---|---|---|
| `MockProviderAdapter` | `mock` | Không gọi mạng | — |
| `AnthropicProviderAdapter` | `anthropic` | `api.anthropic.com` | `ANTHROPIC_API_KEY` |
| `OpenAIProviderAdapter` | `openai` | `api.openai.com` | `OPENAI_API_KEY` |
| `GeminiProviderAdapter` | `gemini` | `generativelanguage.googleapis.com` | `GEMINI_API_KEY` |

Mỗi Adapter là **nơi duy nhất** trong toàn bộ codebase được phép gọi
thẳng vendor tương ứng của nó — không adapter nào gọi vendor của adapter
khác.

## 3. ProviderRegistry

`src/ai/providers/registry.ts` — registry server-side giữ **instance**
thật của 4 Adapter (khác với `src/lib/portal/foundation/provider-registry.ts`,
bản client-safe chỉ chứa metadata tĩnh để UI/tài liệu tham chiếu, không
có hàm `execute`).

```ts
providerRegistry.list();                 // tất cả Adapter đã đăng ký
providerRegistry.get("anthropic");       // 1 Adapter cụ thể
providerRegistry.listAvailable();        // chỉ Adapter đang isAvailable()
providerRegistry.listSupporting("writing.draft"); // Adapter hỗ trợ 1 capability
```

## 4. ProviderManager

`src/ai/providers/provider-manager.ts` — **cổng duy nhất** để gọi AI:

```ts
providerManager.execute({
  capability: "writing.draft",
  taskType: "writer",
  input: { prompt: "..." },
  context: "...",
  preferredProvider: "anthropic", // tuỳ chọn
  fallbackAllowed: true,           // mặc định true
});
```

Hành vi:
1. Hỏi `ModelRouter` chọn 1 Adapter.
2. Gọi `adapter.execute(...)`.
3. Ghi `ProviderExecutionLog` (thành công lẫn thất bại).
4. Trả về `ProviderExecuteResult` — **cấu trúc thống nhất** bất kể
   Adapter nào chạy (`raw`/`model`/`providerId`/`isMock`/`latencyMs`).
5. Nếu `execute()` ném lỗi, `ProviderManager` ghi log lỗi rồi **ném lại**
   lỗi đó — không nuốt lỗi âm thầm.

`providerManager.hasAvailableRealProvider()` — kiểm tra nhanh có Provider
thật nào (không phải Mock) đã cấu hình sẵn sàng chưa; Writer/Reviewer
Agent dùng hàm này để quyết định hiển thị mock UX-friendly (có gắn task
cụ thể) hay gọi `execute()` thật.

## 5. Model Router

`src/ai/providers/model-router.ts` — nơi DUY NHẤT quyết định "Provider
nào chạy". Thứ tự quyết định:

1. `preferredProvider` — dùng nếu Adapter đó hỗ trợ capability và khả dụng.
2. **Bảng ưu tiên theo nhóm capability** (`CAPABILITY_FAMILY_PREFERENCE`,
   khoá là phần trước dấu `.` của capability id):

   | Nhóm | Thứ tự ưu tiên |
   |---|---|
   | `writing` | Anthropic → OpenAI → Mock |
   | `coding` | OpenAI → Anthropic → Mock |
   | `research` | Gemini → Anthropic → Mock |
   | `review` | Anthropic → OpenAI → Mock |

3. Nếu nhóm capability chưa có trong bảng (capability mới) — xếp hạng
   mọi Adapter thật hỗ trợ capability đó theo `ProviderScore.overallScore`.
4. Nếu không có Adapter thật nào khả dụng:
   - `fallbackAllowed !== false` → chọn Mock.
   - `fallbackAllowed === false` → ném lỗi rõ ràng (dùng khi caller cố
     tình cần dữ liệu thật, không chấp nhận Mock — vd Benchmark thật).

## 6. Provider Score

`src/ai/providers/provider-score.ts` — view tính toán (không lưu trữ
riêng) từ `ProviderExecutionLog` + `adapter.estimateCost()`:

```ts
type ProviderScoreRecord = {
  providerId: string;
  totalRuns: number;
  quality: number;              // 0-100 — placeholder trung tính (50) cho tới khi nối QA/Certification thật
  speed: number;                 // 0-100 — tính thật từ latency trung bình
  cost: number;                   // 0-100 — tính thật từ estimateCost() (thang so sánh tương đối)
  reliability: number;              // 0-100 — tính thật từ tỷ lệ thành công
  blueprintCompliance: number;        // 0-100 — placeholder trung tính, chờ nối Certification (docs/AI_CERTIFICATION_SYSTEM.md)
  userApprovalRate: number;             // 0-100 — placeholder trung tính, chờ nối Output.approvalStatus thật
  overallScore: number;                   // tổng hợp có trọng số — dùng để ModelRouter xếp hạng
};
```

`quality`/`blueprintCompliance`/`userApprovalRate` cố tình để mức trung
tính (50) — **không bịa số liệu** khi chưa có dữ liệu QA/Certification/
Approval thật nối vào (thuộc EPIC 05/06, ngoài phạm vi EPIC 01).

## 7. Mock Mode

`MockProviderAdapter` (`mock-provider-adapter.ts`):
- `isAvailable()` luôn `true` — không cần ENV var nào.
- `execute()` không gọi mạng, trả về `ProviderExecuteResult` **đúng cấu
  trúc như Provider thật** (`raw`/`model`/`providerId`/`isMock: true`/
  `latencyMs`) — `raw` là JSON hợp lệ, không phải chuỗi lỗi.
- Không bao giờ throw chỉ vì thiếu API key — đó là lý do Mock tồn tại.

3 Adapter thật (`Anthropic`/`OpenAI`/`Gemini`):
- `isAvailable()` trả `false` nếu thiếu ENV var tương ứng — không throw.
- `healthCheck()` luôn trả về `{ available: false, reason: "Thiếu ... " }`
  khi thiếu key — không gọi mạng để kiểm tra (tránh tốn phí không cần
  thiết cho một health check).
- `execute()` **chỉ** throw khi bị gọi trực tiếp lúc thiếu key (trường
  hợp lỗi lập trình gọi sai) — trong luồng bình thường, `ModelRouter`
  không bao giờ chọn 1 Adapter đang `isAvailable() === false`.

## 8. Environment Variables

```
ANTHROPIC_API_KEY=     # tuỳ chọn — thiếu thì AnthropicProviderAdapter.isAvailable() = false
OPENAI_API_KEY=        # tuỳ chọn — thiếu thì OpenAIProviderAdapter.isAvailable() = false
GEMINI_API_KEY=        # tuỳ chọn — thiếu thì GeminiProviderAdapter.isAvailable() = false
```

Đã thêm vào `.env.example` (giá trị rỗng, template) và `.env.local`
(giá trị rỗng, không commit — `.env.local` đã nằm trong `.gitignore`).
Không key nào được hard-code trong code, không key nào bị log (Execution
Log chỉ ghi metadata: `providerId`/`capability`/`taskType`/`success`/
`latencyMs`/`error` — không bao giờ ghi `raw`/prompt/API key).

## 9. Benchmark Framework

`src/ai/providers/benchmark-utils.ts` (`runAdapterBenchmark`, dùng
chung bởi cả 4 Adapter qua `benchmark()`):

- Chạy 1 `ProviderExecuteRequest` thật qua chính `adapter.execute()`.
- Đo `latencyMs` thật.
- Tính điểm MVP: thành công → nền 70 + tối đa 30 điểm tốc độ (latency
  càng thấp điểm càng cao); thất bại → 0.
- Trả về `ProviderBenchmarkResult { providerId, capability, score,
  latencyMs, isMock, ranAt }`.

Đây là bản benchmark MVP đo **tốc độ + thành công**, không chấm chất
lượng nội dung (chất lượng nội dung do con người/Reviewer Agent chấm —
xem `docs/AI_SANDBOX.md` Phần I, `docs/AI_CERTIFICATION_SYSTEM.md`).

## 10. Cách thêm Provider mới (không sửa Companion/Workspace/Blueprint)

1. Tạo 1 file Adapter mới (vd `src/ai/providers/deepseek-provider-adapter.ts`)
   implement đúng `ProviderAdapter` interface.
2. Thêm 1 dòng `providerRegistry.register(new DeepSeekProviderAdapter())`
   trong `registry.ts`.
3. (Tuỳ chọn) Thêm `providerId` đó vào `CAPABILITY_FAMILY_PREFERENCE`
   trong `model-router.ts` nếu muốn nó được ưu tiên cho 1 nhóm capability.
4. Xong — `ProviderManager`/Companion/Workspace/Blueprint không cần sửa
   gì thêm; Provider mới tự động tham gia `ModelRouter`/`ProviderScore`/
   `ProviderExecutionLog`/`ProviderHealthCheck` qua Registry.

## 11. QA Checklist

- [ ] Adapter mới implement đủ 9 trường/hàm của `ProviderAdapter`.
- [ ] `isAvailable()` không gọi mạng, chỉ kiểm tra ENV.
- [ ] `execute()` không hard-code API key, đọc từ `process.env` tại
      thời điểm gọi.
- [ ] `healthCheck()` không gọi API thật tốn phí.
- [ ] Không log giá trị API key ở bất kỳ đâu (kể cả log lỗi).
- [ ] Đăng ký vào `providerRegistry` — không tạo Registry song song.
- [ ] Không Companion/Agent nào import Adapter trực tiếp — chỉ qua
      `providerManager`.
- [ ] `tsc --noEmit`, `npm run build`, `npm run lint`, `npx vitest run`
      đều sạch trước khi merge.

## 12. Giới hạn đã biết (Known Limitations)

1. `ProviderExecutionLog` là bộ nhớ trong tiến trình (process-local) —
   phù hợp môi trường dev/sandbox hiện tại; production nhiều instance/
   serverless cần lưu trữ bền vững hơn (ngoài phạm vi EPIC 01).
2. `quality`/`blueprintCompliance`/`userApprovalRate` trong `ProviderScore`
   là placeholder trung tính — chưa nối dữ liệu QA/Certification/Approval
   thật (EPIC 05/06).
3. Sandbox hiện tại không có `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`/
   `GEMINI_API_KEY` thật — mọi lời gọi thật sự đi qua `MockProviderAdapter`,
   đã kiểm chứng qua test suite + curl thật vào `/api/ai/workforce`.
4. `estimateCost()` là ước tính tham khảo (không phải giá niêm yết chính
   thức) — chỉ dùng để so sánh tương đối giữa các Provider.
