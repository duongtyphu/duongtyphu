import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";

// Portal 3.0 P.4 — every CKOS object (Tool/Prompt/Workflow/Resource/Lesson/
// Best Practice/Case Study) prepares a slot for all 7 relation types, per
// the CKOS Experience brief. Relationship tables for most of these pairs
// were designed in Phase H (H.3-H.8) but never applied to production —
// there is currently no real relation data for ANY object in the app. This
// component therefore renders an honest empty state per slot when no items
// are passed, rather than fabricating "related" content. Pass real items
// once a future phase applies relation data and wires the fetch.
export type RelatedItem = { id: string; title: string; href: string };

export type RelatedKnowledgeProps = {
  tools?: RelatedItem[];
  prompts?: RelatedItem[];
  workflows?: RelatedItem[];
  resources?: RelatedItem[];
  lessons?: RelatedItem[];
  bestPractices?: RelatedItem[];
  caseStudies?: RelatedItem[];
};

const SLOTS: Array<{ key: keyof RelatedKnowledgeProps; label: string }> = [
  { key: "tools", label: "Công cụ liên quan" },
  { key: "prompts", label: "Prompt liên quan" },
  { key: "workflows", label: "Quy trình liên quan" },
  { key: "resources", label: "Tài nguyên liên quan" },
  { key: "lessons", label: "Bài học liên quan" },
  { key: "bestPractices", label: "Best Practice liên quan" },
  { key: "caseStudies", label: "Case Study liên quan" },
];

export function RelatedKnowledgePanel(props: RelatedKnowledgeProps) {
  return (
    <section>
      <SectionHeader eyebrow="CKOS" title="Tri thức liên quan" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SLOTS.map(({ key, label }) => {
          const items = props[key];
          return (
            <GemCard key={key}>
              <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
                {label}
              </p>
              {items && items.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {items.map((item) => (
                    <li key={item.id}>
                      <Button href={item.href} variant="secondary" className="w-full justify-start">
                        {item.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-gray-400">
                  Chưa có {label.toLowerCase()} — quan hệ này chưa được thiết lập cho mục này.
                </p>
              )}
            </GemCard>
          );
        })}
      </div>
    </section>
  );
}
