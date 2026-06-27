import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Tôi đang ở trong hệ điều hành nào, và việc kiến tạo bắt đầu từ đâu?"
 */
export function BuildHero() {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FBBF24]">Hệ Kiến Tạo</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Biến tri thức thành giá trị.</h1>
      <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
        Học tập chỉ là điểm khởi đầu. Giá trị thật được tạo ra khi bạn hành động, xây dựng, chia sẻ và tạo nên những
        kết quả bền vững cho chính mình.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal/earn" variant="primary">
          Bắt đầu kiến tạo →
        </Button>
        <Button href="/portal/roadmap" variant="secondary">
          Xem lộ trình
        </Button>
      </div>
    </GemCard>
  );
}
