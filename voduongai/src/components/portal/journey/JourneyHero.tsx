import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Mình đang ở đâu trên hành trình trưởng thành?"
 */
export function JourneyHero() {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Hành trình</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
        Hành trình mài giũa viên ngọc của bạn
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
        Mình đang ở đâu trên hành trình trưởng thành? Biết rõ vị trí của mình
        quan trọng hơn việc đi nhanh — mỗi bước nhỏ hôm nay đều tạo nên một
        phiên bản tốt hơn của bạn.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal/practice" variant="primary">
          Tiếp tục lộ trình →
        </Button>
        <Button href="/portal/roadmap" variant="secondary">
          Cập nhật mục tiêu
        </Button>
      </div>
    </GemCard>
  );
}
