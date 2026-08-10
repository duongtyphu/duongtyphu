import Link from "next/link";
import { Clock, GraduationCap, Layers, Users } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge, ProgressBar } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatVnd } from "@/lib/v2/data/client";
import { listCourses, listJourneyStages } from "@/lib/v2/data/catalog";

export const metadata = { title: "Học viện AI" };

export default async function HocVienAiPage() {
  const [courses, stages] = await Promise.all([listCourses(), listJourneyStages()]);
  const openCourses = courses.filter((course) => course.status === "published");

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Học viện AI</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Lộ trình bài bản từ cơ bản đến nâng cao, học đi đôi với thực hành.
            </p>
          </div>
          <IcoBox
            icon={GraduationCap}
            size="xl"
            background="linear-gradient(145deg,#3ecf7e,#189a52)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <section>
          <SectionHead title="Khoá học đang mở" />
          <div className="grid grid-cols-1 gap-[14px] min-[760px]:grid-cols-2 min-[1300px]:grid-cols-3">
            {openCourses.map((course) => (
              <Card key={course.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <IcoBox
                    icon={GraduationCap}
                    size="md"
                    background={`linear-gradient(145deg,${course.accentFrom},${course.accentTo})`}
                    color="#fff"
                  />
                  <Badge tone={course.isPremium ? "gold" : "green"}>
                    {course.isPremium ? "Premium" : "Miễn phí"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-[14px] leading-[1.35] font-bold">{course.title}</h3>
                  <p className="mt-1 text-[12px] leading-[1.45] text-[var(--v2-muted)]">
                    {course.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-[11.5px] text-[var(--v2-muted)]">
                  <span className="flex items-center gap-1">
                    <Layers className="h-[13px] w-[13px]" aria-hidden="true" />
                    {course.lessonCount} bài
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-[13px] w-[13px]" aria-hidden="true" />
                    {Math.round(course.durationMinutes / 60)} giờ
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-[13px] w-[13px]" aria-hidden="true" />
                    {course.enrolledCount.toLocaleString("vi-VN")}
                  </span>
                </div>

                {typeof course.progress === "number" ? (
                  <>
                    <ProgressBar value={course.progress} height={6} label={`Tiến độ ${course.title}`} />
                    <span className="text-[11.5px] font-bold text-[var(--v2-muted)]">
                      Đã hoàn thành {course.progress}%
                    </span>
                  </>
                ) : null}

                <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                  <span className="text-[13px] font-extrabold">
                    {course.price === 0 ? "Miễn phí" : formatVnd(course.price)}
                  </span>
                  <span className="rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] px-4 py-2 text-[12.5px] font-bold text-white">
                    {typeof course.progress === "number" && course.progress > 0
                      ? "Tiếp tục học"
                      : "Bắt đầu học"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead
            title="Lộ trình học tập"
            action={
              <Link href={`${V2_PORTAL_BASE}/hanh-trinh-cua-toi`} className="text-[12.5px] font-bold">
                Xem chi tiết
              </Link>
            }
          />
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="border-b border-[var(--v2-line)] py-3 last:border-b-0"
            >
              <div className="mb-[6px] flex items-center gap-2">
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--v2-violet-light)] text-[11px] font-extrabold text-[var(--v2-violet)]">
                  {index + 1}
                </span>
                <span className="text-[13px] font-bold">{stage.name}</span>
                <span className="ml-auto text-[11.5px] font-bold text-[var(--v2-muted)]">
                  {stage.progress}%
                </span>
              </div>
              <ProgressBar value={stage.progress} height={5} label={`Tiến độ ${stage.name}`} />
            </div>
          ))}
        </Card>

        <Card>
          <CardHead title="Thống kê của bạn" />
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              { label: "Khoá đang học", value: "3" },
              { label: "Đã hoàn thành", value: "8" },
              { label: "Chứng chỉ", value: "5" },
              { label: "Giờ học tích luỹ", value: "32:45" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[10px] bg-[var(--v2-bg)] p-[10px] text-center">
                <div className="text-[15px] font-extrabold">{stat.value}</div>
                <div className="mt-[2px] text-[10.5px] text-[var(--v2-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
