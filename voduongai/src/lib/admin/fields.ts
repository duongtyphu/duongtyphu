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
