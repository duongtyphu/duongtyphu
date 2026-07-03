/**
 * Tách field `example` thành 2 vế cho Feature 07 — Real Example.
 * Hỗ trợ đủ 3 dạng chấp nhận theo Example_Standard.md:
 *   Trước / Sau · Không dùng AI / Có AI · Sai / Đúng
 */

const PATTERNS: { before: RegExp; after: RegExp; beforeLabel: string; afterLabel: string }[] = [
  { before: /^Trước:/, after: /\bSau:/, beforeLabel: "Trước", afterLabel: "Sau" },
  { before: /^Không dùng AI:/, after: /\bCó AI:/, beforeLabel: "Không dùng AI", afterLabel: "Có AI" },
  { before: /^Sai:/, after: /\bĐúng:/, beforeLabel: "Sai", afterLabel: "Đúng" },
];

export type SplitExample = { before: string; after: string; beforeLabel: string; afterLabel: string };

export function splitBeforeAfter(example: string): SplitExample | null {
  for (const pattern of PATTERNS) {
    if (!pattern.before.test(example)) continue;
    const afterMatch = example.match(pattern.after);
    if (!afterMatch || afterMatch.index === undefined) continue;

    const beforeText = example.slice(pattern.beforeLabel.length + 1, afterMatch.index).trim();
    const afterText = example.slice(afterMatch.index + pattern.afterLabel.length + 1).trim();
    if (!beforeText || !afterText) continue;

    return { before: beforeText, after: afterText, beforeLabel: pattern.beforeLabel, afterLabel: pattern.afterLabel };
  }
  return null;
}
