"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, BookOpen, Zap, ArrowRight } from "lucide-react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import {
  type AiNeedCategory,
  type AiProfessionGroup,
  type AiTool,
  type AiArticle,
  NEED_CATEGORIES,
  PROFESSION_GROUPS,
  AI_TOOLS,
  AI_ARTICLES,
} from "@/data/khong-gian-ai";

// ─── Category color map ───────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
  red:    { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-100" },
  green:  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  slate:  { bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-600",   border: "border-cyan-100" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-600",   border: "border-teal-100" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
};

// ─── Tool category badge color ────────────────────────────────────────────────
const TOOL_CAT_COLOR: Record<string, string> = {
  "AI Chat":        "bg-blue-100 text-blue-700",
  "AI Hình ảnh":    "bg-purple-100 text-purple-700",
  "AI Video":       "bg-red-100 text-red-700",
  "AI Lập trình":   "bg-green-100 text-green-700",
  "AI Tự động hóa": "bg-orange-100 text-orange-700",
  "AI Marketing":   "bg-pink-100 text-pink-700",
  "AI Phân tích":   "bg-cyan-100 text-cyan-700",
  "AI Dịch thuật":  "bg-teal-100 text-teal-700",
};

// ─── Badge ────────────────────────────────────────────────────────────────────
function BadgeChip({ label }: { label: string }) {
  if (label === "Tôi đang dùng") {
    return (
      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
        Tôi đang dùng
      </span>
    );
  }
  if (label === "Recommended") {
    return (
      <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
        Recommended
      </span>
    );
  }
  if (label === "Affiliate") {
    return (
      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
        Affiliate
      </span>
    );
  }
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
      {children}
    </p>
  );
}

