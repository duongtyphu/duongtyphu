import { redirect } from "next/navigation";

import { PortalSidebar } from "@/components/v2/shell/PortalSidebar";
import { Topbar } from "@/components/v2/shell/Topbar";
import { getV2Session } from "@/lib/v2/auth";
import { countUnreadNotifications } from "@/lib/v2/data/notifications";

/**
 * Khung Portal 2.0: `.app` = flex, `.sidebar` 224px cố định + `.main-col` flex:1
 * (topbar sticky + content). Bố cục 2 cột `center-col`/`right-col` do từng trang
 * tự dựng, vì không phải trang nào cũng có cột phải.
 */
export default async function V2PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getV2Session();
  if (!session) redirect("/login");

  const unread = await countUnreadNotifications();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar isPremium={session.isPremium} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          variant="portal"
          user={{
            name: session.fullName,
            initials: session.initials,
            planLabel: session.isPremium ? "Premium" : "Free",
          }}
          searchPlaceholder="Tìm kiếm khóa học, tài liệu, công cụ, prompt..."
          notificationCount={unread}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
