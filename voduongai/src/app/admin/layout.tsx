import { AdminAuthProvider } from "@/lib/admin/auth";
import { AdminToastProvider } from "@/lib/admin/toast";

export const metadata = { title: "Admin · VO DUONG AI" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>{children}</AdminToastProvider>
    </AdminAuthProvider>
  );
}
