import Link from "next/link";

export type CourseStatus = "not-started" | "in-progress" | "completed" | "locked" | "premium" | "coming-soon";

const STATUS_LABEL: Record<CourseStatus, string> = {
  "not-started": "Chưa bắt đầu",
  "in-progress": "Đang học",
  completed: "Đã hoàn thành",
  locked: "Bị khoá",
  premium: "Premium",
  "coming-soon": "Sắp ra mắt",
};

const STATUS_CTA: Record<CourseStatus, string> = {
  "not-started": "Bắt đầu học",
  "in-progress": "Tiếp tục học",
  completed: "Xem lại",
  locked: "Mở khoá",
  premium: "Xem chi tiết",
  "coming-soon": "Sắp ra mắt",
};

const STATUS_TONE: Record<CourseStatus, string> = {
  "not-started": "bg-white/10 text-white/70",
  "in-progress": "bg-brand-blue/15 text-brand-blue",
  completed: "bg-emerald-400/15 text-emerald-300",
  locked: "bg-white/10 text-white/50",
  premium: "bg-brand-orange/15 text-brand-orange",
  "coming-soon": "bg-white/10 text-white/50",
};

type CourseCardProps = {
  title: string;
  description?: string;
  href: string;
  level?: string;
  lessonsCount?: number;
  progressPercent?: number;
  status?: CourseStatus;
};

/**
 * Only renders fields with real data — lessonsCount/level/progressPercent
 * are optional because most course data sources don't track them yet.
 */
export function CourseCard({ title, description, href, level, lessonsCount, progressPercent, status }: CourseCardProps) {
  const isLocked = status === "locked" || status === "coming-soon";

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        {status && (
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_TONE[status]}`}>
            {STATUS_LABEL[status]}
          </span>
        )}
        {level && <span className="text-[10px] font-semibold text-white/40">{level}</span>}
      </div>
      <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
      {description && <p className="mt-1.5 text-xs text-white/60">{description}</p>}
      {typeof lessonsCount === "number" && (
        <p className="mt-2 text-xs text-white/40">{lessonsCount} bài học</p>
      )}
      {typeof progressPercent === "number" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-violet"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
      {status && (
        <span className="mt-3 inline-flex text-xs font-semibold text-brand-blue">
          {STATUS_CTA[status]} →
        </span>
      )}
    </>
  );

  const className = `card-shine flex h-full flex-col rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition ${
    isLocked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
  }`;

  if (isLocked) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
