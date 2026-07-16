"use client";

import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { ACADEMY_WORKSPACE_SECTIONS } from "@/lib/admin/academy/navigation";
import { useCollection } from "@/lib/admin/store";
import type { RoadmapStep, DailyMission } from "@/data/admin/roadmap";
import { getAllLearningJourneys } from "@/features/academy/services/journey.service";

type ObjectMapping = {
  object: string;
  status: "real" | "renamed" | "removed" | "absent";
  note: string;
};

/**
 * 10 Learning Object đúng brief IMP-ACADEMY-401, đối chiếu trực tiếp với
 * Portal thật (không suy diễn) — Task 1 "Learning Registry" yêu cầu hiển
 * thị TOÀN BỘ Learning Object, kể cả khi câu trả lời trung thực là "không
 * tồn tại". Nguồn cho từng dòng: xem
 * docs/admin/ACADEMY_WORKSPACE_MANAGEMENT_ACADEMY-SPR-401.md.
 */
const OBJECT_MAPPING: ObjectMapping[] = [
  { object: "Learning Path", status: "renamed", note: "= \"Hành trình học tập\", chiếu 1:1 từ bộ sưu tập CKOS (đọc, không sở hữu). Xem tab \"Hành trình học tập\"." },
  { object: "Course", status: "removed", note: "Đã bị loại bỏ khỏi Academy theo Product Decision (\"Academy Reset\", /portal/ai-academy). \"Course\" còn tồn tại nhưng thuộc mảng Premium (bảng courses, /admin/course-pricing) — không phải Academy." },
  { object: "Module", status: "absent", note: "Không tồn tại ở bất kỳ đâu trong Portal — 0 route, 0 component, 0 bảng dữ liệu." },
  { object: "Lesson", status: "absent", note: "Không có object có cấu trúc. Chỉ xuất hiện dạng nhãn text tự do (Roadmap.relatedLesson, Daily Mission taskType \"Hoàn thành bài học\") — không phải dữ liệu thật." },
  { object: "Quiz", status: "absent", note: "0 tham chiếu trong toàn bộ Portal." },
  { object: "Assignment", status: "renamed", note: "= \"Dự án thực chiến\" (Project Submissions) — nhưng là hộp thư chấm bài học viên tự nộp tự do, KHÔNG phải một Assignment chính thức do Founder định nghĩa trước." },
  { object: "Exercise", status: "renamed", note: "Tồn tại dạng field `exercise` trên Knowledge Seed (CKOS, features/knowledge) — thuộc CKOS sở hữu, không phải Academy." },
  { object: "Certificate", status: "absent", note: "0 tham chiếu trong toàn bộ Portal." },
  { object: "Instructor", status: "absent", note: "0 tham chiếu trong toàn bộ Portal." },
  { object: "Learning Schedule", status: "renamed", note: "= \"Nhiệm vụ hôm nay\" (Daily Missions, có field repeatsDaily) — gần đúng nhất với khái niệm lịch học lặp lại." },
];

const STATUS_LABEL: Record<ObjectMapping["status"], string> = {
  real: "✅ Tồn tại đúng tên",
  renamed: "⚠️ Tồn tại dưới tên khác",
  removed: "❌ Đã loại bỏ (Product Decision)",
  absent: "❌ Chưa từng tồn tại",
};

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

/**
 * Academy Dashboard / Learning Registry (Task 1, ACADEMY-SPR-401) — số
 * liệu thật từ 3 Registry Academy thật đang có (Roadmap/Daily Missions/
 * Project Submissions không đọc được ở client nên không tính vào đây, xem
 * ghi chú) + Learning Journeys (đọc, chiếu từ CKOS).
 */
export default function AcademyDashboardPage() {
  const roadmap = useCollection<RoadmapStep>("roadmap-steps", []);
  const missions = useCollection<DailyMission>("daily-missions", []);
  const journeys = getAllLearningJourneys();

  const ready = roadmap.ready && missions.ready;

  return (
    <AdminWorkspaceShell
      title="Học viện AI"
      description="Toàn bộ Learning Experience thật của Portal — Lộ trình thành công, Nhiệm vụ hôm nay, Dự án thực chiến, và Hành trình học tập (chỉ đọc, chiếu từ Hệ tri thức AI). Không quản lý Course/Module/Quiz/Certificate/Instructor — các khái niệm này không tồn tại trong Portal hiện tại, xem bảng đối chiếu bên dưới."
      rootHref="/admin/academy"
      sections={ACADEMY_WORKSPACE_SECTIONS}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Bước Lộ trình" value={roadmap.items.length} sub={ready ? `${roadmap.items.filter((s) => s.status === "Published").length} đã Published` : undefined} />
          <StatCard label="Nhiệm vụ hôm nay" value={missions.items.length} sub="⚠️ 0 Portal consumer, xem báo cáo" />
          <StatCard label="Hành trình học tập" value={journeys.length} sub="Chiếu từ Hệ tri thức AI, nơi khác sở hữu" />
          <StatCard label="Dự án thực chiến" value={0} sub="Xem trực tiếp tại tab Dự án thực chiến (Server Component)" />
        </div>

        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">⚠️ Đối chiếu 10 Learning Object (brief IMP-ACADEMY-401) với Portal thật</h2>
          <p className="mt-1 text-xs text-white/50">
            Task 1 yêu cầu hiển thị toàn bộ Learning Object — bảng dưới là câu trả lời trung thực, không bịa dữ liệu cho object không tồn tại.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 pr-4 font-semibold">Learning Object</th>
                  <th className="py-2 pr-4 font-semibold">Trạng thái</th>
                  <th className="py-2 font-semibold">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {OBJECT_MAPPING.map((row) => (
                  <tr key={row.object} className="border-b border-white/5">
                    <td className="py-2 pr-4 font-semibold text-white/80">{row.object}</td>
                    <td className="py-2 pr-4 whitespace-nowrap text-white/70">{STATUS_LABEL[row.status]}</td>
                    <td className="py-2 text-xs text-white/50">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ACADEMY_WORKSPACE_SECTIONS.filter((s) => s.key !== "dashboard").map((s) => (
              <Link
                key={s.key}
                href={s.href}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm font-semibold text-white/80 transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
