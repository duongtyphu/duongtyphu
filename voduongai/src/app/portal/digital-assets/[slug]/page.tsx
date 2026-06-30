"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  digitalAssetProjects,
  digitalAssetCategories,
  digitalAssetLinks,
  digitalAssetArticles,
  type DigitalAssetProject,
  type DigitalAssetLink,
  type DigitalAssetArticle,
  type DigitalAssetLinkType,
} from "@/data/digitalAssets";
import { useCollection } from "@/lib/admin/store";
import { DigitalAssetProjectCard } from "@/components/portal/DigitalAssetProjectCard";
import { DigitalAssetDisclaimer } from "@/components/portal/DigitalAssetDisclaimer";
import { SaveButton } from "@/components/portal/SaveButton";

const LINK_TYPE_ICON: Record<DigitalAssetLinkType, string> = {
  Website: "🌐",
  Affiliate: "🔗",
  Exchange: "🏦",
  Telegram: "✈️",
  App: "📱",
  Document: "📄",
  Video: "🎬",
  Guide: "📘",
  Community: "👥",
  Other: "🔹",
};

export default function DigitalAssetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items: projects, ready: projectsReady } = useCollection<DigitalAssetProject>(
    "digital-asset-projects",
    digitalAssetProjects
  );
  const { items: categories } = useCollection("digital-asset-categories", digitalAssetCategories);
  const { items: links } = useCollection<DigitalAssetLink>("digital-asset-links", digitalAssetLinks);
  const { items: articles } = useCollection<DigitalAssetArticle>("digital-asset-articles", digitalAssetArticles);

  const project = projects.find((p) => p.slug === slug);

  if (projectsReady && !project) notFound();
  if (!project) return null;

  const category = categories.find((c) => c.key === project.category);
  const projectLinks = links
    .filter((l) => l.projectId === project.id && l.status === "Active")
    .sort((a, b) => a.order - b.order);
  const primaryLink = projectLinks[0];
  const projectArticles = articles.filter((a) => a.projectId === project.id && a.status === "Published");
  const relatedProjects = projects
    .filter((p) => p.category === project.category && p.id !== project.id && p.status === "Published")
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/portal/digital-assets" className="text-sm font-semibold text-brand-blue hover:underline">
          ← ĐẦU TƯ CÙNG TÔI
        </Link>
        <SaveButton
          item={{
            id: `digital-asset_${project.id}`,
            kind: "resource",
            title: project.name,
            href: `/portal/digital-assets/${project.slug}`,
            meta: category?.name,
          }}
        />
      </div>

      {/* Project hero */}
      <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-8">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/90 text-2xl">
            {project.logo}
          </div>
          <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">{project.badge}</span>
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-gray-900">{project.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{category?.name}</p>
        <p className="mt-4 leading-relaxed text-gray-700">{project.shortDescription}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {primaryLink && (
            <a
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Truy cập dự án
            </a>
          )}
          {projectLinks.find((l) => l.type === "Guide" || l.type === "Document") && (
            <a
              href={
                (projectLinks.find((l) => l.type === "Guide" || l.type === "Document") as (typeof projectLinks)[number])
                  .url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:border-brand-violet hover:text-brand-violet"
            >
              Xem hướng dẫn
            </a>
          )}
        </div>
      </div>

      {/* Tổng quan dự án */}
      <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-6">
        <h2 className="text-sm font-bold text-gray-900">Tổng quan dự án</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dự án là gì?</p>
            <p className="mt-1.5 text-sm text-gray-700">{project.whatIsIt}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dự án giải quyết vấn đề gì?</p>
            <p className="mt-1.5 text-sm text-gray-700">{project.problemSolved}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Vì sao tôi quan tâm?</p>
            <p className="mt-1.5 text-sm text-gray-700">{project.whyInterested}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phù hợp với ai?</p>
            <p className="mt-1.5 text-sm text-gray-700">{project.whoForIt}</p>
          </div>
          <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">Những điểm cần lưu ý</p>
            <p className="mt-1.5 text-sm text-gray-700">{project.notes}</p>
          </div>
        </div>
      </div>

      {/* Bài viết / phân tích */}
      {projectArticles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900">Bài viết / Phân tích</h2>
          {projectArticles.map((a) => (
            <div key={a.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-6">
              <Link href={`/portal/digital-assets/articles/${a.slug}`} className="text-sm font-bold text-gray-900 hover:text-brand-blue">
                {a.title}
              </Link>
              <p className="mt-1 text-xs text-gray-400">{a.publishedAt}</p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
                {a.content.split("\n\n").map((para, i) => (
                  <p key={i} className={para.startsWith(">") ? "border-l-2 border-brand-blue/40 pl-3 italic text-gray-500" : ""}>
                    {para.replace(/^>\s*/, "")}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link liên quan */}
      {projectLinks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900">Link liên quan</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {projectLinks.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-shine flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/[0.04] p-4 transition hover:-translate-y-0.5"
              >
                <span className="text-lg">{LINK_TYPE_ICON[l.type]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{l.title}</p>
                    {l.isAffiliate && (
                      <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange">
                        Affiliate
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{l.description}</p>
                  <p className="mt-2 text-xs font-semibold text-brand-blue">{l.ctaText} →</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Dự án liên quan */}
      {relatedProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900">Dự án liên quan</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {relatedProjects.map((p) => (
              <DigitalAssetProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      <DigitalAssetDisclaimer />
    </div>
  );
}
