"use client";

import type { FieldConfig } from "@/lib/admin/fields";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

/**
 * 1 input theo đúng FieldType — tách từ DataTableRowPanel để SingletonEditor
 * dùng lại cùng logic render, không viết lần 2 cùng 1 switch JSX.
 */
export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        placeholder={field.placeholder}
        rows={4}
        className={inputClass}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {(field.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "boolean") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300"
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={Number(value ?? 0)}
        onChange={(e) => onChange(Number(e.target.value))}
        required={field.required}
        className={inputClass}
      />
    );
  }

  if (field.type === "tags") {
    return (
      <input
        type="text"
        value={Array.isArray(value) ? (value as string[]).join(", ") : ""}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        placeholder={field.placeholder ?? "Ngăn cách bằng dấu phẩy"}
        className={inputClass}
      />
    );
  }

  return (
    <input
      type={field.type === "date" ? "date" : "text"}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      placeholder={field.placeholder}
      className={inputClass}
    />
  );
}
