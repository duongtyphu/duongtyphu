"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

/** Công tắc bật/tắt trong form Admin. Mockup dùng `.switch` ở sidebar; đây là
 *  bản dùng trên nền sáng của khu vực nội dung. */
export function Toggle({
  label,
  defaultOn = false,
  description,
}: {
  label: string;
  defaultOn?: boolean;
  description?: string;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="mb-[14px] flex items-start justify-between gap-4 last:mb-0">
      <div>
        <div className="text-[13px] font-bold">{label}</div>
        {description ? (
          <p className="mt-1 text-[11.5px] text-[var(--v2-muted)]">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((prev) => !prev)}
        className={[
          "relative h-[22px] w-10 shrink-0 rounded-[20px] transition-colors",
          on ? "bg-[var(--v2-violet)]" : "bg-[#d8d4ea]",
          "after:absolute after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-[left] after:duration-150",
          on ? "after:left-[21px]" : "after:left-[3px]",
        ].join(" ")}
      />
    </div>
  );
}

/** `.upload-slot` — vùng thả file có viền đứt. */
export function UploadSlot({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="w-full rounded-[11px] border-[1.5px] border-dashed border-[var(--v2-line)] p-5 text-center text-[12.5px] text-[var(--v2-muted)] transition-colors hover:border-[var(--v2-violet)] hover:text-[var(--v2-violet)]"
    >
      <Upload className="mx-auto mb-[6px] h-[22px] w-[22px]" aria-hidden="true" />
      {label}
    </button>
  );
}
