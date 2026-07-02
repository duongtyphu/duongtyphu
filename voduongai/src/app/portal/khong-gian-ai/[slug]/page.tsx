import Link from "next/link";
import {
  AI_TOOLS,
  NEED_CATEGORIES,
  AI_ARTICLES,
  AI_PROMPTS,
  PROFESSION_GROUPS,
  type AiTool,
  type AiNeedCategory,
  type AiProfessionGroup,
} from "@/data/khong-gian-ai";

// ─────────────────────────────────────────────
// Shared UI primitives
// ─────────────────────────────────────────────

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-gray-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function PricingBadge({ pricing }: { pricing: AiTool["pricing"] }) {
  const styles: Record<AiTool["pricing"], string> = {
    "Miễn phí": "bg-green-100 text-green-700 border border-green-200",
    Freemium: "bg-blue-100 text-blue-700 border border-blue-200",
    "Trả phí": "bg-orange-100 text-orange-700 border border-orange-200",
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${styles[pricing]}`}>
      {pricing}
    </span>
  );
}

function BadgePill({ badge }: { badge: AiTool["badge"] }) {
  if (!badge) return null;
  const styles: Record<NonNullable<AiTool["badge"]>, string> = {
    "Tôi đang dùng": "bg-violet-100 text-violet-700 border border-violet-200",
    Recommended: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Affiliate: "bg-rose-100 text-rose-700 border border-rose-200",
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[badge]}`}>
      {badge}
    </span>
  );
}

