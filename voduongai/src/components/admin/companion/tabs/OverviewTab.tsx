"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCollection } from "@/lib/admin/store";

type VersionLog = { id: string; version: number; status: string; publishedAt: string | null; changedBy: string };
type Persona = { id: string; status?: string; name?: string; mission?: string; updatedAt?: string; updatedBy?: string };
type Strategy = { id: string; status?: string; intentRecognition?: string; updatedAt?: string; updatedBy?: string };
type KnowledgeRef = { id: string; enabled: boolean };
type SafetyRule = { id: string };
type TestCase = { id: string; result: string };

const LIFECYCLE_LABEL: Record<string, string> = {
  Draft: "Bản nháp",
  Review: "Đang chờ duyệt",
  Approved: "Đã phê duyệt",
  Published: "Đã xuất bản",
  Archived: "Đã lưu trữ",
};

const NEXT_ACTION_LABEL: Record<string, string> = {
  Draft: "Gửi duyệt",
  Review: "Xem yêu cầu duyệt",
  Approved: "Xuất bản",
  Published: "Xem lịch sử phiên bản",
  Archived: "Khôi phục phiên bản cũ",
};

/**
 * Dashboard đọc dữ liệu thật (không mock). PMO hardening: bỏ nút gộp "Gửi
 * duyệt / Xuất bản" — chỉ còn 1 nút hành động tiếp theo, nhãn đổi động
 * theo đúng trạng thái hiện tại (không hiển thị hành động không hợp lệ).
 * Mọi thẻ số liệu/cảnh báo đều bấm được, dẫn thẳng tới đúng tab. Thông báo
 * phân loại rõ Lỗi/Cảnh báo/Thông tin/Sắp phát triển — "chưa cấu hình AI"
 * xếp loại Thông tin, không phải Cảnh báo chặn việc soạn nội dung.
 */
