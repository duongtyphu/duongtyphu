"use client";

/**
 * View "Bản đồ lĩnh vực" (9/10) — `/v2/moi-ngay-mot-y-tuong/linh-vuc`, 1:1
 * với mockup dòng 430-483: quả cầu 3D 35 nốt lĩnh vực (auto-drift, dừng khi
 * hover — khác quả cầu Trang chủ vốn xoay bằng kéo tay chủ động) + chú
 * giải 3 trạng thái + hộp "đang xem"/"lĩnh vực hôm nay" + lưới đầy đủ 35 thẻ
 * lĩnh vực (tỉ lệ đã học/tổng + progress bar).
 *
 * Vị trí nốt tính bằng NGUYÊN hàm `fibonacciPoint()` đã dùng ở
 * `MnytHomeClient.tsx` (Single Source of Truth phân bố đều trên mặt cầu) —
 * KHÔNG dùng công thức `(i*13)%dn` riêng của mockup gốc, cùng lý do đã áp
 * dụng cho quả cầu Trang chủ: chỉ cần phân bố đều thật trên mặt cầu, không
 * cần khớp bit-for-bit công thức tuỳ ý của bản demo.
 *
 * Bấm 1 nốt/1 thẻ lĩnh vực → `/lo-trinh?cat=<key>` (đúng hành vi
 * `openDomainPath()` của mockup gốc — đã thêm hỗ trợ đọc `?cat=` ở
 * `lo-trinh/page.tsx`).
 *
 * Quả cầu 3D CHỈ hiện ở màn hình ≥720px (khớp `useSphere: !isMobile` của
 * mockup) — ẩn qua CSS media query, không phải điều kiện JS phụ thuộc
 * `window.innerWidth` (tránh vấn đề hydration mismatch, luôn render đủ DOM
 * ở server lẫn client, chỉ khác observable CSS `display`).
 */

import { useMemo, useState } from "react";
import Link from "next/link";

import type { MnytCategory, MnytGlobeNode } from "@/lib/portal/live-mnyt";
import { MNYT_ROUTES } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

type Props = {
  lang: "vi" | "en";
  categories: MnytCategory[];
  globeNodes: MnytGlobeNode[];
  completedIds: string[];
  todayCategoryKey: string | null;
};

type DomainStatus = "locked" | "active" | "done";
type DomainEntry = { cat: MnytCategory; total: number; done: number };

const SPHERE_RADIUS = 150;

function fibonacciPoint(i: number, n: number): { x: number; y: number; z: number } {
  if (n <= 1) return { x: 0, y: 0, z: 1 };
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (n - 1)) * 2;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * i;
  return { x: Math.cos(theta) * radiusAtY, y, z: Math.sin(theta) * radiusAtY };
}

function domainStatus(done: number, total: number): DomainStatus {
  if (done === 0) return "locked";
  return done >= total ? "done" : "active";
}

function fieldHref(key: string): string {
  return `${MNYT_ROUTES.path}?cat=${encodeURIComponent(key)}`;
}

