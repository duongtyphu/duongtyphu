"use client";

import { useState } from "react";
import { updateCoursePrice, updateCourseStatus, type CoursePricing } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

export function CourseRow({ course }: { course: CoursePricing }) {
  const [price, setPrice] = useState(String(course.price));
  const [status, setStatus] = useState(course.status);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [toggling, setToggling] = useState(false);

  const open = status === "open";
  const isDirty = price !== String(course.price);

  async function save() {
    setSaveState("saving");
    const result = await updateCoursePrice(course.id, Number(price));
    setSaveState(result.error ? "error" : "saved");
  }

  // Bật/tắt mở bán: 'open' ↔ 'coming'. /portal/premium hiện CTA thanh toán
  // chỉ khi status='open', ngược lại card là "Sắp mở đăng ký".
  async function toggleStatus() {
    const next = open ? "coming" : "open";
    setToggling(true);
    const result = await updateCourseStatus(course.id, next);
    setToggling(false);
    if (!result.error) setStatus(next);
  }

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{course.name}</td>
      <td className="px-4 py-3">
        <button
          onClick={toggleStatus}
          disabled={toggling}
          title={open ? "Bấm để đóng đăng ký (Sắp mở đăng ký)" : "Bấm để mở bán trên trang Premium"}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
            open
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${open ? "bg-emerald-500" : "bg-gray-300"}`} />
          {toggling ? "Đang lưu..." : open ? "Đang mở bán" : "Sắp mở đăng ký"}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setSaveState("dirty");
            }}
            className="w-36 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
          />
          <span className="text-xs text-gray-400">đ</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={saveState === "saving" || !isDirty}
            className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {saveState === "saving" ? "Đang lưu..." : "Lưu"}
          </button>
          <SaveStateBadge state={saveState} isDirty={isDirty} />
        </div>
      </td>
    </tr>
  );
}
