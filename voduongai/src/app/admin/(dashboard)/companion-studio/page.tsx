"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { COMPANION_STUDIO_SECTIONS } from "@/lib/admin/companionStudio/navigation";

type MappingRow = { item: string; source: string; count: string; note: string };
type MemoryRow = { name: string; storage: string; source: string; scope: string };
type FlexRow = { capability: string; today: string; readiness: string };

/**
 * Portal Mapping (Task 1, COMPANION-SPR-801) — đối chiếu trực tiếp source
 * thật, thay bản cũ (ADM-SPR-201 WorkspaceSectionFoundation, chỉ liệt kê 2
 * Portal Area, không có Section/Content). Xem
 * `docs/admin/COMPANION_STUDIO_MANAGEMENT_COMPANION-SPR-801.md`.
 */
const PAGE_MAPPING: MappingRow[] = [
  { item: "1. Companion (/portal/companion)", source: "src/app/portal/companion/page.tsx", count: "9 section", note: "Presence/Thought/Memory/Thinking/Mission gợi ý/Conversation/Reflection/Silence/Footer — đính chính từ 3 lên 9 section." },
  { item: "2. Sứ mệnh Companion (/portal/su-menh-companion)", source: "src/app/portal/su-menh-companion/page.tsx", count: "3 nhóm nội dung", note: "Genome (12 gene) + Philosophy Pairs (4) + Constitution — 560 dòng, 100% hardcode, không đổi ở sprint này." },
  { item: "↳ Companion qua hình ảnh (child)", source: "src/app/portal/su-menh-companion/companion-qua-hinh-anh/page.tsx", count: "—", note: "Route con thật, đã có trong Registry từ PORTAL-SPR-301." },
  { item: "3. Companion (phòng chờ) (/portal/ai-assistant)", source: "src/app/portal/ai-assistant/page.tsx", count: "1 section", note: "MỚI đưa vào Registry (Task 1) — route con thật của Companion, trước đây bị bỏ sót hoàn toàn." },
];

const GLOBAL_PRESENCE_NOTE =
  "Companion Presence (bong bóng Companion + panel CompanionSpace mở ra khi bấm vào) được mount TOÀN CỤC trong PortalShell.tsx — xuất hiện trên MỌI route Portal, không chỉ 3 trang ở trên. Đây là bề mặt Companion LỚN NHẤT nhưng không map được vào mô hình Area→Page→Section (không phải 1 trang, mà 1 lớp phủ toàn Portal). CompanionPresence.tsx (806 dòng) + CompanionSpace.tsx (142 dòng). Chính comment gốc trong CompanionSpace.tsx đã tự bạch: \"Không có AI chat thật ở V1 — nói thẳng điều đó, không giả vờ.\"";

const PERSONA: { field: string; value: string }[] = [
  { field: "Tên / Tên hiển thị", value: "Companion / Người Đồng Hành" },
  { field: "Sứ mệnh", value: "Companion ở đây để người dùng không cảm thấy đơn độc trên hành trình của họ — không phải để trả lời nhanh nhất hoặc đúng nhất." },
  { field: "Tính cách", value: "Lắng nghe trước khi nói, hỏi nhiều hơn trả lời, đồng hành nhiều hơn hướng dẫn, gợi mở nhiều hơn kết luận." },
  { field: "Tông giọng", value: "Ấm áp, khiêm tốn, chân thành. Ngôn ngữ mời, không tạo áp lực, không khẳng định thay cảm xúc người dùng." },
  { field: "6 trạng thái chính thức", value: "idle / listening / thinking / encouraging / celebrating / comeback (Companion_States.md)." },
];

const AGENT_REGISTRY_BY_MODULE: { module: string; count: string; note: string }[] = [
  { module: "Không gian AI (khong-gian-ai)", count: "4 agent", note: "Prompt Coach, Idea Partner, Tool Guide, Practice Helper" },
  { module: "Hệ tri thức AI (ckos)", count: "5 agent", note: "Research, Writer, Prompt Agent, Reviewer, Summary — orchestrate nội dung do CKOS sở hữu" },
  { module: "Học viện AI (academy)", count: "5 agent", note: "Mission Planner, Practice Coach, Evidence Helper, Reflection Partner, Growth Reviewer" },
  { module: "Dự án & Cơ hội (opportunities)", count: "5 agent", note: "Project/Risk/Strategy/Opportunity/Action" },
  { module: "Premium (premium)", count: "4 agent", note: "Deep Mentor, Advanced Strategy, Case Study, Personal Growth Coach" },
  { module: "Nhật ký học tập (learning-journal)", count: "3 agent", note: "Chủ đích KHÔNG hiện Agent trực tiếp (rule Product)" },
  { module: "Hành trình của tôi (my-journey)", count: "3 agent", note: "Journey Narrator, Progress Interpreter, Growth Story" },
  { module: "Khu vườn của bạn (living-garden)", count: "3 agent", note: "Growth Visualizer, Garden Interpreter, Next Growth" },
];

