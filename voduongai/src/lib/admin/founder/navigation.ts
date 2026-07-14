import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

export const FOUNDER_SECTIONS: AdminWorkspaceSection[] = [
  { key: "overview", label: "Founder Workspace", href: "/admin/founder" },
  { key: "owners", label: "Workspace Owner Panel", href: "/admin/founder/owners" },
  { key: "search", label: "Global Search", href: "/admin/founder/search" },
  { key: "review-queue", label: "Review Queue", href: "/admin/founder/review-queue" },
];
