import type { ReactNode } from "react";

export type FieldType = "text" | "textarea" | "number" | "select" | "boolean" | "tags" | "date";

/**
 * Cách chuyển đổi giá trị lưu (jsonb) ↔ giá trị hiển thị trong form, cho
 * field mà kiểu lưu thật (vd. mảng string) khác kiểu input (textarea) —
 * PHẢI là chuỗi khai báo thuần (không phải function): FieldConfig được
 * định nghĩa trong page.tsx (Server Component) rồi truyền qua DataTable →
 * DataTableClient ("use client") — function không serialize được qua
 * ranh giới Server→Client Component, sẽ crash lúc render thật (không bắt
 * được bởi tsc/eslint/build, chỉ lộ ra khi render qua request thật).
 * "newline-list": mảng string ↔ textarea, mỗi dòng 1 phần tử.
 */
export type FieldTransform = "newline-list";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  full?: boolean;
  transform?: FieldTransform;
};

export type ColumnConfig<T> = {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
};

/** Giá trị lưu (jsonb) → giá trị hiển thị trong form, theo field.transform. */
export function toFormValueFor(field: FieldConfig, value: unknown): unknown {
  if (field.transform === "newline-list") {
    return Array.isArray(value) ? (value as string[]).join("\n") : "";
  }
  return value;
}

/** Giá trị vừa nhập trong form → giá trị sẽ lưu (jsonb), theo field.transform. */
export function fromFormValueFor(field: FieldConfig, value: unknown): unknown {
  if (field.transform === "newline-list") {
    return String(value ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return value;
}

/** Giá trị khởi tạo theo FieldType — dùng chung cho form Thêm mới/Singleton. */
export function emptyFromFields(fields: FieldConfig[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "boolean") obj[f.key] = false;
    else if (f.type === "tags") obj[f.key] = [];
    else if (f.type === "number") obj[f.key] = 0;
    else obj[f.key] = f.options?.[0] ?? "";
  }
  return obj;
}
