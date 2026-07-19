"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { adminNavGroups } from "@/lib/admin/nav";

type AdminSearchResult = { id: string; title: string; group: string; href: string };

export function AdminSearch() {
  const allItems = useMemo<AdminSearchResult[]>(
    () =>
      adminNavGroups.flatMap((section) =>
        section.items.map((item) => ({
          id: item.href,
          title: item.label,
          group: section.group ?? "Khác",
          href: item.href,
        }))
      ),
    []
  );

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      window.location.href = results[activeIndex].href;
    }
  }

  return (
    <>
      <div ref={wrapRef} className="relative hidden w-full max-w-xs md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm trong Admin..."
          aria-label="Tìm kiếm toàn Admin"
          className="gemos-search-glass w-full rounded-full py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        {open && query.trim() && (
          <AdminSearchDropdown results={results} activeIndex={activeIndex} onSelect={() => setOpen(false)} />
        )}
      </div>

      <button
        type="button"
        aria-label="Tìm kiếm"
        title="Tìm kiếm"
        onClick={() => setMobileOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 transition hover:border-brand-blue/40 hover:text-gray-900 md:hidden"
      >
        <Search className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-brand-navy/98 p-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm trong Admin..."
                aria-label="Tìm kiếm toàn Admin"
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-blue/50 focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Đóng tìm kiếm"
              onClick={() => {
                setMobileOpen(false);
                setQuery("");
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 max-h-[80vh] overflow-y-auto">
            {query.trim() && (
              <AdminSearchDropdown
                results={results}
                activeIndex={activeIndex}
                static
                onSelect={() => {
                  setMobileOpen(false);
                  setQuery("");
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function AdminSearchDropdown({
  results,
  activeIndex,
  onSelect,
  static: isStatic,
}: {
  results: AdminSearchResult[];
  activeIndex: number;
  onSelect: () => void;
  static?: boolean;
}) {
  const wrapperClass = isStatic
    ? "rounded-2xl border border-gray-200 bg-white/95 p-2"
    : "absolute left-0 top-full z-50 mt-2 w-[24rem] max-w-[90vw] rounded-2xl border border-gray-200 bg-white/98 p-2 shadow-2xl backdrop-blur-md max-h-[70vh] overflow-y-auto";

  const grouped = results.reduce<Record<string, AdminSearchResult[]>>((acc, r) => {
    acc[r.group] = acc[r.group] || [];
    acc[r.group].push(r);
    return acc;
  }, {});

  return (
    <div className={wrapperClass}>
      {results.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">Không tìm thấy kết quả phù hợp.</p>
      ) : (
        Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="mb-1">
            <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">{group}</p>
            {items.map((item) => {
              const flatIndex = results.indexOf(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onSelect}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 transition ${
                    flatIndex === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
