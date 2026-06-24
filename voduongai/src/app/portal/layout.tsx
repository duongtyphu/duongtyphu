import Link from "next/link";
import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Rocket,
  UserCircle,
  Sparkles,
  Wrench,
  FileText,
  Gift,
  ListChecks,
  ClipboardList,
  Users,
  Crown,
  Package,
  Handshake,
  Boxes,
  MessageCircle,
  CircleUser,
  Newspaper,
  Percent,
  LifeBuoy,
  PenSquare,
  TrendingUp,
  BadgeCheck,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { portalNavGroups } from "@/lib/site";
import { NotificationTicker } from "@/components/portal/NotificationTicker";

const navIcons: Record<string, LucideIcon> = {
  "/portal": LayoutDashboard,
  "/portal/roadmap": Map,
  "/portal/ai-academy": GraduationCap,
  "/portal/vdai-academy": Rocket,
  "/portal/personal-brand": UserCircle,
  "/portal/practice": PenSquare,
  "/portal/prompts": Sparkles,
  "/portal/tools": Wrench,
  "/portal/templates": FileText,
  "/portal/resources": Gift,
  "/portal/checklists": ListChecks,
  "/portal/sop": ClipboardList,
  "/portal/affiliate-hub": Users,
  "/portal/referral": Percent,
  "/portal/premium": Crown,
  "/portal/my-products": Package,
  "/portal/services": Handshake,
  "/portal/assets": Boxes,
  "/portal/community": MessageCircle,
  "/portal/case-studies": TrendingUp,
  "/portal/experts": BadgeCheck,
  "/portal/news": Megaphone,
  "/portal/support": LifeBuoy,
  "/portal/account": CircleUser,
  "/blog": Newspaper,
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-10">
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <nav className="sticky top-24 space-y-4">
            {portalNavGroups.map((g, i) => (
              <div key={g.group ?? `top-${i}`}>
                {g.group && (
                  <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
                    {g.group}
                  </p>
                )}
                <div className="space-y-1">
                  {g.items.map((item) => {
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
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <NotificationTicker />
          {children}
        </div>
      </div>
    </>
  );
}
