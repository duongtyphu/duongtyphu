import type { ReactNode } from "react";

export type FieldType = "text" | "textarea" | "number" | "select" | "boolean" | "tags" | "date";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  full?: boolean;
};

export type ColumnConfig<T> = {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
};

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
