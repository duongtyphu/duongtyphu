import { Clock, NotebookPen, Smile } from "lucide-react";

import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatDate } from "@/lib/v2/data/client";
import { listJournalEntries } from "@/lib/v2/data/catalog";

export const metadata = { title: "Nhật ký học tập" };

export default async function NhatKyHocTapPage() {
  const entries = await listJournalEntries();
  const totalMinutes = entries.reduce((sum, entry) => sum + entry.minutesLearned, 0);
  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)));

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Nhật ký học tập</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Ghi lại điều bạn học được mỗi ngày — thứ bạn viết ra là thứ bạn thực sự nhớ.
            </p>
          </div>
          <IcoBox
            icon={NotebookPen}
            size="xl"
            background="linear-gradient(145deg,#8b6bff,#5a37e6)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <Card>
          <CardHead title="Viết mục mới" />
          <textarea
            rows={3}
            placeholder="Hôm nay bạn học được điều gì?"
            aria-label="Nội dung nhật ký mới"
            className="w-full resize-y rounded-[var(--v2-radius-sm)] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-3 py-[10px] text-[13px] outline-none focus:border-[var(--v2-violet)]"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] px-5 py-[10px] text-[13px] font-bold text-white hover:brightness-110"
            >
              Lưu mục nhật ký
            </button>
          </div>
        </Card>

        <section>
          <SectionHead title={`${entries.length} mục gần đây`} />
          <div className="flex flex-col gap-[14px]">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-bold text-[var(--v2-muted)]">
                    {formatDate(entry.date)}
                  </span>
                  {entry.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <h3 className="mb-2 text-[15px] font-bold">{entry.title}</h3>
                <p className="text-[13px] leading-[1.6] text-[var(--v2-muted)]">{entry.content}</p>
                <div className="mt-3 flex gap-4 text-[11.5px] text-[var(--v2-muted)]">
                  <span className="flex items-center gap-[6px]">
                    <Clock className="h-[13px] w-[13px]" aria-hidden="true" />
                    {entry.minutesLearned} phút
                  </span>
                  <span className="flex items-center gap-[6px]">
                    <Smile className="h-[13px] w-[13px]" aria-hidden="true" />
                    {entry.mood}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead title="Tuần này" />
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              { label: "Mục đã ghi", value: String(entries.length) },
              { label: "Tổng thời gian", value: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}p` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[10px] bg-[var(--v2-bg)] p-[10px] text-center">
                <div className="text-[15px] font-extrabold">{stat.value}</div>
                <div className="mt-[2px] text-[10.5px] text-[var(--v2-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Thẻ phân loại" />
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
