import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

export const PORTAL_MANAGEMENT_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "Portal Dashboard", href: "/admin/portal" },
  { key: "areas", label: "Portal Areas", href: "/admin/portal/areas" },
  { key: "pages", label: "Page Registry", href: "/admin/portal/pages" },
  { key: "content", label: "Content Registry", href: "/admin/portal/content" },
];
