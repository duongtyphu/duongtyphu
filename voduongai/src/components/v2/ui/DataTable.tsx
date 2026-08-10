"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { MoreHorizontal, Search } from "lucide-react";

/**
 * `.table-card` — bảng dữ liệu của khu vực Admin.
 *
 * Đây mới là pattern lặp lại nhiều nhất ở Admin (18/25 màn), chứ không phải
 * `ListEditorPanel` như README dự đoán: chỉ 3 màn (Trang chủ, Landing Page,
 * Trang Pháp lý) dùng CRUD split trái/phải.
 *
 * Ô bảng được mô tả bằng DỮ LIỆU THUẦN chứ không phải hàm `render`. Lý do: các
 * trang Admin là Server Component, mà hàm thì không truyền qua ranh giới
 * server→client được. Nhờ vậy mọi trang chỉ cần map dữ liệu sang `TableRow` là
 * dùng chung được một component này, không phải viết wrapper `"use client"`
 * riêng cho từng bảng.
 *
 * Lọc theo tab, tìm kiếm và phân trang hoạt động thật — mockup chỉ là nút tĩnh.
 */

export type TableCell =
  | { t: "text"; v: string }
  | { t: "strong"; v: string }
  | { t: "muted"; v: string }
  | { t: "user"; initials: string; name: string; sub: string }
  | { t: "tag"; label: string; background: string; color: string }
  | { t: "status"; label: string; color: string }
  | { t: "progress"; value: number; label: string };

export type TableRow = {
  id: string;
  cells: TableCell[];
  /** Đích điều hướng khi bấm vào ô đầu tiên. */
  href?: string;
  /** Khoá để tab lọc đối chiếu, ví dụ ["premium", "active"]. */
  tags?: string[];
  /** Chuỗi dùng khi tìm kiếm. Bỏ trống = dùng toàn bộ text của các ô. */
  search?: string;
};

export type TableFilterTab = {
  id: string;
  label: string;
  /** Bỏ trống = tab "Tất cả". Ngược lại chỉ giữ dòng có `tags` chứa giá trị này. */
  tag?: string;
};

function cellText(cell: TableCell): string {
  switch (cell.t) {
    case "user":
      return `${cell.name} ${cell.sub}`;
    case "tag":
    case "status":
      return cell.label;
    case "progress":
      return cell.label;
    default:
      return cell.v;
  }
}

function Cell({ cell }: { cell: TableCell }) {
  switch (cell.t) {
    case "strong":
      return <span className="font-bold">{cell.v}</span>;

    case "muted":
      return <span className="text-[var(--v2-muted)]">{cell.v}</span>;

    case "user":
      return (
        <span className="flex items-center gap-[11px]">
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b7bde,#5f4bc9)] text-[12px] font-bold text-white">
            {cell.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold">{cell.name}</span>
            <span className="block truncate text-[11.5px] text-[var(--v2-muted)]">{cell.sub}</span>
          </span>
        </span>
      );

    case "tag":
      return (
        <span
          className="inline-block rounded-md px-[9px] py-[3px] text-[11.5px] font-bold whitespace-nowrap"
          style={{ background: cell.background, color: cell.color }}
        >
          {cell.label}
        </span>
      );

    case "status":
      return (
        <span className="flex items-center gap-[7px] text-[12.5px] whitespace-nowrap">
          <i
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: cell.color }}
          />
          {cell.label}
        </span>
      );

    case "progress":
      return (
        <span className="flex items-center gap-[10px]">
          <span className="h-[6px] w-20 shrink-0 overflow-hidden rounded-md bg-[var(--v2-bg)]">
            <span
              className="block h-full rounded-md bg-[var(--v2-violet)]"
              style={{ width: `${Math.min(100, Math.max(0, cell.value))}%` }}
            />
          </span>
          <span className="text-[12px] font-bold text-[var(--v2-muted)]">{cell.label}</span>
        </span>
      );

    default:
      return <>{cell.v}</>;
  }
}

