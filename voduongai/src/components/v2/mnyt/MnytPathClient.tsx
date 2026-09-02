"use client";

/**
 * View "Lộ trình leo cấp" (4/10) — `/v2/moi-ngay-mot-y-tuong/lo-trinh`, 1:1
 * với mockup dòng 485-561: "bản đồ tiến độ" (lưới 35 lĩnh vực × N cấp độ,
 * ô sáng theo số ý tưởng đã học), dãy chip lĩnh vực cuộn ngang, thanh tiến
 * độ lĩnh vực đang chọn, và tuyến đường leo cấp (SVG đường lượn sóng + nút
 * tròn mở khoá tuần tự — node dưới cùng là "xuất phát", node trên cùng là
 * "đỉnh").
 *
 * MỞ KHOÁ (giữ ĐÚNG 2 khái niệm khác nhau của mockup gốc, không gộp làm
 * một):
 * - `unlocked` (được BẤM VÀO) — nới hơn: `done || i <= pathDoneCount`
 *   (tổng SỐ đã hoàn thành trong lĩnh vực, không cần liên tục) — cho phép
 *   xem trước 1 chặng ngay cả khi có hoàn thành lệch thứ tự (vd qua tìm
 *   kiếm ở Kho ý tưởng).
 * - `current` (nút TO, PHÁT SÁNG, animation) — nghiêm hơn: đúng vị trí
 *   ĐẦU TIÊN chưa hoàn thành TÍNH LIÊN TỤC từ node 0 (`pathPrefix`) — chỉ
 *   1 node "đang ở đây" tại 1 thời điểm.
 *
 * Nút "Nhận chứng nhận" mở modal Certificate (6/6 modal Giai đoạn 6) — gắn
 * đúng trạng thái hoàn thành THẬT của lĩnh vực đang chọn
 * (`pathDoneCount`/`pathTopics.length`), xem `MnytCertificateModal.tsx`.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import type { MnytCategory, MnytGlobeNode, MnytTopicSummary } from "@/lib/portal/live-mnyt";
import { mnytDetailHref } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";
import { MnytCertificateModal } from "./MnytCertificateModal";

type Props = {
  lang: "vi" | "en";
  categories: MnytCategory[];
  globeNodes: MnytGlobeNode[];
  difficulties: string[];
  topicsCount: number;
  completedIds: string[];
  defaultCategoryKey: string;
  initialPathTopics: MnytTopicSummary[];
  learnerName: string | null;
};

function useViewportWidth(): number {
  // Mặc định desktop (khớp SSR, không có `window`) — cập nhật đúng sau khi
  // mount, cùng kỹ thuật `useIsMobile()` của `MnytBottomNav.tsx`.
  const [width, setWidth] = useState(1024);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

async function fetchPathTopics(categoryKey: string, signal: AbortSignal): Promise<MnytTopicSummary[] | null> {
  try {
    const res = await fetch(`/api/mnyt/path?category=${encodeURIComponent(categoryKey)}`, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { items: MnytTopicSummary[] };
    return json.items;
  } catch {
    return null;
  }
}

export function MnytPathClient({
  lang,
  categories,
  globeNodes,
  difficulties,
  topicsCount,
  completedIds,
  defaultCategoryKey,
  initialPathTopics,
  learnerName,
}: Props) {
  const isVi = lang === "vi";

  const [activeCategory, setActiveCategory] = useState(defaultCategoryKey);
  const [pathTopics, setPathTopics] = useState(initialPathTopics);
  const [lockedMsg, setLockedMsg] = useState<string | null>(null);
  const [showCert, setShowCert] = useState(false);

  const isFirstRun = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const lockedMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const width = useViewportWidth();
  const isNarrow = width < 560;

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    fetchPathTopics(activeCategory, controller.signal).then((items) => {
      if (items) setPathTopics(items);
    });
  }, [activeCategory]);

  useEffect(() => () => {
    if (lockedMsgTimer.current) clearTimeout(lockedMsgTimer.current);
  }, []);

  const showLockedMsg = useCallback(() => {
    setLockedMsg(isVi ? "Hoàn thành chặng trước để mở chặng này." : "Finish the previous stage to unlock this one.");
    if (lockedMsgTimer.current) clearTimeout(lockedMsgTimer.current);
    lockedMsgTimer.current = setTimeout(() => setLockedMsg(null), 2400);
  }, [isVi]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const activeCat = useMemo(() => categories.find((c) => c.key === activeCategory) ?? categories[0], [categories, activeCategory]);

  // Nhóm globeNodes theo lĩnh vực → độ khó, dùng chung cho "bản đồ tiến độ"
  // + số đếm trên chip lĩnh vực — không cần thêm truy vấn DB nào khác.
  const nodesByCategory = useMemo(() => {
    const map = new Map<string, MnytGlobeNode[]>();
    for (const n of globeNodes) {
      const list = map.get(n.categoryKey) ?? [];
      list.push(n);
      map.set(n.categoryKey, list);
    }
    return map;
  }, [globeNodes]);

  const categoryCompletedTotals = useMemo(() => {
    const out: Record<string, number> = {};
    for (const n of globeNodes) {
      if (completedSet.has(n.id)) out[n.categoryKey] = (out[n.categoryKey] ?? 0) + 1;
    }
    return out;
  }, [globeNodes, completedSet]);

  const pathDoneCount = pathTopics.filter((t) => completedSet.has(t.id)).length;
  const pathStepH = isNarrow ? 82 : 96;
  const pathAmp = isNarrow ? 16 : 26;

  const pathPts = useMemo(
    () =>
      pathTopics.map((_, i) => {
        const fromBottom = pathTopics.length - 1 - i;
        return { x: 50 + Math.sin(i * 0.85) * pathAmp, y: fromBottom * pathStepH + pathStepH / 2 };
      }),
    [pathTopics, pathAmp, pathStepH],
  );
  const pathHeight = pathTopics.length * pathStepH;
  const pathLine = pathPts.length ? pathPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y}`).join(" ") : "";

  let pathPrefix = 0;
  while (pathPrefix < pathTopics.length && completedSet.has(pathTopics[pathPrefix].id)) pathPrefix++;
  const pathDoneLine =
    pathPrefix > 0
      ? pathPts
          .slice(0, Math.min(pathPts.length, pathPrefix))
          .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y}`)
          .join(" ")
      : "";

  const t = {
    title: isVi ? "Lộ trình leo cấp" : "Learning route",
    subtitle: isVi
      ? "Mỗi lĩnh vực là một tuyến đường — hoàn thành chặng này để mở chặng tiếp theo."
      : "One route per field — each stage unlocks the next.",
    mapLabel: isVi ? "BẢN ĐỒ TIẾN ĐỘ" : "PROGRESS MAP",
    mapMeta: isVi
      ? `· ${categories.length} lĩnh vực × ${difficulties.length} cấp độ · đã học ${completedIds.length}/${topicsCount}`
      : `· ${categories.length} fields × ${difficulties.length} levels · ${completedIds.length}/${topicsCount} done`,
    summit: isVi ? "Đỉnh — hoàn thành lĩnh vực" : "Summit — field complete",
    base: isVi ? "Xuất phát từ đây" : "Start here",
    cert: isVi ? "Nhận chứng nhận" : "Get certificate",
    minutes: isVi ? "phút" : "min",
    stages: isVi ? "chặng" : "stages",
  };

  if (!activeCat) {
    return <section className="mnyt-path" />;
  }

  const progressPct = pathTopics.length ? Math.round((pathDoneCount / pathTopics.length) * 100) : 0;

  return (
    <section className="mnyt-path" data-screen-label="Path">
      <h1 className="mnyt-path-title">{t.title}</h1>
      <p className="mnyt-path-subtitle">{t.subtitle}</p>

      <div className="mnyt-path-map-head">
        <div className="mnyt-path-map-label">{t.mapLabel}</div>
        <div className="mnyt-path-map-meta">{t.mapMeta}</div>
      </div>

      <div className="mnyt-path-map-grid">
        {categories.map((cat) => {
          const nodes = nodesByCategory.get(cat.key) ?? [];
          const on = cat.key === activeCategory;
          const doneAll = categoryCompletedTotals[cat.key] ?? 0;
          return (
            <button
              key={cat.key}
              type="button"
              className="mnyt-path-map-row"
              data-active={on}
              onClick={() => setActiveCategory(cat.key)}
            >
              <div className="mnyt-path-map-cells">
                {difficulties.map((lv) => {
                  const inLv = nodes.filter((n) => n.difficulty === lv);
                  const doneLv = inLv.filter((n) => completedSet.has(n.id)).length;
                  const pct = inLv.length ? doneLv / inLv.length : 0;
                  return (
                    <div
                      key={lv}
                      className="mnyt-path-map-cell"
                      data-on={on}
                      title={`${isVi ? cat.name : cat.nameEn || cat.name} · ${lv}: ${doneLv}/${inLv.length}`}
                      style={{
                        background: pct > 0 ? cat.color : "rgba(255,255,255,0.05)",
                        opacity: pct > 0 ? 0.3 + pct * 0.7 : 1,
                        borderColor: on ? `${cat.color}66` : "transparent",
                      }}
                    />
                  );
                })}
              </div>
              <div className="mnyt-path-map-row-label" data-done={doneAll > 0}>
                {isVi ? cat.shortName || cat.name : cat.nameEn || cat.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mnyt-path-map-legend">
        {difficulties.map((lv, i) => (
          <span key={lv} className="mnyt-path-map-legend-item">
            <span
              className="mnyt-path-map-legend-dot"
              style={{ background: `rgba(167,139,250,${(0.3 + i * (0.7 / Math.max(1, difficulties.length - 1))).toFixed(2)})` }}
            />
            {lv}
          </span>
        ))}
      </div>

      <div className="mnyt-path-cat-chips">
        {categories.map((cat) => {
          const nodes = nodesByCategory.get(cat.key) ?? [];
          const doneN = nodes.filter((n) => completedSet.has(n.id)).length;
          const on = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              type="button"
              className="mnyt-path-cat-chip"
              data-active={on}
              onClick={() => setActiveCategory(cat.key)}
              style={on ? { background: `${cat.color}22`, borderColor: cat.color, color: "#f5f3ff" } : undefined}
            >
              {isVi ? cat.name : cat.nameEn || cat.name} {doneN}/{nodes.length}
            </button>
          );
        })}
      </div>

      <div className="mnyt-path-progress-bar-row">
        <div className="mnyt-path-progress-dot" style={{ background: activeCat.color, boxShadow: `0 0 12px ${activeCat.color}` }} />
        <div className="mnyt-path-progress-name">{isVi ? activeCat.name : activeCat.nameEn || activeCat.name}</div>
        <div className="mnyt-path-progress-track">
          <div
            className="mnyt-path-progress-fill"
            style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${activeCat.color}99, ${activeCat.color})` }}
          />
        </div>
        <div className="mnyt-path-progress-label">
          {pathDoneCount}/{pathTopics.length} {t.stages}
        </div>
      </div>

      <div className="mnyt-path-summit" style={{ color: activeCat.color }}>
        <span className="mnyt-path-summit-line" style={{ background: activeCat.color }} />
        {t.summit}
        <span className="mnyt-path-summit-line" style={{ background: activeCat.color }} />
      </div>

      <div className="mnyt-path-canvas" style={{ height: pathHeight }}>
        <svg viewBox={`0 0 100 ${pathHeight}`} preserveAspectRatio="none" className="mnyt-path-canvas-svg">
          <path d={pathLine} fill="none" stroke="rgba(231,229,240,0.14)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 7" vectorEffect="non-scaling-stroke" />
          <path d={pathDoneLine} fill="none" stroke={activeCat.color} strokeWidth={2.5} strokeLinecap="round" opacity={0.75} vectorEffect="non-scaling-stroke" />
        </svg>

        {pathTopics.map((topic, i) => {
          const done = completedSet.has(topic.id);
          const unlocked = done || i <= pathDoneCount;
          const current = !done && i === pathPrefix;
          const p = pathPts[i];
          const onRight = p.x >= 50;
          const title = isVi ? topic.title : topic.titleEn || topic.title;
          const meta = `${topic.difficulty} · ${topic.estMinutes} ${t.minutes}`;
          return (
            <div
              key={`label-${topic.id}`}
              className="mnyt-path-node-label"
              style={{
                top: p.y - 22,
                ...(onRight ? { right: `calc(${100 - p.x}% + 34px)`, textAlign: "right", alignItems: "flex-end" } : { left: `calc(${p.x}% + 34px)`, textAlign: "left", alignItems: "flex-start" }),
              }}
            >
              <div className="mnyt-path-node-label-title" data-state={done ? "done" : current ? "current" : "locked"}>
                {title}
              </div>
              <div className="mnyt-path-node-label-meta" data-unlocked={unlocked}>
                {meta}
              </div>
            </div>
          );
        })}

        {pathTopics.map((topic, i) => {
          const done = completedSet.has(topic.id);
          const unlocked = done || i <= pathDoneCount;
          const current = !done && i === pathPrefix;
          const p = pathPts[i];
          const size = current ? 52 : 42;
          const ring = done ? activeCat.color : current ? "#fbbf24" : "rgba(231,229,240,0.18)";
          const fill = done ? `${activeCat.color}2e` : current ? "rgba(251,191,36,0.16)" : "rgba(255,255,255,0.03)";
          const title = isVi ? topic.title : topic.titleEn || topic.title;

          const nodeStyle: React.CSSProperties = {
            top: p.y - size / 2,
            left: `${p.x}%`,
            width: size,
            height: size,
            border: `2px solid ${ring}`,
            background: fill,
            color: done ? "#fff" : current ? "#fde68a" : "#6f6d84",
            fontSize: current ? 15 : 13,
            ...(current
              ? { boxShadow: "0 0 0 6px rgba(251,191,36,0.12), 0 0 26px rgba(251,191,36,0.35)", animation: "pulseCore 3s ease-in-out infinite" }
              : done
                ? { boxShadow: `0 0 18px ${activeCat.color}55` }
                : {}),
          };

          const inner = done ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : !unlocked ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6f6d84" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3" />
            </svg>
          ) : (
            <span>{i + 1}</span>
          );

          if (unlocked) {
            return (
              <Link key={topic.id} href={mnytDetailHref(topic.id)} className="mnyt-path-node" style={nodeStyle} title={title} aria-label={title}>
                {inner}
              </Link>
            );
          }
          return (
            <button
              key={topic.id}
              type="button"
              className="mnyt-path-node"
              style={{ ...nodeStyle, cursor: "not-allowed" }}
              title={title}
              aria-label={title}
              aria-disabled="true"
              onClick={showLockedMsg}
            >
              {inner}
            </button>
          );
        })}
      </div>

      {lockedMsg && <div className="mnyt-path-locked-msg">{lockedMsg}</div>}

      <div className="mnyt-path-base-label">{t.base}</div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
        <button type="button" className="mnyt-path-cert-btn" style={{ borderColor: activeCat.color, color: activeCat.color }} onClick={() => setShowCert(true)}>
          {t.cert}
        </button>
      </div>

      {showCert && (
        <MnytCertificateModal
          lang={lang}
          categoryName={activeCat.name}
          categoryNameEn={activeCat.nameEn || activeCat.name}
          categoryColor={activeCat.color}
          learnerName={learnerName}
          totalTopics={pathTopics.length}
          doneCount={pathDoneCount}
          onClose={() => setShowCert(false)}
        />
      )}
    </section>
  );
}
