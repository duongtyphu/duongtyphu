"use client";

import { useState } from "react";
import { updateCoursePrice, type CoursePricing } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

export function CourseRow({ course }: { course: CoursePricing }) {
  const [price, setPrice] = useState(String(course.price));
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function save() {
    setSaving(true);
    const result = await updateCoursePrice(course.id, Number(price));
    setSaving(false);
    push(result.error ?? "Đã lưu giá.");
  }

  return (
    <tr className="border-b border-white/5">
      <td className="px-3 py-3 text-sm font-semibold text-white">{course.name}</td>
      <td className="px-3 py-3 text-xs text-white/50">{course.status}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-36 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white"
          />
          <span className="text-xs text-white/40">đ</span>
        </div>
      </td>
      <td className="px-3 py-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg border border-brand-violet/30 px-3 py-1.5 text-xs font-semibold text-brand-violet hover:bg-brand-violet/10 disabled:opacity-30"
        >
          Lưu
        </button>
      </td>
    </tr>
  );
}
