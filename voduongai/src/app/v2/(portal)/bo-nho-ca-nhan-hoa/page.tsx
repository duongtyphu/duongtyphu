import { Brain, Pin, Trash2 } from "lucide-react";

import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatDate } from "@/lib/v2/data/client";
import { listMemoryCapsules } from "@/lib/v2/data/companion";

export const metadata = { title: "Bộ nhớ & Cá nhân hoá" };

export default async function BoNhoPage() {
  const capsules = await listMemoryCapsules();
  const pinned = capsules.filter((capsule) => capsule.pinned);
  const rest = capsules.filter((capsule) => !capsule.pinned);

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Bộ nhớ & Cá nhân hoá</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Đây là toàn bộ những gì Companion đang nhớ về bạn. Bạn xem được, sửa được và xoá được
              bất cứ lúc nào.
            </p>
          </div>
          <IcoBox
            icon={Brain}
            size="xl"
            background="linear-gradient(145deg,#8b6bff,#5a37e6)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        {pinned.length > 0 ? (
          <section>
            <SectionHead title="Đã ghim" />
            <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
              {pinned.map((capsule) => (
                <MemoryCard key={capsule.id} capsule={capsule} />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <SectionHead title="Bộ nhớ khác" />
          <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
            {rest.map((capsule) => (
              <MemoryCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead title="Quyền kiểm soát" />
          <p className="mb-3 text-[12.5px] leading-[1.6] text-[var(--v2-muted)]">
            Companion chỉ ghi nhớ những gì bạn chủ động chia sẻ. Xoá một mục ở đây là xoá thật —
            không giữ bản sao ngầm.
          </p>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[var(--v2-radius-sm)] border border-[var(--v2-line)] p-[10px] text-[12.5px] font-bold text-[var(--v2-red)] hover:bg-[#fdeef0]"
          >
            <Trash2 className="h-[14px] w-[14px]" aria-hidden="true" />
            Xoá toàn bộ bộ nhớ
          </button>
        </Card>

        <Card>
          <CardHead title="Thống kê" />
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              { label: "Mục bộ nhớ", value: String(capsules.length) },
              { label: "Đã ghim", value: String(pinned.length) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[10px] bg-[var(--v2-bg)] p-[10px] text-center">
                <div className="text-[15px] font-extrabold">{stat.value}</div>
                <div className="mt-[2px] text-[10.5px] text-[var(--v2-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

function MemoryCard({
  capsule,
}: {
  capsule: Awaited<ReturnType<typeof listMemoryCapsules>>[number];
}) {
  return (
    <Card>
      <div className="mb-2 flex items-start justify-between gap-3">
        <Badge>{capsule.category}</Badge>
        {capsule.pinned ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--v2-gold)]">
            <Pin className="h-[12px] w-[12px]" aria-hidden="true" />
            Đã ghim
          </span>
        ) : null}
      </div>
      <h3 className="mb-2 text-[14px] font-bold">{capsule.label}</h3>
      <p className="text-[13px] leading-[1.6] text-[var(--v2-muted)]">{capsule.content}</p>
      <div className="mt-3 text-[11px] text-[var(--v2-muted)]">
        Cập nhật {formatDate(capsule.updatedAt)}
      </div>
    </Card>
  );
}
