export type GemCardVariant = "default" | "featured" | "progress" | "action" | "locked" | "success";

const variantClass: Record<GemCardVariant, string> = {
  default: "",
  featured: "gemos-card-featured",
  progress: "",
  action: "",
  locked: "gemos-card-locked",
  success: "gemos-card-success",
};

export function GemCard({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: GemCardVariant;
}) {
  return <div className={`gemos-gem-card p-5 sm:p-6 ${variantClass[variant]} ${className}`}>{children}</div>;
}
