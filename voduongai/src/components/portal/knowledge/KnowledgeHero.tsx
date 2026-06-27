import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Tôi đang ở trong một Hệ Tri Thức có cấu trúc, không phải một thư viện rời rạc."
 */
export function KnowledgeHero() {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Tri thức</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Hệ Tri Thức của bạn</h1>
      <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
        Mọi năng lực đều bắt đầu từ việc học đúng, thực hành đúng và lưu giữ đúng.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal/academy" variant="primary">
          Tiếp tục học →
        </Button>
        <Button href="/portal/library" variant="secondary">
          Khám phá thư viện AI
        </Button>
      </div>
    </GemCard>
  );
}
