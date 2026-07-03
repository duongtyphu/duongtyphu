/**
 * Companion Orchestration System™ — Module ↔ Route map (Product Amendment 02).
 * Nguồn sự thật duy nhất cho việc route Portal nào thuộc module nào, để
 * Companion Orchestrator biết nên cân nhắc đội ngũ Agent nào.
 */

import type { PortalModule } from "./agent.types";
import { getAgentsByModule } from "./agent-registry";
import type { CompanionAgent } from "./agent.types";

const MODULE_ROUTE_PREFIXES: { prefix: string; module: PortalModule }[] = [
  { prefix: "/portal/khong-gian-ai", module: "khong-gian-ai" },
  { prefix: "/portal/library", module: "ckos" },
  { prefix: "/portal/academy", module: "academy" },
  { prefix: "/portal/opportunities", module: "opportunities" },
  { prefix: "/portal/premium", module: "premium" },
  { prefix: "/portal/news", module: "learning-journal" },
  { prefix: "/portal/journey", module: "my-journey" },
  { prefix: "/portal/khu-vuon-cua-ban", module: "living-garden" },
];

export const MODULE_LABELS: Record<PortalModule, string> = {
  "khong-gian-ai": "Không gian AI",
  ckos: "Thư viện tri thức",
  academy: "Học viện",
  opportunities: "Dự án & Cơ hội",
  premium: "Premium",
  "learning-journal": "Nhật ký học tập",
  "my-journey": "Hành trình của tôi",
  "living-garden": "Khu vườn của bạn",
};

export function getModuleForRoute(pathname: string): PortalModule | null {
  const match = MODULE_ROUTE_PREFIXES.find((entry) => pathname.startsWith(entry.prefix));
  return match?.module ?? null;
}

export function getAgentsForRoute(pathname: string): CompanionAgent[] {
  const portalModule = getModuleForRoute(pathname);
  return portalModule ? getAgentsByModule(portalModule) : [];
}
