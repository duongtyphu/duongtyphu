const roles = [
  "Content Creator",
  "AI Educator",
  "Affiliate Marketer",
  "Digital Builder",
  "Founder VDAI Academy",
];

export function About() {
  return (
    <section className="bg-brand-navy py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center">
        <div className="relative">
          <div className="aspect-square w-full max-w-sm rounded-3xl gradient-surface opacity-90" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Về Võ Đương AI
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">
            Tôi xây dựng Võ Đương AI để chia sẻ những công cụ, tài liệu và hệ
            thống AI mà tôi đã dùng để học nhanh hơn, làm việc hiệu quả hơn và
            tạo thêm thu nhập online. Mục tiêu của tôi là giúp bạn không chỉ
            biết về AI, mà thực sự ứng dụng được AI để tạo ra giá trị bền
            vững.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {roles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
