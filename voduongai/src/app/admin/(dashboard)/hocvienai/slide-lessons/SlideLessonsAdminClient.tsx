"use client";

import { useEffect, useMemo, useState } from "react";

import { useCollection } from "@/lib/admin/store";
import { FieldInput } from "@/components/admin/FieldInput";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import type { FieldConfig } from "@/lib/admin/fields";
import { ACADEMY_LESSON_GROUPS, type AcademyLessonGroup, type AcademySlide } from "@/lib/portal/live-academy-slides";

/** Shape phẳng item useCollection() trả về — khớp `academy_slide_lessons.data`. */
type LessonItem = {
  id: string;
  status: string;
  group: AcademyLessonGroup;
  categoryLabel: string;
  title: string;
  summary: string;
  isFreePreview: boolean;
  slides: AcademySlide[];
};

const META_FIELDS: FieldConfig[] = [
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
  { key: "categoryLabel", label: "Tên nhóm/chủ đề", type: "text", required: true },
  { key: "title", label: "Tiêu đề bài học", type: "text", required: true },
  { key: "summary", label: "Tóm tắt (1-2 câu)", type: "textarea", full: true },
];

/**
 * Định dạng thô cho ô "Nội dung slide" — mỗi slide bắt đầu bằng 1 dòng
 * "## Tiêu đề slide", phần còn lại tới dòng "## " kế tiếp là nội dung.
 * Chọn định dạng text đơn giản (không JSON) vì Admin cần soạn nội dung
 * trực tiếp trong 1 ô — tránh phải xây UI thêm/xoá/kéo-thả từng slide
 * riêng (việc lớn hơn, ngoài phạm vi mục 4b).
 */
function slidesToRaw(slides: AcademySlide[]): string {
  return slides.map((s) => `## ${s.heading}\n${s.body}`).join("\n\n");
}

function rawToSlides(raw: string): AcademySlide[] {
  const blocks = raw.split(/\n(?=## )/g).map((b) => b.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      const headingLine = lines[0]?.replace(/^##\s*/, "").trim() ?? "";
      const body = lines.slice(1).join("\n").trim();
      return { heading: headingLine, body };
    })
    .filter((s) => s.heading.length > 0);
}

const GROUP_LABEL: Record<AcademyLessonGroup, string> = Object.fromEntries(
  ACADEMY_LESSON_GROUPS.map((g) => [g.key, g.label]),
) as Record<AcademyLessonGroup, string>;

export function SlideLessonsAdminClient() {
  const { items, ready, update } = useCollection<LessonItem>("academy-slide-lessons", []);
  const [activeGroup, setActiveGroup] = useState<AcademyLessonGroup>("nhu-cau");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const groupItems = useMemo(
    () => items.filter((i) => i.group === activeGroup).sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel, "vi")),
    [items, activeGroup],
  );
  const selected = items.find((i) => i.id === selectedId) ?? null;

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [slidesRaw, setSlidesRaw] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (selected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({ ...selected });
      setSlidesRaw(slidesToRaw(selected.slides ?? []));
      setSaveState("idle");
    }
  }, [selected]);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveState("dirty");
  }

  async function handleSave() {
    if (!selected) return;
    setSaveState("saving");
    try {
      await update(selected.id, {
        ...form,
        slides: rawToSlides(slidesRaw),
      } as Partial<LessonItem>);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {ACADEMY_LESSON_GROUPS.map((g) => {
            const count = items.filter((i) => i.group === g.key).length;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setActiveGroup(g.key)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                  activeGroup === g.key
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-blue"
                }`}
              >
                {g.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="max-h-[70vh] space-y-1.5 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2">
          {!ready ? (
            <p className="p-3 text-xs text-gray-400">Đang tải...</p>
          ) : groupItems.length === 0 ? (
            <p className="p-3 text-xs text-gray-400">Chưa có bài nào ở nhóm này.</p>
          ) : (
            groupItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  item.id === selectedId ? "bg-brand-blue/10 font-bold text-brand-blue" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{item.categoryLabel}</span>
                  {item.status !== "Published" ? (
                    <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                      {item.status}
                    </span>
                  ) : null}
                </div>
                <div className="mt-0.5 truncate text-xs text-gray-400">{(item.slides ?? []).length} slide</div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        {!selected ? (
          <p className="text-sm text-gray-400">Chọn 1 bài học ở danh sách bên trái để soạn nội dung.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">
                {GROUP_LABEL[selected.group]} · {selected.categoryLabel}
              </h2>
              <div className="flex items-center gap-3">
                <SaveStateBadge state={saveState} isDirty={saveState === "dirty"} />
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-brand-blue px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-blue/90"
                >
                  Lưu
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {META_FIELDS.map((f) => (
                <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-bold text-gray-600">{f.label}</label>
                  <FieldInput field={f} value={form[f.key]} onChange={(v) => setField(f.key, v)} />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-600">Miễn phí xem thử?</label>
                <select
                  value={form.isFreePreview ? "true" : "false"}
                  onChange={(e) => setField("isFreePreview", e.target.value === "true")}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
                >
                  <option value="false">Không — khoá Premium</option>
                  <option value="true">Có — xem miễn phí</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Nội dung slide</span>
                <span className="font-normal text-gray-400">Mỗi slide bắt đầu 1 dòng &quot;## Tiêu đề&quot;</span>
              </label>
              <textarea
                value={slidesRaw}
                onChange={(e) => {
                  setSlidesRaw(e.target.value);
                  setSaveState("dirty");
                }}
                rows={20}
                placeholder={"## Vì sao cần biết\nNội dung slide đầu tiên...\n\n## Cách làm cụ thể\nNội dung slide tiếp theo..."}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-gray-900 focus:border-brand-blue focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">
                Xem trước: {rawToSlides(slidesRaw).length} slide sẽ được lưu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
