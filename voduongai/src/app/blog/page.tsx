import { blogPosts } from "@/data/blog";
import { BlogList } from "./BlogList";

const title = "Blog AI";
const description = "Blog VO DUONG AI chia sẻ kiến thức ứng dụng AI, Affiliate Marketing và tự động hóa cho cá nhân và đội nhóm.";

export const metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-extrabold text-white">Blog AI</h1>
      <p className="mt-4 text-white">
        Kiến thức thực chiến về ứng dụng AI trong Affiliate Marketing, tự động
        hoá quy trình và xây dựng hệ thống kinh doanh số.
      </p>
      <BlogList posts={blogPosts} />
    </section>
  );
}
