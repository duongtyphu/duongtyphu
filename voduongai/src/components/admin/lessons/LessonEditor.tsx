"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { FieldInput } from "@/components/admin/FieldInput";
import { toFormValueFor, fromFormValueFor, type FieldConfig } from "@/lib/admin/fields";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import type { KnowledgeSeed, KnowledgeSeedStep } from "@/features/knowledge";

type LessonRow = KnowledgeSeed & { status?: string };

/**
 * ~26 field CHO SỬA (Companion Content Standard + Knowledge Experience) +
 * 3 field downloadPack (xử lý riêng, không qua FieldConfig vì là object
 * lồng nhau — hệ field/FieldInput hiện chỉ hỗ trợ 1 cấp phẳng). KHÔNG gồm
 * id/slug/collectionSlug/relatedSeeds/steps/skills/aiTools/scenarios/
 * prerequisites/nextSeeds — đây là ID tham chiếu vào đồ thị tri thức/
 * taxonomy, hiển thị CHỈ ĐỌC ở panel riêng, chưa có picker để sửa an toàn
 * (Giai đoạn 2).
 */
const EDITABLE_FIELDS: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "subtitle", label: "Phụ đề", type: "text" },
  { key: "summary", label: "Tóm tắt", type: "textarea", full: true },
  { key: "goal", label: "Mục tiêu — goal (mỗi dòng 1 mục)", type: "textarea", transform: "newline-list" },
  { key: "persona", label: "Đối tượng — persona (mỗi dòng 1 mục)", type: "textarea", transform: "newline-list" },
  { key: "difficulty", label: "Cấp độ", type: "select", options: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], required: true },
  { key: "estimatedTime", label: "Thời gian ước tính", type: "text" },
  { key: "whyMatters", label: "Vì sao quan trọng", type: "textarea", full: true },
  { key: "problem", label: "Vấn đề", type: "textarea", full: true },
  { key: "coreIdea", label: "Ý tưởng cốt lõi", type: "textarea", full: true },
  { key: "whatYouWillGain", label: "Bạn sẽ đạt được gì (mỗi dòng 1 mục)", type: "textarea", full: true, transform: "newline-list" },
  { key: "guide", label: "Hướng dẫn", type: "textarea", full: true },
  { key: "guideSteps", label: "Các bước hướng dẫn (mỗi dòng 1 bước)", type: "textarea", full: true, transform: "newline-list" },
  { key: "samplePrompt", label: "Prompt mẫu", type: "textarea", full: true },
  { key: "promptTips", label: "Mẹo dùng Prompt (mỗi dòng 1 mẹo)", type: "textarea", transform: "newline-list" },
  { key: "promptExampleInput", label: "Ví dụ Prompt — đầu vào", type: "textarea" },
  { key: "promptExampleOutput", label: "Ví dụ Prompt — đầu ra", type: "textarea" },
  { key: "prompts", label: "Prompt Pack (mỗi dòng 1 prompt)", type: "textarea", full: true, transform: "newline-list" },
  { key: "example", label: "Ví dụ thực tế", type: "textarea", full: true },
  { key: "commonMistakes", label: "Lỗi thường gặp (mỗi dòng 1 lỗi)", type: "textarea", transform: "newline-list" },
  { key: "checklist", label: "Checklist (mỗi dòng 1 mục)", type: "textarea", transform: "newline-list" },
  { key: "exercise", label: "Bài tập", type: "textarea", full: true },
  { key: "reflectionQuestions", label: "Câu hỏi suy ngẫm (mỗi dòng 1 câu)", type: "textarea", full: true, transform: "newline-list" },
  { key: "companionNote", label: "Ghi chú từ Companion", type: "textarea", full: true },
  { key: "nextStep", label: "Bước tiếp theo", type: "textarea", full: true },
  { key: "skillsGained", label: "Kỹ năng đạt được (mỗi dòng 1 kỹ năng)", type: "textarea", full: true, transform: "newline-list" },
];

const STEP_TYPE_LABEL: Record<string, string> = {
  GUIDE: "Hướng dẫn",
  PROMPT: "Prompt",
  CHECKLIST: "Checklist",
  TEMPLATE: "Template",
  SOP: "SOP",
  CASE_STUDY: "Case Study",
  EXERCISE: "Bài tập",
  REFLECTION: "Suy ngẫm",
  FRAMEWORK: "Framework",
};

function toFormState(source: LessonRow): Record<string, unknown> {
  const next: Record<string, unknown> = { ...(source as unknown as Record<string, unknown>) };
  for (const f of EDITABLE_FIELDS) {
    if (f.transform) next[f.key] = toFormValueFor(f, (source as Record<string, unknown>)[f.key]);
  }
  return next;
}

