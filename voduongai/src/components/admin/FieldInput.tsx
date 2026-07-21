"use client";

import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

type OptionItem = { id: string; slug?: string; title?: string; name?: string };

/**
 * Tách riêng component (thay vì gọi useCollection() trực tiếp trong
 * FieldInput) để không vi phạm Rules of Hooks — FieldInput có nhiều
 * nhánh `if` return sớm, gọi hook có điều kiện ở đó là sai; mount 1
 * component con riêng khi field.type === "multi-select" thì an toàn vì
 * component con luôn gọi hook của chính nó vô điều kiện.
 */
function MultiSelectField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const { items, ready } = useCollection<OptionItem>(field.optionsSource ?? "", []);
  const selected = Array.isArray(value) ? (value as string[]) : [];

  function toggle(optValue: string, checked: boolean) {
    onChange(checked ? [...selected, optValue] : selected.filter((s) => s !== optValue));
  }

  if (!ready) return <p className="text-xs text-gray-400">Đang tải danh sách...</p>;

  return (
    <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">Chưa có mục nào để chọn.</p>
      ) : (
        items.map((item) => {
          const optValue = item.slug ?? item.id;
          const optLabel = item.title ?? item.name ?? optValue;
          return (
            <label key={optValue} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selected.includes(optValue)}
                onChange={(e) => toggle(optValue, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>
                {optLabel} <span className="font-mono text-xs text-gray-400">({optValue})</span>
              </span>
            </label>
          );
        })
      )}
    </div>
  );
}

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

  if (field.type === "multi-select") {
    return <MultiSelectField field={field} value={value} onChange={onChange} />;
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