export function MnytFieldsClient({ lang, categories, globeNodes, completedIds, todayCategoryKey }: Props) {
  const isVi = lang === "vi";
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const domainData: DomainEntry[] = useMemo(() => {
    return categories.map((cat) => {
      const catNodes = globeNodes.filter((n) => n.categoryKey === cat.key);
      const done = catNodes.filter((n) => completedSet.has(n.id)).length;
      return { cat, total: catNodes.length, done };
    });
  }, [categories, globeNodes, completedSet]);

  const domainTotal = useMemo(() => domainData.reduce((acc, d) => acc + d.total, 0), [domainData]);
  const domainDone = useMemo(() => domainData.reduce((acc, d) => acc + d.done, 0), [domainData]);
  const domainDonePct = domainTotal > 0 ? Math.round((domainDone / domainTotal) * 100) : 0;

  const hoveredDomain = domainData.find((d) => d.cat.key === hoveredKey) ?? null;
  const tipDomain = hoveredDomain ?? domainData.find((d) => d.cat.key === todayCategoryKey) ?? domainData[0] ?? null;
  const tipPct = tipDomain && tipDomain.total > 0 ? Math.round((tipDomain.done / tipDomain.total) * 100) : 0;

  const nodePositions = useMemo(() => {
    const n = domainData.length;
    return domainData.map((d, i) => {
      const p = fibonacciPoint(i, n);
      return { domain: d, x: p.x * SPHERE_RADIUS, y: p.y * SPHERE_RADIUS, z: p.z * SPHERE_RADIUS };
    });
  }, [domainData]);

  const t = {
    title: isVi ? "Bản đồ lĩnh vực" : "Field map",
    sub: isVi
      ? "35 lĩnh vực, 446 ý tưởng — xem bạn đã đi được bao xa ở từng lĩnh vực."
      : "35 fields, 446 ideas — see how far you have gone in each field.",
    legendDone: isVi ? "Đã hoàn thành" : "Completed",
    legendActive: isVi ? "Đang học" : "In progress",
    legendLocked: isVi ? "Chưa mở" : "Not started",
    coreLabel: isVi ? "ĐÃ ĐI QUA" : "COVERED",
    tipKickerViewing: isVi ? "ĐANG XEM" : "VIEWING",
    tipKickerToday: isVi ? "LĨNH VỰC HÔM NAY" : "TODAY'S FIELD",
    ideasSuffix: isVi ? "ý tưởng" : "ideas",
    caption: isVi
      ? "Mỗi nốt là một trong 35 lĩnh vực · bấm vào nốt để mở lộ trình lĩnh vực đó"
      : "Each node is one of 35 fields · click a node to open its learning path",
    listLabel: isVi ? "Toàn bộ lĩnh vực" : "All fields",
  };

  return (
    <section className="mnyt-fields" data-screen-label="Fields">
      <h1 className="mnyt-fields-title">{t.title}</h1>
      <p className="mnyt-fields-sub">{t.sub}</p>

      <div className="mnyt-fields-legend">
        <span className="mnyt-fields-legend-item">
          <span className="mnyt-fields-legend-dot mnyt-fields-legend-dot--done" aria-hidden />
          {t.legendDone}
        </span>
        <span className="mnyt-fields-legend-item">
          <span className="mnyt-fields-legend-dot mnyt-fields-legend-dot--active" aria-hidden />
          {t.legendActive}
        </span>
        <span className="mnyt-fields-legend-item">
          <span className="mnyt-fields-legend-dot mnyt-fields-legend-dot--locked" aria-hidden />
          {t.legendLocked}
        </span>
      </div>

      <div
        className="mnyt-fields-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setHoveredKey(null);
        }}
      >
        <div className="mnyt-fields-stage-glow" aria-hidden />
        <div className="mnyt-fields-ring-outer" aria-hidden />
        <div className="mnyt-fields-ring-mid" aria-hidden />
        <div className="mnyt-fields-sphere" data-paused={paused}>
          {nodePositions.map(({ domain: d, x, y, z }) => {
            const status = domainStatus(d.done, d.total);
            const isHov = hoveredKey === d.cat.key;
            const baseSize = status === "locked" ? 8 : status === "done" ? 13 : 11;
            const size = isHov ? baseSize * 1.7 : baseSize;
            const bg = status === "locked" ? "var(--text-disabled)" : d.cat.color;
            const glow =
              status === "done"
                ? `0 0 14px ${d.cat.color}`
                : status === "active"
                  ? `0 0 10px ${d.cat.color}, 0 0 0 3px rgba(255,255,255,0.28)`
                  : "none";
            const name = isVi ? d.cat.name : d.cat.nameEn || d.cat.name;
            return (
              <Link
                key={d.cat.key}
                href={fieldHref(d.cat.key)}
                className="mnyt-fields-node"
                title={`${name} · ${d.done}/${d.total}`}
                onMouseEnter={() => setHoveredKey(d.cat.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  width: size,
                  height: size,
                  background: bg,
                  boxShadow: glow,
                  opacity: status === "locked" ? 0.5 : hoveredKey && !isHov ? 0.45 : 1,
                  transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, ${Math.round(z)}px)`,
                  zIndex: isHov ? 999 : undefined,
                }}
              />
            );
          })}
        </div>
        <div className="mnyt-fields-core" aria-hidden>
          <div className="mnyt-fields-core-pct">{domainDonePct}%</div>
          <div className="mnyt-fields-core-label">{t.coreLabel}</div>
        </div>
        {tipDomain && (
          <div className="mnyt-fields-tip">
            <div className="mnyt-fields-tip-kicker">{hoveredDomain ? t.tipKickerViewing : t.tipKickerToday}</div>
            <div className="mnyt-fields-tip-name">{isVi ? tipDomain.cat.name : tipDomain.cat.nameEn || tipDomain.cat.name}</div>
            <div className="mnyt-fields-tip-track">
              <div className="mnyt-fields-tip-bar" style={{ width: `${tipPct}%`, background: tipDomain.cat.color }} />
            </div>
            <div className="mnyt-fields-tip-progress">
              {tipDomain.done}/{tipDomain.total} {t.ideasSuffix} · {tipPct}%
            </div>
          </div>
        )}
      </div>
      <p className="mnyt-fields-caption">{t.caption}</p>

      <div className="mnyt-fields-list-label">{t.listLabel}</div>
      <div className="mnyt-fields-tile-grid">
        {domainData.map((d) => {
          const status = domainStatus(d.done, d.total);
          const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0;
          const short = isVi ? d.cat.shortName || d.cat.name : d.cat.nameEn || d.cat.name;
          const fullName = isVi ? d.cat.name : d.cat.nameEn || d.cat.name;
          const borderColor = status === "locked" ? "rgba(231,229,240,0.07)" : status === "done" ? `${d.cat.color}66` : `${d.cat.color}aa`;
          return (
            <Link
              key={d.cat.key}
              href={fieldHref(d.cat.key)}
              className="mnyt-fields-tile"
              data-status={status}
              style={{ ["--tile-color" as string]: d.cat.color, borderColor }}
              title={`${fullName} · ${d.done}/${d.total}`}
            >
              <div className="mnyt-fields-tile-head">
                <span className="mnyt-fields-tile-dot" aria-hidden />
                <span className="mnyt-fields-tile-ratio">
                  {d.done}/{d.total}
                </span>
              </div>
              <div className="mnyt-fields-tile-short">{short}</div>
              <div className="mnyt-fields-tile-track">
                <div className="mnyt-fields-tile-bar" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