export function LessonEditor({ id, onBack }: { id: string; onBack: () => void }) {
  const { items, ready, update } = useCollection<LessonRow>("knowledge-seeds", []);
  const existing = items.find((item) => item.slug === id || item.id === id) ?? null;

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [downloadPack, setDownloadPack] = useState({ promptPackLabel: "", checklistLabel: "", templateLabel: "" });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [email, setEmail] = useState("admin");

  useEffect(() => {
    getSupabaseBrowser()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? "admin"));
  }, []);

  useEffect(() => {
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(toFormState(existing));
      setDownloadPack({
        promptPackLabel: existing.downloadPack?.promptPackLabel ?? "",
        checklistLabel: existing.downloadPack?.checklistLabel ?? "",
        templateLabel: existing.downloadPack?.templateLabel ?? "",
      });
      setSaveState("idle");
    }
  }, [existing]);

  const isDirty = useMemo(() => {
    if (!existing) return false;
    const fieldsDirty = EDITABLE_FIELDS.some(
      (f) => JSON.stringify(form[f.key] ?? null) !== JSON.stringify((existing as Record<string, unknown>)[f.key] ?? null),
    );
    const packDirty = JSON.stringify(downloadPack) !== JSON.stringify(existing.downloadPack ?? {});
    return fieldsDirty || packDirty;
  }, [form, downloadPack, existing]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty && saveState !== "saving") e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveState]);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveState("dirty");
  }

  function setPackField(key: keyof typeof downloadPack, value: string) {
    setDownloadPack((prev) => ({ ...prev, [key]: value }));
    setSaveState("dirty");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!existing) return;
    setSaveState("saving");
    try {
      const payload: Record<string, unknown> = { ...form, downloadPack, updatedBy: email, updatedAt: new Date().toISOString() };
      for (const f of EDITABLE_FIELDS) {
        if (f.transform) payload[f.key] = fromFormValueFor(f, payload[f.key]);
      }
      await update(existing.id, payload as Partial<LessonRow>);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  if (!ready) {
    return <p className="text-sm text-gray-500">Đang tải...</p>;
  }

  if (!existing) {
    return (
      <div className="space-y-4">
        <BackButton onBack={onBack} />
        <p className="text-sm text-gray-500">Không tìm thấy Knowledge Card này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <BackButton onBack={onBack} />
        <SaveStateBadge state={saveState} isDirty={isDirty} />
      </div>

      <div>
        <h2 className="text-base font-extrabold text-gray-900">{existing.title || existing.slug}</h2>
        <p className="mt-1 text-xs text-gray-500">Nội dung tri thức — {existing.slug}</p>
      </div>

      <ReadOnlyPanel lesson={existing} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:grid-cols-2">
          {EDITABLE_FIELDS.map((f) => (
            <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                {f.label}
                {f.required && <span className="text-red-500"> *</span>}
              </label>
              <FieldInput field={f} value={form[f.key]} onChange={(value) => setField(f.key, value)} />
            </div>
          ))}

          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Download Pack (nhãn hiển thị)</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Nhãn Prompt Pack</label>
                <input
                  type="text"
                  value={downloadPack.promptPackLabel}
                  onChange={(e) => setPackField("promptPackLabel", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Nhãn Checklist</label>
                <input
                  type="text"
                  value={downloadPack.checklistLabel}
                  onChange={(e) => setPackField("checklistLabel", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Nhãn Template</label>
                <input
                  type="text"
                  value={downloadPack.templateLabel}
                  onChange={(e) => setPackField("templateLabel", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saveState === "saving" || !isDirty}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {saveState === "saving" ? "Đang lưu..." : "Lưu"}
        </button>
      </form>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-blue"
    >
      <ArrowLeft className="h-4 w-4" />
      Quay lại danh sách
    </button>
  );
}

/** CHỈ ĐỌC — id/slug/collectionSlug/relatedSeeds/steps/skills/aiTools/
 * scenarios/prerequisites/nextSeeds là ID tham chiếu vào đồ thị tri thức
 * (Thư viện AI + tự tham chiếu Lesson khác + taxonomy) — Giai đoạn 1 chưa
 * có picker chọn từ danh sách thật nên không cho sửa tay, tránh gõ sai 1
 * slug làm gãy đồ thị. */
function ReadOnlyPanel({ lesson }: { lesson: LessonRow }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">
        Chỉ đọc — tham chiếu đồ thị tri thức (sửa ở Giai đoạn 2)
      </p>
      <div className="grid gap-3 text-xs text-blue-900 sm:grid-cols-2">
        <ReadOnlyField label="ID nội bộ" value={lesson.id} />
        <ReadOnlyField label="Slug (không đổi được)" value={lesson.slug} />
        <ReadOnlyField label="Thuộc bộ sưu tập (collectionSlug)" value={lesson.collectionSlug} />
        <ReadOnlyTags label="Lesson liên quan (relatedSeeds)" values={lesson.relatedSeeds} />
        <ReadOnlyTags label="Cần học trước (prerequisites)" values={lesson.prerequisites} />
        <ReadOnlyTags label="Nên học sau (nextSeeds)" values={lesson.nextSeeds} />
        <ReadOnlyTags label="Kỹ năng (skills)" values={lesson.skills} />
        <ReadOnlyTags label="Công cụ AI (aiTools)" values={lesson.aiTools} />
        <ReadOnlyTags label="Tình huống (scenarios)" values={lesson.scenarios} />
      </div>

      {lesson.steps && lesson.steps.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
            Các bước trong hành trình (steps)
          </p>
          <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-blue-100 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Loại</th>
                  <th className="px-3 py-2">Tiêu đề</th>
                  <th className="px-3 py-2">Asset</th>
                  <th className="px-3 py-2">Bắt buộc</th>
                </tr>
              </thead>
              <tbody>
                {lesson.steps.map((step: KnowledgeSeedStep) => (
                  <tr key={step.id} className="border-b border-blue-50 last:border-0 text-gray-700">
                    <td className="px-3 py-2">{step.order}</td>
                    <td className="px-3 py-2">{STEP_TYPE_LABEL[step.type] ?? step.type}</td>
                    <td className="px-3 py-2">{step.title}</td>
                    <td className="px-3 py-2">{step.assetId ?? <span className="text-gray-400">Sắp có</span>}</td>
                    <td className="px-3 py-2">{step.required ? "Có" : "Không"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">{label}</p>
      <p className="mt-0.5 font-mono text-xs text-blue-900">{value || "—"}</p>
    </div>
  );
}

function ReadOnlyTags({ label, values }: { label: string; values?: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {values && values.length > 0 ? (
          values.map((v) => (
            <span key={v} className="rounded-full bg-white px-2 py-0.5 font-mono text-[11px] text-blue-800">
              {v}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </div>
    </div>
  );
}
