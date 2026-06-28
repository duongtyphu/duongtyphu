import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Làm sao tạo ra giá trị thật?"
 */
export function BuildHero() {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FBBF24]">Hệ Kiến Tạo</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Biến tri thức thành giá trị.</h1>
      <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
        Làm sao tạo ra giá trị thật? Đừng bắt đầu bằng việc bán — hãy bắt đầu
        bằng việc giúp. Học tập chỉ là điểm khởi đầu; giá trị thật được tạo ra
        khi bạn hành động, xây dựng và chia sẻ những kết quả bền vững cho
        chính mình.
      </p>
      <p className="mt-2 max-w-xl text-xs italic text-white/45">
        Giai đoạn BUILD trong hành trình mài giũa của bạn.
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
