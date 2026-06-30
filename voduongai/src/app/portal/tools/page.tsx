"use client";

import { useState } from "react";
import Link from "next/link";
import { Cpu, Search } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { ToolCard } from "@/components/portal/ToolCard";
import { CompanionGuide } from "@/components/portal/CompanionGuide";

const CATEGORIES = [
  { label: "Tất cả", value: "all" },
  { label: "AI Chat", value: "AI Chat" },
  { label: "AI Hình ảnh", value: "AI Hình ảnh" },
  { label: "AI Video", value: "AI Video" },
  { label: "AI Lập trình", value: "AI Lập trình" },
  { label: "AI Tự động hóa", value: "AI Tự động hóa" },
  { label: "AI Marketing", value: "AI Marketing" },
  { label: "AI Phân tích", value: "AI Phân tích" },
];

export default function AiWorkspacePage() {
  const { items, ready } = useCollection<AdminTool>("tools", toolsAdminSeed);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const published = items
    .filter((t) => t.status === "Published")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const featured = published.filter((t) => t.featured);

  const filtered = published.filter((t) => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.shortDescription ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const showFeatured = activeCategory === "all" && !search && featured.length > 0;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <Cpu className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Không gian AI</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">AI Workspace</h1>
        <p className="max-w-2xl text-white/60">
          Không phải danh sách công cụ. Đây là không gian làm việc với AI — mỗi công cụ được chọn lọc, thử nghiệm thực tế và có hướng dẫn cụ thể để bạn dùng ngay.
        </p>
      </div>

      {/* Companion Guide */}
      <CompanionGuide
        message="Nếu đây là lần đầu bạn khám phá AI, mình gợi ý bắt đầu từ AI Chat — đặc biệt là ChatGPT. Đây là nền tảng giúp bạn hiểu cách tương tác với AI hiệu quả nhất trước khi thử các công cụ chuyên biệt khác."
        action={{ label: "Xem lộ trình học AI", href: "/portal/journey" }}
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          placeholder="Tìm công cụ AI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-brand-violet"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Danh mục</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat.value
                  ? "bg-brand-blue text-white"
                  : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {showFeatured && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">Công cụ nổi bật</p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((t) => (
              <ToolCard
                key={t.id}
                id={t.id}
                href={`/portal/tools/${t.slug}`}
                name={t.name}
                category={t.category}
                description={t.shortDescription}
                useCase={t.useCase}
                pricing={t.pricing}
                iUseThis={t.badge === "Tôi đang dùng"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tool grid */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">
          {search
            ? `Kết quả tìm kiếm (${filtered.length})`
            : activeCategory === "all"
              ? "Tất cả công cụ"
              : CATEGORIES.find((c) => c.value === activeCategory)?.label}
        </p>
        {!ready ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-[20px] bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-sm text-white/40">
            {search ? `Không tìm thấy công cụ nào cho "${search}".` : "Chưa có công cụ trong danh mục này."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((t) => (
              <ToolCard
                key={t.id}
                id={t.id}
                href={`/portal/tools/${t.slug}`}
                name={t.name}
                category={t.category}
                description={t.shortDescription}
                useCase={t.useCase}
                pricing={t.pricing}
                iUseThis={t.badge === "Tôi đang dùng"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Related articles */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div>
          <p className="text-sm font-bold text-white">Bài viết về AI</p>
          <p className="mt-1 text-xs text-white/50">Hướng dẫn, case study và tips thực chiến từ trải nghiệm thực tế</p>
        </div>
        <Link
          href="/portal/news"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
        >
          Xem bài viết →
        </Link>
      </div>
    </div>
  );
}
