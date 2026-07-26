import Link from "next/link";
import Image from "next/image";

const NODES = [
  { icon: "🎓", label: "Học viện AI", style: "top-5 left-1/2 -translate-x-1/2" },
  { icon: "👥", label: "Cộng đồng", style: "top-[52px] right-2.5" },
  { icon: "🚀", label: "Dự án & Cơ hội", style: "top-[150px] right-0" },
  { icon: "💎", label: "Premium", style: "bottom-14 right-[30px]" },
  { icon: "📍", label: "Hứa hẹn của bạn", style: "bottom-3.5 left-1/2 -translate-x-1/2" },
  { icon: "🧭", label: "Chiến lược cá nhân", style: "bottom-14 left-3.5" },
  { icon: "📔", label: "Nhật ký học tập", style: "top-[150px] left-0" },
  { icon: "🤖", label: "Companion AI", style: "top-[52px] left-1.5" },
];

export function LandingPreviewNetworkFounder() {
  return (
    <section id="instructors" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative h-[340px]" aria-hidden="true">
            <svg viewBox="0 0 400 340" fill="none" className="absolute inset-0 h-full w-full">
              <g stroke="#D7D3F5" strokeWidth="1.5" strokeDasharray="3 4">
                <line x1="200" y1="170" x2="200" y2="40" />
                <line x1="200" y1="170" x2="320" y2="70" />
                <line x1="200" y1="170" x2="345" y2="170" />
                <line x1="200" y1="170" x2="300" y2="270" />
                <line x1="200" y1="170" x2="190" y2="310" />
                <line x1="200" y1="170" x2="90" y2="280" />
                <line x1="200" y1="170" x2="55" y2="170" />
                <line x1="200" y1="170" x2="80" y2="70" />
              </g>
            </svg>
            <div className="absolute left-1/2 top-1/2 z-[2] flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] text-center text-white shadow-[0_12px_28px_rgba(91,33,214,.4)]">
              <span className="text-[1.5rem] font-extrabold">V</span>
              <small className="mt-0.5 text-[.5rem] font-bold tracking-wider">VO DUONG AI</small>
            </div>
            {NODES.map((n) => (
              <div
                key={n.label}
                className={`absolute z-[2] inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#ECEDF5] bg-white px-3.5 py-2 text-[.78rem] font-bold text-[#0B0F2E] shadow-[0_4px_24px_rgba(15,23,60,.06)] ${n.style}`}
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[rgba(124,92,252,.12)] text-[10px]">
                  {n.icon}
                </span>
                {n.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-[22px] rounded-[22px] border border-[#ECEDF5] bg-white p-2 shadow-[0_4px_24px_rgba(15,23,60,.06)]">
            <Image
              src="/images/landing-preview/founder-vo-duong.jpg"
              alt="Võ Dương — Nhà sáng lập VO DUONG AI"
              width={400}
              height={412}
              className="aspect-[1/1.05] w-full rounded-2xl object-cover"
            />
            <div className="py-4 pr-5">
              <h3 className="text-[1.1rem] font-extrabold leading-[1.4] text-[#0B0F2E]">
                &ldquo;AI không thay thế bạn,
                <br />
                Nhưng người biết dùng AI sẽ thay thế bạn.&rdquo;
              </h3>
              <div className="mt-2 text-[.9rem] font-bold text-[#5b21c9]">— Võ Dương</div>
              <p className="mt-2.5 text-[.85rem] leading-[1.65] text-[#5B6B85]">
                Tôi tin rằng AI là công cụ mạnh mẽ nhất của thời đại. Sứ mệnh của tôi là giúp người Việt học AI
                đúng hướng, ứng dụng thực tế và tạo giá trị bền vững.
              </p>
              <Link href="/about" className="mt-3 inline-flex items-center gap-1 text-[.9rem] font-bold text-[#5b21c9]">
                Câu chuyện của tôi
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
