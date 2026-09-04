"use client";

/**
 * View "Lịch" (7/10) — `/v2/moi-ngay-mot-y-tuong/lich`, 1:1 với mockup dòng
 * 271-320: đồng hồ số lớn + ngày đầy đủ (client-only, đồng hồ máy thật —
 * gate `mounted` để tránh hydration mismatch, cùng kỹ thuật "lời chào theo
 * giờ" của `TrangChuClient.tsx`), 2 thẻ chuỗi ngày/tổng ngày hoàn thành,
 * lịch tháng chấm điểm ngày đã hoàn thành, thẻ "ý tưởng ngày mai" khoá kèm
 * đếm ngược tới nửa đêm.
 *
 * Lịch dựng ở CLIENT cho BẤT KỲ tháng nào từ `completionDates` (mảng đầy đủ
 * `YYYY-MM-DD`, `getMnytCompletionDates()`) — cùng kỹ thuật "Nhật ký học
 * tập" 1.0 (`buildCalendarMonth`) đã dùng, không giới hạn đúng 1 tháng ở
 * server.
 */

import { useEffect, useMemo, useState } from "react";

type Props = {
  lang: "vi" | "en";
  streak: number;
  completionDates: string[];
  initialYear: number;
  initialMonth: number; // 0-based
  tomorrowCategoryName: string | null;
};

const T = {
  vi: {
    title: "Lịch",
    subtitle: "Theo dõi lịch trình học và chuỗi ngày liên tục của bạn.",
    streakLabel: "Chuỗi ngày",
    totalLabel: "Tổng ngày hoàn thành",
    prevAria: "Tháng trước",
    nextAria: "Tháng sau",
    weekdays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    tomorrowTitle: "Ý tưởng ngày mai",
    tomorrowLocked: "Đã khoá — mở lúc 00:00",
    unlockIn: "Mở khoá sau",
  },
  en: {
    title: "Calendar",
    subtitle: "Track your learning schedule and streak.",
    streakLabel: "Streak",
    totalLabel: "Total days completed",
    prevAria: "Previous month",
    nextAria: "Next month",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    tomorrowTitle: "Tomorrow's idea",
    tomorrowLocked: "Locked — unlocks at 00:00",
    unlockIn: "Unlocks in",
  },
} as const;

const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function MnytCalendarClient({ lang, streak, completionDates, initialYear, initialMonth, tomorrowCategoryName }: Props) {
  const isVi = lang === "vi";
  const t = T[isVi ? "vi" : "en"];

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => {
      setMounted(true);
      setNow(new Date());
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const completionSet = useMemo(() => new Set(completionDates), [completionDates]);
  const totalCompletedDays = completionSet.size;

  const monthLabel = isVi ? `Tháng ${viewMonth + 1}, ${viewYear}` : `${MONTH_NAMES_EN[viewMonth]} ${viewYear}`;

  const cells = useMemo(() => {
    const firstWeekday = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
    const out: { key: string; day: number | null; dateStr: string | null; done: boolean }[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push({ key: `pad-${i}`, day: null, dateStr: null, done: false });
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(day)}`;
      out.push({ key: dateStr, day, dateStr, done: completionSet.has(dateStr) });
    }
    return out;
  }, [viewYear, viewMonth, completionSet]);

  const todayStr = mounted && now ? now.toISOString().slice(0, 10) : null;

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const clockStr = mounted && now ? now.toLocaleTimeString(isVi ? "vi-VN" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";
  const fullDateStr =
    mounted && now
      ? now.toLocaleDateString(isVi ? "vi-VN" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : "";

  const unlockCountdown = useMemo(() => {
    if (!mounted || !now) return "";
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ms = midnight.getTime() - now.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return isVi ? `${h} giờ ${m} phút` : `${h}h ${m}m`;
  }, [mounted, now, isVi]);

  return (
    <section className="mnyt-calendar" data-screen-label="Calendar">
      <h1 className="mnyt-calendar-title">{t.title}</h1>
      <p className="mnyt-calendar-subtitle">{t.subtitle}</p>

      <div className="mnyt-calendar-clock-card">
        <div className="mnyt-calendar-clock-glow" aria-hidden="true" />
        <div className="mnyt-calendar-clock-str">{clockStr}</div>
        <div className="mnyt-calendar-clock-date">{fullDateStr}</div>
      </div>

      <div className="mnyt-calendar-stats-row">
        <div className="mnyt-calendar-stat-card mnyt-calendar-stat-card-amber">
          <div className="mnyt-calendar-stat-label">{t.streakLabel}</div>
          <div className="mnyt-calendar-stat-value">{streak}</div>
        </div>
        <div className="mnyt-calendar-stat-card mnyt-calendar-stat-card-violet">
          <div className="mnyt-calendar-stat-label">{t.totalLabel}</div>
          <div className="mnyt-calendar-stat-value">{totalCompletedDays}</div>
        </div>
      </div>

      <div className="mnyt-calendar-grid-card">
        <div className="mnyt-calendar-grid-head">
          <button type="button" className="mnyt-calendar-nav-btn" aria-label={t.prevAria} onClick={goPrevMonth}>
            ←
          </button>
          <div className="mnyt-calendar-month-label">{monthLabel}</div>
          <button type="button" className="mnyt-calendar-nav-btn" aria-label={t.nextAria} onClick={goNextMonth}>
            →
          </button>
        </div>
        <div className="mnyt-calendar-weekday-row">
          {t.weekdays.map((wd) => (
            <div key={wd} className="mnyt-calendar-weekday">
              {wd}
            </div>
          ))}
        </div>
        <div className="mnyt-calendar-day-grid">
          {cells.map((c) => (
            <div key={c.key} className="mnyt-calendar-day-cell" data-today={mounted && c.dateStr === todayStr} data-blank={c.day === null}>
              {c.day}
              {c.done && <div className="mnyt-calendar-day-dot" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mnyt-calendar-tomorrow-card">
        <div className="mnyt-calendar-tomorrow-lock" aria-hidden="true">
          🔒
        </div>
        <div className="mnyt-calendar-tomorrow-eyebrow">
          {t.tomorrowTitle}
          {tomorrowCategoryName ? ` · ${tomorrowCategoryName}` : ""}
        </div>
        <div className="mnyt-calendar-tomorrow-locked-label">{t.tomorrowLocked}</div>
        {mounted && (
          <div className="mnyt-calendar-tomorrow-countdown">
            {t.unlockIn} <strong>{unlockCountdown}</strong>
          </div>
        )}
      </div>
    </section>
  );
}
