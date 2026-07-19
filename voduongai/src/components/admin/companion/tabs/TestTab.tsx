"use client";

import { useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";

type KnowledgeRef = { id: string; sourceLabel: string; enabled: boolean };
type SafetyRule = { id: string; title: string; status: string };
type VersionLog = { id: string; version: number; status: string };
type TestSession = {
  id: string;
  version: string;
  question: string;
  verdict: string;
  notes: string;
  status: string;
};

/**
 * Tab "Kiểm tra Companion" — CHƯA có Chat runtime nào cho Companion
 * end-user (đã xác nhận qua rà soát toàn bộ codebase), nên KHÔNG giả lập
 * phản hồi. Chỉ hiển thị đúng trạng thái "Chưa kết nối" + những gì SẼ áp
 * dụng (nguồn tri thức đang bật, quy tắc an toàn) nếu runtime tồn tại. Log
 * kiểm thử ghi vào companion-test-sessions — KHÔNG đụng reflections/
 * memory_capsules (bảng người dùng thật).
 */
export function TestTab() {
  const { items: versions } = useCollection<VersionLog>("companion-versions", []);
  const { items: refs } = useCollection<KnowledgeRef>("companion-knowledge-refs", []);
  const { items: rules } = useCollection<SafetyRule>("companion-safety-rules", []);
  const { items: sessions, add, ready } = useCollection<TestSession>("companion-test-sessions", []);

  const [version, setVersion] = useState("draft");
  const [question, setQuestion] = useState("");
  const [verdict, setVerdict] = useState<"" | "Đạt" | "Chưa đạt">("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const enabledRefs = refs.filter((r) => r.enabled);
  const publishedVersions = versions.filter((v) => v.status === "Published");

  async function handleSave() {
    if (!question.trim() || !verdict) return;
    setSaving(true);
    try {
      await add({
        id: genId("companion-test-sessions"),
        version,
        question,
        verdict,
        notes,
        status: "Published",
      });
      setQuestion("");
      setVerdict("");
      setNotes("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Phiên bản kiểm tra
            </label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
            >
              <option value="draft">Bản nháp hiện tại</option>
              {publishedVersions.map((v) => (
                <option key={v.id} value={String(v.version)}>
                  Phiên bản đã xuất bản v{v.version}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Câu hỏi thử
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Nhập câu hỏi để hình dung Companion sẽ phản hồi thế nào..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          />
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Chưa kết nối hệ thống trả lời.</strong> Companion hiện chưa có hệ thống trò chuyện/AI thật nào
          để tạo phản hồi — khu vực này chỉ mô phỏng ngữ cảnh (nguồn tri thức + quy tắc an toàn sẽ áp dụng), không
          tạo câu trả lời giả.
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Nguồn tri thức sẽ áp dụng ({enabledRefs.length})
            </p>
            {enabledRefs.length === 0 ? (
              <p className="mt-1 text-xs text-gray-400">Chưa bật nguồn tri thức nào ở tab Tri thức.</p>
            ) : (
              <ul className="mt-1 space-y-1 text-sm text-gray-700">
                {enabledRefs.map((r) => (
                  <li key={r.id}>· {r.sourceLabel}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Quy tắc an toàn sẽ áp dụng ({rules.length})
            </p>
            {rules.length === 0 ? (
              <p className="mt-1 text-xs text-gray-400">Chưa có quy tắc an toàn nào ở tab An toàn.</p>
            ) : (
              <ul className="mt-1 space-y-1 text-sm text-gray-700">
                {rules.map((r) => (
                  <li key={r.id}>· {r.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVerdict("Đạt")}
            className={`rounded-lg px-4 py-2 text-sm font-bold ${
              verdict === "Đạt" ? "bg-emerald-600 text-white" : "border border-gray-200 text-gray-600"
            }`}
          >
            Đạt
          </button>
          <button
            type="button"
            onClick={() => setVerdict("Chưa đạt")}
            className={`rounded-lg px-4 py-2 text-sm font-bold ${
              verdict === "Chưa đạt" ? "bg-red-600 text-white" : "border border-gray-200 text-gray-600"
            }`}
          >
            Chưa đạt
          </button>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Ghi chú / yêu cầu chỉnh sửa (nếu có)"
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
        />

        <button
          type="button"
          disabled={saving || !question.trim() || !verdict}
          onClick={handleSave}
          className="mt-3 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          {saving ? "Đang lưu..." : "Ghi lại kết quả kiểm tra"}
        </button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700">Lịch sử kiểm tra ({sessions.length})</h3>
        {!ready ? (
          <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
        ) : sessions.length === 0 ? (
          <p className="mt-2 rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
            Chưa có lần kiểm tra nào.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {sessions.map((s) => (
              <div key={s.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{s.question}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      s.verdict === "Đạt" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.verdict}
                  </span>
                </div>
                {s.notes && <p className="mt-1 text-xs text-gray-500">{s.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
