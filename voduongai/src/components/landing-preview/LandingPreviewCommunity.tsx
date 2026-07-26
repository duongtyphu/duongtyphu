import Image from "next/image";

const FEATURES = [
  { icon: "👥", title: "Cộng đồng tích cực", desc: "Hơn 10,000+ thành viên cùng học hỏi và hỗ trợ nhau mỗi ngày." },
  { icon: "🎯", title: "Kiến thức chọn lọc", desc: "Nội dung chất lượng, được chọn lọc và cập nhật liên tục." },
  { icon: "🤝", title: "Đồng hành dài hạn", desc: "Companion AI và đội ngũ luôn bên bạn trên hành trình phát triển." },
];

export function LandingPreviewCommunity() {
  return (
    <section id="cong-dong" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-center gap-11 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-[1.6rem] font-extrabold leading-[1.3] text-[#0B0F2E] md:text-[1.9rem]">
              Hệ sinh thái dành cho người Việt
            </h2>
            <p className="mt-3.5 leading-[1.7] text-[#5B6B85]">
              Kết nối tri thức, công cụ, cơ hội và cộng đồng để cùng nhau phát triển và tạo ra tác động tích cực.
            </p>
            <ul className="mt-[26px] flex flex-col gap-5">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-3.5">
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[rgba(124,92,252,.12)] text-lg">
                    {f.icon}
                  </span>
                  <div>
                    <h4 className="text-[.98rem] font-extrabold text-[#0B0F2E]">{f.title}</h4>
                    <p className="mt-1 text-[.86rem] leading-[1.6] text-[#5B6B85]">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-[1.3fr_1fr] gap-4">
            <div className="overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(15,23,60,.06)]">
              <Image
                src="/images/landing-preview/community-main.jpg"
                alt="Cùng nhau học tập, chia sẻ và tạo ra giá trị bền vững"
                width={726}
                height={444}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(15,23,60,.06)]">
                <Image
                  src="/images/landing-preview/community-workshop.jpg"
                  alt="Hội thảo & Workshop — cập nhật xu hướng AI mới nhất"
                  width={591}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(15,23,60,.06)]">
                <Image
                  src="/images/landing-preview/community-project.jpg"
                  alt="Dự án thực tế — học đi đôi với ứng dụng"
                  width={591}
                  height={216}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
