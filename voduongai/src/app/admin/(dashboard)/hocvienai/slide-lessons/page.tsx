"use client";

import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { SlideLessonsAdminClient } from "./SlideLessonsAdminClient";

/**
 * Mục 4b (kế hoạch gốc 14 hạng mục) — Học viện AI 2.0, tab "Khóa học & Lộ
 * trình": 3 nhóm "Học AI theo nhu cầu/công cụ/nghề nghiệp" (55 bài slide).
 * Không dùng `VisualEditor` generic (không hỗ trợ mảng object lồng nhau
 * cho `slides[]`) — editor riêng, cùng tinh thần `LessonEditor.tsx`/
 * `CourseBuilderClient.tsx` (list bên trái + form bên phải).
 */
export default function AdminAcademySlideLessonsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="academy-atmosphere-bg">
      <div className="space-y-4">
        <AdminBreadcrumb
          trail={[
            { label: "Học viện" },
            { label: "Học viện AI", href: "/admin/hocvienai/work-needs" },
            { label: "Học AI theo nhu cầu/công cụ/nghề nghiệp" },
          ]}
        />
        <div>
          <h1 className="text-lg font-extrabold text-gray-900">Học viện AI — 3 nhóm bài học (55 bài slide)</h1>
          <p className="mt-1 text-sm text-gray-500">
            Mỗi nhóm 3 bài đầu (theo thứ tự bên trái) miễn phí xem thử — các bài còn lại chỉ tài khoản Premium xem
            được. Đặt <b>Trạng thái</b> = Published để bài hiện lên Portal.
          </p>
        </div>
        <SlideLessonsAdminClient />
      </div>
    </AdminAtmosphere>
  );
}
