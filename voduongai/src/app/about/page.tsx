export const metadata = { title: "About" };

const roles = [
  "Content Creator",
  "AI Educator",
  "Affiliate Marketer",
  "Digital Builder",
  "Founder VDAI Academy",
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-extrabold text-brand-navy">Về Võ Đương AI</h1>
      <p className="mt-6 leading-relaxed text-brand-gray-700">
        Tôi xây dựng Võ Đương AI để chia sẻ những công cụ, tài liệu và hệ
        thống AI mà tôi đã dùng để học nhanh hơn, làm việc hiệu quả hơn và tạo
        thêm thu nhập online. Mục tiêu của tôi là giúp bạn không chỉ biết về
        AI, mà thực sự ứng dụng được AI để tạo ra giá trị bền vững — cho công
        việc, cho thương hiệu cá nhân và cho thu nhập của chính bạn.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {roles.map((r) => (
          <span
            key={r}
            className="rounded-full border border-brand-gray-200 bg-brand-gray-50 px-4 py-1.5 text-xs font-medium text-brand-gray-700"
          >
            {r}
          </span>
        ))}
      </div>
    </section>
  );
}
