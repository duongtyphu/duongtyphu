"use client";

/**
 * View "Huy hiệu" (6/10) — `/v2/moi-ngay-mot-y-tuong/huy-hieu`, 1:1 với
 * mockup dòng 987-1058: thanh tiến độ tổng ("Huy hiệu" X/Y), thẻ "huy hiệu
 * kế tiếp" (tỉ lệ hoàn thành cao nhất trong số CHƯA đạt), biểu đồ cột 7 ngày
 * gần nhất, 3 tab lọc (Tất cả/Đã đạt/Chưa đạt), lưới thẻ huy hiệu.
 *
 * Mockup dùng 3 ảnh PNG không tồn tại trong repo (`badge-streak.png`/
 * `badge-total.png`/`badge-category.png`) — thay bằng SVG glyph vẽ tay
 * (ngọn lửa/cúp/mũ tốt nghiệp) theo đúng 3 `type` của `BadgeDef`, giữ đúng
 * ý đồ "icon khác nhau theo loại huy hiệu" của mockup.
 *
 * `earned` lấy THẲNG từ `state.badges` thật (`buildBadgeCards()`,
 * `src/lib/mnyt/badges.ts`) — không tự tính lại `check()` ở client.
 */

import { useMemo, useState } from "react";

import type { BadgeCardData } from "@/lib/mnyt/badges";
import { TIER_COLORS } from "@/lib/mnyt/badges";

type Props = {
  lang: "vi" | "en";
  cards: BadgeCardData[];
  progress7Day: { date: string; count: number }[];
};

const T = {
  vi: {
    title: "Huy hiệu",
    desc: "Sưu tập huy hiệu khi bạn duy trì thói quen học và chinh phục từng lĩnh vực.",
    overallLabel: "Huy hiệu",
    nextBadgeLabel: "Huy hiệu kế tiếp",
    progress7Label: "7 ngày gần nhất",
    filters: [
      { key: "all", label: "Tất cả" },
      { key: "earned", label: "Đã đạt" },
      { key: "locked", label: "Chưa đạt" },
    ],
    weekdays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    noNext: "Bạn đã đạt hết mọi huy hiệu hiện có — thật đáng nể!",
    empty: "Chưa có huy hiệu nào trong mục này.",
  },
  en: {
    title: "Badges",
    desc: "Collect badges as you keep your learning streak alive and master each field.",
    overallLabel: "Badges",
    nextBadgeLabel: "Next badge",
    progress7Label: "Last 7 days",
    filters: [
      { key: "all", label: "All" },
      { key: "earned", label: "Earned" },
      { key: "locked", label: "Locked" },
    ],
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    noNext: "You've earned every badge available — impressive!",
    empty: "No badges in this section yet.",
  },
} as const;

function BadgeGlyph({ type, tone }: { type: BadgeCardData["type"]; tone: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: tone, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "streak") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M12 22c4.5 0 7-3 7-6.5 0-3-1.7-4.6-2.7-6.4C15.4 7.6 15 6 15 4c-2.5 1.5-4.3 4-4.3 6.8 0 1.6.7 2.6.7 2.6S9 12 9 9c-1.7 1.6-3 3.9-3 6.5C6 19 8.5 22 12 22Z" />
      </svg>
    );
  }
  if (type === "total") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M8 4h8v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4V4Z" />
        <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5" />
        <path d="M12 12v4M9 20h6M10 16h4v4h-4z" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <path d="M12 4 2 8l10 4 10-4-10-4Z" />
      <path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 8v6" />
    </svg>
  );
}

