import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEcosystemBySlug } from "@/data/portal/ecosystems";
import { getLiveEcosystemArticleBySlug } from "@/lib/portal/live-ecosystem-articles";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

/**
 * Trang chi tiết bài viết "Cập nhật thông tin mới" — 1 route DÙNG CHUNG
 * cho mọi hệ sinh thái/dự án con (không nhân bản theo từng hệ sinh thái),
 * mở khi bấm vào 1 thẻ trong `ArticleTicker`. KHÁC route cũ
 * `/portal/duan-cohoi/bai-viet/[slug]` (đọc `digitalAssetArticles`, dữ
 * liệu khác hẳn, vẫn giữ nguyên không đụng) — route này đọc bảng
 * `ecosystem_articles` mới.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; articleSlug: string }>;
}) {
  const { ecosystemSlug, articleSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  if (!eco) return { title: "Không tìm thấy bài viết" };
  const article = await getLiveEcosystemArticleBySlug(eco.id, articleSlug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || undefined,
  };
}

export default async function EcosystemArticleDetailPage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; articleSlug: string }>;
}) {
  const { ecosystemSlug, articleSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  if (!eco) notFound();

  const article = await getLiveEcosystemArticleBySlug(eco.id, articleSlug);
  if (!article) notFound();

  const subProject = eco.subProjects?.find((p) => p.id === article.subProjectId);
  const backHref = subProject ? `/portal/duan-cohoi/${eco.slug}/${subProject.slug}` : `/portal/duan-cohoi/${eco.slug}`;
  const backLabel = subProject ? subProject.name : eco.name;

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <div className="projects-atmosphere-bg" aria-hidden="true" />
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-3xl p-6 md:p-8 space-y-6">
          <PortalBackLink href={backHref} label={backLabel} tone="light" />

          <article className="card-shine overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {article.imageUrl && (
              <div className="relative h-56 w-full sm:h-72">
                <Image src={article.imageUrl} alt={article.title} fill sizes="100vw" className="object-cover" priority />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-blue">{eco.name}</p>
              <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">{article.title}</h1>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
                {article.content.split("\n\n").map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>

              {article.linkUrl && (
                <div className="mt-8">
                  <a
                    href={article.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                  >
                    {article.linkLabel || "Xem thêm"}
                  </a>
                </div>
              )}
            </div>
          </article>

          <p className="text-xs leading-relaxed text-gray-500">
            Nội dung chỉ nhằm mục đích chia sẻ thông tin, không phải lời khuyên đầu tư hoặc cam kết về lợi nhuận.
          </p>

          <Link href={backHref} className="text-xs font-semibold text-gray-400 transition hover:text-brand-blue">
            ← Quay lại {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