const MEMORY_SYSTEMS: MemoryRow[] = [
  { name: "Workspace Runtime Memory", storage: "In-memory/localStorage (Workspace session)", source: "src/lib/portal/foundation/memory-store.ts", scope: "5 trường Learning/Reflection/Knowledge/Best Practice/Capability — ghi sau khi 1 Output hoàn thành." },
  { name: "Memory Capsule (\"Câu chuyện của tôi\")", storage: "Supabase", source: "src/lib/portal/memoryCapsules.ts", scope: "9 loại capsule (milestone/lesson/living_story/first_footprint/birthday...) — người dùng tự nguyện lưu." },
  { name: "Character Memory", storage: "localStorage (per-device)", source: "src/lib/portal/companion/character-memory.ts", scope: "3 hướng: listen-first / self-discovery / grateful — Lesson đã lặp lại đủ nhiều lần." },
  { name: "Core Memory", storage: "Static + đọc Origin Memory", source: "src/lib/portal/companion/core-memory.ts", scope: "Tầng ký ức nền — chỉ 5 ngữ cảnh hẹp được phép phát ra Origin Line." },
  { name: "Origin Memory", storage: "Static hardcode", source: "src/lib/portal/companion/origin-memory.ts", scope: "12 loại \"tuổi thơ\" Companion — không đổi nếu chưa có quyết định Product Team." },
  { name: "Story Memory (bridge)", storage: "Cầu nối, không lưu trữ riêng", source: "src/lib/portal/companion/story-memory.ts", scope: "Map LivingStory → MemoryCapsuleKind." },
];

const FUTURE_FLEXIBILITY: FlexRow[] = [
  { capability: "AI Chat", today: "Chưa có — /portal/ai-assistant tự bạch \"đang được chuẩn bị\"; CompanionSpace.tsx tự bạch \"chưa có AI chat thật\".", readiness: "Mở: chưa hardcode theo model/provider nào (vì chưa gọi AI). Cần thêm: 1 lớp gọi model thật + UI chat — hiện chưa tồn tại điểm nối." },
  { capability: "Conversation Management", today: "Chưa có Session/Context lưu trữ hội thoại nhiều lượt — chỉ có context tạm (sessionStorage) cho 1 lượt điều hướng /portal/workspace.", readiness: "Trung bình: type PortalModule + WorkspaceContext đã tách module/nguồn rõ, nhưng chưa có khái niệm Conversation/Session/Turn." },
  { capability: "Memory", today: "6 hệ thống ký ức song song, CHƯA hợp nhất (bảng trên) — không có 1 Memory Engine duy nhất.", readiness: "Yếu nhất trong 9 mục: hợp nhất 6 hệ thống là việc kiến trúc lớn, không phải mở rộng thêm — cần quyết định Product trước khi động vào." },
  { capability: "AI Runtime (Prompt Strategy/Model/Temperature/Tools/MCP/Knowledge Source/Safety)", today: "Không tồn tại — 100% rule-based (if/else + keyword match), 0 lời gọi API model AI nào trong toàn bộ src/companion/.", readiness: "Mở về mặt LÝ THUYẾT (không có gì để gỡ bỏ/thay thế) nhưng 0% đã xây — không tạo Runtime Configuration giả (đúng Acceptance)." },
  { capability: "Multi Model", today: "Không áp dụng — không có model nào được gọi.", readiness: "Không hardcode 1 provider nào (vì chưa dùng provider nào) — trung lập mặc định, chưa phải thiết kế chủ đích." },
  { capability: "Agent Capability", today: "AGENT_REGISTRY: 32 agent, 8 module, TOÀN BỘ status=\"planned\" (0 \"active\").", readiness: "Tốt nhất trong 9 mục: type AgentStatus (\"active\"|\"planned\") đã có sẵn — bật 1 Agent thật chỉ cần đổi status + nối Runtime, không cần đổi schema." },
  { capability: "Tool Calling (CKOS/Academy/Premium/Calendar/Email/CRM/MCP/API)", today: "Companion Orchestrator chỉ CHỌN Agent nào (metadata) theo rule-based keyword match — không gọi API/tool nào thật.", readiness: "Trung bình: MODULE_ROUTE_PREFIXES + getAgentsByModule() đã phân vùng theo module gọn — nhưng \"gọi\" hiện chỉ là hiển thị text, chưa có lớp Tool/Function-calling thật." },
  { capability: "Workflow (Goal→Planning→Execution→Reflection→Recommendation)", today: "work-session-engine.ts đã mô phỏng đúng nhịp 7 bước (observe→understand→plan→invite→wait→synthesize→ready), rule-based, không gọi AI.", readiness: "Khá tốt: state machine đã có (CompanionWorkStep) — thay bước rule-based bằng bước AI thật không cần đổi khung state machine." },
  { capability: "Voice", today: "Không tồn tại — không có Voice Input/Output ở bất kỳ đâu trong Companion.", readiness: "Chưa có điểm nối nào (không tốt không xấu) — CompanionState/companionMessage đều là text, thêm audio output là bổ sung tầng mới, không xung đột kiến trúc hiện có." },
  { capability: "Multi Channel (Web/Mobile/Telegram/WhatsApp/Messenger/API)", today: "Chỉ có Web (Portal Next.js) — CompanionPresence là component React mount trong PortalShell, gắn chặt với DOM/React.", readiness: "Yếu: toàn bộ logic Companion hiện nằm trong tầng UI component (React), CHƯA tách thành service/API độc lập kênh — cần tách lớp trước khi thêm kênh khác." },
];

