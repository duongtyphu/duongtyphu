import type { LucideIcon } from "lucide-react";
import { Gem } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Gem,
  action,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="gemos-glass-card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-[#A78BFA]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      {description && <p className="max-w-sm text-sm text-white/55">{description}</p>}
      {action}
    </div>
  );
}
