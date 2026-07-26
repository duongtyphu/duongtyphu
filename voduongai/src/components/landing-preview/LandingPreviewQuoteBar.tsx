const VALUES = [
  { icon: "🧭", title: "Tư duy đúng", desc: "Định hướng rõ ràng" },
  { icon: "📝", title: "Hành động mỗi ngày", desc: "Tiến bộ từng bước" },
  { icon: "🏅", title: "Giá trị thực tế", desc: "Tạo ra kết quả" },
  { icon: "🎗️", title: "Đóng góp cộng đồng", desc: "Lan tỏa và phụng sự" },
];

export function LandingPreviewQuoteBar() {
  return (
    <section id="gia-tri" className="scroll-mt-20 bg-[#F7F8FC] pb-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div
          className="grid gap-8 rounded-3xl p-8 text-white md:grid-cols-[1.1fr_1.6fr] md:items-center md:p-12"
          style={{ background: "linear-gradient(120deg,#0B1140 0%,#171154 100%)" }}
        >
          <div>
            <span className="mb-2.5 block text-[2.6rem] font-extrabold leading-[.6] text-[#7C5CFC]">&ldquo;</span>
            <h3 className="text-[1.25rem] font-bold leading-[1.45] md:text-[1.4rem]">
              Không đo bằng lượng kiến thức;
              <br />
              đo bằng sự chuyển hóa.
            </h3>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {VALUES.map((v) => (
              <li key={v.title} className="text-center">
                <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(124,92,252,.18)] text-xl">
                  {v.icon}
                </div>
                <h5 className="text-[.86rem] font-bold text-white">{v.title}</h5>
                <p className="mt-1 text-[.75rem] text-[#9AA1C7]">{v.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