function ArticleCard({ article }: { article: (typeof AI_ARTICLES)[number] }) {
  return (
    <Link
      href={`/portal/khong-gian-ai/bai-viet/${article.slug}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 hover:shadow-md transition group"
    >
      <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5 mb-2">
        {article.category}
      </span>
      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors">
        {article.title}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{article.excerpt}</p>
    </Link>
  );
}

function PromptCard({ prompt }: { prompt: (typeof AI_PROMPTS)[number] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{prompt.title}</h3>
        <span className="shrink-0 text-xs font-medium text-violet-600 bg-violet-50 rounded-full px-2 py-0.5">
          {prompt.category}
        </span>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed mb-4">{prompt.description}</p>
      <pre className="bg-gray-50 rounded-xl p-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono overflow-auto max-h-48 border border-gray-100">
        {prompt.prompt}
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tool Detail Page
// ─────────────────────────────────────────────

function ToolDetailPage({ tool }: { tool: AiTool }) {
  const relatedArticles = AI_ARTICLES.filter((a) => a.relatedToolSlugs.includes(tool.slug));
  const relatedPrompts = AI_PROMPTS.filter((p) => p.toolSlug === tool.slug).slice(0, 3);

  return (
    <div className="rounded-3xl bg-[#F6F7F9] p-6 md:p-8 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Không gian AI", href: "/portal/khong-gian-ai" },
          { label: tool.name },
        ]}
      />

      {/* Hero */}
      <section>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-0.5">
            {tool.category}
          </span>
          <PricingBadge pricing={tool.pricing} />
          {tool.badge && <BadgePill badge={tool.badge} />}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
            {tool.name}
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-4">{tool.tagline}</p>
        <p className="text-sm text-gray-400 mb-5">{tool.pricingNote}</p>

        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          Truy cập {tool.name}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-10 10M7 7h10v10" />
          </svg>
        </a>
      </section>

      {/* Companion Summary */}
      <section className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-800 mb-1">Tóm tắt từ Companion</p>
            <p className="text-sm text-violet-700 leading-relaxed">{tool.companionSummary}</p>
          </div>
        </div>
      </section>

      {/* Giới thiệu */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu về {tool.name}</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Công cụ này là gì?</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tool.name} là một công cụ AI thuộc danh mục <strong>{tool.category}</strong>.{" "}
              {tool.tagline}.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Dành cho ai?</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Phù hợp cho những ai cần {tool.bestFor.slice(0, 2).join(", ").toLowerCase()} và muốn
              tăng hiệu suất công việc với sự hỗ trợ của AI.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Khi nào nên dùng?</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dùng {tool.name} khi bạn cần{" "}
              {tool.bestFor[0]?.toLowerCase() ?? "giải quyết công việc nhanh hơn"} hoặc muốn tiết
              kiệm thời gian với các tác vụ thường ngày.
            </p>
          </div>
        </div>
      </section>

      {/* Phù hợp nhất khi */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Phù hợp nhất khi</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {tool.bestFor.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-3"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hạn chế */}
      {tool.notGoodFor.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hạn chế cần lưu ý</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <ul className="space-y-2">
              {tool.notGoodFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </span>
                  <span className="text-sm text-amber-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Bài viết liên quan */}
      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bài viết liên quan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Prompt gợi ý */}
      {relatedPrompts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prompt gợi ý cho {tool.name}</h2>
          <div className="space-y-4">
            {relatedPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sẵn sàng thử chưa?</h2>
        <p className="text-blue-100 text-sm mb-5">
          Truy cập {tool.name} ngay hôm nay và bắt đầu tăng hiệu suất công việc với AI.
        </p>
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
        >
          Truy cập {tool.name}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-10 10M7 7h10v10" />
          </svg>
        </a>
      </section>

      {/* Bước tiếp theo */}
      <section>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Bước tiếp theo</p>
            <p className="text-sm text-gray-500">Khám phá thêm công cụ và tài nguyên trong Không gian AI</p>
          </div>
          <Link
            href="/portal/khong-gian-ai"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Quay lại hub
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// Need Category Page
// ─────────────────────────────────────────────

function NeedCategoryPage({ category }: { category: AiNeedCategory }) {
  const tools = AI_TOOLS.filter((t) => category.recommendedToolSlugs.includes(t.slug));
  const articles = AI_ARTICLES.filter((a) => a.relatedNeedSlugs.includes(category.slug));
  const prompts = AI_PROMPTS.filter((p) => p.needSlug === category.slug);

  return (
    <div className="rounded-3xl bg-[#F6F7F9] p-6 md:p-8 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Không gian AI", href: "/portal/khong-gian-ai" },
          { label: category.title },
        ]}
      />

      {/* Hero */}
      <section>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{category.emoji}</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                {category.title}
              </span>
            </h1>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">{category.description}</p>
      </section>

      {/* Companion Guide */}
      <section className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-800 mb-1">Hướng dẫn từ Companion</p>
            <p className="text-sm text-violet-700 leading-relaxed">
              Để bắt đầu với <strong>{category.title}</strong>, hãy chọn một công cụ phù hợp bên
              dưới, thử ngay các prompt mẫu, và đọc bài viết hướng dẫn để hiểu quy trình từng
              bước. Bạn không cần dùng tất cả — chỉ cần một công cụ đúng là đủ để bắt đầu.
            </p>
          </div>
        </div>
      </section>

      {/* Các tác vụ */}
      {category.subtasks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Các tác vụ bạn có thể làm</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {category.subtasks.map((task, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Công cụ phù hợp */}
      {tools.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Công cụ phù hợp</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/portal/khong-gian-ai/${tool.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 hover:shadow-md transition group block"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{tool.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <PricingBadge pricing={tool.pricing} />
                    {tool.badge && <BadgePill badge={tool.badge} />}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{tool.tagline}</p>
                <p className="text-xs text-gray-400 italic">{tool.pricingNote}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bài viết liên quan */}
      {articles.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bài viết liên quan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Prompt mẫu */}
      {prompts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prompt mẫu cho {category.title}</h2>
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{category.ctaLabel}</h2>
          <p className="text-blue-100 text-sm">Khám phá thêm tài nguyên và prompt mẫu cho {category.title}</p>
        </div>
        <a
          href={category.ctaHref}
          className="shrink-0 inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
        >
          {category.ctaLabel}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      {/* Bước tiếp theo */}
      <section>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Quay lại Không gian AI</p>
            <p className="text-sm text-gray-500">Khám phá thêm nhu cầu và công cụ khác trong hub</p>
          </div>
          <Link
            href="/portal/khong-gian-ai"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Về hub
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// Profession Detail Page
// ─────────────────────────────────────────────

function ProfessionDetailPage({ profession }: { profession: AiProfessionGroup }) {
  const tools = AI_TOOLS.filter((t) => profession.recommendedToolSlugs.includes(t.slug));

  return (
    <div className="rounded-3xl bg-[#F6F7F9] p-6 md:p-8 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Không gian AI", href: "/portal/khong-gian-ai" },
          { label: profession.title },
        ]}
      />

      {/* Hero */}
      <section>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{profession.emoji}</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                AI cho {profession.title}
              </span>
            </h1>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">{profession.description}</p>
      </section>

      {/* Companion Guide */}
      <section className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-800 mb-1">Hướng dẫn từ Companion</p>
            <p className="text-sm text-violet-700 leading-relaxed">{profession.companionMessage}</p>
          </div>
        </div>
      </section>

      {/* Disclaimer (e.g. Nhà đầu tư) */}
      {profession.disclaimer && (
        <section className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Lưu ý quan trọng</p>
              <p className="text-sm text-amber-800 leading-relaxed">{profession.disclaimer}</p>
            </div>
          </div>
        </section>
      )}

      {/* Nhóm kỹ năng */}
      {profession.skillGroups.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nhóm kỹ năng</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profession.skillGroups.map((skill, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bài viết mẫu */}
      {profession.sampleArticles.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bài viết mẫu</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profession.sampleArticles.map((title, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5 mb-2">
                  Bài viết
                </span>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prompt mẫu */}
      {profession.samplePrompts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prompt mẫu</h2>
          <div className="flex flex-wrap gap-2">
            {profession.samplePrompts.map((title, i) => (
              <span
                key={i}
                className="inline-block text-sm font-medium text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-3.5 py-1.5"
              >
                {title}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Checklist mẫu */}
      {profession.sampleChecklists && profession.sampleChecklists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Checklist mẫu</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <ul className="space-y-2">
              {profession.sampleChecklists.map((title, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Template mẫu */}
      {profession.sampleTemplates && profession.sampleTemplates.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Template mẫu</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <ul className="space-y-2">
              {profession.sampleTemplates.map((title, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* SOP mẫu */}
      {profession.sampleSops && profession.sampleSops.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">SOP mẫu</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <ul className="space-y-2">
              {profession.sampleSops.map((title, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Công cụ AI gợi ý */}
      {tools.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Công cụ AI gợi ý</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/portal/khong-gian-ai/${tool.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 hover:shadow-md transition group block"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{tool.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <PricingBadge pricing={tool.pricing} />
                    {tool.badge && <BadgePill badge={tool.badge} />}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{tool.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {profession.isPremiumDeep ? (
        <section className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Tham gia Premium để mở khóa lộ trình học chuyên sâu
            </h2>
            <p className="text-blue-100 text-sm">Nội dung chuyên sâu dành cho thành viên Premium</p>
          </div>
          <Link
            href="/portal/premium"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Tham gia Premium
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      ) : (
        <section className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Khám phá lộ trình</h2>
            <p className="text-blue-100 text-sm">
              Bắt đầu học AI bài bản theo đúng nhu cầu của {profession.title.toLowerCase()}
            </p>
          </div>
          <Link
            href="/portal/academy"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Khám phá lộ trình
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      )}

      {/* Bước tiếp theo */}
      <section>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Quay lại Không gian AI</p>
            <p className="text-sm text-gray-500">Khám phá thêm nhu cầu và công cụ khác trong hub</p>
          </div>
          <Link
            href="/portal/khong-gian-ai"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Về hub
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// Not Found Page
// ─────────────────────────────────────────────

function NotFoundPage({ slug }: { slug: string }) {
  return (
    <div className="rounded-3xl bg-[#F6F7F9] p-6 md:p-8">
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Không gian AI", href: "/portal/khong-gian-ai" },
          { label: slug },
        ]}
      />
      <div className="text-center py-20">
        <p className="text-6xl mb-6">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Không có công cụ hoặc danh mục nào khớp với <strong>&ldquo;{slug}&rdquo;</strong>.
        </p>
        <Link
          href="/portal/khong-gian-ai"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          Quay lại Không gian AI
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export async function generateStaticParams() {
  const toolSlugs = AI_TOOLS.map((t) => ({ slug: t.slug }));
  const needSlugs = NEED_CATEGORIES.map((c) => ({ slug: c.slug }));
  const professionSlugs = PROFESSION_GROUPS.map((p) => ({ slug: p.slug }));
  return [...toolSlugs, ...needSlugs, ...professionSlugs];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tool = AI_TOOLS.find((t) => t.slug === slug);
  if (tool) return <ToolDetailPage tool={tool} />;

  const category = NEED_CATEGORIES.find((c) => c.slug === slug);
  if (category) return <NeedCategoryPage category={category} />;

  const profession = PROFESSION_GROUPS.find((p) => p.slug === slug);
  if (profession) return <ProfessionDetailPage profession={profession} />;

  return <NotFoundPage slug={slug} />;
}
