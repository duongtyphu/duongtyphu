import Image from "next/image";

const ITEMS = [
  {
    id: "hoc-vien-ai",
    icon: "/images/landing-preview/icons/eco-hoc-vien-ai.png",
    title: "Học viện AI",
    desc: "Lộ trình bài bản từ cơ bản đến nâng cao, học đi đôi với thực hành.",
  },
  {
    id: "companion-ai",
    icon: "/images/landing-preview/icons/eco-companion-ai.png",
    title: "Companion AI",
    desc: "AI Mentor cá nhân hóa, hiểu bạn, nhớ bạn và đồng hành cùng bạn mỗi ngày.",
  },
  {
    id: "ckos",
    icon: "/images/landing-preview/icons/eco-ckos.png",
    title: "Hệ tri thức AI (CKOS)",
    desc: "Thư viện tri thức chọn lọc, cập nhật liên tục, sẵn sàng cho mọi nhu cầu.",
  },
  {
    id: "ai-workspace",
    icon: "/images/landing-preview/icons/eco-ai-workspace.png",
    title: "AI Workspace",
    desc: "Nơi bạn thực hành, lưu trữ và triển khai ý tưởng thành sản phẩm thực tế.",
  },
  {
    id: "du-an-co-hoi",
    icon: "/images/landing-preview/icons/eco-du-an-co-hoi.png",
    title: "Dự án & Cơ hội",
    desc: "Cơ hội hợp tác, đầu tư và đồng hành trong các dự án công nghệ AI.",
  },
  {
    id: "premium",
    icon: "/images/landing-preview/icons/eco-premium.png",
    title: "Premium",
    desc: "Nội dung chuyên sâu, công cụ cao cấp và tư vấn 1:1 cùng chuyên gia.",
  },
];

export function LandingPreviewEcosystem() {
  return (
    <section id="ecosystem" className="bg-[#F7F8FC] pb-20 pt-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto mb-10 max-w-[760px] text-center">
          <h2 className="text-[1.4rem] font-extrabold tracking-[-.3px] text-[#0B0F2E] md:text-[1.6rem]">
            Tất cả những gì bạn cần, trong một hệ sinh thái
          </h2>
        </div>
        <div className="flex flex-wrap items-stretch justify-center gap-4 xl:flex-nowrap">
          {ITEMS.map(({ id, icon, title, desc }) => (
            <div
              id={id}
              key={id}
              className="flex w-[200px] scroll-mt-24 flex-1 flex-col items-center gap-3 rounded-2xl border border-[#ECEDF5] bg-white px-5 py-7 text-center shadow-[0_4px_20px_rgba(15,23,60,.05)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(15,23,60,.10)]"
            >
              <div className="flex h-[77px] w-[77px] items-center justify-center">
                <Image
                  src={icon}
                  alt={title}
                  width={400}
                  height={400}
                  className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(15,23,60,.22)]"
                />
              </div>
              <h3 className="text-[.9rem] font-bold leading-snug text-[#0B0F2E]">{title}</h3>
              <p className="text-[.78rem] leading-[1.55] text-[#5B6B85]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
