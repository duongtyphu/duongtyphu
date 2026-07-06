"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { searchPortal, type PortalSearchResult } from "@/lib/portal/search";
import { usePortalSearchExtras } from "@/lib/portal/search-extras";

export function PortalSearch({ companionTheme = false }: { companionTheme?: boolean } = {}) {
  const extras = usePortalSearchExtras();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PortalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      // Resets search state when the query is cleared; reacting to user
      // input over time, not a pure render computation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const extraMatches = extras.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      );
      setResults([...searchPortal(query), ...extraMatches]);
      setActiveIndex(-1);
      setLoading(false);
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, extras]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

  const grouped = results.reduce<Record<string, PortalSearchResult[]>>((acc, r) => {
    acc[r.type] = acc[r.type] || [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <>
      {/* Desktop inline search */}
      <div ref={wrapRef} className="relative hidden w-full max-w-xs md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm trong Học viện..."
          aria-label="Tìm kiếm toàn Học viện"
          className={
            companionTheme
              ? "w-full rounded-full border border-violet-400/20 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 focus:border-violet-300/50 focus:outline-none"
              : "gemos-search-glass w-full rounded-full py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          }
        />
        {open && query.trim() && (
          <SearchDropdown
            loading={loading}
            grouped={grouped}
            activeIndex={activeIndex}
            results={results}
            onSelect={() => setOpen(false)}
          />
        )}
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        aria-label="Tìm kiếm"
        title="Tìm kiếm"
        onClick={() => setMobileOpen(true)}
        className={
          companionTheme
            ? "flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/20 bg-white/5 text-slate-200 transition hover:border-violet-300/50 hover:text-white md:hidden"
            : "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 transition hover:border-brand-blue/40 hover:text-gray-900 md:hidden"
        }
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
                placeholder="Tìm trong Học viện..."
                aria-label="Tìm kiếm toàn Học viện"
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
              <SearchDropdown
                loading={loading}
                grouped={grouped}
                activeIndex={activeIndex}
                results={results}
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

function SearchDropdown({
  loading,
  grouped,
  results,
  activeIndex,
  onSelect,
  static: isStatic,
}: {
  loading: boolean;
  grouped: Record<string, PortalSearchResult[]>;
  results: PortalSearchResult[];
  activeIndex: number;
  onSelect: () => void;
  static?: boolean;
}) {
  const wrapperClass = isStatic
    ? "rounded-2xl border border-gray-200 bg-white/95 p-2"
    : "absolute left-0 top-full z-50 mt-2 w-[28rem] max-w-[90vw] rounded-2xl border border-gray-200 bg-white/98 p-2 shadow-2xl backdrop-blur-md max-h-[70vh] overflow-y-auto";

  return (
    <div className={wrapperClass}>
      {loading ? (
        <div className="space-y-2 p-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-50" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">Không tìm thấy kết quả phù hợp.</p>
      ) : (
        Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-1">
            <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {type}
            </p>
            {items.map((item) => {
              const flatIndex = results.indexOf(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onSelect}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    flatIndex === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  {item.description && (
                    <span className="ml-2 line-clamp-1 text-xs text-gray-500">{item.description}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
