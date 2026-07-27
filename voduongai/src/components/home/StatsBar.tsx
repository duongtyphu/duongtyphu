import Image from "next/image";

const STATS = [
  { icon: "/images/landing-preview/icons/stat-prompt.png", num: "200+", label: "Prompt & Template" },
  { icon: "/images/landing-preview/icons/stat-tools.png", num: "50+", label: "AI Tools thực chiến" },
  { icon: "/images/landing-preview/icons/stat-resources.png", num: "100+", label: "Tài liệu & Resources" },
  { icon: "/images/landing-preview/icons/stat-members.png", num: "10,000+", label: "Thành viên học tập" },
  { icon: "/images/landing-preview/icons/stat-support.png", num: "24/7", label: "Companion đồng hành" },
];

/**
 * Straddles the seam between Hero and the section right below it — sits
 * in normal flow, `-translate-y-1/2` shifts it up by half its own height
 * so it stays centered on the boundary regardless of content height.
 * Sized ~30% smaller than the landing-preview original (box/icon/text)
 * per Founder request.
 */
export function StatsBar() {
  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-6xl px-5">
        <div className="-translate-y-1/2">
          <div className="flex flex-wrap justify-between gap-[11px] rounded-xl bg-white px-[17px] py-[14px] shadow-[0_20px_50px_rgba(10,14,40,.18)] sm:px-[28px]">
            {STATS.map(({ icon, num, label }) => (
              <div key={label} className="flex min-w-[105px] flex-1 items-center gap-[10px]">
                <div className="flex h-[35px] w-[35px] shrink-0 items-center justify-center">
                  <Image
                    src={icon}
                    alt=""
                    width={400}
                    height={400}
                    className="h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(15,23,60,.18)]"
                  />
                </div>
                <div>
                  <div className="text-[.88rem] font-extrabold leading-tight text-[#5b21c9]">{num}</div>
                  <div className="mt-0.5 text-[.5rem] font-semibold text-[#5B6B85]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
