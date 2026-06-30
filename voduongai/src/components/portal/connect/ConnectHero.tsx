import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Mình nên đồng hành cùng ai?"
 */
export function ConnectHero() {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Hệ Kết Nối</p>
      <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">Không ai tiến hóa một mình.</h1>
      <p className="mt-2 max-w-xl text-sm text-gray-600 sm:text-base">
        Mình nên đồng hành cùng ai? VO DUONG AI là nơi bạn kết nối với cộng
        đồng, mentor, tri thức, cơ hội và những con người cùng khát vọng phát
        triển trong kỷ nguyên AI.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal/community" variant="primary">
          Kết nối cộng đồng →
        </Button>
        <Button href="/portal/updates" variant="secondary">
          Xem sự kiện
        </Button>
      </div>
    </GemCard>
  );
}
