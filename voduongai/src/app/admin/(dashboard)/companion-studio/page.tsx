"use client";

import { useState } from "react";
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
  { item: "1. Companion (/portal/companion)", source: "src/app/portal/companion/page.tsx", count: "9 section", note: "Presence/Thought/Memory/Thinking/Mission gợi ý/Conversation/Reflection/Silence/Footer." },
  { item: "2. Sứ mệnh Companion (/portal/su-menh-companion)", source: "src/app/portal/su-menh-companion/page.tsx", count: "3 nhóm nội dung", note: "Genome (12 gene) + Philosophy Pairs (4) + Constitution — 100% hardcode." },
  { item: "↳ Companion qua hình ảnh (trang con)", source: "src/app/portal/su-menh-companion/companion-qua-hinh-anh/page.tsx", count: "—", note: "Trang con thật." },
  { item: "3. Companion (phòng chờ) (/portal/ai-assistant)", source: "src/app/portal/ai-assistant/page.tsx", count: "1 section", note: "Trang con thật của Companion." },
];

const GLOBAL_PRESENCE_NOTE =
  "Companion Presence (bong bóng Companion + panel mở ra khi bấm vào) được mount TOÀN CỤC — xuất hiện trên MỌI trang Portal, không chỉ 4 trang ở trên. Đây là bề mặt Companion LỚN NHẤT nhưng không map được vào mô hình Khu vực → Trang → Section (không phải 1 trang, mà 1 lớp phủ toàn Portal). Chưa có AI chat thật ở phiên bản hiện tại — nói thẳng điều đó, không giả vờ.";

const PERSONA: { field: string; value: string }[] = [
  { field: "Tên / Tên hiển thị", value: "Companion / Người Đồng Hành" },
  { field: "Sứ mệnh", value: "Companion ở đây để người dùng không cảm thấy đơn độc trên hành trình của họ — không phải để trả lời nhanh nhất hoặc đúng nhất." },
  { field: "Tính cách", value: "Lắng nghe trước khi nói, hỏi nhiều hơn trả lời, đồng hành nhiều hơn hướng dẫn, gợi mở nhiều hơn kết luận." },
  { field: "Tông giọng", value: "Ấm áp, khiêm tốn, chân thành. Ngôn ngữ mời, không tạo áp lực, không khẳng định thay cảm xúc người dùng." },
  { field: "6 trạng thái chính thức", value: "idle / listening / thinking / encouraging / celebrating / comeback." },
];

const AGENT_REGISTRY_BY_MODULE: { module: string; count: string; note: string }[] = [
  { module: "Không gian AI (khong-gian-ai)", count: "4 chuyên gia", note: "Prompt Coach, Idea Partner, Tool Guide, Practice Helper" },
  { module: "Hệ tri thức AI (ckos)", count: "5 chuyên gia", note: "Research, Writer, Prompt Agent, Reviewer, Summary — điều phối nội dung do Hệ tri thức AI sở hữu" },
  { module: "Học viện AI (academy)", count: "5 chuyên gia", note: "Mission Planner, Practice Coach, Evidence Helper, Reflection Partner, Growth Reviewer" },
  { module: "Dự án & Cơ hội (opportunities)", count: "5 chuyên gia", note: "Project/Risk/Strategy/Opportunity/Action" },
  { module: "Premium (premium)", count: "4 chuyên gia", note: "Deep Mentor, Advanced Strategy, Case Study, Personal Growth Coach" },
  { module: "Nhật ký học tập (learning-journal)", count: "3 chuyên gia", note: "Chủ đích KHÔNG hiện trực tiếp (quy tắc sản phẩm)" },
  { module: "Hành trình của tôi (my-journey)", count: "3 chuyên gia", note: "Journey Narrator, Progress Interpreter, Growth Story" },
  { module: "Khu vườn của bạn (living-garden)", count: "3 chuyên gia", note: "Growth Visualizer, Garden Interpreter, Next Growth" },
];

