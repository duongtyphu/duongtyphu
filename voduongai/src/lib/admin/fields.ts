import type { ReactNode } from "react";

export type FieldType = "text" | "textarea" | "number" | "select" | "boolean" | "tags" | "date" | "multi-select";

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
  /** CHỈ dùng khi type="multi-select" — collectionKey (trong
   * SUPABASE_COLLECTIONS) để nạp danh sách chọn thật từ Supabase thay vì
   * gõ tay tự do, tránh sai 1 slug làm gãy tham chiếu (chuỗi khai báo
   * thuần, an toàn qua Server→Client Component). Component hiển thị dùng
   * field `slug` (ưu tiên) hoặc `id` của item làm giá trị lưu. */
  optionsSource?: string;
};

export type ColumnConfig<T> = {
  key: string;
  label: string;
  /** CHỈ dùng khi page.tsx định nghĩa columns là "use client" (Client
   * Component) — function không serialize được qua Server→Client Component
   * (đúng lỗi đã gặp ở FieldConfig.toFormValue/fromFormValue cũ, xem
   * FieldTransform ở trên). DataTable.tsx (page.tsx thường dùng) là Server
   * Component nên KHÔNG được truyền function vào đây. */
  render?: (item: T) => ReactNode;
  /** Cột "trạng thái đầy đủ dữ liệu" — khai báo thuần (mảng key), tính toán
   * ngay trong DataTableClient thay vì nhận function qua props. Nếu bất kỳ
   * key nào trong danh sách rỗng/thiếu ở dòng đó, cột hiển thị `emptyLabel`
   * thay vì giá trị field key chính. */
  requiredForComplete?: string[];
  emptyLabel?: string;
};

function isFieldEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** true nếu item thiếu bất kỳ field nào trong col.requiredForComplete. */
export function isRowIncomplete<T>(col: ColumnConfig<T>, item: T): boolean {
  if (!col.requiredForComplete || col.requiredForComplete.length === 0) return false;
  const record = item as Record<string, unknown>;
  return col.requiredForComplete.some((key) => isFieldEmpty(record[key]));
}

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
    else if (f.type === "tags" || f.type === "multi-select") obj[f.key] = [];
    else if (f.type === "number") obj[f.key] = 0;
    else obj[f.key] = f.options?.[0] ?? "";
  }
  return obj;
}
