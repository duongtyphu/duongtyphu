"use client";

/**
 * View "Trang chủ" (1/10) — `/v2/moi-ngay-mot-y-tuong`, 1:1 với mockup dòng
 * 103-267, THEO ĐÚNG thứ tự Founder đã duyệt riêng cho khối hero (khác thứ
 * tự gốc mockup — dashboard cards/link Lộ trình đổi từ ĐẦU khối sang SAU
 * cụm hero+CTA):
 *
 *   Banner ảnh (trần, giữa, 300px) → nhãn "Ý tưởng hôm nay" → tiêu đề →
 *   mô tả (hook) → CTA chính full-width → hàng 4 CTA phụ bằng nhau →
 *   (ghi chú lĩnh vực quan tâm, nếu có) → dashboard cards (chuỗi/đã học/
 *   huy hiệu) → chip lọc + quả cầu 3D 446 nốt → dải "Đang thịnh hành" →
 *   gợi ý Từ điển → nhãn "KHÔNG GIAN Ý TƯỞNG" (số liệu THẬT, không hardcode)
 *   → lưới 35 thẻ chủ đề.
 *
 * Quả cầu 3D — README (mục "1. Trang chủ") tự nêu rõ có thể "reconsider
 * node count for performance" — giữ ĐỦ toàn bộ node thật (không mẫu/sample
 * giả), chỉ giảm số hạt bụi trang trí (`particles`, mockup 80 → 48, thuần
 * thẩm mỹ, không phải nội dung). Vị trí node/hạt tính bằng hàm NGẪU NHIÊN
 * CÓ SEED (`seeded()`, không phải `Math.random()`) — đảm bảo HTML server-
 * render và lần hydrate đầu ở client giống hệt nhau (không lệch hydration).
 *
 * A11y quả cầu: các nốt là `tabIndex={-1}` (không vào luồng Tab) — đây là
 * bản đồ KHÔNG GIAN mang tính bổ trợ/thị giác, nội dung TƯƠNG ĐƯƠNG luôn
 * có sẵn qua đường điều hướng bàn phím đầy đủ khác trong cùng trang (chip
 * lọc, dải "Đang thịnh hành", lưới thẻ chủ đề) và trang "Kho ý tưởng".
 */

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { MnytCategory, MnytGlobeNode, MnytGlossaryTerm, MnytTopicSummary } from "@/lib/portal/live-mnyt";
import { getMnytGlossaryCategoryMeta } from "@/lib/mnyt/glossary-categories";
import { MNYT_ROUTES, mnytDetailHref } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";
import { MnytOnboardingModal } from "./MnytOnboardingModal";

type Props = {
  lang: "vi" | "en";
  todayTopic: MnytTopicSummary | null;
  categories: MnytCategory[];
  categoryTotals: Record<string, number>;
  topicsCount: number;
  globeNodes: MnytGlobeNode[];
  glossaryTeaser: MnytGlossaryTerm[];
  streak: number;
  completedIds: string[];
  badgeCount: number;
  interestNames: string[];
  interests: string[];
};

const PARTICLE_COUNT = 48;
const GLOBE_RADIUS = 200;

function seeded(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function fibonacciPoint(i: number, n: number): { x: number; y: number; z: number } {
  if (n <= 1) return { x: 0, y: 0, z: 1 };
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (n - 1)) * 2;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * i;
  return { x: Math.cos(theta) * radiusAtY, y, z: Math.sin(theta) * radiusAtY };
}

