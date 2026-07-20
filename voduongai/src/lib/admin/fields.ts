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
  /** Chuyển giá trị đã lưu (vd. mảng string) thành giá trị hiển thị trong
   * form — dùng để bọc 1 FieldType có sẵn (vd. "textarea") cho kiểu dữ liệu
   * khác, không tạo FieldType mới. Bỏ trống = hiển thị nguyên giá trị lưu. */
  toFormValue?: (value: unknown) => unknown;
  /** Chuyển giá trị vừa nhập trong form ngược lại đúng kiểu sẽ lưu, chạy
   * ngay trước khi add/update. Bỏ trống = lưu nguyên giá trị đã nhập. */
  fromFormValue?: (value: unknown) => unknown;
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