function NeedCategoryCard({ category }: { category: AiNeedCategory }) {
  const colors = COLOR_MAP[category.color] ?? COLOR_MAP.blue;
  return (
    <Link
      href={`/portal/khong-gian-ai/${category.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${colors.bg}`}>
        {category.emoji}
      </div>
      <div>
        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
          {category.title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {category.description}
        </p>
      </div>
      <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600">
        {category.ctaLabel} <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

function ProfessionCard({ profession }: { profession: AiProfessionGroup }) {
  return (
    <Link
      href={`/portal/khong-gian-ai/${profession.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-2xl">
        {profession.emoji}
      </div>
      <div>
        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
          {profession.title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {profession.description}
        </p>
      </div>
      <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600">
        Xem AI phù hợp <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

function ToolCard({ tool }: { tool: AiTool }) {
  const catColor = TOOL_CAT_COLOR[tool.category] ?? "bg-gray-100 text-gray-700";
  return (
    <Link
      href={`/portal/khong-gian-ai/${tool.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-bold text-blue-700">
          {tool.name.charAt(0)}
        </div>
        {tool.badge && <BadgeChip label={tool.badge} />}
      </div>
      <div>
        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
          {tool.name}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {tool.tagline}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${catColor}`}>
          {tool.category}
        </span>
        <span className="text-[10px] text-gray-400">{tool.pricing}</span>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: AiArticle }) {
  return (
    <Link
      href={`/portal/khong-gian-ai/bai-viet/${article.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Thumbnail placeholder */}
      <div className="h-32 w-full rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-indigo-300" />
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
          {article.category}
        </span>
        <span className="text-[10px] text-gray-400">
          {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>
      <p className="font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition line-clamp-2">
        {article.title}
      </p>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
      <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600">
        Đọc bài viết <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

// ─── Learning path cards ──────────────────────────────────────────────────────
const NEXT_STEPS = [
  {
    icon: "💬",
    title: "Bắt đầu với AI Chat",
    description: "ChatGPT, Claude hoặc Gemini — chọn một công cụ và thực hành ngay hôm nay.",
    href: "/portal/khong-gian-ai/chatgpt",
    cta: "Xem hướng dẫn ChatGPT",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "✍️",
    title: "Học viết Prompt hiệu quả",
    description: "Prompt tốt = kết quả tốt hơn gấp 3 lần. Đây là kỹ năng quan trọng nhất.",
    href: "/portal/khong-gian-ai/viet-noi-dung",
    cta: "Xem Prompt mẫu",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: "⚙️",
    title: "Tự động hóa quy trình",
    description: "Kết nối AI với các công cụ khác để tiết kiệm hàng giờ mỗi ngày.",
    href: "/portal/khong-gian-ai/tu-dong-hoa",
    cta: "Khám phá n8n và Make",
    color: "from-orange-500 to-orange-600",
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function KhongGianAiPage() {
  const [query, setQuery] = useState("");

  const featuredTools = AI_TOOLS.filter((t) => t.featured);
  const featuredArticles = AI_ARTICLES.filter((a) => a.featured);

  // Filter by search
  const filteredNeeds = query
    ? NEED_CATEGORIES.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()) ||
          c.subtasks.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      )
    : NEED_CATEGORIES;

  const filteredTools = query
    ? featuredTools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.tagline.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : featuredTools;

  const filteredArticles = query
    ? featuredArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : featuredArticles;

  const hasResults = filteredNeeds.length > 0 || filteredTools.length > 0 || filteredArticles.length > 0;

  return (
    <div className="rounded-3xl p-6 md:p-8 space-y-10">
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal" className="hover:text-gray-700 transition">
          Portal
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium">Không gian AI</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-3">
        <SectionLabel>AI Workspace</SectionLabel>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 tracking-tight">
          Không gian{" "}
          <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
          Khám phá công cụ AI, prompt mẫu và hướng dẫn thực chiến — được tổ chức theo nhu cầu
          công việc và nghề nghiệp của bạn. Bắt đầu từ nơi bạn đang đứng, đi theo tốc độ của
          riêng bạn.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {AI_TOOLS.length} công cụ AI
          </span>
          <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            {AI_ARTICLES.length} bài viết
          </span>
          <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {NEED_CATEGORIES.length} nhu cầu công việc
          </span>
        </div>
      </section>

      {/* ── Companion Guide ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <CompanionGuide
          message="Nếu bạn mới bắt đầu học AI, mình gợi ý bắt đầu từ AI Chat. Sau đó hãy khám phá Prompt và AI Tự động hóa."
          action={{ label: "Xem lộ trình học AI", href: "/portal/khong-gian-ai/bai-viet/lo-trinh-hoc-ai-cho-nguoi-moi-bat-dau" }}
        />
      </div>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hôm nay bạn muốn AI giúp gì?"
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-5 text-base text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 transition"
          >
            Xóa
          </button>
        )}
      </div>

      {/* ── No search results ──────────────────────────────────────────────── */}
      {query && !hasResults && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center text-gray-500">
          <p className="text-lg font-semibold text-gray-700">Không tìm thấy kết quả</p>
          <p className="mt-1 text-sm">
            Thử từ khóa khác hoặc{" "}
            <button
              onClick={() => setQuery("")}
              className="font-semibold text-blue-600 hover:underline"
            >
              xem tất cả
            </button>
            .
          </p>
        </div>
      )}

      {/* ── Theo nhu cầu công việc ─────────────────────────────────────────── */}
      {filteredNeeds.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <SectionLabel>Danh mục nhu cầu</SectionLabel>
              <h2 className="text-xl font-bold text-gray-900">Theo nhu cầu công việc</h2>
            </div>
            {!query && (
              <Link
                href="/portal/khong-gian-ai/tat-ca"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Xem tất cả <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredNeeds.map((cat) => (
              <NeedCategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* ── AI theo nghề nghiệp ────────────────────────────────────────────── */}
      {!query && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <SectionLabel>Theo nghề nghiệp</SectionLabel>
              <h2 className="text-xl font-bold text-gray-900">AI theo nghề nghiệp</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {PROFESSION_GROUPS.map((prof) => (
              <ProfessionCard key={prof.slug} profession={prof} />
            ))}
          </div>
        </section>
      )}

      {/* ── AI nổi bật ─────────────────────────────────────────────────────── */}
      {filteredTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <SectionLabel>Công cụ AI</SectionLabel>
              <h2 className="text-xl font-bold text-gray-900">AI nổi bật</h2>
            </div>
            {!query && (
              <Link
                href="/portal/khong-gian-ai/cong-cu"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Tất cả công cụ <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ── Bài viết AI mới ────────────────────────────────────────────────── */}
      {filteredArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <SectionLabel>Blog AI</SectionLabel>
              <h2 className="text-xl font-bold text-gray-900">Bài viết AI mới</h2>
            </div>
            {!query && (
              <Link
                href="/blog"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Xem tất cả bài viết <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── Bước tiếp theo ─────────────────────────────────────────────────── */}
      {!query && (
        <section className="space-y-4">
          <div className="space-y-0.5">
            <SectionLabel>Lộ trình học AI</SectionLabel>
            <h2 className="text-xl font-bold text-gray-900">Bước tiếp theo</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {NEXT_STEPS.map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Gradient accent bar */}
                <div
                  className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${step.color}`}
                />
                <div className="mb-3 text-3xl">{step.icon}</div>
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{step.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                  {step.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      {!query && (
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 shadow-sm text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
              <Zap className="h-6 w-6 text-gray-900" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900">
              Muốn học AI có hệ thống hơn?
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Khoá học VDAI SOLO hướng dẫn từng bước — từ AI Chat đến Prompt và Tự động hóa — với
              ví dụ thực chiến phù hợp với người Việt.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/solo"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-600 transition"
            >
              Xem khoá học VDAI SOLO <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portal/khong-gian-ai/bai-viet/lo-trinh-hoc-ai-cho-nguoi-moi-bat-dau"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 transition"
            >
              Đọc lộ trình miễn phí
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