export function OverviewTab({ aiConfigured }: { aiConfigured: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { items: versions, ready: versionsReady } = useCollection<VersionLog>("companion-versions", []);
  const { items: personas, ready: personaReady } = useCollection<Persona>("companion-persona", []);
  const { items: convStrategies, ready: convReady } = useCollection<Strategy>("companion-conversation-strategy", []);
  const { items: refs, ready: refsReady } = useCollection<KnowledgeRef>("companion-knowledge-refs", []);
  const { items: safetyRules, ready: safetyReady } = useCollection<SafetyRule>("companion-safety-rules", []);
  const { items: testCases, ready: testReady } = useCollection<TestCase>("companion-test-sessions", []);

  const ready = versionsReady && personaReady && convReady && refsReady && safetyReady && testReady;

  function goToTab(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (!ready) return <p className="text-sm text-gray-500">Đang tải...</p>;

  const currentPersona = personas.find((p) => p.id === "current");
  const currentConv = convStrategies.find((s) => s.id === "current");
  const currentStage = currentPersona?.status ?? "Draft";
  const published = [...versions].filter((v) => v.status === "Published").sort((a, b) => b.version - a.version)[0];
  const latestLog = [...versions].sort((a, b) => b.version - a.version)[0];
  const enabledRefs = refs.filter((r) => r.enabled);
  const passedTests = testCases.filter((t) => t.result === "Đạt").length;
  const failedTests = testCases.filter((t) => t.result === "Chưa đạt").length;

  const lastUpdatedAt = [currentPersona?.updatedAt, currentConv?.updatedAt].filter(Boolean).sort().at(-1);
  const lastEditor = [currentPersona, currentConv]
    .filter((x) => x?.updatedAt === lastUpdatedAt)
    .map((x) => x?.updatedBy)
    .find(Boolean);

  const checklist = [
    { done: Boolean(currentPersona?.name && currentPersona?.mission), label: "Nhân cách có tên & sứ mệnh", tab: "persona" },
    { done: Boolean(currentConv?.intentRecognition), label: "Có chiến lược hội thoại", tab: "conversation" },
    { done: enabledRefs.length > 0, label: "Có nguồn tri thức được bật", tab: "knowledge" },
    { done: safetyRules.length > 0, label: "Có quy tắc an toàn", tab: "safety" },
    { done: Boolean(published), label: "Có ít nhất 1 phiên bản đã xuất bản", tab: "versions" },
  ];
  const completion = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);
  const missing = checklist.filter((c) => !c.done);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Mức độ hoàn thiện" value={`${completion}%`} onClick={() => goToTab("overview")} />
        <StatCard
          label="Phiên bản đang hoạt động"
          value={published ? `v${published.version}` : "Chưa có"}
          onClick={() => goToTab("versions")}
        />
        <StatCard
          label="Bản nháp hiện tại"
          value={LIFECYCLE_LABEL[currentStage] ?? currentStage}
          onClick={() => goToTab("persona")}
        />
        <StatCard label="Nguồn tri thức đang bật" value={String(enabledRefs.length)} onClick={() => goToTab("knowledge")} />
        <StatCard label="Quy tắc an toàn" value={String(safetyRules.length)} onClick={() => goToTab("safety")} />
        <StatCard
          label="Test case Đạt / Chưa đạt"
          value={`${passedTests} / ${failedTests}`}
          onClick={() => goToTab("test")}
        />
        <StatCard
          label="Cập nhật gần đây"
          value={lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString("vi-VN") : "Chưa có"}
          onClick={() => goToTab("persona")}
        />
        <StatCard label="Người chỉnh sửa gần nhất" value={lastEditor ?? latestLog?.changedBy ?? "Chưa có"} onClick={() => goToTab("versions")} />
      </div>

      {missing.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700">Phần chưa hoàn thành</h3>
          <div className="mt-2 space-y-1.5">
            {missing.map((m) => (
              <button
                key={m.tab}
                type="button"
                onClick={() => goToTab(m.tab)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-700 hover:border-brand-blue/40"
              >
                {m.label}
                <span className="text-xs font-semibold text-brand-blue">Mở tab →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {!aiConfigured && (
          <Notification kind="info">
            <button type="button" onClick={() => goToTab("capabilities")} className="text-left hover:underline">
              Chưa cấu hình nhà cung cấp AI — không ảnh hưởng việc soạn nội dung Companion, chỉ liên quan hệ thống
              AI thật vận hành sau này.
            </button>
          </Notification>
        )}
        {safetyRules.length === 0 && (
          <Notification kind="warning">
            <button type="button" onClick={() => goToTab("safety")} className="text-left hover:underline">
              Chưa có quy tắc an toàn nào.
            </button>
          </Notification>
        )}
        {enabledRefs.length === 0 && (
          <Notification kind="warning">
            <button type="button" onClick={() => goToTab("knowledge")} className="text-left hover:underline">
              Chưa bật nguồn tri thức nào cho Companion.
            </button>
          </Notification>
        )}
        <Notification kind="upcoming">
          Tab &quot;Công cụ&quot; hiện toàn bộ đánh dấu Sắp phát triển — Companion chưa có hệ thống trò chuyện/AI
          thật để vận hành các năng lực này.
        </Notification>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => goToTab("test")}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Kiểm tra Companion
        </button>
        <button
          type="button"
          onClick={() => goToTab("versions")}
          className="rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          {NEXT_ACTION_LABEL[currentStage] ?? "Xem phiên bản"}
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-brand-blue/40 hover:shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 truncate text-lg font-extrabold text-gray-900">{value}</p>
    </button>
  );
}

function Notification({ kind, children }: { kind: "error" | "warning" | "info" | "upcoming"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    error: "border-red-200 bg-red-50 text-red-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    upcoming: "border-gray-200 bg-gray-50 text-gray-600",
  };
  const badgeLabel: Record<string, string> = { error: "Lỗi", warning: "Cảnh báo", info: "Thông tin", upcoming: "Sắp phát triển" };
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${styles[kind]}`}>
      <span className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
        {badgeLabel[kind]}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
