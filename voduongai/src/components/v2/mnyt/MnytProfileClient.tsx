"use client";

/**
 * View "Hồ sơ" (8/10) — `/v2/moi-ngay-mot-y-tuong/ho-so`, 1:1 với mockup
 * dòng 323-427: avatar+tên học viên editable (persist qua `updateMnytPrefs()`,
 * Server Action gọi thẳng từ Client Component — file `mnyt-sync.ts` đã
 * `"use server"` ở export), ảnh chân dung CHỈ ephemeral client-side (FileReader
 * → data URL, KHÔNG persist — dự án chưa có hạ tầng upload ảnh ở bất kỳ đâu),
 * 4 thẻ chỉ số (level/streak/huy hiệu/tổng ngày — 2 thẻ sau bấm được, dẫn
 * sang Huy hiệu/Lịch), so sánh tháng này/tháng trước, thanh "ước tính minh
 * hoạ" (streakPercentile — công thức client-side thuần từ `streak`, mockup
 * JS dòng ~3206, tự ghi rõ "illustrative estimate" trong chính mockup nên
 * KHÔNG cần bảng xếp hạng thật), tổng kết tuần (share = copy clipboard),
 * lưới yêu thích (tái dùng NGUYÊN class `.mnyt-archive-card` đã có sẵn từ
 * `MnytArchiveClient.tsx` — cùng box-model/token màu qua `--card-accent`/
 * `--card-tint`).
 *
 * "Xuất sổ tay ý tưởng" dẫn sang `/v2/moi-ngay-mot-y-tuong/so-tay-y-tuong`
 * (Giai đoạn 11 — trang TÀI LIỆU ĐỘC LẬP, đúng mockup thật
 * `So Tay Y Tuong.dc.html`, xem `so-tay-y-tuong/page.tsx`) — mở trong TAB
 * MỚI (`target="_blank"`, đúng README: đây là "xuất tài liệu", không phải
 * điều hướng rời khỏi app).
 */

import { useState } from "react";
import Link from "next/link";
import type { MnytTopicSummary } from "@/lib/portal/live-mnyt";
import { updateMnytPrefs } from "@/lib/portal/mnyt-sync";
import { MNYT_ROUTES, mnytDetailHref } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

type Props = {
  lang: "vi" | "en";
  learnerName: string | null;
  level: number;
  streak: number;
  badgeCount: number;
  badgeTotalCount: number;
  totalCompletedDays: number;
  countThisMonth: number;
  countLastMonth: number;
  weekCount: number;
  weekXp: number;
  weekTopCategoryName: string | null;
  favoriteTopics: MnytTopicSummary[];
  completedIds: string[];
};

const T = {
  vi: {
    title: "Hồ sơ của bạn",
    subtitle: "Tiến trình, streak và ý tưởng đã lưu — tất cả ở đây.",
    exportNotebook: "📖 Xuất sổ tay ý tưởng (PDF)",
    nameLabel: "Tên của bạn",
    namePlaceholder: "ví dụ: Nguyễn Minh Anh",
    uploadPhoto: "Tải ảnh lên",
    removePhoto: "Xoá ảnh",
    identityHint: "Tên hiển thị riêng cho ý tưởng mỗi ngày — không liên quan tên tài khoản Portal của bạn.",
    levelLabel: "Cấp độ",
    streakLabel: "Chuỗi ngày",
    badgesLabel: "Huy hiệu",
    totalDaysLabel: "Tổng ngày hoàn thành",
    monthCompare: "So sánh tháng",
    monthThis: "Tháng này",
    monthLast: "Tháng trước",
    leaderboard: "Vị trí của bạn (ước tính minh hoạ)",
    leaderboardNote: "Đây là ước tính minh hoạ dựa trên chuỗi ngày của bạn, không phải bảng xếp hạng thật giữa người dùng.",
    recapTitle: "Tổng kết tuần này",
    recapShare: "Sao chép để chia sẻ",
    recapIdeas: "Ý tưởng đã học",
    recapXp: "Điểm kinh nghiệm",
    recapTop: "Lĩnh vực nổi bật",
    favoritesTitle: "Ý tưởng yêu thích",
    noFavorites: "Bạn chưa lưu ý tưởng nào. Bấm nút lưu ở trang chi tiết ý tưởng để lưu lại.",
    minutes: "phút",
    dash: "—",
    copied: "Đã sao chép!",
  },
  en: {
    title: "Your Profile",
    subtitle: "Progress, streak and saved ideas in one place.",
    exportNotebook: "📖 Export my idea notebook (PDF)",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Nguyễn Minh Anh",
    uploadPhoto: "Upload photo",
    removePhoto: "Remove photo",
    identityHint: "A display name just for this feature — separate from your Portal account name.",
    levelLabel: "Level",
    streakLabel: "Streak",
    badgesLabel: "Badges",
    totalDaysLabel: "Total days completed",
    monthCompare: "Month comparison",
    monthThis: "This month",
    monthLast: "Last month",
    leaderboard: "Your standing (illustrative estimate)",
    leaderboardNote: "This is an illustrative estimate based on your own streak, not a real leaderboard between users.",
    recapTitle: "Weekly recap",
    recapShare: "Copy to share",
    recapIdeas: "Ideas learned",
    recapXp: "XP earned",
    recapTop: "Top field",
    favoritesTitle: "Favorite ideas",
    noFavorites: "You haven't saved any idea yet. Tap the save button on an idea's detail page to save it.",
    minutes: "min",
    dash: "—",
    copied: "Copied!",
  },
} as const;

