import { Lock } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";

export function GemLockedOverlay({
  message = "Nội dung này thuộc khu vực Premium — nơi bạn tiếp tục mài giũa viên ngọc của mình ở cấp độ cao hơn.",
  ctaHref = "/portal/premium",
  ctaLabel = "Mở khóa hành trình",
}: {
  message?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="gemos-locked-overlay">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED]/30 to-[#22D3EE]/20 text-[#A78BFA]">
        <Lock className="h-4 w-4" />
      </div>
      <p className="max-w-xs text-sm text-gray-600">{message}</p>
      <Button href={ctaHref} variant="primary" className="mt-1">
        {ctaLabel}
      </Button>
    </div>
  );
}
