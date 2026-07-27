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
          className="grid gap-6 rounded-2xl p-6 text-white md:grid-cols-[1.1fr_1.6fr] md:items-center md:p-8"
          style={{ background: "linear-gradient(120deg,#0B1140 0%,#171154 100%)" }}
        >
          <div>
            <span className="mb-1.5 block text-[2.2rem] font-extrabold leading-[.6] text-[#7C5CFC]">&ldquo;</span>
            <h3 className="text-[1.15rem] font-bold leading-[1.4] md:text-[1.3rem]">
              Không đo bằng lượng <span className="text-[#A78BFA]">kiến thức</span>;
              <br />
              đo bằng sự <span className="text-[#A78BFA]">chuyển hóa</span>.
            </h3>
          </div>
          <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {VALUES.map((v) => (
              <li key={v.title} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFC] text-lg">
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
