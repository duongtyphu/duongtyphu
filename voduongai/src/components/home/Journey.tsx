const milestones = [
  {
    year: "2019",
    title: "Bắt đầu hành trình đầu tư và xây dựng tư duy tài sản số",
  },
  {
    year: "2025",
    title: "Nghiên cứu sâu về AI, Alpha Mind và ứng dụng AI thực chiến",
  },
  {
    year: "2026",
    title: "Xây dựng Võ Đương AI như một hệ sinh thái tài nguyên cá nhân",
  },
  {
    year: "Tương lai",
    title: "Phát triển Portal, cộng đồng, Affiliate Hub và sản phẩm số",
  },
];

export function Journey() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
            Hành trình xây dựng Võ Đương AI
          </h2>
        </div>

        <div className="relative mt-14 ml-3">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-brand-gray-200" />
          <div className="space-y-10">
            {milestones.map((m) => (
              <div key={m.year} className="relative flex items-start gap-6 pl-8">
                <span className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-brand-blue shadow-md shadow-brand-blue/30" />
                <div className="flex-1 rounded-[20px] border border-brand-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                    {m.year}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-brand-gray-700">
                    {m.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
