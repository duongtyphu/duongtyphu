"use client";

/**
 * GOAL-001 — Goal Creation Runtime — Form "Tạo Goal mới".
 *
 * User tự tạo Goal của riêng họ qua `createGoalDraft()` (goal-runtime.ts)
 * — không dùng Goal mẫu. Save xong → Validate → Lưu → Goal ID + status
 * "draft" + Created By/At → redirect thẳng về Goal Detail
 * (`/portal/goals/[goalId]`).
 */

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createGoalDraft, type GoalPriority } from "@/lib/portal/foundation/goal-runtime";

const GOAL_CATEGORY_OPTIONS = ["Marketing", "Sản phẩm", "Vận hành", "Học tập", "Cá nhân", "Khác"];
const GOAL_TYPE_OPTIONS = ["Nội dung", "Sản phẩm", "Nghiên cứu", "Vận hành", "Khác"];

export function GoalCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(GOAL_CATEGORY_OPTIONS[0]);
  const [goalType, setGoalType] = useState(GOAL_TYPE_OPTIONS[0]);
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [expectedDeliverable, setExpectedDeliverable] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // 1. Validate
    if (!title.trim()) {
      setError("Goal Title là bắt buộc.");
      return;
    }

    // 2-6. Lưu Database (localStorage-backed Goal Runtime) -> sinh Goal ID, status = draft, createdBy, createdAt.
    const goal = createGoalDraft({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      goalType,
      priority,
      expectedDeliverable: expectedDeliverable.trim() || undefined,
      dueDate: dueDate || undefined,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    // 7. Redirect về Goal Detail
    router.push(`/portal/goals/${goal.goalId}`);
  }

  return (
    <div className="space-y-6 rounded-3xl p-6 md:p-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal/goals" className="hover:text-gray-700 transition">Goal Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-900">Tạo Goal mới</span>
      </nav>

      <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">Tạo Goal mới</h1>
        <p className="mt-2 text-sm text-gray-500">
          Goal của riêng bạn — không phải Goal mẫu. Sau khi lưu, bạn sẽ vào thẳng Goal Detail để bấm &quot;Khởi chạy Goal&quot;.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800">Goal Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Vd: Ra mắt Podcast VO DUONG AI"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">Goal Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Mô tả ngắn gọn bạn muốn đạt được điều gì"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Goal Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                {GOAL_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800">Goal Type</label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                {GOAL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalPriority)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">Expected Deliverable</label>
            <input
              type="text"
              value={expectedDeliverable}
              onChange={(e) => setExpectedDeliverable(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Vd: Landing Page hoàn chỉnh sẵn sàng ra mắt"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Target Completion Date (tùy chọn)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800">Tags (tùy chọn, cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Vd: ra-mat, content, q1"
              />
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
            >
              Tạo Goal
            </button>
            <Link href="/portal/goals" className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
              Hủy
            </Link>
          </div>
        </form>
      </section>

      <Link href="/portal/goals" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
        <ArrowLeft className="h-4 w-4" /> Quay lại Goal Dashboard
      </Link>
    </div>
  );
}
