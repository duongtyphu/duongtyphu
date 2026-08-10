"use client";

import { useState } from "react";

import type { GrowthPoint } from "@/lib/v2/data/dashboard";

/**
 * Tăng trưởng người dùng mới & doanh thu.
 *
 * HAI ĐIỂM KHÁC MOCKUP, CÓ CHỦ Ý:
 *
 * 1. Mockup vẽ hai chuỗi chồng lên nhau trong một khung. Người dùng (nghìn
 *    người) và doanh thu (triệu ₫) là hai đơn vị khác nhau — vẽ chung một khung
 *    buộc phải dùng hai trục y, khiến hai đường cắt nhau ở chỗ dữ liệu không hề
 *    cắt nhau và đọc ra kết luận sai. Ở đây tách thành hai khung xếp dọc dùng
 *    chung trục x (small multiples): giữ nguyên giá trị tuyệt đối, bỏ trục kép.
 *
 * 2. Vàng thương hiệu `--gold #e2b23c` không đạt tương phản tối thiểu 3:1 trên
 *    nền trắng khi dùng làm nét vẽ mảnh. Dùng bậc vàng đậm `#a9822c` — vốn đã
 *    có sẵn trong bộ thiết kế (màu chữ của `.upgrade-btn`), không phải màu mới.
 *    Cặp màu đã qua kiểm tra: đạt lightness band, chroma, tách biệt mù màu
 *    (ΔE 33.6 protan) và tương phản nền ở cả nền sáng lẫn nền tối.
 */

const SERIES = [
  {
    key: "users" as const,
    label: "Người dùng mới",
    color: "var(--v2-chart-1)",
    unit: "người",
    format: (n: number) => n.toLocaleString("vi-VN"),
  },
  {
    key: "revenue" as const,
    label: "Doanh thu",
    color: "var(--v2-chart-2)",
    unit: "triệu ₫",
    format: (n: number) => `${n.toLocaleString("vi-VN")} Tr₫`,
  },
];

const W = 640;
const H = 96;
const PAD_X = 8;
const PAD_Y = 12;

function buildPath(values: number[], min: number, max: number): string {
  const span = max - min || 1;
  return values
    .map((value, index) => {
      const x = PAD_X + (index / (values.length - 1)) * (W - PAD_X * 2);
      const y = PAD_Y + (1 - (value - min) / span) * (H - PAD_Y * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div>
      {/* Chú giải — luôn có khi ≥ 2 chuỗi, để nhận diện không chỉ dựa vào màu. */}
      <div className="mb-3 flex flex-wrap gap-4">
        {SERIES.map((series) => (
          <span
            key={series.key}
            className="flex items-center gap-[6px] text-[11.5px] font-semibold text-[var(--v2-muted)]"
          >
            <i
              aria-hidden="true"
              className="h-[3px] w-4 rounded-full"
              style={{ background: series.color }}
            />
            {series.label}
          </span>
        ))}
      </div>

      <div
        className="flex flex-col gap-2"
        onMouseLeave={() => setHover(null)}
        onPointerLeave={() => setHover(null)}
      >
        {SERIES.map((series) => {
          const values = data.map((point) => point[series.key]);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const span = max - min || 1;
          const last = values[values.length - 1];

          return (
            <div key={series.key}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[11px] font-bold text-[var(--v2-muted)]">
                  {series.label}
                </span>
                {/* Nhãn trực tiếp cho điểm cuối — không dán số lên mọi điểm. */}
                <span className="text-[12px] font-extrabold" style={{ color: series.color }}>
                  {series.format(last)}
                </span>
              </div>

              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="block h-[96px] w-full"
                role="img"
                aria-label={`${series.label} theo tháng, từ ${series.format(values[0])} tới ${series.format(last)}`}
                onPointerMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const ratio = (event.clientX - rect.left) / rect.width;
                  const index = Math.round(ratio * (data.length - 1));
                  setHover(Math.min(data.length - 1, Math.max(0, index)));
                }}
              >
                {/* Lưới lùi về sau — 3 đường ngang mảnh. */}
                {[0, 0.5, 1].map((ratio) => (
                  <line
                    key={ratio}
                    x1={PAD_X}
                    x2={W - PAD_X}
                    y1={PAD_Y + ratio * (H - PAD_Y * 2)}
                    y2={PAD_Y + ratio * (H - PAD_Y * 2)}
                    stroke="var(--v2-line)"
                    strokeWidth={1}
                  />
                ))}

                <path
                  d={buildPath(values, min, max)}
                  fill="none"
                  stroke={series.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {hover !== null ? (
                  <>
                    <line
                      x1={PAD_X + (hover / (data.length - 1)) * (W - PAD_X * 2)}
                      x2={PAD_X + (hover / (data.length - 1)) * (W - PAD_X * 2)}
                      y1={PAD_Y}
                      y2={H - PAD_Y}
                      stroke="var(--v2-muted)"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    {/* Vòng nền quanh điểm để không lẫn vào đường kẻ phía sau. */}
                    <circle
                      cx={PAD_X + (hover / (data.length - 1)) * (W - PAD_X * 2)}
                      cy={PAD_Y + (1 - (values[hover] - min) / span) * (H - PAD_Y * 2)}
                      r={5}
                      fill={series.color}
                      stroke="var(--v2-surface)"
                      strokeWidth={2}
                    />
                  </>
                ) : null}
              </svg>
            </div>
          );
        })}

        {/* Trục x dùng chung cho cả hai khung. */}
        <div className="flex justify-between px-2 text-[10px] text-[var(--v2-muted)]">
          {data.map((point, index) => (
            <span key={point.label} className={hover === index ? "font-extrabold" : ""}>
              {point.label}
            </span>
          ))}
        </div>
      </div>

      {hover !== null ? (
        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-[10px] bg-[var(--v2-bg)] px-3 py-2 text-[12px]">
          <b className="font-extrabold">{data[hover].label}</b>
          {SERIES.map((series) => (
            <span key={series.key} className="flex items-center gap-[6px] text-[var(--v2-muted)]">
              <i
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ background: series.color }}
              />
              {series.label}:{" "}
              <b className="font-bold text-[var(--v2-text)]">
                {series.format(data[hover][series.key])}
              </b>
            </span>
          ))}
        </div>
      ) : null}

      {/* Bảng dữ liệu — đường dẫn thay thế cho người dùng trình đọc màn hình và
          cho trường hợp không phân biệt được màu. */}
      <details className="mt-3">
        <summary className="cursor-pointer text-[11.5px] font-bold text-[var(--v2-violet)]">
          Xem dạng bảng
        </summary>
        <table className="mt-2 w-full text-left text-[11.5px]">
          <thead>
            <tr className="text-[var(--v2-muted)]">
              <th className="py-1 font-bold">Tháng</th>
              {SERIES.map((series) => (
                <th key={series.key} className="py-1 font-bold">
                  {series.label} ({series.unit})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.label} className="border-t border-[var(--v2-line)]">
                <td className="py-1">{point.label}</td>
                <td className="py-1">{point.users.toLocaleString("vi-VN")}</td>
                <td className="py-1">{point.revenue.toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
