import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-5 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
        Sắp ra mắt
      </p>
      <h1 className="mt-4 text-xl font-extrabold text-white">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-white/50">{description}</p>
    </div>
  );
}
