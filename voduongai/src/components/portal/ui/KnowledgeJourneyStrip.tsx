import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";

// Portal 3.0 — Product Transformation Wave 2 (Content Reconstruction).
//
// "Link Everything": every pillar page ends by pointing at the next real
// step in the knowledge journey (Tool -> Prompt -> Workflow -> Lesson ->
// Best Practice -> Case Study -> Project -> Journey -> Companion) instead
// of leaving the user with nothing to do next. Every href here is a real,
// existing route — this is honest cross-linking of real pages, not
// fabricated relation data (that distinction matters: P.4's
// RelatedKnowledgePanel is for real *data* relations and shows empty
// states when none exist; this component is pure navigation/IA linking,
// which is always available because the destination pages themselves are
// real).
export type JourneyStep = { label: string; description: string; href: string };

export function KnowledgeJourneyStrip({
  title = "Tiếp tục hành trình tri thức",
  steps,
}: {
  title?: string;
  steps: JourneyStep[];
}) {
  return (
    <section>
      <SectionHeader eyebrow="Companion dẫn đường" title={title} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s) => (
          <GemCard key={s.href}>
            <p className="gemos-card-title text-sm font-bold text-gray-900">{s.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.description}</p>
            <Button href={s.href} variant="secondary" className="mt-3">
              Đi tới →
            </Button>
          </GemCard>
        ))}
      </div>
    </section>
  );
}
