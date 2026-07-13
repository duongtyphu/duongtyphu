import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * AI Workspace IA (AIWS-SPR-501 Task 2, mở rộng PMO-HARDENING-CONT
 * Workstream 1) — CRUD thật cho 5/9 Section (Hero+Footer CTA/Workspace đề
 * xuất/Quy trình AI/Prompt Library/Tài nguyên). Còn lại (Companion Desk —
 * không phải danh sách; AI Toolbox + Blog AI — dùng chung
 * generateStaticParams với route con /[slug]/bai-viet/[slug], cần tách
 * Server/Client trước khi CMS-hoá, ngoài phạm vi lượt này) vẫn hardcode,
 * ghi rõ trong Dashboard — xem `docs/admin/AI_WORKSPACE_MANAGEMENT_AIWS-SPR-501.md`.
 */
export const AI_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "dashboard", label: "AI Workspace Dashboard", href: "/admin/ai-workspace" },
  { key: "settings", label: "Hero & Footer CTA", href: "/admin/ai-workspace/settings" },
  { key: "recommended", label: "Workspace đề xuất", href: "/admin/ai-workspace/recommended" },
  { key: "workflow", label: "Quy trình AI", href: "/admin/ai-workspace/workflow" },
  { key: "prompts", label: "Prompt Library", href: "/admin/ai-workspace/prompts" },
  { key: "resource", label: "Tài nguyên thực hành", href: "/admin/ai-workspace/resource" },
];