export function MnytBadgesClient({ lang, cards, progress7Day }: Props) {
  const isVi = lang === "vi";
  const t = T[isVi ? "vi" : "en"];

  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");

  const badgeCount = cards.filter((c) => c.earned).length;
  const badgeTotalCount = cards.length;
  const overallPct = badgeTotalCount > 0 ? Math.round((badgeCount / badgeTotalCount) * 100) : 0;

  const nextBadge = useMemo(() => {
    let best: BadgeCardData | null = null;
    let bestPct = -1;
    for (const c of cards) {
      if (c.earned || c.target <= 0) continue;
      const pct = Math.min(100, Math.round((c.current / c.target) * 100));
      if (pct > bestPct) {
        bestPct = pct;
        best = c;
      }
    }
    return best ? { badge: best, pct: bestPct } : null;
  }, [cards]);

  const maxCount = Math.max(1, ...progress7Day.map((d) => d.count));

  const filtered = cards.filter((c) => (filter === "all" ? true : filter === "earned" ? c.earned : !c.earned));

  return (
    <section className="mnyt-badges" data-screen-label="Badges">
      <h1 className="mnyt-badges-title">{t.title}</h1>
      <p className="mnyt-badges-desc">{t.desc}</p>

      <div className="mnyt-badges-summary-row">
        <div className="mnyt-badges-overall-card">
          <div className="mnyt-badges-overall-head">
            <div className="mnyt-badges-overall-label">{t.overallLabel}</div>
            <div className="mnyt-badges-overall-count">
              {badgeCount}/{badgeTotalCount}
            </div>
          </div>
          <div className="mnyt-badges-bar-track">
            <div className="mnyt-badges-bar-fill" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {nextBadge && (
          <div className="mnyt-badges-next-card">
            <div className="mnyt-badges-next-icon" style={{ background: `${tierOrCategoryColor(nextBadge.badge)}22`, boxShadow: `0 0 10px ${tierOrCategoryColor(nextBadge.badge)}55` }}>
              <BadgeGlyph type={nextBadge.badge.type} tone={tierOrCategoryColor(nextBadge.badge)} />
            </div>
            <div className="mnyt-badges-next-body">
              <div className="mnyt-badges-next-eyebrow">
                {t.nextBadgeLabel} · {nextBadge.pct}%
              </div>
              <div className="mnyt-badges-next-label">{nextBadge.badge.label}</div>
              <div className="mnyt-badges-bar-track mnyt-badges-bar-track-sm">
                <div className="mnyt-badges-bar-fill" style={{ width: `${nextBadge.pct}%`, background: tierOrCategoryColor(nextBadge.badge) }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mnyt-badges-week-card">
        <div className="mnyt-badges-week-label">{t.progress7Label}</div>
        <div className="mnyt-badges-week-chart">
          {progress7Day.map((d) => {
            const heightPct = Math.max(3, Math.round((d.count / maxCount) * 100));
            const weekday = t.weekdays[new Date(`${d.date}T00:00:00.000Z`).getUTCDay()];
            return (
              <div key={d.date} className="mnyt-badges-week-col">
                <div className="mnyt-badges-week-count">{d.count}</div>
                <div className="mnyt-badges-week-bar" style={{ height: `${heightPct}%` }} />
                <div className="mnyt-badges-week-daylabel">{weekday}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mnyt-badges-filter-row">
        {t.filters.map((f) => (
          <button key={f.key} type="button" className="mnyt-badges-filter-btn" data-active={filter === f.key} onClick={() => setFilter(f.key as typeof filter)}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mnyt-badges-empty">{t.empty}</p>
      ) : (
        <div className="mnyt-badges-grid">
          {filtered.map((c) => {
            const tone = tierOrCategoryColor(c);
            const pct = c.target > 0 ? Math.min(100, Math.round((c.current / c.target) * 100)) : 0;
            return (
              <div key={c.id} className="mnyt-badges-card" data-earned={c.earned}>
                <div className="mnyt-badges-card-icon" style={{ background: `${tone}${c.earned ? "22" : "14"}`, boxShadow: c.earned ? `0 0 10px ${tone}55` : "none" }}>
                  <BadgeGlyph type={c.type} tone={c.earned ? tone : "#5c5a70"} />
                </div>
                <div className="mnyt-badges-card-body">
                  <div className="mnyt-badges-card-label" style={{ color: c.earned ? tone : undefined }}>
                    {c.label}
                  </div>
                  <div className="mnyt-badges-card-desc">{c.desc}</div>
                  <div className="mnyt-badges-card-progress-row">
                    <div className="mnyt-badges-bar-track mnyt-badges-bar-track-sm">
                      <div className="mnyt-badges-bar-fill" style={{ width: `${pct}%`, background: tone }} />
                    </div>
                    <div className="mnyt-badges-card-progress-text">
                      {Math.min(c.current, c.target)}/{c.target}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function tierOrCategoryColor(c: BadgeCardData): string {
  if (c.type === "category") return c.categoryColor ?? "#a78bfa";
  return c.tier ? TIER_COLORS[c.tier] : "#a78bfa";
}