export function MnytHomeClient({
  lang,
  todayTopic,
  categories,
  categoryTotals,
  topicsCount,
  globeNodes,
  glossaryTeaser,
  streak,
  completedIds,
  badgeCount,
  interestNames,
  interests,
}: Props) {
  const router = useRouter();
  const isVi = lang === "vi";
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoverNode, setHoverNode] = useState<MnytGlobeNode | null>(null);
  const [dragDeg, setDragDeg] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const dragState = useRef<{ dragging: boolean; startX: number; startDeg: number; moved: boolean } | null>(null);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const nodeCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const n of globeNodes) map.set(n.id, n.categoryKey);
    return map;
  }, [globeNodes]);

  const categoryCompleted = useMemo(() => {
    const out: Record<string, number> = {};
    for (const id of completedIds) {
      const key = nodeCategoryMap.get(id);
      if (key) out[key] = (out[key] ?? 0) + 1;
    }
    return out;
  }, [completedIds, nodeCategoryMap]);

  const nodesByCategory = useMemo(() => {
    const map = new Map<string, MnytGlobeNode[]>();
    for (const n of globeNodes) {
      const list = map.get(n.categoryKey) ?? [];
      list.push(n);
      map.set(n.categoryKey, list);
    }
    return map;
  }, [globeNodes]);

  const filteredNodes = useMemo(() => {
    if (activeFilter === "all") return globeNodes;
    return nodesByCategory.get(activeFilter) ?? [];
  }, [activeFilter, globeNodes, nodesByCategory]);

  const nodePositions = useMemo(() => {
    const n = filteredNodes.length;
    return filteredNodes.map((node, i) => {
      const p = fibonacciPoint(i, n);
      return { node, x: p.x * GLOBE_RADIUS, y: p.y * GLOBE_RADIUS, z: p.z * GLOBE_RADIUS };
    });
  }, [filteredNodes]);

  const particlePositions = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const p = fibonacciPoint(i, PARTICLE_COUNT);
      const jitter = 1.15 + seeded(i * 7.13) * 0.35;
      return { x: p.x * GLOBE_RADIUS * jitter, y: p.y * GLOBE_RADIUS * jitter, z: p.z * GLOBE_RADIUS * jitter, size: 1.5 + seeded(i * 3.71) * 2 };
    });
  }, []);

  const trendingNodes = useMemo(() => globeNodes.filter((n) => n.isTrending).slice(0, 5), [globeNodes]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragState.current = { dragging: true, startX: e.clientX, startDeg: dragDeg, moved: false };
      setIsInteracting(true);
      setIsPointerDown(true);
    },
    [dragDeg],
  );
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const st = dragState.current;
    if (!st?.dragging) return;
    const delta = e.clientX - st.startX;
    if (Math.abs(delta) > 3) st.moved = true;
    setDragDeg(st.startDeg + delta * 0.35);
  }, []);
  const endDrag = useCallback(() => {
    if (dragState.current) dragState.current.dragging = false;
    setIsInteracting(false);
    setIsPointerDown(false);
  }, []);

  const onOpenOnboarding = useCallback(() => setShowOnboarding(true), []);
  const onCloseOnboarding = useCallback(() => setShowOnboarding(false), []);

  const openRandomTopic = useCallback(() => {
    if (globeNodes.length === 0) return;
    const idx = Math.floor(Math.random() * globeNodes.length);
    router.push(mnytDetailHref(globeNodes[idx].id));
  }, [globeNodes, router]);

  const t = {
    exploreLabel: isVi ? "Khám phá & học ngay" : "Explore & learn now",
    randomLabel: isVi ? "Chọn ngẫu nhiên" : "Random pick",
    quickModeLabel: isVi ? "Học nhanh 60 giây" : "60-second mode",
    fieldsNavLabel: isVi ? "Bản đồ lĩnh vực" : "Field map",
    tomorrowTitleLabel: isVi ? "Ý tưởng ngày mai" : "Tomorrow's idea",
    pathViewTitle: isVi ? "Xem lộ trình học tập của bạn" : "View your learning path",
    interestNote: isVi ? `Đang ưu tiên: ${interestNames.join(", ")}` : `Prioritizing: ${interestNames.join(", ")}`,
    changeInterests: isVi ? "Đổi lĩnh vực" : "Change fields",
    pickInterests: isVi ? "Chọn lĩnh vực quan tâm" : "Pick your fields",
    globeCaption: isVi ? "Kéo để xoay quả cầu · Chạm vào 1 nốt để xem trước ý tưởng" : "Drag to rotate · Hover a node to preview an idea",
    globeSectionLabel: isVi ? "KHÔNG GIAN Ý TƯỞNG" : "IDEA SPACE",
    trendingLabel: isVi ? "🔥 Đang thịnh hành" : "🔥 Trending now",
    glossaryTeaserTitle: isVi ? "Từ điển AI" : "AI Glossary",
    glossaryTeaserSub: isVi ? "100 thuật ngữ AI giải thích dễ hiểu" : "100 AI terms explained simply",
    glossaryTeaserCta: isVi ? "Xem tất cả →" : "See all →",
    catDoneLabel: isVi ? "đã học" : "done",
    all: isVi ? "Tất cả" : "All",
  };

  const totalDone = completedIds.length;

  return (
    <section data-screen-label="Home" className="mnyt-view mnyt-home">
      {/* eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh public/, không cần Next Image optimize cho asset 1 kích thước cố định */}
      <img className="mnyt-home-banner" src="/v2-static/assets/moi-ngay-1-y-tuong-banner.png" alt={isVi ? "Mỗi ngày 1 ý tưởng học AI" : "One AI idea a day"} width={300} height={300} />

      <div className="mnyt-home-hero">
        {todayTopic ? (
          <>
            <div className="mnyt-home-eyebrow">
              {isVi ? "Ý tưởng" : "Idea"} #{todayTopic.day} · {todayTopic.categoryName}
            </div>
            <h1 className="mnyt-home-title">{isVi ? todayTopic.title : todayTopic.titleEn || todayTopic.title}</h1>
            <p className="mnyt-home-hook">{isVi ? todayTopic.hook : todayTopic.hookEn || todayTopic.hook}</p>
            <Link href={mnytDetailHref(todayTopic.id)} className="mnyt-home-primary-cta">
              {t.exploreLabel}
            </Link>
          </>
        ) : (
          <>
            <div className="mnyt-home-eyebrow">{isVi ? "Mỗi ngày một ý tưởng" : "Daily AI idea"}</div>
            <h1 className="mnyt-home-title">{isVi ? "Chưa có ý tưởng nào được xuất bản" : "No published ideas yet"}</h1>
            <p className="mnyt-home-hook">
              {isVi ? "Kho ý tưởng đang được chuẩn bị — quay lại sau nhé." : "The idea library is being prepared — please check back soon."}
            </p>
          </>
        )}

        <div className="mnyt-home-secondary-row">
          <button type="button" onClick={openRandomTopic} className="mnyt-home-secondary-btn">
            {t.randomLabel}
          </button>
          {todayTopic ? (
            <Link href={`${mnytDetailHref(todayTopic.id)}?mode=quick`} className="mnyt-home-secondary-btn mnyt-home-secondary-btn--quick">
              {t.quickModeLabel}
            </Link>
          ) : (
            <button type="button" disabled className="mnyt-home-secondary-btn mnyt-home-secondary-btn--quick" style={{ opacity: 0.5, cursor: "not-allowed" }}>
              {t.quickModeLabel}
            </button>
          )}
          <Link href={MNYT_ROUTES.fields} className="mnyt-home-secondary-btn mnyt-home-secondary-btn--fields">
            🗺 {t.fieldsNavLabel}
          </Link>
          <Link href={MNYT_ROUTES.calendar} className="mnyt-home-secondary-btn mnyt-home-secondary-btn--locked">
            🔒 {t.tomorrowTitleLabel}
          </Link>
        </div>
      </div>

      <div className="mnyt-home-interests-note">
        {interestNames.length > 0 && <span>{t.interestNote}</span>}
        <button type="button" onClick={onOpenOnboarding}>
          {interestNames.length > 0 ? t.changeInterests : t.pickInterests}
        </button>
      </div>

      <div className="mnyt-home-dash-grid">
        <Link
          href={MNYT_ROUTES.calendar}
          className="mnyt-home-dash-card"
          style={{ ["--card-soft" as string]: "rgba(167,139,250,0.08)", ["--card-line" as string]: "rgba(167,139,250,0.25)", ["--card-accent" as string]: "#a78bfa" }}
        >
          <div className="mnyt-home-dash-kicker-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
            </svg>
            <div className="mnyt-home-dash-kicker">{isVi ? "CHUỖI HỌC" : "STREAK"}</div>
          </div>
          <div className="mnyt-home-dash-title">{streak > 0 ? `${streak} ${isVi ? "ngày liên tiếp" : "days in a row"}` : isVi ? "Bắt đầu chuỗi học" : "Start your streak"}</div>
          <div className="mnyt-home-dash-meta">{isVi ? "Đừng bỏ lỡ ngày hôm nay" : "Don't miss today"}</div>
          <div className="mnyt-home-dash-cta">{isVi ? "Xem lịch học" : "View calendar"} →</div>
        </Link>

        <Link
          href={MNYT_ROUTES.archive}
          className="mnyt-home-dash-card"
          style={{ ["--card-soft" as string]: "rgba(34,211,238,0.08)", ["--card-line" as string]: "rgba(34,211,238,0.25)", ["--card-accent" as string]: "#67e8f9" }}
        >
          <div className="mnyt-home-dash-kicker-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
            </svg>
            <div className="mnyt-home-dash-kicker">{isVi ? "ĐÃ HỌC" : "COMPLETED"}</div>
          </div>
          <div className="mnyt-home-dash-title">
            {totalDone}/{topicsCount} {isVi ? "ý tưởng" : "ideas"}
          </div>
          <div className="mnyt-home-dash-meta">{topicsCount > 0 ? `${Math.round((totalDone / topicsCount) * 100)}% ${isVi ? "hành trình" : "of the journey"}` : ""}</div>
          <div className="mnyt-home-dash-cta">{isVi ? "Xem kho ý tưởng" : "Browse the library"} →</div>
        </Link>

        <Link
          href={MNYT_ROUTES.badges}
          className="mnyt-home-dash-card"
          style={{ ["--card-soft" as string]: "rgba(251,191,36,0.08)", ["--card-line" as string]: "rgba(251,191,36,0.25)", ["--card-accent" as string]: "#fbbf24" }}
        >
          <div className="mnyt-home-dash-kicker-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z" />
            </svg>
            <div className="mnyt-home-dash-kicker">{isVi ? "HUY HIỆU" : "BADGES"}</div>
          </div>
          <div className="mnyt-home-dash-title">
            {badgeCount}/{6 + categories.length} {isVi ? "đã đạt" : "earned"}
          </div>
          <div className="mnyt-home-dash-meta">{isVi ? "Streak, tổng số bài, chuyên gia lĩnh vực" : "Streak, totals, field mastery"}</div>
          <div className="mnyt-home-dash-cta">{isVi ? "Xem huy hiệu" : "View badges"} →</div>
        </Link>
      </div>

      <div className="mnyt-home-path-link-row">
        <Link href={MNYT_ROUTES.path}>{t.pathViewTitle} →</Link>
      </div>

      <div className="mnyt-home-filter-row">
        <button type="button" onClick={() => setActiveFilter("all")} className="mnyt-home-filter-chip" data-active={activeFilter === "all"}>
          {t.all}
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActiveFilter(c.key)}
            className="mnyt-home-filter-chip"
            data-active={activeFilter === c.key}
            style={{ ["--chip-accent" as string]: c.color }}
          >
            {isVi ? c.shortName || c.name : c.nameEn || c.name}
          </button>
        ))}
      </div>

      <div
        className="mnyt-home-globe-wrap"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => {
          setIsInteracting(false);
          setHoverNode(null);
        }}
      >
        {hoverNode && (
          <div className="mnyt-home-globe-preview">
            <div className="mnyt-home-globe-preview-kicker" style={{ color: hoverNode.color }}>
              {hoverNode.categoryName} · {hoverNode.difficulty}
            </div>
            <div className="mnyt-home-globe-preview-title">{hoverNode.title}</div>
          </div>
        )}
        <div className="mnyt-home-globe-ring-outer" aria-hidden />
        <div className="mnyt-home-globe-ring-mid" aria-hidden />
        <div className="mnyt-home-globe-core" style={{ width: 118, height: 118 }} aria-hidden>
          <div className="mnyt-home-globe-core-glow" />
          <div className="mnyt-home-globe-core-band" />
          <div className="mnyt-home-globe-core-sphere" />
          <div className="mnyt-home-globe-core-halo" />
        </div>
        <div
          className="mnyt-home-globe-drag-layer"
          style={{ transform: `rotateY(${dragDeg}deg)`, cursor: isPointerDown ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          role="group"
          aria-label={isVi ? "Quả cầu 446 ý tưởng — kéo để xoay" : "446-idea sphere — drag to rotate"}
        >
          <div className="mnyt-home-globe-spin-layer" data-paused={isInteracting}>
            {particlePositions.map((p, i) => (
              <div
                key={i}
                className="mnyt-home-globe-particle"
                aria-hidden
                style={{ width: p.size, height: p.size, transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)` }}
              />
            ))}
            {nodePositions.map(({ node, x, y, z }) => (
              <Link
                key={node.id}
                href={mnytDetailHref(node.id)}
                tabIndex={-1}
                title={node.title}
                aria-hidden
                className="mnyt-home-globe-node"
                onMouseEnter={() => setHoverNode(node)}
                onMouseLeave={() => setHoverNode(null)}
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  width: completedSet.has(node.id) ? 8 : 6,
                  height: completedSet.has(node.id) ? 8 : 6,
                  background: node.color,
                  boxShadow: `0 0 6px ${node.color}`,
                  opacity: completedSet.has(node.id) ? 1 : 0.75,
                  transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mnyt-home-globe-caption">{t.globeCaption}</p>

      {trendingNodes.length > 0 && (
        <div className="mnyt-home-trending">
          <div className="mnyt-home-trending-label">{t.trendingLabel}</div>
          <div className="mnyt-home-trending-row">
            {trendingNodes.map((tc) => (
              <Link key={tc.id} href={mnytDetailHref(tc.id)} className="mnyt-home-trending-card">
                <div className="mnyt-home-trending-cat" style={{ color: tc.color }}>
                  {tc.categoryName}
                </div>
                <div className="mnyt-home-trending-title">{tc.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {glossaryTeaser.length > 0 && (
        <div className="mnyt-home-glossary">
          <div className="mnyt-home-glossary-head">
            <div className="mnyt-home-glossary-title">{t.glossaryTeaserTitle}</div>
            <div className="mnyt-home-glossary-sub">{t.glossaryTeaserSub}</div>
            <Link href={MNYT_ROUTES.glossary} className="mnyt-home-glossary-cta">
              {t.glossaryTeaserCta}
            </Link>
          </div>
          <div className="mnyt-home-glossary-grid">
            {glossaryTeaser.map((term) => {
              const meta = getMnytGlossaryCategoryMeta(term.category);
              return (
                <Link key={term.id} href={MNYT_ROUTES.glossary} className="mnyt-home-glossary-card">
                  <div className="mnyt-home-glossary-card-head">
                    <div className="mnyt-home-glossary-card-icon" style={{ ["--term-soft" as string]: `${meta.color}22` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d={meta.iconPath} />
                      </svg>
                    </div>
                    <span className="mnyt-home-glossary-card-tag" style={{ ["--term-color" as string]: meta.color }}>
                      {isVi ? meta.labelVi : meta.labelEn}
                    </span>
                  </div>
                  <div className="mnyt-home-glossary-card-term">{isVi ? term.term : term.termEn || term.term}</div>
                  <div className="mnyt-home-glossary-card-def">{isVi ? term.definition : term.definitionEn || term.definition}</div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mnyt-home-section-label-row">
        <div className="mnyt-home-section-label">{t.globeSectionLabel}</div>
        <div className="mnyt-home-section-meta">
          {categories.length} {isVi ? "thẻ chủ đề" : "field cards"} · {topicsCount} {isVi ? "nốt ý tưởng" : "idea nodes"}
        </div>
      </div>

      <div className="mnyt-home-field-grid">
        {categories.map((cat) => {
          const total = categoryTotals[cat.key] ?? 0;
          const done = categoryCompleted[cat.key] ?? 0;
          const mastered = total > 0 && done >= total;
          const percent = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
          const expanded = expandedCategory === cat.key;
          const initial = (cat.shortName || cat.name).trim().charAt(0).toUpperCase();
          return (
            <div key={cat.key} className="mnyt-home-field-card" style={{ ["--field-color" as string]: cat.color, ["--field-color-soft" as string]: `${cat.color}33`, ["--field-border" as string]: `${cat.color}33` }}>
              <div className="mnyt-home-field-cover">
                <div className="mnyt-home-field-initial">{initial}</div>
                {mastered && (
                  <div className="mnyt-home-field-check" aria-label={isVi ? "Đã hoàn thành" : "Mastered"}>
                    ✓
                  </div>
                )}
              </div>
              <Link href={MNYT_ROUTES.fields} className="mnyt-home-field-body" style={{ display: "block" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div className="mnyt-home-field-name" style={{ flex: 1, minWidth: 0 }}>
                    {isVi ? cat.name : cat.nameEn || cat.name}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpandedCategory(expanded ? null : cat.key);
                    }}
                    style={{ flexShrink: 0, fontSize: 9, color: "var(--text-faint)", padding: "2px 5px", background: "transparent", border: "none", cursor: "pointer" }}
                    aria-expanded={expanded}
                    aria-label={isVi ? "Xem nhanh các ý tưởng trong lĩnh vực" : "Preview ideas in this field"}
                  >
                    {expanded ? "▴" : "▾"}
                  </button>
                </div>
                <div className="mnyt-home-field-track">
                  <div className="mnyt-home-field-track-bar" style={{ width: `${percent}%` }} />
                </div>
                <div className="mnyt-home-field-count">
                  {done}/{total} {t.catDoneLabel}
                </div>
              </Link>
              {expanded && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, margin: "0 14px 12px", paddingTop: 10, borderTop: "1px solid var(--divider)" }}>
                  {(nodesByCategory.get(cat.key) ?? []).slice(0, 20).map((n) => (
                    <Link
                      key={n.id}
                      href={mnytDetailHref(n.id)}
                      title={n.title}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: completedSet.has(n.id) ? cat.color : "transparent",
                        border: `1px solid ${cat.color}`,
                        display: "block",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showOnboarding && (
        <MnytOnboardingModal lang={lang} categories={categories} initialInterests={interests} onClose={onCloseOnboarding} />
      )}
    </section>
  );
}
