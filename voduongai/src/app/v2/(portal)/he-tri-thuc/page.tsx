import { BookOpen, Clock, Lock } from "lucide-react";

import { Card, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatDate } from "@/lib/v2/data/client";
import { listKnowledge } from "@/lib/v2/data/catalog";

export const metadata = { title: "Hệ tri thức (CKOS)" };

export default async function HeTriThucPage() {
  const entries = await listKnowledge();
  const categories = Array.from(new Set(entries.map((entry) => entry.category)));

  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-extrabold">Hệ tri thức (CKOS)</h1>
          <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
            Thư viện tri thức và công cụ AI chuẩn hoá được chọn lọc, cập nhật liên tục, sẵn sàng cho
            mọi nhu cầu.
          </p>
        </div>
        <IcoBox
          icon={BookOpen}
          size="xl"
          background="linear-gradient(145deg,#4bc4e0,#0e7490)"
          color="#fff"
          className="max-[900px]:hidden"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-[9px] bg-[var(--v2-violet)] px-[13px] py-2 text-[12.5px] font-bold text-white">
          Tất cả
        </span>
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-[9px] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-[13px] py-2 text-[12.5px] font-semibold text-[var(--v2-muted)]"
          >
            {category}
          </span>
        ))}
      </div>

      <section>
        <SectionHead title={`${entries.length} tài liệu`} />
        <div className="grid grid-cols-1 gap-[14px] min-[760px]:grid-cols-2 min-[1300px]:grid-cols-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <Badge>{entry.category}</Badge>
                {entry.isPremium ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--v2-gold)]">
                    <Lock className="h-[12px] w-[12px]" aria-hidden="true" />
                    Premium
                  </span>
                ) : null}
              </div>

              <div>
                <h3 className="text-[14px] leading-[1.35] font-bold">{entry.title}</h3>
                <p className="mt-1 text-[12px] leading-[1.5] text-[var(--v2-muted)]">
                  {entry.summary}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-1 text-[11.5px] text-[var(--v2-muted)]">
                <span className="flex items-center gap-1">
                  <Clock className="h-[13px] w-[13px]" aria-hidden="true" />
                  {entry.readMinutes} phút đọc
                </span>
                <span>Cập nhật {formatDate(entry.updatedAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
