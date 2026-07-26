import Link from "next/link";
import Image from "next/image";

const STEPS = [
  {
    icon: "/images/landing-preview/icons/roadmap-khoi-dau.png",
    title: "Khởi đầu",
    desc: "Hiểu AI là gì, tư duy đúng và chọn hướng đi phù hợp.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-hoc-thuc-hanh.png",
    title: "Học & Thực hành",
    desc: "Học kiến thức cốt lõi, thực hành với công cụ thực chiến.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-ung-dung-xay-dung.png",
    title: "Ứng dụng & Xây dựng",
    desc: "Ứng dụng vào công việc, xây hệ thống & sản phẩm của riêng bạn.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-phat-trien-mo-rong.png",
    title: "Phát triển & Mở rộng",
    desc: "Mở rộng thương hiệu, tự động hóa và tối ưu hiệu quả.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-tao-gia-tri-tai-san.png",
    title: "Tạo giá trị & Tài sản",
    desc: "Tạo thu nhập bền vững, đóng góp giá trị cho cộng đồng.",
  },
];

export function LandingPreviewRoadmap() {
  return (
    <section className="bg-[#F7F8FC] pb-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex flex-col justify-center rounded-xl border border-[#ECEDF5] bg-white p-8 shadow-[0_4px_24px_rgba(15,23,60,.06)] lg:w-[300px] lg:shrink-0 lg:p-9">
            <h2 className="text-[1.5rem] font-extrabold leading-[1.3] text-[#0B0F2E] md:text-[1.65rem]">
              Lộ trình học tập dành cho mọi người
            </h2>
            <p className="mt-3.5 text-[.92rem] leading-[1.7] text-[#5B6B85]">
              Dù bạn là người mới bắt đầu hay đã có kinh nghiệm, chúng tôi có lộ trình phù hợp để bạn tiến xa
              hơn mỗi ngày.
            </p>
            <Link
              href="/login"
              className="mt-[22px] inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#DADCF0] bg-white px-6 py-3.5 text-[.95rem] font-bold text-[#0B0F2E] transition-colors hover:border-[#7C5CFC] hover:text-[#5b21c9]"
            >
              Xem tất cả lộ trình
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="flex-1 rounded-xl border border-[#ECEDF5] bg-white p-8 shadow-[0_4px_24px_rgba(15,23,60,.06)] lg:p-11">
            <div className="relative grid h-full grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:items-start">
              <div className="absolute left-[10%] right-[10%] top-[18px] hidden h-[2px] bg-[#ECEDF5] lg:block" />
              {STEPS.map((s, i) => (
                <div key={s.title} className="relative z-[1] px-1.5 text-center">
                  <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#7C5CFC] text-[.9rem] font-extrabold text-white">
                    {i + 1}
                  </div>
                  <div className="mx-auto mb-2.5 flex h-14 w-14 items-center justify-center">
                    <Image
                      src={s.icon}
                      alt={s.title}
                      width={400}
                      height={400}
                      className="h-full w-full object-contain drop-shadow-[0_6px_12px_rgba(15,23,60,.15)]"
                    />
                  </div>
                  <h4 className="text-[.92rem] font-extrabold text-[#0B0F2E]">{s.title}</h4>
                  <p className="mt-2 text-[.78rem] leading-[1.55] text-[#5B6B85]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
