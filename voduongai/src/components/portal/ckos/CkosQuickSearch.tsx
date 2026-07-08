"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { Button } from "@/components/portal/ui/Button";

// Portal 3.0 P.4 — Quick Search. Reuses the real Phase G.3 foundation
// search endpoint (/api/v1/ckos/search) — this IS the real Search Runtime
// today, at its current foundation-level maturity (in-memory merge, not
// indexed/ranked). Portal 4.0 CKOS Reconstruction: the endpoint now also
// searches the real curated Lesson/Prompt/Workflow/Resource content
// (previously invisible to search — see the route's own comments), and
// every result is now a real link, not a dead-end card.
type SearchResult = {
  type: "goal" | "tool" | "prompt" | "workflow" | "best_practice" | "case_study" | "lesson" | "resource";
  id: string;
  title: string;
  description: string | null;
  href: string;
};

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  goal: "Goal",
  tool: "Công cụ",
  prompt: "Prompt",
  workflow: "Workflow",
  best_practice: "Best Practice",
  case_study: "Case Study",
  lesson: "Lesson",
  resource: "Resource",
};

export function CkosQuickSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/v1/ckos/search?q=${encodeURIComponent(q)}&pageSize=12`);
      const json = res.ok ? await res.json() : { items: [] };
      setResults(json.items ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm trong CKOS — Tool, Prompt, Workflow, Lesson, Resource, Case Study..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-24 text-sm text-gray-700 outline-none focus:border-blue-300"
        />
        <Button type="submit" variant="primary" className="absolute right-1.5 top-1.5 !px-4 !py-1.5 text-xs">
          Tìm
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-400">Đang tìm...</p>
      ) : searched && results ? (
        results.length === 0 ? (
          <GemCard>
            <p className="text-sm text-gray-500">
              Không tìm thấy kết quả cho &ldquo;{query}&rdquo; trong CKOS hiện tại. CKOS vẫn đang được
              bổ sung dữ liệu — thử một từ khoá khác hoặc quay lại sau.
            </p>
          </GemCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <Link key={`${r.type}-${r.id}`} href={r.href} className="block">
                <GemCard className="h-full transition hover:border-blue-200">
                  <GemBadge tone="free">{TYPE_LABEL[r.type]}</GemBadge>
                  <p className="gemos-card-title mt-3 text-sm font-bold text-gray-900">{r.title}</p>
                  {r.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{r.description}</p>
                  ) : null}
                </GemCard>
              </Link>
            ))}
          </div>
        )
      ) : (
        <p className="text-xs text-gray-400">
          Search hiện đang ở mức nền tảng — tìm theo từ khoá xuất hiện trong tiêu đề hoặc mô tả, chưa
          xếp hạng theo mức độ liên quan.
        </p>
      )}
    </div>
  );
}
