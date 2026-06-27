export function GlassCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return <Tag className={`gemos-glass-card p-5 sm:p-6 ${className}`}>{children}</Tag>;
}
