"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { searchPortal, type PortalSearchResult } from "@/lib/portal/search";

export function PortalSearch() {
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
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResults(searchPortal(query));
      setActiveIndex(-1);
      setLoading(false);
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm trong Portal..."
          aria-label="Tìm kiếm toàn Portal"
          className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-brand-blue/50 focus:outline-none"
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
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-brand-blue/40 hover:text-white md:hidden"
      >
        <Search className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-brand-navy/98 p-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm trong Portal..."
                aria-label="Tìm kiếm toàn Portal"
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-brand-blue/50 focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Đóng tìm kiếm"
              onClick={() => {
                setMobileOpen(false);
                setQuery("");
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70"
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
    ? "rounded-2xl border border-white/10 bg-[#0B1F4D]/95 p-2"
    : "absolute left-0 top-full z-50 mt-2 w-[28rem] max-w-[90vw] rounded-2xl border border-white/10 bg-[#0B1F4D]/98 p-2 shadow-2xl backdrop-blur-md max-h-[70vh] overflow-y-auto";

  return (
    <div className={wrapperClass}>
      {loading ? (
        <div className="space-y-2 p-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="p-4 text-center text-sm text-white/50">Không tìm thấy kết quả phù hợp.</p>
      ) : (
        Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-1">
            <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
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
                    flatIndex === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="font-semibold text-white">{item.title}</span>
                  {item.description && (
                    <span className="ml-2 line-clamp-1 text-xs text-white/50">{item.description}</span>
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