export function DataTable({
  title,
  headers,
  rows,
  filterTabs,
  searchPlaceholder,
  toolbarRight,
  totalLabel,
  totalOverride,
  pageSize = 8,
}: {
  title?: string;
  headers: string[];
  rows: TableRow[];
  filterTabs?: TableFilterTab[];
  /** Bỏ trống = không hiện ô tìm kiếm. */
  searchPlaceholder?: string;
  toolbarRight?: ReactNode;
  /** Ví dụ "người dùng" -> "Hiển thị 1–8 trong 18.420 người dùng". */
  totalLabel?: string;
  /** Tổng thật trên hệ thống, khi bảng chỉ tải một phần dữ liệu. */
  totalOverride?: number;
  pageSize?: number;
}) {
  const [activeTab, setActiveTab] = useState(filterTabs?.[0]?.id ?? "all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const tab = filterTabs?.find((candidate) => candidate.id === activeTab);
    const byTab = tab?.tag ? rows.filter((row) => row.tags?.includes(tab.tag as string)) : rows;

    const needle = query.trim().toLowerCase();
    if (!needle) return byTab;

    return byTab.filter((row) =>
      (row.search ?? row.cells.map(cellText).join(" ")).toLowerCase().includes(needle),
    );
  }, [rows, filterTabs, activeTab, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const from = filtered.length === 0 ? 0 : safePage * pageSize + 1;
  const to = safePage * pageSize + visible.length;
  const total = totalOverride ?? filtered.length;

  return (
    <div className="overflow-hidden rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)]">
      {title || filterTabs || searchPlaceholder || toolbarRight ? (
        <div className="flex flex-wrap items-center gap-[10px] border-b border-[var(--v2-line)] px-5 py-4">
          {title ? <h4 className="text-[15px] font-extrabold">{title}</h4> : null}

          {filterTabs ? (
            <div className="flex gap-[6px] rounded-[9px] bg-[var(--v2-bg)] p-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(0);
                  }}
                  className={[
                    "rounded-[7px] px-[13px] py-[7px] text-[12.5px] font-bold transition-colors",
                    tab.id === activeTab
                      ? "bg-[var(--v2-surface)] text-[var(--v2-violet)] shadow-[0_1px_3px_rgba(0,0,0,.08)]"
                      : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}

          {searchPlaceholder ? (
            <div className="relative min-w-[180px] flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-[14px] w-[14px] -translate-y-1/2 text-[var(--v2-muted)]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full rounded-[9px] border border-[var(--v2-line)] bg-[var(--v2-bg)] py-2 pr-3 pl-9 text-[12.5px] outline-none focus:border-[var(--v2-violet)]"
              />
            </div>
          ) : null}

          {toolbarRight ? <div className="ml-auto">{toolbarRight}</div> : null}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border-b border-[var(--v2-line)] px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.04em] whitespace-nowrap text-[var(--v2-muted)] uppercase"
                >
                  {header}
                </th>
              ))}
              <th className="w-12 border-b border-[var(--v2-line)] px-5 py-3">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="px-5 py-10 text-center text-[13px] text-[var(--v2-muted)]"
                >
                  Không có dữ liệu khớp bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--v2-line)] last:border-b-0 hover:bg-[var(--v2-bg)]"
                >
                  {row.cells.map((cell, index) => (
                    <td key={index} className="px-5 py-[13px] align-middle">
                      {index === 0 && row.href ? (
                        <a href={row.href} className="text-inherit">
                          <Cell cell={cell} />
                        </a>
                      ) : (
                        <Cell cell={cell} />
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-[13px] text-right">
                    <button
                      type="button"
                      aria-label="Hành động khác"
                      className="rounded-md px-1 text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalLabel ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--v2-line)] px-5 py-[14px] text-[12px] text-[var(--v2-muted)]">
          <span>
            Hiển thị {from}–{to} trong {total.toLocaleString("vi-VN")} {totalLabel}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={safePage === 0}
              aria-label="Trang trước"
              className="rounded-md border border-[var(--v2-line)] px-[10px] py-1 font-bold disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, index) => index).map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index)}
                aria-current={index === safePage ? "page" : undefined}
                className={[
                  "rounded-md border px-[10px] py-1 font-bold",
                  index === safePage
                    ? "border-[var(--v2-violet)] bg-[var(--v2-violet)] text-white"
                    : "border-[var(--v2-line)]",
                ].join(" ")}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(pageCount - 1, prev + 1))}
              disabled={safePage >= pageCount - 1}
              aria-label="Trang sau"
              className="rounded-md border border-[var(--v2-line)] px-[10px] py-1 font-bold disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
