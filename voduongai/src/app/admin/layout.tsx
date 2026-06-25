import { AdminToastProvider } from "@/lib/admin/toast";

export const metadata = { title: "Admin · VO DUONG AI" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminToastProvider>{children}</AdminToastProvider>;
}
