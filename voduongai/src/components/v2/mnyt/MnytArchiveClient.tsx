"use client";

/**
 * View "Kho ý tưởng" (3/10) — `/v2/moi-ngay-mot-y-tuong/kho-y-tuong`, 1:1
 * với mockup dòng 915-984: chip lọc lĩnh vực + công cụ, ô tìm kiếm, chip độ
 * khó, đếm kết quả + "Xoá bộ lọc", lưới thẻ (badge ✓ đã hoàn thành / ★ yêu
 * thích), nút "Xem thêm" phân trang, nút "Thẻ lật" mở Flashcard theo đúng
 * lĩnh vực đang lọc.
 *
 * KHÁC mockup gốc — thay vì lọc 446 dòng ĐÃ TẢI HẾT ở client (mockup chạy
 * trên `this.topics` in-memory), mọi lần đổi bộ lọc/tải thêm gọi lại
 * `/api/mnyt/topics` (Giai đoạn 2, phân trang + lọc thật ở DB) — đúng yêu
 * cầu README "không tải hết 446 ý tưởng chỉ để hiển thị một".
 *
 * "Ý tưởng cộng đồng đề xuất" của mockup (dữ liệu mẫu trong bộ nhớ tab,
 * giả lập nhiều người dùng) đổi thành "Ý tưởng bạn đã đề xuất" — RLS
 * `mnyt_submissions` chỉ cho đọc đúng dòng của chính mình (Admin duyệt
 * riêng qua service role), không có feed công khai thật để hiển thị đúng ý
 * mockup gốc — đây là lựa chọn trung thực với dữ liệu thật, không bịa.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import type { MnytCategory, MnytTopicSummary } from "@/lib/portal/live-mnyt";
import type { MnytStateBundle } from "@/lib/portal/mnyt-sync";
import { MNYT_ROUTES, mnytDetailHref } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

type Props = {
  lang: "vi" | "en";
  categories: MnytCategory[];
  toolNames: string[];
  difficulties: string[];
  topicsCount: number;
  initialItems: MnytTopicSummary[];
  initialTotal: number;
  completedIds: string[];
  favoriteIds: string[];
  submissions: MnytStateBundle["submissions"];
};

const PAGE_SIZE = 60;
const SEARCH_DEBOUNCE_MS = 350;

type ArchiveResponse = { items: MnytTopicSummary[]; total: number };

async function fetchArchivePage(
  params: { category: string; tool: string; difficulty: string; q: string; page: number },
  signal: AbortSignal,
): Promise<ArchiveResponse | null> {
  const sp = new URLSearchParams();
  if (params.category !== "all") sp.set("category", params.category);
  if (params.tool !== "all") sp.set("tool", params.tool);
  if (params.difficulty !== "all") sp.set("difficulty", params.difficulty);
  if (params.q.trim()) sp.set("q", params.q.trim());
  sp.set("page", String(params.page));
  sp.set("pageSize", String(PAGE_SIZE));

  try {
    const res = await fetch(`/api/mnyt/topics?${sp.toString()}`, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { items: MnytTopicSummary[]; total: number };
    return { items: json.items, total: json.total };
  } catch {
    return null;
  }
}

export function MnytArchiveClient({
  lang,
  categories,
  toolNames,
  difficulties,
  topicsCount,
  initialItems,
  initialTotal,
  completedIds,
  favoriteIds,
  submissions,
}: Props) {
  const isVi = lang === "vi";

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterTool, setFilterTool] = useState("all");
  const [filterDiff, setFilterDiff] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const isFirstRun = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // Debounce ô tìm kiếm — mockup gốc không cần (lọc in-memory tức thì),
  // nhưng gọi API thật mỗi phím gõ sẽ spam server không cần thiết.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const reload = useCallback(
    (category: string, tool: string, diff: string, q: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setPage(1);
      fetchArchivePage({ category, tool, difficulty: diff, q, page: 1 }, controller.signal).then((res) => {
        if (!res) return;
        setItems(res.items);
        setTotal(res.total);
        setLoading(false);
      });
    },
    [],
  );

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    reload(filterCategory, filterTool, filterDiff, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterTool, filterDiff, search]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    const nextPage = page + 1;
    fetchArchivePage({ category: filterCategory, tool: filterTool, difficulty: filterDiff, q: search, page: nextPage }, new AbortController().signal).then(
      (res) => {
        if (res) {
          setItems((prev) => [...prev, ...res.items]);
          setTotal(res.total);
          setPage(nextPage);
        }
        setLoadingMore(false);
      },
    );
  }, [page, filterCategory, filterTool, filterDiff, search]);

  const clearFilters = useCallback(() => {
    setFilterCategory("all");
    setFilterTool("all");
    setFilterDiff("all");
    setSearchInput("");
    setSearch("");
  }, []);

  const filtersActive = filterCategory !== "all" || filterTool !== "all" || filterDiff !== "all" || search.trim().length > 0;
  const hasMore = items.length < total;
  const hasNoResults = !loading && items.length === 0;

  const t = {
    title: isVi ? "Kho ý tưởng" : "Idea Library",
    community: isVi ? "Ý tưởng bạn đã đề xuất" : "Ideas you've submitted",
    pending: isVi ? "Chờ duyệt" : "Pending review",
    all: isVi ? "Tất cả" : "All",
    allTools: isVi ? "Tất cả công cụ" : "All tools",
    allLevels: isVi ? "Mọi độ khó" : "All levels",
    flashcardBtn: isVi ? "Thẻ lật" : "Flashcards",
    searchPlaceholder: isVi ? "Tìm ý tưởng…" : "Search ideas…",
    clearFilters: isVi ? "Xoá bộ lọc" : "Clear filters",
    noResults: isVi ? "Không có ý tưởng phù hợp." : "No ideas match your filters.",
    minutes: isVi ? "phút" : "min",
    resultCount: isVi ? `${total}/${topicsCount} ý tưởng` : `${total} of ${topicsCount} ideas`,
    showMore: (remaining: number) => (isVi ? `Xem thêm (còn ${remaining})` : `Show more (left ${remaining})`),
  };

  return (
    <section className="mnyt-archive" data-screen-label="Archive">
      <h1 className="mnyt-archive-title">{t.title}</h1>

      {submissions.length > 0 && (
        <div className="mnyt-archive-community">
          <div className="mnyt-archive-community-label">{t.community}</div>
          <div className="mnyt-archive-community-grid">
            {submissions.slice(0, 6).map((sub) => (
              <div key={sub.id} className="mnyt-archive-community-card">
                <div className="mnyt-archive-community-card-head">
                  <span className="mnyt-archive-community-card-category">{sub.category}</span>
                  <span className="mnyt-archive-community-card-status">{t.pending}</span>
                </div>
                <div className="mnyt-archive-community-card-title">{sub.title}</div>
                <div className="mnyt-archive-community-card-hook">{sub.hook}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mnyt-archive-toolbar">
        <div className="mnyt-archive-chip-row">
          <button type="button" className="mnyt-archive-chip" data-active={filterCategory === "all"} onClick={() => setFilterCategory("all")}>
            {t.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className="mnyt-archive-chip"
              data-active={filterCategory === cat.key}
              onClick={() => setFilterCategory(cat.key)}
            >
              {isVi ? cat.name : cat.nameEn || cat.name}
            </button>
          ))}
        </div>
        <Link href={`${MNYT_ROUTES.flashcard}?category=${filterCategory}`} className="mnyt-archive-flashcard-btn">
          {t.flashcardBtn}
        </Link>
      </div>

      <div className="mnyt-archive-chip-row" style={{ marginBottom: 22 }}>
        <button type="button" className="mnyt-archive-chip" data-variant="tool" data-active={filterTool === "all"} onClick={() => setFilterTool("all")}>
          {t.allTools}
        </button>
        {toolNames.map((tool) => (
          <button
            key={tool}
            type="button"
            className="mnyt-archive-chip"
            data-variant="tool"
            data-active={filterTool === tool}
            onClick={() => setFilterTool(tool)}
          >
            {tool}
          </button>
        ))}
      </div>

      <input
        type="search"
        className="mnyt-archive-search"
        aria-label={t.searchPlaceholder}
        placeholder={t.searchPlaceholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <div className="mnyt-archive-diff-row">
        <button type="button" className="mnyt-archive-diff-chip" data-active={filterDiff === "all"} onClick={() => setFilterDiff("all")}>
          {t.allLevels}
        </button>
        {difficulties.map((d) => (
          <button key={d} type="button" className="mnyt-archive-diff-chip" data-active={filterDiff === d} onClick={() => setFilterDiff(d)}>
            {d}
          </button>
        ))}
      </div>

      <div className="mnyt-archive-meta-row">
        <span>{t.resultCount}</span>
        {filtersActive && (
          <button type="button" className="mnyt-archive-clear-btn" onClick={clearFilters}>
            {t.clearFilters}
          </button>
        )}
      </div>

      {hasNoResults && <div className="mnyt-archive-empty">{t.noResults}</div>}

      <div className="mnyt-archive-grid" aria-busy={loading}>
        {items.map((topic) => {
          const badge = completedSet.has(topic.id) ? "✓" : favoriteSet.has(topic.id) ? "★" : "";
          const categoryLabel = isVi ? topic.categoryName : topic.categoryNameEn || topic.categoryName;
          const title = isVi ? topic.title : topic.titleEn || topic.title;
          const hook = isVi ? topic.hook : topic.hookEn || topic.hook;
          return (
            <Link
              key={topic.id}
              href={mnytDetailHref(topic.id)}
              className="mnyt-archive-card"
              style={{ ["--card-accent" as string]: topic.color, ["--card-tint" as string]: `${topic.color}1a` }}
            >
              <div className="mnyt-archive-card-head">
                <span className="mnyt-archive-card-category" style={{ color: topic.color }}>
                  {categoryLabel}
                </span>
                {badge && <span className="mnyt-archive-card-badge">{badge}</span>}
              </div>
              <div className="mnyt-archive-card-title">{title}</div>
              <div className="mnyt-archive-card-hook">{hook}</div>
              <span className="mnyt-archive-card-tag">{topic.difficulty}</span>
              <span className="mnyt-archive-card-tag">
                ~{topic.estMinutes} {t.minutes}
              </span>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button type="button" className="mnyt-archive-load-more-btn" onClick={loadMore} disabled={loadingMore}>
            {t.showMore(total - items.length)}
          </button>
        </div>
      )}
    </section>
  );
}
