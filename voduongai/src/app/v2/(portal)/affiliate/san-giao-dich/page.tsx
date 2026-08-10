import Link from "next/link";
import { ExternalLink, Wallet } from "lucide-react";

import { Card, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { listAffiliatePrograms } from "@/lib/v2/data/commerce";

export const metadata = { title: "Affilate sàn giao dịch" };

export default async function SanGiaoDichPage() {
  const programs = await listAffiliatePrograms();
  const visible = programs.filter((program) => program.visible);

  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-extrabold">Affilate sàn giao dịch</h1>
          <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
            Các chương trình đối tác trong hệ sinh thái bạn có thể tham gia giới thiệu.
          </p>
        </div>
        <IcoBox
          icon={Wallet}
          size="xl"
          background="linear-gradient(145deg,#3ecf7e,#189a52)"
          color="#fff"
          className="max-[900px]:hidden"
        />
      </div>

      <section>
        <SectionHead title={`${visible.length} chương trình đang mở`} />
        <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
          {visible.map((program) => (
            <Card key={program.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-bold">{program.name}</h3>
                <Badge tone="green">{program.commission}</Badge>
              </div>
              <p className="text-[13px] leading-[1.55] text-[var(--v2-muted)]">
                {program.description}
              </p>
              <Link
                href={program.signupUrl}
                className="mt-auto flex items-center gap-2 self-start rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] px-4 py-2 text-[12.5px] font-bold text-white hover:brightness-110"
              >
                <ExternalLink className="h-[14px] w-[14px]" aria-hidden="true" />
                Tham gia
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
