import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Wrapper chung cho từng phần trong Companion Content Standard. `id` dùng cho Sticky mục lục (Feature 06). */
export function ContentSection({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 space-y-2 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
        <Icon className="h-4 w-4 text-blue-500" />
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}
