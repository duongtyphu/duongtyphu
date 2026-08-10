import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/v2/shell/AdminSidebar";
import { Topbar } from "@/components/v2/shell/Topbar";
import { getV2Session } from "@/lib/v2/auth";

/**
 * Khung Admin 2.0. Chặn quyền THẬT: chỉ thành viên có `members.is_admin` mới
 * vào được, giống `/admin/(dashboard)` hiện tại. Người đã đăng nhập nhưng
 * không phải admin bị đẩy về Portal thay vì màn hình đăng nhập — họ đã có
 * phiên hợp lệ, đăng nhập lại không giải quyết được gì.
 */
export default async function V2AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getV2Session();
  if (!session) redirect("/admin/login");
  if (!session.isAdmin) redirect("/v2/trang-chu");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          variant="admin"
          user={{
            name: session.fullName,
            initials: session.initials,
            planLabel: "Super Admin",
          }}
          searchPlaceholder="Tìm nội dung, người dùng, giao dịch..."
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
