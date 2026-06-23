const pillars = [
  {
    title: "AI ứng dụng",
    description:
      "Lộ trình rõ ràng giúp bạn hiểu và ứng dụng AI vào công việc thực tế, không lan man.",
  },
  {
    title: "Affiliate Marketing",
    description:
      "Hệ thống và lộ trình giúp bạn làm Affiliate Marketing có chiến lược, không làm theo cảm tính.",
  },
  {
    title: "Thương hiệu cá nhân",
    description:
      "Xây thương hiệu cá nhân nhất quán — nội dung, hình ảnh và tiếng nói riêng của bạn.",
  },
  {
    title: "Tài sản số",
    description:
      "Website, sản phẩm số, hệ thống tự động — những tài sản tạo ra giá trị lâu dài.",
  },
];

export function Solution() {
  return (
    <section className="py-9 md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base leading-relaxed text-white/70">
            Võ Đương AI gom tài nguyên, công cụ, khóa học, lộ trình và cộng
            đồng vào một hệ sinh thái duy nhất.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-surface text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
