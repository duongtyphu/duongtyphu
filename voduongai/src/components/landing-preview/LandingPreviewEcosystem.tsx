import { EcoCapIcon, EcoRobotIcon, EcoBooksIcon, EcoCubeIcon, EcoRocketIcon, EcoDiamondIcon } from "./LandingPreviewIcons";

const ITEMS = [
  { id: "hoc-vien-ai", Icon: EcoCapIcon, title: "Học viện AI" },
  { id: "companion-ai", Icon: EcoRobotIcon, title: "Companion AI" },
  { id: "ckos", Icon: EcoBooksIcon, title: "Hệ tri thức AI (CKOS)" },
  { id: "ai-workspace", Icon: EcoCubeIcon, title: "AI Workspace" },
  { id: "du-an-co-hoi", Icon: EcoRocketIcon, title: "Dự án & Cơ hội" },
  { id: "premium", Icon: EcoDiamondIcon, title: "Premium" },
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
        <div className="flex flex-wrap items-stretch justify-center gap-4 lg:flex-nowrap">
          {ITEMS.map(({ id, Icon, title }) => (
            <div
              id={id}
              key={id}
              className="flex w-[140px] scroll-mt-24 flex-1 flex-col items-center gap-3 rounded-2xl border border-[#ECEDF5] bg-white px-4 py-6 text-center shadow-[0_4px_20px_rgba(15,23,60,.05)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(15,23,60,.10)]"
            >
              <Icon className="h-14 w-14" />
              <h3 className="text-[.84rem] font-bold leading-snug text-[#0B0F2E]">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
