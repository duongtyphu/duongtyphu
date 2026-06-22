export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-extrabold text-brand-navy">Blog</h1>
      <p className="mt-4 text-brand-gray-500">
        Bài viết về AI, Affiliate Marketing và xây dựng tài sản số sẽ được cập
        nhật tại đây.
      </p>
      <div className="mt-10 rounded-2xl border border-dashed border-brand-gray-200 bg-brand-gray-50 p-10 text-center text-sm text-brand-gray-500">
        Chưa có bài viết nào. Quay lại sau nhé.
      </div>
    </section>
  );
}
