import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/blog";
import { Breadcrumb } from "@/components/site/Breadcrumb";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const title = post?.title ?? "Blog AI";
  const description = post?.excerpt ?? "Blog VO DUONG AI chia sẻ kiến thức ứng dụng AI và Affiliate Marketing.";
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { title, description },
  };
}

function ContentBlock({ block }: { block: string }) {
  if (block.startsWith("### ")) {
    return <h3 className="mt-6 text-base font-bold text-white">{block.slice(4)}</h3>;
  }
  if (block.startsWith("## ")) {
    return <h2 className="mt-8 text-xl font-extrabold text-white">{block.slice(3)}</h2>;
  }
  if (block.startsWith("> ")) {
    return (
      <div className="mt-6 rounded-xl border border-brand-violet/30 bg-brand-violet/10 p-4 text-sm text-white">
        {block.slice(2)}
      </div>
    );
  }
  if (block.startsWith("- ")) {
    const items = block.split("\n").map((line) => line.replace(/^- /, ""));
    return (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-white">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="mt-4 leading-relaxed text-white">{block}</p>;
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Blog AI", href: "/blog" },
          { label: post.title },
        ]}
      />

      <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-brand-violet hover:underline">
        ← Blog AI
      </Link>

      <div className="mt-6">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white">
          {post.tag}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-white">{post.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-xs text-white">
          <span>VO DUONG AI</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      <div className="mt-8">
        {post.content.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="card-shine mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-base font-bold text-white">{post.ctaTitle}</h3>
          <p className="mt-2 text-sm text-white">{post.ctaDescription}</p>
          <Link
            href={post.ctaHref}
            className="mt-4 inline-block text-sm font-semibold text-brand-violet hover:underline"
          >
            {post.ctaLabel}
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-bold text-white">Bài viết liên quan</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand-violet"
              >
                <div className="text-xs text-white">{p.category} · {p.readTime}</div>
                <h4 className="mt-2 text-sm font-bold text-white">{p.title}</h4>
                <span className="mt-3 inline-block text-sm font-semibold text-brand-violet">
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
