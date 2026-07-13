"use client";

import { useParams, notFound } from "next/navigation";
import { digitalAssetArticles, digitalAssetCategories, type DigitalAssetArticle } from "@/data/digitalAssets";
import { ecosystems } from "@/data/portal/ecosystems";
import { useCollection } from "@/lib/admin/store";
import { SaveButton } from "@/components/portal/SaveButton";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

/**
 * Bài viết của Dự án & Cơ hội — route thuộc riêng Ecosystem Platform
 * (KHÔNG nằm dưới /portal/digital-assets). Theo yêu cầu Product Owner:
 * từ nay không có trang/mục/bài viết nào của Portal được đi qua đường
 * dẫn /portal/digital-assets nữa — nội dung bài viết vẫn đọc từ cùng
 * dữ liệu thật `digitalAssetArticles`, chỉ đổi route hiển thị.
 */
export default function EcosystemArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items: articles, ready: articlesReady } = useCollection<DigitalAssetArticle>(
    "digital-asset-articles",
    digitalAssetArticles
  );
  const { items: categories } = useCollection("digital-asset-categories", digitalAssetCategories);

  const article = articles.find((a) => a.slug === slug && a.status === "Published");

  if (articlesReady && !article) notFound();
  if (!article) return null;

  const category = categories.find((c) => c.key === article.category);
  const ecosystem = ecosystems.find((e) => e.articleCategory === article.category || e.extraArticleCategories?.includes(article.category));

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      {/* Khí quyển Projects & Opportunities ("Opportunity center") tiếp
       * tục ở trang bài viết — cùng khí quyển với /portal/duan-cohoi. */}
      <div className="projects-atmosphere-bg" aria-hidden="true" />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — cùng khoảng cách với /portal/duan-cohoi. */}
      <div className="rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <PortalBackLink
            href={ecosystem ? `/portal/duan-cohoi/${ecosystem.slug}` : "/portal/duan-cohoi"}
            label={ecosystem ? ecosystem.name : "Dự án & Cơ hội"}
            tone="light"
          />
          <SaveButton
            item={{
              id: `digital-asset-article_${article.id}`,
              kind: "resource",
              title: article.title,
              href: `/portal/duan-cohoi/bai-viet/${article.slug}`,
              meta: category?.name,
            }}
          />
        </div>

        <div className="card-shine rounded-2xl border border-gray-200 bg-white p-8">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-blue">{category?.name}</p>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900">{article.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {article.author} · {article.publishedAt}
          </p>
          <div className="mt-6 space-y-3 text-sm leading-relaxed text-gray-700">
            {article.content.split("\n\n").map((para, i) => (
              <p key={i} className={para.startsWith(">") ? "border-l-2 border-brand-blue/40 pl-3 italic text-gray-500" : ""}>
                {para.replace(/^>\s*/, "")}
              </p>
            ))}
          </div>
          {article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-500">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed text-gray-500">
          Nội dung chỉ nhằm mục đích chia sẻ thông tin và trải nghiệm cá nhân, không phải lời khuyên đầu tư.
        </p>
      </div>
      </div>
    </div>
  );
}
