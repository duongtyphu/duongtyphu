import {
  getCkosCategories,
  getCkosDocuments,
  getCkosPopularDocuments,
  getCkosStages,
} from "@/lib/portal/live-ckos";
import { getLiveKnowledgeCollections, getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";
import { getAcademyFeaturedCourses, getAcademyPaths, getAcademyProgress } from "@/lib/portal/live-academy";
import { getLivePrompts } from "@/lib/portal/live-prompts";
import { getLiveSops } from "@/lib/portal/live-sop";
import { getLiveResources } from "@/lib/portal/live-resources";
import { getLiveBestPractices } from "@/lib/portal/live-best-practices";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { HocVienAiClient } from "./HocVienAiClient";

export const metadata = { title: "Học viện AI | VO DUONG AI" };

/**
 * `/v2/hoc-vien-ai` — trang GỘP "Học viện AI" (Giai đoạn 2 trở đi của kế
 * hoạch gộp CKOS + Học viện AI, xem docblock đầu `HocVienAiClient.tsx`).
 * Tab "AI Workspace" đã bị gỡ hẳn khỏi trang này (đúng kế hoạch gốc 14
 * hạng mục, mục 4a) — nội dung đó vẫn sống độc lập ở `/v2/ai-workspace`,
 * không còn được fetch/truyền xuống ở đây nữa.
 *
 * Server Component: fetch TOÀN BỘ dữ liệu thật của CKOS + Học viện AI +
 * Thư viện tài nguyên (4 nguồn: Prompt/SOP/Resource/Best Practice — Case
 * Study và Blog AI đã bị gỡ khỏi danh mục này theo yêu cầu Founder, mục
 * 4c) trong 1 lần `Promise.all`, truyền xuống `HocVienAiClient` (1 Client
 * Component duy nhất, 3 tab nội bộ thay vì nhiều route riêng).
 */
const CKOS_INTRO =
  "CKOS (Vo Duong AI Knowledge Operating System) là hệ tri thức toàn diện, được xây dựng để giúp bạn học, hiểu và ứng dụng AI vào thực tế một cách hiệu quả và bền vững.";

export default async function HocVienAiPage() {
  const premium = await getPremiumStatus();

  const [categories, documents, stages, popular, collections, seeds, paths, courses, progress, prompts, sops, resourceList, bestPractices] =
    await Promise.all([
      getCkosCategories(),
      getCkosDocuments(),
      getCkosStages(),
      getCkosPopularDocuments(3),
      getLiveKnowledgeCollections(),
      getLiveKnowledgeSeeds(),
      getAcademyPaths(),
      getAcademyFeaturedCourses(),
      getAcademyProgress(),
      getLivePrompts(),
      getLiveSops(),
      getLiveResources(),
      getLiveBestPractices(),
    ]);

  return (
    <HocVienAiClient
      premium={premium}
      ckos={{ categories, documents, stages, ckosIntro: CKOS_INTRO, popular, collections, seeds }}
      academy={{ paths, courses, progress }}
      resourceLibrary={{ prompts, sops, resources: resourceList, bestPractices }}
    />
  );
}
