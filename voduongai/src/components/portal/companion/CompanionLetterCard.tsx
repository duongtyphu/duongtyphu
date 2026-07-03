/**
 * Companion Design System™ — Layer 06: Letters™.
 * Thẻ "lá thư" dùng chung — tổng quát hoá từ `.companion-letter-card`
 * (Layer 05) để tái dùng cho nhiều lá thư khác nhau (Nhiệm vụ 05), không chỉ
 * "Tâm sự cùng bạn" ở Companion Home.
 */

import { CompanionChapterLabel } from "./CompanionTypography";

export function CompanionLetterCard({
  heading,
  lines,
  signature = "Companion",
  className = "",
}: {
  heading: string;
  lines: string[];
  signature?: string;
  className?: string;
}) {
  return (
    <div className={`companion-letter-card ${className}`}>
      <CompanionChapterLabel>{heading}</CompanionChapterLabel>
      <p className="mt-4 text-lg italic leading-loose text-slate-100 sm:text-xl">
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
      <p className="mt-6 text-right text-sm font-semibold text-slate-400">— {signature}</p>
    </div>
  );
}
