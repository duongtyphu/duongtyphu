import Link from "next/link";
import type { ReactNode } from "react";

type ResourceCardProps = {
  title: string;
  description?: string;
  type?: string;
  href: string;
  external?: boolean;
  meta?: string;
  icon?: string;
  action?: ReactNode;
};

/**
 * Shared card for library-style content (resources, prompts, ebooks,
 * checklists, templates). Only renders fields that have data — no
 * placeholder/fake metadata.
 */
export function ResourceCard({ title, description, type, href, external, meta, icon, action }: ResourceCardProps) {
  const className =
    "card-shine flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30";

  const content = (
    <>
      {icon && <span className="text-2xl">{icon}</span>}
      {type && (
        <span className="inline-flex w-fit rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
          {type}
        </span>
      )}
      <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
      {description && <p className="mt-2 line-clamp-3 text-sm text-white/70">{description}</p>}
      {meta && <p className="mt-2 text-xs text-white/40">{meta}</p>}
      {action && <div className="mt-3">{action}</div>}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
