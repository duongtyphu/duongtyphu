# PHASE 4 EPIC 01 — AI Provider Layer (Provider Wave 1: 10 Provider, 4 Tier)

> **Trạng thái**: Code thật, đã chạy được (Mock Provider trong sandbox
> này — chưa có key thật cho 9 Provider còn lại). Đây là tài liệu vận
> hành cho `src/ai/providers/` — lớp hạ tầng để VO DUONG AI dùng nhiều
> AI Provider mà **không phải sửa Companion, Workforce, hay Blueprint
> Runtime**. Provider Wave 1 gồm đúng 10 Provider theo 4 Tier: **Core**
> (OpenAI/Claude/Gemini/DeepSeek), **Recommended** (Grok/Mistral/Ollama),
> **Specialized** (Perplexity/Cohere), **Development** (Mock).

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
  readonly tier: "core" | "recommended" | "specialized" | "development";
  readonly supportedModels: string[];
  readonly supportedCapabilities: string[];
  readonly modelRegistry: { modelId: string; contextWindow: number; description: string }[];
  readonly costProfile: { inputPer1kTokens: number; outputPer1kTokens: number; currency: "USD" };
  readonly benchmarkProfile: { reportedQuality: number; reportedSpeed: number; reportedReliability: number }; // tự khai báo, không phải điểm đo thật
  readonly configuration: { envVar: string; optionalEnvVar?: string };
  readonly securityPolicy: { keyStorage: "server-only-env"; loggingPolicy: "never-log-key-or-raw-content"; dataRetentionNote: string };
  isAvailable(): boolean;                              // kiểm tra ENV, không gọi mạng
  execute(request: ProviderExecuteRequest): Promise<ProviderExecuteResult>; // gọi thật (hoặc mock)
  healthCheck(): Promise<ProviderHealth>;                // không gọi mạng thật, chỉ xác nhận cấu hình
  estimateCost(request): ProviderCostEstimate;           // tính toán thuần từ costProfile, không gọi mạng
  benchmark(request): Promise<ProviderBenchmarkResult>;  // chạy execute() thật + tính điểm
}
```

## Provider Wave 1 — 10 Provider chính thức, theo 4 Tier

| Tier | Adapter | providerId | Vendor gọi thẳng | Configuration |
|---|---|---|---|---|
| **Core** | `OpenAIProviderAdapter` | `openai` | `api.openai.com` | `OPENAI_API_KEY` |
| **Core** | `AnthropicProviderAdapter` | `anthropic` | `api.anthropic.com` | `ANTHROPIC_API_KEY` |
| **Core** | `GeminiProviderAdapter` | `gemini` | `generativelanguage.googleapis.com` | `GEMINI_API_KEY` |
| **Core** | `DeepSeekProviderAdapter` | `deepseek` | `api.deepseek.com` | `DEEPSEEK_API_KEY` |
| **Recommended** | `GrokProviderAdapter` | `grok` | `api.x.ai` | `GROK_API_KEY` |
| **Recommended** | `MistralProviderAdapter` | `mistral` | `api.mistral.ai` | `MISTRAL_API_KEY` |
| **Recommended** | `OllamaProviderAdapter` | `ollama` | Local (`OLLAMA_BASE_URL`) | `OLLAMA_BASE_URL` (không phải API key) |
| **Specialized** | `PerplexityProviderAdapter` | `perplexity` | `api.perplexity.ai` | `PERPLEXITY_API_KEY` |
| **Specialized** | `CohereProviderAdapter` | `cohere` | `api.cohere.ai` | `COHERE_API_KEY` |
| **Development** | `MockProviderAdapter` | `mock` | Không gọi mạng | — |

Mỗi Adapter là **nơi duy nhất** trong toàn bộ codebase được phép gọi
thẳng vendor tương ứng của nó — không adapter nào gọi vendor của adapter
khác. Ollama khác biệt: chạy **local** trên hạ tầng Owner (không phải
SaaS tính phí theo token) — `costProfile` = 0, `configuration.envVar`
là địa chỉ server local thay vì API key, nhưng vẫn tuân thủ đúng
`ProviderAdapter` contract như 9 Provider còn lại.

## 3. ProviderRegistry (theo Tier)

`src/ai/providers/registry.ts` — registry server-side giữ **instance**
thật của 10 Adapter (khác với `src/lib/portal/foundation/provider-registry.ts`,
bản client-safe chỉ chứa metadata tĩnh để UI/tài liệu tham chiếu, không
có hàm `execute`).

```ts
providerRegistry.list();                 // tất cả Adapter đã đăng ký
providerRegistry.get("anthropic");       // 1 Adapter cụ thể
providerRegistry.listAvailable();        // chỉ Adapter đang isAvailable()
providerRegistry.listSupporting("writing.draft"); // Adapter hỗ trợ 1 capability
providerRegistry.listByTier("core");      // Adapter theo Tier — "core"/"recommended"/"specialized"/"development"
```

## 4. ProviderManager

`src/ai/providers/provider-manager.ts` — **cổng duy nhất** để gọi AI:

```ts
providerManager.execute({
  capability: "writing.draft",
  taskType: "writer",
  input: { prompt: "..." },
  context: "...",
  preferredProvider: "anthropic", // tuỳ chọn — "Routing"
  fallbackProvider: "openai",      // tuỳ chọn — "Fallback" tường minh (thử ngay sau preferredProvider)
  fallbackAllowed: true,           // mặc định true — "Fallback" xuống Mock khi không còn lựa chọn nào khác
  optimizeFor: "quality",           // "quality" (mặc định) | "cost" | "speed" — "Cost Optimization"/"Benchmark Selection"
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

`providerManager.matchProvidersForCapability(capability)` — "Capability
Matching": trả về mọi Adapter đã đăng ký khai báo hỗ trợ 1 capability
(kể cả chưa khả dụng) — dùng khi cần biết "ai CÓ THỂ làm việc này"
trước khi chạy Task thật.

## 5. Model Router

`src/ai/providers/model-router.ts` — nơi DUY NHẤT quyết định "Provider
nào chạy" (**Routing**). Thứ tự quyết định:

1. `preferredProvider` — dùng nếu Adapter đó hỗ trợ capability và khả dụng.
2. `fallbackProvider` — Provider thứ 2 chỉ định tường minh, thử ngay sau
   `preferredProvider` (**Fallback**) — vd 1 Companion khai báo riêng
   "Provider Preference → Fallback Provider" (`workforce-registry.ts`).
3. Nếu `optimizeFor` không đặt hoặc `"quality"` — **Bảng ưu tiên theo
   nhóm capability** (`CAPABILITY_FAMILY_PREFERENCE`, khoá là phần
   trước dấu `.` của capability id):

   | Nhóm | Thứ tự ưu tiên |
   |---|---|
   | `writing` | Anthropic → OpenAI → Mock |
   | `coding` | OpenAI → Anthropic → DeepSeek → Mock |
   | `research` | Gemini → Perplexity → Anthropic → Mock |
   | `review` | Anthropic → OpenAI → Mock |
   | `strategy` | Anthropic → OpenAI → Mock |
   | `qa` | OpenAI → Anthropic → Mock |
   | `office` | OpenAI → Anthropic → Mock |
   | `growth` | Anthropic → OpenAI → Mock |
   | `business` | Anthropic → OpenAI → Mock |
   | `design` | OpenAI → Anthropic → Mock |
   | `automation` | OpenAI → Anthropic → DeepSeek → Mock |

4. Nếu nhóm capability chưa có trong bảng, hoặc `optimizeFor` là
   `"cost"`/`"speed"` (caller cố tình yêu cầu tối ưu riêng, bỏ qua bảng
   ưu tiên mặc định) — xếp hạng mọi Adapter thật hỗ trợ capability đó:
   - `"quality"` (mặc định): theo `ProviderScore.overallScore` — **"Benchmark Selection"**.
   - `"cost"`: theo `costProfile.inputPer1kTokens` tăng dần (rẻ nhất
     thắng) — **"Cost Optimization"**.
   - `"speed"`: theo `ProviderScore.speed` giảm dần.
5. Khi ≥2 Adapter hoà điểm ở bước 4 — **round-robin per-capability**
   (**"Load Balancing"**, kiến trúc chuẩn bị — luân phiên đơn giản giữa
   các Adapter hoà điểm, chưa phải cân bằng tải có trọng số theo tải
   runtime thật, đó là bước mở rộng của Sprint sau).
6. Nếu không có Adapter thật nào khả dụng:
   - `fallbackAllowed !== false` → chọn Mock.
   - `fallbackAllowed === false` → ném lỗi rõ ràng (dùng khi caller cố
     tình cần dữ liệu thật, không chấp nhận Mock — vd Benchmark thật).

`matchCapability(capability)` — "Capability Matching" ở tầng Router
(được `providerManager.matchProvidersForCapability` bọc lại làm API
công khai).

## 6. Provider Score

`src/ai/providers/provider-score.ts` — view tính toán (không lưu trữ
riêng) từ `ProviderExecutionLog` + `adapter.costProfile`/`adapter.benchmarkProfile`:

```ts
type ProviderScoreRecord = {
  providerId: string;
  totalRuns: number;
  quality: number;              // 0-100 — dùng adapter.benchmarkProfile.reportedQuality làm prior (tự khai báo, chưa đo thật nội dung)
  speed: number;                 // 0-100 — có dữ liệu thật (totalRuns>0) thì dùng latency trung bình thật; chưa có thì dùng reportedSpeed làm prior
  cost: number;                   // 0-100 — tính thật từ costProfile (thang so sánh tương đối)
  reliability: number;              // 0-100 — có dữ liệu thật thì dùng tỷ lệ thành công thật; chưa có thì dùng reportedReliability làm prior
  blueprintCompliance: number;        // 0-100 — placeholder trung tính, chờ nối Certification (docs/AI_CERTIFICATION_SYSTEM.md)
  userApprovalRate: number;             // 0-100 — placeholder trung tính, chờ nối Output.approvalStatus thật
  overallScore: number;                   // tổng hợp có trọng số — dùng để ModelRouter xếp hạng ("Benchmark Selection")
};
```

`quality` luôn dùng `benchmarkProfile` (tự khai báo) làm nguồn — Provider
Layer chưa có cách đo chất lượng nội dung thật (đó là việc của con
người/Reviewer Agent, `docs/AI_SANDBOX.md` Phần I). `speed`/`reliability`
chuyển từ prior tự khai báo sang dữ liệu đo thật ngay khi có
`ProviderExecutionLog` (không bao giờ trộn lẫn 2 nguồn cùng lúc).
`blueprintCompliance`/`userApprovalRate` cố tình để mức trung tính (50)
— **không bịa số liệu** khi chưa có dữ liệu QA/Certification/Approval
thật nối vào (thuộc EPIC 05/06, ngoài phạm vi Provider Layer).

## 7. Mock Mode

`MockProviderAdapter` (`mock-provider-adapter.ts`, Tier "development"):
- `isAvailable()` luôn `true` — không cần ENV var nào.
- `execute()` không gọi mạng, trả về `ProviderExecuteResult` **đúng cấu
  trúc như Provider thật** (`raw`/`model`/`providerId`/`isMock: true`/
  `latencyMs`) — `raw` là JSON hợp lệ, không phải chuỗi lỗi.
- Không bao giờ throw chỉ vì thiếu API key — đó là lý do Mock tồn tại.

9 Adapter thật (Core: OpenAI/Anthropic/Gemini/DeepSeek; Recommended:
Grok/Mistral/Ollama; Specialized: Perplexity/Cohere):
- `isAvailable()` trả `false` nếu thiếu ENV var tương ứng (hoặc
  `OLLAMA_BASE_URL` cho riêng Ollama) — không throw.
- `healthCheck()` luôn trả về `{ available: false, reason: "Thiếu ... " }`
  khi thiếu key — không gọi mạng để kiểm tra (tránh tốn phí không cần
  thiết cho một health check).
- `execute()` **chỉ** throw khi bị gọi trực tiếp lúc thiếu key (trường
  hợp lỗi lập trình gọi sai) — trong luồng bình thường, `ModelRouter`
  không bao giờ chọn 1 Adapter đang `isAvailable() === false`.

## 8. Environment Variables

```
# Core
ANTHROPIC_API_KEY=     # tuỳ chọn — thiếu thì AnthropicProviderAdapter.isAvailable() = false
OPENAI_API_KEY=        # tuỳ chọn — thiếu thì OpenAIProviderAdapter.isAvailable() = false
GEMINI_API_KEY=        # tuỳ chọn — thiếu thì GeminiProviderAdapter.isAvailable() = false
DEEPSEEK_API_KEY=      # tuỳ chọn — thiếu thì DeepSeekProviderAdapter.isAvailable() = false
# Recommended
GROK_API_KEY=           # tuỳ chọn — thiếu thì GrokProviderAdapter.isAvailable() = false
MISTRAL_API_KEY=       # tuỳ chọn — thiếu thì MistralProviderAdapter.isAvailable() = false
OLLAMA_BASE_URL=       # tuỳ chọn — địa chỉ Ollama server local (vd http://localhost:11434), KHÔNG phải API key
# Specialized
PERPLEXITY_API_KEY=    # tuỳ chọn — thiếu thì PerplexityProviderAdapter.isAvailable() = false
COHERE_API_KEY=        # tuỳ chọn — thiếu thì CohereProviderAdapter.isAvailable() = false
```

Đã thêm vào `.env.example` (giá trị rỗng, template) và `.env.local`
(giá trị rỗng, không commit — `.env.local` đã nằm trong `.gitignore`).
Không key nào được hard-code trong code, không key nào bị log (Execution
Log chỉ ghi metadata: `providerId`/`capability`/`taskType`/`success`/
`latencyMs`/`error` — không bao giờ ghi `raw`/prompt/API key).

## 9. Benchmark Framework

`src/ai/providers/benchmark-utils.ts` (`runAdapterBenchmark`, dùng
chung bởi cả 10 Adapter qua `benchmark()`):

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

1. Tạo 1 file Adapter mới (vd `src/ai/providers/together-provider-adapter.ts`)
   implement đúng `ProviderAdapter` interface — kể cả `tier`/`modelRegistry`/
   `costProfile`/`benchmarkProfile`/`configuration`/`securityPolicy`.
2. Thêm 1 dòng `providerRegistry.register(new TogetherProviderAdapter())`
   trong `registry.ts`, đúng nhóm Tier (Core/Recommended/Specialized/
   Development — chỉ mang tính tổ chức, không ảnh hưởng logic chọn).
3. (Tuỳ chọn) Thêm `providerId` đó vào `CAPABILITY_FAMILY_PREFERENCE`
   trong `model-router.ts` nếu muốn nó được ưu tiên cho 1 nhóm capability.
4. Xong — `ProviderManager`/Companion/Workspace/Blueprint không cần sửa
   gì thêm; Provider mới tự động tham gia `ModelRouter`/`ProviderScore`/
   `ProviderExecutionLog`/`ProviderHealthCheck`/`matchCapability` qua
   Registry. Đây chính là cách 6 Provider mới (DeepSeek/Grok/Mistral/
   Ollama/Perplexity/Cohere) được thêm ở Sprint "Provider Wave 1" —
   không đụng `ProviderManager`/`ModelRouter`/Companion nào.

## 11. QA Checklist

- [ ] Adapter mới implement đủ 9 trường + 5 hàm của `ProviderAdapter`
      (`providerId`/`name`/`tier`/`supportedModels`/`supportedCapabilities`/
      `modelRegistry`/`costProfile`/`benchmarkProfile`/`configuration`/
      `securityPolicy` + `isAvailable`/`execute`/`healthCheck`/
      `estimateCost`/`benchmark`).
- [ ] `isAvailable()` không gọi mạng, chỉ kiểm tra ENV.
- [ ] `execute()` không hard-code API key, đọc từ `process.env` tại
      thời điểm gọi.
- [ ] `healthCheck()` không gọi API thật tốn phí.
- [ ] Không log giá trị API key ở bất kỳ đâu (kể cả log lỗi).
- [ ] `securityPolicy.keyStorage` luôn là `"server-only-env"` — không
      có ngoại lệ dù Provider có cơ chế xác thực khác (vd Ollama).
- [ ] Đăng ký vào `providerRegistry`, đúng Tier — không tạo Registry
      song song.
- [ ] Không Companion/Agent nào import Adapter trực tiếp — chỉ qua
      `providerManager`.
- [ ] `tsc --noEmit`, `npm run build`, `npm run lint`, `npx vitest run`
      đều sạch trước khi merge.

## 12. Giới hạn đã biết (Known Limitations)

1. `ProviderExecutionLog` là bộ nhớ trong tiến trình (process-local) —
   phù hợp môi trường dev/sandbox hiện tại; production nhiều instance/
   serverless cần lưu trữ bền vững hơn (ngoài phạm vi Provider Layer).
2. `blueprintCompliance`/`userApprovalRate` trong `ProviderScore` là
   placeholder trung tính — chưa nối dữ liệu QA/Certification/Approval
   thật (EPIC 05/06). `quality` luôn dựa trên `benchmarkProfile` tự
   khai báo, không phải điểm đo chất lượng nội dung thật.
3. Sandbox hiện tại không có key thật cho bất kỳ Provider nào trong 9
   Provider thật — mọi lời gọi thật sự đi qua `MockProviderAdapter`, đã
   kiểm chứng qua test suite + curl thật vào `/api/ai/workforce`.
4. `estimateCost()`/`costProfile` là ước tính tham khảo (không phải giá
   niêm yết chính thức) — chỉ dùng để so sánh tương đối giữa các Provider.
5. **Load Balancing** hiện là round-robin đơn giản khi hoà điểm — chưa
   phải cân bằng tải có trọng số theo tải runtime thật (số Task đang xử
   lý, hàng đợi) — đó là bước mở rộng của Sprint sau, kiến trúc (tham số
   `optimizeFor`, cơ chế tie-break) đã sẵn sàng để cắm thêm logic đó mà
   không đổi contract `ProviderManager.execute()`.
6. Ollama là Provider duy nhất không có chi phí SaaS (`costProfile` = 0)
   — luôn thắng tuyệt đối khi `optimizeFor: "cost"` nếu đã cấu hình
   `OLLAMA_BASE_URL`, kể cả khi máy chủ local thực tế không phản hồi
   (`isAvailable()` chỉ kiểm tra ENV, không ping thật — nếu Owner cấu
   hình `OLLAMA_BASE_URL` nhưng server không chạy, `execute()` sẽ thất
   bại ở bước gọi thật, không phải ở bước chọn Provider).
