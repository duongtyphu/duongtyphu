"use client";

import { useId } from "react";
import type { ReactNode } from "react";

const CONTROL_CLASS =
  "w-full rounded-[var(--v2-radius-sm)] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-3 py-[10px] text-[13px] outline-none focus:border-[var(--v2-violet)]";

type BaseProps = {
  label: string;
  /** Ghi chú nhỏ dưới ô nhập. */
  hint?: string;
};

/** `.field` với `<input>`. */
export function Field({
  label,
  hint,
  type = "text",
  defaultValue,
  value,
  onChange,
  placeholder,
}: BaseProps & {
  type?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <div className="mb-[14px] last:mb-0">
      <label htmlFor={id} className="mb-[6px] block text-[12px] font-bold text-[var(--v2-muted)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={onChange ? undefined : defaultValue}
        value={value}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={CONTROL_CLASS}
      />
      {hint ? <p className="mt-[6px] text-[11.5px] text-[var(--v2-muted)]">{hint}</p> : null}
    </div>
  );
}

/** `.field` với `<textarea>`. */
export function TextareaField({
  label,
  hint,
  rows = 3,
  defaultValue,
  value,
  onChange,
}: BaseProps & {
  rows?: number;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="mb-[14px] last:mb-0">
      <label htmlFor={id} className="mb-[6px] block text-[12px] font-bold text-[var(--v2-muted)]">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        defaultValue={onChange ? undefined : defaultValue}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`${CONTROL_CLASS} resize-y`}
      />
      {hint ? <p className="mt-[6px] text-[11.5px] text-[var(--v2-muted)]">{hint}</p> : null}
    </div>
  );
}

/** `.field` với `<select>`. */
export function SelectField({
  label,
  hint,
  options,
  defaultValue,
  value,
  onChange,
}: BaseProps & {
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="mb-[14px] last:mb-0">
      <label htmlFor={id} className="mb-[6px] block text-[12px] font-bold text-[var(--v2-muted)]">
        {label}
      </label>
      <select
        id={id}
        defaultValue={onChange ? undefined : defaultValue}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={CONTROL_CLASS}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-[6px] text-[11.5px] text-[var(--v2-muted)]">{hint}</p> : null}
    </div>
  );
}

/** `.field-row2` — 2 field cạnh nhau, xuống 1 cột dưới 860px. */
export function FieldRow2({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-[14px] min-[860px]:grid-cols-2">{children}</div>;
}
