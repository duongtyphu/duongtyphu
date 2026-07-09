"use client";

import { useState } from "react";
import { updateCoursePrice, updateCourseStatus, type CoursePricing } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

export function CourseRow({ course }: { course: CoursePricing }) {
  const [price, setPrice] = useState(String(course.price));
  const [status, setStatus] = useState(course.status);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const { push } = useAdminToast();

  const open = status === "open";

  async function save() {
    setSaving(true);
    const result = await updateCoursePrice(course.id, Number(price));
    setSaving(false);
    push(result.error ?? "Đã lưu giá.");
  }

  // Bật/tắt mở bán: 'open' ↔ 'coming'. Trang /portal/premium hiện CTA
  // thanh toán chỉ khi status='open', ngược lại card là "Sắp mở đăng ký".
  async function toggleStatus() {
    const next = open ? "coming" : "open";
    setToggling(true);
    const result = await updateCourseStatus(course.id, next);
    setToggling(false);
    if (!result.error) setStatus(next);
    push(result.error ?? (next === "open" ? "Đã MỞ BÁN trên trang Premium." : "Đã chuyển sang Sắp mở đăng ký."));
  }

  return (
    <tr className="border-b border-white/5">
      <td className="px-3 py-3 text-sm font-semibold text-white">{course.name}</td>
      <td className="px-3 py-3">
        <button
          onClick={toggleStatus}
          disabled={toggling}
          title={open ? "Bấm để đóng đăng ký (Sắp mở đăng ký)" : "Bấm để mở bán trên trang Premium"}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-30 ${
            open
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
              : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${open ? "bg-emerald-400" : "bg-white/30"}`}
          />
          {toggling ? "Đang lưu..." : open ? "Đang mở bán" : "Sắp mở đăng ký"}
        </button>
      </td>
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
