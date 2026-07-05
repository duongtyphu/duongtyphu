import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/data/blog";
import { AI_ARTICLES } from "@/data/khong-gian-ai";

export async function generateStaticParams() {
  return AI_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Không gian AI — VO DUONG AI`,
    description: post.excerpt,
  };
}

function ContentBlock({ block }: { block: string }) {
  if (block.startsWith("### ")) {
    return <h3 className="mt-6 text-base font-bold text-gray-900">{block.slice(4)}</h3>;
  }
  if (block.startsWith("## ")) {
    return <h2 className="mt-8 text-xl font-extrabold text-gray-900">{block.slice(3)}</h2>;
  }
  if (block.startsWith("> ")) {
    return (
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-gray-700">
        {block.slice(2)}
      </div>
    );
  }
  if (block.startsWith("- ")) {
    const items = block.split("\n").map((line) => line.replace(/^- /, ""));
    return (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="mt-4 leading-relaxed text-gray-700">{block}</p>;
}

export default async function PortalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = AI_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal" className="hover:text-blue-600 transition-colors">Học viện</Link>
        <span className="text-gray-300">/</span>
        <Link href="/portal/aiworkspace" className="hover:text-blue-600 transition-colors">Không gian AI</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-900 line-clamp-1">{post.title}</span>
      </nav>

      <Link href="/portal/aiworkspace" className="inline-block text-sm font-semibold text-blue-600 hover:underline">
        ← Không gian AI
      </Link>

      {/* Header */}
      <div className="mt-6">
        <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600">
          {post.tag}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">{post.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span>VO DUONG AI</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {post.content.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="text-base font-bold text-gray-900">{post.ctaTitle}</h3>
          <p className="mt-2 text-sm text-gray-600">{post.ctaDescription}</p>
          <Link
            href={post.ctaHref}
            className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {post.ctaLabel}
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900">Bài viết liên quan</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/portal/aiworkspace/bai-viet/${a.slug}`}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">{a.category}</div>
                <h4 className="mt-2 text-sm font-bold text-gray-900">{a.title}</h4>
                <span className="mt-3 inline-block text-sm font-semibold text-blue-600">
                  Đọc bài viết →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
