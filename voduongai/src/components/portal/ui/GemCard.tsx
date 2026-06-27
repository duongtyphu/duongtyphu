export function GemCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`gemos-gem-card p-5 sm:p-6 ${className}`}>{children}</div>;
}
