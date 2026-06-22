const pillars = [
  {
    title: "Học AI đúng cách",
    description:
      "Lộ trình rõ ràng giúp bạn hiểu và ứng dụng AI vào công việc thực tế, không lan man.",
  },
  {
    title: "Xây hệ thống",
    description:
      "Biến kiến thức rời rạc thành quy trình lặp lại được — nội dung, công cụ, tự động hoá.",
  },
  {
    title: "Tạo tài sản số",
    description:
      "Website, thương hiệu cá nhân, sản phẩm số — những thứ tạo ra giá trị lâu dài cho bạn.",
  },
  {
    title: "Affiliate & thu nhập online",
    description:
      "Ứng dụng AI vào Affiliate Marketing để tạo thêm nguồn thu nhập bền vững.",
  },
];

export function Solution() {
  return (
    <section className="bg-brand-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
            4 trụ cột của hệ sinh thái Võ Đương AI
          </h2>
          <p className="mt-3 text-brand-gray-500">
            Mọi nội dung, công cụ và sản phẩm trong Portal đều xoay quanh 4 trụ
            cột này.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="rounded-2xl border border-brand-gray-200 bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-surface text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-brand-navy">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray-500">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
