"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import { LessonEditor } from "@/components/admin/lessons/LessonEditor";
import type { KnowledgeSeed } from "@/features/knowledge";

type LessonRow = KnowledgeSeed & { status?: string };

/**
 * "Lesson (Folder)" — Giai đoạn 1. Không dùng DataTable/slide-over chung
 * (schema ~30 field không vừa form phẳng) — tự quản danh sách Knowledge
 * Card + chuyển sang LessonEditor (form toàn trang) khi bấm Sửa. Chưa có
 * "Thêm mới" — tạo Lesson mới cần picker taxonomy/slug graph (Giai đoạn 2),
 * Giai đoạn 1 chỉ sửa nội dung 11 Lesson thật đã migrate.
 */
export function LessonAdminShell() {
  const { items, ready } = useCollection<LessonRow>("knowledge-seeds", []);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  if (editingSlug) {
    return <LessonEditor id={editingSlug} onBack={() => setEditingSlug(null)} />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-extrabold text-gray-900">
        Lesson (Folder){ready ? ` — ${items.length} Knowledge Card` : ""}
      </h1>

      {!ready ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          Chưa có Knowledge Card nào.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...items]
            .sort((a, b) => (a.collectionSlug ?? "").localeCompare(b.collectionSlug ?? ""))
            .map((lesson) => (
              <div
                key={lesson.slug}
                className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-blue/40"
              >
                <button
                  type="button"
                  onClick={() => setEditingSlug(lesson.slug)}
                  aria-label="Sửa"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:border-brand-blue hover:text-brand-blue"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {lesson.collectionSlug}
                </p>
                <p className="mt-1 pr-8 text-sm font-bold text-gray-900">{lesson.title}</p>
                <p className="mt-2 line-clamp-3 text-xs text-gray-500">{lesson.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                    {lesson.difficulty}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      lesson.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {lesson.status ?? "Draft"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingSlug(lesson.slug)}
                  className="mt-3 text-xs font-semibold text-brand-blue hover:underline"
                >
                  Sửa Nội dung tri thức →
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
