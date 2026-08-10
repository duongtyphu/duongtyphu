import Link from "next/link";
import { ChevronRight, Flame, Clock, Trophy } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { PortalHero } from "@/components/v2/portal/PortalHero";
import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge, ProgressBar } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { getV2Session } from "@/lib/v2/auth";
import {
  getJourneySummary,
  getMembershipSummary,
  listContinueLearning,
  listExploreCards,
  listQuickLinks,
  listSuggestions,
} from "@/lib/v2/data/home";
import { listNotifications } from "@/lib/v2/data/notifications";

export const metadata = { title: "Trang chủ" };

const NOTICE_DOT_COLOR: Record<string, string> = {
  system: "var(--v2-violet)",
  course: "#22b35d",
  affiliate: "#e2b23c",
  community: "#5f8fff",
};

/** "Võ Đương" -> "Đương" — hero chào bằng tên gọi, không đọc cả họ tên. */
function firstNameOf(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  return words.length > 1 ? words[words.length - 1] : (words[0] ?? "");
}

/** "2026-08-10T08:12:00+07:00" -> "2 giờ trước" */
function timeAgo(iso: string, now: Date): string {
  const diffMinutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (diffMinutes < 60) return `${Math.max(1, diffMinutes)} phút trước`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.round(hours / 24)} ngày trước`;
}

export default async function TrangChuPage() {
  const [session, explore, learning, suggestions, journey, quickLinks, membership, notifications] =
    await Promise.all([
      getV2Session(),
      listExploreCards(),
      listContinueLearning(),
      listSuggestions(),
      getJourneySummary(),
      listQuickLinks(),
      getMembershipSummary(),
      listNotifications(),
    ]);

  const fullName = session?.fullName ?? "";
  const now = new Date();

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      {/* ------------------------------------------------------- cột giữa */}
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <PortalHero firstName={firstNameOf(fullName)} />

        <section>
          <SectionHead
            title="Khám phá nhanh"
            action={
              <Link href={`${V2_PORTAL_BASE}/he-tri-thuc`} className="text-[13px] font-semibold">
                Xem tất cả
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-[14px] min-[900px]:grid-cols-3 min-[1400px]:grid-cols-6">
            {explore.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="rounded-[var(--v2-radius-md)] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-[14px] py-[18px] text-center text-inherit transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(109,74,255,.12)]"
              >
                <IcoBox
                  icon={card.icon}
                  size="xl"
                  background={card.gradient}
                  color="#fff"
                  className="mx-auto mb-[2px]"
                />
                <h3 className="mb-1 text-[13.5px] font-bold">{card.title}</h3>
                <p className="text-[11.5px] leading-[1.4] text-[var(--v2-muted)]">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead
            title="Tiếp tục học tập"
            action={
              <Link href={`${V2_PORTAL_BASE}/hoc-vien-ai`} className="text-[13px] font-semibold">
                Xem tất cả khóa học
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-[14px] min-[720px]:grid-cols-2 min-[1200px]:grid-cols-4">
            {learning.map((course) => (
              <Link
                key={course.id}
                href={course.href}
                className="flex flex-col gap-[10px] rounded-[var(--v2-radius-md)] border border-black/4 p-4 text-inherit shadow-[0_2px_8px_rgba(30,20,80,.06)] transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-[0_10px_22px_rgba(30,20,80,.14)]"
                style={{ background: course.cardBackground }}
              >
                <span
                  className="self-start rounded-md px-[9px] py-[3px] text-[10.5px] font-extrabold tracking-[0.03em]"
                  style={{ background: course.tagBackground, color: course.tagColor }}
                >
                  {course.tag}
                </span>
                <IcoBox
                  icon={course.icon}
                  size="lg"
                  background={course.iconGradient}
                  color="#fff"
                  className="!h-11 !w-11 !rounded-[11px]"
                />
                <h4 className="min-h-9 text-[13.5px] leading-[1.35] font-bold">{course.title}</h4>
                <ProgressBar
                  value={course.progress}
                  height={6}
                  trackClassName="bg-black/8"
                  fillStyle={course.progressColor}
                  label={`Tiến độ ${course.title}`}
                />
                <span className="text-[11.5px] font-bold text-[var(--v2-muted)]">
                  {course.progress}%
                </span>
                <span className="mt-[2px] rounded-lg border border-black/6 bg-white/70 p-2 text-center text-[12.5px] font-bold transition-[transform,background,box-shadow] duration-150 hover:-translate-y-px hover:bg-white hover:shadow-[0_6px_14px_rgba(30,20,80,.15)]">
                  {course.cta}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead
            title="Gợi ý dành cho bạn"
            action={
              <Link href={`${V2_PORTAL_BASE}/ai-workspace`} className="text-[13px] font-semibold">
                Xem tất cả
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-[14px] min-[900px]:grid-cols-3 min-[1300px]:grid-cols-5">
            {suggestions.map((item) => (
              <Link
                key={item.id}
                href={`${V2_PORTAL_BASE}/ai-workspace`}
                className="rounded-[var(--v2-radius-md)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[14px] text-inherit transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(109,74,255,.1)]"
              >
                <span
                  className="mb-[10px] inline-block rounded-[5px] px-[7px] py-[2px] text-[10px] font-extrabold tracking-[0.04em]"
                  style={{ background: item.kindBackground, color: item.kindColor }}
                >
                  {item.kind}
                </span>
                <IcoBox
                  icon={item.icon}
                  size="md"
                  background={item.iconGradient}
                  color="#fff"
                  className="mb-3"
                />
                <h5 className="mb-2 text-[13px] leading-[1.35] font-bold">{item.title}</h5>
                <span className="text-[11.5px] text-[var(--v2-muted)]">{item.meta}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* -------------------------------------------------------- cột phải */}
      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <h3 className="mb-2 text-[15px] font-extrabold">
            Xin chào, {firstNameOf(fullName) || "bạn"}! 👋
          </h3>
          <div className="mb-[14px]">
            <Badge tone="gold">{membership.planLabel}</Badge>
          </div>
          <div className="mb-1 flex justify-between text-[12.5px] text-[var(--v2-muted)]">
            <span>Gói</span>
            <b className="font-bold text-[var(--v2-text)]">{membership.planName}</b>
          </div>
          <div className="mb-1 flex justify-between text-[12.5px] text-[var(--v2-muted)]">
            <span>Hết hạn</span>
            <b className="font-bold text-[var(--v2-text)]">{membership.expiresAt}</b>
          </div>
          <Link
            href={`${V2_PORTAL_BASE}/premium`}
            className="mt-3 block w-full rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] p-[10px] text-center text-[13px] font-bold text-white transition-[transform,box-shadow,filter] duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_18px_rgba(109,74,255,.4)]"
          >
            Quản lý gói Premium
          </Link>
        </Card>

        <Card>
          <CardHead
            title="Hành trình của bạn"
            action={
              <Link
                href={`${V2_PORTAL_BASE}/hanh-trinh-cua-toi`}
                className="text-[12.5px] font-bold"
              >
                Xem chi tiết
              </Link>
            }
          />
          <div className="mb-[14px] flex items-center gap-3">
            <IcoBox
              icon={Trophy}
              size="lg"
              background="linear-gradient(145deg,#b18bff,#6d4aff)"
              color="#fff"
            />
            <div>
              <div className="text-[11.5px] text-[var(--v2-muted)]">Cấp độ hiện tại</div>
              <div className="text-[14px] font-extrabold">{journey.levelName}</div>
            </div>
          </div>
          <ProgressBar
            value={(journey.xp / journey.xpTarget) * 100}
            label="Tiến độ kinh nghiệm"
          />
          <div className="mt-2 mb-[14px] text-[11.5px] text-[var(--v2-muted)]">
            {journey.xp.toLocaleString("vi-VN")} / {journey.xpTarget.toLocaleString("vi-VN")} XP
          </div>
          <div className="flex gap-[10px]">
            <div className="flex-1 rounded-[10px] bg-[var(--v2-bg)] p-[10px] text-center">
              <div className="flex items-center justify-center gap-1 text-[15px] font-extrabold">
                <Flame className="h-4 w-4 text-[#f97316]" aria-hidden="true" />
                {journey.streakDays} ngày
              </div>
              <div className="mt-[2px] text-[10.5px] text-[var(--v2-muted)]">Chuỗi ngày học</div>
            </div>
            <div className="flex-1 rounded-[10px] bg-[var(--v2-bg)] p-[10px] text-center">
              <div className="flex items-center justify-center gap-1 text-[15px] font-extrabold">
                <Clock className="h-4 w-4 text-[var(--v2-violet)]" aria-hidden="true" />
                {journey.totalLearnTime}
              </div>
              <div className="mt-[2px] text-[10.5px] text-[var(--v2-muted)]">
                Tổng thời gian học
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead title="Truy cập nhanh" />
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                href={link.href}
                className="flex items-center gap-[10px] border-b border-[var(--v2-line)] py-[10px] text-[13px] font-semibold text-inherit last:border-b-0"
              >
                <Icon className="h-4 w-4 shrink-0 text-[var(--v2-violet)]" aria-hidden="true" />
                {link.label}
                <ChevronRight
                  className="ml-auto h-4 w-4 text-[var(--v2-muted)]"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </Card>

        <Card>
          <CardHead
            title="Thông báo mới"
            action={
              <Link href={`${V2_PORTAL_BASE}/hanh-trinh-cua-toi`} className="text-[12.5px] font-bold">
                Xem tất cả
              </Link>
            }
          />
          {notifications.slice(0, 3).map((notice) => (
            <div key={notice.id} className="flex gap-[10px] py-[10px]">
              <span
                aria-hidden="true"
                className="mt-[6px] h-2 w-2 shrink-0 rounded-full"
                style={{ background: NOTICE_DOT_COLOR[notice.kind] ?? "var(--v2-violet)" }}
              />
              <div>
                <div className="text-[12.5px] leading-[1.45] font-semibold">
                  {notice.title}
                  <br />
                  <span className="font-normal text-[var(--v2-muted)]">{notice.body}</span>
                </div>
                <div className="mt-1 text-[11px] text-[var(--v2-muted)]">
                  {timeAgo(notice.createdAt, now)}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </aside>
    </div>
  );
}
