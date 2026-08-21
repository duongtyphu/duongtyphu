import {
  getCkosCategories,
  getCkosDocuments,
  getCkosPopularDocuments,
  getCkosStages,
} from "@/lib/portal/live-ckos";
import { getLiveKnowledgeCollections, getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";
import { getAcademyFeaturedCourses, getAcademyPaths, getAcademyProgress } from "@/lib/portal/live-academy";
import {
  getWorkspaceActivity,
  getWorkspaceFavoriteTools,
  getWorkspaceLimits,
  getWorkspaceProjects,
  getWorkspaceToolGroups,
  getWorkspaceWorkflows,
} from "@/lib/portal/live-workspace";
import { getLivePrompts } from "@/lib/portal/live-prompts";
import { getLiveSops } from "@/lib/portal/live-sop";
import { getLiveResources } from "@/lib/portal/live-resources";
import { getLiveBestPractices } from "@/lib/portal/live-best-practices";
import { getLiveCaseStudies } from "@/lib/portal/live-case-studies";
import { getLiveBlogPosts } from "@/lib/portal/live-blog";
import { getLiveBadges, getUserBadges } from "@/lib/portal/live-badges";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { HocVienAiClient } from "./HocVienAiClient";

export const metadata = { title: "Học viện AI | VO DUONG AI" };

/**
 * `/v2/hoc-vien-ai` — trang GỘP "Học viện AI" (Giai đoạn 2 trở đi của kế
 * hoạch gộp CKOS + Học viện AI + AI Workspace, xem docblock đầu
 * `HocVienAiClient.tsx`).
 *
 * Server Component: fetch TOÀN BỘ dữ liệu thật của cả 3 mảng nội dung cũ
 * (CKOS/Học viện AI/AI Workspace) trong 1 lần `Promise.all`, truyền xuống
 * `HocVienAiClient` (1 Client Component duy nhất, 7 tab nội bộ thay vì 3
 * route riêng).
 */
const CKOS_INTRO =
  "CKOS (Vo Duong AI Knowledge Operating System) là hệ tri thức toàn diện, được xây dựng để giúp bạn học, hiểu và ứng dụng AI vào thực tế một cách hiệu quả và bền vững.";

export default async function HocVienAiPage() {
  const premium = await getPremiumStatus();

  const [
    categories,
    documents,
    stages,
    popular,
    collections,
    seeds,
    paths,
    courses,
    progress,
    groups,
    favorites,
    workflows,
    projects,
    activity,
    limits,
    prompts,
    sops,
    resourceList,
    bestPractices,
    caseStudies,
    blogPosts,
  ] = await Promise.all([
    getCkosCategories(),
    getCkosDocuments(),
    getCkosStages(),
    getCkosPopularDocuments(3),
    getLiveKnowledgeCollections(),
    getLiveKnowledgeSeeds(),
    getAcademyPaths(),
    getAcademyFeaturedCourses(),
    getAcademyProgress(),
    getWorkspaceToolGroups(),
    getWorkspaceFavoriteTools(),
    getWorkspaceWorkflows(),
    getWorkspaceProjects(),
    getWorkspaceActivity(),
    getWorkspaceLimits(premium),
    getLivePrompts(),
    getLiveSops(),
    getLiveResources(),
    getLiveBestPractices(),
    getLiveCaseStudies(),
    getLiveBlogPosts(),
  ]);

  // Đọc badges SAU khối Promise.all trên (không gộp chung) — `getAcademyProgress()`
  // ở trên vừa có thể trao huy hiệu mới qua `awardCourseCompletionBadges()`
  // (side-effect bên trong, xem live-academy.ts); đọc tuần tự sau đảm bảo
  // `getUserBadges()` thấy đúng huy hiệu vừa trao trong CÙNG lần tải trang,
  // không phải đợi F5 lần 2.
  const [badgeCatalog, earnedBadges] = await Promise.all([getLiveBadges(), getUserBadges()]);

  return (
    <HocVienAiClient
      premium={premium}
      ckos={{ categories, documents, stages, ckosIntro: CKOS_INTRO, popular, collections, seeds }}
      academy={{ paths, courses, progress }}
      workspace={{ groups, favorites, workflows, projects, activity, limits }}
      resourceLibrary={{ prompts, sops, resources: resourceList, bestPractices, caseStudies, blogPosts }}
      badges={{ catalog: badgeCatalog, earned: earnedBadges }}
    />
  );
}
