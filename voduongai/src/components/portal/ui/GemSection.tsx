import Link from "next/link";

export function GemSection({
  title,
  subtitle,
  viewAllHref,
  children,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="shrink-0 text-sm font-semibold text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
