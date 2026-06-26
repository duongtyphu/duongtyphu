import { tools } from "@/data/tools";
import { AdminToolsSection } from "@/components/portal/AdminToolsSection";
import { ToolCard } from "@/components/portal/ToolCard";

export const metadata = { title: "Thư viện công cụ" };

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thư viện công cụ</h1>
        <p className="mt-2 text-white">
          Công cụ AI tôi đã thử nghiệm và sử dụng thực tế, theo từng nhóm.
        </p>
      </div>
      <AdminToolsSection />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {tools.map((t) => (
          <ToolCard
            key={t.id}
            id={t.id}
            name={t.name}
            category={t.category}
            description={t.description}
            useCase={t.useCase}
            pricing={t.pricing}
            iUseThis={t.iUseThis}
          />
        ))}
      </div>
    </div>
  );
}
