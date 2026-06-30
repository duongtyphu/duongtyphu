import Link from "next/link";
import { Sparkles } from "lucide-react";

type Props = {
  message: string;
  action?: { label: string; href: string };
};

export function CompanionGuide({ message, action }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] px-4 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
        <Sparkles className="h-4 w-4 text-violet-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm leading-relaxed text-white/80">{message}</p>
        {action && (
          <Link
            href={action.href}
            className="mt-2 inline-block text-xs font-semibold text-violet-400 transition hover:text-violet-300"
          >
            {action.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
