import Link from "next/link";
import {
  LayoutDashboard,
  GraduationCap,
  Rocket,
  Users,
  Wrench,
  Sparkles,
  Gift,
  Crown,
  Package,
  MessageCircle,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { portalNav } from "@/lib/site";

const navIcons: Record<string, LucideIcon> = {
  "/portal": LayoutDashboard,
  "/portal/ai-academy": GraduationCap,
  "/portal/vdai-academy": Rocket,
  "/portal/affiliate-hub": Users,
  "/portal/tools": Wrench,
  "/portal/prompts": Sparkles,
  "/portal/resources": Gift,
  "/portal/premium": Crown,
  "/portal/my-products": Package,
  "/portal/community": MessageCircle,
  "/blog": Newspaper,
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-5 py-10">
      <aside className="hidden w-56 flex-shrink-0 md:block">
        <nav className="sticky top-24 space-y-1">
          {portalNav.map((item) => {
            const Icon = navIcons[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 hover:text-white"
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
