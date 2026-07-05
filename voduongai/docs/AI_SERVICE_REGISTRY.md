# AI Service Registry (mở rộng từ AI Provider Layer)

> **Trạng thái**: Code thật, đã chạy được (Mock Provider trong sandbox
> này — chưa có key thật cho 9 Provider LLM). Đây là bước đổi tư duy:
> Registry không chỉ quản lý LLM — nó quản lý **mọi loại AI Service**
> VO DUONG AI sẽ dùng trong tương lai (LLM hôm nay; Image/Video/Voice/
> Search/Automation/Local Runtime sau này), tất cả qua đúng 1 contract.

**Product Principle**: AI Provider chỉ là động cơ. AI Service Registry
là nơi quản lý toàn bộ động cơ. Companion không phụ thuộc bất kỳ hãng AI
nào. VO DUONG AI phải có khả năng gắn thêm bất kỳ AI Service mới nào
trong tương lai mà không phải sửa kiến trúc lõi.

---

## 1. Architecture

```
Companion (Writer Agent / Reviewer Agent / Companion Manager)
        │  gọi đúng 1 hàm, không biết Service nào sẽ chạy, không biết providerType
        ▼
aiServiceManager.execute({ capability, taskType, input, context, preferredProvider, fallbackProvider, fallbackAllowed, optimizeFor })
        │
        ▼
ModelRouter.selectAdapter(...)  ── chọn 1 AIServiceAdapter, mù về providerType (routing theo capability, không theo loại service)
        │
        ▼
AIServiceAdapter.execute(...)  ── nơi DUY NHẤT gọi vendor thật (hoặc Mock)
        │
        ▼
ProviderExecutionLog.recordExecution(...)  ── ghi lại mọi lần chạy
        │
        ▼
ProviderScore (view tính toán từ Log)  ── ModelRouter dùng để xếp hạng lần sau
```

