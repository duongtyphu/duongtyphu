"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCollection } from "@/lib/admin/store";

type VersionLog = { id: string; version: number; status: string; publishedAt: string | null };
type Persona = { id: string; status?: string; updated_at?: string };
type KnowledgeRef = { id: string; enabled: boolean };
type SafetyRule = { id: string };

const LIFECYCLE_LABEL: Record<string, string> = {
  Draft: "Bản nháp",
  Review: "Đang chờ duyệt",
  Approved: "Đã phê duyệt",
  Published: "Đã xuất bản",
  Archived: "Đã lưu trữ",
};

/**
 * Dashboard đọc dữ liệu thật (không mock) — số liệu lấy trực tiếp từ các
 * collection thật của Companion. 3 nút điều hướng thẳng tới đúng tab (qua
 * `?tab=`) thay vì lặp lại logic chuyển trạng thái đã có ở VersionsTab.
 */
export function OverviewTab({ aiConfigured }: { aiConfigured: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { items: versions, ready: versionsReady } = useCollection<VersionLog>("companion-versions", []);
  const { items: personas, ready: personaReady } = useCollection<Persona>("companion-persona", []);
  const { items: refs, ready: refsReady } = useCollection<KnowledgeRef>("companion-knowledge-refs", []);
  const { items: safetyRules, ready: safetyReady } = useCollection<SafetyRule>("companion-safety-rules", []);

  const ready = versionsReady && personaReady && refsReady && safetyReady;
  const currentPersona = personas.find((p) => p.id === "current");
  const currentStage = currentPersona?.status ?? "Draft";
  const published = [...versions].filter((v) => v.status === "Published").sort((a, b) => b.version - a.version)[0];
  const enabledKnowledgeCount = refs.filter((r) => r.enabled).length;

  function goToTab(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      {!ready ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Phiên bản đang hoạt động" value={published ? `v${published.version}` : "Chưa có"} />
            <StatCard label="Bản nháp hiện tại" value={LIFECYCLE_LABEL[currentStage] ?? currentStage} />
            <StatCard label="Nguồn tri thức đang bật" value={String(enabledKnowledgeCount)} />
            <StatCard label="Quy tắc an toàn" value={String(safetyRules.length)} />
          </div>

          <div className="space-y-2">
            {!aiConfigured && (
              <Warning>
                Chưa cấu hình nhà cung cấp AI — không ảnh hưởng tới việc soạn nội dung Companion ở các tab khác,
                chỉ liên quan tới hệ thống AI thật vận hành sau này.
              </Warning>
            )}
            {safetyRules.length === 0 && <Warning>Chưa có quy tắc an toàn nào — xem tab &quot;An toàn&quot;.</Warning>}
            {enabledKnowledgeCount === 0 && (
              <Warning>Chưa bật nguồn tri thức nào cho Companion — xem tab &quot;Tri thức&quot;.</Warning>
            )}
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
              Gửi duyệt / Xuất bản
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-gray-900">{value}</p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{children}</div>
  );
}
