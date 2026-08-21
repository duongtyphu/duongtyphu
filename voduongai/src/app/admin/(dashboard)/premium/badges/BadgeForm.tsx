"use client";

import { useState } from "react";
import { createBadge, updateBadge, deleteBadge, type BadgeRow, type BadgeInput } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: BadgeInput = { slug: "", name: "", description: "", icon: "", course_id: "" };

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

type CourseOption = { id: string; name: string };

function Fields({
  value,
  onChange,
  courses,
  slugEditable,
}: {
  value: BadgeInput;
  onChange: (v: BadgeInput) => void;
  courses: CourseOption[];
  slugEditable: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {slugEditable && (
        <input
          placeholder="Mã huy hiệu — không đổi được sau khi tạo (VD: hoan-thanh-ai-co-ban)"
          value={value.slug}
          onChange={(e) => onChange({ ...value, slug: e.target.value })}
          className={`${inputClass} sm:col-span-2`}
        />
      )}
      <input
        placeholder="Tên huy hiệu (VD: Đã hoàn thành AI cho người mới bắt đầu)"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        className={inputClass}
      />
      <input
        placeholder="Icon — 1-2 emoji (VD: 🏆)"
        value={value.icon}
        onChange={(e) => onChange({ ...value, icon: e.target.value })}
        className={inputClass}
      />
      <select
        value={value.course_id}
        onChange={(e) => onChange({ ...value, course_id: e.target.value })}
        className={`${inputClass} sm:col-span-2`}
      >
        <option value="">— Không gắn khoá học nào (không tự động trao được) —</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.id})
          </option>
        ))}
      </select>
      <textarea
        placeholder="Mô tả huy hiệu — hiện ở tab Tiến độ của tôi"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
        rows={2}
        className={`${inputClass} sm:col-span-2`}
      />
    </div>
  );
}

export function NewBadgeForm({ courses }: { courses: CourseOption[] }) {
  const [value, setValue] = useState<BadgeInput>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaveState("saving");
    setError(null);
    const result = await createBadge(value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setValue(EMPTY);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">Tạo huy hiệu mới</h2>
        <SaveStateBadge state={saveState} isDirty={false} />
      </div>
      <div className="mt-3">
        <Fields
          value={value}
          onChange={(v) => {
            setValue(v);
            setSaveState("idle");
          }}
          courses={courses}
          slugEditable
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={saveState === "saving"}
        className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {saveState === "saving" ? "Đang lưu..." : "Tạo huy hiệu"}
      </button>
    </div>
  );
}

export function BadgeCard({ badge, courses }: { badge: BadgeRow; courses: CourseOption[] }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<BadgeInput>({
    slug: badge.slug,
    name: badge.name,
    description: badge.description ?? "",
    icon: badge.icon ?? "",
    course_id: badge.course_id ?? "",
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  const courseName = courses.find((c) => c.id === badge.course_id)?.name;

  async function save() {
    setSaveState("saving");
    setError(null);
    const result = await updateBadge(badge.id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá huy hiệu "${badge.name}"? Huy hiệu người dùng đã đạt trước đó sẽ vẫn giữ nguyên trong lịch sử của họ.`)) return;
    await deleteBadge(badge.id);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <code className="text-xs font-bold text-gray-500">{badge.slug}</code>
          <SaveStateBadge state={saveState} isDirty={false} />
        </div>
        <Fields
          value={value}
          onChange={(v) => {
            setValue(v);
            setSaveState("idle");
          }}
          courses={courses}
          slugEditable={false}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button
            onClick={save}
            disabled={saveState === "saving"}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            Lưu
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Huỷ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xl">{badge.icon || "🏅"}</span>
        <span className="text-sm font-bold text-gray-900">{badge.name}</span>
        <code className="text-xs text-gray-400">{badge.slug}</code>
        {courseName ? (
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">Khoá: {courseName}</span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">Chưa gắn khoá học</span>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Sửa
        </button>
        <button
          onClick={remove}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Xoá
        </button>
      </div>
    </div>
  );
}
