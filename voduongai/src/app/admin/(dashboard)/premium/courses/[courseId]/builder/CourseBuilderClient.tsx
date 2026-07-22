"use client";

import { useState } from "react";
import { GripVertical, Trash2, Plus } from "lucide-react";
import {
  getCourseBuilderTree,
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  deleteLesson,
  reorderCourseTree,
  type CourseSection,
  type CourseLesson,
} from "./actions";
import { LessonEditorPanel } from "./LessonEditorPanel";

const SECTION_STATUS_OPTIONS = ["Draft", "Published", "Hidden"];

function statusBadgeClass(status: string) {
  if (status === "Published") return "bg-emerald-50 text-emerald-700";
  if (status === "Hidden") return "bg-gray-100 text-gray-500";
  return "bg-amber-50 text-amber-700";
}

type DragLesson = { id: number; sectionId: number };

export function CourseBuilderClient({
  courseId,
  initialSections,
}: {
  courseId: string;
  initialSections: CourseSection[];
}) {
  const [sections, setSections] = useState<CourseSection[]>(initialSections);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragSection, setDragSection] = useState<number | null>(null);
  const [dragLesson, setDragLesson] = useState<DragLesson | null>(null);

  const selectedLesson = sections.flatMap((s) => s.lessons).find((l) => l.id === selectedLessonId) ?? null;

  async function refresh() {
    const { sections: fresh } = await getCourseBuilderTree(courseId);
    setSections(fresh);
    return fresh;
  }

  async function handleAddSection() {
    setError(null);
    const result = await createSection(courseId, "Section mới");
    if (result.error) {
      setError(result.error);
      return;
    }
    await refresh();
  }

  async function handleSectionTitleBlur(section: CourseSection, newTitle: string) {
    if (!newTitle.trim() || newTitle.trim() === section.title) return;
    const result = await updateSection(section.id, courseId, { title: newTitle });
    if (result.error) {
      setError(result.error);
      await refresh();
      return;
    }
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, title: newTitle.trim() } : s)));
  }

  async function handleSectionStatusChange(section: CourseSection, newStatus: string) {
    const result = await updateSection(section.id, courseId, { status: newStatus });
    if (result.error) {
      setError(result.error);
      await refresh();
      return;
    }
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, status: newStatus } : s)));
  }

  async function handleDeleteSection(section: CourseSection) {
    const count = section.lessons.length;
    const message =
      count > 0
        ? `Xoá section "${section.title}"? Sẽ xoá cả ${count} bài học bên trong. Không thể hoàn tác.`
        : `Xoá section "${section.title}"? Không thể hoàn tác.`;
    if (!window.confirm(message)) return;

    const result = await deleteSection(section.id, courseId);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (section.lessons.some((l) => l.id === selectedLessonId)) setSelectedLessonId(null);
    await refresh();
  }

  async function handleAddLesson(section: CourseSection) {
    setError(null);
    const result = await createLesson(section.id, courseId, "Bài học mới");
    if (result.error) {
      setError(result.error);
      return;
    }
    const fresh = await refresh();
    const freshSection = fresh.find((s) => s.id === section.id);
    const newLesson = freshSection?.lessons[freshSection.lessons.length - 1];
    if (newLesson) setSelectedLessonId(newLesson.id);
  }

  async function handleDeleteLesson(lesson: CourseLesson) {
    if (!window.confirm(`Xoá bài học "${lesson.title}"? Không thể hoàn tác.`)) return;
    const result = await deleteLesson(lesson.id, courseId);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (selectedLessonId === lesson.id) setSelectedLessonId(null);
    await refresh();
  }

  async function commitTree(next: CourseSection[]) {
    setSections(next);
    const payload = next.map((s) => ({ id: s.id, lessonIds: s.lessons.map((l) => l.id) }));
    const result = await reorderCourseTree(courseId, payload);
    if (result.error) {
      setError(result.error);
      await refresh();
    }
  }

  async function handleSectionDrop(targetSectionId: number) {
    if (dragSection === null) return;
    const draggedId = dragSection;
    setDragSection(null);
    if (draggedId === targetSectionId) return;

    const fromIndex = sections.findIndex((s) => s.id === draggedId);
    const toIndex = sections.findIndex((s) => s.id === targetSectionId);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...sections];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    await commitTree(next);
  }

  /** Tính cây mới sau khi kéo 1 lesson vào `targetSectionId`, chèn trước
   * `targetLessonId` (hoặc cuối danh sách nếu null — dùng cho thả vào
   * khoảng trống/section rỗng). Xử lý cả 3 tình huống kéo-thả: đổi thứ
   * tự lesson trong cùng section, kéo lesson sang section khác, và (kết
   * hợp với handleSectionDrop) đổi thứ tự section. */
  function computeLessonMove(targetSectionId: number, targetLessonId: number | null): CourseSection[] | null {
    if (!dragLesson) return null;
    const { id: lessonId, sectionId: fromSectionId } = dragLesson;

    const next = sections.map((s) => ({ ...s, lessons: [...s.lessons] }));
    const fromSection = next.find((s) => s.id === fromSectionId);
    const toSection = next.find((s) => s.id === targetSectionId);
    if (!fromSection || !toSection) return null;

    const lessonIndex = fromSection.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) return null;
    const [movedLesson] = fromSection.lessons.splice(lessonIndex, 1);

    let insertIndex = toSection.lessons.length;
    if (targetLessonId !== null) {
      const idx = toSection.lessons.findIndex((l) => l.id === targetLessonId);
      if (idx !== -1) insertIndex = idx;
    }
    toSection.lessons.splice(insertIndex, 0, { ...movedLesson, section_id: targetSectionId });

    return next;
  }

  async function handleLessonDrop(targetSectionId: number, targetLessonId: number) {
    if (!dragLesson) return;
    const dragged = dragLesson;
    setDragLesson(null);
    if (dragged.id === targetLessonId) return;
    const next = computeLessonMove(targetSectionId, targetLessonId);
    if (next) await commitTree(next);
  }

  async function handleLessonDropAtEnd(targetSectionId: number) {
    if (!dragLesson) return;
    setDragLesson(null);
    const next = computeLessonMove(targetSectionId, null);
    if (next) await commitTree(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Section &amp; Lesson</h2>
          <button
            type="button"
            onClick={handleAddSection}
            className="flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Thêm Section
          </button>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}

        {sections.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-4 py-10 text-center text-sm text-gray-400">
            Chưa có section nào. Bấm &quot;Thêm Section&quot; để bắt đầu.
          </p>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleSectionDrop(section.id)}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div
                  draggable
                  onDragStart={() => setDragSection(section.id)}
                  className="flex cursor-grab items-center gap-2 border-b border-gray-100 px-4 py-3"
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-gray-300" />
                  <input
                    defaultValue={section.title}
                    key={section.id + section.title}
                    onBlur={(e) => handleSectionTitleBlur(section, e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-bold text-gray-900 focus:border-brand-blue focus:bg-white focus:outline-none"
                  />
                  <select
                    value={section.status}
                    onChange={(e) => handleSectionStatusChange(section, e.target.value)}
                    className="shrink-0 rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    {SECTION_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section)}
                    aria-label="Xoá section"
                    className="shrink-0 rounded-full p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleLessonDropAtEnd(section.id);
                  }}
                  className="space-y-1 p-3"
                >
                  {section.lessons.length === 0 ? (
                    <p className="px-2 py-3 text-center text-xs text-gray-400">Chưa có bài học nào trong section này.</p>
                  ) : (
                    section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          setDragLesson({ id: lesson.id, sectionId: section.id });
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.stopPropagation();
                          handleLessonDrop(section.id, lesson.id);
                        }}
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                          selectedLessonId === lesson.id
                            ? "border-brand-blue bg-brand-blue/5"
                            : "border-transparent hover:bg-gray-50"
                        }`}
                      >
                        <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-gray-300" />
                        <span className="min-w-0 flex-1 truncate text-gray-800">{lesson.title}</span>
                        {lesson.is_free_preview && (
                          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                            Xem thử
                          </span>
                        )}
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(lesson.status)}`}>
                          {lesson.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLesson(lesson);
                          }}
                          aria-label="Xoá bài học"
                          className="shrink-0 text-gray-300 transition hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() => handleAddLesson(section)}
                    className="mt-1 w-full rounded-lg border border-dashed border-gray-200 py-2 text-xs font-semibold text-gray-500 transition hover:border-brand-blue hover:text-brand-blue"
                  >
                    + Bài học
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <LessonEditorPanel courseId={courseId} lesson={selectedLesson} onSaved={refresh} />
      </div>
    </div>
  );
}
