export const SEED_CONTENT_SECTIONS = [
  { id: "gain", label: "Bạn sẽ đạt được gì" },
  { id: "persona", label: "Phù hợp với ai" },
  { id: "problem", label: "Vấn đề" },
  { id: "core-idea", label: "Ý tưởng cốt lõi" },
  { id: "guide", label: "Hướng dẫn" },
  { id: "prompt", label: "Prompt" },
  { id: "example", label: "Ví dụ" },
  { id: "mistakes", label: "Sai lầm thường gặp" },
  { id: "checklist", label: "Checklist" },
  { id: "exercise", label: "Exercise" },
  { id: "reflection", label: "Reflection" },
] as const;

/** Feature 06 — Sticky mục lục, Next/Previous Section suy ra từ cùng danh sách này. */
export function TableOfContents() {
  return (
    <nav className="sticky top-16 hidden max-h-[calc(100vh-6rem)] w-52 shrink-0 space-y-1 overflow-y-auto pr-2 lg:block">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Mục lục</p>
      {SEED_CONTENT_SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="block truncate rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-blue-600"
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
