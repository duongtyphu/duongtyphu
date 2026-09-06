/**
 * Companion Orchestration System™ — Module ↔ Route map (Product Amendment 02).
 * Nguồn sự thật duy nhất cho việc route Portal nào thuộc module nào, để
 * Companion Orchestrator biết nên cân nhắc đội ngũ Agent nào.
 */

import type { PortalModule } from "./agent.types";
import { getAgentsByModule } from "./agent-registry";
import type { CompanionAgent } from "./agent.types";

const MODULE_ROUTE_PREFIXES: { prefix: string; module: PortalModule }[] = [
  { prefix: "/portal/aiworkspace", module: "khong-gian-ai" },
  { prefix: "/portal/hetrithucai", module: "ckos" },
  { prefix: "/portal/hocvienai", module: "academy" },
  { prefix: "/portal/duan-cohoi", module: "opportunities" },
  { prefix: "/portal/premium", module: "premium" },
  { prefix: "/portal/nhatkyhoctap", module: "learning-journal" },
  { prefix: "/portal/hanhtrinhcuatoi", module: "my-journey" },
  { prefix: "/portal/khuvuoncuaban", module: "living-garden" },
  // Portal 2.0, Giai đoạn 9 — Companion nổi (Widget). Route `/v2/*` tương
  // ứng, ánh xạ vào ĐÚNG 8 module đã có (không thêm module mới) — kể cả khi
  // 2.0 đã gộp vài khu vực 1.0 vào chung 1 trang (CKOS+Học viện AI+AI
  // Workspace → `/v2/hoc-vien-ai`; Nhật ký học tập+Khu vườn+My Story+Mirror+
  // Bản đồ hành trình → `/v2/hanh-trinh-cua-toi`, xem Giai đoạn 8), ánh xạ
  // theo ĐÚNG module chính của trang đó.
  { prefix: "/v2/ai-workspace", module: "khong-gian-ai" },
  { prefix: "/v2/he-tri-thuc", module: "ckos" },
  { prefix: "/v2/hoc-vien-ai", module: "academy" },
  { prefix: "/v2/du-an-co-hoi", module: "opportunities" },
  { prefix: "/v2/premium", module: "premium" },
  { prefix: "/v2/hanh-trinh-cua-toi", module: "my-journey" },
];

export const MODULE_LABELS: Record<PortalModule, string> = {
  "khong-gian-ai": "AI Workspace",
  ckos: "Hệ tri thức AI (CKOS)",
  academy: "Học viện AI",
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
