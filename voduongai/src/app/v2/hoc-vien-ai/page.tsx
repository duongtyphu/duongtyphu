import { getAcademyFeaturedCourses, getAcademyPaths, getAcademyProgress } from "@/lib/portal/live-academy";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { HocVienClient } from "./HocVienClient";

export const metadata = { title: "Học viện AI | VO DUONG AI" };

/**
 * `/v2/hoc-vien-ai` — Bước E.2.
 *
 * Server Component: đọc dữ liệu thật (4 giai đoạn lộ trình + khoá học có
 * nội dung Course Builder + tiến độ per-user) + trạng thái Premium, rồi
 * truyền xuống `HocVienClient` (Client Component vì bản gốc có tab đổi
 * trạng thái active).
 */
export default async function HocVienAiPage() {
  const [paths, courses, progress, premium] = await Promise.all([
    getAcademyPaths(),
    getAcademyFeaturedCourses(),
    getAcademyProgress(),
    getPremiumStatus(),
  ]);

  return <HocVienClient paths={paths} courses={courses} progress={progress} premium={premium} />;
}