function Table<T extends Record<string, string>>({
  columns,
  rows,
}: {
  columns: { key: keyof T; label: string; mono?: boolean }[];
  rows: T[];
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40">
            {columns.map((c) => (
              <th key={String(c.key)} className="py-2 pr-4 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 align-top">
              {columns.map((c, ci) => (
                <td
                  key={String(c.key)}
                  className={`py-2 ${ci < columns.length - 1 ? "pr-4" : ""} ${
                    c.mono ? "font-mono text-xs text-white/60" : "text-xs text-white/60"
                  } ${ci === 0 ? "font-semibold text-white/80 whitespace-nowrap" : ""}`}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompanionStudioAdminPage() {
  return (
    <AdminWorkspaceShell
      title="Companion Studio"
      description="AI Mentor Experience của Portal — Presence toàn cục + 3 trang chuyên dụng, đối chiếu trực tiếp (COMPANION-SPR-801). Toàn bộ nội dung là TypeScript hardcode (persona/agent registry/orchestration rules), rule-based hoàn toàn — chưa gọi AI thật, chưa có Runtime/CRUD nào. Xem Future Flexibility Review bên dưới."
      rootHref="/admin/companion-studio"
      sections={COMPANION_STUDIO_SECTIONS}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">Portal Mapping — 3 trang + Presence toàn cục (Task 1)</h2>
          <p className="mt-1 text-xs text-white/50">
            Đính chính Registry cũ (PORTAL-SPR-301): trang /portal/companion đối chiếu lại đúng 9 section (trước ghi 3); bổ
            sung /portal/ai-assistant — trước đây bỏ sót hoàn toàn khỏi Registry.
          </p>
          <Table
            columns={[
              { key: "item", label: "Trang" },
              { key: "source", label: "Nguồn", mono: true },
              { key: "count", label: "Số lượng" },
              { key: "note", label: "Ghi chú" },
            ]}
            rows={PAGE_MAPPING}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Companion Presence — lớp phủ toàn cục (không phải 1 trang)</h2>
          <p className="mt-2 text-sm text-white/60">{GLOBAL_PRESENCE_NOTE}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Companion Management — Persona / Mentor Profile (Task 3)</h2>
          <p className="mt-1 text-xs text-white/50">
            Nguồn: <code className="text-brand-orange">src/lib/portal/companion/companion-identity.ts</code>. Chỉ hiển thị —
            chỉnh sửa yêu cầu sửa code, CHƯA có CRUD/collection đứng sau (đúng &quot;không tạo đối tượng chưa tồn tại&quot;).
          </p>
          <Table columns={[{ key: "field", label: "Trường" }, { key: "value", label: "Giá trị hiện tại" }]} rows={PERSONA} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Companion Management — Agent Registry (Recommendation/Conversation Strategy)</h2>
          <p className="mt-1 text-xs text-white/50">
            32 agent (đếm bằng TypeScript AST, xác thực), 8 module Portal, <strong className="text-white/80">TOÀN BỘ status = &quot;planned&quot;</strong> —
            đây là metadata mô tả &quot;đội ngũ chuyên gia&quot; đứng sau Companion, KHÔNG phải Agent AI thật đang chạy. Orchestration
            rule-based (8 rule trong <code className="text-brand-orange">orchestration-rules.ts</code>) chọn Agent theo từ khoá,
            không gọi AI. Conversation Strategy: 5 thư viện câu &times; 100 câu/thư viện (
            <code className="text-brand-orange">conversation-library.ts</code>) + 7 Thought + 7 Musing (
            <code className="text-brand-orange">companion-inner-life.ts</code>) — toàn bộ hardcode, chưa có CRUD.
          </p>
          <Table
            columns={[
              { key: "module", label: "Module Portal" },
              { key: "count", label: "Số Agent" },
              { key: "note", label: "Ghi chú" },
            ]}
            rows={AGENT_REGISTRY_BY_MODULE}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Companion Management — Reflection Strategy</h2>
          <p className="mt-2 text-sm text-white/60">
            Character Memory (<code className="text-brand-orange">character-memory.ts</code>) chuyển 1 Lesson đã lặp lại thành
            1 trong 3 hướng: <code className="text-brand-orange">listen-first</code> / <code className="text-brand-orange">self-discovery</code> /{" "}
            <code className="text-brand-orange">grateful</code> — đây là logic Companion Studio sở hữu. Reflection Meaning Engine
            (<code className="text-brand-orange">src/lib/portal/intelligence/reflection-meaning.ts</code>) là input đầu vào dùng
            chung toàn Portal (Academy Mission, Living Garden...) — Companion Studio CHỈ tiêu thụ, không sở hữu engine đó.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Companion Management — Memory (6 hệ thống song song, chưa hợp nhất)</h2>
          <p className="mt-1 text-xs text-white/50">
            Đính chính finding cũ (Portal Coverage Audit, ADM-SPR-201) từng ghi &quot;3 hệ thống bộ nhớ song song&quot; — đối chiếu lại
            trực tiếp source thật là <strong className="text-white/80">6</strong> hệ thống riêng biệt, chưa hợp nhất.
          </p>
          <Table
            columns={[
              { key: "name", label: "Hệ thống" },
              { key: "storage", label: "Lưu ở đâu" },
              { key: "source", label: "File", mono: true },
              { key: "scope", label: "Phạm vi" },
            ]}
            rows={MEMORY_SYSTEMS}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Companion Management — Runtime Configuration</h2>
          <p className="mt-2 text-sm text-white/60">
            <strong className="text-white/80">Chưa tồn tại.</strong> Không có Prompt Strategy/Model/Temperature/Tools/MCP/
            Knowledge Source/Safety nào được cấu hình ở bất kỳ đâu trong <code className="text-brand-orange">src/companion/</code> —
            toàn bộ 32 Agent + 8 Orchestration Rule đều rule-based (if/else + keyword match), 0 lời gọi AI Provider API. Đúng
            Acceptance &quot;Không tạo AI Runtime giả&quot; — không xây form/CRUD cho mục này.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Workspace Ownership (Task 4)</h2>
          <p className="mt-2 text-sm text-white/60">
            Companion Studio chỉ sở hữu AI Mentor Experience: 3 trang + Presence toàn cục ở trên, Persona/Identity, Agent
            Registry metadata, Orchestration Rules, Conversation/Inner-life library, Character/Core/Origin/Story Memory.{" "}
            <strong className="text-white/80">Không sở hữu</strong>: nội dung Tools/Prompts/Knowledge Seed thật (CKOS — các agent
            &quot;ckos-*&quot; chỉ orchestrate, không sở hữu dữ liệu); Mission/Journey/Roadmap thật (Academy); Pricing/Order/
            Entitlement (Premium/Commercial); Page/Navigation/SEO (Website); Media Asset (Media); Logo/Theme (Brand); Reflection
            Meaning Engine (dùng chung toàn Portal, không riêng Companion).
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Future Flexibility Review (Task 5 — chỉ đánh giá, không triển khai)</h2>
          <p className="mt-1 text-xs text-white/50">
            9 khả năng dài hạn theo Founder Directive — đánh giá kiến trúc hiện tại có đang khoá cứng vào 1 hướng hay không.
          </p>
          <Table
            columns={[
              { key: "capability", label: "Khả năng" },
              { key: "today", label: "Hiện tại" },
              { key: "readiness", label: "Đánh giá mở rộng" },
            ]}
            rows={FUTURE_FLEXIBILITY}
          />
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
