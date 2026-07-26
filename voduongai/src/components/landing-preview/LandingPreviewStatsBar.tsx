import { StatHeartIcon, StatPuzzleIcon, StatClipboardIcon, StatPeopleIcon, StatClockIcon } from "./LandingPreviewIcons";

const STATS = [
  { Icon: StatHeartIcon, num: "200+", label: "Prompt & Template" },
  { Icon: StatPuzzleIcon, num: "50+", label: "AI Tools thực chiến" },
  { Icon: StatClipboardIcon, num: "100+", label: "Tài liệu & Resources" },
  { Icon: StatPeopleIcon, num: "10,000+", label: "Thành viên học tập" },
  { Icon: StatClockIcon, num: "24/7", label: "Companion đồng hành" },
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
          <div className="flex flex-wrap justify-between gap-4 rounded-[20px] bg-white px-6 py-7 shadow-[0_20px_50px_rgba(10,14,40,.18)] sm:px-10">
            {STATS.map(({ Icon, num, label }) => (
              <div key={label} className="flex min-w-[150px] flex-1 items-center gap-3.5">
                <Icon className="h-[46px] w-[46px] shrink-0" />
                <div>
                  <div className="text-[1.4rem] font-extrabold leading-tight text-[#5b21c9]">{num}</div>
                  <div className="mt-0.5 text-[.8rem] font-semibold text-[#5B6B85]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
