"use client";

import { useEffect, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Persona = Record<string, unknown> & { id: string; status?: string };
type Strategy = Record<string, unknown> & { id: string; status?: string };

type VersionLog = {
  id: string;
  version: number;
  changedBy: string;
  approvedBy: string;
  changeSummary: string;
  releaseNotes: string;
  publishedAt: string | null;
  snapshot: {
    persona: Record<string, unknown>;
    conversationStrategy: Record<string, unknown>;
    coachingStrategy: Record<string, unknown>;
  };
  status: string; // Draft | Review | Approved | Published | Archived
};

const DIFF_FIELDS: { key: string; label: string }[] = [
  { key: "name", label: "Tên Companion" },
  { key: "mission", label: "Sứ mệnh" },
  { key: "personality", label: "Tính cách" },
  { key: "greeting", label: "Câu chào" },
];

const SINGLETON_ID = "current";
const LIFECYCLE_LABEL: Record<string, string> = {
  Draft: "Bản nháp",
  Review: "Đang chờ duyệt",
  Approved: "Đã phê duyệt",
  Published: "Đã xuất bản",
  Archived: "Đã lưu trữ",
};

/**
 * Phạm vi phiên bản hoá trong lần build này: chỉ 3 bảng singleton "cốt lõi"
 * (Nhân cách + chiến lược Hội thoại + chiến lược Dẫn dắt & Huấn luyện) —
 * chưa gồm Tri thức/Trí nhớ/Công cụ/An toàn (danh sách, không phải nội
 * dung "bản sắc" của Companion). Ghi rõ trong báo cáo thiết kế.
 */
export function VersionsTab() {
  const persona = useCollection<Persona>("companion-persona", []);
  const convStrategy = useCollection<Strategy>("companion-conversation-strategy", []);
  const coachStrategy = useCollection<Strategy>("companion-coaching-strategy", []);
  const versions = useCollection<VersionLog>("companion-versions", []);

  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getSupabaseBrowser()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? "admin"));
  }, []);

  const currentPersona = persona.items.find((i) => i.id === SINGLETON_ID);
  const currentStage = (currentPersona?.status as string) ?? "Draft";
  const history = [...versions.items].sort((a, b) => b.version - a.version);
  const nextVersion = (history[0]?.version ?? 0) + 1;
  const published = history.find((v) => v.status === "Published");

  async function setStageAll(status: string) {
    await Promise.all([
      persona.update(SINGLETON_ID, { status } as Partial<Persona>),
      convStrategy.update(SINGLETON_ID, { status } as Partial<Strategy>),
      coachStrategy.update(SINGLETON_ID, { status } as Partial<Strategy>),
    ]);
  }

  async function logVersion(status: string, changeSummary: string) {
    const previousApprovedBy = history.find((v) => v.approvedBy)?.approvedBy ?? "";
    await versions.add({
      id: genId("companion-versions"),
      version: nextVersion,
      changedBy: email,
      approvedBy: status === "Approved" || status === "Published" ? email : previousApprovedBy,
      changeSummary,
      releaseNotes: status === "Published" ? releaseNotes.trim() : "",
      publishedAt: status === "Published" ? new Date().toISOString() : null,
      snapshot: {
        persona: currentPersona ?? {},
        conversationStrategy: convStrategy.items.find((i) => i.id === SINGLETON_ID) ?? {},
        coachingStrategy: coachStrategy.items.find((i) => i.id === SINGLETON_ID) ?? {},
      },
      status,
    });
  }

  async function transition(nextStatus: string, defaultSummary: string) {
    setBusy(true);
    try {
      await setStageAll(nextStatus);
      await logVersion(nextStatus, summary.trim() || defaultSummary);
      setSummary("");
      setReleaseNotes("");
    } finally {
      setBusy(false);
    }
  }

  async function rollback(entry: VersionLog) {
    if (!window.confirm(`Khôi phục về phiên bản v${entry.version}? Bản nháp hiện tại sẽ bị ghi đè.`)) return;
    setBusy(true);
    try {
      await Promise.all([
        persona.update(SINGLETON_ID, { ...entry.snapshot.persona, status: "Draft" } as Partial<Persona>),
        convStrategy.update(SINGLETON_ID, { ...entry.snapshot.conversationStrategy, status: "Draft" } as Partial<Strategy>),
        coachStrategy.update(SINGLETON_ID, { ...entry.snapshot.coachingStrategy, status: "Draft" } as Partial<Strategy>),
      ]);
      await versions.add({
        id: genId("companion-versions"),
        version: nextVersion,
        changedBy: email,
        approvedBy: "",
        changeSummary: `Khôi phục từ phiên bản v${entry.version}`,
        releaseNotes: "",
        publishedAt: null,
        snapshot: entry.snapshot,
        status: "Draft",
      });
    } finally {
      setBusy(false);
    }
  }

  const ready = persona.ready && convStrategy.ready && coachStrategy.ready && versions.ready;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Phạm vi phiên bản hoá hiện tại: Nhân cách + 2 chiến lược chung (Hội thoại, Dẫn dắt &amp; Huấn luyện). Tri
        thức/Trí nhớ/An toàn/Công cụ chưa nằm trong lịch sử phiên bản này.
      </p>

      {!ready ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái hiện tại</p>
                <p className="mt-1 text-lg font-extrabold text-gray-900">
                  {LIFECYCLE_LABEL[currentStage] ?? currentStage}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                Phiên bản tiếp theo: v{nextVersion}
              </span>
            </div>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ghi chú thay đổi nội bộ (tuỳ chọn)"
              rows={2}
              className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
            />

            {currentStage === "Approved" && (
              <textarea
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                placeholder="Ghi chú phát hành (hiển thị cùng phiên bản khi Xuất bản)"
                rows={2}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || currentStage !== "Draft"}
                onClick={() => transition("Review", "Gửi duyệt")}
                className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
              >
                Gửi duyệt
              </button>
              <button
                type="button"
                disabled={busy || currentStage !== "Review"}
                onClick={() => transition("Draft", "Yêu cầu chỉnh sửa")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
              >
                Yêu cầu chỉnh sửa
              </button>
              <button
                type="button"
                disabled={busy || currentStage !== "Review"}
                onClick={() => transition("Approved", "Phê duyệt")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
              >
                Phê duyệt
              </button>
              <button
                type="button"
                disabled={busy || currentStage !== "Approved"}
                onClick={() => transition("Published", "Xuất bản")}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
              >
                Xuất bản
              </button>
              <button
                type="button"
                disabled={busy || currentStage !== "Published"}
                onClick={() => transition("Archived", "Lưu trữ")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
              >
                Lưu trữ
              </button>
            </div>
          </div>

          {published && <DiffView current={currentPersona ?? {}} publishedSnapshot={published.snapshot.persona} />}

          <div>
            <h3 className="text-sm font-bold text-gray-700">Lịch sử phiên bản (approval history)</h3>
            {history.length === 0 ? (
              <p className="mt-2 rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
                Chưa có phiên bản nào — bấm &quot;Gửi duyệt&quot; ở trên để bắt đầu. Nếu bạn vừa apply migration
                Phase 7, đây là trạng thái ban đầu đúng — chưa có lịch sử nào để hiển thị, không phải lỗi.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                {history.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        v{v.version} — {LIFECYCLE_LABEL[v.status] ?? v.status}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {v.changeSummary} · sửa bởi {v.changedBy}
                        {v.approvedBy ? ` · duyệt bởi ${v.approvedBy}` : ""}
                        {v.publishedAt ? ` · xuất bản ${new Date(v.publishedAt).toLocaleString("vi-VN")}` : ""}
                      </p>
                      {v.releaseNotes && <p className="mt-1 truncate text-xs italic text-gray-400">&quot;{v.releaseNotes}&quot;</p>}
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => rollback(v)}
                      className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                      Khôi phục
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/** So sánh bản nháp hiện tại với snapshot của phiên bản Published gần nhất — chỉ vài field đại diện, đủ để Founder thấy đã đổi gì trước khi Xuất bản. */
function DiffView({ current, publishedSnapshot }: { current: Record<string, unknown>; publishedSnapshot: Record<string, unknown> }) {
  const rows = DIFF_FIELDS.map((f) => ({
    ...f,
    before: String(publishedSnapshot[f.key] ?? ""),
    after: String(current[f.key] ?? ""),
  })).filter((r) => r.before !== r.after);

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
        Bản nháp hiện tại giống với phiên bản Published gần nhất — không có thay đổi để so sánh.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-bold text-gray-700">So sánh với phiên bản Published gần nhất</h3>
      <div className="mt-3 space-y-3">
        {rows.map((r) => (
          <div key={r.key}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{r.label}</p>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 line-through">{r.before || "(trống)"}</p>
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{r.after || "(trống)"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
