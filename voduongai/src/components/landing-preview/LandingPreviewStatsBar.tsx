import Image from "next/image";

const STATS = [
  { icon: "/images/landing-preview/icons/stat-prompt.png", num: "200+", label: "Prompt & Template" },
  { icon: "/images/landing-preview/icons/stat-tools.png", num: "50+", label: "AI Tools thực chiến" },
  { icon: "/images/landing-preview/icons/stat-resources.png", num: "100+", label: "Tài liệu & Resources" },
  { icon: "/images/landing-preview/icons/stat-members.png", num: "10,000+", label: "Thành viên học tập" },
  { icon: "/images/landing-preview/icons/stat-support.png", num: "24/7", label: "Companion đồng hành" },
];

/**
 * Straddles the hero/ecosystem color boundary: this wrapper sits in normal
 * flow right between the two sections, and `-translate-y-1/2` shifts it up
 * by exactly half of its own (dynamic) height — so it always ends up
 * centered on the seam regardless of content/responsive height, no matter
 * how tall the card renders.
 */
export function LandingPreviewStatsBar() {
  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="-translate-y-1/2">
          <div className="flex flex-wrap justify-between gap-4 rounded-xl bg-white px-6 py-5 shadow-[0_20px_50px_rgba(10,14,40,.18)] sm:px-10">
            {STATS.map(({ icon, num, label }) => (
              <div key={label} className="flex min-w-[150px] flex-1 items-center gap-3.5">
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center">
                  <Image
                    src={icon}
                    alt=""
                    width={400}
                    height={400}
                    className="h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(15,23,60,.18)]"
                  />
                </div>
                <div>
                  <div className="text-[1.26rem] font-extrabold leading-tight text-[#5b21c9]">{num}</div>
                  <div className="mt-0.5 text-[.72rem] font-semibold text-[#5B6B85]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
