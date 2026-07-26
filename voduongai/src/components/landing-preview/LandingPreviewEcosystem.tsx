import Link from "next/link";

const CARDS = [
  { id: "hoc-vien-ai", icon: "🎓", title: "Học viện AI", desc: "Lộ trình bài bản từ cơ bản đến nâng cao, học đi đôi với thực hành.", cta: "Khám phá", href: "/login" },
  { id: "companion-ai", icon: "🤖", title: "Companion AI", desc: "AI Mentor cá nhân hóa, hiểu bạn, nhớ bạn và đồng hành cùng bạn mỗi ngày.", cta: "Trò chuyện ngay", href: "/login" },
  { id: "ckos", icon: "📚", title: "Hệ tri thức AI (CKOS)", desc: "Thư viện tri thức chọn lọc, cập nhật liên tục, sẵn sàng cho mọi nhu cầu.", cta: "Khám phá", href: "/blogai" },
  { id: "ai-workspace", icon: "🧊", title: "AI Workspace", desc: "Nơi bạn thực hành, lưu trữ và triển khai ý tưởng thành sản phẩm thực tế.", cta: "Truy cập", href: "/login" },
  { id: "du-an-co-hoi", icon: "🚀", title: "Dự án & Cơ hội", desc: "Cơ hội hợp tác, đầu tư và đồng hành trong các dự án công nghệ AI.", cta: "Xem ngay", href: "/login" },
  { id: "premium", icon: "💎", title: "Premium", desc: "Nội dung chuyên sâu, công cụ cao cấp và tư vấn 1:1 cùng chuyên gia.", cta: "Tìm hiểu", href: "/login" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LandingPreviewEcosystem() {
  return (
    <section id="ecosystem" className="bg-[#F7F8FC] py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto mb-12 max-w-[760px] text-center">
          <h2 className="text-[1.7rem] font-extrabold tracking-[-.4px] text-[#0B0F2E] md:text-[2rem]">
            Tất cả những gì bạn cần, trong một hệ sinh thái
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.id}
              id={c.id}
              className="scroll-mt-24 rounded-[18px] border border-[#ECEDF5] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,60,.10)]"
            >
              <div className="mb-4 text-[2.4rem] leading-none">{c.icon}</div>
              <h3 className="mb-2 text-[1.05rem] font-extrabold text-[#0B0F2E]">{c.title}</h3>
              <p className="min-h-[78px] text-[.86rem] leading-[1.6] text-[#5B6B85]">{c.desc}</p>
              <Link href={c.href} className="group mt-3.5 inline-flex items-center gap-1 text-[.9rem] font-bold text-[#5b21c9]">
                {c.cta} <ArrowIcon />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
