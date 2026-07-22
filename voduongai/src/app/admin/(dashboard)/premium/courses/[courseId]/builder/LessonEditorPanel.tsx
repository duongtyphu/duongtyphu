"use client";

import { useEffect, useState } from "react";
import { FieldInput } from "@/components/admin/FieldInput";
import type { FieldConfig } from "@/lib/admin/fields";
import { updateLesson, type CourseLesson } from "./actions";

/** Tái dùng FieldInput (đã tách khỏi DataTableRowPanel để dùng chung) —
 * không viết lại logic render input theo FieldType lần 2. */
const LESSON_FIELDS: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "video_url", label: "Video URL", type: "text", placeholder: "https://..." },
  { key: "content", label: "Nội dung bài học (markdown)", type: "textarea", full: true },
  { key: "duration_minutes", label: "Thời lượng (phút)", type: "number" },
  { key: "is_free_preview", label: "Cho xem thử miễn phí (không cần mua khoá)", type: "boolean" },
  { key: "status", label: "Trạng thái xuất bản", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export function LessonEditorPanel({
  courseId,
  lesson,
  onSaved,
}: {
  courseId: string;
  lesson: CourseLesson | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Record<string, unknown>>(() => ({ ...(lesson ?? {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Re-seeds form state when a different lesson is selected — no render-time
    // equivalent since `lesson` arrives as a prop from the tree's click handler,
    // not derivable (same pattern as DataTableRowPanel.tsx).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...(lesson ?? {}) });
    setError(null);
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center text-sm text-gray-400">
        Chọn 1 bài học ở cột trái để sửa nội dung — hoặc bấm &quot;+ Bài học&quot; để tạo mới.
      </div>
    );
  }

  const currentLesson = lesson;

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await updateLesson(currentLesson.id, courseId, {
      title: String(form.title ?? ""),
      video_url: (form.video_url as string) || null,
      content: (form.content as string) || null,
      duration_minutes: Number(form.duration_minutes ?? 0),
      is_free_preview: Boolean(form.is_free_preview),
      status: String(form.status ?? "Draft"),
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900">Sửa bài học</h2>
      {LESSON_FIELDS.map((f) => (
        <div key={f.key} className={f.full ? "col-span-2" : ""}>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {f.label}
            {f.required && <span className="text-red-500"> *</span>}
          </label>
          <FieldInput field={f} value={form[f.key]} onChange={(value) => setField(f.key, value)} />
        </div>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Lưu bài học"}
      </button>
    </form>
  );
}
