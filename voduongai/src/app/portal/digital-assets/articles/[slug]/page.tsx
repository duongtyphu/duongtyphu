"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  digitalAssetArticles,
  digitalAssetProjects,
  digitalAssetCategories,
  type DigitalAssetArticle,
  type DigitalAssetProject,
} from "@/data/digitalAssets";
import { useCollection } from "@/lib/admin/store";
import { DigitalAssetDisclaimer } from "@/components/portal/DigitalAssetDisclaimer";
import { SaveButton } from "@/components/portal/SaveButton";

export default function DigitalAssetArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items: articles, ready: articlesReady } = useCollection<DigitalAssetArticle>(
    "digital-asset-articles",
    digitalAssetArticles
  );
  const { items: projects } = useCollection<DigitalAssetProject>("digital-asset-projects", digitalAssetProjects);
  const { items: categories } = useCollection("digital-asset-categories", digitalAssetCategories);

  const article = articles.find((a) => a.slug === slug && a.status === "Published");

  if (articlesReady && !article) notFound();
  if (!article) return null;

  const project = projects.find((p) => p.id === article.projectId);
  const category = categories.find((c) => c.key === article.category);

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <div className="digital-asset-article-bg" aria-hidden="true" />

      <div className="relative z-10 space-y-6 px-4 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-between">
          <Link
            href={project ? `/portal/digital-assets/${project.slug}` : "/portal/digital-assets"}
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            ← {project ? project.name : "ĐẦU TƯ CÙNG TÔI"}
          </Link>
          <SaveButton
            item={{
              id: `digital-asset-article_${article.id}`,
              kind: "resource",
              title: article.title,
              href: `/portal/digital-assets/articles/${article.slug}`,
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

        <DigitalAssetDisclaimer />
      </div>
    </div>
  );
}