const MEMORY_SYSTEMS: MemoryRow[] = [
  { name: "Trí nhớ phiên làm việc", storage: "In-memory/localStorage", source: "src/lib/portal/foundation/memory-store.ts", scope: "5 trường Learning/Reflection/Knowledge/Best Practice/Capability." },
  { name: "Viên nang ký ức (\"Câu chuyện của tôi\")", storage: "Supabase", source: "src/lib/portal/memoryCapsules.ts", scope: "9 loại (milestone/lesson/living_story...) — người dùng tự nguyện lưu." },
  { name: "Trí nhớ tính cách", storage: "localStorage (theo thiết bị)", source: "src/lib/portal/companion/character-memory.ts", scope: "3 hướng: listen-first / self-discovery / grateful." },
  { name: "Trí nhớ lõi", storage: "Tĩnh + đọc Trí nhớ gốc", source: "src/lib/portal/companion/core-memory.ts", scope: "Tầng ký ức nền — chỉ 5 ngữ cảnh hẹp được phép phát ra." },
  { name: "Trí nhớ gốc", storage: "Tĩnh, hardcode", source: "src/lib/portal/companion/origin-memory.ts", scope: "12 loại \"tuổi thơ\" Companion." },
  { name: "Trí nhớ câu chuyện (cầu nối)", storage: "Không lưu trữ riêng", source: "src/lib/portal/companion/story-memory.ts", scope: "Nối câu chuyện sống với loại viên nang ký ức." },
];

const FUTURE_FLEXIBILITY: FlexRow[] = [
  { capability: "Trò chuyện AI thật", today: "Chưa có — trang \"phòng chờ\" tự bạch đang chuẩn bị.", readiness: "Mở — chưa hardcode theo model/provider nào." },
  { capability: "Quản lý hội thoại nhiều lượt", today: "Chưa có Session/Context lưu nhiều lượt.", readiness: "Trung bình — đã tách module/nguồn rõ, chưa có khái niệm Phiên/Lượt." },
  { capability: "Hợp nhất trí nhớ", today: "6 hệ thống song song, CHƯA hợp nhất.", readiness: "Yếu nhất — cần quyết định sản phẩm trước khi động vào." },
  { capability: "Đa mô hình AI", today: "Không áp dụng — chưa gọi model nào.", readiness: "Trung lập mặc định, chưa phải thiết kế chủ đích." },
  { capability: "Đội ngũ chuyên gia (Agent)", today: "32 chuyên gia, 8 nhóm, TOÀN BỘ ở trạng thái \"dự kiến\".", readiness: "Tốt nhất — bật 1 chuyên gia thật chỉ cần đổi trạng thái + nối vận hành." },
  { capability: "Gọi công cụ/API ngoài", today: "Chỉ CHỌN chuyên gia theo từ khoá — chưa gọi API/công cụ nào thật.", readiness: "Trung bình — đã phân vùng theo nhóm, chưa có lớp gọi công cụ thật." },
  { capability: "Giọng nói", today: "Không tồn tại.", readiness: "Chưa có điểm nối nào — không xung đột nếu thêm sau." },
  { capability: "Đa kênh (Mobile/Telegram/Zalo...)", today: "Chỉ có Web.", readiness: "Yếu — logic hiện nằm trong tầng giao diện, cần tách lớp trước." },
];

