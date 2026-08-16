import {
  getWorkspaceActivity,
  getWorkspaceFavoriteTools,
  getWorkspaceLimits,
  getWorkspaceProjects,
  getWorkspaceToolGroups,
  getWorkspaceWorkflows,
} from "@/lib/portal/live-workspace";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { AiWorkspaceClient } from "./AiWorkspaceClient";

export const metadata = { title: "AI Workspace | VO DUONG AI" };

/**
 * `/v2/ai-workspace` — Bước E.3 (module cuối trong 3 module ưu tiên).
 *
 * Server Component: đọc dữ liệu thật (6 nhóm công cụ, công cụ yêu thích, 4
 * workflow mẫu, dự án của user + mẫu, hoạt động gần đây) + trạng thái Premium
 * + giới hạn Free (Bước D), rồi truyền xuống `AiWorkspaceClient` (Client
 * Component vì bản gốc có tab/toggle đổi trạng thái active).
 */
export default async function AiWorkspacePage() {
  const premium = await getPremiumStatus();
  const [groups, favorites, workflows, projects, activity, limits] = await Promise.all([
    getWorkspaceToolGroups(),
    getWorkspaceFavoriteTools(),
    getWorkspaceWorkflows(),
    getWorkspaceProjects(),
    getWorkspaceActivity(),
    getWorkspaceLimits(premium),
  ]);

  return (
    <AiWorkspaceClient
      premium={premium}
      limits={limits}
      groups={groups}
      favorites={favorites}
      workflows={workflows}
      projects={projects}
      activity={activity}
    />
  );
}
