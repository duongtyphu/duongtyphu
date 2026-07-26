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
        <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:gap-x-10 lg:flex-nowrap lg:justify-between">
          {ITEMS.map(({ id, Icon, title }) => (
            <div id={id} key={id} className="flex w-[110px] scroll-mt-24 flex-col items-center text-center">
              <Icon className="h-16 w-16 transition-transform hover:-translate-y-1" />
              <h3 className="mt-3 text-[.84rem] font-bold leading-snug text-[#0B0F2E]">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