`aiServiceManager`/`aiServiceRegistry` là **tên chính thức** từ Sprint
này trở đi — đứng cạnh `providerManager`/`providerRegistry` (giữ nguyên
làm alias, cùng 1 object/instance) để không phá bất kỳ import nào đã có
từ 2 Sprint trước (EPIC 01 "AI Provider Layer", EPIC 02 "Provider Wave
1"). Companion **không bao giờ** import trực tiếp
`AnthropicProviderAdapter`/`OpenAIProviderAdapter`/... — chỉ import
`aiServiceManager` (`src/ai/providers/provider-manager.ts`).

## 2. Provider Wave 1 (LOCK — không đổi trong Sprint này)

10 Provider, 4 Tier, toàn bộ `providerType: "llm"`:

| Tier | Provider | providerId | ENV var |
|---|---|---|---|
| **Core** | OpenAI | `openai` | `OPENAI_API_KEY` |
| **Core** | Claude (Anthropic) | `anthropic` | `ANTHROPIC_API_KEY` |
| **Core** | Gemini | `gemini` | `GEMINI_API_KEY` |
| **Core** | DeepSeek | `deepseek` | `DEEPSEEK_API_KEY` |
| **Recommended** | Grok | `grok` | `GROK_API_KEY` |
| **Recommended** | Mistral | `mistral` | `MISTRAL_API_KEY` |
| **Recommended** | Ollama | `ollama` | `OLLAMA_BASE_URL` (local, không phải API key) |
| **Specialized** | Perplexity | `perplexity` | `PERPLEXITY_API_KEY` |
| **Specialized** | Cohere | `cohere` | `COHERE_API_KEY` |
| **Development** | Mock | `mock` | — |

Chi tiết đầy đủ từng Adapter (Cost/Quality/Speed/Reliability Profile,
Model Registry, Security Profile) — xem `docs/AI_PROVIDER_LAYER.md`
(tài liệu vận hành gốc, vẫn đúng — tài liệu này bổ sung tầng khái niệm
"AI Service" phía trên, không thay thế).

## 3. Provider Type — không hard-code chỉ cho LLM

```ts
type AIServiceType =
  | "llm" | "search" | "image" | "video" | "voice" | "automation"
  | "local_runtime" | "embedding" | "rag" | "code" | "browser" | "data" | "other";
```

Mọi `AIServiceAdapter` phải khai báo `providerType`. Provider Wave 1
(10 Provider) đều là `"llm"` — Registry không tự giới hạn chỉ chấp nhận
loại này, `aiServiceRegistry.listByType("image")` hôm nay trả về mảng
rỗng (chưa có Adapter Image nào), không lỗi, không throw.

## 4. AI Service Registry Entry

Mỗi service đăng ký trong Registry mang đủ các trường sau (map trực
tiếp vào `AIServiceAdapter` — không phải bảng dữ liệu tách rời, tránh
đồng bộ 2 nguồn):

| Trường brief yêu cầu | Nơi triển khai trong `AIServiceAdapter` |
|---|---|
| `serviceId` | `providerId` |
| `providerName` | `name` |
| `providerType` | `providerType` |
| `tier` | `tier` |
| `capabilities` | `supportedCapabilities` / `getCapabilities()` |
| `supportedTasks` | biểu diễn qua `taskType` tự do trong `ProviderExecuteRequest` — không giới hạn cứng, Capability Registry (tầng trên, `docs/OPEN_AI_WORKFORCE_PLATFORM.md`) là nơi liệt kê Task cụ thể |
| `supportedBlueprints` | nối gián tiếp qua Capability → Blueprint (`AI_COMPANION_REGISTRY.md`), Provider Layer không tự biết Blueprint (đúng ranh giới "Không đổi Blueprint") |
| `models` | `modelRegistry` |
| `costProfile` | `costProfile` |
| `speedProfile` | `speedProfile` |
| `qualityProfile` | `qualityProfile` |
| `reliabilityProfile` | `reliabilityProfile` |
| `privacyProfile` | `privacyProfile` (mới — `sendsDataExternally`/`dataResidencyNote`) |
| `securityProfile` | `securityProfile` (đổi tên từ `securityPolicy`) |
| `availability` | `isAvailable()` |
| `adapter` | chính bản thân object implement `AIServiceAdapter` |
| `fallbackProviders` | tham số `fallbackProvider` truyền vào `aiServiceManager.execute()` theo từng request (không cố định cứng trong Registry — 1 Companion có thể muốn fallback khác nhau tuỳ Task) |

## 5. Adapter Pattern

```ts
interface AIServiceAdapter {
  readonly providerId: string;
  readonly name: string;
  readonly providerType: AIServiceType;
  readonly tier: "core" | "recommended" | "specialized" | "development";
  readonly supportedModels: string[];
  readonly supportedCapabilities: string[];
  readonly modelRegistry: { modelId: string; contextWindow: number; description: string }[];
  readonly costProfile: { inputPer1kTokens: number; outputPer1kTokens: number; currency: "USD" };
  readonly qualityProfile: { reportedQuality: number };
  readonly speedProfile: { reportedSpeed: number };
  readonly reliabilityProfile: { reportedReliability: number };
  readonly privacyProfile: { sendsDataExternally: boolean; dataResidencyNote: string };
  readonly configuration: { envVar: string; optionalEnvVar?: string };
  readonly securityProfile: { keyStorage: "server-only-env"; loggingPolicy: "never-log-key-or-raw-content"; dataRetentionNote: string };

  isAvailable(): boolean;
  execute(request): Promise<ProviderExecuteResult>;
  healthCheck(): Promise<ProviderHealth>;
  estimateCost(request): ProviderCostEstimate;
  benchmark(testCase): Promise<ProviderBenchmarkResult>;
  getCapabilities(): string[];
}
```

Không module nào được gọi trực tiếp OpenAI/Claude/Gemini hay bất kỳ
Provider nào — **tất cả** phải đi qua `aiServiceManager.execute()`.
`ProviderAdapter` (tên cũ từ EPIC 01/02) vẫn là 1 type alias hợp lệ trỏ
tới `AIServiceAdapter` — code cũ không cần sửa.

## 6. AIServiceManager

```ts
aiServiceManager.execute({
  capability: "writing.draft",
  taskType: "writer",
  input: { prompt: "..." },
  preferredProvider: "anthropic",
  fallbackProvider: "openai",
  fallbackAllowed: true,
  optimizeFor: "quality", // "quality" | "cost" | "speed"
});
```

`aiServiceManager` là **alias chính thức** của `providerManager` (cùng 1
object — `export const aiServiceManager = providerManager`). Cả 2 tên
đều dùng được, không có khác biệt hành vi.

## 7. Routing Logic

`ModelRouter` (`model-router.ts`) chọn service dựa trên: `capability` →
`preferredProvider` → `fallbackProvider` → bảng ưu tiên theo nhóm
capability → `ProviderScore` (quality/speed/cost tuỳ `optimizeFor`) →
Mock. Ví dụ theo đúng brief:

| Nhóm capability | Thứ tự ưu tiên |
|---|---|
| Writing | Claude → OpenAI → Mock |
| Coding | OpenAI → DeepSeek → Claude → Mock |
| Research | Perplexity → Gemini → Claude → Mock |
| Local / Privacy | Ollama (chọn qua `preferredProvider: "ollama"` — Ollama không nằm trong bảng ưu tiên mặc định vì mặc định ưu tiên chất lượng/tốc độ SaaS, Owner cần chỉ định tường minh khi ưu tiên riêng tư tuyệt đối) |
| Enterprise RAG | Cohere (qua `preferredProvider: "cohere"`, tương tự Ollama — RAG doanh nghiệp là nhu cầu đặc thù, không phải mặc định hệ thống) |
| Development | Mock (fallback cuối cùng, luôn sẵn sàng) |

`providerType` **không** tham gia logic Routing hôm nay (Wave 1 toàn bộ
`"llm"`, không có gì để phân biệt) — khi có Adapter Image/Video đầu
tiên, Routing sẽ cần thêm bước lọc theo `providerType` trước khi áp
dụng capability family (thuộc Sprint tích hợp AI Service loại mới,
chưa cần trong Sprint này).

## 8. Mock Mode

- Không có key nào cấu hình → mọi Provider thật `isAvailable() === false`.
- `aiServiceManager.execute()` tự động chọn `MockProviderAdapter`.
- Mock trả `ProviderExecuteResult` **đúng cấu trúc** (`raw`/`model`/
  `providerId`/`isMock: true`/`latencyMs`), `raw` là JSON hợp lệ.
- Không bao giờ throw/báo lỗi giả chỉ vì thiếu key — đó chính là lý do
  Mock (Tier Development) tồn tại.

## 9. Environment Variables

```
# Core
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
DEEPSEEK_API_KEY=
# Recommended
GROK_API_KEY=
MISTRAL_API_KEY=
OLLAMA_BASE_URL=
# Specialized
PERPLEXITY_API_KEY=
COHERE_API_KEY=
```

Tất cả tuỳ chọn — đã có trong `.env.example`/`.env.local` (giá trị
rỗng, `.env.local` gitignored). Không key nào hard-code, không key nào
bị log (`ProviderExecutionLog` chỉ ghi metadata).

## 10. How to add a new AI Service

1. Tạo 1 file Adapter mới implement đúng `AIServiceAdapter` — kể cả
   `providerType` đúng loại thật (vd `"image"` cho Fal AI, không phải
   `"llm"`).
2. Thêm 1 dòng `aiServiceRegistry.register(new X())` trong `registry.ts`.
3. (Tuỳ chọn) Thêm vào bảng ưu tiên capability trong `model-router.ts`
   nếu muốn service mới được ưu tiên cho 1 nhóm capability cụ thể.
4. Xong — `AIServiceManager`/Companion/Workspace/Blueprint không cần
   sửa gì thêm.

## 11. Future Expansion (KHÔNG tích hợp ngay)

Chỉ chuẩn bị chỗ đứng trong `AIServiceType`/Registry — không viết
Adapter thật cho các dịch vụ dưới đây trong Sprint này:

| providerType | Ứng viên tương lai |
|---|---|
| `image` | Fal AI, Replicate, Ideogram, Flux |
| `video` | Runway, Veo |
| `voice` | ElevenLabs |
| `search` | Tavily, Firecrawl |
| `automation` | n8n, Make, Zapier |
| `local_runtime` | vLLM, LM Studio (cạnh Ollama đã có) |

Khi Sprint tương lai tích hợp 1 trong các dịch vụ trên, làm đúng quy
trình ở mục 10 — không cần đổi `AIServiceAdapter`/`AIServiceManager`/
`ModelRouter`.

## 12. Test Coverage (bắt buộc, đã verify)

- 10 Provider Wave 1 được register đúng, đúng 4 Tier.
- Mọi Provider Wave 1 khai báo `providerType: "llm"`; `listByType("image")`
  trả mảng rỗng, không lỗi.
- Thiếu API key → `isAvailable() === false`, `execute()` ném lỗi rõ
  ràng, `healthCheck()` báo lý do — không crash.
- `aiServiceManager.execute()` không có Provider thật nào khả dụng →
  fallback Mock, `isMock: true`.
- Routing theo capability hoạt động đúng (writing/coding/research/
  preferredProvider/fallbackAllowed).
- `aiServiceManager`/`aiServiceRegistry` là alias cùng object với
  `providerManager`/`providerRegistry` — cổng gọi duy nhất, không có 2
  đường khác nhau.
- `tsc --noEmit`, `npm run build`, `npm run lint`, `npx vitest run` đều
  sạch.

## 13. Việc KHÔNG làm ở Sprint này (nhắc lại)

- Không tích hợp hàng loạt Image/Video/Voice ngay — chỉ khai báo
  `AIServiceType`, không có Adapter thật nào cho các loại này.
- Không tạo Marketplace.
- Không đổi Companion/Blueprint/Workforce Architecture.
- Không hard-code Provider trong UI (Registry hôm nay hoàn toàn
  server-side, chưa có UI nào đọc trực tiếp).
