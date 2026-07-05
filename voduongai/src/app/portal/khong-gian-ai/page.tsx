"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, BookOpen, Zap, ArrowRight } from "lucide-react";
import {
  type AiTool,
  type AiArticle,
  AI_TOOLS,
  AI_ARTICLES,
} from "@/data/khong-gian-ai";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";
import {
  CompanionDesk,
  RecommendedWorkspaceSection,
  AiWorkflowSection,
  PromptLibrarySection,
  ResourceSection,
} from "@/components/portal/ai-space/AiSpaceSections";

/**
 * EPIC 02 — Content Audit sprint: Kiến trúc AI Workspace = LÀM/THỰC HÀNH.
 * "Theo nhu cầu công việc" và "Lộ trình học AI" đã chuyển sang Học viện AI
 * (xem docs/AI_WORKSPACE_ACADEMY_CONTENT_AUDIT.md). Kiến trúc hiện tại:
 * Hero → Companion Desk → Workspace đề xuất → Quy trình AI theo công việc →
 * Prompt Library → AI Toolbox theo nhiệm vụ → Tài nguyên thực hành →
 * Blog AI. AI_TOOLS/AI_ARTICLES cũ vẫn dùng nguyên — không xoá dữ liệu cũ.
 */

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

function BadgeChip({ label }: { label: string }) {
  if (label === "Tôi đang dùng") {
    return <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">Tôi đang dùng</span>;
  }
  if (label === "Recommended") {
    return <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">Recommended</span>;
  }
  if (label === "Affiliate") {
    return <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">Affiliate</span>;
  }
  return null;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{children}</p>;
}

function ToolCard({ tool }: { tool: AiTool }) {
  const router = useRouter();
  const catColor = TOOL_CAT_COLOR[tool.category] ?? "bg-gray-100 text-gray-700";
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/portal/khong-gian-ai/${tool.slug}`} className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-bold text-blue-700">
            {tool.name.charAt(0)}
          </div>
          {tool.badge && <BadgeChip label={tool.badge} />}
        </div>
        <div>
          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{tool.name}</p>
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">{tool.tagline}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${catColor}`}>{tool.category}</span>
          <span className="text-[10px] text-gray-400">{tool.pricing}</span>
        </div>
      </Link>
      <button
        type="button"
        onClick={() =>
          router.push(startCompanionWorkspace({ source: "toolbox", itemId: tool.slug, itemType: "tool", title: tool.name }))
        }
        className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
      >
        Dùng cùng Companion <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ArticleCard({ article }: { article: AiArticle }) {
  return (
    <Link
      href={`/portal/khong-gian-ai/bai-viet/${article.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="h-32 w-full rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-indigo-300" />
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">{article.category}</span>
        <span className="text-[10px] text-gray-400">
          {new Date(article.publishedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </span>
      </div>
      <p className="font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition line-clamp-2">{article.title}</p>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
      <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600">
        Đọc bài viết <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

export default function KhongGianAiPage() {
  const featuredTools = AI_TOOLS.filter((t) => t.featured);
  const featuredArticles = AI_ARTICLES.filter((a) => a.featured);

  return (
    <div className="rounded-3xl p-6 md:p-8 space-y-10">
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal" className="hover:text-gray-700 transition">Portal</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium">Không gian AI</span>
      </nav>

      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-4">
        <SectionLabel>AI Workspace</SectionLabel>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 tracking-tight">
          AI{" "}
          <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
            Workspace
          </span>
        </h1>
        <p className="text-base font-semibold text-gray-700">
          Học thật. Thực hành thật. Tạo kết quả thật cùng Companion.
        </p>
        <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
          Bạn không cần bắt đầu bằng việc chọn công cụ AI. Hãy bắt đầu bằng việc bạn muốn làm gì.
          Companion sẽ giúp bạn chọn đúng công cụ, đúng Prompt, đúng quy trình và đưa kết quả về
          Workspace.
        </p>
        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <a
            href="#companion-desk"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-600 transition"
          >
            Bắt đầu cùng Companion <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#ai-toolbox"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 transition"
          >
            Khám phá công cụ AI
          </a>
        </div>
      </section>

      {/* ── 2. Companion Desk ─────────────────────────────────────────────── */}
      <CompanionDesk />

      {/* ── 3. Workspace đề xuất ───────────────────────────────────────────── */}
      <RecommendedWorkspaceSection />

      {/* ── 4. Quy trình AI theo công việc ──────────────────────────────────── */}
      <AiWorkflowSection />

      {/* ── 5. Prompt Library ──────────────────────────────────────────────── */}
      <PromptLibrarySection />

      {/* ── 6. AI Toolbox theo nhiệm vụ (dữ liệu cũ, đổi tên hiển thị) ──────── */}
      <section id="ai-toolbox" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <SectionLabel>Công cụ AI</SectionLabel>
            <h2 className="text-xl font-bold text-gray-900">AI Toolbox theo nhiệm vụ</h2>
          </div>
          <Link href="/portal/khong-gian-ai/cong-cu" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            Tất cả công cụ <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── 7. Tài nguyên thực hành ──────────────────────────────────────────── */}
      <ResourceSection />

      {/* ── 8. Blog AI (dữ liệu cũ, đưa xuống cuối) ────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <SectionLabel>Blog AI</SectionLabel>
            <h2 className="text-xl font-bold text-gray-900">Bài viết AI mới</h2>
          </div>
          <Link href="/blogai" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            Xem tất cả bài viết <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 shadow-sm text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <Zap className="h-6 w-6 text-gray-900" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900">Muốn học AI có hệ thống hơn?</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Khoá học VDAI SOLO hướng dẫn từng bước — từ AI Chat đến Prompt và Tự động hóa — với ví
            dụ thực chiến phù hợp với người Việt.
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
    </div>
  );
}
