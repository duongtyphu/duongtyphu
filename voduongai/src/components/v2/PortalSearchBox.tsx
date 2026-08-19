"use client";

/* =============================================================================
 * PortalSearchBox — ô tìm kiếm THẬT dùng chung cho toàn bộ portal 2.0 (cùng
 * nhóm 19 trang đã nhận `ProfileMenu`/`NotificationBell`). Trước đây MỌI ô
 * tìm kiếm chỉ là `<input type="text" placeholder="..."/>` tĩnh — không
 * `value`/`onChange`, gõ gì cũng không có tác dụng.
 *
 * Nguồn dữ liệu THẬT: gọi lại ĐÚNG API tìm kiếm CKOS đã có sẵn
 * (`/api/v1/ckos/search`, `src/app/api/v1/ckos/search/route.ts`) — route
 * công khai, không cần đăng nhập, gộp cả nội dung tĩnh 2.0/1.0 dùng chung
 * (Lesson/Prompt/Workflow/Resource) lẫn dữ liệu Supabase thật (Goal/Best
 * Practice/Case Study/Tool AI) — KHÔNG viết API tìm kiếm riêng cho 2.0 (tái
 * sử dụng, không xây trùng, đúng nguyên tắc "Tầng dữ liệu hiện có" của dự
 * án). `href` mỗi kết quả phần lớn trỏ vào `/portal/*` (1.0) — ĐÚNG Ý —
 * nhiều nội dung (Prompt/Resource/SOP/Case Study/Best Practice) CHƯA có
 * trang xem riêng ở 2.0, cùng cách `TrangChuClient.tsx`'s `SUGG_TARGET` đã
 * trỏ sang 1.0 cho các loại tương tự.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchResultType = "goal" | "tool" | "prompt" | "workflow" | "best_practice" | "case_study" | "lesson" | "resource";

type SearchResult = {
  type: SearchResultType;
  id: string;
  title: string;
  description: string | null;
  href: string;
};

const TYPE_LABEL: Record<SearchResultType, string> = {
  goal: "Mục tiêu",
  tool: "Công cụ AI",
  prompt: "Prompt",
  workflow: "Workflow",
  best_practice: "Thực hành tốt",
  case_study: "Case Study",
  lesson: "Bài học",
  resource: "Tài nguyên",
};

const searchBoxIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export function PortalSearchBox({
  placeholder,
  /** `"box"` = markup `.search-box` (khuôn phổ biến, có `<kbd>⌘K</kbd>` khi
   * rỗng); `"bare"` = markup `.search` (nhóm Companion, không `<kbd>`). */
  variant = "box",
}: {
  placeholder: string;
  variant?: "box" | "bare";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query.trim();
    const timer = setTimeout(
      () => {
        if (q.length < 2) {
          setResults([]);
          setLoading(false);
          return;
        }
        setLoading(true);
        fetch(`/api/v1/ckos/search?q=${encodeURIComponent(q)}&pageSize=8`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data: { items?: SearchResult[] } | null) => setResults(data?.items ?? []))
          .catch(() => setResults([]))
          .finally(() => setLoading(false));
      },
      q.length < 2 ? 0 : 220,
    );
    return () => clearTimeout(timer);
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const trimmed = query.trim();

  return (
    <div ref={ref} className={variant === "box" ? "search-box" : "search"} style={{ position: "relative" }}>
      {searchBoxIcon}
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {variant === "box" && trimmed.length === 0 && <kbd>⌘ K</kbd>}

      {open && trimmed.length >= 2 && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 8px)",
            zIndex: 50,
            maxHeight: 360,
            overflowY: "auto",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            background: "#fff",
            padding: 8,
            boxShadow: "0 20px 40px rgba(15,23,42,.15)",
          }}
        >
          {loading ? (
            <p style={{ margin: 0, padding: "10px 8px", fontSize: 13, color: "#9CA3AF" }}>Đang tìm...</p>
          ) : results.length === 0 ? (
            <p style={{ margin: 0, padding: "10px 8px", fontSize: 13, color: "#9CA3AF" }}>
              Không tìm thấy kết quả cho &quot;{trimmed}&quot;.
            </p>
          ) : (
            results.map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => go(r.href)}
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                  gap: 2,
                  borderRadius: 10,
                  border: "none",
                  background: "none",
                  padding: "8px 8px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#6B7280",
                      background: "#F3F4F6",
                      borderRadius: 6,
                      padding: "2px 6px",
                      flexShrink: 0,
                    }}
                  >
                    {TYPE_LABEL[r.type] ?? r.type}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.title}</span>
                </span>
                {r.description && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.description}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
