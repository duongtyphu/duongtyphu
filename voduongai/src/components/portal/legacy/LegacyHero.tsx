import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Điều gì sẽ còn lại sau tất cả?"
 */
export function LegacyHero() {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">My Legacy</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Di sản số của riêng bạn.</h1>
      <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
        Điều gì sẽ còn lại sau tất cả? Không phải mọi thứ bạn làm hôm nay đều
        tự nhiên trở thành di sản — chỉ những gì được lưu giữ đúng cách mới
        còn lại lâu hơn chính khoảnh khắc bạn tạo ra nó.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal" variant="secondary">
          ← Về Gem Home
        </Button>
      </div>
    </GemCard>
  );
}
