import Image from "next/image";

const FEATURES = [
  {
    icon: "/images/landing-preview/icons/platform-community.png",
    title: "Cộng đồng tích cực",
    desc: "Hơn 10,000+ thành viên cùng học hỏi và hỗ trợ nhau mỗi ngày.",
  },
  {
    icon: "/images/landing-preview/icons/community-knowledge.png",
    title: "Kiến thức chọn lọc",
    desc: "Nội dung chất lượng, được chọn lọc và cập nhật liên tục.",
  },
  {
    icon: "/images/landing-preview/icons/community-companion.png",
    title: "Đồng hành dài hạn",
    desc: "Companion AI và đội ngũ luôn bên bạn trên hành trình phát triển.",
  },
];

export function LandingPreviewCommunity() {
  return (
    <section id="cong-dong" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-stretch gap-11 md:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col justify-center rounded-xl border border-[#ECEDF5] bg-white p-6 shadow-[0_4px_24px_rgba(15,23,60,.06)] md:p-8">
            <h2 className="text-[1.6rem] font-extrabold leading-[1.3] text-[#0B0F2E] md:text-[1.9rem]">
              Hệ sinh thái dành cho người Việt
            </h2>
            <p className="mt-3.5 leading-[1.7] text-[#5B6B85]">
              Kết nối tri thức, công cụ, cơ hội và cộng đồng để cùng nhau phát triển và tạo ra tác động tích cực.
            </p>
            <ul className="mt-[26px] flex flex-col gap-5">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-center gap-3.5">
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center">
                    <Image
                      src={f.icon}
                      alt=""
                      width={400}
                      height={400}
                      className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(91,33,214,.25)]"
                    />
                  </span>
                  <div>
                    <h4 className="text-[.98rem] font-extrabold text-[#0B0F2E]">{f.title}</h4>
                    <p className="mt-1 text-[.86rem] leading-[1.6] text-[#5B6B85]">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-[1.3fr_1fr] gap-2">
            <div className="overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(15,23,60,.06)]">
              <Image
                src="/images/landing-preview/community-main.jpg"
                alt="Cùng nhau học tập, chia sẻ và tạo ra giá trị bền vững"
                width={1100}
                height={734}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex-1 overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(15,23,60,.06)]">
                <Image
                  src="/images/landing-preview/community-workshop.jpg"
                  alt="Hội thảo & Workshop — cập nhật xu hướng AI mới nhất"
                  width={900}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(15,23,60,.06)]">
                <Image
                  src="/images/landing-preview/community-project.jpg"
                  alt="Dự án thực tế — học đi đôi với ứng dụng"
                  width={900}
                  height={450}
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
