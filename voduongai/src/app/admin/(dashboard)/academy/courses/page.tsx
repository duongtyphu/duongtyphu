"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { ACADEMY_WORKSPACE_SECTIONS } from "@/lib/admin/academy/navigation";
import { useAdminToast } from "@/lib/admin/toast";
import {
  listCourseOptions,
  listModules,
  listLessons,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  type CourseOption,
  type CourseModule,
  type CourseLesson,
} from "./actions";

const inputClass = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none";

/**
 * STABILIZATION-SPR-1101 Task 2 — Nội dung khoá học (Topic/Module/Chapter/
 * Lesson/Video/PDF/Document/Download/Prompt reference/Template reference/
 * Sort order/Visibility/Publish). Academy sở hữu course STRUCTURE (Task 2.3)
 * — Premium (`/admin/course-pricing`) vẫn sở hữu giá/mở-đóng đăng ký, không
 * đụng vào đây. Ghi trực tiếp bảng course_modules/course_lessons (mới,
 * supabase-premium-learning-content-migration.sql) qua Server Actions
 * (actions.ts) — không qua generic useCollection (2 bảng có cột typed thật,
 * không phải jsonb).
 */
function LessonRow({ lesson, onChange }: { lesson: CourseLesson; onChange: () => void }) {
  const { push } = useAdminToast();
  const [form, setForm] = useState(lesson);
  const [open, setOpen] = useState(false);

  async function save() {
    const { error } = await updateLesson(lesson.id, {
      title: form.title,
      video_url: form.video_url,
      pdf_url: form.pdf_url,
      document_url: form.document_url,
      download_url: form.download_url,
      prompt_ref: form.prompt_ref,
      template_ref: form.template_ref,
      exercise_note: form.exercise_note,
      bonus_note: form.bonus_note,
      sort_order: form.sort_order,
      visible: form.visible,
      status: form.status,
    });
    if (error) push(error, "error");
    else {
      push("Đã lưu bài học.");
      onChange();
    }
  }

  async function remove() {
    const { error } = await deleteLesson(lesson.id);
    if (error) push(error, "error");
    else {
      push("Đã xóa bài học.", "info");
      onChange();
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-white/80">
        <span className="flex items-center gap-2">
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          {form.title || "(chưa đặt tên)"}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${form.status === "Published" ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"}`}>
          {form.status}
        </span>
      </button>
      {open && (
        <div className="space-y-2 border-t border-white/10 p-3">
          <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Tên bài học" className={inputClass} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input value={form.video_url ?? ""} onChange={(e) => setForm((s) => ({ ...s, video_url: e.target.value }))} placeholder="Video URL" className={inputClass} />
            <input value={form.pdf_url ?? ""} onChange={(e) => setForm((s) => ({ ...s, pdf_url: e.target.value }))} placeholder="PDF URL" className={inputClass} />
            <input value={form.document_url ?? ""} onChange={(e) => setForm((s) => ({ ...s, document_url: e.target.value }))} placeholder="Document URL" className={inputClass} />
            <input value={form.download_url ?? ""} onChange={(e) => setForm((s) => ({ ...s, download_url: e.target.value }))} placeholder="Download URL" className={inputClass} />
            <input value={form.prompt_ref ?? ""} onChange={(e) => setForm((s) => ({ ...s, prompt_ref: e.target.value }))} placeholder="Prompt tham chiếu (VD: prompts:p1)" className={inputClass} />
            <input value={form.template_ref ?? ""} onChange={(e) => setForm((s) => ({ ...s, template_ref: e.target.value }))} placeholder="Template tham chiếu" className={inputClass} />
          </div>
          <textarea value={form.exercise_note ?? ""} onChange={(e) => setForm((s) => ({ ...s, exercise_note: e.target.value }))} placeholder="Bài tập" rows={2} className={inputClass} />
          <textarea value={form.bonus_note ?? ""} onChange={(e) => setForm((s) => ({ ...s, bonus_note: e.target.value }))} placeholder="Bonus" rows={2} className={inputClass} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-white/60">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((s) => ({ ...s, visible: e.target.checked }))} />
              Hiện
            </label>
            <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as CourseLesson["status"] }))} className={`${inputClass} w-auto`}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <input type="number" value={form.sort_order} onChange={(e) => setForm((s) => ({ ...s, sort_order: Number(e.target.value) }))} className={`${inputClass} w-24`} />
            <button onClick={save} className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:opacity-90">
              Lưu
            </button>
            <button onClick={remove} className="ml-auto rounded-lg p-1.5 text-red-300 hover:bg-red-500/10" aria-label="Xóa bài học">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleBlock({ module: mod, onChange }: { module: CourseModule; onChange: () => void }) {
  const { push } = useAdminToast();
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState(mod.title);
  const [visible, setVisible] = useState(mod.visible);
  const [sortOrder, setSortOrder] = useState(mod.sort_order);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  async function load() {
    setLessons(await listLessons(mod.id));
    setReady(true);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod.id]);

  async function saveTitle() {
    const { error } = await updateModule(mod.id, { title, visible, sort_order: sortOrder });
    if (error) push(error, "error");
    else push("Đã lưu chủ đề/chương.");
  }

  async function removeModule() {
    const { error } = await deleteModule(mod.id);
    if (error) push(error, "error");
    else {
      push("Đã xóa chủ đề/chương.", "info");
      onChange();
    }
  }

  async function addLesson() {
    const { error } = await createLesson(mod.id, newLessonTitle, lessons.length + 1);
    if (error) push(error, "error");
    else {
      setNewLessonTitle("");
      push("Đã thêm bài học.");
      load();
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} flex-1`} />
        <label className="flex items-center gap-1.5 text-xs text-white/60">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Hiện
        </label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          aria-label="Thứ tự chủ đề/chương"
          className={`${inputClass} w-20`}
        />
        <button onClick={saveTitle} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
          Lưu
        </button>
        <button onClick={removeModule} className="rounded-lg p-1.5 text-red-300 hover:bg-red-500/10" aria-label="Xóa chủ đề">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 pl-2">
        {!ready ? (
          <p className="text-xs text-white/40">Đang tải...</p>
        ) : (
          lessons.map((l) => <LessonRow key={l.id} lesson={l} onChange={load} />)
        )}
        <div className="flex gap-2">
          <input value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="+ Tên bài học mới" className={inputClass} />
          <button onClick={addLesson} className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AcademyCoursesPage() {
  const { push } = useAdminToast();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [ready, setReady] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  useEffect(() => {
    listCourseOptions().then((list) => {
      setCourses(list);
      if (list[0]) setCourseId(list[0].id);
    });
  }, []);

  async function loadModules() {
    if (courseId == null) return;
    setReady(false);
    setModules(await listModules(courseId));
    setReady(true);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function addModule() {
    if (courseId == null) return;
    const { error } = await createModule(courseId, newModuleTitle, modules.length + 1);
    if (error) push(error, "error");
    else {
      setNewModuleTitle("");
      push("Đã thêm chủ đề/chương.");
      loadModules();
    }
  }

  return (
    <AdminWorkspaceShell title="Học viện AI" description="" rootHref="/admin/academy" sections={ACADEMY_WORKSPACE_SECTIONS}>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-white">Nội dung khoá học</h1>
          <p className="mt-1 text-sm text-white/50">
            Quản lý Chủ đề/Chương → Bài học → Video/PDF/Document/Download/Prompt tham chiếu/Template tham chiếu/Bài
            tập/Bonus cho từng khoá (Lớp AI Cơ bản/Nâng cao/OpenClaw...). Giá/mở-đóng đăng ký quản lý riêng ở{" "}
            <a href="/admin/course-pricing" className="text-brand-blue hover:underline">/admin/course-pricing</a>.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Khoá học</label>
          <select value={courseId ?? ""} onChange={(e) => setCourseId(Number(e.target.value))} className={`${inputClass} max-w-sm`}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {!ready ? (
          <div className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ) : (
          <div className="space-y-4">
            {modules.map((m) => (
              <ModuleBlock key={m.id} module={m} onChange={loadModules} />
            ))}
            {modules.length === 0 && <p className="text-sm text-white/40">Chưa có chủ đề/chương nào cho khoá này.</p>}
            <div className="flex gap-2">
              <input value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} placeholder="+ Tên chủ đề/chương mới" className={inputClass} />
              <button onClick={addModule} className="shrink-0 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
                Thêm chương
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminWorkspaceShell>
  );
}
