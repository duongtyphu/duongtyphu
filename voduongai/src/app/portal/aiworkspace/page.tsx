"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, BookOpen, Zap, ArrowRight } from "lucide-react";
import { type AiTool } from "@/data/khong-gian-ai";
import { getLiveTools } from "@/lib/portal/live-tools";
import { getLiveBlogPosts } from "@/lib/portal/live-blog";
import type { BlogPost } from "@/data/blog";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
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
 * Blog AI. AI Toolbox (mục 6) từ Bước C đọc bảng Supabase `tools` qua
 * getLiveTools() (client-side, "use client" ở trên) — không còn dùng mảng
 * tĩnh AI_TOOLS (giữ lại @deprecated phòng rollback, xem
 * src/data/khong-gian-ai/index.ts). Blog AI (mục 8, Việc 7 Nhóm B) đọc
 * bảng `blog` thật qua getLiveBlogPosts() (src/lib/portal/live-blog.ts),
 * không còn dùng AI_ARTICLES.
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
    <div className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <Link href={`/portal/aiworkspace/${tool.slug}`} className="flex flex-col gap-3">
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

function ArticleCard({ article }: { article: BlogPost }) {
  return (
    <Link
      href={`/portal/aiworkspace/bai-viet/${article.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="h-32 w-full rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-indigo-300" />
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">{article.category}</span>
        <span className="text-[10px] text-gray-400">
          {new Date(article.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
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
  const [liveTools, setLiveTools] = useState<AiTool[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getLiveTools().then(setLiveTools);
    getLiveBlogPosts().then(setBlogPosts);
  }, []);

  const featuredTools = liveTools.filter((t) => t.featured);
  // Việc 7 (Nhóm B): bảng blog thật thay AI_ARTICLES. `featured` không có
  // trong BlogPost (fromAdminPost() không mang field này qua — đúng hành
  // vi /blogai đang dùng, không tự mở rộng type dùng chung) nên hiển thị
  // bài mới nhất thay cho lọc "featured" cũ, khớp getLiveBlogPosts() đã
  // order theo created_at desc.
  const featuredArticles = blogPosts.slice(0, 3);

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển riêng của AI Workspace ("Creative studio") kéo full-bleed
       * hết chiều rộng cột nội dung — cùng khuôn với Premium, không còn
       * khung rounded-3xl thu hẹp. */}
      <div className="workspace-atmosphere-bg" aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây (rounded-3xl
       * p-6 md:p-8), chỉ khí quyển nền phía sau mới full-bleed. */}
      <div className="rounded-3xl p-6 md:p-8 space-y-10">
      <PortalBackLink href="/portal/ckos" label="Hệ tri thức AI (CKOS)" tone="light" />
      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      {/* Nền gradient đậm cùng khuôn dải hero màu của các pillar khác (Học
       * viện tri thức AI tone "knowledge", Học viện AI tone "learning" — xem
       * `PillarHero`'s TONE_GRADIENT), nhưng dùng gradient THƯƠNG HIỆU
       * Companion (#111827 → #2563EB → #7C3AED → #F97316 — cùng gradient chữ
       * "Companion" ở sidebar và hero /portal/su-menh-companion) để AI
       * Workspace có màu riêng, không trùng tone pillar nào. Chữ trắng thay
       * cho GradientTitle (gradient chữ bắt đầu từ màu tối, không đọc được
       * trên nền tối này); riêng chữ "AI" giữ màu cam thương hiệu #F97316. */}
      <section
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #111827 0%, #2563EB 40%, #7C3AED 72%, #F97316 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        />
        <p className="relative text-xs font-bold uppercase tracking-widest text-white/70">AI Workspace</p>
        <h1 className="relative text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
          <span style={{ color: "#F97316" }}>AI</span> Workspace
        </h1>
        <p className="relative text-base font-semibold text-white/95">
          Nơi Companion và đội ngũ AI hỗ trợ bạn biến mục tiêu thành kết quả.
        </p>
        <p className="relative text-base text-white/85 max-w-2xl leading-relaxed">
          Bạn không cần bắt đầu bằng việc chọn công cụ AI. Hãy bắt đầu bằng việc bạn muốn làm gì.
          Companion sẽ giúp bạn chọn đúng công cụ, đúng Prompt, đúng quy trình và đưa kết quả về
          Không gian làm việc.
        </p>
        <div className="relative flex flex-col gap-3 pt-1 sm:flex-row">
          <a
            href="#companion-desk"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow hover:bg-white/90 transition"
          >
            Bắt đầu cùng Companion <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#ai-toolbox"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
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
          <Link href="/portal/aiworkspace#ai-toolbox" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
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
            <ArticleCard key={article.slug} article={article} />
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
            href="/portal/aiworkspace/bai-viet/lo-trinh-hoc-ai-cho-nguoi-moi-bat-dau"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 transition"
          >
            Đọc lộ trình miễn phí
          </Link>
        </div>
      </section>
      </div>
      </div>
    </div>
  );
}
