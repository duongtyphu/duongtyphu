import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Người dùng có cảm thấy được chào đón và biết bước tiếp theo không?"
 */
export function WelcomeHero({ name }: { name?: string }) {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">Gem Home</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
        Chào mừng trở lại{name ? `, ${name}` : ""}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
        Hôm nay là một ngày nữa để viên ngọc của bạn sáng hơn.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal/journey" variant="primary">
          Tiếp tục hành trình →
        </Button>
        <Button href="/portal/roadmap" variant="secondary">
          Xem lộ trình
        </Button>
      </div>
    </GemCard>
  );
}