const TABS = [
  { key: "persona", label: "Nhân cách" },
  { key: "conversation", label: "Hội thoại" },
  { key: "memory", label: "Trí nhớ" },
  { key: "knowledge", label: "Tri thức" },
  { key: "training", label: "Huấn luyện" },
  { key: "tools", label: "Công cụ" },
  { key: "config", label: "Cấu hình" },
  { key: "version", label: "Phiên bản" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

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

function Card({ title, note, children }: { title: string; note?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-sm font-bold text-white">{title}</h2>
      {note && <p className="mt-1 text-xs text-white/50">{note}</p>}
      {children}
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5">
      <p className="text-sm text-white/50">{text}</p>
    </div>
  );
}

export default function CompanionStudioAdminPage() {
  const [tab, setTab] = useState<TabKey>("persona");

  return (
    <AdminWorkspaceShell
      title="Companion"
      description="AI Mentor Experience của Portal — Presence toàn cục + 4 trang chuyên dụng. Toàn bộ nội dung hiện là hardcode (nhân cách/đội ngũ chuyên gia/quy tắc điều phối), rule-based hoàn toàn — chưa gọi AI thật, chưa sửa được bằng Admin."
      rootHref="/admin/companion-studio"
      sections={COMPANION_STUDIO_SECTIONS}
    >
      <div className="space-y-6">
        <Card title="Companion xuất hiện ở đâu trên Portal">
          <Table
            columns={[
              { key: "item", label: "Trang" },
              { key: "source", label: "Nguồn", mono: true },
              { key: "count", label: "Số lượng" },
              { key: "note", label: "Ghi chú" },
            ]}
            rows={PAGE_MAPPING}
          />
          <p className="mt-4 text-sm text-white/60">{GLOBAL_PRESENCE_NOTE}</p>
        </Card>

        <nav aria-label="Điều hướng Companion" className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                tab === t.key ? "bg-brand-blue text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "persona" && (
          <Card
            title="Nhân cách Companion"
            note="Nguồn: src/lib/portal/companion/companion-identity.ts. Chỉ hiển thị — chỉnh sửa yêu cầu sửa code, chưa có form quản lý đứng sau."
          >
            <Table columns={[{ key: "field", label: "Trường" }, { key: "value", label: "Giá trị hiện tại" }]} rows={PERSONA} />
          </Card>
        )}

        {tab === "conversation" && (
          <Card
            title="Chiến lược hội thoại & điều phối"
            note="Điều phối rule-based (8 quy tắc) chọn chuyên gia theo từ khoá, không gọi AI. Thư viện câu: 5 nhóm × 100 câu + 7 Thought + 7 Musing — toàn bộ hardcode, chưa sửa được bằng Admin."
          >
            <Table
              columns={[
                { key: "module", label: "Nhóm Portal" },
                { key: "count", label: "Số chuyên gia" },
                { key: "note", label: "Ghi chú" },
              ]}
              rows={AGENT_REGISTRY_BY_MODULE}
            />
          </Card>
        )}

        {tab === "memory" && (
          <>
            <Card
              title="6 hệ thống trí nhớ song song (chưa hợp nhất)"
            >
              <Table
                columns={[
                  { key: "name", label: "Hệ thống" },
                  { key: "storage", label: "Lưu ở đâu" },
                  { key: "source", label: "File", mono: true },
                  { key: "scope", label: "Phạm vi" },
                ]}
                rows={MEMORY_SYSTEMS}
              />
            </Card>
            <Card title="Chiến lược phản chiếu (Reflection)">
              <p className="mt-2 text-sm text-white/60">
                Trí nhớ tính cách chuyển 1 bài học đã lặp lại thành 1 trong 3 hướng: listen-first / self-discovery /
                grateful — logic này do Companion sở hữu. Cỗ máy ý nghĩa phản chiếu là input dùng chung toàn Portal
                (Học viện AI, Khu vườn...) — Companion chỉ tiêu thụ, không sở hữu.
              </p>
            </Card>
          </>
        )}

        {tab === "knowledge" && (
          <Card
            title="Tri thức Companion tiếp cận được"
            note="Companion không sở hữu tri thức CKOS/Học viện AI/Premium — chỉ điều phối/gợi ý dựa trên đội ngũ chuyên gia theo từng khu vực (bảng ở tab Hội thoại). Chưa có kho tri thức riêng của Companion."
          >
            <EmptyNoteInline />
          </Card>
        )}

        {tab === "training" && (
          <Card
            title="Sẵn sàng mở rộng"
            note="Chưa có cơ chế huấn luyện mô hình nào — Companion hiện 100% rule-based. Bảng dưới đây đánh giá từng năng lực dài hạn có đang bị khoá cứng vào 1 hướng hay không, để biết mở rộng sau này khó/dễ tới đâu."
          >
            <Table
              columns={[
                { key: "capability", label: "Năng lực" },
                { key: "today", label: "Hiện tại" },
                { key: "readiness", label: "Đánh giá mở rộng" },
              ]}
              rows={FUTURE_FLEXIBILITY}
            />
          </Card>
        )}

        {tab === "tools" && (
          <Card
            title="Gọi công cụ / API ngoài"
            note="Companion Orchestrator hiện chỉ CHỌN chuyên gia nào theo từ khoá (metadata) — chưa gọi API/công cụ nào thật (CKOS/Học viện AI/Lịch/Email/CRM...). Đây là năng lực chưa xây, không phải đang hoạt động."
          >
            <EmptyNoteInline />
          </Card>
        )}

        {tab === "config" && (
          <Card
            title="Cấu hình vận hành"
            note="Chưa tồn tại. Không có Prompt Strategy/Model/Temperature/Công cụ/Nguồn tri thức/An toàn nào được cấu hình ở bất kỳ đâu — toàn bộ 32 chuyên gia + 8 quy tắc điều phối đều rule-based, 0 lời gọi AI Provider API. Không xây form quản lý giả cho mục này."
          />
        )}

        {tab === "version" && (
          <EmptyNote text="Chưa có lịch sử phiên bản — Companion chưa có cơ chế version/rollback cho Nhân cách, đội ngũ chuyên gia hay quy tắc điều phối. Mọi thay đổi hiện đi qua sửa code trực tiếp." />
        )}
      </div>
    </AdminWorkspaceShell>
  );
}

function EmptyNoteInline() {
  return <p className="mt-3 text-xs text-white/40">Xem chi tiết ở tab &quot;Hội thoại&quot;.</p>;
}
