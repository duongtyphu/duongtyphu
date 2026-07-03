/** Tách chuỗi "Trước: ... Sau: ..." thành 2 vế cho Feature 07 — Real Example. */
export function splitBeforeAfter(example: string): { before: string; after: string } | null {
  const match = example.match(/^Trước:\s*([\s\S]+?)\s*Sau:\s*([\s\S]+)$/);
  if (!match) return null;
  return { before: match[1].trim(), after: match[2].trim() };
}
