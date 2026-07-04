# PHASE 3 EPIC 06 — AI Discovery Engine

> **Trạng thái**: Kiến trúc (design-only). Không gọi API, không tích
> hợp AI hàng loạt, không đổi kiến trúc đã khóa. Đây là **bước đầu tiên**
> của AI Workforce Recruitment & Evolution System — nối trực tiếp vào
> `OPEN_AI_WORKFORCE_PLATFORM.md` (AI Provider Registry, AI Lifecycle
> `discovered` stage) mà không định nghĩa lại 2 khái niệm đó.

## 1. Mission

Giữ cho Companion **biết** AI nào đang tồn tại trên thị trường (Provider/
Model/Agent/MCP Server/Tool/Automation Service), nhưng **không tự ý
dùng hay tuyển** bất kỳ AI nào chỉ vì nó tồn tại — Discovery chỉ là bước
**quan sát và ghi nhận**, quyết định tuyển dụng thuộc về Capability Gap
Analysis (`AI_CAPABILITY_GAP_ANALYSIS.md`), không thuộc về Discovery.

## 2. Nguồn Discovery (6 loại)

| Nguồn | Ví dụ | Ghi chú |
|---|---|---|
| AI Providers | nhà cung cấp model (ẩn danh ở tầng dữ liệu user-facing, đúng nguyên tắc AI-Agnostic) | Khớp `AiProviderRegistryEntry` đã có |
| AI Models | phiên bản model cụ thể của 1 Provider | 1 Provider có thể có nhiều Model |
| AI Agents | Agent chuyên biệt cho 1 vai trò (giống Writer/Reviewer Agent hiện có) | Khớp `CompanionRegistryEntry.agentBinding` |
| MCP Servers | Model Context Protocol Server cung cấp tool/dữ liệu cho Agent | Nguồn mới, chưa có Registry riêng — đăng ký như 1 dạng "Tool Provider" trong AI Candidate Registry |
| AI Tools | Công cụ AI độc lập (không phải model nền, mà là 1 sản phẩm hoàn chỉnh) | Ví dụ: công cụ tạo ảnh, công cụ chấm điểm SEO |
| Automation Services | Dịch vụ tự động hoá bên thứ ba (không phải "AI" thuần, nhưng Companion có thể cần phối hợp) | Liên quan `Integration Specialist` (`AI_COMPANION_REGISTRY.md` §6.4) |

## 3. Dữ liệu thu thập cho mỗi Candidate (10 trường bắt buộc)

```ts
type DiscoveredCandidate = {
  candidateId: string;
  name: string;                    // tên nội bộ dùng để tra cứu — KHÔNG bắt buộc là tên thương mại thật, có thể mã hoá lại theo nguyên tắc AI-Agnostic khi hiển thị cho Owner
  provider: string;                 // nguồn cung cấp — lưu ở tầng server-only, không hiển thị vendor cụ thể cho Owner (giữ nguyên nguyên tắc đã khóa)
  capabilities: string[];           // tham chiếu candidate capabilityId ở AI Capability Registry nếu đã có, hoặc mô tả tự do nếu là capability mới chưa từng đăng ký
  supportedTasks: string[];         // loại Task cụ thể candidate tuyên bố làm được
  cost: { unit: string; estimate: number };   // đơn giá ước tính — chưa phải hoá đơn thật
  speed: { unit: "tokens/s" | "s/task"; estimate: number };
  reliability: "unknown" | "reported-high" | "reported-medium" | "reported-low"; // dựa trên thông tin công khai, KHÔNG phải benchmark thật — benchmark thật thuộc AI Evaluation Engine
  security: string;                 // ghi nhận công khai về bảo mật (chứng chỉ, chính sách dữ liệu) — nếu không rõ, ghi "chưa xác minh"
  privacy: string;                  // chính sách xử lý dữ liệu người dùng công khai
  apiCompatibility: string;         // giao thức gọi — vd "REST/JSON", "MCP", "SDK riêng"
  discoveredAt: string;
  status: "discovered";             // trạng thái duy nhất Discovery Engine được phép ghi — không tự chuyển sang bước tiếp theo
};
```

**Nguyên tắc bắt buộc**: mọi trường ở trên nếu không xác minh được phải
ghi `"chưa xác minh"`/`"unknown"` — Discovery Engine **không được suy
diễn hoặc làm tròn để trông đầy đủ hơn thực tế**.

## 4. Chu kỳ Discovery

- Companion thực hiện Discovery **định kỳ** (đề xuất: theo chu kỳ Owner
  cấu hình, mặc định hàng tháng — không phải liên tục/real-time).
- Discovery **không được kích hoạt tự động** bởi 1 Goal cụ thể của
  Owner — đây là hoạt động nền của Workforce, tách biệt khỏi luồng
  Workspace Session của Owner đang làm việc.
- Mỗi lần Discovery chạy tạo ra 0..N `DiscoveredCandidate` mới — không
  ghi đè Candidate đã có, chỉ thêm/cập nhật `discoveredAt` nếu candidate
  đã tồn tại.

## 5. Đầu ra: AI Candidate Registry

Toàn bộ `DiscoveredCandidate` được lưu vào **AI Candidate Registry**
(`AI_CANDIDATE_REGISTRY.md`) — Discovery Engine chỉ **ghi**, không đọc
ngược lại Registry để tự quyết định bước tiếp theo (đó là việc của
Capability Gap Analysis).

## 6. Ranh giới (không được vi phạm)

1. Discovery Engine **không tự động Benchmark** — đó là bước riêng
   (AI Evaluation Engine).
2. Discovery Engine **không tự động đề xuất tuyển dụng** — chỉ ghi nhận
   sự tồn tại.
3. Discovery Engine **không gọi API thật** ở sprint này — mọi
   `DiscoveredCandidate` trong tài liệu là ví dụ minh hoạ cấu trúc dữ
   liệu, không phải dữ liệu đã thu thập thật.
4. Không giới hạn số nguồn Discovery theo thời gian, nhưng mỗi nguồn
   mới muốn được Companion "biết tới" phải khai báo đủ 10 trường ở §3 —
   không có ngoại lệ rút gọn.