function initialsFrom(name: string): string {
  const n = name.trim();
  if (!n) return "?";
  const parts = n.split(/\s+/);
  return (parts.length > 1 ? parts[parts.length - 2][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toUpperCase();
}

export function MnytProfileClient({
  lang,
  learnerName: initialLearnerName,
  level,
  streak,
  badgeCount,
  badgeTotalCount,
  totalCompletedDays,
  countThisMonth,
  countLastMonth,
  weekCount,
  weekXp,
  weekTopCategoryName,
  favoriteTopics,
  completedIds,
}: Props) {
  const isVi = lang === "vi";
  const t = T[isVi ? "vi" : "en"];

  const [learnerName, setLearnerName] = useState(initialLearnerName ?? "");
  const [photo, setPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const saveName = (value: string) => {
    void updateMnytPrefs({ learnerName: value.trim() || null });
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const avatarStyle: React.CSSProperties | undefined = photo
    ? {
        backgroundImage: `url(${photo})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
        backgroundColor: "#15131f",
        border: "2px solid rgba(167,139,250,0.67)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
      }
    : undefined;

  const completedSet = new Set(completedIds);
  const monthMax = Math.max(1, countThisMonth, countLastMonth);
  const monthDelta = countThisMonth - countLastMonth;
  const monthTrendLabel =
    countThisMonth === 0 && countLastMonth === 0
      ? isVi
        ? "Chưa có hoạt động nào."
        : "No activity yet."
      : monthDelta > 0
        ? isVi
          ? `Tăng ${monthDelta} ý tưởng so với tháng trước.`
          : `Up ${monthDelta} ideas from last month.`
        : monthDelta < 0
          ? isVi
            ? `Giảm ${Math.abs(monthDelta)} ý tưởng so với tháng trước.`
            : `Down ${Math.abs(monthDelta)} ideas from last month.`
          : isVi
            ? "Bằng tháng trước."
            : "Same as last month.";

  const streakPercentile = Math.max(3, Math.min(98, Math.round(100 * (1 - Math.exp(-streak / 6)))));
  const leaderboardText = isVi ? `Bạn đang ở top ${100 - streakPercentile}% người học chăm chỉ nhất.` : `You're in the top ${100 - streakPercentile}% of most consistent learners.`;

  const recapText = isVi
    ? `Tuần này mình đã học ${weekCount} ý tưởng, +${weekXp} XP${weekTopCategoryName ? `, tập trung nhiều nhất vào ${weekTopCategoryName}` : ""}. #MoiNgayMotYTuong`
    : `This week I learned ${weekCount} ideas, +${weekXp} XP${weekTopCategoryName ? `, mostly in ${weekTopCategoryName}` : ""}. #DailyIdea`;

  const shareRecap = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(recapText).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="mnyt-profile" data-screen-label="Profile">
      <h1 className="mnyt-profile-title">{t.title}</h1>
      <p className="mnyt-profile-subtitle">{t.subtitle}</p>

      <Link href={MNYT_ROUTES.notebook} className="mnyt-profile-export-btn" target="_blank" rel="noopener noreferrer">
        {t.exportNotebook}
      </Link>

      <div className="mnyt-profile-identity-card">
        <div className="mnyt-profile-avatar" style={avatarStyle}>
          {!photo && initialsFrom(learnerName)}
        </div>
        <div className="mnyt-profile-identity-fields">
          <label htmlFor="mnyt-learner-name" className="mnyt-profile-field-label">
            {t.nameLabel}
          </label>
          <input
            id="mnyt-learner-name"
            className="mnyt-profile-name-input"
            value={learnerName}
            placeholder={t.namePlaceholder}
            onChange={(e) => setLearnerName(e.target.value)}
            onBlur={(e) => saveName(e.target.value)}
          />
          <div className="mnyt-profile-photo-row">
            <input id="mnyt-learner-photo" type="file" accept="image/*" onChange={onPhotoChange} style={{ display: "none" }} />
            <label htmlFor="mnyt-learner-photo" className="mnyt-profile-photo-btn">
              {t.uploadPhoto}
            </label>
            {photo && (
              <button type="button" className="mnyt-profile-photo-remove-btn" onClick={() => setPhoto(null)}>
                {t.removePhoto}
              </button>
            )}
          </div>
          <div className="mnyt-profile-identity-hint">{t.identityHint}</div>
        </div>
      </div>

      <div className="mnyt-profile-stats-row">
        <div className="mnyt-profile-stat-card mnyt-profile-stat-card-violet">
          <div className="mnyt-profile-stat-label">{t.levelLabel}</div>
          <div className="mnyt-profile-stat-value">{level}</div>
        </div>
        <div className="mnyt-profile-stat-card mnyt-profile-stat-card-amber">
          <div className="mnyt-profile-stat-label">{t.streakLabel}</div>
          <div className="mnyt-profile-stat-value">{streak}</div>
        </div>
        <Link href={MNYT_ROUTES.badges} className="mnyt-profile-stat-card mnyt-profile-stat-card-cyan mnyt-profile-stat-card-link">
          <div className="mnyt-profile-stat-label">{t.badgesLabel}</div>
          <div className="mnyt-profile-stat-value">
            {badgeCount}/{badgeTotalCount}
          </div>
        </Link>
        <Link href={MNYT_ROUTES.calendar} className="mnyt-profile-stat-card mnyt-profile-stat-card-green mnyt-profile-stat-card-link">
          <div className="mnyt-profile-stat-label">{t.totalDaysLabel}</div>
          <div className="mnyt-profile-stat-value">{totalCompletedDays}</div>
        </Link>
      </div>

      <div className="mnyt-profile-panel">
        <div className="mnyt-profile-panel-title">{t.monthCompare}</div>
        <div className="mnyt-profile-month-rows">
          <div>
            <div className="mnyt-profile-month-row-head">
              <span>{t.monthThis}</span>
              <span>{countThisMonth}</span>
            </div>
            <div className="mnyt-profile-bar-track">
              <div className="mnyt-profile-bar-fill mnyt-profile-bar-fill-violet" style={{ width: `${(countThisMonth / monthMax) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="mnyt-profile-month-row-head">
              <span>{t.monthLast}</span>
              <span>{countLastMonth}</span>
            </div>
            <div className="mnyt-profile-bar-track">
              <div className="mnyt-profile-bar-fill mnyt-profile-bar-fill-dim" style={{ width: `${(countLastMonth / monthMax) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="mnyt-profile-month-trend">{monthTrendLabel}</div>
      </div>

      <div className="mnyt-profile-panel">
        <div className="mnyt-profile-panel-title">{t.leaderboard}</div>
        <div className="mnyt-profile-leaderboard-text">{leaderboardText}</div>
        <div className="mnyt-profile-bar-track">
          <div className="mnyt-profile-bar-fill mnyt-profile-bar-fill-gradient" style={{ width: `${streakPercentile}%` }} />
        </div>
        <div className="mnyt-profile-leaderboard-note">{t.leaderboardNote}</div>
      </div>

      <div className="mnyt-profile-recap-card">
        <div className="mnyt-profile-recap-head">
          <div className="mnyt-profile-recap-title">{t.recapTitle}</div>
          <button type="button" className="mnyt-profile-recap-share-btn" onClick={shareRecap}>
            {copied ? t.copied : t.recapShare}
          </button>
        </div>
        <div className="mnyt-profile-recap-stats">
          <div>
            <div className="mnyt-profile-recap-value">{weekCount}</div>
            <div className="mnyt-profile-recap-label">{t.recapIdeas}</div>
          </div>
          <div>
            <div className="mnyt-profile-recap-value">+{weekXp}</div>
            <div className="mnyt-profile-recap-label">{t.recapXp}</div>
          </div>
          <div>
            <div className="mnyt-profile-recap-value mnyt-profile-recap-value-sm">{weekTopCategoryName ?? t.dash}</div>
            <div className="mnyt-profile-recap-label">{t.recapTop}</div>
          </div>
        </div>
      </div>

      <div className="mnyt-profile-panel-title">
        {t.favoritesTitle} ({favoriteTopics.length})
      </div>
      {favoriteTopics.length > 0 ? (
        <div className="mnyt-archive-grid">
          {favoriteTopics.map((topic) => {
            const badge = completedSet.has(topic.id) ? "✓" : "★";
            const categoryLabel = isVi ? topic.categoryName : topic.categoryNameEn || topic.categoryName;
            const title = isVi ? topic.title : topic.titleEn || topic.title;
            const hook = isVi ? topic.hook : topic.hookEn || topic.hook;
            return (
              <Link
                key={topic.id}
                href={mnytDetailHref(topic.id)}
                className="mnyt-archive-card"
                style={{ ["--card-accent" as string]: topic.color, ["--card-tint" as string]: `${topic.color}1a` }}
              >
                <div className="mnyt-archive-card-head">
                  <span className="mnyt-archive-card-category" style={{ color: topic.color }}>
                    {categoryLabel}
                  </span>
                  <span className="mnyt-archive-card-badge">{badge}</span>
                </div>
                <div className="mnyt-archive-card-title">{title}</div>
                <div className="mnyt-archive-card-hook">{hook}</div>
                <span className="mnyt-archive-card-tag">{topic.difficulty}</span>
                <span className="mnyt-archive-card-tag">
                  ~{topic.estMinutes} {t.minutes}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mnyt-profile-empty">{t.noFavorites}</div>
      )}
    </section>
  );
}
