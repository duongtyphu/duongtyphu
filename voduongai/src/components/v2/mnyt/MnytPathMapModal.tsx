"use client";

/**
 * Modal "🗺 Bản đồ lộ trình" (4/6 modal Giai đoạn 6) — mở từ nút cùng tên ở
 * View Chi tiết (`MnytDetailClient.tsx`), thay vì điều hướng thẳng sang
 * View Lộ trình đầy đủ (`/lo-trinh`) như trước — cho phép xem nhanh vị trí
 * hiện tại trong lĩnh vực đang học mà KHÔNG rời trang chi tiết đang đọc dở.
 *
 * Dữ liệu THẬT — gọi lại đúng `/api/mnyt/path?category=<key>`
 * (`getLiveMnytPathTopics()`, cùng nguồn `MnytPathClient.tsx` dùng khi đổi
 * lĩnh vực) khi modal mở, không tự trùng lặp logic sắp `path_step`. Trạng
 * thái mở khoá theo ĐÚNG quy tắc `MnytPathClient.tsx` đã dùng: `unlocked =
 * done || i <= doneCount` (tổng số đã hoàn thành, không cần liên tục).
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { MnytTopicSummary } from "@/lib/portal/live-mnyt";
import { MNYT_ROUTES, mnytDetailHref } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";
import { useMnytModalEscape } from "@/lib/mnyt/use-modal-escape";

type Props = {
  lang: "vi" | "en";
  categoryKey: string;
  categoryName: string;
  categoryColor: string;
  currentTopicId: string;
  completedIds: string[];
  onClose: () => void;
};

async function fetchPathTopics(categoryKey: string): Promise<MnytTopicSummary[] | null> {
  try {
    const res = await fetch(`/api/mnyt/path?category=${encodeURIComponent(categoryKey)}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { items: MnytTopicSummary[] };
    return json.items;
  } catch {
    return null;
  }
}

export function MnytPathMapModal({ lang, categoryKey, categoryName, categoryColor, currentTopicId, completedIds, onClose }: Props) {
  const isVi = lang === "vi";
  const [topics, setTopics] = useState<MnytTopicSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useMnytModalEscape(onClose);

  useEffect(() => {
    let cancelled = false;
    fetchPathTopics(categoryKey).then((items) => {
      if (cancelled) return;
      if (items) setTopics(items);
      else setFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [categoryKey]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const doneCount = topics ? topics.filter((t) => completedSet.has(t.id)).length : 0;

  const t = {
    title: isVi ? "Bản đồ lộ trình" : "Path map",
    progress: topics ? `${doneCount}/${topics.length} ${isVi ? "chặng" : "stages"}` : "",
    minutes: isVi ? "phút" : "min",
    fullPath: isVi ? "Xem đầy đủ lộ trình →" : "View full path →",
    loading: isVi ? "Đang tải lộ trình…" : "Loading path…",
    error: isVi ? "Không tải được lộ trình — thử lại sau." : "Couldn't load the path — try again later.",
    close: isVi ? "Đóng" : "Close",
    locked: isVi ? "Hoàn thành các chặng trước để mở khoá" : "Finish earlier stages to unlock",
    current: isVi ? "Bạn đang ở đây" : "You're here",
  };

  return (
    <div className="mnyt-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mnyt-pathmap-card" style={{ ["--pathmap-accent" as string]: categoryColor }} onClick={(e) => e.stopPropagation()}>
        <div className="mnyt-pathmap-head">
          <div>
            <div className="mnyt-pathmap-title">{t.title}</div>
            <div className="mnyt-pathmap-cat" style={{ color: categoryColor }}>
              {categoryName}
            </div>
          </div>
          <button type="button" className="mnyt-pathmap-close-btn" onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </div>

        {topics && <div className="mnyt-pathmap-progress">{t.progress}</div>}

        <div className="mnyt-pathmap-list">
          {!topics && !failed && <p className="mnyt-pathmap-status">{t.loading}</p>}
          {failed && <p className="mnyt-pathmap-status">{t.error}</p>}
          {topics?.map((topic, i) => {
            const done = completedSet.has(topic.id);
            const isCurrent = topic.id === currentTopicId;
            const unlocked = done || i <= doneCount;
            const title = isVi ? topic.title : topic.titleEn || topic.title;
            const meta = `${topic.difficulty} · ${topic.estMinutes} ${t.minutes}`;
            const row = (
              <div className="mnyt-pathmap-row-inner">
                <span className="mnyt-pathmap-row-icon" data-state={done ? "done" : isCurrent ? "current" : unlocked ? "open" : "locked"}>
                  {done ? "✓" : unlocked ? i + 1 : "🔒"}
                </span>
                <span className="mnyt-pathmap-row-body">
                  <span className="mnyt-pathmap-row-title">{title}</span>
                  <span className="mnyt-pathmap-row-meta">{isCurrent ? t.current : meta}</span>
                </span>
              </div>
            );
            if (unlocked && !isCurrent) {
              return (
                <Link key={topic.id} href={mnytDetailHref(topic.id)} className="mnyt-pathmap-row" data-current={isCurrent} onClick={onClose}>
                  {row}
                </Link>
              );
            }
            return (
              <div key={topic.id} className="mnyt-pathmap-row" data-current={isCurrent} data-locked={!unlocked} title={!unlocked ? t.locked : undefined}>
                {row}
              </div>
            );
          })}
        </div>

        <Link href={MNYT_ROUTES.path} className="mnyt-pathmap-full-link" onClick={onClose}>
          {t.fullPath}
        </Link>
      </div>
    </div>
  );
}
