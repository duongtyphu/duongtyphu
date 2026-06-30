import Link from "next/link";
import { logoUrl } from "@/lib/logo";

type ToolCardProps = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  useCase?: string;
  pricing?: string;
  iUseThis?: boolean;
  /** Overrides the default `/portal/tools/${id}` detail link — pass the tool's slug-based href. */
  href?: string;
};

/**
 * Shared card for AI tool listings (Dashboard "Công cụ nổi bật" and
 * /portal/tools).
 */
export function ToolCard({ id, name, category, description, useCase, pricing, iUseThis, href }: ToolCardProps) {
  return (
    <Link
      href={href ?? `/portal/tools/${id}`}
      className="card-shine flex h-full flex-col rounded-[20px] border border-gray-200 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 p-1.5">
          <img src={logoUrl(id)} alt={`${name} logo`} width={24} height={24} className="h-full w-full object-contain" />
        </div>
        {iUseThis ? (
          <span className="rounded-full bg-brand-violet/10 px-2 py-0.5 text-[10px] font-semibold text-brand-violet">
            Tôi đang dùng
          </span>
        ) : (
          pricing && (
            <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-semibold text-brand-blue">
              {pricing}
            </span>
          )
        )}
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-900">{name}</p>
      {category && <p className="mt-0.5 text-xs text-gray-500">{category}</p>}
      {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
      {useCase && <p className="mt-2 text-xs font-medium text-gray-400">{useCase}</p>}
      <span className="mt-3 inline-flex text-xs font-semibold text-brand-blue">Xem chi tiết →</span>
    </Link>
  );
}
